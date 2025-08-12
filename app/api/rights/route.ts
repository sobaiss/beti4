import { NextRequest, NextResponse } from 'next/server'
import { RightService } from '@/lib/services/right'
import { createRightSchema } from '@/lib/validations/user'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')

    const result = await RightService.getRights(page, limit)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching rights:', error)
    return NextResponse.json(
      { error: 'Failed to fetch rights' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createRightSchema.parse(body)
    
    const right = await RightService.createRight(validatedData)
    return NextResponse.json(right, { status: 201 })
  } catch (error) {
    console.error('Error creating right:', error)
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.message },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create right' },
      { status: 500 }
    )
  }
}