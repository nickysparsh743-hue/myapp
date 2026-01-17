import { NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'

export async function POST(request) {
  try {
    const data = await request.formData()
    const file = data.get('file')
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }
    
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    // Save file to uploads directory
    const path = join(process.cwd(), 'uploads', file.name)
    await writeFile(path, buffer)
    
    return NextResponse.json(
      { 
        message: 'File uploaded successfully',
        filename: file.name,
        size: file.size,
        type: file.type
      },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
}