import { NextRequest, NextResponse } from 'next/server'
import { UserService } from '@/lib/services/user'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await UserService.verifyUser(params.id)
    return NextResponse.json(user)
  } catch (error) {
    console.error('Error verifying user:', error)
    return NextResponse.json(
      { error: 'Failed to verify user' },
      { status: 500 }
    )
  }
}