import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useCurrency } from '@renderer/hooks/useCurrently'
import { AppDispatch } from '@renderer/app/store/store'
import { fetchDailyRate } from '@renderer/app/store/slice/sessionSlice'

// Composants
import { StatCard } from './StatCard'
import { SalesChart } from './SalesCharts'
import { AlertsPanel } from './AlertsPanel'
import { VolumeChart } from './VolumeChart'
import { AIBanner } from './AIBanner'
import { RateWidget } from './RateWidget'

interface DashboardStats {
  revenueToday: number
  salesCount: number
  lowStockCount: number
  stockValue: number
  recentSales: { createdAt: string | Date; totalAmount: number }[]
}

const Dashboard: React.FC = () => {
  const { formatPrice } = useCurrency()
  const [data, setData] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    dispatch(fetchDailyRate())
    const loadStats = async () => {
      try {
        const res = await window.api.stats.getDashboard()
        if (res.success && res.data) setData(res.data)
      } catch (err: unknown) {
        const error = err as Error
        console.error(error.message || 'Erreur lors du chargement des statistiques')
      } finally {
        setIsLoading(false)
      }
    }
    loadStats()
  }, [dispatch])

  if (isLoading)
    return (
      <div className="h-full w-full flex items-center justify-center bg-slate-50/50 dark:bg-transparent">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
          <p className="text-xs font-black uppercase tracking-widest text-slate-400 animate-pulse">
            Analyse des flux en cours...
          </p>
        </div>
      </div>
    )

  const stats = data || {
    revenueToday: 0,
    salesCount: 0,
    lowStockCount: 0,
    stockValue: 0,
    recentSales: []
  }

  const chartData = stats.recentSales.map((s) => ({
    name: new Date(s.createdAt).toLocaleDateString(undefined, { weekday: 'short' }),
    sales: s.totalAmount
  }))

  return (
    <div className="max-w-[1600px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
      {/* 1. TOP BAR : Title & Exchange Rate */}
      <div className="relative overflow-hidden flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-slate-200/50 dark:border-slate-800/50 shadow-xl shadow-slate-200/40 dark:shadow-black/20 group">
        {/* Decorative ambient background */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/20 transition-all duration-700"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-5">
            {/* Logo / Brand Icon */}
            <div className="relative flex items-center justify-center w-14 h-14 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl shadow-lg shadow-emerald-500/30 transform group-hover:scale-105 transition-transform duration-500">
              <svg
                className="w-7 h-7 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>

            <div>
              <h2 className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 uppercase tracking-tighter italic leading-none drop-shadow-sm">
                Maria <span className="text-emerald-500">SAAS</span>
              </h2>

              <div className="flex items-center gap-2 mt-3 ml-1">
                <div className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 font-bold text-[11px] uppercase tracking-[0.25em]">
                  Système de Monitoring v1.0
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-fit min-w-[320px] relative z-10">
          <RateWidget />
        </div>
      </div>

      {/* 2. KPI GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Recettes du Jour"
          value={`${formatPrice(stats.revenueToday).value.toLocaleString()} ${formatPrice(stats.revenueToday).symbol}`}
          change={`${stats.salesCount} Ventes`}
          color="emerald"
          icon="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3z M2 12c0 5.523 4.477 10 10 10s10-4.477 10-10S17.523 2 12 2 2 6.477 2 12z"
        />
        <StatCard
          title="Valeur du Stock"
          value={`$ ${stats.stockValue.toLocaleString()}`}
          change="Asset USD"
          color="sky"
          icon="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
        />
        <StatCard
          title="Stock Critique"
          value={stats.lowStockCount.toString()}
          change="Ruptures"
          color="red"
          icon="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
        <StatCard
          title="clients CRM"
          value="Calcul..."
          change="+0% mois"
          color="amber"
          icon="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </div>

      {/* 3. MAIN ANALYTICS ROW */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2">
          <SalesChart data={chartData.length > 0 ? chartData : [{ name: 'Auj', sales: 0 }]} />
        </div>
        <div className="flex flex-col gap-8">
          <AlertsPanel count={stats.lowStockCount} />
          <AIBanner />
        </div>
      </div>

      {/* 4. LOWER ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <VolumeChart data={chartData.length > 0 ? chartData : [{ name: 'Auj', sales: 0 }]} />

        {/* Placeholder pour une future section : Top Produits vendus */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-center italic text-slate-400 text-sm">
          Module &quot;Top Performances Produits&quot; en cours d&apos;apprentissage...
        </div>
      </div>
    </div>
  )
}

export default Dashboard
