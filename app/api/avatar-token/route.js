import { NextResponse } from 'next/server'

// Placeholder token issuer for a realtime avatar provider (e.g., D-ID / HeyGen).
// For security, keep the real API key server-side and only return a short-lived token.

export async function GET() {
  try {
    const provider = process.env.REALTIME_AVATAR_PROVIDER || 'mock'

    if (provider !== 'did') {
      return NextResponse.json({ provider: 'mock', configured: false })
    }

    const didKey = process.env.DID_API_KEY
    const avatarId = process.env.DID_AVATAR_ID
    if (!didKey || !avatarId) {
      return NextResponse.json({ provider: 'did', configured: false, missing: {
        DID_API_KEY: !didKey,
        DID_AVATAR_ID: !avatarId,
      }})
    }

    // D-ID typically uses Basic auth with the API key; no extra token is required.
    // We expose only a flag + the avatarId; the client should not receive the raw key.
    return NextResponse.json({ provider: 'did', configured: true, avatarId })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to get avatar token' }, { status: 500 })
  }
}


