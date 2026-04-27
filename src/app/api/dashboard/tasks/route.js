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

        // Get tasks for the user
        const { data: tasks, error } = await supabase
            .from('tasks')
            .select(`
                *,
                projects (
                    id,
                    name
                )
            `)
            .or(`user_id.eq.${user.id},assigned_to.eq.${user.id}`)
            .order('created_at', { ascending: false })

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json(tasks)
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

        // Create a new task
        const { data, error } = await supabase
            .from('tasks')
            .insert([
                {
                    user_id: user.id,
                    project_id: body.project_id,
                    title: body.title,
                    description: body.description,
                    status: body.status || 'pending',
                    priority: body.priority || 'medium',
                    due_date: body.due_date,
                    assigned_to: body.assigned_to
                }
            ])
            .select()

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json(data[0], { status: 201 })
    } catch (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        )
    }
}
