"use client";

import { useFormStatus } from "react-dom";
import { LoaderCircle } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { buttonVariants } from "@/components/ui/button";

export function SignInButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending} aria-busy={pending}
      className={buttonVariants({ size: "lg", className: "h-12 w-full gap-3 px-6" })}>
      {pending ? <LoaderCircle aria-hidden="true" className="size-5 motion-safe:animate-spin" /> : <FcGoogle aria-hidden="true" className="size-5" />}
      {pending ? "Connecting to Google…" : "Continue with Google"}
    </button>
  );
}
