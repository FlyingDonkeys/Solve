import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database.types'
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Admin client for backend scripts and operations requiring service role
// Uses the secret key with elevated permissions
const supabaseUrl = process.env.SUPABASE_URL_LOCAL
const supabaseKey = process.env.SUPABASE_SECRET_KEY_LOCAL

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing SUPABASE_URL_LOCAL or SUPABASE_SECRET_KEY_LOCAL environment variables')
}

export const adminClient = createClient<Database>(supabaseUrl, supabaseKey)
