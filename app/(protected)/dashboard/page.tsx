import { createClient } from '@/lib/supabase/server'
import SignOutButton from '@/components/SignOutButton'

export default async function DashboardPage() {
  // Middleware already verified auth, but we still need user data
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  // At this point, user should exist (middleware protected this route)
  // But add fallback for type safety
  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center">
      <div className="p-8 border rounded-lg shadow-lg bg-card text-card-foreground">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <p className="mb-6">Welcome! You are logged in as:</p>
        <p className="font-mono p-2 bg-muted rounded mb-6">{user.email}</p>
        <SignOutButton />
      </div>
    </div>
  )
}
