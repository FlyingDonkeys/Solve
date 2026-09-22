import Link from "next/link";
import { LockKeyhole } from "lucide-react";
import { signInWithGoogle } from "@/app/actions/auth";
import { SignInButton } from "@/components/elements/SignInButton";
import { StatePanel } from "@/components/elements/StatePanel";

interface RequireLoginProps {
  reason: string;
  path: string;
}

export async function RequireLogin({ reason, path }: RequireLoginProps) {
  return (
    <StatePanel icon={<LockKeyhole className="size-5" />} label="Welcome to Solve" title="Sign in to continue." description={reason}>
      <form action={signInWithGoogle.bind(null, path)} className="w-full">
        <SignInButton />
      </form>
      <p className="text-xs leading-5 text-muted-foreground">You’ll be taken back here after signing in.</p>
      <Link href="/" className="rounded text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">Back to home</Link>
    </StatePanel>
  );
}
