import { OwnerTypeEnum, PropertyTransactionTypeEnum, PropertyTypeEnum, RateTypeEnum } from '@/types/property'
import { z } from 'zod'

export const createPropertySchema = z.object({
  title: z.string().min(1, 'Le titre est requis').max(200, 'Le titre ne peut pas dépasser 200 caractères'),
  description: z.string().min(10, 'La description doit contenir au moins 10 caractères'),
  price: z.number().min(1, 'Le prix doit être supérieur à 0'),
  location: z.string().min(1, 'La localisation est requise'),
  address: z.string().optional(),
  zipCode: z.string().optional(),
  city: z.string(),
  region: z.string().optional(),
  department: z.string().optional(),
  borough: z.string().optional(),
  neighborhood: z.string().optional(),
  area: z.number().min(1, 'La surface doit être supérieure à 0'),
  landArea: z.number().min(0, 'La surface du terrain ne peut pas être négative').optional(),
  rate: z.enum(RateTypeEnum).optional(),
  type: z.enum(PropertyTypeEnum),
  transactionType: z.enum(PropertyTransactionTypeEnum),
  bedrooms: z.number().min(0, 'Le nombre de chambres ne peut pas être négatif').optional(),
  bathrooms: z.number().min(0, 'Le nombre de salles de bain ne peut pas être négatif').optional(),
  floor: z.number().optional(),
  totalFloors: z.number().optional(),
  yearBuilt: z.number().min(1960, 'Année de construction invalide').max(new Date().getFullYear(), 'Année de construction invalide').optional(),
  availableAt: z.date().optional(),
  reference: z.string().optional(),
  agencyReference: z.string().optional(),
  agencyId: z.string().optional(),
  amenities: z.array(z.object({
    amenityId: z.string(),
    area: z.number().min(0, 'La surface ne peut pas être négative').optional(),
    amenityCount: z.number().min(1, 'Le nombre doit être supérieur à 0').optional()
  })).optional(),
  images: z.array(z.object({
    url: z.string().url('URL d\'image invalide'),
    alt: z.string().optional(),
    order: z.number().default(0)
  })).optional(),
  useUserContact: z.boolean().optional(),
  contactFirstName: z.string().optional(),
  contactLastName: z.string().optional(),
  contactEmail: z.string().email('Email de contact invalide').optional(),
  contactPhone: z.string().optional(),
  ownerType: z.enum(OwnerTypeEnum).optional()
})

export const updatePropertySchema = createPropertySchema.partial()

export type CreatePropertyInput = z.infer<typeof createPropertySchema>
export type UpdatePropertyInput = z.infer<typeof updatePropertySchema>