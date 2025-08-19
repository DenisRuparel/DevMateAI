"use client"

import React from 'react'
import { useUser } from '@/app/provider'
import Image from 'next/image';

const WelcomeContainer = () => {
    const { user } = useUser();

    return (
        <div className='bg-white dark:bg-gray-800 border dark:border-gray-700 p-5 rounded-xl flex justify-between items-center'>
            <div>
                <h2 className='text-lg font-bold dark:text-white'>Welcome Back, {user?.name}!</h2>
                <h2 className='text-gray-500 dark:text-gray-400'>Transform Interviews with Intelligence</h2>
            </div>

            {/* User Avatar */}
            {user && <Image src={user?.picture} alt="userAvatar" width={40} height={40} className='rounded-full'/>}
        </div>
    )
}

export default WelcomeContainer
