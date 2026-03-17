import React, { useState, useMemo } from 'react'

// Composants
import { InventoryHeader } from './InventoryHeader'
import { ProductTable } from './ProductTable'
import { AddProductModal } from './AddProductModal'
import { LotTable } from './LotTable'
import { ProductDetailModal } from './ProductDetailModal'
import { RequisitionEditor } from './RequisitionEditor'
import { RequisitionList } from './RequisitionList'
import CategoryBadge from './CategoryBadge'

// Redux & Logic
import { useInventoryLogic } from '@renderer/hooks/useInventoryLogic'
import { createProduct } from '@renderer/app/store/slice/inventorySlice'
import { CATEGORIES, UIMedication } from '../features/inventory/types'
import { ProductInput } from '@shared/schemas/inventorySchema'

const Inventory: React.FC = () => {
  // Logic Hook
  const { enrichedMeds, isLoading, error, refresh, dismissError, dispatch } = useInventoryLogic()

  // State UI Local
  const [activeTab, setActiveTab] = useState<'stock' | 'lots' | 'orders' | 'ai'>('stock')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Tous')

  // Modals State
  const [showAddModal, setShowAddModal] = useState(false)
  const [showRequisitionEditor, setShowRequisitionEditor] = useState(false) // État pour l'entrée de stock
  const [showScanner, setShowScanner] = useState(false)
  const [selectedMed, setSelectedMed] = useState<UIMedication | null>(null)

  // Filtres
  const filteredMedications = useMemo(() => {
    const term = searchTerm.toLowerCase().trim()
    return enrichedMeds.filter((med) => {
      const matchesSearch =
        !term || med.name.toLowerCase().includes(term) || med.code.toLowerCase().includes(term)
      const matchesCategory = selectedCategory === 'Tous' || med.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [searchTerm, enrichedMeds, selectedCategory])

  // Handler Création
  const handleCreate = async (data: ProductInput) => {
    await dispatch(createProduct(data))
    setShowAddModal(false)
  }

  // 1. ÉTAT DE CHARGEMENT INITIAL (Squelette ou Spinner)
  if (isLoading && enrichedMeds.length === 0) {
    return (
      <div className="flex h-[80vh] items-center justify-center flex-col gap-4">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-sky-600 rounded-full animate-spin"></div>
        <p className="text-slate-400 font-medium animate-pulse">
          Initialisation de l&apos;inventaire...
        </p>
      </div>
    )
  }

  // 2. ÉTAT VIDE (EMPTY STATE) - Si aucun produit n'existe du tout ET pas d'erreur
  if (!isLoading && enrichedMeds.length === 0 && !searchTerm && !error) {
    return (
      <div className="flex h-[80vh] items-center justify-center flex-col gap-6 animate-in fade-in zoom-in-95 duration-500">
        <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-2">
          <span className="text-4xl">📦</span>
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            Votre stock est vide
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Commencez par référencer vos premiers médicaments pour activer la gestion
            d&apos;inventaire.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-8 py-4 bg-sky-600 text-white font-black rounded-2xl shadow-xl hover:bg-sky-500 transition-all flex items-center gap-3"
        >
          <svg
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            viewBox="0 0 24 24"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
          Créer mon premier produit
        </button>
        {/* On laisse quand même le modal accessible */}
        {showAddModal && (
          <AddProductModal onClose={() => setShowAddModal(false)} onSubmit={handleCreate} />
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500 pb-10">
      {/* ERROR BANNER */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-2xl flex items-center justify-between animate-in slide-in-from-top-2">
          <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
            <svg
              className="w-5 h-5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="font-semibold text-sm">{error}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={refresh}
              className="px-3 py-1.5 bg-white dark:bg-red-900/40 text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-300 rounded-lg hover:bg-red-50 transition-colors"
            >
              Réessayer
            </button>
            <button
              onClick={dismissError}
              className="p-1 hover:bg-red-100 dark:hover:bg-red-900/60 rounded-full transition-colors text-red-400"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* 1. Header */}
      <InventoryHeader
        onScan={() => setShowScanner(true)}
        onNew={() => setShowAddModal(true)}
        onSupply={() => setShowRequisitionEditor(true)} // On ouvre l'éditeur complet
      />

      {/* 2. Controls (Search + Tabs + Categories) */}
      <div className="flex flex-col gap-6 bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl md:rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Barre de recherche */}
          <div className="relative flex-1 group">
            <input
              type="text"
              placeholder="Chercher par nom, code..."
              className="w-full pl-12 pr-10 py-4 md:py-5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl md:rounded-[1.8rem] focus:ring-4 focus:ring-sky-500/10 outline-none transition-all font-black dark:text-white text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sky-500"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </div>

          {/* Onglets (Tabs) */}
          <div className="flex bg-slate-50 dark:bg-slate-800 p-1.5 rounded-2xl md:rounded-[1.8rem] w-full lg:w-fit overflow-x-auto no-scrollbar">
            {(
              [
                { id: 'stock', label: 'Médocs', icon: '📦' },
                { id: 'lots', label: 'Lots', icon: '🏷️' },
                { id: 'orders', label: 'Commandes', icon: '📋' },
                { id: 'ai', label: 'IA', icon: '✨' }
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 lg:flex-none px-4 md:px-8 py-3 md:py-3.5 rounded-xl md:rounded-[1.5rem] text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${activeTab === tab.id ? 'bg-slate-900 dark:bg-sky-600 text-white shadow-xl' : 'text-slate-400 hover:bg-white dark:hover:bg-slate-700'}`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Catégories */}

        <div className="flex gap-4 p-2">
          {CATEGORIES.map((cat) => (
            <button key={cat} onClick={() => setSelectedCategory(cat)}>
              <CategoryBadge category={cat} isActive={selectedCategory === cat} />
            </button>
          ))}
        </div>
      </div>

      {/* 3. Content Area (Tableaux) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl md:rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors animate-in slide-in-from-bottom-4 duration-500">
        <div className="overflow-x-auto custom-scrollbar">
          {activeTab === 'stock' && (
            <>
              <ProductTable
                medications={filteredMedications.slice(0, 50)}
                onSelect={setSelectedMed}
              />
              {filteredMedications.length > 50 && (
                <div className="p-4 text-center text-slate-400 text-xs italic bg-slate-50 dark:bg-slate-800/50">
                  Affichage limité aux 50 premiers produits pour la fluidité. Utilisez la recherche
                  pour trouver un produit spécifique.
                </div>
              )}
            </>
          )}
          {activeTab === 'lots' && <LotTable medications={filteredMedications} />}
          {activeTab === 'orders' && <RequisitionList />}
          {activeTab === 'ai' && (
            <div className="p-10 text-center text-slate-400">
              Module IA en cours de chargement...
            </div>
          )}
        </div>
      </div>

      {/* 4. Modals */}
      {showAddModal && (
        <AddProductModal onClose={() => setShowAddModal(false)} onSubmit={handleCreate} />
      )}
      {showRequisitionEditor && (
        <RequisitionEditor
          onClose={() => setShowRequisitionEditor(false)}
          onSuccess={() => {
            setShowRequisitionEditor(false)
            // Optionnel : Basculer sur un onglet "Réquisitions" pour voir les brouillons
          }}
        />
      )}
      {selectedMed && (
        <ProductDetailModal medication={selectedMed} onClose={() => setSelectedMed(null)} />
      )}

      {/* 5. Scanner */}
      {showScanner && (
        <div className="fixed inset-0 z-[100] bg-slate-900/90 flex flex-col items-center justify-center p-4">
          <div id="reader" className="w-full max-w-sm bg-white rounded-xl overflow-hidden"></div>
          <button
            onClick={() => setShowScanner(false)}
            className="mt-8 px-8 py-3 bg-white text-slate-900 font-bold rounded-xl"
          >
            Fermer
          </button>
        </div>
      )}
    </div>
  )
}

export default Inventory
