import { NextRequest, NextResponse } from 'next/server'
import { AgencyService } from '@/lib/services/agency'
import { createAgencySchema } from '@/lib/validations/agency'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const result = await AgencyService.getAgencies(page, limit)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching agencies:', error)
    return NextResponse.json(
      { error: 'Failed to fetch agencies' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createAgencySchema.parse(body)
    
    const agency = await AgencyService.createAgency(validatedData)
    return NextResponse.json(agency, { status: 201 })
  } catch (error) {
    console.error('Error creating agency:', error)
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.message },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create agency' },
      { status: 500 }
    )
  }
}