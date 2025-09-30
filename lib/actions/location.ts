'use server'

import { City } from "@/types/location";

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
    return await response.json() as City[];
  }

  return [] as City[];
};

export async function getLocations(): Promise<City[]> {
  const response = await fetch(`${apiUrl()}/locations`);
  if (response.ok) {
    return await response.json() as City[];
  }

  return [] as City[];
}
