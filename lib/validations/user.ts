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

export const CreateUserParticulierSchema = z.object({
  firstName: z.string().min(2, 'Le prénom est requis').optional().or(z.literal('')),
  lastName: z.string().min(2, 'Le nom est requis').optional().or(z.literal('')),
  email: z.string({
    invalid_type_error: 'Entrez une adresse e-mail valide.',
  }),
  phone: z.string().regex(/^[6-9]{1}[0-9]{7}$/, {
    message: 'Entrez un numéro de téléphone valide.',
  }),
  password: z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/, {
    message: 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre.',
  }),
  confirmPassword: z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/, {
    message: 'Confirmez votre mot de passe.',
  }),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: 'Vous devez accepter les conditions d\'utilisation.',
  }),
  acceptMarketing: z.boolean(),
}).superRefine(({ confirmPassword, password }, ctx) => {
  if (confirmPassword !== password) {
    ctx.addIssue({
      code: "custom",
      message: "Les mots de passe ne correspondent pas",
      path: ['confirmPassword']
    });
  }
});

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