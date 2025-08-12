import { NextRequest, NextResponse } from 'next/server'
import { UserService } from '@/lib/services/user'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; rightId: string } }
) {
  try {
    const user = await UserService.removeRightFromUser(params.id, params.rightId)
    return NextResponse.json(user)
  } catch (error) {
    console.error('Error removing right from user:', error)
    return NextResponse.json(
      { error: 'Failed to remove right from user' },
      { status: 500 }
    )
  }
}