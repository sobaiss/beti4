'use server'

import { PaginatedProperty, Property } from '@/types/property'
import { cookies } from 'next/headers'
import { CreatePropertyInput, createPropertySchema } from '../validations/property'

export interface PropertyFilters {
  location?: string
  propertyTypes?: string
  transactionType?: string
  // priceRange?: [number, number]
  // areaRange?: [number, number]
  bedrooms?: number
  status?: string
  owner?: string
}

export interface PropertySortOptions {
  field: 'price' | 'area' | 'createdAt'
  direction: 'asc' | 'desc'
}

function apiUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (!url) {
    throw new Error('NEXT_PUBLIC_API_URL is not defined');
  }
  return url;
}

async function fetchHeaderOptions() {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('access_token')
  return {
    'Content-Type': 'application/json',
    ...(accessToken ? { Authorization: `Bearer ${accessToken.value}` } : {})
  }
}

export async function createProperty(data: CreatePropertyInput) {
  const validatedFields = createPropertySchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Corriger les erreurs ci-dessous.',
    };
  }

  const response = await fetch(`${apiUrl()}/properties`, {
    method: 'POST',
    headers: await fetchHeaderOptions(),
    body: JSON.stringify(validatedFields.data)
  });

  const responseData = await response.json();

  if (!response.ok) {
    return {
      errors: responseData.errors || {},
      message: responseData.message || 'Erreur lors de la création de la propriété.',
    };
  }

  return responseData;
}

  export async function getProperties(filters: PropertyFilters = {}, page = 1, limit = 12/* , sort: PropertySortOptions = { field: 'createdAt', direction: 'desc' } */) {
    const queryParams: Record<string, string> = {
      page: `${page}`,
      limit: `${limit}`,
      ...(filters.location ? { location: filters.location } : {}),
      ...(filters.propertyTypes ? { propertyTypes: filters.propertyTypes } : {}),
      ...(filters.transactionType ? { transactionType: filters.transactionType } : {}),
      ...(filters.bedrooms !== undefined ? { bedrooms: String(filters.bedrooms) } : {}),
      ...(filters.status ? { status: filters.status } : {}),
      ...(filters.owner ? { owner: filters.owner } : {})
    };

    const response = await fetch(`${apiUrl()}/properties?` + new URLSearchParams(queryParams).toString())

    if (!response.ok) {
      return {properties: [], pagination: { total: 0, page: 1, limit: 12 }};
    }

    return await response.json() as PaginatedProperty;
  }

  export async function getPropertyById(id: string): Promise<Property | null> {
    const response = await fetch(`${apiUrl()}/properties/id/${id}`)

    if (!response.ok) {
      return null;
    }

    return await response.json() as Property;
  }

  export async function getFeaturedProperties(limit = 6): Promise<PaginatedProperty | null> {
    const response = await fetch(`${apiUrl()}/properties/featured?` + new URLSearchParams({ limit: String(limit) }).toString())

    if (!response.ok) {
      return null;
    }

    return await response.json() as PaginatedProperty;
  }

  export async function deleteUserProperty(id: string, ownerId: string) {
    const response = await fetch(`${apiUrl()}/properties/${id}`, {
      method: 'DELETE',
      headers: await fetchHeaderOptions(),
      body: JSON.stringify({ ownerId })
    });

    return response;
  }

  export async function incrementViewCount(id: string) {
    const response = await fetch(`${apiUrl()}/properties/increment-views/${id}`, {
      method: 'POST',
    });

    return response;
  }
