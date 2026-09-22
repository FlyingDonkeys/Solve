import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/database.types";

// Create a new client per request so users never share session state.
export async function createClient() {
  const isProd = process.env.NODE_ENV === "production";
  const supabaseUrl = isProd
    ? process.env.SUPABASE_URL_PROD
    : process.env.SUPABASE_URL_LOCAL;
  const supabaseKey = isProd
    ? process.env.SUPABASE_PUBLISHABLE_KEY_PROD
    : process.env.SUPABASE_PUBLISHABLE_KEY_LOCAL;

  if (!supabaseUrl || !supabaseKey) {
    const environment = isProd ? "PROD" : "LOCAL";
    throw new Error(
      `Missing SUPABASE_URL_${environment} or SUPABASE_PUBLISHABLE_KEY_${environment}.`,
    );
  }

  const cookieStore = await cookies();

  return createServerClient<Database>(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Components cannot write cookies. Session refresh in those
          // components requires a proxy.ts that persists refreshed cookies.
        }
      },
    },
  });
}
