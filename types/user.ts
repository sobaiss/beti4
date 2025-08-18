import { PropertyFavorite } from "@/types/property";
import { Agency } from "./agency";

export type UserTypeEnum = 'particulier' | 'professionnel' | 'interne' | 'admin';
export type UserStatusEnum = 'attente_validation' | 'valide' | 'verifie' | 'bloque';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  userType: UserTypeEnum;
  avatar?: string;
  status: UserStatusEnum;
  validatedAt?: Date;
  verifiedAt?: Date;
  lockedAt?: Date;
  createdAt: Date;
  updatedAt?: Date;
  password?: string; // Ensure this is hashed in the database

  agencyId?: string;
  agency?: Agency;
  isMainContact?: boolean;

  // Preferencess
  acceptMarketing: boolean;
  settings?: UserSettings;
  favoriteProperties: PropertyFavorite[];
  savedSearches: SavedSearch[];
  rights?: Right[];
}

export interface UserSettings {
  id: string;
  acceptEmailContact: boolean;
  acceptPhoneContact: boolean;
  displayEmail: boolean;
  displayPhone: boolean;
  createdAt: Date;
  updatedAt?: Date;
  userId: string;
  user?: User;
}
export interface SavedSearch {
  id: string;
  name: string;
  filters: {
    location?: string;
    propertyTypes?: string[];
    transactionType?: string;
    priceRange?: [number, number];
    areaRange?: [number, number];
    bedrooms?: string;
  };
  createdAt: Date;
  alertsEnabled: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface Right {
  id: string;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserRight {
  id: string;
  userId: string;
  rightId: string;
  createdAt: Date;
  user?: User;
  right?: Right;
}