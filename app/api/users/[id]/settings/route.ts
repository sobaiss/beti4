import { NextRequest, NextResponse } from 'next/server'
import { UserService } from '@/lib/services/user'
import { updateUserSettingsSchema } from '@/lib/validations/user'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const settings = await UserService.getUserSettings(params.id)
    
    if (!settings) {
      // Create default settings if they don't exist
      const defaultSettings = await UserService.createDefaultUserSettings(params.id)
      return NextResponse.json(defaultSettings)
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error fetching user settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user settings' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const validatedData = updateUserSettingsSchema.parse(body)
    
    const settings = await UserService.updateUserSettings(params.id, validatedData)
    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error updating user settings:', error)
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.message },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to update user settings' },
      { status: 500 }
    )
  }
}