'use server'

import { Amenity } from "@/types/property";

function apiUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (!url) {
    throw new Error('NEXT_PUBLIC_API_URL is not defined');
  }
  return url;
}

export async function getAmenities(): Promise<Amenity[]> {
  const response = await fetch(`${apiUrl()}/amenities`);
  if (response.ok) {
    return await response.json() as Amenity[];
  }

  return [] as Amenity[];
}
