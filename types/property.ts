import { Agency } from "@/types/agency";
import { User } from "@/types/user";

export type PropertyStatusEnum = 'disponible' | 'vendu' | 'loue' | 'desactive' | 'brouillon';
export type PropertyTypeEnum = 'appartement' | 'maison' | 'villa' | 'bureau_commerce' | 'terrain' | 'terrain_agricole';
export type PropertyTransactionTypeEnum = 'achat' | 'location';
export type PropertyAmenityCategoryEnum = 'interieur' | 'exterieur' | 'equipement';
export type OwnerTypeEnum = 'particulier' | 'professionnel';
export type RateTypeEnum = 'jour' | 'semaine' | 'mois' | 'an' | 'heure' | 'trimestre' | 'semestre' | 'unique';

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  rate?: RateTypeEnum;
  location: string;
  address?: string;
  zipCode?: string;
  city?: string;
  borough?: string;
  neighborhood?: string;
  type: PropertyTypeEnum;
  transactionType: PropertyTransactionTypeEnum;
  rooms?: number;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  landArea?: number;
  floor?: number;
  totalFloors?: number;
  featured?: boolean;
  yearBuilt?: number;
  availableAt?: Date;
  publishedAt?: Date;
  reference?: string;
  agencyReference?: string;
  views?: number;
  status: PropertyStatusEnum;
  createdAt: Date;
  updatedAt?: Date;
  ownerId: string
  owner?: User;
  agencyId?: string;
  agency?: Agency;
  images?: PropertyImage[];
  amenities?: PropertyAmenity[];
  favorites?: PropertyFavorite[];
  _count?: {
    favorites: number;
  };
}
export interface Amenity {
  id: string;
  name: string;
  category: PropertyAmenityCategoryEnum;
  createdAt?: Date;
  updatedAt?: Date;
  properties?: PropertyAmenity[];
}

export interface PropertyAmenity {
  id: string;
  area?: number;
  amenityCount?: number;
  createdAt: Date;
  propertyId: string;
  property?: Property;
  amenityId: string;
  amenity?: Amenity;
}

export interface PropertyImage {
  id: string;
  url: string;
  alt?: string;
  order: number;
  createdAt: Date;
  propertyId?: string;
  property?: Property;
}

export interface PropertyFavorite {
  id: string;
  createdAt: Date;
  userId: string;
  user?: User;
  propertyId: string;
  property?: Property;
}

export type PaginatedProperty = {
  properties: Property[];
  pagination: {
    total: number;
    page: number;
    pages: number;
    limit: number;
  };
}