import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request) {
    try {
        const supabase = createClient()

        // Get projects for the authenticated user
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) throw error

        return NextResponse.json(data || [])
    } catch (error) {
        console.error('Error fetching projects:', error)
        return NextResponse.json(
            { error: 'Failed to fetch projects' },
            { status: 500 }
        )
    }
}

export async function POST(request) {
    try {
        const supabase = createClient()
        const data = await request.json()

        // Remove fields that shouldn't be set
        const { id, created_at, updated_at, ...projectData } = data

        // Create new project in database
        const { data: newProject, error } = await supabase
            .from('projects')
            .insert([projectData])
            .select()
            .single()

        if (error) throw error

        return NextResponse.json(
            {
                message: 'Project created successfully',
                ...newProject
            },
            { status: 201 }
        )
    } catch (error) {
        console.error('Error creating project:', error)
        return NextResponse.json(
            { error: 'Failed to create project' },
            { status: 500 }
        )
    }
}