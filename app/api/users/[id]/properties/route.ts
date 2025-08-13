import { NextRequest, NextResponse } from 'next/server'
import { UserService } from '@/lib/services/user'

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {

  const id = (await props.params).id;

  console.log('id =>', id);
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')

    const result = await UserService.getUserProperties(id, page, limit)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching user properties:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user properties' },
      { status: 500 }
    )
  }
}