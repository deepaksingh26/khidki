"use client";

import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { requestAccessAction } from "@/lib/actions";
import { requestAccessSchema, type RequestAccessValues } from "@/lib/validators";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormMessage } from "@/components/forms/form-message";

export function RequestAccessForm() {
  const [result, setResult] = useState<{ tone: "success" | "error"; message: string } | null>(null);
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<RequestAccessValues>({
    resolver: zodResolver(requestAccessSchema),
    defaultValues: {
      name: "",
      organization: "",
      phone: "",
      email: "",
      district: "",
      notes: ""
    }
  });

  return (
    <form
      className="space-y-4"
      onSubmit={handleSubmit((values) => {
        startTransition(async () => {
          const response = await requestAccessAction(values);
          setResult({
            tone: response.success ? "success" : "error",
            message: response.message
          });
          if (response.success) {
            reset();
          }
        });
      })}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-medium text-khidkee-earth">Name</span>
          <Input {...register("name")} placeholder="Who should we speak with?" />
          {errors.name ? <p className="text-sm text-khidkee-red">{errors.name.message}</p> : null}
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-khidkee-earth">Organization</span>
          <Input {...register("organization")} placeholder="Team, NGO, or network name" />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-khidkee-earth">Phone</span>
          <Input {...register("phone")} placeholder="+91" />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-khidkee-earth">Email</span>
          <Input {...register("email")} placeholder="name@example.org" />
          {errors.email ? <p className="text-sm text-khidkee-red">{errors.email.message}</p> : null}
        </label>
        <label className="space-y-2 sm:col-span-2">
          <span className="text-sm font-medium text-khidkee-earth">District</span>
          <Input {...register("district")} placeholder="Which district are you working in?" />
        </label>
        <label className="space-y-2 sm:col-span-2">
          <span className="text-sm font-medium text-khidkee-earth">What are you trying to solve?</span>
          <Textarea {...register("notes")} placeholder="Tell us about your field team, geography, and immediate need." />
        </label>
      </div>
      {result ? <FormMessage tone={result.tone} message={result.message} /> : null}
      <Button type="submit" variant="secondary" disabled={isPending}>
        {isPending ? "Sending your request..." : "Request pilot access"}
      </Button>
    </form>
  );
}

