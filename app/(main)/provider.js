import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import AppSidebar from './_components/AppSidebar'
import React from 'react'
import WelcomeContainer from './dashboard/_components/WelcomeContainer'

const DashboardProvider = ({ children }) => {
  return (
        <SidebarProvider>
            <AppSidebar />
            <div className='w-full p-10'>
                {/* <SidebarTrigger/> */}
                <WelcomeContainer />
                {children}
            </div>
        </SidebarProvider>
  )
}

export default DashboardProvider
