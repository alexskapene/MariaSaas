import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@renderer/app/store/store'
import { addSupplier, editSupplier } from '@renderer/app/store/slice/inventorySlice'
import { SupplierDTO } from '@shared/types'

interface Props {
  onClose: () => void
  initialData?: SupplierDTO | null // Mode Édition si présent
}

export const AddSupplierModal: React.FC<Props> = ({ onClose, initialData }) => {
  const dispatch = useDispatch<AppDispatch>()
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    contact: initialData?.contact || '',
    phone: initialData?.phone || '',
    email: initialData?.email || '',
    address: initialData?.address || ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      if (initialData) {
        await dispatch(editSupplier({ id: initialData.id, ...formData })).unwrap()
      } else {
        await dispatch(addSupplier(formData)).unwrap()
      }
      onClose()
    } catch (err) {
      setError(err as string)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[120] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in-95 border border-slate-200 dark:border-slate-800">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6 uppercase italic tracking-tighter">
          {initialData ? 'Modifier Fournisseur' : 'Nouveau Fournisseur'}
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-xs font-bold rounded-xl border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              Nom Société
            </label>
            <input
              required
              className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl font-bold dark:text-white mt-1 outline-none focus:ring-2 focus:ring-sky-500"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              Contact Principal
            </label>
            <input
              className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl font-bold dark:text-white mt-1 outline-none focus:ring-2 focus:ring-sky-500"
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Téléphone
              </label>
              <input
                className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl font-bold dark:text-white mt-1 outline-none focus:ring-2 focus:ring-sky-500"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Email
              </label>
              <input
                type="email"
                className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl font-bold dark:text-white mt-1 outline-none focus:ring-2 focus:ring-sky-500"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 py-4 text-slate-500 font-bold hover:bg-slate-100 rounded-xl transition-all"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-4 bg-sky-600 text-white font-black rounded-xl shadow-lg hover:bg-sky-500 transition-all disabled:opacity-50"
            >
              {isSubmitting ? '...' : initialData ? 'Mettre à jour' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
