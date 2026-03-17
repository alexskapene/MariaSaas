import { useState, useMemo, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '@renderer/app/store/store'
import { fetchProducts } from '@renderer/app/store/slice/inventorySlice'
import {
  addToCart,
  removeFromCart,
  updateQuantity,
  setPaymentMethod,
  processCheckout
} from '@renderer/app/store/slice/salesSlice'
import { ProductDTO } from '@shared/types'

export const usePosLogic = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { products } = useSelector((state: RootState) => state.inventory)
  const { cart, paymentMethod, isLoading, error } = useSelector((state: RootState) => state.sales)
  const [searchTerm, setSearchTerm] = useState('')

  // Initialisation
  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  // Filtrage intelligent
  const availableProducts = useMemo(() => {
    const term = searchTerm.toLowerCase().trim()
    return products
      .filter((p) => p.currentStock > 0)
      .filter(
        (p) =>
          !term ||
          p.name.toLowerCase().includes(term) ||
          (p.code && p.code.toLowerCase().includes(term))
      )
  }, [products, searchTerm])

  // Calculs financiers
  const subTotal = cart.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)

  // Actions
  const actions = {
    setSearchTerm,
    addToCart: (product: ProductDTO) =>
      dispatch(
        addToCart({
          productId: product.id,
          name: product.name,
          code: product.code,
          quantity: 1,
          unitPrice: product.sellPrice,
          maxStock: product.currentStock
        })
      ),
    removeFromCart: (id: string) => dispatch(removeFromCart(id)),
    updateQuantity: (id: string, qty: number) => dispatch(updateQuantity({ id, qty })),
    setPaymentMethod: (method: 'CASH' | 'CARD' | 'MOBILE_MONEY') =>
      dispatch(setPaymentMethod(method)),
    checkout: () => dispatch(processCheckout())
  }

  return {
    state: { searchTerm, availableProducts, cart, paymentMethod, isLoading, error, subTotal },
    actions
  }
}
