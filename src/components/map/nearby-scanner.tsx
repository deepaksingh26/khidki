"use client";

import { useDeferredValue, useState } from "react";
import { Filter, LocateFixed } from "lucide-react";
import { useCurrentLocation } from "@/hooks/use-current-location";
import { useOfflineSnapshot } from "@/hooks/use-offline-snapshot";
import { formatDistanceMeters } from "@/lib/format";
import { haversineDistanceMeters } from "@/lib/geo";
import type { Contact } from "@/types/domain";
import { FieldMap } from "@/components/map/field-map";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";

type NearbyScannerProps = {
  contacts: Contact[];
  seedLocation: { latitude: number; longitude: number } | null;
};

export function NearbyScanner({ contacts, seedLocation }: NearbyScannerProps) {
  const [radiusKm, setRadiusKm] = useState(3);
  const [selectedTag, setSelectedTag] = useState("all");
  const locationState = useCurrentLocation(seedLocation);
  const currentLocation = locationState.location ?? seedLocation;
  const deferredTag = useDeferredValue(selectedTag);

  const availableTags = Array.from(new Set(contacts.flatMap((contact) => contact.tags))).sort();

  const nearbyContacts = contacts
    .map((contact) => {
      const primaryLocation = contact.locations.find((location) => location.isPrimary) ?? contact.locations[0];
      const distanceMeters =
        currentLocation && primaryLocation
          ? haversineDistanceMeters(currentLocation, {
              latitude: primaryLocation.latitude,
              longitude: primaryLocation.longitude
            })
          : null;

      return {
        ...contact,
        distanceMeters,
        primaryLocation
      };
    })
    .filter((contact) => (deferredTag === "all" ? true : contact.tags.includes(deferredTag)))
    .filter((contact) => (contact.distanceMeters ?? Number.POSITIVE_INFINITY) <= radiusKm * 1000)
    .sort((left, right) => (left.distanceMeters ?? Number.POSITIVE_INFINITY) - (right.distanceMeters ?? Number.POSITIVE_INFINITY));

  const savedAt = useOfflineSnapshot(
    "map",
    nearbyContacts.map((contact) => ({
      id: contact.id,
      distanceMeters: contact.distanceMeters,
      latitude: contact.primaryLocation?.latitude,
      longitude: contact.primaryLocation?.longitude
    }))
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-5">
        <Card className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-khidkee-saffron">Nearby scan</p>
              <h3 className="mt-2 font-heading text-3xl font-semibold text-khidkee-earth">Who is close enough to reach now?</h3>
            </div>
            <Badge variant="blue">
              <LocateFixed className="mr-2 h-4 w-4" />
              {locationState.status === "ready"
                ? "Using current location"
                : locationState.status === "locating"
                  ? "Locating you"
                  : "Using saved center"}
            </Badge>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-medium text-khidkee-earth">Radius</span>
              <Select value={String(radiusKm)} onChange={(event) => setRadiusKm(Number(event.target.value))}>
                <option value="1">1 km</option>
                <option value="2">2 km</option>
                <option value="3">3 km</option>
                <option value="5">5 km</option>
                <option value="8">8 km</option>
              </Select>
            </label>
            <label className="space-y-2">
              <span className="inline-flex items-center gap-2 text-sm font-medium text-khidkee-earth">
                <Filter className="h-4 w-4" />
                Filter by tag
              </span>
              <Select value={selectedTag} onChange={(event) => setSelectedTag(event.target.value)}>
                <option value="all">All tags</option>
                {availableTags.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </Select>
            </label>
          </div>

          <p className="text-sm text-khidkee-earth/70">
            {nearbyContacts.length} contacts are inside the current ring.
            {savedAt ? ` Offline-ready snapshot refreshed at ${new Date(savedAt).toLocaleTimeString()}.` : ""}
          </p>
        </Card>

        {currentLocation ? (
          <FieldMap
            center={currentLocation}
            radiusKm={radiusKm}
            points={nearbyContacts
              .filter((contact) => contact.primaryLocation)
              .map((contact) => ({
                id: contact.id,
                label: contact.name,
                latitude: contact.primaryLocation!.latitude,
                longitude: contact.primaryLocation!.longitude,
                description: `${contact.village}, ${contact.panchayat}`,
                tone:
                  contact.gapLevel === "critical"
                    ? "red"
                    : contact.gapLevel === "high_priority"
                      ? "saffron"
                      : contact.gapLevel === "attention_needed"
                        ? "blue"
                        : "green"
              }))}
          />
        ) : (
          <Card>
            <p className="text-sm leading-6 text-khidkee-earth/72">
              Turn on location sharing to see the live scan around you. Until then, Khidkee can still work from the saved field center.
            </p>
          </Card>
        )}
      </div>

      <div className="space-y-4">
        {nearbyContacts.map((contact) => (
          <Card key={contact.id} className="space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-heading text-2xl font-semibold text-khidkee-earth">{contact.name}</p>
                <p className="text-sm text-khidkee-earth/72">
                  {contact.village}, {contact.panchayat}
                </p>
              </div>
              <Badge variant="neutral">{formatDistanceMeters(contact.distanceMeters)}</Badge>
            </div>
            <div className="flex flex-wrap gap-2">
              {contact.tags.map((tag) => (
                <Badge key={tag} variant="blue">
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="flex gap-3">
              <Button variant="soft" className="flex-1" onClick={() => window.open(`/app/contacts/${contact.id}`, "_self")}>
                Open
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() =>
                  contact.primaryLocation
                    ? window.open(
                        `https://www.google.com/maps/search/?api=1&query=${contact.primaryLocation.latitude},${contact.primaryLocation.longitude}`,
                        "_blank"
                      )
                    : undefined
                }
              >
                Navigate
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

