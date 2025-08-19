import React from 'react'
import DashboardProvider from './provider'

const DashboardLayout = ({ children }) => {
  return (
    <div className='bg-background min-h-screen'>
        <DashboardProvider>
          <div>
            {children}
          </div>
        </DashboardProvider>
    </div>
  )
}

export default DashboardLayout
