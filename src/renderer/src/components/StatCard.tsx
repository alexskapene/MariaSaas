import React from 'react'

interface Props {
  title: string
  value: string
  change: string
  color: 'sky' | 'red' | 'amber' | 'emerald'
  icon: string
}

export const StatCard: React.FC<Props> = ({ title, value, change, color, icon }) => {
  const themes = {
    sky: 'text-sky-600 bg-sky-50 dark:bg-sky-500/10 dark:text-sky-400',
    red: 'text-red-600 bg-red-50 dark:bg-red-500/10 dark:text-red-400',
    amber: 'text-amber-600 bg-amber-50 dark:bg-amber-500/10 dark:text-amber-400',
    emerald: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400'
  }

  return (
    <div className="bg-white dark:bg-slate-900 p-7 rounded-[1rem] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow- hover:shadow-emerald-500/5 transition-all duration-300 hover:scale-[1.02]  group">
      <div className="flex justify-between items-start mb-6">
        <div
          className={`p-3 rounded-2xl ${themes[color]} transition-transform group-hover:scale-110`}
        >
          <svg
            className="opacity-100 transition-opacity duration-300"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
          </svg>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${themes[color]}`}
        >
          {change}
        </span>
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">
          {title}
        </p>
        <h4 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter italic tabular-nums">
          {value}
        </h4>
      </div>
    </div>
  )
}
