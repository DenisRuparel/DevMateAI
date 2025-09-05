import { NextResponse } from 'next/server'

// Proxies the WebRTC SDP offer to the D-ID Realtime API and returns the answer.
// Configure these env vars:
// - DID_API_KEY
// - DID_AVATAR_ID
// - DID_REALTIME_SDP_URL (optional override). Example (subject to provider docs):
//   https://api.d-id.com/v1/realtime/webrtc

export async function POST(request) {
  try {
    const { sdp } = await request.json()
    if (!sdp) {
      return NextResponse.json({ error: 'Missing SDP offer' }, { status: 400 })
    }

    const didKey = process.env.DID_API_KEY
    const avatarId = process.env.DID_AVATAR_ID || 'adam_standard'
    if (!didKey || !avatarId) {
      return NextResponse.json({ error: 'D-ID not configured' }, { status: 400 })
    }

    let baseUrl = process.env.DID_REALTIME_SDP_URL || 'https://api.d-id.com/v1/realtime/webrtc'
    // Pass avatar/presenter via query string per provider docs
    const url = `${baseUrl}?presenter_id=${encodeURIComponent(avatarId)}`
    const basic = Buffer.from(`${didKey}:`).toString('base64')

    // The exact payload varies by provider version. This is a common pattern:
    const payload = { sdp }

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${basic}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const text = await res.text().catch(() => '')
      return NextResponse.json({ error: 'Upstream error', details: text || res.statusText }, { status: 502 })
    }

    const data = await res.json().catch(async () => ({ sdp: await res.text() }))
    const answerSdp = data?.sdp || data
    if (!answerSdp) {
      return NextResponse.json({ error: 'Invalid answer from provider' }, { status: 502 })
    }

    return NextResponse.json({ sdp: answerSdp })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to exchange SDP' }, { status: 500 })
  }
}


