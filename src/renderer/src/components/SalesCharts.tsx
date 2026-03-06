import React from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

interface ChartDataPoint {
  name: string
  sales: number
}

interface Props {
  data: ChartDataPoint[]
}

export const SalesChart: React.FC<Props> = ({ data }) => {
  const isDark = document.documentElement.classList.contains('dark')

  // Couleur dynamique : Vert en light, Bleu en dark
  const strokeColor = isDark ? '#38bdf8' : '#059669' // Emerald-600

  return (
    <div className="xl:col-span-2 bg-white dark:bg-slate-900 p-6 md:p-10 rounded-[1rem] md:rounded-[1rem] border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8 md:mb-10">
        <div>
          <h3 className="text-xl md:text-2xl font-black italic text-slate-900 dark:text-white tracking-tighter uppercase leading-none">
            Activité Pharmacie
          </h3>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 leading-none">
            Performance Ventes (7 jours)
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-900/50">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-[9px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
            En direct
          </span>
        </div>
      </div>
      <div className="h-56 md:h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke={isDark ? '#1e293b' : '#f1f5f9'}
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 9, fontWeight: 900, fill: '#94a3b8' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? '#1e293b' : '#ffffff',
                border: 'none',
                borderRadius: '15px',
                color: isDark ? '#fff' : '#0f172a',
                fontSize: '10px',
                fontWeight: '900',
                boxShadow: '0 10px 30px -5px rgba(0,0,0,0.1)'
              }}
              itemStyle={{ color: strokeColor }}
              formatter={(value: number | string | undefined) => {
                if (value === undefined) return ['0 FC', 'Ventes']
                const formatted = Number(value).toLocaleString()
                return [`${formatted} FC`, 'Ventes'] as [string, string]
              }}
            />
            <Line
              type="monotone"
              dataKey="sales"
              stroke={strokeColor}
              strokeWidth={4}
              dot={false}
              strokeLinecap="round"
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
