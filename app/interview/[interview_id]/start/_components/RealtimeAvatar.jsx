"use client"

import React, { useEffect, useRef, useState } from 'react'

// Lightweight fallback avatar (non-realistic) to show when provider not configured
const FallbackAvatar = ({ isSpeaking, name }) => (
  <div className='flex flex-col items-center justify-center'>
    <div className='relative'>
      <div className='h-32 w-32 rounded-full bg-gradient-to-b from-muted to-muted/70 border border-border flex items-center justify-center shadow-inner'>
        <div className='absolute top-11 left-1/2 -translate-x-1/2 flex gap-6'>
          <div className={`h-2 w-6 rounded-full bg-foreground/80 ${isSpeaking ? '' : 'animate-pulse'}`} />
          <div className={`h-2 w-6 rounded-full bg-foreground/80 ${isSpeaking ? '' : 'animate-pulse'}`} />
        </div>
        <div className='absolute top-20 left-1/2 -translate-x-1/2'>
          <div className={`bg-primary/80 rounded-full transition-all duration-150 ease-out ${isSpeaking ? 'h-6 w-10' : 'h-1 w-8'}`} />
        </div>
        {isSpeaking && <span className='absolute inset-0 rounded-full ring-2 ring-primary animate-pulse' />}
      </div>
    </div>
    <p className='mt-3 text-card-foreground font-medium'>{name}</p>
    <p className='text-xs text-muted-foreground'>{isSpeaking ? 'Speaking…' : 'Listening…'}</p>
  </div>
)

const RealtimeAvatar = ({ isSpeaking = false, name = 'AI Interviewer' }) => {
  const videoRef = useRef(null)
  const [configured, setConfigured] = useState(false)
  const [initializing, setInitializing] = useState(true)
  const [avatarId, setAvatarId] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let peer
    const setup = async () => {
      try {
        const res = await fetch('/api/avatar-token')
        const data = await res.json()
        console.log('avatar-token:', data)
        if (!data?.configured) {
          setConfigured(false)
          setInitializing(false)
          setError('Avatar provider not configured. Check env vars.')
          return
        }

        setAvatarId(data?.avatarId || null)
        // WebRTC connection via our proxy
        peer = new RTCPeerConnection({
          iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
        })

        const remoteStream = new MediaStream()
        peer.ontrack = (e) => {
          e.streams[0]?.getTracks()?.forEach((t) => remoteStream.addTrack(t))
          if (videoRef.current) videoRef.current.srcObject = remoteStream
        }

        // No local mic needed yet; provider generates media. If required later, enable:
        // const local = await navigator.mediaDevices.getUserMedia({ audio: true })
        // local.getTracks().forEach((t) => peer.addTrack(t, local))

        const offer = await peer.createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: true })
        await peer.setLocalDescription(offer)

        const answer = await fetch('/api/avatar-sdp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sdp: offer.sdp }),
        }).then((r) => r.json())

        if (answer?.sdp) {
          await peer.setRemoteDescription({ type: 'answer', sdp: answer.sdp })
        } else {
          console.error('avatar-sdp response:', answer)
          throw new Error('No SDP answer received')
        }

        setConfigured(true)
      } catch (e) {
        setConfigured(false)
        console.error('Realtime avatar error:', e)
        setError(e?.message || 'Failed to initialize avatar')
      } finally {
        setInitializing(false)
      }
    }

    setup()
    return () => {
      try { if (videoRef.current) videoRef.current.srcObject = null } catch {}
      try { if (peer) peer.close() } catch {}
    }
  }, [])

  if (initializing) {
    return (
      <div className='flex items-center justify-center h-64 w-full'>
        <div className='text-sm text-muted-foreground'>Preparing virtual interviewer…</div>
      </div>
    )
  }

  if (!configured) {
    return (
      <div className='w-full'>
        <FallbackAvatar isSpeaking={isSpeaking} name={name} />
        {error && (
          <p className='text-xs text-muted-foreground text-center mt-2'>Avatar fallback: {error}</p>
        )}
      </div>
    )
  }

  return (
    <div className='w-full h-full flex items-center justify-center'>
      <video ref={videoRef} autoPlay playsInline muted className='rounded-lg border border-border w-full h-[320px] object-cover bg-black' />
    </div>
  )
}

export default RealtimeAvatar