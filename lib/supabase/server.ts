import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { LeetCodeCookies } from '@/lib/leetcode/client'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}

export async function getLeetCodeCookies(): Promise<LeetCodeCookies | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  const { data: userSecrets } = await supabase
    .from('user_secrets')
    .select('leetcode_session, csrf_token')
    .eq('user_id', user.id)
    .single()

  if (!userSecrets?.leetcode_session || !userSecrets?.csrf_token) {
    return null
  }

  return {
    LEETCODE_SESSION: userSecrets.leetcode_session,
    csrftoken: userSecrets.csrf_token,
  }
}
