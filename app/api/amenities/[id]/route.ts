import { NextRequest, NextResponse } from 'next/server'
import { AmenityService } from '@/lib/services/amenity'
import { updateAmenitySchema } from '@/lib/validations/amenity'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const amenity = await AmenityService.getAmenityById(params.id)
    
    if (!amenity) {
      return NextResponse.json(
        { error: 'Amenity not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(amenity)
  } catch (error) {
    console.error('Error fetching amenity:', error)
    return NextResponse.json(
      { error: 'Failed to fetch amenity' },
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
    const validatedData = updateAmenitySchema.parse(body)
    
    const amenity = await AmenityService.updateAmenity(params.id, validatedData)
    return NextResponse.json(amenity)
  } catch (error) {
    console.error('Error updating amenity:', error)
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.message },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to update amenity' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await AmenityService.deleteAmenity(params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting amenity:', error)
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: error.message.includes('not found') ? 404 : 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to delete amenity' },
      { status: 500 }
    )
  }
}