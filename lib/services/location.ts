import { City } from "@/types/location";

export async function getCities() {
  const response = await fetch('http://localhost:3000/cities');
  const data = await response.json();

  return data as City[];
};

export async function getLocations(): Promise<City[]> {
  const response = await fetch('http://localhost:3000/locations');
  const data = await response.json();

  return data as City[];
}