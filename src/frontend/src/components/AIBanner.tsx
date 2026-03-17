import React from 'react'

export const AIBanner: React.FC = () => {
  return (
    <div className="bg-emerald-600 dark:bg-slate-900 p-8 md:p-10 rounded-[1rem] md:rounded-[1rem] text-white relative overflow-hidden group shadow-2xl transition-colors">
      {/* Background Effects */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 dark:bg-sky-600/20 rounded-full blur-[80px] group-hover:bg-white/20 dark:group-hover:bg-sky-600/30 transition-all duration-700"></div>

      <div className="relative z-10">
        <h3 className="text-2xl md:text-3xl font-black italic tracking-tighter uppercase mb-4 leading-tight">
          Maria Live AI
        </h3>
        <p className="text-emerald-100 dark:text-slate-400 font-medium text-base md:text-lg leading-relaxed max-w-xs mb-8">
          Analyse prédictive de votre stock en temps réel et détection des ruptures.
        </p>
        <div className="flex items-center gap-6">
          <div className="flex -space-x-3">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-emerald-700 dark:bg-slate-800 border-4 border-emerald-600 dark:border-slate-900 flex items-center justify-center font-black text-[10px]">
              IA
            </div>
          </div>
          <p className="text-[10px] font-black text-white dark:text-sky-400 uppercase tracking-widest bg-black/10 dark:bg-transparent px-3 py-1 rounded-full">
            Connecté
          </p>
        </div>
      </div>
    </div>
  )
}
