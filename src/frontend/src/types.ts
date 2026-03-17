
export enum UserRole {
  SUPERADMIN = 'SUPERADMIN',
  ADMIN = 'ADMIN'
}

export enum LoyaltyStatus {
  NONE = 'NONE',
  BRONZE = 'BRONZE',
  SILVER = 'SILVER',
  GOLD = 'GOLD'
}

export enum AuditAction {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  SALE_COMPLETED = 'SALE_COMPLETED',
  STOCK_ADJUSTMENT = 'STOCK_ADJUSTMENT',
  DOCUMENT_CANCELLED = 'DOCUMENT_CANCELLED',
  ACCESS_DENIED = 'ACCESS_DENIED',
  USER_CREATED = 'USER_CREATED',
  CASH_MOVEMENT = 'CASH_MOVEMENT'
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: AuditAction;
  resource: string;
  details: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
}

export enum CashMovementType {
  IN = 'IN',
  OUT = 'OUT'
}

export enum CashCategory {
  SALE = 'VENTE',
  DEBT_PAYMENT = 'PAIEMENT_DETTE',
  DONATION = 'DON',
  REINVESTMENT = 'REINVESTISSEMENT',
  TAX = 'TAXES_IMPOTS',
  RESTORATION = 'RESTAURATION',
  RENT = 'LOYER',
  LOSS_THEFT = 'PERTE_VOL',
  SALARY = 'SALAIRE',
  OTHER = 'AUTRE'
}

export interface CashMovement {
  id: string;
  timestamp: string;
  type: CashMovementType;
  category: CashCategory;
  amount: number;
  description: string;
  performedBy: string;
}

export enum DocumentType {
  INVOICE = 'INVOICE',
  PROFORMA = 'PROFORMA',
  PURCHASE_ORDER = 'PURCHASE_ORDER'
}

export interface Lot {
  id: string;
  batchNumber: string;
  expiryDate: string;
  quantity: number;
  receivedDate: string;
}

export interface Medication {
  id: string;
  pharmacyId?: string;
  name: string;
  code: string;
  category: string;
  dosage: string;
  price: number;
  buyingPrice: number;
  threshold: number;
  lots: Lot[];
  qrCode?: string; // Base64 Data URL
}

export interface CartItem extends Medication {
  quantity: number;
  selectedLotId: string;
  selectedLotBatch: string;
  selectedLotExpiry: string;
}

export interface Customer {
  id: string;
  pharmacyId?: string;
  name: string;
  phone: string;
  creditLimit?: number;
  currentCredit?: number;
  loyaltyStatus?: LoyaltyStatus;
  totalPurchases?: number;
}

export interface BillingDocument {
  id: string;
  type: DocumentType;
  date: string;
  customerName?: string;
  items: CartItem[];
  subtotal: number;
  discountAmount: number;
  total: number;
  status: 'DRAFT' | 'PAID' | 'PENDING' | 'CANCELLED';
  paymentMethod?: string;
  isSynced?: boolean;
}
