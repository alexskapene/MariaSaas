import React, { useState, useMemo, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '@renderer/app/store/store'
import {
  createDraftRequisition,
  validateRequisition,
  fetchProducts
} from '@renderer/app/store/slice/inventorySlice'
import { ProductDTO } from '@shared/types'

interface Props {
  onClose: () => void
}

export const SupplyModal: React.FC<Props> = ({ onClose }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { products } = useSelector((state: RootState) => state.inventory)
  const user = useSelector((state: RootState) => state.auth.user)

  // État du formulaire d'entrée
  const [selectedProductId, setSelectedProductId] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [buyingPrice, setBuyingPrice] = useState(0)
  const [batchNumber, setBatchNumber] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [defaultSuppliederId, setDefaultSupplierId] = useState('') // Idéalement liste déroulante des fournisseurs créés
  const [searchTerm, setSearchTerm] = useState('')

  const [isSubmitting, setIsSubmitting] = useState(false)

  // Filtrage pour la recherche de produit
  const searchResults = useMemo(() => {
    if (!searchTerm) return []
    return products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.code.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .slice(0, 5)
  }, [searchTerm, products])

  useEffect(() => {
    const loadSupplier = async () => {
      const res = await window.api.inventory.getSuppliers()
      if (res.success && res.data && res.data.length > 0) {
        setDefaultSupplierId(res.data[0].id) // On prend le premier
      }
    }
    loadSupplier()
  }, [])

  const handleSelectProduct = (prod: ProductDTO) => {
    setSelectedProductId(prod.id)
    setSearchTerm(prod.name)
    setBuyingPrice(prod.buyingPrice) // Pré-remplir avec le prix de réf
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedProductId || !user || !defaultSuppliederId) {
      alert('Veuillez sélectionner un produit et vérifier les informations.')
      return
    }

    setIsSubmitting(true)

    try {
      // 1. Créer le brouillon
      // Note: Pour cet exemple rapide, on crée un fournisseur "Direct" par défaut ou on prend le premier
      // Dans une version complète, on sélectionnerait le fournisseur avant.
      // Pour l'instant, on assume qu'un fournisseur existe ou on en crée un temporaire côté backend (A FAIRE: Gérer Supplier)

      // Pour débloquer l'exemple, on va tricher et dire qu'on a besoin d'un supplierId valide.
      // Le backend doit gérer ça.

      // Similons un flux complet : Création Draft -> Validation immédiate
      const draftData = {
        supplierId: defaultSuppliederId,
        createdById: user.id,
        items: [
          {
            productId: selectedProductId,
            quantity: Number(quantity),
            buyPrice: Number(buyingPrice),
            batchNumber: batchNumber,
            expiryDate: new Date(expiryDate)
          }
        ]
      }

      // ATTENTION : Pour que ça marche, il faut avoir créé un fournisseur en base.
      // On va ajouter une action Redux pour ça plus tard.

      // Dispatch Create Draft
      const draftResult = await dispatch(createDraftRequisition(draftData)).unwrap()

      // Dispatch Validate immédiat (pour l'entrée rapide)
      await dispatch(validateRequisition(draftResult.id))

      // Refresh
      dispatch(fetchProducts())
      onClose()
      alert('Stock mis à jour avec succès !')
    } catch (err: unknown) {
      const error = err as Error
      console.error(
        error.message || "Erreur lors de l'entrée de stock. Avez-vous un fournisseur créé ?"
      )
      alert("Erreur lors de l'entrée de stock. Avez-vous un fournisseur créé ?")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2rem] p-8 shadow-2xl border border-slate-200 dark:border-slate-800">
        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-1">
          Nouvelle Livraison
        </h3>
        <p className="text-xs text-slate-400 mb-6">Ajouter du stock physique (Entrée Magasin)</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Recherche Produit */}
          <div className="relative">
            <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">
              Produit à approvisionner
            </label>
            <input
              type="text"
              placeholder="Taper le nom du produit..."
              className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-xl font-bold dark:text-white outline-none focus:ring-2 focus:ring-sky-500"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setSelectedProductId('')
              }}
            />
            {/* Dropdown résultats */}
            {searchTerm && !selectedProductId && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 z-50 overflow-hidden">
                {searchResults.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => handleSelectProduct(p)}
                    className="p-3 hover:bg-sky-50 dark:hover:bg-slate-700 cursor-pointer flex justify-between items-center"
                  >
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
                      {p.name}
                    </span>
                    <span className="text-xs text-slate-400">{p.code}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">
                Quantité Reçue
              </label>
              <input
                type="number"
                className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-xl outline-none font-bold dark:text-white"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                required
                min="1"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">
                Prix Achat Lot
              </label>
              <input
                type="number"
                className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-xl outline-none font-bold dark:text-white"
                value={buyingPrice}
                onChange={(e) => setBuyingPrice(Number(e.target.value))}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">
                Numéro Lot
              </label>
              <input
                type="text"
                placeholder="BATCH-001"
                className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-xl outline-none font-bold dark:text-white"
                value={batchNumber}
                onChange={(e) => setBatchNumber(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">
                Date Péremption
              </label>
              <input
                type="date"
                className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-xl outline-none font-bold dark:text-white"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold rounded-xl"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !selectedProductId}
              className="flex-1 py-4 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-500 shadow-lg shadow-emerald-600/20 disabled:opacity-50"
            >
              {isSubmitting ? 'Traitement...' : 'Valider Entrée'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
