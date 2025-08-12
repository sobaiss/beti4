import { NextRequest, NextResponse } from 'next/server'
import { UserService } from '@/lib/services/user'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await UserService.unlockUser(params.id)
    return NextResponse.json(user)
  } catch (error) {
    console.error('Error unlocking user:', error)
    return NextResponse.json(
      { error: 'Failed to unlock user' },
      { status: 500 }
    )
  }
}