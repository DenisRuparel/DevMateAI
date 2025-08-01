"use client"

import React from 'react'
import { useUser } from '@/app/provider'
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut } from 'lucide-react'
import { supabase } from '@/services/supabaseClient'
import { useRouter } from 'next/navigation'

const WelcomeContainer = () => {
    const { user } = useUser();
    const router = useRouter();

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (!error) {
            router.push('/auth');
        }
    }

    return (
        <div className='bg-white p-5 rounded-xl flex justify-between items-center'>
            <div >
                <h2 className='text-lg font-bold'>Welcome Back, {user?.name}!</h2>
                <h2 className='text-gray-500'>Transform Interviews with Intelligence</h2>
            </div>

            {user && (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Image 
                            src={user?.picture} 
                            alt="userAvatar" 
                            width={40} 
                            height={40} 
                            className='rounded-full cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all'
                        />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                            <LogOut className="mr-2 h-4 w-4" />
                            Logout
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )}
        </div>
    )
}

export default WelcomeContainer
