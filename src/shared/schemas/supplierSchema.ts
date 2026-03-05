import { z } from 'zod'

export const createSupplierSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  // On utilise transform pour convertir les chaînes vides en undefined (plus propre pour Prisma)
  contact: z
    .string()
    .optional()
    .nullable()
    .transform((v) => (v === '' ? undefined : v)),
  phone: z
    .string()
    .optional()
    .nullable()
    .transform((v) => (v === '' ? undefined : v)),
  // Validation d'email qui accepte les chaînes vides
  email: z
    .union([z.string().email('Email invalide'), z.string().length(0), z.null(), z.undefined()])
    .optional()
    .transform((v) => (v === '' ? undefined : v)),
  address: z
    .string()
    .optional()
    .nullable()
    .transform((v) => (v === '' ? undefined : v))
})

export const updateSupplierSchema = createSupplierSchema.partial().extend({
  id: z.string().uuid()
})

export type CreateSupplierInput = z.infer<typeof createSupplierSchema>
export type UpdateSupplierInput = z.infer<typeof updateSupplierSchema>
