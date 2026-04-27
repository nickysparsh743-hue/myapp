import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request, { params }) {
    try {
        const supabase = createClient()
        const { id } = await params

        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .eq('id', id)
            .single()

        if (error) throw error

        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch project' },
            { status: 500 }
        )
    }
}

export async function PUT(request, { params }) {
    try {
        const supabase = createClient()
        const { id } = await params
        const data = await request.json()

        // Remove id from update data
        const { id: _, created_at, updated_at, ...updateData } = data

        const { data: updated, error } = await supabase
            .from('projects')
            .update(updateData)
            .eq('id', id)
            .select()
            .single()

        if (error) throw error

        return NextResponse.json(updated)
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to update project' },
            { status: 500 }
        )
    }
}

export async function DELETE(request, { params }) {
    try {
        const supabase = createClient()
        const { id } = await params

        const { error } = await supabase
            .from('projects')
            .delete()
            .eq('id', id)

        if (error) throw error

        return NextResponse.json(
            { message: 'Project deleted successfully' },
            { status: 200 }
        )
    } catch (error) {
        console.error('Delete error:', error)
        return NextResponse.json(
            { error: 'Failed to delete project' },
            { status: 500 }
        )
    }
}
