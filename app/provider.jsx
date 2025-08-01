"use client"
import { UserDetailContext } from '@/context/UserDetailContext'
import { supabase } from '@/services/supabaseClient'
import { useRouter, usePathname } from 'next/navigation'
import React, { useContext, useEffect, useState } from 'react'

const Provider = ({ children }) => {
    const [user, setUser] = useState()
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const pathname = usePathname()

    // Define public routes that don't require authentication
    const publicRoutes = ['/', '/auth']

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const { data: { user }, error: authError } = await supabase.auth.getUser()
                
                if (authError || !user) {
                    console.log('No authenticated user found')
                    setLoading(false)
                    
                    // Redirect to auth if trying to access protected route
                    if (!publicRoutes.includes(pathname) && !pathname.startsWith('/interview/')) {
                        router.replace('/auth')
                    }
                    return
                }

                // User is authenticated, handle user creation/fetching
                await handleUserData(user)
                
            } catch (err) {
                console.error('Error in auth initialization:', err)
                setLoading(false)
                
                // Redirect to auth on error if on protected route
                if (!publicRoutes.includes(pathname) && !pathname.startsWith('/interview/')) {
                    router.replace('/auth')
                }
            }
        }

        initializeAuth()
        
        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' && session) {
                await handleUserData(session.user)
            } else if (event === 'SIGNED_OUT') {
                setUser(null)
                router.replace('/auth')
            }
        })

        return () => subscription.unsubscribe()
    }, [router, pathname])

    const handleUserData = async (authUser) => {
        try {
            let { data: Users, error } = await supabase.from('Users')
                .select("*")
                .eq('email', authUser?.email)

            if (error) {
                console.error('Error fetching users:', error)
                setLoading(false)
                return
            }

            let userData;
            if (Users?.length == 0) {
                const newUser = {
                    name: authUser?.user_metadata?.name,
                    email: authUser?.email,
                    picture: authUser?.user_metadata?.picture,
                }
                
                const { data, error: insertError } = await supabase.from("Users")
                    .insert([newUser])
                    .select()
                
                if (insertError) {
                    console.error('Error inserting user:', insertError)
                    setLoading(false)
                    return
                }
                userData = data[0]
            } else {
                userData = Users[0]
            }
            
            setUser(userData)
            setLoading(false)
            
            // Only redirect if not already on dashboard and coming from public route
            if (publicRoutes.includes(pathname)) {
                router.replace('/dashboard')
            }
        } catch (err) {
            console.error('Error in handleUserData:', err)
            setLoading(false)
        }
    }

    // Show loading spinner while checking auth
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <UserDetailContext.Provider value={{ user, setUser, loading }}>
            <div>
                {children}
            </div>
        </UserDetailContext.Provider>
    )
}

export default Provider

export const useUser = () => {
    const context = useContext(UserDetailContext)
    return context
}
