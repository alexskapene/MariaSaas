import { cashJournalService } from './cashJournalService'
import { CashCategory } from '../types'
import { ProductDTO, ProductLotDTO } from '@shared/types'

export const reportingService = {
  generateSalesReport: (startDate: string, endDate: string) => {
    const movements = cashJournalService.getMovements()
    const start = new Date(startDate)
    const end = new Date(endDate)

    const sales = movements.filter((m) => {
      const d = new Date(m.timestamp)
      return m.category === CashCategory.SALE && d >= start && d <= end
    })

    const totalRevenue = sales.reduce((acc, s) => acc + s.amount, 0)
    // Simulation: marge moyenne de 30% pour le rapport
    const estimatedCost = totalRevenue * 0.7
    const profit = totalRevenue - estimatedCost

    return {
      totalRevenue,
      estimatedCost,
      profit,
      transactionCount: sales.length,
      data: sales
    }
  },

  generateCreditsReport: (startDate: string, endDate: string) => {
    const movements = cashJournalService.getMovements()
    const start = new Date(startDate)
    const end = new Date(endDate)

    // On simule les créances en filtrant les paiements de dettes
    const debtMovements = movements.filter((m) => {
      const d = new Date(m.timestamp)
      return m.category === CashCategory.DEBT_PAYMENT && d >= start && d <= end
    })

    const recovered = debtMovements.reduce((acc, m) => acc + m.amount, 0)
    // Simulation de créances totales vs récupérées
    const totalOutstanding = 1250000 // Mock global

    return {
      recovered,
      outstanding: totalOutstanding - recovered,
      total: totalOutstanding,
      count: debtMovements.length,
      data: debtMovements
    }
  },

  getInventoryValuation: (medications: ProductDTO[]) => {
    if (!medications || medications.length === 0) {
      return { totalBuyingValue: 0, totalSellingValue: 0, potentialProfit: 0, count: 0 }
    }
    return medications.reduce(
      (acc, med) => {
        const stock =
          med.lots?.reduce((lAcc: number, l: ProductLotDTO) => lAcc + l.quantity, 0) || 0
        acc.totalBuyingValue += stock * (med.buyingPrice || 0)
        acc.totalSellingValue += stock * (med.sellPrice || 0)
        acc.potentialProfit = acc.totalSellingValue - acc.totalBuyingValue
        acc.count += stock
        return acc
      },
      { totalBuyingValue: 0, totalSellingValue: 0, potentialProfit: 0, count: 0 }
    )
  }
}
