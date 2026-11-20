import { createClient } from '@supabase/supabase-js'

// Kunci diambil dari .env (lihat .env.example). Service key TIDAK boleh ada di sini.
const url = import.meta.env.VITE_SUPABASE_URL
const kunciAnon = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabaseSiap = Boolean(url && kunciAnon)

export const supabase = supabaseSiap
  ? createClient(url, kunciAnon, {
      auth: { persistSession: true, autoRefreshToken: true },
    })
  : null
