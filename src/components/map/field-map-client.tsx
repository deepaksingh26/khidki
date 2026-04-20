"use client";

import { Circle, MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { divIcon } from "leaflet";

type MapPoint = {
  id: string;
  label: string;
  latitude: number;
  longitude: number;
  description?: string;
  tone?: "saffron" | "green" | "red" | "blue";
};

type FieldMapClientProps = {
  points: MapPoint[];
  center: { latitude: number; longitude: number };
  radiusKm?: number;
  height?: number;
};

const toneColor = {
  saffron: "#FF6B00",
  green: "#2D6A2D",
  red: "#C0392B",
  blue: "#0A4BA0"
} as const;

function markerIcon(color: string) {
  return divIcon({
    className: "",
    html: `<div style="width:18px;height:18px;border-radius:999px;background:${color};border:3px solid white;box-shadow:0 10px 24px rgba(28,15,0,0.25);"></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9]
  });
}

export default function FieldMapClient({ points, center, radiusKm, height = 420 }: FieldMapClientProps) {
  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-khidkee-earth/10">
      <MapContainer
        center={[center.latitude, center.longitude]}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height, width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {radiusKm ? (
          <Circle
            center={[center.latitude, center.longitude]}
            radius={radiusKm * 1000}
            pathOptions={{ color: "#FF6B00", fillColor: "#FF6B00", fillOpacity: 0.08 }}
          />
        ) : null}
        {points.map((point) => (
          <Marker
            key={point.id}
            position={[point.latitude, point.longitude]}
            icon={markerIcon(toneColor[point.tone ?? "blue"])}
          >
            <Popup>
              <div className="space-y-1">
                <p className="font-semibold text-khidkee-earth">{point.label}</p>
                {point.description ? <p className="text-sm text-khidkee-earth/70">{point.description}</p> : null}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

