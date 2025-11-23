import { createClient } from '@/lib/supabase/server'
import SignOutButton from '@/components/SignOutButton'

interface DashboardPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  // Middleware already verified auth, but we still need user data
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  // At this point, user should exist (middleware protected this route)
  // But add fallback for type safety
  if (!user) {
    return <div>Loading...</div>
  }

  // Await searchParams and check for success/error messages from cookie sync
  const params = await searchParams
  const success = params.success === 'true'
  const error = params.error as string

  // Get user's LeetCode sync status
  const { data: userSecrets } = await supabase
    .from('user_secrets')
    .select('leetcode_session, csrf_token, updated_at')
    .eq('user_id', user.id)
    .single()

  const hasLeetCodeSync = userSecrets?.leetcode_session && userSecrets?.csrf_token

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center">
      <div className="p-8 border rounded-lg shadow-lg bg-card text-card-foreground max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        
        {/* Success/Error Messages */}
        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            ✅ LeetCode session synced successfully!
          </div>
        )}
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error === 'login_required' && '❌ Please log in first'}
            {error === 'missing_tokens' && '❌ Missing LeetCode tokens'}
            {error === 'sync_failed' && '❌ Failed to sync tokens'}
            {error === 'unexpected_error' && '❌ An unexpected error occurred'}
          </div>
        )}
        
        <p className="mb-4">Welcome! You are logged in as:</p>
        <p className="font-mono p-2 bg-muted rounded mb-6">{user.email}</p>
        
        {/* LeetCode Sync Status */}
        <div className="mb-6 p-4 border rounded">
          <h3 className="font-semibold mb-2">LeetCode Integration</h3>
          {hasLeetCodeSync ? (
            <div className="text-green-600">
              ✅ Connected
              <p className="text-sm text-muted-foreground mt-1">
                Last synced: {new Date(userSecrets.updated_at).toLocaleString()}
              </p>
            </div>
          ) : (
            <div className="text-orange-600">
              ⚠️ Not connected
              <p className="text-sm text-muted-foreground mt-1">
                Install the Chrome extension to sync your LeetCode session
              </p>
            </div>
          )}
        </div>
        
        <SignOutButton />
      </div>
    </div>
  )
}
