"use client";

import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { createAlertAction } from "@/lib/actions";
import { crisisTypes } from "@/lib/constants";
import { alertFormSchema, type AlertFormValues } from "@/lib/validators";
import { FormMessage } from "@/components/forms/form-message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

export function AlertForm({
  seedLocation
}: {
  seedLocation?: { latitude: number; longitude: number } | null;
}) {
  const router = useRouter();
  const [result, setResult] = useState<{ tone: "success" | "error"; message: string } | null>(null);
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit
  } = useForm<AlertFormValues>({
    resolver: zodResolver(alertFormSchema),
    defaultValues: {
      crisisType: "Medical Emergency",
      latitude: seedLocation ? String(seedLocation.latitude) : "",
      longitude: seedLocation ? String(seedLocation.longitude) : "",
      radiusKm: "2"
    }
  });

  return (
    <form
      className="space-y-4"
      onSubmit={handleSubmit((values) => {
        startTransition(async () => {
          const response = await createAlertAction(values);
          setResult({
            tone: response.success ? "success" : "error",
            message: response.message
          });
          if (response.redirectTo) router.push(response.redirectTo as Route);
        });
      })}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2 sm:col-span-2">
          <span className="text-sm font-medium text-khidkee-earth">Crisis type</span>
          <Select {...register("crisisType")}>
            {crisisTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </Select>
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-khidkee-earth">Latitude</span>
          <Input {...register("latitude")} placeholder="25.7207" />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-khidkee-earth">Longitude</span>
          <Input {...register("longitude")} placeholder="85.4047" />
        </label>
        <label className="space-y-2 sm:col-span-2">
          <span className="text-sm font-medium text-khidkee-earth">Radius in km</span>
          <Select {...register("radiusKm")}>
            <option value="1">1 km</option>
            <option value="2">2 km</option>
            <option value="3">3 km</option>
            <option value="5">5 km</option>
            <option value="8">8 km</option>
          </Select>
        </label>
      </div>
      {result ? <FormMessage tone={result.tone} message={result.message} /> : null}
      <Button type="submit" variant="danger" disabled={isPending}>
        {isPending ? "Sending alert..." : "Send SOS alert"}
      </Button>
    </form>
  );
}
