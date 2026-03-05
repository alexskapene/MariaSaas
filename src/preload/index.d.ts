import { ElectronAPI } from '@electron-toolkit/preload'
import { ApiResponse } from '../shared/api'
import { LoginInput } from '../shared/schemas/authSchema'
import { CreateUserInput, UpdateUserInput } from '../shared/schemas/userSchema'
import { ProductInput, CreateRequisitionInput } from '../shared/schemas/inventorySchema'
import { CreateSaleInput } from '@shared/schemas/salesSchema'
import { ApiResponse } from '../shared/api'

// Interfaces pour le typage des retours

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      auth: {
        login: (data: LoginInput) => Promise<ApiResponse<UserDTO>>
        logout: () => Promise<ApiResponse<void>>
      }
      users: {
        getAll: () => Promise<ApiResponse<UserDTO[]>>
        create: (data: CreateUserInput) => Promise<ApiResponse<UserDTO>>
        update: (data: UpdateUserInput) => Promise<ApiResponse<UserDTO>>
        delete: (id: string, currentUserId: string) => Promise<ApiResponse<void>>
      }
      inventory: {
        getProducts: () => Promise<ApiResponse<ProductDTO[]>>
        createProduct: (data: ProductInput) => Promise<ApiResponse<ProductDTO>>

        createSupplier: (
          data: CreateSupplierInput,
          role: string
        ) => Promise<ApiResponse<SupplierDTO>>
        updateSupplier: (
          data: UpdateSupplierInput,
          role: string
        ) => Promise<ApiResponse<SupplierDTO>>
        deleteSupplier: (id: string, role: string) => Promise<ApiResponse<void>>
        getSuppliers: () => Promise<ApiResponse<SupplierDTO[]>>

        createDraft: (data: CreateRequisitionInput) => Promise<ApiResponse<RequisitionDTO>>
        validateRequisition: (id: string) => Promise<ApiResponse<RequisitionDTO>>
        getRequisitions: () => Promise<ApiResponse<RequisitionDTO[]>>
      }
      sales: {
        create: (data: CreateSaleInput) => Promise<ApiResponse<SaleDTO>>
        getHistory: (filter?: {
          from: Date | string
          to: Date | string
        }) => Promise<ApiResponse<SaleDTO[]>>
      }
      finance: {
        getRate: () => Promise<ApiResponse<number>>
        setRate: (data: { rate: number; userId: string }) => Promise<ApiResponse<void>>
        getHistory: (filter?: {
          from: Date | string
          to: Date | string
        }) => Promise<ApiResponse<HistoryFilter[]>>
        createMovement: (data: {
          type: 'IN' | 'OUT'
          amount: number
          description: string
          performedBy: string
        }) => Promise<ApiResponse<CashMovementDTO>>
      }
      stats: {
        getDashboard: () => Promise<ApiResponse<DashboardStatsDTO>>
      }
      clients: {
        list: (query?: string) => Promise<ApiResponse<ClientDTO[]>>
        create: (data: CreateClientInput, role: string) => Promise<ApiResponse<ClientDTO>>
        update: (data: UpdateClientInput, role: string) => Promise<ApiResponse<ClientDTO>>
        delete: (id: string, role: string) => Promise<ApiResponse<void>>
      }
    }
  }
}
