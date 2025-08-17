'use client'
import React from 'react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Plus, LogOut, User } from 'lucide-react'
import { SidebarOptions } from '@/services/Constants'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { supabase } from '@/services/supabaseClient'
import { useUser } from '@/app/provider'

const AppSidebar = () => {
    const pathname = usePathname()
    const router = useRouter()
    const { user } = useUser()

    const handleSignOut = async () => {
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
    }

    const handleCreateInterview = () => {
        router.push('/dashboard/create-interview')
    }

  return (
    <Sidebar>
      <SidebarHeader className='flex items-center mt-5'> 
        <Image src={'/logo.png'} alt="logo" width={200} height={100} className='w-[150px]'/>
        <Button className='w-full mt-5' onClick={handleCreateInterview}>
          <Plus className="mr-2 h-4 w-4"/> 
          Create New Interview 
        </Button>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
            <SidebarContent>
                <SidebarMenu>
                    {SidebarOptions.map((option, index) => (
                        <SidebarMenuItem key={index} className='p-1'>
                            <SidebarMenuButton asChild className={`p-5 ${pathname === option.path && 'bg-primary/10'}`}>
                                <Link href={option.path}>
                                    <option.icon className={`${pathname === option.path && 'text-primary'}`}/>
                                    <span className={`text-[16px] font-medium ${pathname === option.path && 'text-primary'}`}>{option.name}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <div className="space-y-3">
          {/* User Profile Section */}
          {user && (
            <div className="flex items-center space-x-3 p-3 bg-secondary rounded-lg">
              {user.picture ? (
                <Image 
                  src={user.picture} 
                  alt="Profile" 
                  width={32} 
                  height={32} 
                  className="rounded-full"
                />
              ) : (
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {user.name || user.email}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user.email}
                </p>
              </div>
            </div>
          )}
          
          {/* Sign Out Button */}
          <Button 
            variant="outline" 
            className="w-full justify-start" 
            onClick={handleSignOut}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

export default AppSidebar
