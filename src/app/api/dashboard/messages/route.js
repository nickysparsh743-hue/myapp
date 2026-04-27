import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request) {
    try {
        const supabase = await createClient()

        // Get the current user
        const { data: { user }, error: userError } = await supabase.auth.getUser()

        if (userError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Get conversations for the user
        const { data: conversations, error } = await supabase
            .from('conversations')
            .select(`
                *,
                participant_1:profiles!conversations_participant_1_id_fkey (
                    id,
                    name,
                    avatar
                ),
                participant_2:profiles!conversations_participant_2_id_fkey (
                    id,
                    name,
                    avatar
                ),
                messages (
                    id,
                    content,
                    created_at,
                    sender_id
                )
            `)
            .or(`participant_1_id.eq.${user.id},participant_2_id.eq.${user.id}`)
            .order('updated_at', { ascending: false })

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json(conversations)
    } catch (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        )
    }
}

export async function POST(request) {
    try {
        const supabase = await createClient()

        // Get the current user
        const { data: { user }, error: userError } = await supabase.auth.getUser()

        if (userError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()

        // Create or get conversation
        let conversationId

        // Check if conversation exists
        const { data: existingConv } = await supabase
            .from('conversations')
            .select('id')
            .or(
                `and(participant_1_id.eq.${user.id},participant_2_id.eq.${body.recipient_id}),and(participant_1_id.eq.${body.recipient_id},participant_2_id.eq.${user.id})`
            )
            .limit(1)
            .single()

        if (existingConv) {
            conversationId = existingConv.id
        } else {
            // Create new conversation
            const { data: newConv, error: convError } = await supabase
                .from('conversations')
                .insert([
                    {
                        participant_1_id: user.id,
                        participant_2_id: body.recipient_id
                    }
                ])
                .select()

            if (convError) {
                return NextResponse.json({ error: convError.message }, { status: 500 })
            }

            conversationId = newConv[0].id
        }

        // Create message
        const { data: message, error: msgError } = await supabase
            .from('messages')
            .insert([
                {
                    sender_id: user.id,
                    recipient_id: body.recipient_id,
                    conversation_id: conversationId,
                    content: body.content
                }
            ])
            .select()

        if (msgError) {
            return NextResponse.json({ error: msgError.message }, { status: 500 })
        }

        return NextResponse.json(message[0], { status: 201 })
    } catch (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        )
    }
}
