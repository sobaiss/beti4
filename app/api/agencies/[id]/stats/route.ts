import { NextRequest, NextResponse } from 'next/server'
import { AgencyService } from '@/lib/services/agency'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result = await AgencyService.getAgencyStats(params.id)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching agency stats:', error)
    
    if (error instanceof Error && error.message === 'Agency not found') {
      return NextResponse.json(
        { error: 'Agency not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch agency stats' },
      { status: 500 }
    )
  }
}