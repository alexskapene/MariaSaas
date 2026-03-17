import { configureStore, Middleware } from '@reduxjs/toolkit'
import themeReducer from './slice/themeSlice'
import authReducer from './slice/authSlice'
import inventoryReducer from './slice/inventorySlice'
import salesReducer from './slice/salesSlice'
import sessionReducer from './slice/sessionSlice'
import clientReducer from './slice/clientSlice'

// --- MIDDLEWARE DE PERSISTANCE ---
const persistenceMiddleware: Middleware = (store) => (next) => (action) => {
  // 1. On laisse l'action se dérouler normalement
  const result = next(action)

  // 2. On récupère le nouvel état après l'action
  const state = store.getState() as RootState

  // 3. On sauvegarde dans le localStorage
  // Astuce : On sauvegarde à chaque changement pour être sûr
  localStorage.setItem('theme', state.theme.mode)

  // 4. (Bonus Pro) On applique la classe CSS immédiatement ici aussi
  // Cela garantit que le DOM est synchro même hors du cycle React
  if (state.theme.mode === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }

  return result
}

// --- CONFIGURATION DU STORE ---
export const store = configureStore({
  reducer: {
    theme: themeReducer,
    auth: authReducer,
    inventory: inventoryReducer,
    sales: salesReducer,
    session: sessionReducer,
    clients: clientReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(persistenceMiddleware)
})

// Types globaux
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
