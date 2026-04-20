"use client";

import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { contactMessageAction } from "@/lib/actions";
import { contactMessageSchema, type ContactMessageValues } from "@/lib/validators";
import { FormMessage } from "@/components/forms/form-message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function ContactMessageForm() {
  const [result, setResult] = useState<{ tone: "success" | "error"; message: string } | null>(null);
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ContactMessageValues>({
    resolver: zodResolver(contactMessageSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: ""
    }
  });

  return (
    <form
      className="space-y-4"
      onSubmit={handleSubmit((values) => {
        startTransition(async () => {
          const response = await contactMessageAction(values);
          setResult({
            tone: response.success ? "success" : "error",
            message: response.message
          });
          if (response.success) reset();
        });
      })}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-medium text-khidkee-earth">Name</span>
          <Input {...register("name")} placeholder="Your name" />
          {errors.name ? <p className="text-sm text-khidkee-red">{errors.name.message}</p> : null}
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-khidkee-earth">Email</span>
          <Input {...register("email")} placeholder="name@example.org" />
        </label>
        <label className="space-y-2 sm:col-span-2">
          <span className="text-sm font-medium text-khidkee-earth">Phone</span>
          <Input {...register("phone")} placeholder="+91" />
        </label>
        <label className="space-y-2 sm:col-span-2">
          <span className="text-sm font-medium text-khidkee-earth">Message</span>
          <Textarea {...register("message")} placeholder="Tell us what you are trying to build, pilot, or understand." />
          {errors.message ? <p className="text-sm text-khidkee-red">{errors.message.message}</p> : null}
        </label>
      </div>
      {result ? <FormMessage tone={result.tone} message={result.message} /> : null}
      <Button type="submit" variant="secondary" disabled={isPending}>
        {isPending ? "Sending your note..." : "Send message"}
      </Button>
    </form>
  );
}

