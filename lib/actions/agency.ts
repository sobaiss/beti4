'use server'

import { CreateAgencyInput, createAgencySchema } from "../validations/agency";
import { CreateUserInput, createUserSchema } from "../validations/user";
import { z } from 'zod';

function apiUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (!url) {
    throw new Error('NEXT_PUBLIC_API_URL is not defined');
  }
  return url;
}


export async function createAgency(data: {agency: CreateAgencyInput, user: CreateUserInput}) {
  console.log('Creating agency with data:', data);
  const validatedAgencyFields = createAgencySchema.safeParse(data.agency);
  const validatedUserFields = createUserSchema.safeParse(data.user);

  console.log('Validated agency fields:', validatedAgencyFields.error);
  console.log('Validated user fields:', validatedUserFields.error);

  if (!validatedAgencyFields.success || !validatedUserFields.success) {
    return {
      errors: {
        ...(validatedAgencyFields.success ? {} : z.flattenError(validatedAgencyFields.error).fieldErrors ?? {}),
        ...(validatedUserFields.success ? {} : z.flattenError(validatedUserFields.error).fieldErrors ?? {}),
      },
      message: 'Corriger les erreurs ci-dessous.',
    };
  }

  const response = await fetch(`${apiUrl()}/agencies`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      agency: validatedAgencyFields.data,
      user: validatedUserFields.data,
    })
  });

  const responseData = await response.json();
  if (!response.ok) {
    return {
      errors: responseData.errors ?? {},
      message: responseData.message ?? 'Une erreur est survenue lors de la création de l\'agence.',
    };
  }

  return responseData;
}