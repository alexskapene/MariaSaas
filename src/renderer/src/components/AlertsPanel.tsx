import React from 'react'

interface Props {
  count: number
}

interface AlertItemProps {
  type: 'danger' | 'warning' | 'info'
  title: string
  message: string
  date: string
}

const AlertItem = ({ type, title, message, date }: AlertItemProps) => {
  const indicators = {
    danger: 'bg-red-500 shadow-red-500/50',
    warning: 'bg-amber-500 shadow-amber-500/50',
    info: 'bg-emerald-500 shadow-emerald-500/50' // Info en vert mnt
  }
  return (
    <div className="flex items-center gap-4 p-4 md:p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700/50 transition-colors hover:bg-white dark:hover:bg-slate-800">
      <div
        className={`w-2 h-2 rounded-full flex-none shadow-lg ${indicators[type as keyof typeof indicators]}`}
      ></div>
      <div className="flex-1 min-w-0">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1 truncate">
          {title}
        </p>
        <p className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">{message}</p>
      </div>
      <span className="text-[9px] font-black text-slate-400 uppercase flex-none">{date}</span>
    </div>
  )
}

export const AlertsPanel: React.FC<Props> = ({ count }) => {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 md:p-10 rounded-[1rem] md:rounded-[1rem] border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-lg md:text-xl font-black italic text-slate-900 dark:text-white tracking-tighter uppercase">
          Alertes GxP
        </h3>
        {count > 0 && <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>}
      </div>
      <div className="space-y-3 md:space-y-4">
        <AlertItem
          type="danger"
          title="Stock Critique"
          message={`${count} produits sous seuil`}
          date="Maintenant"
        />
        <AlertItem type="info" title="Système" message="Base de données connectée" date="OK" />
      </div>
      <button className="w-full mt-8 py-4 bg-emerald-50 dark:bg-slate-800 text-emerald-600 dark:text-slate-400 hover:bg-emerald-100 dark:hover:text-white rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all">
        Voir Inventaire
      </button>
    </div>
  )
}
