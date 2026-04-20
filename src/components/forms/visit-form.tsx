"use client";

import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { saveVisitAction } from "@/lib/actions";
import { visitFormSchema, type VisitFormValues } from "@/lib/validators";
import type { Contact } from "@/types/domain";
import { FormMessage } from "@/components/forms/form-message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export function VisitForm({ contacts, contactId }: { contacts: Contact[]; contactId?: string | null }) {
  const router = useRouter();
  const [result, setResult] = useState<{ tone: "success" | "error"; message: string } | null>(null);
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit
  } = useForm<VisitFormValues>({
    resolver: zodResolver(visitFormSchema),
    defaultValues: {
      id: "",
      contactId: contactId ?? "",
      visitedAt: new Date().toISOString(),
      village: "",
      panchayat: "",
      durationMins: "",
      outcome: "",
      notes: "",
      latitude: "",
      longitude: ""
    }
  });

  return (
    <form
      className="space-y-4"
      onSubmit={handleSubmit((values) => {
        startTransition(async () => {
          const response = await saveVisitAction(values);
          setResult({
            tone: response.success ? "success" : "error",
            message: response.message
          });
          if (response.redirectTo) router.push(response.redirectTo as Route);
        });
      })}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-medium text-khidkee-earth">Linked contact</span>
          <Select {...register("contactId")}>
            <option value="">Area visit without linked contact</option>
            {contacts.map((contact) => (
              <option key={contact.id} value={contact.id}>
                {contact.name}
              </option>
            ))}
          </Select>
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-khidkee-earth">Visited at</span>
          <Input {...register("visitedAt")} placeholder="2026-04-13T10:00:00Z" />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-khidkee-earth">Village</span>
          <Input {...register("village")} placeholder="Village name" />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-khidkee-earth">Panchayat</span>
          <Input {...register("panchayat")} placeholder="Panchayat" />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-khidkee-earth">Duration in minutes</span>
          <Input {...register("durationMins")} placeholder="45" />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-khidkee-earth">Outcome</span>
          <Input {...register("outcome")} placeholder="What moved forward today?" />
        </label>
        <label className="space-y-2 sm:col-span-2">
          <span className="text-sm font-medium text-khidkee-earth">Notes</span>
          <Textarea {...register("notes")} placeholder="Capture the field texture while it is still fresh." />
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
        {isPending ? "Logging visit..." : "Log visit"}
      </Button>
    </form>
  );
}
