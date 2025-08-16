import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

function fullUrl(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  let fullUrl = new URL(request.nextUrl.pathname.replace('/api/public', ''), apiUrl).toString()
  if (searchParams.toString()) {
    fullUrl += '?' + searchParams.toString()
  }

  return fullUrl
}

async function fetchHeaderOptions() {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('access_token')

  return {
    'Content-Type': 'application/json',
    ...(accessToken ? { Authorization: `Bearer ${accessToken.value}` } : {})
  }
}

export async function GET(request: NextRequest) {
  try {

    const response = await fetch(fullUrl(request), {
      headers: await fetchHeaderOptions()
    });

    const result = await response.json();

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

    console.log('----- Creating property with body:', body)
    
    const response = await fetch(fullUrl(request), {
      headers: fetchHeaderOptions(),
      body: JSON.stringify(body)
    });

    const result = await response.json();
    return NextResponse.json(result)
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