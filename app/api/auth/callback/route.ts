import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Runs after Google Auth succeeds
export async function GET(request: Request) {
  // The code is a temporary authorization code string returned by Supabase after Auth succeeds
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") ?? "/";
  let signedIn = false;

  if (code && !url.searchParams.has("error")) {
    try {
      const supabase = await createClient();
      // Exchange the one-time code for a session; server.ts saves its cookies.
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) console.error(error);
      signedIn = !error;
    } catch (error) {
      console.error(error);
    }
  }

  const siteUrl = process.env.SITE_URL || url.origin;
  const destination = new URL(signedIn ? next : "/questions?auth_error=1", siteUrl);
  // Only return to this app after sign-in.
  if (destination.origin !== new URL(siteUrl).origin) {
    destination.href = new URL("/", siteUrl).href;
  }
  const response = NextResponse.redirect(destination);
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}
