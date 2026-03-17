import { prisma } from '../lib/prisma'
import { CreateClientInput, UpdateClientInput } from '../../shared/schemas/clientSchema'

export class ClientService {
  async getClients(query?: string) {
    return await prisma.client.findMany({
      where: query
        ? {
            OR: [
              { name: { contains: query } },
              { phone: { contains: query } },
              { code: { contains: query } }
            ]
          }
        : {},
      orderBy: { name: 'asc' }
    })
  }

  async createClient(data: CreateClientInput) {
    const count = await prisma.client.count()
    const code = `PAT-${(count + 1).toString().padStart(4, '0')}`

    return await prisma.client.create({
      data: { ...data, code }
    })
  }

  async updateClient(data: UpdateClientInput) {
    const { id, ...updateData } = data
    return await prisma.client.update({
      where: { id },
      data: updateData
    })
  }

  async deleteClient(id: string) {
    // Vérifier si le client a des dettes avant suppression (Règle métier)
    const client = await prisma.client.findUnique({ where: { id } })
    if (client && client.currentCredit > 0) {
      throw new Error('Impossible de supprimer un client ayant un crédit en cours')
    }
    return await prisma.client.delete({ where: { id } })
  }
}

export const clientService = new ClientService()
