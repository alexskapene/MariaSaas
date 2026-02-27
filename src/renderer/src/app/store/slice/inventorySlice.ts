import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { ProductInput, CreateRequisitionInput } from '@shared/schemas/inventorySchema'
import { ProductDTO } from '@shared/types'

// Type qui matche ton Schema Prisma mis à jour

export interface Requisition {
  id: string
  reference: string
  status: 'DRAFT' | 'VALIDATED'
  supplierId: string
  createdById: string
  createdAt: string
  items: RequisitionItem[]
}

export interface RequisitionItem {
  id: string
  productId: string
  quantity: number
  buyPrice: number
  batchNumber: string
  expiryDate: string
  product: ProductDTO // Relation incluse
}

export interface InventoryState {
  products: ProductDTO[]
  isLoading: boolean
  error: string | null
}

export interface InventoryState {
  products: ProductDTO[]
  isLoading: boolean
  error: string | null
}

const initialState: InventoryState = {
  products: [],
  isLoading: false,
  error: null
}

// --- ASYNC THUNKS (Appels IPC) ---

// 1. Charger les produits
export const fetchProducts = createAsyncThunk<ProductDTO[], void>(
  'inventory/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await window.api.inventory.getProducts()
      if (!response.success) throw new Error(response.error?.message || 'Erreur inconnue')
      return response.data as ProductDTO[]
    } catch (err: unknown) {
      const error = err as Error
      return rejectWithValue(error.message || 'Erreur lors du chargement des produits')
    }
  }
)

// 2. Créer un produit
export const createProduct = createAsyncThunk<ProductDTO, ProductInput>(
  'inventory/createProduct',
  async (data, { rejectWithValue }) => {
    try {
      const response = await window.api.inventory.createProduct(data)
      if (!response.success) throw new Error(response.error?.message || 'Erreur création')
      return response.data as ProductDTO
    } catch (err: unknown) {
      const error = err as Error
      return rejectWithValue(error.message || 'Erreur lors de la création du produit')
    }
  }
)

// 3. Supprimer un produit (Nouveau)
export const deleteProduct = createAsyncThunk<string, string>(
  'inventory/deleteProduct',
  async (_, { rejectWithValue }) => {
    try {
      // Note: Assure-toi d'ajouter cette méthode dans preload/ IPC
      // Pour l'instant, on suppose qu'elle existe ou on la rajoutera
      // Si elle n'existe pas encore, cela va throw.
      // const response = await window.api.inventory.deleteProduct(id);
      // if (!response.success) throw new Error(response.error?.message);
      // return id;
      throw new Error("Suppression non implémentée backend pour l'instant")
    } catch (err: unknown) {
      const error = err as Error
      return rejectWithValue(error.message || 'Erreur lors de la suppression du produit')
    }
  }
)

// Créer un brouillon de réquisition
export const createDraftRequisition = createAsyncThunk<Requisition, CreateRequisitionInput>(
  'inventory/createDraft',
  async (data, { rejectWithValue }) => {
    try {
      const response = await window.api.inventory.createDraft(data)
      if (!response.success) throw new Error(response.error?.message || 'Erreur création bon')
      return response.data as Requisition
    } catch (err: unknown) {
      const error = err as Error
      return rejectWithValue(
        error.message || 'Erreur lors de la création du brouillon de réquisition'
      )
    }
  }
)

export const validateRequisition = createAsyncThunk<Requisition, string>(
  'inventory/validate',
  async (id, { rejectWithValue }) => {
    try {
      const response = await window.api.inventory.validateRequisition(id)
      if (!response.success) throw new Error(response.error?.message || 'Erreur validation')
      return response.data as Requisition
    } catch (err: unknown) {
      const error = err as Error
      return rejectWithValue(error.message || 'Erreur lors de la validation du bon')
    }
  }
)

// --- SLICE ---
const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<ProductDTO[]>) => {
        state.isLoading = false
        state.products = action.payload
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

      // Create Product
      .addCase(createProduct.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createProduct.fulfilled, (state, action: PayloadAction<ProductDTO>) => {
        state.isLoading = false
        state.products.push(action.payload)
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

      // Delete Product
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((p) => p.id !== action.payload)
      })

      // Requisitions
      .addCase(createDraftRequisition.pending, (state) => {
        // On ne met pas forcément tout le state inventory en loading pur un draft
        state.error = null
      })
      .addCase(createDraftRequisition.rejected, (state, action) => {
        state.error = action.payload as string
      })
      .addCase(validateRequisition.fulfilled, () => {
        // Si la validation impacte le stock, il faudrait idéalement re-fetcher les produits
        // ou mettre à jour le stock localement si on a toutes les infos.
        // Pour simplifier, on peut déclencher un refetch dans le composant ou ici.
      })
      .addCase(validateRequisition.rejected, (state, action) => {
        state.error = action.payload as string
      })
  }
})

export const { clearError } = inventorySlice.actions
export default inventorySlice.reducer
