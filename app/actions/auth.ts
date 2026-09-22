"use server";

import {createClient} from "@/lib/supabase/server";
import {redirect} from "next/navigation";

export async function signInWithGoogle(returnTo: string) {
  const siteUrl = process.env.SITE_URL
    || (process.env.NODE_ENV === "development" ? "http://localhost:3000" : undefined);
  if (!siteUrl) throw new Error("Set SITE_URL to your deployed app's URL.");

  const callbackUrl = new URL("/api/auth/callback", siteUrl);
  callbackUrl.searchParams.set("next", returnTo);

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      // Callback function after Google Auth succeeds
      redirectTo: callbackUrl.toString(),
      skipBrowserRedirect: true,
    },
  });

  // Redirects the user to Google's sign in page
  if (error || !data.url) redirect("/questions?auth_error=1");
  redirect(data.url);
}