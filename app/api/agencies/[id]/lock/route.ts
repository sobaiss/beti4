import { NextRequest, NextResponse } from 'next/server'
import { AgencyService } from '@/lib/services/agency'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const agency = await AgencyService.lockAgency(params.id)
    return NextResponse.json(agency)
  } catch (error) {
    console.error('Error locking agency:', error)
    return NextResponse.json(
      { error: 'Failed to lock agency' },
      { status: 500 }
    )
  }
}