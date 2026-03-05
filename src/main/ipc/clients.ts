import { ipcMain } from 'electron'
import { z } from 'zod'
import { clientService } from '../services/clientService'
import { procedure } from '../lib/procedure'
import { createClientSchema, updateClientSchema } from '../../shared/schemas/clientSchema'
import { UserRole } from '../../shared/types'

// 🛡️ Middleware de sécurité RBAC
function requireAdmin(role: string) {
  if (role !== UserRole.SUPERADMIN && role !== UserRole.ADMIN) {
    throw new Error('Accès refusé : Seuls les administrateurs peuvent effectuer cette action.')
  }
}

export function setupClientHandlers() {
  ipcMain.removeHandler('clients:list')
  ipcMain.removeHandler('clients:create')
  ipcMain.removeHandler('clients:update')
  ipcMain.removeHandler('clients:delete')

  // LIST: Ouvert à tous (pour permettre aux pharmaciens de sélectionner un client lors d'une vente)
  ipcMain.handle('clients:list', async (_, query?: string) => {
    const data = await clientService.getClients(query)
    return { success: true, data }
  })

  // CREATE: Protégé (Admin / SuperAdmin)
  const createPayload = z.object({ data: createClientSchema, role: z.nativeEnum(UserRole) })
  ipcMain.handle(
    'clients:create',
    procedure.input(createPayload).mutation(async (input) => {
      requireAdmin(input.role) // Vérification de sécurité
      return await clientService.createClient(input.data)
    })
  )

  // UPDATE: Protégé (Admin / SuperAdmin)
  const updatePayload = z.object({ data: updateClientSchema, role: z.nativeEnum(UserRole) })
  ipcMain.handle(
    'clients:update',
    procedure.input(updatePayload).mutation(async (input) => {
      requireAdmin(input.role) // Vérification de sécurité
      return await clientService.updateClient(input.data)
    })
  )

  // DELETE: Protégé (Admin / SuperAdmin)
  ipcMain.handle('clients:delete', async (_, payload: { id: string; role: string }) => {
    try {
      requireAdmin(payload.role) // Vérification de sécurité
      await clientService.deleteClient(payload.id)
      return { success: true }
    } catch (err: unknown) {
      const error = err as Error
      return { success: false, error: { message: error.message } }
    }
  })
}
