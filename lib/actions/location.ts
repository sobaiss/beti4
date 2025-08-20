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
  const response = await fetch(`${apiUrl()}/cities`);
  const data = await response.json();

  return data as City[];
};

export async function getLocations(): Promise<City[]> {
  const response = await fetch(`${apiUrl()}/locations`);
  const data = await response.json();

  return data as City[];
}