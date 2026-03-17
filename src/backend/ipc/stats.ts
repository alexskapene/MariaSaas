import { ipcMain } from 'electron'
import { statsService } from '../services/statsService'

export function setupStatsHandlers() {
  // Nettoyage (Anti-Crash HMR)
  ipcMain.removeHandler('stats:get-dashboard')

  // Enregistrement de la route
  ipcMain.handle('stats:get-dashboard', async () => {
    try {
      const data = await statsService.getDashboardStats()
      return { success: true, data }
    } catch (err: unknown) {
      const error = err as Error
      console.error('Stats Error:', error)
      return { success: false, error: { message: error.message } }
    }
  })
}
