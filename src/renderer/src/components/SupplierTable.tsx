import React from 'react'
import { SupplierDTO } from '@shared/types'

interface Props {
  suppliers: SupplierDTO[]
  isAdmin: boolean
  onEdit: (supplier: SupplierDTO) => void
  onDelete: (id: string) => void
}

export const SupplierTable: React.FC<Props> = ({ suppliers, onEdit, onDelete, isAdmin }) => {
  if (suppliers.length === 0) {
    return (
      <div className="p-20 text-center text-slate-400 font-black uppercase tracking-widest italic">
        Aucun fournisseur trouvé.
      </div>
    )
  }

  return (
    <table className="w-full text-left">
      <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
        <tr>
          <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Nom
          </th>
          <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Contact
          </th>
          <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Coordonnées
          </th>
          {isAdmin && (
            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
              Actions
            </th>
          )}
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
        {suppliers.map((s) => (
          <tr
            key={s.id}
            className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
          >
            <td className="px-8 py-5">
              <span className="font-bold text-slate-700 dark:text-slate-200">{s.name}</span>
            </td>
            <td className="px-8 py-5 text-sm text-slate-500 dark:text-slate-400">
              {s.contact || '-'}
            </td>
            <td className="px-8 py-5">
              <div className="flex flex-col text-xs font-medium text-slate-500">
                {s.phone && <span>📞 {s.phone}</span>}
                {s.email && <span>✉️ {s.email}</span>}
              </div>
            </td>
            {isAdmin && (
              <td className="px-8 py-5 text-right">
                <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onEdit(s)}
                    className="text-sky-500 hover:text-sky-600 font-bold text-xs uppercase tracking-wider"
                  >
                    Éditer
                  </button>
                  <button
                    onClick={() => onDelete(s.id)}
                    className="text-red-400 hover:text-red-600 font-bold text-xs uppercase tracking-wider"
                  >
                    Suppr.
                  </button>
                </div>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
