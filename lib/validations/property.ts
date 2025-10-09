import { OwnerTypeEnum, PropertyTransactionTypeEnum, PropertyTypeEnum, RateTypeEnum } from '@/types/property'
import { z } from 'zod'
import { ALLOWED_IMAGE_TYPES, MAX_FILE_SIZE, MAX_IMAGE_COUNT } from '../config';

export const createPropertySchema = z.object({
  address: z.string().optional(),
  agencyId: z.string().optional(),
  agencyReference: z.string().optional(),
  amenities: z.array(z.object({
    amenityId: z.string(),
    area: z.number().min(0, 'La surface ne peut pas être négative').optional(),
    amenityCount: z.number().min(1, 'Le nombre doit être supérieur à 0').optional()
  })).optional(),
  area: z.number().min(1, 'La surface doit être supérieure à 0').optional(),
  availableAt: z.date('Date de disponibilité invalide'),
  bathrooms: z.number().min(0, 'Le nombre de salles de bain doit être supérieur ou égal à 0').optional(),
  bedrooms: z.number().min(0, 'Le nombre de chambres doit être supérieur ou égal à 0').optional(),
  borough: z.string().optional(),
  city: z.string('La ville est requise').min(2, 'La ville doit contenir au moins 2 caractères').max(100, 'La ville ne peut pas dépasser 100 caractères'),
  contact: z.object({
    firstName: z.string().min(1, 'Le prénom est requis'),
    lastName: z.string().min(1, 'Le nom est requis'),
    email: z.string().email('Email de contact invalide'),
    phone: z.string().optional()
  }).optional(),
  department: z.string().optional(),
  description: z.string('La description est requise').min(10, 'La description doit contenir au moins 10 caractères'),
  floor: z.number().min(0, 'L\'étage ne peut pas être négatif').optional(),
  images: z.array(z.object({
    url: z.string('URL d\'image invalide'),
    alt: z.string().optional(),
    order: z.number().default(1)
  })).optional(),
  landArea: z.number().min(1, 'La surface du terrain doit être supérieure à 0').optional(),
  location: z.string('La localisation est requise').min(3, 'La localisation est requise'),
  neighborhood: z.string().optional(),
  ownerType: z.enum(OwnerTypeEnum).optional(),
  price: z.number('Le prix est requis').min(1, 'Le prix doit être supérieur à 0'),
  propertyType: z.enum(PropertyTypeEnum),
  rate: z.enum(RateTypeEnum, 'Le type de tarif est requis').optional(),
  reference: z.string().optional(),
  region: z.string().optional(),
  rooms: z.number().min(1, 'Le nombre de pièces doit être supérieur à 0').optional(),
  title: z.string('Le titre est requis').min(3, 'Le titre doit contenir au moins 3 caractères').max(200, 'Le titre ne peut pas dépasser 200 caractères'),
  totalFloors: z.number().min(0, 'Le nombre total d\'étages ne peut pas être négatif').optional(),
  transactionType: z.enum(PropertyTransactionTypeEnum),
  useUserContact: z.boolean().optional(),
  yearBuilt: z.number().min(1900, 'Année de construction invalide').max(new Date().getFullYear(), 'Année de construction invalide').optional(),
  zipCode: z.string().optional(),
})

export const updatePropertySchema = createPropertySchema.partial()

export const updatePropertyTypeSchema = createPropertySchema.pick({
  propertyType: true,
  transactionType: true,
});

export const updatePropertyLocationSchema = createPropertySchema.pick({
  location: true,
  address: true,
  zipCode: true,
  city: true,
  region: true,
  department: true,
  borough: true,
  neighborhood: true,
});

export const updatePropertyCaracteristicsSchema = createPropertySchema.pick({
  title: true,
  description: true,
  area: true,
  landArea: true,
  rooms: true,
  bedrooms: true,
  bathrooms: true,
  floor: true,
  yearBuilt: true,
  amenities: true,
});

export const updatePropertyPriceSchema = createPropertySchema.pick({
  price: true,
  rate: true,
  availableAt: true,
});

export const createPropertyImagesSchema = z.object({
  images: z.array(z.instanceof(File).refine((file) => file.size <= MAX_FILE_SIZE, {
    message: 'La taille de l\'image ne peut pas dépasser 5MB',
  }).refine((file) => ALLOWED_IMAGE_TYPES.includes(file.type), {
    message: 'Format d\'image invalide. Seuls les formats JPEG, PNG, JPG et WEBP sont autorisés.',
  })
  ).min(1, 'Au moins une image est requise')
  .max(MAX_IMAGE_COUNT, `Vous ne pouvez pas télécharger plus de ${MAX_IMAGE_COUNT} images`)
});

export const createPropertyContactSchema = z.object({
  contactFirstName: z.string().min(1, 'Le prénom est requis'),
  contactLastName: z.string().min(1, 'Le nom est requis'),
  contactEmail: z.email('Adresse e-mail invalide'),
  contactPhone: z.string().regex(/^[6-9]{1}[0-9]{7}$/, {
    message: 'Entrez un numéro de téléphone valide.',
  })
});

export type CreatePropertyInput = z.infer<typeof createPropertySchema>
export type UpdatePropertyInput = z.infer<typeof updatePropertySchema>