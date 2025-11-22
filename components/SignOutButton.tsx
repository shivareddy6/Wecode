'use client'

import { createClient } from '@/lib/supabase/client'
import { Button } from './ui/button'
import { useRouter } from 'next/navigation'

export default function SignOutButton() {
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh() // Ensure the session is cleared
  }

  return <Button onClick={handleSignOut} className="w-full">Sign Out</Button>
}
