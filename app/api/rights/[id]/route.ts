import { NextRequest, NextResponse } from 'next/server'
import { RightService } from '@/lib/services/right'
import { updateRightSchema } from '@/lib/validations/user'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const right = await RightService.getRightById(params.id)
    
    if (!right) {
      return NextResponse.json(
        { error: 'Right not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(right)
  } catch (error) {
    console.error('Error fetching right:', error)
    return NextResponse.json(
      { error: 'Failed to fetch right' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const validatedData = updateRightSchema.parse(body)
    
    const right = await RightService.updateRight(params.id, validatedData)
    return NextResponse.json(right)
  } catch (error) {
    console.error('Error updating right:', error)
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.message },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to update right' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await RightService.deleteRight(params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting right:', error)
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: error.message.includes('not found') ? 404 : 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to delete right' },
      { status: 500 }
    )
  }
}