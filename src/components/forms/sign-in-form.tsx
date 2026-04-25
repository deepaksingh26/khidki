"use client";

import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { startSignInAction } from "@/lib/actions";
import { signInSchema, type SignInValues } from "@/lib/validators";
import { FormMessage } from "@/components/forms/form-message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SignInForm({ nextPath = "/app" }: { nextPath?: string }) {
  const router = useRouter();
  const [result, setResult] = useState<{ tone: "success" | "error"; message: string } | null>(null);
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
      nextPath
    }
  });

  return (
    <form
      className="space-y-4"
      onSubmit={handleSubmit((values) => {
        startTransition(async () => {
          const response = await startSignInAction(values);
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
      <label className="space-y-2">
        <span className="text-sm font-medium text-khidkee-earth">Email</span>
        <Input {...register("email")} placeholder="name@example.org" type="email" />
        {errors.email ? <p className="text-sm text-khidkee-red">{errors.email.message}</p> : null}
      </label>
      <label className="space-y-2">
        <span className="text-sm font-medium text-khidkee-earth">Password</span>
        <Input {...register("password")} placeholder="Enter your password" type="password" />
        {errors.password ? <p className="text-sm text-khidkee-red">{errors.password.message}</p> : null}
      </label>
      <input type="hidden" {...register("nextPath")} />
      {result ? <FormMessage tone={result.tone} message={result.message} /> : null}
      <Button type="submit" variant="secondary" className="w-full" disabled={isPending}>
        {isPending ? "Authenticating..." : "Sign in"}
      </Button>
    </form>
  );
}
