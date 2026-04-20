"use client";

import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { saveContactAction } from "@/lib/actions";
import { contactFormSchema, type ContactFormValues } from "@/lib/validators";
import type { Contact } from "@/types/domain";
import { FormMessage } from "@/components/forms/form-message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type ContactFormProps = {
  contact?: Contact | null;
};

function defaultValues(contact?: Contact | null): ContactFormValues {
  const primaryLocation = contact?.locations.find((location) => location.isPrimary) ?? contact?.locations[0];

  return {
    id: contact?.id ?? "",
    name: contact?.name ?? "",
    nameHi: contact?.nameHi ?? "",
    phone: contact?.phone ?? "",
    whatsapp: contact?.whatsapp ?? "",
    village: contact?.village ?? "",
    panchayat: contact?.panchayat ?? "",
    block: contact?.block ?? "",
    district: contact?.district ?? "",
    tagsInput: contact?.tags.join(", ") ?? "",
    notes: contact?.notes ?? "",
    lastVisitAt: contact?.lastVisitAt ?? "",
    latitude: primaryLocation ? String(primaryLocation.latitude) : "",
    longitude: primaryLocation ? String(primaryLocation.longitude) : "",
    locationLabel: primaryLocation?.label ?? "Primary"
  };
}

export function ContactForm({ contact }: ContactFormProps) {
  const router = useRouter();
  const [result, setResult] = useState<{ tone: "success" | "error"; message: string } | null>(null);
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: defaultValues(contact)
  });

  return (
    <form
      className="space-y-5"
      onSubmit={handleSubmit((values) => {
        startTransition(async () => {
          const response = await saveContactAction(values);
          setResult({
            tone: response.success ? "success" : "error",
            message: response.message
          });
          if (response.redirectTo) {
            router.push(response.redirectTo as Route);
          }
        });
      })}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-medium text-khidkee-earth">Full name</span>
          <Input {...register("name")} placeholder="Who are you adding?" />
          {errors.name ? <p className="text-sm text-khidkee-red">{errors.name.message}</p> : null}
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-khidkee-earth">Hindi name</span>
          <Input {...register("nameHi")} placeholder="हिंदी नाम" />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-khidkee-earth">Phone</span>
          <Input {...register("phone")} placeholder="+91" />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-khidkee-earth">WhatsApp</span>
          <Input {...register("whatsapp")} placeholder="+91" />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-khidkee-earth">Village</span>
          <Input {...register("village")} placeholder="Free text village name" />
          {errors.village ? <p className="text-sm text-khidkee-red">{errors.village.message}</p> : null}
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-khidkee-earth">Panchayat</span>
          <Input {...register("panchayat")} placeholder="Panchayat name" />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-khidkee-earth">Block</span>
          <Input {...register("block")} placeholder="Block" />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-khidkee-earth">District</span>
          <Input {...register("district")} placeholder="District" />
        </label>
        <label className="space-y-2 sm:col-span-2">
          <span className="text-sm font-medium text-khidkee-earth">Tags</span>
          <Input {...register("tagsInput")} placeholder="farmer, women-leader, health" />
        </label>
        <label className="space-y-2 sm:col-span-2">
          <span className="text-sm font-medium text-khidkee-earth">Notes</span>
          <Textarea {...register("notes")} placeholder="What should the next field worker know before they arrive?" />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-khidkee-earth">Last visit date</span>
          <Input {...register("lastVisitAt")} placeholder="2026-04-13T10:00:00Z" />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-khidkee-earth">Location label</span>
          <Input {...register("locationLabel")} placeholder="Home, centre, school gate" />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-khidkee-earth">Latitude</span>
          <Input {...register("latitude")} placeholder="25.7207" />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-khidkee-earth">Longitude</span>
          <Input {...register("longitude")} placeholder="85.4047" />
        </label>
      </div>
      {result ? <FormMessage tone={result.tone} message={result.message} /> : null}
      <Button type="submit" variant="secondary" disabled={isPending}>
        {isPending ? "Saving this contact..." : contact ? "Save changes" : "Add contact"}
      </Button>
    </form>
  );
}
