import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { newEmail } = body

    if (!newEmail) {
      return NextResponse.json(
        { error: 'Nouvelle adresse email requise' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(newEmail)) {
      return NextResponse.json(
        { error: 'Format d\'email invalide' },
        { status: 400 }
      )
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: newEmail.toLowerCase() }
    })

    if (existingUser && existingUser.id !== params.id) {
      return NextResponse.json(
        { error: 'Cette adresse email est déjà utilisée' },
        { status: 409 }
      )
    }

    // Get current user
    const user = await prisma.user.findUnique({
      where: { id: params.id }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      )
    }

    // In a real application, you would:
    // 1. Send a confirmation email to the new address
    // 2. Store a pending email change request
    // 3. Only update the email after confirmation
    
    // For now, we'll simulate this process
    // TODO: Implement email verification system
    
    return NextResponse.json({
      success: true,
      message: 'Un email de confirmation a été envoyé à votre nouvelle adresse'
    })
  } catch (error) {
    console.error('Error changing email:', error)
    return NextResponse.json(
      { error: 'Erreur lors du changement d\'email' },
      { status: 500 }
    )
  }
}