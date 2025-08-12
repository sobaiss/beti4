import { NextRequest, NextResponse } from 'next/server'
import { AgencyService } from '@/lib/services/agency'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { userId } = body

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    console.log('Setting main contact for agency:', params.id, 'with user ID:', userId);

    //const agency = await AgencyService.setMainContact(params.id, userId)
    //return NextResponse.json(agency)
  } catch (error) {
    console.error('Error setting main contact:', error)
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to set main contact' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('Removing main contact for agency:', params.id);
    //const agency = await AgencyService.removeMainContact(params.id)
    //return NextResponse.json(agency)
  } catch (error) {
    console.error('Error removing main contact:', error)
    return NextResponse.json(
      { error: 'Failed to remove main contact' },
      { status: 500 }
    )
  }
}