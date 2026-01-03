import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://ocjxewdtihtlhckhrxit.supabase.co',
  'sb_publishable_OrGLz6VTWwbnka1AMvTKLQ_1fV4aTep',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
)
