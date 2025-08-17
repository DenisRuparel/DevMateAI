"use client"

import { useUser } from '@/app/provider'
import { supabase } from '@/services/supabaseClient'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const AuthGuard = ({ children, publicRoutes = [] }) => {
  const { user } = useUser()
  const router = useRouter()
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user: currentUser } } = await supabase.auth.getUser()
        
        // Check if current route is public
        const isPublicRoute = publicRoutes.includes(pathname)
        
        if (!currentUser && !isPublicRoute) {
          router.push('/auth')
          return
        }
        
        setIsLoading(false)
      } catch (error) {
        console.error('Auth check error:', error)
        if (!publicRoutes.includes(pathname)) {
          router.push('/auth')
        }
      }
    }

    checkAuth()
  }, [router, pathname, publicRoutes])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return children
}

export default AuthGuard 