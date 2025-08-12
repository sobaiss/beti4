import { NextRequest, NextResponse } from 'next/server'
import { PropertyService } from '@/lib/services/property'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const property = await PropertyService.incrementPropertyViews(params.id)

    return NextResponse.json({
      success: true,
      views: property.views,
      message: 'Vue enregistrée avec succès'
    })
  } catch (error) {
    console.error('Error incrementing property views:', error)
    
    if (error instanceof Error && error.message === 'Property not found') {
      return NextResponse.json(
        { error: 'Propriété non trouvée' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { error: 'Erreur lors de l\'enregistrement de la vue' },
      { status: 500 }
    )
  }
}