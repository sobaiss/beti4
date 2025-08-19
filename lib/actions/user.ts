'use server'

import { User } from "@/types/user";
import { cookies } from 'next/headers'

export async function getUserProfile(): Promise<User | null> {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('access_token')

    console.log('Access Token:', accessToken)

    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    console.log('--------- url', `${apiUrl}/users/profile`)
    const response = await fetch(`${apiUrl}/users/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken?.value}`
      }
    });

    console.log('Fetch Response:', response)

    if (!response.ok) {
      return null;
    }

    const user = await response.json() as User

    console.log('------- Fetched User:', user)

    return user;
  }
