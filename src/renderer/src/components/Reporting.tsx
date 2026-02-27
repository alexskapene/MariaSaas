import React, { useState, useMemo } from 'react'
import { reportingService } from '../services/reportingService'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from 'recharts'
import { ProductDTO } from '@shared/types'

// MOCK strictement aligné sur l'interface ProductDTO (zéro propriété inconnue)
const MOCK_INVENTORY_DATA: ProductDTO[] = [
  {
    id: '1',
    name: 'Paracétamol',
    code: 'P001',
    category: 'Analgésique',
    dosage: '500mg',
    sellPrice: 1500,
    buyingPrice: 1000,
    currentStock: 100,
    minStock: 10,
    lots: [
      {
        id: 'l1',
        batchNumber: 'BAT1',
        expiryDate: '2025-01-01',
        quantity: 100,
        receivedDate: new Date().toISOString()
      }
    ],
    isPrescriptionRequired: false,
    vatRate: 0,
    dci: 'Paracétamol',
    form: 'Comprimé'
  },
  {
    id: '2',
    name: 'Amoxicilline',
    code: 'A002',
    category: 'Antibiotique',
    dosage: '500mg',
    sellPrice: 3500,
    buyingPrice: 2200,
    currentStock: 45,
    minStock: 5,
    lots: [
      {
        id: 'l2',
        batchNumber: 'BAT2',
        expiryDate: '2026-01-01',
        quantity: 45,
        receivedDate: new Date().toISOString()
      }
    ],
    isPrescriptionRequired: true,
    vatRate: 0,
    dci: 'Amoxicilline',
    form: 'Gélule'
  }
]

// 2. Interfaces de structure pour le composant
interface StatItem {
  label: string
  value: string | number
}

interface ChartItem {
  name: string
  value: number
  color: string
}

interface ReportRow {
  id: string
  date: Date
  category: string
  amount: number
  description: string
}

