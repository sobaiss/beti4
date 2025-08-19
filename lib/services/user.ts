import { createUserSchema, UpdateUserInput, UpdateUserSettingsInput } from '@/lib/validations/user'
import { PaginatedProperty } from '@/types/property';
import { User } from '@/types/user';

export class UserService {
  static async login(email: string, password: string) {
    return await fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: email, password })
    });
  }

  static async getProfile(accessToken: string): Promise<User | null> {
    const response = await fetch('http://localhost:3000/users/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      return null;
    }

    return await response.json() as User;
  }

  static async updateUserInfos(id: string, data: UpdateUserInput) {
    const response = await fetch(`http://localhost:3000/user/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    return response;
  }

  static async updateUserSettings(id: string, data: UpdateUserSettingsInput) {
    const response = await fetch(`http://localhost:3000/user/${id}/settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    return response;
  }

  // @todo change parameter data type
  static async updateUserPassword(id: string, data: Record<string, string>) {
    const response = await fetch(`http://localhost:3000/user/${id}/password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    return response;
  }

  static async updateUserEmail(id: string, newEmail: string) {
    const response = await fetch(`http://localhost:3000/user/${id}/email`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ newEmail })
    });

    return response;
  }

  static async deleteUser(id: string) {
    const response = await fetch(`http://localhost:3000/users/${id}`, {
      method: 'DELETE',
    });

    return response;
  }

  static async createUser(data: FormData) {
    const validatedFields = createUserSchema.safeParse(data);

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Corriger les erreurs ci-dessous.',
      };
    }

    const publicApiUrl = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${publicApiUrl}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validatedFields.data)
    });

    return response;
  }

  static async getUserById(id: string) {
    return await fetch(`http://localhost:3000/user/${id}`);
  }

  static async getUserByEmail(email: string) {
    return await fetch(`http://localhost:3000/user/email/${email}`);
  }

  static async getUserFavorites(page = 1, limit = 12) {
    const queryParams: Record<string, string> = {
      page: `${page}`,
      limit: `${limit}`,
    };

    const response = await fetch('http://localhost:3000/users/properties?' + new URLSearchParams(queryParams).toString());

    if (!response.ok) {
      return null;
    }

    return await response.json() as PaginatedProperty;
  }

  static async updateUserStatus(id: string, action: string) {
    const response = await fetch(`http://localhost:3000/user/${id}/action`, {
      method: 'POST',
    });

    return response;
  }
}