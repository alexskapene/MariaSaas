import React, { useMemo } from 'react'
import { auditService } from '../services/auditService'
// import { AuditLog } from '../types';

// 1. Définition de l'interface pour les statistiques
interface AuditStatProps {
  title: string
  value: number | string
  color?: string
  icon: string
}

const AuditTrail: React.FC = () => {
  const logs = auditService.getLogs()
  // const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const stats = useMemo(() => {
    return {
      total: logs.length,
      critical: logs.filter((l) => l.severity === 'CRITICAL').length,
      warnings: logs.filter((l) => l.severity === 'WARNING').length,
      recent: logs.filter((l) => new Date().getTime() - new Date(l.timestamp).getTime() < 3600000)
        .length
    }
  }, [logs])

  return (
    <div className="space-y-6 md:space-y-10 animate-in fade-in duration-500 pb-10">
      {/* ... (Titre et bouton inchangés) */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <AuditStat title="Événements" value={stats.total} icon="📜" />
        <AuditStat title="Critiques" value={stats.critical} color="text-red-500" icon="⚠️" />
        <AuditStat title="Avertissements" value={stats.warnings} color="text-amber-500" icon="⚡" />
        <AuditStat title="Récents" value={stats.recent} color="text-sky-500" icon="⏱️" />
      </div>

      {/* ... (Tableau et Modal inchangés) */}
    </div>
  )
}

// 2. Application de l'interface au composant (plus de 'any')
const AuditStat: React.FC<AuditStatProps> = ({
  title,
  value,
  color = 'text-slate-900 dark:text-white',
  icon
}) => (
  <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl md:rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-5 transition-all">
    <div className="text-2xl">{icon}</div>
    <div>
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
      <h4 className={`text-xl md:text-2xl font-black italic tracking-tighter ${color}`}>{value}</h4>
    </div>
  </div>
)

export default AuditTrail
