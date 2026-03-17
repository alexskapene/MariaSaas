import React, { useMemo } from 'react'
import { UIMedication } from '../features/inventory/types'
import { ProductLotDTO } from '@shared/types'

interface FlatLot extends ProductLotDTO {
  medName: string
  medCode: string
  receivedDate: string
}

interface Props {
  medications: UIMedication[]
}

export const LotTable: React.FC<Props> = ({ medications }) => {
  // Aplatir la liste des médicaments pour obtenir une liste de lots
  const lots = useMemo(() => {
    const flatLots: FlatLot[] = []

    medications.forEach((med) => {
      // med.lots contient des objets de type UILot/ProductLotDTO
      med.lots.forEach((lot) => {
        flatLots.push({
          id: lot.id,
          batchNumber: lot.batchNumber,
          expiryDate: lot.expiryDate,
          quantity: lot.quantity,
          receivedDate: lot.receivedDate,
          medName: med.name,
          medCode: med.code
        })
      })
    })

    // Tri par date de péremption (le plus proche en premier)
    return flatLots.sort(
      (a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime()
    )
  }, [medications])

  if (lots.length === 0) {
    return (
      <div className="p-20 text-center flex flex-col items-center justify-center gap-4 animate-in fade-in">
        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-2xl">
          📦
        </div>
        <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">
          Aucun lot détecté en stock
        </p>
      </div>
    )
  }

  return (
    <table className="w-full text-left min-w-[800px]">
      <thead className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
        <tr>
          <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Produit
          </th>
          <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Lot #
          </th>
          <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Péremption
          </th>
          <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
            Quantité
          </th>
          <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
            Statut
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
        {lots.map((lot) => {
          const expiry = new Date(lot.expiryDate)
          const today = new Date()
          const diffMonths = (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 30)
          const isExpired = diffMonths < 0
          const isUrgent = diffMonths < 3

          return (
            <tr
              key={lot.id}
              className="hover:bg-slate-50/50 dark:hover:bg-slate-800 transition-colors group"
            >
              <td className="px-10 py-6">
                <div className="flex flex-col min-w-0">
                  <span className="font-black text-slate-900 dark:text-white text-sm truncate">
                    {lot.medName}
                  </span>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mt-1">
                    {lot.medCode}
                  </span>
                </div>
              </td>
              <td className="px-10 py-6 font-mono font-bold text-slate-500 dark:text-slate-400 text-xs uppercase italic whitespace-nowrap">
                {lot.batchNumber}
              </td>
              <td className="px-10 py-6 whitespace-nowrap">
                <span
                  className={`font-black text-sm ${isExpired ? 'text-red-600' : isUrgent ? 'text-amber-500' : 'text-slate-900 dark:text-white'}`}
                >
                  {expiry.toLocaleDateString()}
                </span>
              </td>
              <td className="px-10 py-6 text-center font-black dark:text-white tabular-nums">
                {lot.quantity}
              </td>
              <td className="px-10 py-6 text-right whitespace-nowrap">
                <span
                  className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest ${
                    isExpired
                      ? 'bg-red-600 text-white shadow-lg shadow-red-500/20'
                      : isUrgent
                        ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/20'
                        : 'bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600'
                  }`}
                >
                  {isExpired ? 'Expiré' : isUrgent ? 'Urgent' : 'Valide'}
                </span>
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
