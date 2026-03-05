import React from 'react'
import { UIMedication } from '@renderer/features/inventory/types'

interface Props {
  medications: UIMedication[]
  onSelect: (med: UIMedication) => void
}

export const ProductTable: React.FC<Props> = ({ medications, onSelect }) => (
  <table className="w-full text-left min-w-[750px]">
    <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
      <tr>
        <th className="px-6 md:px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
          Article & QR
        </th>
        <th className="px-6 md:px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
          Catégorie
        </th>
        <th className="px-6 md:px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
          Dosage
        </th>
        <th className="px-6 md:px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
          Stock
        </th>
        <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
          P. Achat
        </th>
        <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
          P. Vente
        </th>
        <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
          Marge
        </th>
        <th className="px-6 md:px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
          Action
        </th>
      </tr>
    </thead>
    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
      {medications.map((med) => {
        const isLow = med.currentStock <= med.minStock
        const margin = med.sellPrice - med.buyingPrice
        const marginPercent = med.sellPrice > 0 ? ((margin / med.sellPrice) * 100).toFixed(0) : 0

        return (
          <tr
            key={med.id}
            className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group"
          >
            {/* Article */}
            <td className="px-6 py-5">
              <div className="flex items-center gap-4">
                {med.qrCode && (
                  <div
                    className="w-10 h-10 bg-white p-1 rounded-lg border dark:border-slate-700 flex-none cursor-pointer"
                    onClick={() => onSelect(med)}
                  >
                    <img src={med.qrCode} alt="QR" className="w-full h-full object-contain" />
                  </div>
                )}
                <div className="flex flex-col min-w-0">
                  <span className="font-black text-slate-900 dark:text-white text-sm truncate">
                    {med.name}
                  </span>
                  <span className="text-[9px] font-black text-sky-600 uppercase tracking-widest mt-0.5">
                    {med.code}
                  </span>
                </div>
              </div>
            </td>

            {/* Dosage */}
            <td className="px-6 py-5 text-center font-bold text-slate-500 dark:text-slate-400 text-xs">
              {med.dosage || '-'}
            </td>

            {/* Stock */}
            <td className="px-6 py-5 text-center">
              <div
                className={`inline-flex flex-col items-center px-3 py-1 rounded-lg ${isLow ? 'bg-red-50 dark:bg-red-900/20 text-red-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
              >
                <span className="font-black text-sm leading-none">{med.currentStock}</span>
              </div>
            </td>

            {/* P. Achat */}
            <td className="px-6 py-5 text-right font-medium text-slate-400 text-xs">
              {med.buyingPrice.toLocaleString()}
            </td>

            {/* P. Vente */}
            <td className="px-6 py-5 text-right font-black text-slate-700 dark:text-white text-sm">
              {med.sellPrice.toLocaleString()}{' '}
              <span className="text-[9px] text-slate-400 font-normal">Fc</span>
            </td>

            {/* Marge */}
            <td className="px-6 py-5 text-right">
              <span
                className={`text-xs font-black ${margin >= 0 ? 'text-emerald-600' : 'text-red-500'}`}
              >
                {margin > 0 ? '+' : ''}
                {marginPercent}%
              </span>
            </td>

            {/* Action */}
            <td className="px-6 py-5 text-right">
              <button
                onClick={() => onSelect(med)}
                className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 rounded-lg transition-all active:scale-90"
              >
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7Z" />
                </svg>
              </button>
            </td>
          </tr>
        )
      })}
    </tbody>
  </table>
)
