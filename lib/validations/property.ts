import { z } from 'zod'

export const createPropertySchema = z.object({
  title: z.string().min(1, 'Le titre est requis').max(200, 'Le titre ne peut pas dépasser 200 caractères'),
  description: z.string().min(10, 'La description doit contenir au moins 10 caractères'),
  price: z.number().min(1, 'Le prix doit être supérieur à 0'),
  location: z.string().min(1, 'La localisation est requise'),
  address: z.string().optional(),
  postalCode: z.string().optional(),
  city: z.string().optional(),
  type: z.enum(['appartement', 'maison', 'villa', 'bureau_commerce', 'terrain', 'terrain_agricole']),
  transactionType: z.enum(['achat', 'location']),
  bedrooms: z.number().min(0, 'Le nombre de chambres ne peut pas être négatif'),
  bathrooms: z.number().min(0, 'Le nombre de salles de bain ne peut pas être négatif').optional(),
  area: z.number().min(1, 'La surface doit être supérieure à 0'),
  floor: z.number().optional(),
  totalFloors: z.number().optional(),
  yearBuilt: z.number().min(1800, 'Année de construction invalide').max(new Date().getFullYear(), 'Année de construction invalide').optional(),
  energyRating: z.string().optional(),
  availableAt: z.date().optional(),
  publishedAt: z.date().optional(),
  reference: z.string().optional(),
  agencyReference: z.string().optional(),
  views: z.number().min(0, 'Le nombre de vues ne peut pas être négatif').optional(),
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
  })).optional()
})

export const updatePropertySchema = createPropertySchema.partial()

export type CreatePropertyInput = z.infer<typeof createPropertySchema>
export type UpdatePropertyInput = z.infer<typeof updatePropertySchema>