import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import AppSidebar from './_components/AppSidebar'
import React from 'react'

const DashboardProvider = ({ children }) => {
  return (
        <SidebarProvider>
            <AppSidebar />
            <div className='w-full'>
                <SidebarTrigger/>
                {children}
            </div>
        </SidebarProvider>
  )
}

export default DashboardProvider
