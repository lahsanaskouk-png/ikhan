import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = cookies()

  return createServerClient(
    'https://ocjxewdtihtlhckhrxit.supabase.co',
    'sb_publishable_OrGLz6VTWwbnka1AMvTKLQ_1fV4aTep',
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch {
            // يتم استدعاء setAll أحياناً من Server Components
            // ويمكن تجاهله إذا كان لديك middleware لتجديد الجلسة
          }
        },
      },
    }
  )
}
