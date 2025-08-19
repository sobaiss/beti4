'use server'

import { User } from "@/types/user";
import { cookies } from 'next/headers'

async function fetchHeaderOptions(accessToken?: string) {
  return {
    'Content-Type': 'application/json',
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
  }
}


export async function getUserProfile(): Promise<User | null> {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('access_token')

    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    const response = await fetch(`${apiUrl}/users/profile`, {
      method: 'GET',
      headers: await fetchHeaderOptions(accessToken?.value)
    });

    // console.log('Fetch Response:', response)

    if (!response.ok) {
        console.error('Erreur lors de la récupération du profil utilisateur:', await response.json());
      return null;
    }

    return await response.json() as User;
  }

  export async function updateUserAvatar(id: string, avatar: string) {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('access_token')
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    const response = await fetch(`${apiUrl}/users/avatar/${id}`, {
      method: 'POST',
      headers: await fetchHeaderOptions(accessToken?.value),
      body: JSON.stringify({ avatar })
    });

    console.log('Fetch Response:', response)

    if (!response.ok) {
      throw new Error('Erreur lors de la mise à jour de l\'avatar');
    }

    return await response.json() as User;
  }

  export async function deleteUserAvatar(id: string) {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('access_token')
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    const response = await fetch(`${apiUrl}/users/avatar/${id}`, {
      method: 'DELETE',
      headers: await fetchHeaderOptions(accessToken?.value)
    });

    console.log('Fetch Response:', response)

    if (!response.ok) {
      throw new Error('Erreur lors de la suppression de l\'avatar');
    }

    return await response.json() as User;
  }
