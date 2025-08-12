import { z } from 'zod'

export const createAgencySchema = z.object({
  name: z.string().min(1, 'Le nom de l\'agence est requis').max(100, 'Le nom ne peut pas dépasser 100 caractères'),
  description: z.string().max(500, 'La description ne peut pas dépasser 500 caractères').optional(),
  address: z.string().max(200, 'L\'adresse ne peut pas dépasser 200 caractères').optional(),
  city: z.string().max(100, 'La ville ne peut pas dépasser 100 caractères').optional(),
  postalCode: z.string().max(10, 'Le code postal ne peut pas dépasser 10 caractères').optional(),
  phone: z.string().max(20, 'Le téléphone ne peut pas dépasser 20 caractères').optional(),
  email: z.string().email('Adresse email invalide').optional(),
  website: z.string().url('URL du site web invalide').optional(),
  logo: z.string().url('URL du logo invalide').optional(),
  status: z.enum(['attente_validation', 'verifie', 'bloque']).default('attente_validation')
})

export const updateAgencySchema = createAgencySchema.partial()

export type CreateAgencyInput = z.infer<typeof createAgencySchema>
export type UpdateAgencyInput = z.infer<typeof updateAgencySchema>