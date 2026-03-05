import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { CreateClientInput, UpdateClientInput } from '@shared/schemas/clientSchema'
import { ClientDTO } from '@shared/types'
import { RootState } from '../store'

export interface ClientState {
  list: ClientDTO[]
  isLoading: boolean
  error: string | null
}

const initialState: ClientState = {
  list: [],
  isLoading: false,
  error: null
}

export const fetchClients = createAsyncThunk(
  'clients/fetchAll',
  async (query: string | undefined, { rejectWithValue }) => {
    try {
      const res = await window.api.clients.list(query)
      if (!res.success) return rejectWithValue(res.error?.message || 'Erreur inconnue')
      return res.data as ClientDTO[]
    } catch (err: unknown) {
      const error = err as Error
      return rejectWithValue(error.message)
    }
  }
)

export const createNewClient = createAsyncThunk<ClientDTO, CreateClientInput>(
  'clients/create',
  async (data, { getState, rejectWithValue }) => {
    try {
      // Récupération sécurisée du rôle depuis le state Redux
      const state = getState() as RootState
      const role = state.auth.user?.role

      if (!role) return rejectWithValue('Non authentifié.')

      // Appel IPC avec le rôle injecté
      const res = await window.api.clients.create(data, role)

      if (!res.success) {
        return rejectWithValue(res.error?.message || 'Erreur lors de la création')
      }

      return res.data as ClientDTO
    } catch (err: unknown) {
      const error = err as Error
      return rejectWithValue(error.message || 'Erreur critique')
    }
  }
)

export const updateExistingClient = createAsyncThunk<ClientDTO, UpdateClientInput>(
  'clients/update',
  async (data, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState
      const role = state.auth.user?.role
      if (!role) return rejectWithValue('Non authentifié')

      const res = await window.api.clients.update(data, role)
      if (!res.success)
        return rejectWithValue(res.error?.message || 'Erreur lors de la mise à jour')

      return res.data as ClientDTO
    } catch (err: unknown) {
      return rejectWithValue((err as Error).message)
    }
  }
)

export const removeClient = createAsyncThunk<string, string>(
  'clients/delete',
  async (id, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState
      const role = state.auth.user?.role
      if (!role) return rejectWithValue('Non authentifié')

      const res = await window.api.clients.delete(id, role)
      if (!res.success) return rejectWithValue(res.error?.message || 'Erreur de suppression')

      return id // On retourne l'ID pour le filtrer dans le reducer
    } catch (err: unknown) {
      return rejectWithValue((err as Error).message)
    }
  }
)

const clientSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchClients.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.isLoading = false
        state.list = action.payload
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // CREATE
      .addCase(createNewClient.pending, (state) => {
        state.error = null
      })
      .addCase(createNewClient.fulfilled, (state, action) => {
        state.list.unshift(action.payload)
      })
      .addCase(createNewClient.rejected, (state, action) => {
        state.error = action.payload as string
      })
      // UPDATE
      .addCase(updateExistingClient.fulfilled, (state, action) => {
        const index = state.list.findIndex((c) => c.id === action.payload.id)
        if (index !== -1) {
          state.list[index] = action.payload
        }
      })
      // DELETE
      .addCase(removeClient.fulfilled, (state, action) => {
        state.list = state.list.filter((c) => c.id !== action.payload)
      })
  }
})

export default clientSlice.reducer
