import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request) {
    try {
        const supabase = await createClient()

        // Get the current user
        const { data: { user }, error: userError } = await supabase.auth.getUser()

        if (userError || !user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const userId = user.id

        // Delete related notification preferences
        const { error: notifError } = await supabase
            .from('notification_preferences')
            .delete()
            .eq('user_id', userId)

        if (notifError) throw notifError

        // Delete related privacy settings
        const { error: privacyError } = await supabase
            .from('privacy_settings')
            .delete()
            .eq('user_id', userId)

        if (privacyError) throw privacyError

        // Delete teams where user is the lead
        const { error: teamsError } = await supabase
            .from('teams')
            .delete()
            .eq('lead_id', userId)

        if (teamsError) throw teamsError

        // Delete user profile
        const { error: profileError } = await supabase
            .from('profiles')
            .delete()
            .eq('id', userId)

        if (profileError) throw profileError

        // Delete the auth user using admin API
        const adminClient = createClient({ isAdmin: true })
        const { error: deleteError } = await adminClient.auth.admin.deleteUser(userId)

        if (deleteError) throw deleteError

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Delete account error:', error)
        return NextResponse.json(
            { error: error.message || 'Failed to delete account' },
            { status: 500 }
        )
    }
}
