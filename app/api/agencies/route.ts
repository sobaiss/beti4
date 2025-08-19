import { NextRequest, NextResponse } from 'next/server'
import { CreateAgencySchema } from '@/lib/validations/agency'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate agency data
    const validatedData = CreateAgencySchema.parse({
      ...body,
      email: body.email?.toLowerCase()
    })

    // Create agency via external API
    const publicApiUrl = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${publicApiUrl}/agencies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validatedData)
    });

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: result.message || 'Erreur lors de la création de l\'agence' },
        { status: response.status }
      )
    }

    return NextResponse.json(result, { status: 201 })

  } catch (error) {
    console.error('Agency creation error:', error)
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Données invalides', details: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Erreur lors de la création de l\'agence' },
      { status: 500 }
    )
  }
}