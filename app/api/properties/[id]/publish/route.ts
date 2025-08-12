import { NextRequest, NextResponse } from 'next/server'
import { PropertyService } from '@/lib/services/property'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // TODO: Get user ID from authentication
    const ownerId = 'temp-user-id'
    
    const property = await PropertyService.publishProperty(params.id, ownerId)

    return NextResponse.json({
      success: true,
      message: 'Propriété publiée avec succès',
      property
    })
  } catch (error) {
    console.error('Error publishing property:', error)
    
    if (error instanceof Error) {
      if (error.message === 'Property not found or access denied') {
        return NextResponse.json(
          { error: error.message },
          { status: 404 }
        )
      }
      
      if (error.message === 'Property is already published') {
        return NextResponse.json(
          { error: error.message },
          { status: 400 }
        )
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to publish property' },
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
    
    const property = await PropertyService.unpublishProperty(params.id, ownerId)

    return NextResponse.json({
      success: true,
      message: 'Propriété dépubliée avec succès',
      property
    })
  } catch (error) {
    console.error('Error unpublishing property:', error)
    
    if (error instanceof Error) {
      if (error.message === 'Property not found or access denied') {
        return NextResponse.json(
          { error: error.message },
          { status: 404 }
        )
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to unpublish property' },
      { status: 500 }
    )
  }
}