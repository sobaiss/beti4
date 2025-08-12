import { NextRequest, NextResponse } from 'next/server'
import { AgencyService } from '@/lib/services/agency'
import { updateAgencySchema } from '@/lib/validations/agency'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const agency = await AgencyService.getAgencyById(params.id)
    
    if (!agency) {
      return NextResponse.json(
        { error: 'Agency not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(agency)
  } catch (error) {
    console.error('Error fetching agency:', error)
    return NextResponse.json(
      { error: 'Failed to fetch agency' },
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
    const validatedData = updateAgencySchema.parse(body)
    
    const agency = await AgencyService.updateAgency(params.id, validatedData)
    return NextResponse.json(agency)
  } catch (error) {
    console.error('Error updating agency:', error)
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.message },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to update agency' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await AgencyService.deleteAgency(params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting agency:', error)
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: error.message.includes('not found') ? 404 : 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to delete agency' },
      { status: 500 }
    )
  }
}