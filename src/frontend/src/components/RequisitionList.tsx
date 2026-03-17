import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@renderer/app/store/store'
import { validateRequisition, fetchProducts } from '@renderer/app/store/slice/inventorySlice'
import { RequisitionDTO } from '@shared/types'

export const RequisitionList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const [requisitions, setRequisitions] = useState<RequisitionDTO[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // 🟢 On déplace la logique de chargement dans le useEffect pour éviter les rendus en cascade
  useEffect(() => {
    let isMounted = true // Sécurité pour éviter de setter l'état si le composant est démonté

    const loadData = async () => {
      setIsLoading(true)
      try {
        const res = await window.api.inventory.getRequisitions()
        if (isMounted && res.success && res.data) {
          setRequisitions(res.data as RequisitionDTO[])
        }
      } catch (error) {
        console.error('Erreur de chargement:', error)
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    loadData()

    return () => {
      isMounted = false
    }
  }, [dispatch])

  const handleValidate = async (id: string) => {
    if (confirm('Confirmer la réception de ce stock ? Cette action est irréversible.')) {
      try {
        await dispatch(validateRequisition(id)).unwrap()
        alert('Stock mis à jour !')
        // On recharge les données
        const res = await window.api.inventory.getRequisitions()
        if (res.success && res.data) setRequisitions(res.data as RequisitionDTO[])
        dispatch(fetchProducts())
      } catch (err: unknown) {
        const error = err as Error
        alert('Erreur validation : ' + error.message)
      }
    }
  }

  if (isLoading)
    return (
      <div className="p-20 text-center flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-emerald-500 rounded-full animate-spin"></div>
        <p className="text-xs font-black uppercase text-slate-400 tracking-widest">
          Récupération du journal...
        </p>
      </div>
    )

  return (
    <div className="w-full overflow-x-auto custom-scrollbar bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <table className="w-full text-left min-w-[800px]">
        <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
          <tr>
            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Référence
            </th>
            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Date
            </th>
            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
              Statut
            </th>
            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {requisitions.map((req) => (
            <tr
              key={req.id}
              className="hover:bg-slate-50/50 dark:hover:bg-slate-800 transition-colors group"
            >
              <td className="px-8 py-6">
                <span className="font-black text-slate-800 dark:text-white uppercase italic tracking-tighter">
                  {req.reference}
                </span>
              </td>
              <td className="px-8 py-6">
                <span className="text-[10px] font-bold text-slate-400">
                  {new Date(req.createdAt).toLocaleDateString()}
                </span>
              </td>
              <td className="px-8 py-6 text-center">
                <span
                  className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                    req.status === 'VALIDATED'
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20'
                      : 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/20'
                  }`}
                >
                  {req.status === 'VALIDATED' ? 'Reçu' : 'Brouillon'}
                </span>
              </td>
              <td className="px-8 py-6 text-right">
                {req.status === 'DRAFT' && (
                  <button
                    onClick={() => handleValidate(req.id)}
                    className="px-6 py-2.5 bg-slate-900 dark:bg-sky-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:scale-105 transition-transform shadow-lg"
                  >
                    Valider
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
