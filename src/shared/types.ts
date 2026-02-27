export enum UserRole {
  SUPERADMIN = 'SUPERADMIN',
  ADMIN = 'ADMIN',
  PHARMACIST = 'PHARMACIST'
}

export enum RequisitionStatus {
  DRAFT = 'DRAFT',
  VALIDATED = 'VALIDATED',
  CANCELLED = 'CANCELLED'
}

export enum CashMovementType {
  IN = 'IN', // Entrée
  OUT = 'OUT' // Sortie
}

export enum CashCategory {
  SALE = 'VENTE',
  EXPENSE = 'DEPENSE_DIVERSE',
  SUPPLY = 'ACHAT_STOCK',
  DEBT_PAYMENT = 'RECOUVREMENT',
  ADJUSTMENT = 'AJUSTEMENT',
  DONATION = 'DON',
  REINVESTMENT = 'REINVESTISSEMENT',
  TAX = 'TAXES_IMPOTS',
  RESTORATION = 'RESTAURATION',
  RENT = 'LOYER',
  LOSS_THEFT = 'PERTE_VOL',
  SALARY = 'SALAIRE',
  OTHER = 'AUTRE'
}

export interface CreateMovementInput {
  type: CashMovementType
  category: CashCategory
  amount: number
  description?: string
  performedById: string
}

export interface CashJournalEntry {
  id: string
  timestamp: Date
  type: CashMovementType
  category: CashCategory
  amount: number
  reference: string
  description: string
  performedBy: string
  isManual: boolean
}

export interface Client {
  id: string
  code: string
  name: string
  phone?: string | null
  email?: string | null
  address?: string | null
  insuranceProvider?: string | null
  insuranceNumber?: string | null
  createdAt: Date
  updatedAt: Date
}

export interface CreateClientInput {
  name: string
  phone?: string
  email?: string
  address?: string
  insuranceProvider?: string
  insuranceNumber?: string
}

export interface UpdateClientInput extends Partial<CreateClientInput> {
  id: string
}

export enum LoyaltyStatus {
  NONE = 'NONE',
  BRONZE = 'BRONZE',
  SILVER = 'SILVER',
  GOLD = 'GOLD'
}

export interface ClientDTO {
  id: string
  code: string
  name: string
  phone: string | null
  email: string | null
  address: string | null
  creditLimit: number
  currentCredit: number
  loyaltyStatus: LoyaltyStatus
  totalPurchases: number
  createdAt: string
  updatedAt: string
}

export interface UserDTO {
  id: string
  name: string
  email: string
  role: string
  lastLogin: Date | null
  createdAt: Date
  updatedAt: Date
}

export interface ProductLotDTO {
  id: string
  batchNumber: string
  expiryDate: string
  quantity: number
  receivedDate: string
}
export interface ProductDTO {
  id: string
  name: string
  code: string
  category: string
  dosage: string | null
  dci?: string | null
  form?: string | null
  currentStock: number
  minStock: number
  sellPrice: number
  buyingPrice: number
  codeCip7?: string | null
  codeAtc?: string | null
  packaging?: string | null
  description?: string | null
  isPrescriptionRequired: boolean
  maxStock?: number | null
  location?: string | null
  vatRate: number

  lots: ProductLotDTO[]
}
export interface SaleItemDTO {
  id: string
  productId: string
  quantity: number
  unitPrice: number
  total: number
  product: { name: string }
}
export interface SaleDTO {
  id: string
  totalAmount: number
  reference: string
  items: SaleItemDTO[]
  createdAt: string | Date
}
export interface RequisitionItemDTO {
  id: string
  productId: string
  quantity: number
  buyPrice: number
  batchNumber?: string
  expiryDate?: string
  product: { name: string }
}
export interface RequisitionDTO {
  id: string
  status: string
  reference: string
  items: RequisitionItemDTO[]
  createdAt: Date
}
export interface CashMovementDTO {
  id: string
  type: 'IN' | 'OUT'
  amount: number
  description: string
  createdAt: Date
  performedBy: string
  category: string
  isManual: boolean
}
export interface DashboardStatsDTO {
  revenueToday: number
  salesCount: number
  lowStockCount: number
  stockValue: number
  recentSales: SaleDTO[]
}
export interface SupplierDTO {
  id: string
  name: string
  phone?: string
  email?: string
}
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: {
    message: string
    code: string
    details?: unknown
  }
}
export interface HistoryFilter {
  f
  rom: Date | string
  to: Date | string
}
export interface DashboardStats {
  revenueToday: number
  salesCount: number
  lowStockCount: number
  stockValue: number
  recentSales: SaleDTO[]
}
