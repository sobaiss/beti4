import { NextRequest, NextResponse } from 'next/server'
import { PropertyService } from '@/lib/services/property'
import { createPropertySchema } from '@/lib/validations/property'
import { PropertyType, TransactionType } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Parse filters
    const location = searchParams.get('location') || undefined
    const propertyTypesParam = searchParams.get('propertyTypes')
    const propertyTypes = propertyTypesParam ? propertyTypesParam.split(',') as PropertyType[] : undefined
    const transactionType = searchParams.get('transactionType') as TransactionType || undefined
    const priceMin = searchParams.get('priceMin')
    const priceMax = searchParams.get('priceMax')
    const areaMin = searchParams.get('areaMin')
    const areaMax = searchParams.get('areaMax')
    const bedrooms = searchParams.get('bedrooms')
    
    // Parse pagination
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    
    // Parse sorting
    const sortField = searchParams.get('sortField') as 'price' | 'area' | 'createdAt' || 'createdAt'
    const sortDirection = searchParams.get('sortDirection') as 'asc' | 'desc' || 'desc'

    const filters = {
      location,
      propertyTypes,
      transactionType,
      priceRange: (priceMin && priceMax) ? [parseInt(priceMin), parseInt(priceMax)] as [number, number] : undefined,
      areaRange: (areaMin && areaMax) ? [parseInt(areaMin), parseInt(areaMax)] as [number, number] : undefined,
      bedrooms: bedrooms ? parseInt(bedrooms) : undefined
    }

    const result = await PropertyService.getProperties(
      filters,
      { field: sortField, direction: sortDirection },
      page,
      limit
    )

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching properties:', error)
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // TODO: Get user ID from authentication
    const ownerId = body.ownerId || 'temp-user-id'
    
    const validatedData = createPropertySchema.parse(body)
    
    const property = await PropertyService.createProperty({
      ...validatedData,
      ownerId
    })

    return NextResponse.json(property, { status: 201 })
  } catch (error) {
    console.error('Error creating property:', error)
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.message },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create property' },
      { status: 500 }
    )
  }
}