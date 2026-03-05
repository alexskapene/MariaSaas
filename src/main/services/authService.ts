// src/main/services/authService.ts
import { prisma } from '../lib/prisma'
import { LoginInput } from '../../shared/schemas/authSchema'
import { UpdateProfileInput } from '../../shared/schemas/userSchema'
import bcrypt from 'bcryptjs'
import type { User } from '@prisma/client'

// DTO public : jamais de hash exposé
export type UserDTO = Omit<User, 'password'>

export class AuthService {
  // ─────────────────────────────────────────
  // PRIVATE : Convertit un User Prisma en DTO sans le mot de passe
  // Le eslint-disable est nécessaire : `password` est extrait uniquement
  // pour être exclu du spread — c'est intentionnel.
  // ─────────────────────────────────────────
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private toDTO({ password, ...dto }: User): UserDTO {
    return dto
  }

  // ─────────────────────────────────────────
  // QUERY : Login
  // ─────────────────────────────────────────
  async login(credentials: LoginInput): Promise<UserDTO> {
    const user = await prisma.user.findUnique({
      where: { email: credentials.email }
    })

    if (!user) throw new Error('Email ou mot de passe incorrect')

    const isValid = await bcrypt.compare(credentials.password, user.password)
    if (!isValid) throw new Error('Email ou mot de passe incorrect')

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    })

    return this.toDTO(user)
  }

  // ─────────────────────────────────────────
  // COMMAND : Update Profile
  // ─────────────────────────────────────────
  async updateProfile(input: UpdateProfileInput): Promise<UserDTO> {
    const { userId, name, email, phone, password, avatar } = input

    // 1. Vérifier que l'utilisateur existe
    const existingUser = await prisma.user.findUnique({ where: { id: userId } })
    if (!existingUser) throw new Error('Utilisateur introuvable')

    // 2. Vérifier unicité de l'email (si changement)
    if (email && email !== existingUser.email) {
      const emailTaken = await prisma.user.findUnique({ where: { email } })
      if (emailTaken) throw new Error('Cet email est déjà utilisé par un autre compte')
    }

    // 3. Construire l'objet de mise à jour (seulement les champs fournis)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: Record<string, any> = {}

    if (name && name.trim() !== '') updateData.name = name.trim()
    if (email && email.trim() !== '') updateData.email = email.trim().toLowerCase()
    if (phone !== undefined) updateData.phone = phone === '' ? null : phone.trim()
    if (avatar !== undefined) updateData.avatar = avatar === '' ? null : avatar.trim()

    // 4. Hash du nouveau mot de passe si fourni
    if (password && password.trim() !== '') {
      updateData.password = await bcrypt.hash(password, 12)
    }

    // 5. Interdire toute modification du rôle (sécurité)
    delete updateData.role

    // 6. Rien à mettre à jour ?
    if (Object.keys(updateData).length === 0) {
      throw new Error('Aucune modification détectée')
    }

    // 7. Persister
    const updated = await prisma.user.update({
      where: { id: userId },
      data: updateData
    })

    return this.toDTO(updated)
  }

  // ─────────────────────────────────────────
  // COMMAND : Seed Super Admin (premier lancement)
  // ─────────────────────────────────────────
  async ensureSuperAdminExists() {
    const count = await prisma.user.count()
    const supplierCount = await prisma.supplier.count()

    if (supplierCount === 0) {
      await prisma.supplier.create({
        data: {
          name: 'Fournisseur Divers',
          email: 'contact@divers.com',
          phone: '0000000000',
          address: 'Adresse par défaut'
        }
      })
    }

    if (count === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10)
      await prisma.user.create({
        data: {
          email: 'admin@mariasaas.com',
          password: hashedPassword,
          name: 'Super Admin',
          role: 'SUPERADMIN'
        }
      })
      console.log('⚡ SuperAdmin par défaut créé')
    }
  }
}

export const authService = new AuthService()
