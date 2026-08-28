// lib/supabase/client.ts
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database.types'

// Safe check: Next.js build/runtime sets NODE_ENV = 'production'
const isProd =
  process.env.NODE_ENV === 'production' ||
  (typeof process !== 'undefined' && Array.isArray(process.argv) && process.argv.includes('--prod'))

const supabaseUrl = isProd
  ? process.env.SUPABASE_URL_PROD
  : process.env.SUPABASE_URL_LOCAL

const supabaseKey = isProd
  ? process.env.SUPABASE_SECRET_KEY_PROD
  : process.env.SUPABASE_SECRET_KEY_LOCAL

if (!supabaseUrl || !supabaseKey) {
  const envType = isProd ? 'PRODUCTION' : 'LOCAL'
  throw new Error(
    `Missing Supabase credentials for ${envType} (Check SUPABASE_URL_${envType} and SUPABASE_SECRET_KEY_${envType} in your environment)`
  )
}

export const adminClient = createClient<Database>(supabaseUrl, supabaseKey)
