export type City = {
  pk: string; // Partition key, e.g., "commune"
  sk: string; // Sort key, e.g., "city"
  name: string; // Name of the city
  zip: string; // Postal code of the city
};