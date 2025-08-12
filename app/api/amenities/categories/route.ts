import { NextResponse } from 'next/server'
import { AmenityService } from '@/lib/services/amenity'

export async function GET() {
  try {
    const result = await AmenityService.getAmenitiesByCategory()
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching amenities by category:', error)
    return NextResponse.json(
      { error: 'Failed to fetch amenities by category' },
      { status: 500 }
    )
  }
}