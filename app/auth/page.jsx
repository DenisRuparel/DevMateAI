"use client"

import { Button } from '@/components/ui/button'
import { supabase } from '@/services/supabaseClient'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useUser } from '@/app/provider'

function Signin() {
  const router = useRouter()
  const { user } = useUser()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          router.push('/dashboard')
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [router])

  const signInWithGoogle = async () => {
    setIsLoading(true)
    const {error} = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // Return to /auth so this page's effect can route to /dashboard on SIGNED_IN
        redirectTo: `${process.env.NEXT_PUBLIC_HOST_URL || (typeof window !== 'undefined' ? window.location.origin : '')}/auth`
      }
    })
    if(error) {
      console.log('Error: ', error.message)
    }
    setIsLoading(false)
  }

  const signOut = async () => {
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Error signing out:', error.message)
      } else {
        router.push('/')
      }
    } catch (error) {
      console.error('Error signing out:', error)
    }
    setIsLoading(false)
  }


  return (
    <div className='flex justify-center items-center h-screen flex-col'>
      <div className='flex flex-col items-center border rounded-2xl p-8'>
        <Image src={'/logo2.png'}
          alt="logo"
          width={400}
          height={100}
          className='w-[180px]' />

        <div className='flex flex-col items-center'>
          <Image src={'/login.jpg'}
            alt="logo"
            width={600}
            height={400}
            className='w-[400px] h-[250px] rounded-2xl mt-5' />

            <h2 className='text-2xl font-bold text-center mt-5'>Welcome to DevMate AI</h2>

            {user ? (
              <div className='text-center mt-5'>
                <p className='text-gray-500 mb-4'>You are already signed in as:</p>
                <p className='font-medium text-lg mb-6'>{user.name || user.email}</p>
                <div className='space-y-3'>
                  <Button 
                    className='w-full' 
                    onClick={() => router.push('/dashboard')}
                    disabled={isLoading}
                  >
                    Go to Dashboard
                  </Button>
                  <Button 
                    variant="outline" 
                    className='w-full' 
                    onClick={signOut}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing Out...' : 'Sign Out'}
                  </Button>
                </div>
              </div>
            ) : (
              <div className='text-center mt-5'>
                <p className='text-gray-500 text-center'>Sign in with Google Authentication</p>
                <Button 
                  className='mt-7 w-full' 
                  onClick={signInWithGoogle}
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing In...' : 'Sign in with Google'}
                </Button>
              </div>
            )}
        </div>
      </div>
    </div>
  )
}

export default Signin