const Reporting: React.FC = () => {
  const [reportType, setReportType] = useState<'sales' | 'inventory' | 'credits'>('sales')
  const [dateRange, setDateRange] = useState({
    start: '2024-01-01',
    end: new Date().toISOString().split('T')[0]
  })

  const isDark = document.documentElement.classList.contains('dark')

  const reportData = useMemo(() => {
    if (reportType === 'sales') {
      const sales = reportingService.generateSalesReport(dateRange.start, dateRange.end)
      return {
        mainValue: sales.totalRevenue,
        stats: [
          { label: 'Volume', value: sales.transactionCount },
          {
            label: 'Rentabilité',
            value: `${((sales.profit / (sales.totalRevenue || 1)) * 100).toFixed(1)}%`
          },
          { label: 'Net Profit', value: sales.profit.toLocaleString() + ' FC' }
        ] as StatItem[],
        chart: [
          { name: 'Chiffre Affaires', value: sales.totalRevenue, color: '#0ea5e9' },
          { name: 'Coût Estimé', value: sales.estimatedCost, color: '#64748b' },
          { name: 'Marge Brute', value: sales.profit, color: '#10b981' }
        ] as ChartItem[],

        // On laisse TS inférer le type de "m". On utilise une intersection de type
        // pour s'assurer de capter la date sans perdre la sécurité du typage existant.
        raw: sales.data.map((m): ReportRow => {
          const movement = m as typeof m & { createdAt?: Date | string; timestamp?: Date | string }
          return {
            id: movement.id,
            date: new Date(movement.createdAt || movement.timestamp || new Date()),
            category: movement.category as string,
            amount: movement.amount,
            description: movement.description || ''
          }
        })
      }
    } else if (reportType === 'inventory') {
      const inv = reportingService.getInventoryValuation(MOCK_INVENTORY_DATA)
      return {
        mainValue: inv.totalSellingValue,
        stats: [
          { label: 'Articles', value: inv.count },
          { label: 'Coût Stock', value: inv.totalBuyingValue.toLocaleString() + ' FC' },
          { label: 'Profit Potentiel', value: inv.potentialProfit.toLocaleString() + ' FC' }
        ] as StatItem[],
        chart: [
          { name: 'Valeur Vente', value: inv.totalSellingValue, color: '#0ea5e9' },
          { name: 'Valeur Achat', value: inv.totalBuyingValue, color: '#f59e0b' },
          { name: 'Marge Latente', value: inv.potentialProfit, color: '#10b981' }
        ] as ChartItem[],
        raw: [] as ReportRow[]
      }
    } else {
      const credits = reportingService.generateCreditsReport(dateRange.start, dateRange.end)
      return {
        mainValue: credits.outstanding,
        stats: [
          { label: 'Paiements', value: credits.count },
          { label: 'Recouvré', value: credits.recovered.toLocaleString() + ' FC' },
          {
            label: 'Taux Recouvr.',
            value: `${((credits.recovered / (credits.total || 1)) * 100).toFixed(1)}%`
          }
        ] as StatItem[],
        chart: [
          { name: 'Dû Patient', value: credits.outstanding, color: '#ef4444' },
          { name: 'Recouvré', value: credits.recovered, color: '#10b981' }
        ] as ChartItem[],

        // Même système d'intersection strict ici
        raw: credits.data.map((m): ReportRow => {
          const movement = m as typeof m & { createdAt?: Date | string; timestamp?: Date | string }
          return {
            id: movement.id,
            date: new Date(movement.createdAt || movement.timestamp || new Date()),
            category: movement.category as string,
            amount: movement.amount,
            description: movement.description || ''
          }
        })
      }
    }
  }, [reportType, dateRange])

  const handleExport = (): void => {
    const headers = ['Date', 'Catégorie', 'Montant', 'Description']
    const rows = reportData.raw.map((m: ReportRow) => [
      m.date.toLocaleDateString(),
      m.category,
      m.amount.toString(),
      m.description.replace(/,/g, ' ')
    ])
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `rapport_${reportType}.csv`
    link.click()
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h2 className="text-4xl font-black italic text-slate-900 dark:text-white tracking-tighter uppercase leading-none">
            Analyses & Rapports
          </h2>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em] mt-3">
            Intelligence Décisionnelle • MariaSaas Bi Engine
          </p>
        </div>
        <div className="flex bg-white dark:bg-slate-900 p-1.5 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
          {(['sales', 'inventory', 'credits'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setReportType(type)}
              className={`px-8 py-3 rounded-[1.6rem] text-[10px] font-black uppercase tracking-widest transition-all ${reportType === type ? 'bg-slate-900 dark:bg-sky-600 text-white shadow-xl' : 'text-slate-400'}`}
            >
              {type === 'sales' ? 'Ventes' : type === 'inventory' ? 'Stock' : 'Créances'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Paramètres */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-8 italic">
              Paramètres
            </h3>
            <div className="space-y-6">
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="w-full p-4 bg-slate-50 dark:bg-slate-800 dark:text-white border-none rounded-2xl font-bold"
              />
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="w-full p-4 bg-slate-50 dark:bg-slate-800 dark:text-white border-none rounded-2xl font-bold"
              />
              <button
                onClick={handleExport}
                className="w-full py-5 bg-slate-900 dark:bg-sky-600 text-white rounded-[1.5rem] font-black uppercase text-[10px] tracking-[0.2em] shadow-xl"
              >
                Générer CSV
              </button>
            </div>
          </div>
          {/* KPI */}
          <div
            className={`p-10 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden ${reportType === 'credits' ? 'bg-red-600' : 'bg-emerald-600'}`}
          >
            <p className="text-[10px] font-black opacity-60 uppercase tracking-widest">
              Indicateur Clé
            </p>
            <h4 className="text-4xl font-black tracking-tighter mt-3 italic">
              {reportData.mainValue.toLocaleString()} FC
            </h4>
          </div>
        </div>

        {/* Graphique */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-12 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col min-h-[500px]">
          <div className="flex-1 h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
              {reportType === 'credits' ? (
                <PieChart>
                  <Pie
                    data={reportData.chart}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {reportData.chart.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: '15px', border: 'none', fontWeight: 'bold' }}
                  />
                </PieChart>
              ) : (
                <BarChart
                  data={reportData.chart}
                  layout="vertical"
                  margin={{ left: 40, right: 40 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={true}
                    vertical={false}
                    stroke={isDark ? '#1e293b' : '#f1f5f9'}
                  />
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="name"
                    type="category"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fontWeight: 900, fill: '#64748b' }}
                    width={120}
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: '15px', border: 'none', fontWeight: 'bold' }}
                  />
                  <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={40}>
                    {reportData.chart.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
          {/* Stats Bottom */}
          <div className="grid grid-cols-3 gap-6 mt-12 pt-12 border-t border-slate-50 dark:border-slate-800">
            {reportData.stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">
                  {stat.label}
                </p>
                <p className="text-xl font-black dark:text-white italic tracking-tighter">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Reporting
