import React from 'react'
import { toggleCurrency } from '@renderer/app/store/slice/sessionSlice'
import { useCurrency } from '@renderer/hooks/useCurrently'
import { useDispatch } from 'react-redux'
import { CartItemUI } from '@renderer/app/store/slice/salesSlice'

// Définir le type exact attendu par votre slice Redux
export type PaymentMethodType = 'CASH' | 'MOBILE_MONEY' | 'CARD'

interface Props {
  cart: CartItemUI[]
  subTotal: number
  paymentMethod: string
  isLoading: boolean
  error: string | null
  onRemove: (id: string) => void
  onUpdateQty: (id: string, qty: number) => void
  onSetMethod: (method: PaymentMethodType) => void
  onCheckout: () => void
}

export const CartPanel: React.FC<Props> = ({
  cart,
  subTotal,
  paymentMethod,
  isLoading,
  error,
  onRemove,
  onUpdateQty,
  onSetMethod,
  onCheckout
}) => {
  const dispatch = useDispatch()
  const { currency } = useCurrency() // On récupère la devise courante

  const handleCheckoutClick = () => {
    if (confirm(`Confirmer la vente de ${subTotal.toLocaleString()} Fc ?`)) {
      onCheckout()
    }
  }

  return (
    <div className="w-[420px] bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden h-full">
      {/* Header */}
      <div className="p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
        <div className="flex justify-between items-center mb-1">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
            Panier
          </h2>
          <span className="bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400 text-xs font-black px-3 py-1.5 rounded-full">
            {cart.length} Art.
          </span>
        </div>
        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
          Ticket #{new Date().getTime().toString().slice(-6)}
        </p>
      </div>

      {/* BOUTON DEVISE (Déplacé ici pour être visible en haut) */}
      <button
        onClick={() => dispatch(toggleCurrency())}
        className="flex items-center gap-2 bg-white dark:bg-slate-900 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-sky-500 transition-all shadow-sm"
      >
        <span
          className={`text-[10px] font-black ${currency === 'CDF' ? 'text-sky-600' : 'text-slate-400'}`}
        >
          CDF
        </span>
        <div className="w-8 h-4 bg-slate-100 dark:bg-slate-800 rounded-full relative border border-slate-200 dark:border-slate-600">
          <div
            className={`absolute top-0.5 w-3 h-3 bg-slate-400 dark:bg-white shadow-sm rounded-full transition-all ${currency === 'USD' ? 'left-4 bg-emerald-500' : 'left-0.5'}`}
          ></div>
        </div>
        <span
          className={`text-[10px] font-black ${currency === 'USD' ? 'text-emerald-500' : 'text-slate-400'}`}
        >
          USD
        </span>
      </button>

      {/* Liste */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4">
        {cart.map((item) => (
          <div
            key={item.productId}
            className="flex items-center gap-4 p-4 rounded-3xl bg-slate-50 dark:bg-slate-950/50 border border-transparent hover:border-slate-200 dark:hover:border-slate-800 transition-all group"
          >
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-slate-800 dark:text-white text-sm truncate">
                {item.name}
              </h4>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                {item.unitPrice.toLocaleString()} x {item.quantity}
              </p>
            </div>

            <div className="flex items-center gap-1 bg-white dark:bg-slate-900 rounded-xl p-1 shadow-sm border border-slate-100 dark:border-slate-800">
              <button
                onClick={() => onUpdateQty(item.productId, item.quantity - 1)}
                className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors font-bold text-lg"
              >
                -
              </button>
              <span className="text-sm font-black w-6 text-center dark:text-white">
                {item.quantity}
              </span>
              <button
                onClick={() => onUpdateQty(item.productId, item.quantity + 1)}
                className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors font-bold text-lg"
              >
                +
              </button>
            </div>

            <div className="text-right min-w-[60px]">
              <p className="font-black text-slate-900 dark:text-white text-sm">
                {(item.unitPrice * item.quantity).toLocaleString()}
              </p>
              <button
                onClick={() => onRemove(item.productId)}
                className="text-[10px] text-red-400 font-bold hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                SUPPR.
              </button>
            </div>
          </div>
        ))}

        {cart.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-slate-300 dark:text-slate-700 opacity-50 space-y-4">
            <svg
              width="80"
              height="80"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              viewBox="0 0 24 24"
            >
              <path d="M16 11V7a4 4 0 0 0-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <p className="text-sm font-black uppercase tracking-widest">En attente de produits</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-8 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-10 space-y-6">
        {/* Payment Methods */}
        <div className="grid grid-cols-3 gap-2">
          {(['CASH', 'MOBILE_MONEY', 'CARD'] as const).map((method) => (
            <button
              key={method}
              onClick={() => onSetMethod(method)}
              className={`py-3 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${
                paymentMethod === method
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-transparent shadow-lg scale-105'
                  : 'bg-slate-50 dark:bg-slate-800 border-transparent text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {method === 'MOBILE_MONEY' ? 'Mobile' : method}
            </button>
          ))}
        </div>

        {/* Totals */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span>Net à payer</span>
            <span>TTC</span>
          </div>
          <div className="flex justify-between items-end">
            <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">
              {subTotal.toLocaleString()}
            </span>
            <span className="text-sm font-bold text-slate-400 mb-1.5">Fc</span>
          </div>
        </div>

        {error && (
          <div className="text-red-500 text-xs font-bold text-center bg-red-50 p-3 rounded-xl animate-bounce">
            {error}
          </div>
        )}

        <button
          onClick={handleCheckoutClick}
          disabled={cart.length === 0 || isLoading}
          className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-200 disabled:dark:bg-slate-800 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-black rounded-2xl shadow-xl shadow-emerald-600/30 active:scale-[0.98] transition-all flex items-center justify-center gap-4 text-sm uppercase tracking-widest"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <>
              <span>Encaisser</span>
              <svg
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                viewBox="0 0 24 24"
              >
                <path d="M5 13l4 4L19 7" />
              </svg>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
