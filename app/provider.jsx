"use client"
import { UserDetailContext } from '@/context/UserDetailContext'
import { supabase } from '@/services/supabaseClient'
import React, { useContext, useEffect, useState } from 'react'

const Provider = ({ children }) => {

    const [user, setUser] = useState()

    useEffect(() => {
        console.log('Provider mounted - starting user creation')
        CreateNewUser()
    }, [])

    const CreateNewUser = async () => {
        try {
            const { data: { user }, error: authError } = await supabase.auth.getUser()
            
            if (authError || !user) {
                console.log('No authenticated user found')
                return
            }

            let { data: Users, error } = await supabase.from('Users')
                .select("*")
                .eq('email', user?.email)

            if (error) {
                console.error('Error fetching users:', error)
                return
            }

            if (Users?.length == 0) {
                const newUser = {
                    name: user?.user_metadata?.name,
                    email: user?.email,
                    picture: user?.user_metadata?.picture,
                }
                
                const { data, error: insertError } = await supabase.from("Users")
                    .insert([newUser])
                    .select() // Add this to return the inserted data
                
                if (insertError) {
                    console.error('Error inserting user:', insertError)
                    return
                }
                
                setUser(data[0]) // Use the returned data
                return
            }
            setUser(Users[0])
        } catch (err) {
            console.error('Error in CreateNewUser:', err)
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
