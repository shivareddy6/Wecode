import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Create Supabase client
    const supabase = await createClient()
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      // User is not authenticated - redirect to login with error
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('error', 'login_required')
      return NextResponse.redirect(loginUrl)
    }
    
    // Parse form data (NOT JSON)
    const formData = await request.formData()
    const leetcodeSession = formData.get('leetcode_session') as string
    const csrfToken = formData.get('csrftoken') as string
    
    // Validate required fields
    if (!leetcodeSession || !csrfToken) {
      const dashboardUrl = new URL('/dashboard', request.url)
      dashboardUrl.searchParams.set('error', 'missing_tokens')
      return NextResponse.redirect(dashboardUrl)
    }
    
    // Upsert to user_secrets table
    const { error: upsertError } = await supabase
      .from('user_secrets')
      .upsert({
        user_id: user.id,
        leetcode_session: leetcodeSession,
        csrf_token: csrfToken,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      })
    
    if (upsertError) {
      console.error('Database upsert error:', upsertError)
      const dashboardUrl = new URL('/dashboard', request.url)
      dashboardUrl.searchParams.set('error', 'sync_failed')
      return NextResponse.redirect(dashboardUrl)
    }
    
    // Success - redirect to dashboard with success message
    const dashboardUrl = new URL('/dashboard', request.url)
    dashboardUrl.searchParams.set('success', 'true')
    return NextResponse.redirect(dashboardUrl)
    
  } catch (error) {
    console.error('Sync cookies error:', error)
    
    // Fallback error redirect
    const dashboardUrl = new URL('/dashboard', request.url)
    dashboardUrl.searchParams.set('error', 'unexpected_error')
    return NextResponse.redirect(dashboardUrl)
  }
}
