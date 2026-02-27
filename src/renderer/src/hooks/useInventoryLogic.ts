import { useEffect, useMemo, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@renderer/app/store/store'
import { fetchProducts, clearError } from '@renderer/app/store/slice/inventorySlice'
import { UIMedication } from '../features/inventory/types'

export const useInventoryLogic = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { products, isLoading, error } = useSelector((state: RootState) => state.inventory)

  // Chargement initial
  useEffect(() => {
    // On ne charge que si on n'a pas de produits (ou on pourrait forcer un rafraîchissement)
    dispatch(fetchProducts())
  }, [dispatch])

  // Mapping optimisé avec useMemo
  // On NE génère PLUS les QR codes ici pour éviter de bloquer le thread
  const enrichedMeds: UIMedication[] = useMemo(() => {
    return products.map((p) => ({
      id: p.id,
      name: p.name,
      dci: p.dci || undefined,
      code: p.code,
      codeCip7: p.codeCip7 || undefined,
      codeAtc: p.codeAtc || undefined,
      category: p.category,
      form: p.form || undefined,
      dosage: p.dosage || '',
      packaging: p.packaging || undefined,
      description: p.description || undefined,
      isPrescriptionRequired: p.isPrescriptionRequired,
      currentStock: p.currentStock,
      minStock: p.minStock,
      maxStock: p.maxStock || undefined,
      location: p.location || undefined,
      sellPrice: p.sellPrice,
      buyingPrice: p.buyingPrice,
      vatRate: p.vatRate,
      lots: (p.lots || []).map((l) => ({
        id: l.id,
        batchNumber: l.batchNumber,
        expiryDate: l.expiryDate,
        quantity: l.quantity,
        receivedDate: l.receivedDate
      })),
      qrCode: undefined // Défini par défaut pour UIMedication
    }))
  }, [products])

  const refresh = useCallback(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  const dismissError = useCallback(() => {
    dispatch(clearError())
  }, [dispatch])

  return { enrichedMeds, isLoading, error, refresh, dismissError, dispatch }
}
