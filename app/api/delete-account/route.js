import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'

export async function POST(request) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    const missing = []
    if (!supabaseUrl) missing.push('NEXT_PUBLIC_SUPABASE_URL')
    if (!serviceRoleKey) missing.push('SUPABASE_SERVICE_ROLE_KEY')
    if (!anonKey) missing.push('NEXT_PUBLIC_SUPABASE_ANON_KEY')
    if (missing.length) {
      return NextResponse.json({ error: `Server is not configured. Missing env vars: ${missing.join(', ')}` }, { status: 500 })
    }

    const admin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    })

    // Validate the caller's access token and ensure they are deleting themselves
    const authHeader = request.headers.get('authorization') || ''
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.slice('Bearer '.length)
      : null

    if (!token) {
      return NextResponse.json({ error: 'Missing access token' }, { status: 401 })
    }

    const validator = createClient(supabaseUrl, anonKey)
    const { data: validated, error: validateErr } = await validator.auth.getUser(token)
    if (validateErr || !validated?.user?.id) {
      console.error('Token validation error:', validateErr?.message)
      return NextResponse.json({ error: 'Invalid access token' }, { status: 401 })
    }

    if (validated.user.id !== userId) {
      return NextResponse.json({ error: 'Not authorized to delete this user' }, { status: 403 })
    }

    // Best-effort: fetch the user to obtain email for table cleanup
    const { data: userData, error: getUserError } = await admin.auth.admin.getUserById(userId)
    if (getUserError) {
      // Continue; deletion may still succeed even if we cannot fetch user details
      console.warn('Failed to fetch user before deletion:', getUserError.message)
    }

    const { error } = await admin.auth.admin.deleteUser(userId)
    if (error) {
      console.error('Admin deleteUser error:', error.message)
      return NextResponse.json({ error: `Delete failed: ${error.message}` }, { status: 500 })
    }

    // Best-effort: remove from application "Users" table by email if available
    const email = userData?.user?.email
    if (email) {
      const { error: tableDeleteError } = await admin.from('Users').delete().eq('email', email)
      if (tableDeleteError) {
        console.warn('Users table cleanup failed:', tableDeleteError.message)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Unhandled delete-account error:', error)
    return NextResponse.json({ error: error?.message || 'Unknown server error' }, { status: 500 })
  }
}


