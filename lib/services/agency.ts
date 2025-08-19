import { CreateAgencySchema } from "../validations/agency";
import { CreateUserParticulierSchema } from "../validations/user";

export async function createAgency(data: {agency: FormData, user: FormData}) {
  console.log('Creating agency with data:', data);
  const validatedAgencyFields = CreateAgencySchema.safeParse(data.agency);
  const validatedUserFields = CreateUserParticulierSchema.safeParse(data.user);

  console.log('Validated agency fields:', validatedAgencyFields.error);
  console.log('Validated user fields:', validatedUserFields.error);

  if (!validatedAgencyFields.success || !validatedUserFields.success) {
    return {
      errors: {
        ...(validatedAgencyFields.success ? {} : validatedAgencyFields.error?.flatten().fieldErrors ?? {}),
        ...(validatedUserFields.success ? {} : validatedUserFields.error?.flatten().fieldErrors ?? {}),
      },
      message: 'Corriger les erreurs ci-dessous.',
    };
  }

  //const { name, description, email, phone, address, city, postalCode, website } = validatedAgencyFields.data;

  const publicApiUrl = process.env.NEXT_PUBLIC_API_URL;

  console.log('Calling URL:', `${publicApiUrl}/agencies`);
  const response = await fetch(`${publicApiUrl}/agencies`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      agency: validatedAgencyFields.data,
      user: validatedUserFields.data,
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('Error creating agency:', errorData);
    return {
      errors: errorData.errors,
      message: 'Une erreur est survenue lors de la création de l\'agence.',
    };
  }

  return await response.json();
}