'use client'

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Icons } from '@/components/icons'
import { useSearchParams } from 'next/navigation'

export default function LoginPage() {
  const supabase = createClient()
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    })
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-sm mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome to WeCode</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Error Messages */}
          {error === 'login_required' && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
              ❌ Please log in to sync your LeetCode session
            </div>
          )}
          
          <div className="space-y-4">
            <Button onClick={handleLogin} className="w-full" variant="outline">
              <Icons.google className="w-4 h-4 mr-2" />
              Sign in with Google
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
