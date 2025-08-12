import { NextResponse } from 'next/server'
import { PropertyService } from '@/lib/services/property'

export async function GET() {
  try {
    const properties = await PropertyService.getFeaturedProperties(6)
    return NextResponse.json(properties)
  } catch (error) {
    console.error('Error fetching featured properties:', error)
    return NextResponse.json(
      { error: 'Failed to fetch featured properties' },
      { status: 500 }
    )
  }
}