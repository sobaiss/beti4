import { NextRequest, NextResponse } from 'next/server'
import { UserService } from '@/lib/services/user'
import { createUserSchema } from '@/lib/validations/user'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createUserSchema.parse(body)
    
    const user = await UserService.createUser(validatedData)
    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    console.error('Error creating user:', error)
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.message },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
}