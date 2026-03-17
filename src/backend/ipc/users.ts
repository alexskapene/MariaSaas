import { ipcMain } from 'electron'
import { userService } from '../services/userService'
import { procedure } from '../lib/procedure'
import { createUserSchema, updateUserSchema } from '../../shared/schemas/userSchema'

export function setupUserHandlers() {
  // Nettoyage HMR
  ipcMain.removeHandler('users:get-all')
  ipcMain.removeHandler('users:create')
  ipcMain.removeHandler('users:update')
  ipcMain.removeHandler('users:delete')

  // 1. LISTE DES UTILISATEURS
  ipcMain.handle('users:get-all', async () => {
    // On pourrait ajouter de la pagination ici plus tard
    const users = await userService.getAllUsers()
    return { success: true, data: users }
  })

  // 2. CRÉATION (Sécurisé par Zod)
  ipcMain.handle(
    'users:create',
    procedure.input(createUserSchema).mutation(async (input) => {
      return await userService.createUser(input)
    })
  )

  // 3. MODIFICATION
  ipcMain.handle(
    'users:update',
    procedure.input(updateUserSchema).mutation(async (input) => {
      return await userService.updateUser(input)
    })
  )

  // 4. SUPPRESSION
  // On passe l'ID à supprimer ET on a besoin de savoir QUI fait la demande (pour éviter le suicide numérique)
  // Note: Dans une vraie architecture, on récupèrerait l'ID de l'appelant via le contexte de session,
  // mais pour l'instant on va faire confiance au frontend ou passer l'ID courant.
  ipcMain.handle('users:delete', async (_event, { id, currentUserId }) => {
    try {
      await userService.deleteUser(id, currentUserId)
      return { success: true }
    } catch (err: unknown) {
      const error = err as Error
      return { success: false, error: { message: error.message } }
    }
  })
}
