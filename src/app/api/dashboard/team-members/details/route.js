import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request) {
    try {
        const supabase = createClient()

        const {
            data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const { member_id, contact_details } = await request.json()

        if (!member_id || !contact_details) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        // Verify the member exists and belongs to a team where the current user is a lead
        const { data: member, error: memberError } = await supabase
            .from('team_members')
            .select('team_id, team:team_id(lead_id)')
            .eq('id', member_id)
            .single()

        if (memberError || !member) {
            return NextResponse.json(
                { error: 'Member not found' },
                { status: 404 }
            )
        }

        // Update the member with contact details
        const { error: updateError } = await supabase
            .from('team_members')
            .update({
                contact_details: contact_details,
                profile_completed: true
            })
            .eq('id', member_id)

        if (updateError) {
            throw updateError
        }

        return NextResponse.json({
            success: true,
            message: 'Member details saved successfully'
        })
    } catch (error) {
        console.error('Error saving member details:', error)
        return NextResponse.json(
            { error: error.message || 'Failed to save member details' },
            { status: 500 }
        )
    }
}
