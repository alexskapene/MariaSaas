import React from 'react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts'

interface Props {
  data: { name: string; sales: number }[]
}

export const VolumeChart: React.FC<Props> = ({ data }) => {
  const isDark = document.documentElement.classList.contains('dark')
  const activeColor = isDark ? '#3b82f6' : '#10b981' // Emerald en light

  return (
    <div className="bg-white dark:bg-slate-900 p-6 md:p-10 rounded-[1rem] md:rounded-[1rem] border border-slate-200 dark:border-slate-800 shadow-sm transition-colors overflow-hidden">
      <h3 className="text-xl font-black italic text-slate-900 dark:text-white tracking-tighter uppercase mb-10">
        Volume Hebdomadaire
      </h3>
      <div className="h-60 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke={isDark ? '#1e293b' : '#f1f5f9'}
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fontWeight: 900, fill: '#64748b' }}
            />
            <YAxis hide />
            <Tooltip
              cursor={{ fill: 'transparent' }}
              contentStyle={{
                backgroundColor: isDark ? '#0f172a' : '#fff',
                borderRadius: '10px',
                border: 'none',
                color: isDark ? '#fff' : '#000'
              }}
            />
            <Bar dataKey="sales" radius={[8, 8, 0, 0]} barSize={30}>
              {data.map((_, index) => (
                // La dernière barre (aujourd'hui) est colorée
                <Cell
                  key={`cell-${index}`}
                  fill={index === data.length - 1 ? activeColor : isDark ? '#e2e8f0' : '#d1fae5'}
                  className="hover:opacity-80 transition-opacity dark:fill-slate-800"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
