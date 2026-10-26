"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { loginAction, type LoginState } from "../_actions/auth";
import { inputClass, labelClass } from "@/components/admin/form-styles";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(loginAction, {});

  return (
    <form action={action} className="mt-6 flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className={labelClass}>
          Email
        </label>
        <input id="email" name="email" type="email" required autoComplete="username" className={inputClass} />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className={labelClass}>
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className={inputClass}
        />
      </div>
      {state.error ? (
        <p role="alert" className="text-sm text-red-400">
          {state.error}
        </p>
      ) : null}
      <Button type="submit" disabled={pending} className="mt-1">
        {pending ? <Loader2 size={16} className="animate-spin" /> : null}
        {pending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
