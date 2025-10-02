import { z } from 'zod'

export const CreateAgencySchema = z.object({
  name: z.string().min(2, 'Le nom de l\'agence est requis').max(200, 'Le nom ne peut pas dépasser 200 caractères'),
  description: z.string().max(500, 'La description ne peut pas dépasser 500 caractères').optional(),
  address: z.string().max(200, 'L\'adresse ne peut pas dépasser 200 caractères').optional(),
  city: z.string().max(100, 'La ville ne peut pas dépasser 100 caractères').optional(),
  zipCode: z.string().max(10, 'Le code postal ne peut pas dépasser 10 caractères').optional(),
  phone: z.string().regex(/^[1-9]{1}[0-9]{7}$/, {
    message: 'Entrez un numéro de téléphone valide.',
  }),
  email: z.string().email('Adresse email invalide').optional(),
  website: z.string().optional()
})


export type CreateAgencyInput = z.infer<typeof CreateAgencySchema>
