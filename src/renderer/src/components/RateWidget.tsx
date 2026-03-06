import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@renderer/app/store/store'
import { setExchangeRate } from '@renderer/app/store/slice/sessionSlice'

export const RateWidget: React.FC = () => {
  const dispatch = useDispatch()
  const { exchangeRate } = useSelector((state: RootState) => state.session)
  const { user } = useSelector((state: RootState) => state.auth)

  const [isEditing, setIsEditing] = useState(false)
  const [newRate, setNewRate] = useState(exchangeRate.toString())

  const handleUpdate = async () => {
    if (!user) return
    const rate = parseFloat(newRate)
    if (isNaN(rate) || rate <= 0) return
    await window.api.finance.setRate({ rate, userId: user.id })
    dispatch(setExchangeRate(rate))
    setIsEditing(false)
  }

  return (
    <div className="bg-slate-900 dark:bg-emerald-950/30 border border-slate-800 dark:border-emerald-500/20 p-4 rounded-xl flex items-center gap-6 shadow-inner">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
          <svg
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            viewBox="0 0 24 24"
          >
            <path d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3z M2 12c0 5.523 4.477 10 10 10s10-4.477 10-10S17.523 2 12 2 2 6.477 2 12z" />
          </svg>
        </div>
        <div>
          <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em]">
            Taux USD/CDF
          </p>
          {isEditing ? (
            <input
              type="number"
              value={newRate}
              onChange={(e) => setNewRate(e.target.value)}
              onBlur={handleUpdate}
              className="bg-transparent text-white font-black text-lg outline-none w-24 border-b border-emerald-500"
              autoFocus
            />
          ) : (
            <p
              className="text-lg font-black text-white cursor-pointer hover:text-emerald-400 transition-colors"
              onClick={() => setIsEditing(true)}
            >
              {exchangeRate.toLocaleString()}{' '}
              <span className="text-[10px] text-slate-500 font-bold">FC</span>
            </p>
          )}
        </div>
      </div>
      <div className="h-8 w-[1px] bg-slate-800"></div>
      <div className="text-right">
        <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em]">Référence</p>
        <p className="text-lg font-black text-emerald-500">1.00 $</p>
      </div>
    </div>
  )
}
