import React from 'react'
import { ClientDTO } from '@shared/types'

export const ClientStats: React.FC<{ clients: ClientDTO[] }> = ({ clients }) => {
  const totalCredit = clients.reduce((acc, c) => acc + (c.currentCredit || 0), 0)

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-5 transition-colors">
        <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center text-emerald-600">
          <svg
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
          </svg>
        </div>
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Total clients
          </p>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {clients.length}
          </h3>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-5 transition-colors">
        <div className="w-14 h-14 bg-amber-50 dark:bg-amber-900/20 rounded-2xl flex items-center justify-center text-amber-600">
          <svg
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path d="M12 1v22m5-18H9.5a4.5 4.5 0 1 0 0 9h5a4.5 4.5 0 1 1 0 9H6" />
          </svg>
        </div>
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Encours Crédit
          </p>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {totalCredit.toLocaleString()} FC
          </h3>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-5 transition-colors">
        <div className="w-14 h-14 bg-sky-50 dark:bg-sky-900/20 rounded-2xl flex items-center justify-center text-sky-600">
          <svg
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <path d="M22 4 12 14.01l-3-3" />
          </svg>
        </div>
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Fidélité
          </p>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {clients.filter((c) => c.loyaltyStatus !== 'NONE').length}
          </h3>
        </div>
      </div>
    </div>
  )
}
