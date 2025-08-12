import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcrypt'
import { createUserSchema } from '@/lib/validations/user'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { password, confirmPassword, ...userData } = body

    // Validate passwords match
    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Les mots de passe ne correspondent pas' },
        { status: 400 }
      )
    }

    // Validate user data
    const validatedData = createUserSchema.parse({
      ...userData,
      email: userData.email.toLowerCase()
    })

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Un compte avec cette adresse email existe déjà' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        ...validatedData,
        password: hashedPassword,
        settings: {
          create: {
            acceptEmailContact: true,
            acceptPhoneContact: true,
            displayEmail: false,
            displayPhone: false
          }
        }
      },
      include: {
        settings: true
      }
    })

    // Return user data (excluding password)
    const userResponse = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      userType: user.userType,
      avatar: user.avatar,
      status: user.status,
      acceptMarketing: user.acceptMarketing,
      settings: user.settings,
      createdAt: user.createdAt
    }

    return NextResponse.json({
      success: true,
      message: 'Compte créé avec succès',
      user: userResponse
    }, { status: 201 })

  } catch (error) {
    console.error('Registration error:', error)
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Données invalides', details: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Erreur lors de la création du compte' },
      { status: 500 }
    )
  }
}