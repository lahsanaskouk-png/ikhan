import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ocjxewdtihtlhckhrxit.supabase.co'
const supabaseAnonKey = 'sb_publishable_OrGLz6VTWwbnka1AMvTKLQ_1fV4aTep'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
