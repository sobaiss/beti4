import { NextRequest, NextResponse } from 'next/server'
import { UserService } from '@/lib/services/user'
import { assignRightSchema } from '@/lib/validations/user'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const rights = await UserService.getUserRights(params.id)
    return NextResponse.json(rights)
  } catch (error) {
    console.error('Error fetching user rights:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user rights' },
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
    const validatedData = assignRightSchema.parse(body)
    
    const user = await UserService.assignRightsToUser(params.id, validatedData.rightIds)
    return NextResponse.json(user)
  } catch (error) {
    console.error('Error assigning rights to user:', error)
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.message },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to assign rights to user' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { rightId } = body

    if (!rightId) {
      return NextResponse.json(
        { error: 'Right ID is required' },
        { status: 400 }
      )
    }

    const user = await UserService.addRightToUser(params.id, rightId)
    return NextResponse.json(user)
  } catch (error) {
    console.error('Error adding right to user:', error)
    
    if (error instanceof Error && error.message === 'User already has this right') {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to add right to user' },
      { status: 500 }
    )
  }
}