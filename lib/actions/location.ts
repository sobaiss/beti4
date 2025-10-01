'use server'

import { Location } from "@/types/location";

function apiUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (!url) {
    throw new Error('NEXT_PUBLIC_API_URL is not defined');
  }
  return url;
}


export async function getCities() {
  const response = await fetch(`${apiUrl()}/locations/cities`);
  if (response.ok) {
    return await response.json() as Location[];
  }

  return [] as Location[];
};

export async function getLocations(): Promise<Location[]> {
  const response = await fetch(`${apiUrl()}/locations`);
  if (response.ok) {
    return await response.json() as Location[];
  }

  return [] as Location[];
}
