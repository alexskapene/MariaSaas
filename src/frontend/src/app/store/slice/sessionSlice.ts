import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export interface SessionState {
  currency: 'CDF' | 'USD'
  exchangeRate: number
  isRateSet: boolean // Est-ce que le taux a été défini aujourd'hui
}

const initialState: SessionState = {
  currency: 'CDF',
  exchangeRate: 2300,
  isRateSet: false
}

// Thunk pour récupérer le dernier taux de change au dema

export const fetchDailyRate = createAsyncThunk('session/fetchDailyRate', async () => {
  const res = await window.api.finance.getRate()
  return res.data
})

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    toggleCurrency: (state) => {
      state.currency = state.currency === 'CDF' ? 'USD' : 'CDF'
    },
    setExchangeRate: (state, action) => {
      state.exchangeRate = action.payload
      state.isRateSet = true
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchDailyRate.fulfilled, (state, action) => {
      if (action.payload) {
        state.exchangeRate = action.payload
        state.isRateSet = true // On considère que le dernier taux est valide pour aujourd'hui
      }
    })
  }
})

export const { toggleCurrency, setExchangeRate } = sessionSlice.actions
export default sessionSlice.reducer
