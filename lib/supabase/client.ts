// lib/supabase/client.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/types/database.types'
import path from 'path'
import dotenv from 'dotenv'

// Ensure .env is populated if running outside Next.js (CLI / tsx)
if (typeof window === 'undefined' && !process.env.SUPABASE_URL_PROD && !process.env.SUPABASE_URL_LOCAL) {
  dotenv.config({ path: path.resolve(process.cwd(), '.env') })
}

function getSupabaseCredentials() {
  const isProd =
    process.env.NODE_ENV === 'production' ||
    (typeof process !== 'undefined' && Array.isArray(process.argv) && process.argv.includes('--prod'))

  const supabaseUrl =
    (isProd ? process.env.SUPABASE_URL_PROD : process.env.SUPABASE_URL_LOCAL) ||
    process.env.NEXT_PUBLIC_SUPABASE_URL

  const supabaseKey =
    (isProd ? process.env.SUPABASE_SECRET_KEY_PROD : process.env.SUPABASE_SECRET_KEY_LOCAL) ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    const envType = isProd ? 'PRODUCTION' : 'LOCAL'
    throw new Error(
      `Missing Supabase credentials for ${envType}. Check SUPABASE_URL_${envType} and SUPABASE_SECRET_KEY_${envType} (or NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY) in your environment.`
    )
  }

  return { supabaseUrl, supabaseKey }
}

const { supabaseUrl, supabaseKey } = getSupabaseCredentials()

export const adminClient = createClient<Database>(supabaseUrl, supabaseKey)
