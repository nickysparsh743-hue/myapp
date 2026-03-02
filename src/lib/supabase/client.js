import { createBrowserClient } from '@supabase/ssr'

export const createClient = () => {
    try {
        const supabase = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        )

        console.log('Supabase client initialized with URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)

        return supabase
    } catch (error) {
        console.error('Error creating Supabase client:', error)
        throw error
    }
}