'use server'

import { User } from "@/types/user";
import { cookies } from 'next/headers'
import { ChangeUserPasswordInput, changeUserPasswordSchema, UpdateUserInput, updateUserSchema, UpdateUserSettingsInput } from "../validations/user";

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

    if (!response.ok) {
        throw new Error('Erreur lors de la suppression de l\'avatar');
    }

    return await response.json() as User;
}

export async function updateUserInfos(id: string, data: UpdateUserInput) {
    const validatedFields = updateUserSchema.safeParse(data);

    if (!validatedFields.success) {
    return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Corriger les erreurs ci-dessous.',
    };
    }

    const cookieStore = await cookies()
    const accessToken = cookieStore.get('access_token')
    const apiUrl = process.env.NEXT_PUBLIC_API_URL

    const response = await fetch(`${apiUrl}/users/${id}`, {
    method: 'PATCH',
    headers: {
        'Content-Type': 'application/json',
        ...(accessToken ? { Authorization: `Bearer ${accessToken.value}` } : {})
    },
        body: JSON.stringify(validatedFields.data)
    });

    const responseData = await response.json();

    if (!response.ok) {
        return {
            errors: responseData.errors || {},
            message: 'Erreur lors de la mise à jour des informations utilisateur.',
        }
    }

    return await response.json();
}

export async function updateUserSettings(id: string, data: UpdateUserSettingsInput) {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('access_token')
    const apiUrl = process.env.NEXT_PUBLIC_API_URL

    const response = await fetch(`${apiUrl}/users/settings/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken ? { Authorization: `Bearer ${accessToken.value}` } : {})
      },
      body: JSON.stringify(data)
    });

    const responseData = await response.json();
    if (!response.ok) {
        return {
            errors: responseData.errors || {},
            message: 'Erreur lors de la mise à jour des préférences de confidentialité.',
        }
    }

    return responseData as User;
  }

export async function deleteUser(id: string) {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('access_token')
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    const response = await fetch(`${apiUrl}/users/${id}`, {
      method: 'DELETE',
      headers: await fetchHeaderOptions(accessToken?.value)
    });

    if (!response.ok) {
        const responseData = await response.json();

        return {
            errors: responseData.errors || {},
            message: 'Erreur lors de la suppression du compte.',
        }
    }

    return {};
  }

export async function changeAccountRequest(id: string, newEmail: string) {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('access_token')
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    const response = await fetch(`${apiUrl}/users/change-account-request/${id}`, {
      method: 'POST',
      headers: await fetchHeaderOptions(accessToken?.value),
      body: JSON.stringify({ newEmail })
    });

    const responseData = await response.json();
    if (!response.ok) {
        return {
            errors: responseData.errors || {},
            message: 'Erreur lors de la création de la demande de changement d\'email.',
        }
    }

    return responseData;
  }

export async function changePassword(id: string, data: ChangeUserPasswordInput) {
    const validatedFields = changeUserPasswordSchema.safeParse(data);

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Corriger les erreurs ci-dessous.',
        };
    }

    const cookieStore = await cookies()
    const accessToken = cookieStore.get('access_token')
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    const response = await fetch(`${apiUrl}/users/change-password/${id}`, {
      method: 'PATCH',
      headers: await fetchHeaderOptions(accessToken?.value),
      body: JSON.stringify({ password: data.password, oldPassword: data.currentPassword })
    });

    const responseData = await response.json();

    if (!response.ok) {
        return {
            errors: responseData.errors || {},
            message: 'Erreur lors de la création de la demande de changement de mot de passe.',
        }
    }

    return responseData;
  }