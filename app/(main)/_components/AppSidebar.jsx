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
import { Plus } from 'lucide-react'
import { SidebarOptions } from '@/services/Constants'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const AppSidebar = () => {

    const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader className='flex items-center mt-5'> 
        <Image src={'/logo.png'} alt="logo" width={200} height={100} className='w-[150px]'/>
        <Button className='w-full mt-5'  > <Plus/> Create New Interview </Button>
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
      <SidebarFooter />
    </Sidebar>
  )
}

export default AppSidebar
