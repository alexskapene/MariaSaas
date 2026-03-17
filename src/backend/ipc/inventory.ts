import { ipcMain } from 'electron'
import { inventoryService } from '../services/inventoryService'
import { procedure } from '../lib/procedure'
import { productSchema, createRequisitionSchema } from '../../shared/schemas/inventorySchema'
import { createSupplierSchema, updateSupplierSchema } from '../../shared/schemas/supplierSchema'
import { UserRole } from '../../shared/types'
import { z } from 'zod'

// Middleware de sécurité RBAC
function requireAdmin(role: string) {
  if (role !== UserRole.SUPERADMIN && role !== UserRole.ADMIN) {
    throw new Error('Accès refusé : Seuls les administrateurs peuvent gérer les fournisseurs.')
  }
}

export function setupInventoryHandlers() {
  // Nettoyage des anciens handlers
  ipcMain.removeHandler('inventory:get-products')
  ipcMain.removeHandler('inventory:create-product')
  ipcMain.removeHandler('inventory:get-suppliers')
  ipcMain.removeHandler('inventory:create-supplier')
  ipcMain.removeHandler('inventory:update-supplier')
  ipcMain.removeHandler('inventory:delete-supplier')

  // --- PRODUITS ---
  ipcMain.handle('inventory:get-products', async () => {
    const data = await inventoryService.getAllProducts()
    return { success: true, data }
  })

  ipcMain.handle(
    'inventory:create-product',
    procedure.input(productSchema).mutation(async (input) => {
      return await inventoryService.createProduct(input)
    })
  )

  // --- FOURNISSEURS ---
  ipcMain.handle('inventory:get-suppliers', async () => {
    const data = await inventoryService.getAllSuppliers()
    return { success: true, data }
  })

  // 🛡️ CRÉATION SÉCURISÉE : On définit le schéma attendu pour la procédure
  const createSupplierPayload = z.object({
    data: createSupplierSchema,
    role: z.nativeEnum(UserRole)
  })

  ipcMain.handle(
    'inventory:create-supplier',
    procedure.input(createSupplierPayload).mutation(async (input) => {
      // On passe uniquement input.data au service
      return await inventoryService.createSupplier(input.data)
    })
  )

  // 🛡️ MISE À JOUR SÉCURISÉE
  const updateSupplierPayload = z.object({
    data: updateSupplierSchema,
    role: z.nativeEnum(UserRole)
  })

  ipcMain.handle(
    'inventory:update-supplier',
    procedure.input(updateSupplierPayload).mutation(async (input) => {
      return await inventoryService.updateSupplier(input.data)
    })
  )

  // Réquisitions
  ipcMain.handle(
    'inventory:create-draft',
    procedure.input(createRequisitionSchema).mutation(async (input) => {
      return await inventoryService.createDraftRequisition(input)
    })
  )

  ipcMain.handle('inventory:validate', async (_event, requisitionId: string) => {
    try {
      const result = await inventoryService.validateRequisition(requisitionId)
      return { success: true, data: result }
    } catch (err: unknown) {
      const error = err as Error
      return { success: false, error: { message: error.message } }
    }
  })

  ipcMain.handle('inventory:get-requisitions', async () => {
    const data = await inventoryService.getRequisitions()
    return { success: true, data }
  })

  // DELETE SUPPLIER (Protégé)
  ipcMain.handle('inventory:delete-supplier', async (_, payload: { id: string; role: string }) => {
    try {
      requireAdmin(payload.role)
      await inventoryService.deleteSupplier(payload.id)
      return { success: true }
    } catch (err: unknown) {
      return { success: false, error: { message: (err as Error).message } }
    }
  })
}
