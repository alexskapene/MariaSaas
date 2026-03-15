import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { LoginInput } from '@shared/schemas/authSchema'
import { UpdateProfileInput } from '@shared/schemas/userSchema'
import { UserRole } from '@shared/types'

// Type utilisateur (Front)
interface UserState {
  id: string
  email: string
  name: string
  role: UserRole
  phone?: string
  avatar?: string
}

export interface AuthState {
  user: UserState | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

// 1. Initialisation Intelligente : On vérifie s'il y a une session sauvegardée
const getInitialState = (): AuthState => {
  const savedUser = localStorage.getItem('auth_user')
  if (savedUser) {
    try {
      const user = JSON.parse(savedUser)
      return {
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null
      }
    } catch (err: unknown) {
      console.error("Erreur lors du parsing de l'utilisateur sauvegardé:", err)
      localStorage.removeItem('auth_user')
    }
  }
  return {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null
  }
}

const initialState: AuthState = getInitialState()

// Type étendu pour l'argument du Thunk
interface LoginPayload extends LoginInput {
  rememberMe: boolean
}

// --- THUNK : LOGIN ---
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password, rememberMe }: LoginPayload, { rejectWithValue }) => {
    try {
      const response = await window.api.auth.login({ email, password })

      if (!response.success) {
        return rejectWithValue(response.error?.message || 'Erreur de connexion')
      }

      return { user: response.data, rememberMe }
    } catch (err: unknown) {
      const error = err as Error
      return rejectWithValue(error.message || 'Erreur critique')
    }
  }
)

// --- THUNK : LOGOUT ---
export const logoutUser = createAsyncThunk('auth/logout', async () => {
  await window.api.auth.logout()
  localStorage.removeItem('auth_user')
})

// --- THUNK : UPDATE PROFILE (issue #21) ---
export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (data: UpdateProfileInput, { rejectWithValue }) => {
    try {
      const response = await window.api.auth.updateProfile(data)

      if (!response.success || !response.data) {
        return rejectWithValue(response.error?.message || 'Erreur lors de la mise à jour')
      }

      // Si l'utilisateur avait choisi "Se souvenir de moi", on rafraîchit le localStorage
      const savedUser = localStorage.getItem('auth_user')
      if (savedUser) {
        localStorage.setItem('auth_user', JSON.stringify(response.data))
      }

      return response.data
    } catch (err: unknown) {
      const error = err as Error
      return rejectWithValue(error.message || 'Erreur critique')
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      // ── LOGIN ──────────────────────────────────────────────────────────
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.isAuthenticated = true
        state.user = action.payload.user as unknown as UserState

        if (action.payload.rememberMe) {
          localStorage.setItem('auth_user', JSON.stringify(action.payload.user))
        } else {
          localStorage.removeItem('auth_user')
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false
        state.isAuthenticated = false
        state.error = action.payload as string
      })

      // ── LOGOUT ─────────────────────────────────────────────────────────
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null
        state.isAuthenticated = false
        state.error = null
      })

      // ── UPDATE PROFILE ─────────────────────────────────────────────────
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false
        if (state.user) {
          state.user = { ...state.user, ...action.payload } as unknown as UserState
        }
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  }
})

export const { clearAuthError } = authSlice.actions
export default authSlice.reducer
