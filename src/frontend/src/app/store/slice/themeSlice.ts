import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'


export type Theme = 'light' | 'dark'

export interface ThemeState {
  mode: Theme
}

// 1. Initialisation Intelligente : On lit le stockage OU la préférence système
const getInitialTheme = (): Theme => {
  // Sécurité pour le SSR/Tests
  if (typeof window === 'undefined') return 'light'

  // A. Vérifier le stockage utilisateur
  const savedTheme = localStorage.getItem('theme') as Theme | null
  if (savedTheme) return savedTheme

  // B. Sinon, vérifier la préférence système (OS)
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark'

  return 'light'
}

const initialState: ThemeState = {
  mode: getInitialTheme(),
}

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light'
      // Note : On ne fait plus de localStorage.setItem ici ! C'est le middleware qui gère.
    },
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.mode = action.payload
    },
  },
})

export const { toggleTheme, setTheme } = themeSlice.actions

export const selectTheme = (state: RootState) => state.theme.mode
export const selectIsDarkMode = (state: RootState) => state.theme.mode === 'dark'

export default themeSlice.reducer