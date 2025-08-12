import { NextRequest, NextResponse } from 'next/server'
import { AmenityService } from '@/lib/services/amenity'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')

    const amenities = await AmenityService.getPopularAmenities(limit)
    return NextResponse.json(amenities)
  } catch (error) {
    console.error('Error fetching popular amenities:', error)
    return NextResponse.json(
      { error: 'Failed to fetch popular amenities' },
      { status: 500 }
    )
  }
}