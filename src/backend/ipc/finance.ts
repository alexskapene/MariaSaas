import { ipcMain } from 'electron'
import { financeService } from '../services/financeService'
import { cashService } from '../services/cashService'

export function setupFinanceHandlers() {
  // Nettoyage (Anti-doublons HMR)
  ipcMain.removeHandler('finance:get-rate')
  ipcMain.removeHandler('finance:set-rate')

  // 1. GET RATE
  ipcMain.handle('finance:get-rate', async () => {
    try {
      const rate = await financeService.getLatestRate()
      // On renvoie TOUJOURS { success: true, data: ... }
      return { success: true, data: rate }
    } catch (err: unknown) {
      const error = err as Error
      return { success: false, error: { message: error.message } }
    }
  })

  // 2. SET RATE
  ipcMain.handle('finance:set-rate', async (_event, { rate, userId }) => {
    try {
      await financeService.setDailyRate(rate, userId)
      return { success: true }
    } catch (err: unknown) {
      const error = err as Error
      return { success: false, error: { message: error.message } }
    }
  })

  // 3. GET CASH JOURNAL (Sales + Manual)
  ipcMain.handle(
    'finance:get-history',
    async (_event, filter?: { from: Date | string; to: Date | string }) => {
      try {
        const startDate = filter?.from ? new Date(filter.from) : undefined
        const endDate = filter?.to ? new Date(filter.to) : undefined

        const data = await cashService.getCashJournal(startDate, endDate)
        return { success: true, data }
      } catch (err: unknown) {
        const error = err as Error
        return { success: false, error: { message: error.message } }
      }
    }
  )

  // 4. CREATE MANUAL MOVEMENT
  ipcMain.handle('finance:create-movement', async (_event, data) => {
    try {
      const movement = await cashService.createMovement(data)
      return { success: true, data: movement }
    } catch (err: unknown) {
      const error = err as Error
      return { success: false, error: { message: error.message } }
    }
  })
}
