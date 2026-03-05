import React from 'react'
import { ClientDTO } from '@shared/types'

interface Props {
  clients: ClientDTO[]
  isAdmin: boolean
  onEdit: (client: ClientDTO) => void
  onDelete: (id: string) => void
}

export const ClientTable: React.FC<Props> = ({ clients, onEdit, onDelete, isAdmin }) => {
  if (clients.length === 0) {
    return (
      <div className="p-20 text-center text-slate-400 font-black uppercase tracking-widest italic">
        Aucun client trouvé.
      </div>
    )
  }

  return (
    <table className="w-full text-left">
      <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
        <tr>
          <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            client
          </th>
          <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Solde Crédit
          </th>
          <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Statut
          </th>
          {/* 👇 Colonne conditionnelle */}
          {isAdmin && (
            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
              Actions
            </th>
          )}
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
        {clients.map((c) => (
          <tr
            key={c.id}
            className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
          >
            <td className="px-8 py-5">
              <div className="flex flex-col">
                <span className="font-bold text-slate-700 dark:text-slate-200">{c.name}</span>
                <span className="text-[10px] font-bold text-slate-400">
                  {c.phone || 'Sans téléphone'} • {c.code}
                </span>
              </div>
            </td>
            <td className="px-8 py-5">
              <span
                className={`font-black ${c.currentCredit > 0 ? 'text-red-500' : 'text-emerald-500'}`}
              >
                {c.currentCredit.toLocaleString()} FC
              </span>
            </td>
            <td className="px-8 py-5">
              <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-[9px] font-black text-slate-500 uppercase">
                {c.loyaltyStatus}
              </span>
            </td>
            {/* 👇 Boutons d'action conditionnels */}
            {isAdmin && (
              <td className="px-8 py-5 text-right">
                <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onEdit(c)}
                    className="text-sky-500 hover:text-sky-600 font-bold text-xs uppercase tracking-wider"
                  >
                    Éditer
                  </button>
                  <button
                    onClick={() => onDelete(c.id)}
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
