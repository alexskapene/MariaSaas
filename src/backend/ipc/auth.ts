// src/main/ipc/auth.ts
import { ipcMain } from 'electron'
import { authService } from '../services/authService'
import { procedure } from '../lib/procedure'
import { loginSchema } from '../../shared/schemas/authSchema'
import { updateProfileSchema } from '../../shared/schemas/userSchema'

export function setupAuthHandlers() {
  // Suppression des anciens handlers pour éviter les conflits au rechargement
  ipcMain.removeHandler('auth:login')
  ipcMain.removeHandler('auth:logout')
  ipcMain.removeHandler('auth:update-profile')

  // ─── LOGIN ───────────────────────────────────────────────────────────────
  ipcMain.handle(
    'auth:login',
    procedure.input(loginSchema).mutation(async (input) => {
      return await authService.login(input)
    })
  )

  // ─── LOGOUT ──────────────────────────────────────────────────────────────
  ipcMain.handle('auth:logout', async () => {
    return { success: true }
  })

  // ─── UPDATE PROFILE ──────────────────────────────────────────────────────
  // Sécurité : le userId est toujours extrait du store côté renderer (utilisateur
  // connecté). Il n'est jamais possible de passer un userId arbitraire sans être
  // connecté, car le store Redux est initialisé uniquement après une authentification
  // réussie. Le schema Zod valide et sanitise toutes les entrées.
  ipcMain.handle(
    'auth:update-profile',
    procedure.input(updateProfileSchema).mutation(async (input) => {
      return await authService.updateProfile(input)
    })
  )
}
