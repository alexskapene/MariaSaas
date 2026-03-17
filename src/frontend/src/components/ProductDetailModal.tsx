import React from 'react'
import { UIMedication } from '../features/inventory/types'

interface Props {
  medication: UIMedication
  onClose: () => void
}

export const ProductDetailModal: React.FC<Props> = ({ medication, onClose }) => {
  const totalStock = medication.lots.reduce((acc, l) => acc + l.quantity, 0)
  const displayStock =
    totalStock === 0 && medication.currentStock > 0 ? medication.currentStock : totalStock

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[3rem] p-8 md:p-12 shadow-2xl animate-in zoom-in-95 border border-slate-200 dark:border-slate-800">
        <div className="flex flex-col items-center text-center">
          {medication.qrCode && (
            <div className="w-40 h-40 md:w-48 md:h-48 bg-white p-2 rounded-[2rem] border-2 border-slate-100 dark:border-slate-800 shadow-2xl mb-8">
              <img src={medication.qrCode} alt="QR" className="w-full h-full object-contain" />
            </div>
          )}

          <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white italic tracking-tighter uppercase mb-4 leading-tight">
            {medication.name}
          </h3>
          <p className="text-sky-600 font-black tracking-widest text-[10px] uppercase mb-8">
            {medication.code} • {medication.dosage}
          </p>

          <div className="w-full grid grid-cols-2 gap-4 mb-10">
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
              <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Total Stock</p>
              <p className="text-2xl font-black dark:text-white italic">{displayStock}</p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
              <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Seuil Alerte</p>
              <p className="text-2xl font-black dark:text-white italic">{medication.minStock}</p>
            </div>
          </div>

          <div className="w-full space-y-3">
            <button
              onClick={onClose}
              className="w-full py-5 bg-slate-900 dark:bg-sky-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl active:scale-95 transition-all"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
