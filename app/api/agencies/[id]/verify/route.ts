import { NextRequest, NextResponse } from 'next/server'
import { AgencyService } from '@/lib/services/agency'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const agency = await AgencyService.verifyAgency(params.id)
    return NextResponse.json(agency)
  } catch (error) {
    console.error('Error verifying agency:', error)
    return NextResponse.json(
      { error: 'Failed to verify agency' },
      { status: 500 }
    )
  }
}