"use client";

import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { inviteTeamMemberAction } from "@/lib/actions";
import { teamRoles } from "@/lib/constants";
import { inviteTeamSchema, type InviteTeamValues } from "@/lib/validators";
import { FormMessage } from "@/components/forms/form-message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

export function InviteTeamForm() {
  const [result, setResult] = useState<{ tone: "success" | "error"; message: string } | null>(null);
  const [isPending, startTransition] = useTransition();
  const { register, handleSubmit } = useForm<InviteTeamValues>({
    resolver: zodResolver(inviteTeamSchema),
    defaultValues: {
      displayName: "",
      phone: "",
      role: "field_worker"
    }
  });

  return (
    <form
      className="space-y-4"
      onSubmit={handleSubmit((values) => {
        startTransition(async () => {
          const response = await inviteTeamMemberAction(values);
          setResult({
            tone: response.success ? "success" : "error",
            message: response.message
          });
        });
      })}
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="space-y-2 sm:col-span-2">
          <span className="text-sm font-medium text-khidkee-earth">Name</span>
          <Input {...register("displayName")} placeholder="Who are you preparing to onboard?" />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-khidkee-earth">Role</span>
          <Select {...register("role")}>
            {teamRoles.map((role) => (
              <option key={role} value={role}>
                {role.replaceAll("_", " ")}
              </option>
            ))}
          </Select>
        </label>
        <label className="space-y-2 sm:col-span-3">
          <span className="text-sm font-medium text-khidkee-earth">Phone</span>
          <Input {...register("phone")} placeholder="+91" />
        </label>
      </div>
      {result ? <FormMessage tone={result.tone} message={result.message} /> : null}
      <Button type="submit" variant="secondary" disabled={isPending}>
        {isPending ? "Saving invite..." : "Prepare invite"}
      </Button>
    </form>
  );
}

