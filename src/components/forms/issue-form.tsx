"use client";

import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { saveIssueAction } from "@/lib/actions";
import { issuePriorities, issueStatuses } from "@/lib/constants";
import { issueFormSchema, type IssueFormValues } from "@/lib/validators";
import type { Contact, Issue } from "@/types/domain";
import { FormMessage } from "@/components/forms/form-message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type IssueFormProps = {
  issue?: Issue | null;
  contacts: Contact[];
};

export function IssueForm({ issue, contacts }: IssueFormProps) {
  const router = useRouter();
  const [result, setResult] = useState<{ tone: "success" | "error"; message: string } | null>(null);
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit
  } = useForm<IssueFormValues>({
    resolver: zodResolver(issueFormSchema),
    defaultValues: {
      id: issue?.id ?? "",
      contactId: issue?.contactId ?? "",
      title: issue?.title ?? "",
      type: issue?.type ?? "",
      priority: issue?.priority ?? "medium",
      status: issue?.status ?? "open",
      description: issue?.description ?? "",
      actionTaken: issue?.actionTaken ?? "",
      nextFollowupAt: issue?.nextFollowupAt ?? "",
      assignedTo: issue?.assignedTo ?? ""
    }
  });

  return (
    <form
      className="space-y-4"
      onSubmit={handleSubmit((values) => {
        startTransition(async () => {
          const response = await saveIssueAction(values);
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
          <span className="text-sm font-medium text-khidkee-earth">Issue title</span>
          <Input {...register("title")} placeholder="What needs attention?" />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-khidkee-earth">Linked contact</span>
          <Select {...register("contactId")}>
            <option value="">No linked contact yet</option>
            {contacts.map((contact) => (
              <option key={contact.id} value={contact.id}>
                {contact.name}
              </option>
            ))}
          </Select>
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-khidkee-earth">Issue type</span>
          <Input {...register("type")} placeholder="water, health, flood-risk" />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-khidkee-earth">Priority</span>
          <Select {...register("priority")}>
            {issuePriorities.map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </Select>
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-khidkee-earth">Status</span>
          <Select {...register("status")}>
            {issueStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </Select>
        </label>
        <label className="space-y-2 sm:col-span-2">
          <span className="text-sm font-medium text-khidkee-earth">Description</span>
          <Textarea {...register("description")} placeholder="What is happening on the ground?" />
        </label>
        <label className="space-y-2 sm:col-span-2">
          <span className="text-sm font-medium text-khidkee-earth">Action taken</span>
          <Textarea {...register("actionTaken")} placeholder="What has already been tried?" />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-khidkee-earth">Next follow-up</span>
          <Input {...register("nextFollowupAt")} placeholder="2026-04-15T11:00:00Z" />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-khidkee-earth">Assigned user ID</span>
          <Input {...register("assignedTo")} placeholder="Optional for MVP" />
        </label>
      </div>
      {result ? <FormMessage tone={result.tone} message={result.message} /> : null}
      <Button type="submit" variant="secondary" disabled={isPending}>
        {isPending ? "Saving issue..." : issue ? "Save issue" : "Create issue"}
      </Button>
    </form>
  );
}
