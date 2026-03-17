import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '@renderer/app/store/store'
import { fetchProducts, createDraftRequisition } from '@renderer/app/store/slice/inventorySlice'
import { SupplierDTO } from '@shared/types'

interface LineItem {
  id: string // Temporaire pour la clé React
  productId: string
  quantity: number
  buyPrice: number
  batchNumber: string
  expiryDate: string
}

interface Props {
  onClose: () => void
  onSuccess: () => void
}

export const RequisitionEditor: React.FC<Props> = ({ onClose, onSuccess }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { products } = useSelector((state: RootState) => state.inventory)
  const user = useSelector((state: RootState) => state.auth.user)

  // État local de la réquisition
  const [suppliers, setSuppliers] = useState<SupplierDTO[]>([])
  const [supplierId, setSupplierId] = useState('')
  const [isLoadingSuppliers, setIsLoadingSuppliers] = useState(true)
  // On initialise directement avec une ligne vide
  // Cela évite d'appeler addLine() dans le useEffect
  const [items, setItems] = useState<LineItem[]>(() => [
    {
      id: 'initial-line',
      productId: '',
      quantity: 1,
      buyPrice: 0,
      batchNumber: '',
      expiryDate: ''
    }
  ])

  // Fonction addLine typée
  const addLine = () => {
    setItems((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        productId: '',
        quantity: 1,
        buyPrice: 0,
        batchNumber: '',
        expiryDate: ''
      }
    ])
  }

  // Chargement initial
  useEffect(() => {
    dispatch(fetchProducts())

    // Chargement robuste des fournisseurs
    window.api.inventory
      .getSuppliers()
      .then((res) => {
        if (res.success && res.data && res.data.length > 0) {
          setSuppliers(res.data)
          setSupplierId(res.data[0].id)
        } else {
          // AUCUN FOURNISSEUR TROUVÉ
          // On peut soit bloquer, soit permettre de continuer sans fournisseur (si le backend le permet)
          // Ici, on va afficher une alerte visuelle dans l'UI
        }
      })
      .catch(console.error)
      .finally(() => setIsLoadingSuppliers(false)) // Fin du chargement
  }, [dispatch])

  const removeLine = (id: string) => {
    setItems(items.filter((i) => i.id !== id))
  }

  // Typage strict de value (string pour les ID/Dates, number pour les quantités)
  const updateLine = (id: string, field: keyof LineItem, value: string | number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          if (field === 'productId') {
            const prod = products.find((p) => p.id === value)
            return { ...item, [field]: value as string, buyPrice: prod?.buyingPrice || 0 }
          }
          return { ...item, [field]: value }
        }
        return item
      })
    )
  }

  const handleSaveDraft = async () => {
    // Validation basique
    const validItems = items.filter((i) => i.productId && i.quantity > 0)
    if (validItems.length === 0) {
      alert('Ajoutez au moins un produit valide.')
      return
    }

    try {
      await dispatch(
        createDraftRequisition({
          supplierId,
          createdById: user!.id,
          items: validItems.map((i) => ({
            productId: i.productId,
            quantity: Number(i.quantity),
            buyPrice: Number(i.buyPrice),
            batchNumber: i.batchNumber,
            expiryDate: i.expiryDate ? new Date(i.expiryDate) : undefined
          }))
        })
      ).unwrap()

      alert('Brouillon sauvegardé !')
      onSuccess()
    } catch (err: unknown) {
      const error = err as Error
      console.error(error.message || 'Erreur lors de la sauvegarde du brouillon')
      alert('Erreur lors de la sauvegarde.')
    }
  }

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/95 backdrop-blur-xl flex flex-col p-4 md:p-8 animate-in fade-in">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight">
            Nouvelle Réquisition
          </h2>
          <p className="text-slate-400 text-xs mt-1">Création de lot en masse (Mode Brouillon)</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-700"
          >
            Fermer
          </button>
          <button
            onClick={handleSaveDraft}
            className="px-6 py-3 bg-sky-600 text-white font-bold rounded-xl hover:bg-sky-500 shadow-lg shadow-sky-600/20"
          >
            Sauvegarder Brouillon
          </button>
        </div>
      </div>

      {/* Toolbar Fournisseur Blindée */}
      <div className="bg-slate-800 p-4 rounded-2xl mb-4 flex items-center gap-4 border border-slate-700">
        <label className="text-slate-400 text-xs font-bold uppercase">Fournisseur :</label>

        {isLoadingSuppliers ? (
          <span className="text-slate-500 text-xs italic">Chargement...</span>
        ) : suppliers.length > 0 ? (
          <select
            value={supplierId}
            onChange={(e) => setSupplierId(e.target.value)}
            className="bg-slate-900 text-white p-2 rounded-lg border border-slate-600 outline-none focus:border-sky-500"
          >
            {suppliers.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        ) : (
          <div className="flex items-center gap-3">
            <span className="text-amber-500 text-xs font-bold flex items-center gap-1">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              Aucun fournisseur
            </span>
            {/* Idéalement un bouton pour créer un fournisseur à la volée ici */}
            <button className="text-xs text-sky-400 underline">Créer un fournisseur rapide</button>
          </div>
        )}
      </div>

      {/* Table Éditable */}
      <div className="flex-1 bg-white dark:bg-slate-900 rounded-3xl border border-slate-700 overflow-hidden shadow-2xl">
        <div className="overflow-auto h-full custom-scrollbar">
          <table className="w-full text-left">
            <thead className="bg-slate-800 text-slate-400 text-[10px] uppercase font-black tracking-widest sticky top-0 z-10">
              <tr>
                <th className="p-4 w-12">#</th>
                <th className="p-4 min-w-[200px]">Produit</th>
                <th className="p-4 w-32">Quantité</th>
                <th className="p-4 w-32">P. Achat</th>
                <th className="p-4 w-40">Num. Lot</th>
                <th className="p-4 w-40">Péremption</th>
                <th className="p-4 w-20 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {items.map((item, index) => (
                <tr key={item.id} className="hover:bg-slate-800/50 transition-colors group">
                  <td className="p-4 text-slate-500 font-mono text-xs">{index + 1}</td>

                  {/* Produit Select */}
                  <td className="p-4">
                    <select
                      value={item.productId}
                      onChange={(e) => updateLine(item.id, 'productId', e.target.value)}
                      className="w-full bg-transparent text-white outline-none border-b border-transparent focus:border-sky-500 transition-colors py-1"
                    >
                      <option value="" className="bg-slate-900">
                        Sélectionner un produit...
                      </option>
                      {products.map((p) => (
                        <option key={p.id} value={p.id} className="bg-slate-900">
                          {p.name} ({p.code})
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* Quantité */}
                  <td className="p-4">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateLine(item.id, 'quantity', e.target.value)}
                      className="w-full bg-transparent text-white outline-none border-b border-transparent focus:border-sky-500 text-center font-bold"
                      min="1"
                    />
                  </td>

                  {/* Prix Achat */}
                  <td className="p-4">
                    <input
                      type="number"
                      value={item.buyPrice}
                      onChange={(e) => updateLine(item.id, 'buyPrice', e.target.value)}
                      className="w-full bg-transparent text-white outline-none border-b border-transparent focus:border-sky-500 text-right"
                    />
                  </td>

                  {/* Lot */}
                  <td className="p-4">
                    <input
                      type="text"
                      value={item.batchNumber}
                      onChange={(e) => updateLine(item.id, 'batchNumber', e.target.value)}
                      className="w-full bg-transparent text-white outline-none border-b border-transparent focus:border-sky-500 uppercase font-mono text-xs"
                      placeholder="BATCH..."
                    />
                  </td>

                  {/* Date */}
                  <td className="p-4">
                    <input
                      type="date"
                      value={item.expiryDate}
                      onChange={(e) => updateLine(item.id, 'expiryDate', e.target.value)}
                      className="w-full bg-transparent text-white outline-none border-b border-transparent focus:border-sky-500 text-xs"
                    />
                  </td>

                  {/* Delete */}
                  <td className="p-4 text-center">
                    <button
                      onClick={() => removeLine(item.id)}
                      className="text-red-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            onClick={addLine}
            className="w-full py-4 text-slate-500 hover:text-sky-400 hover:bg-slate-800/30 transition-all font-bold text-xs uppercase tracking-widest border-t border-dashed border-slate-700"
          >
            + Ajouter une ligne
          </button>
        </div>
      </div>
    </div>
  )
}
