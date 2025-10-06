import { Agency } from "@/types/agency";
import { User } from "@/types/user";

export enum PropertyStatusEnum {
  disponible = 'disponible',
  vendu = 'vendu',
  loue = 'loue',
  desactive = 'desactive',
  brouillon = 'brouillon'
};

export enum PropertyTransactionTypeEnum {
  achat = 'achat',
  location = 'location'
};
export enum PropertyAmenityCategoryEnum {
  interieur = 'interieur',
  exterieur = 'exterieur',
  equipement = 'equipement',
};

export enum OwnerTypeEnum {
  particulier = 'particulier',
  professionnel = 'professionnel'
};
export enum RateTypeEnum {
  jour = 'jour',
  semaine = 'semaine',
  mois = 'mois',
  an = 'an',
  heure = 'heure',
  trimestre = 'trimestre',
  semestre = 'semestre',
  unique = 'unique'
};

export enum PropertyTypeEnum {
  appartement = 'appartement',
  maison = 'maison',
  terrain = 'terrain',
  bureau = 'bureau',
  commerce = 'commerce',
  parking = 'parking',
  autre = 'autre'
};

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
  useUserContact?: boolean;
  agency?: Agency;
  images?: PropertyImage[];
  amenities?: PropertyAmenity[];
  favorites?: PropertyFavorite[];
  contact?: PropertyContact;
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

export type PropertyContact = {
  id: string;
  phone?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  propertyId: string;
  property?: Property;
}