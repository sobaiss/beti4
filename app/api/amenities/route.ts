import { NextRequest, NextResponse } from 'next/server'
import { AmenityService } from '@/lib/services/amenity'
import { createAmenitySchema } from '@/lib/validations/amenity'
import { PropertyAmenityCategoryEnum } from '@/types/property'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category') as PropertyAmenityCategoryEnum | null
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')

    const result = await AmenityService.getAmenities(category || undefined, page, limit)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching amenities:', error)
    return NextResponse.json(
      { error: 'Failed to fetch amenities' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createAmenitySchema.parse(body)
    
    const amenity = await AmenityService.createAmenity(validatedData)
    return NextResponse.json(amenity, { status: 201 })
  } catch (error) {
    console.error('Error creating amenity:', error)
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.message },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create amenity' },
      { status: 500 }
    )
  }
}