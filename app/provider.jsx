"use client"
import { UserDetailContext } from '@/context/UserDetailContext'
import { supabase } from '@/services/supabaseClient'
import React, { useContext, useEffect, useState, useRef } from 'react'

const Provider = ({ children }) => {

    const [user, setUser] = useState()
    const initializedRef = useRef(false)
    const creatingRef = useRef(false)

    useEffect(() => {
        if (initializedRef.current) return
        initializedRef.current = true

        console.log('Provider mounted - starting user creation')
        CreateNewUser()

        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                console.log('Auth state changed:', event, session?.user?.email)
                
                if (event === 'SIGNED_IN' && session?.user) {
                    await CreateNewUser()
                } else if (event === 'SIGNED_OUT') {
                    console.log('User signed out, clearing user state')
                    setUser(null)
                }
            }
        )

        return () => subscription.unsubscribe()
    }, [])

    const CreateNewUser = async () => {
        if (creatingRef.current) return
        creatingRef.current = true
        try {
            const { data: { user }, error: authError } = await supabase.auth.getUser()
            
            if (authError || !user) {
                console.log('No authenticated user found')
                setUser(null)
                return
            }

            // Try to fetch existing user row (may be empty if RLS prevents select)
            let { data: Users, error: fetchError } = await supabase.from('Users')
                .select("*")
                .eq('email', user?.email)

            if (fetchError) {
                console.warn('Error fetching users (continuing with upsert):', fetchError)
            }

            if (!Users || Users.length === 0) {
                const newUser = {
                    name: user?.user_metadata?.name,
                    email: user?.email,
                    picture: user?.user_metadata?.picture,
                }
                
                const { data, error: upsertError } = await supabase.from("Users")
                    .upsert(newUser, { onConflict: 'email' })
                    .select()
                    .maybeSingle()
                
                if (upsertError) {
                    console.error('Error upserting user:', upsertError)
                    return
                }
                
                if (data) {
                    setUser(data)
                    return
                }
            }
            // If we have an existing row (or select returned rows), use the first one
            if (Users && Users.length > 0) {
                setUser(Users[0])
            }
        } catch (err) {
            console.error('Error in CreateNewUser:', err)
        } finally {
            creatingRef.current = false
        }
    }
    return (
        <UserDetailContext.Provider value={{ user, setUser }}>
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
