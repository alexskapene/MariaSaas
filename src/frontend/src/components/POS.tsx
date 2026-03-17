import React, { useMemo } from 'react'
import { usePosLogic } from '../hooks/usePosLogic'
import { SearchBar } from './SearchBar'
import { ProductGrid } from './ProductGrid'
import { CartPanel } from './CartPanel'
import { ProductDTO } from '@shared/types'

const POS: React.FC = () => {
  const { state, actions } = usePosLogic()

  // Transformation 100% Type-Safe : on aligne le state Redux avec le format strict du DTO
  // On remplace les 'undefined' par 'null' pour le champ dosage (et autres champs optionnels potentiels)
  const safeProducts = useMemo<ProductDTO[]>(() => {
    return state.availableProducts.map(
      (p) =>
        ({
          ...p,
          dosage: p.dosage ?? null,
          dci: p.dci ?? null,
          form: p.form ?? null
        }) as ProductDTO
    )
  }, [state.availableProducts])

  return (
    <div className="flex h-[calc(100vh-140px)] gap-8 animate-in fade-in duration-500">
      {/* SECTION GAUCHE */}
      <div className="flex-1 flex flex-col gap-8 min-w-0">
        {/* Search */}
        <SearchBar value={state.searchTerm} onChange={actions.setSearchTerm} />

        {/* Catalog */}
        <ProductGrid products={safeProducts} onAdd={actions.addToCart} />
      </div>

      {/* SECTION DROITE (Fixe) */}
      <div className="flex-none h-full">
        <CartPanel
          cart={state.cart}
          subTotal={state.subTotal}
          paymentMethod={state.paymentMethod}
          isLoading={state.isLoading}
          error={state.error}
          onRemove={actions.removeFromCart}
          onUpdateQty={actions.updateQuantity}
          onSetMethod={actions.setPaymentMethod} // Le typage strict de CartPanel a été réglé à l'étape précédente
          onCheckout={actions.checkout}
        />
      </div>
    </div>
  )
}

export default POS
