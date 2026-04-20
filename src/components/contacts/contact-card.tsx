import Link from "next/link";
import { MapPinned, MessageCircle, Phone } from "lucide-react";
import { formatDate, fromNow } from "@/lib/format";
import type { Contact } from "@/types/domain";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GapBadge } from "@/components/ui/status-badge";
import { buttonClassName } from "@/components/ui/button";

export function ContactCard({ contact }: { contact: Contact }) {
  const primaryLocation = contact.locations.find((location) => location.isPrimary) ?? contact.locations[0];
  const navigateHref = primaryLocation
    ? `https://www.google.com/maps/search/?api=1&query=${primaryLocation.latitude},${primaryLocation.longitude}`
    : "#";
  const whatsappHref = contact.whatsapp
    ? `https://wa.me/${contact.whatsapp.replace(/\D/g, "")}`
    : "#";

  return (
    <Card className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Link href={`/app/contacts/${contact.id}`} className="font-heading text-2xl font-semibold text-khidkee-earth">
              {contact.name}
            </Link>
            <GapBadge gapLevel={contact.gapLevel} />
          </div>
          <p className="mt-1 text-sm text-khidkee-earth/70">{contact.nameHi || "Hindi name can be added here."}</p>
          <p className="mt-2 text-sm leading-6 text-khidkee-earth/72">
            {contact.village}, {contact.panchayat}, {contact.block}
          </p>
        </div>
        <Badge variant="neutral">{contact.visitCount} visits</Badge>
      </div>

      <div className="flex flex-wrap gap-2">
        {contact.tags.map((tag) => (
          <Badge key={tag} variant="blue">
            {tag}
          </Badge>
        ))}
      </div>

      <p className="text-sm leading-6 text-khidkee-earth/76">
        {contact.daysSinceLastVisit === null
          ? `${contact.name} has not had a logged visit yet.`
          : `Last visit was ${formatDate(contact.lastVisitAt)}. That was ${fromNow(contact.lastVisitAt)}.`}
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        <Link href={`/app/contacts/${contact.id}`} className={buttonClassName("outline")}>
          Open profile
        </Link>
        <a href={contact.phone ? `tel:${contact.phone}` : "#"} className={buttonClassName("soft")}>
          <Phone className="mr-2 h-4 w-4" />
          Call
        </a>
        <a href={whatsappHref} className={buttonClassName("soft")}>
          <MessageCircle className="mr-2 h-4 w-4" />
          WhatsApp
        </a>
        <a href={navigateHref} className={buttonClassName("soft")}>
          <MapPinned className="mr-2 h-4 w-4" />
          Navigate
        </a>
      </div>
    </Card>
  );
}
