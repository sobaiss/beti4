import { PaginatedProperty, Property } from '@/types/property'

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

export class PropertyService {
  static async getProperties(filters: PropertyFilters = {}, page = 1, limit = 12/* , sort: PropertySortOptions = { field: 'createdAt', direction: 'desc' } */) {
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

    const response = await fetch('/api/public/properties?' + new URLSearchParams(queryParams).toString())

    if (!response.ok) {
      return null;
    }

    return await response.json() as PaginatedProperty;
  }

  static async getPropertyById(id: string): Promise<Property | null> {
    const response = await fetch(`/api/public/properties/id/${id}`)

    if (!response.ok) {
      return null;
    }

    return await response.json() as Property;
  }

  static async getPropertyByIdFromServer(id: string): Promise<Property | null> {
    const publicApiUrl = process.env.NEXT_PUBLIC_API_URL;

    const response = await fetch(`${publicApiUrl}/properties/${id}`)

    if (!response.ok) {
      return null;
    }

    return await response.json() as Property;
  }

  static async getFeaturedProperties(limit = 6): Promise<PaginatedProperty | null> {
    const response = await fetch('/api/public/properties/featured?' + new URLSearchParams({ limit: String(limit) }).toString())

    if (!response.ok) {
      return null;
    }

    return await response.json() as PaginatedProperty;
  }

  static async deleteUserProperty(id: string, ownerId: string) {
    const response = await fetch(`/api/public/properties/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ownerId })
    });

    return response;
  }

  static async incrementViewCount(id: string) {
    const publicApiUrl = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${publicApiUrl}/properties/increment-views/${id}`, {
      method: 'POST',
    });

    return response;
  }
}
