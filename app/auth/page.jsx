"use client"

import { Button } from '@/components/ui/button'
import { supabase } from '@/services/supabaseClient'
import Image from 'next/image'
import React from 'react'

function Signin() {

  const signInWithGoogle = async () => {
    const {error} = await supabase.auth.signInWithOAuth({
      provider: 'google'
    })
    if(error) {
      console.log('Error: ', error.message)
    }
  }


  return (
    <div className='flex justify-center items-center h-screen flex-col'>
      <div className='flex flex-col items-center border rounded-2xl p-8'>
        <Image src={'/logo.png'}
          alt="logo"
          width={400}
          height={100}
          className='w-[180px]' />

        <div className='flex flex-col items-center'>
          <Image src={'/login.jpg'}
            alt="logo"
            width={600}
            height={400}
            className='w-[400px] h-[250px] rounded-2xl' />

            <h2 className='text-2xl font-bold text-center mt-5'>Welcome to DevMate AI</h2>

            <p className='text-gray-500 text-center'>Sign in with Google Authentication</p>

            <Button className='mt-7 w-full' onClick={signInWithGoogle}>Sign in with Google</Button>
        </div>
      </div>
    </div>
  )
}

export default Signin
