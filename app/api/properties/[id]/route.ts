import { NextRequest, NextResponse } from 'next/server'
import { PropertyService } from '@/lib/services/property'
import { updatePropertySchema } from '@/lib/validations/property'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const property = await PropertyService.getPropertyById(params.id)
    
    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(property)
  } catch (error) {
    console.error('Error fetching property:', error)
    return NextResponse.json(
      { error: 'Failed to fetch property' },
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
    
    // TODO: Get user ID from authentication
    const ownerId = body.ownerId || 'temp-user-id'
    
    const validatedData = updatePropertySchema.parse(body)
    
    const property = await PropertyService.updateProperty(
      params.id,
      validatedData,
      ownerId
    )

    return NextResponse.json(property)
  } catch (error) {
    console.error('Error updating property:', error)
    
    if (error instanceof Error) {
      if (error.message === 'Property not found or access denied') {
        return NextResponse.json(
          { error: error.message },
          { status: 404 }
        )
      }
      
      if (error.name === 'ZodError') {
        return NextResponse.json(
          { error: 'Validation error', details: error.message },
          { status: 400 }
        )
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to update property' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // TODO: Get user ID from authentication
    const ownerId = 'temp-user-id'
    
    await PropertyService.deleteProperty(params.id, ownerId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting property:', error)
    
    if (error instanceof Error && error.message === 'Property not found or access denied') {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to delete property' },
      { status: 500 }
    )
  }
}