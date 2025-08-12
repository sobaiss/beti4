import { z } from 'zod'

export const createUserSchema = z.object({
  email: z.string().email('Adresse email invalide'),
  firstName: z.string().min(1, 'Le prénom est requis').max(50, 'Le prénom ne peut pas dépasser 50 caractères'),
  lastName: z.string().min(1, 'Le nom est requis').max(50, 'Le nom ne peut pas dépasser 50 caractères'),
  phone: z.string().max(20, 'Le numéro de téléphone ne peut pas dépasser 20 caractères').optional().default(''),
  userType: z.enum(['particulier', 'professionnel']).default('particulier'),
  avatar: z.string().url('URL d\'avatar invalide').optional(),
  status: z.enum(['attente_validation', 'valide', 'verifie', 'bloque']).default('attente_validation'),
  
  // Agency
  agencyId: z.string().optional(),
  
  // Preferences
  acceptMarketing: z.boolean().default(false),
  
  // Password is optional for OAuth users
  password: z.string().optional()
})

export const signInSchema = z.object({
  email: z.string().email('Adresse email invalide'),
  password: z.string().min(1, 'Le mot de passe est requis'),
  rememberMe: z.boolean().optional()
})

export const userSettingsSchema = z.object({
  acceptEmailContact: z.boolean().default(true),
  acceptPhoneContact: z.boolean().default(true),
  displayEmail: z.boolean().default(false),
  displayPhone: z.boolean().default(false)
})
export const updateUserSchema = createUserSchema.partial()

export const updateUserSettingsSchema = userSettingsSchema.partial()
export const savedSearchSchema = z.object({
  name: z.string().min(1, 'Le nom de la recherche est requis').max(100, 'Le nom ne peut pas dépasser 100 caractères'),
  filters: z.object({
    location: z.string().optional(),
    propertyTypes: z.array(z.string()).optional(),
    transactionType: z.string().optional(),
    priceRange: z.tuple([z.number(), z.number()]).optional(),
    areaRange: z.tuple([z.number(), z.number()]).optional(),
    bedrooms: z.string().optional()
  }),
  alertsEnabled: z.boolean().default(false)
})

export const createRightSchema = z.object({
  name: z.string().min(1, 'Le nom du droit est requis').max(100, 'Le nom ne peut pas dépasser 100 caractères')
})

export const updateRightSchema = createRightSchema.partial()

export const assignRightSchema = z.object({
  rightIds: z.array(z.string()).min(1, 'Au moins un droit doit être sélectionné')
})

export type CreateUserInput = z.infer<typeof createUserSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>
export type UserSettingsInput = z.infer<typeof userSettingsSchema>
export type UpdateUserSettingsInput = z.infer<typeof updateUserSettingsSchema>
export type SignInInput = z.infer<typeof signInSchema>
export type SavedSearchInput = z.infer<typeof savedSearchSchema>
export type CreateRightInput = z.infer<typeof createRightSchema>
export type UpdateRightInput = z.infer<typeof updateRightSchema>
export type AssignRightInput = z.infer<typeof assignRightSchema>