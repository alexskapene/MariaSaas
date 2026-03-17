import { prisma } from '../lib/prisma'
import { CreateUserInput, UpdateUserInput } from '../../shared/schemas/userSchema'
import bcrypt from 'bcryptjs'

export class UserService {
  // GET ALL (Sans les mots de passe)
  async getAllUsers() {
    return await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        lastLogin: true,
        createdAt: true
        // Pas de password !
      },
      orderBy: { createdAt: 'desc' }
    })
  }

  // CREATE
  async createUser(data: CreateUserInput) {
    // 1. Vérifier si l'email existe déjà
    const existing = await prisma.user.findUnique({ where: { email: data.email } })
    if (existing) throw new Error('Cet email est déjà utilisé')

    // 2. Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(data.password, 10)

    // 3. Créer
    return await prisma.user.create({
      data: {
        ...data,
        password: hashedPassword
      },
      select: { id: true, name: true, email: true, role: true } // Retour propre
    })
  }

  // UPDATE
  async updateUser(data: UpdateUserInput) {
    const { id, password, ...rest } = data

    // Typage strict: On omet l'ID car il sert juste au "where", et on rend le reste optionnel pour Prisma
    const updateData: Partial<Omit<UpdateUserInput, 'id'>> = { ...rest }

    // Si un nouveau mot de passe est fourni, on le hache
    if (password) {
      updateData.password = await bcrypt.hash(password, 10)
    }

    return await prisma.user.update({
      where: { id },
      data: updateData,
      select: { id: true, name: true, email: true, role: true }
    })
  }

  // DELETE
  async deleteUser(userId: string, currentUserId: string) {
    // Règle de sécurité : On ne peut pas se supprimer soi-même
    if (userId === currentUserId) {
      throw new Error('Vous ne pouvez pas supprimer votre propre compte')
    }

    return await prisma.user.delete({
      where: { id: userId }
    })
  }
}

export const userService = new UserService()
