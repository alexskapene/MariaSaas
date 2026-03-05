import { z } from 'zod'
import { UserRole } from '../types'

// ─────────────────────────────────────────────────────────────────────────────
// 1. Schéma pour la CRÉATION d'un utilisateur (par un admin)
// ─────────────────────────────────────────────────────────────────────────────
export const createUserSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit faire 6 caractères min'),
  role: z.nativeEnum(UserRole)
})

// ─────────────────────────────────────────────────────────────────────────────
// 2. Schéma pour la MODIFICATION d'un utilisateur (par un admin)
//    → Peut changer le rôle, mot de passe optionnel, pas de confirmation
// ─────────────────────────────────────────────────────────────────────────────
export const updateUserSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  role: z.nativeEnum(UserRole).optional()
})

// ─────────────────────────────────────────────────────────────────────────────
// 3. Schéma pour la MODIFICATION DU PROFIL (par l'utilisateur connecté lui-même)
//    → Rôle non modifiable, champs personnels + confirmation mot de passe
// ─────────────────────────────────────────────────────────────────────────────
export const updateProfileSchema = z
  .object({
    userId: z.string().min(1, "L'ID utilisateur est requis"),

    name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères').optional(),

    email: z.string().email('Email invalide').optional(),

    phone: z
      .string()
      .regex(/^[+\d\s\-().]{6,20}$/, 'Numéro de téléphone invalide')
      .optional()
      .or(z.literal('')),

    avatar: z.string().url('URL avatar invalide').optional().or(z.literal('')),

    password: z
      .string()
      .min(6, 'Le mot de passe doit contenir au moins 6 caractères')
      .optional()
      .or(z.literal('')),

    passwordConfirm: z.string().optional().or(z.literal(''))
  })
  .refine(
    (data) => {
      if (data.password && data.password !== '') {
        return data.password === data.passwordConfirm
      }
      return true
    },
    {
      message: 'Les mots de passe ne correspondent pas',
      path: ['passwordConfirm']
    }
  )

// ─────────────────────────────────────────────────────────────────────────────
// Types TypeScript inférés
// ─────────────────────────────────────────────────────────────────────────────
export type CreateUserInput = z.infer<typeof createUserSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
