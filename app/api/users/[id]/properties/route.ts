import { NextRequest, NextResponse } from 'next/server'
import { UserService } from '@/lib/services/user'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')

    const result = await UserService.getUserProperties(params.id, page, limit)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching user properties:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user properties' },
      { status: 500 }
    )
  }
}