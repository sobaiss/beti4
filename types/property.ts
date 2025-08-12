import { Agency } from "@/types/agency";
import { User } from "@/types/user";

export type PropertyStatusEnum = 'disponible' | 'vendu' | 'loue' | 'desactive' | 'brouillon';
export type PropertyTypeEnum = 'appartement' | 'maison' | 'villa' | 'bureau_commerce' | 'terrain' | 'terrain_agricole';
export type PropertyTransactionTypeEnum = 'achat' | 'location';
export type PropertyAmenityCategoryEnum = 'interieur' | 'exterieur' | 'equipement';

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  address?: string;
  postalCode?: string;
  city?: string;
  type: PropertyTypeEnum;
  transactionType: PropertyTransactionTypeEnum;
  bedrooms: number;
  bathrooms?: number;
  area: number;
  floor?: number;
  totalFloors?: number;
  featured?: boolean;
  yearBuilt?: number;
  energyRating?: string;
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
  createdAt: Date;
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