import { prisma } from '../lib/prisma'
import { CreateSaleInput } from '../../shared/schemas/salesSchema'
import { Prisma } from '@prisma/client'

export class SalesService {
  // Méthode utilitaire pour générer un numéro de ticket
  private generateReference() {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '')
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(4, '0')
    return `TKT-${date}-${random}`
  }

  async processSale(data: CreateSaleInput) {
    return await prisma.$transaction(async (tx) => {
      let saleSubTotal = 0
      // let saleCostTotal = 0; // Pour calcul de marge future

      // Préparation des lignes de vente finales (après découpage par lots)
      // const finalSaleItems: any[] = [];
      const finalSaleItems: Prisma.SaleItemCreateManySaleInput[] = []

      for (const item of data.items) {
        // 1. Récupérer le produit et ses lots (triés par péremption ASC)
        const product = await tx.product.findUnique({
          where: { id: item.productId },
          include: {
            lots: {
              where: { quantity: { gt: 0 } },
              orderBy: { expiryDate: 'asc' } // FEFO : First Expired First Out
            }
          }
        })

        if (!product) throw new Error(`Produit introuvable: ${item.productId}`)

        // 2. Vérifier stock global
        if (product.currentStock < item.quantity) {
          throw new Error(
            `Stock insuffisant pour ${product.name}. Demandé: ${item.quantity}, Dispo: ${product.currentStock}`
          )
        }

        let quantityToDeduct = item.quantity

        // 3. Algorithme FEFO : On vide les lots un par un
        for (const lot of product.lots) {
          if (quantityToDeduct === 0) break

          const quantityTakenFromLot = Math.min(lot.quantity, quantityToDeduct)

          // a. Mettre à jour le lot
          await tx.stockLot.update({
            where: { id: lot.id },
            data: { quantity: { decrement: quantityTakenFromLot } }
          })

          // b. Créer la ligne de vente liée à ce lot
          // Note : On utilise le prix de référence du produit pour le calcul coût (ou un prix spécifique au lot si tu gérais PAMP par lot)
          const costPrice = product.buyingPrice

          finalSaleItems.push({
            productId: product.id,
            stockLotId: lot.id, // TRAÇABILITÉ !
            quantity: quantityTakenFromLot,
            unitPrice: item.unitPrice,
            costPrice: costPrice,
            total: quantityTakenFromLot * item.unitPrice
          })

          quantityToDeduct -= quantityTakenFromLot
        }

        // 4. Mettre à jour le stock global du produit (Redondance de sécurité)
        await tx.product.update({
          where: { id: product.id },
          data: { currentStock: { decrement: item.quantity } }
        })

        // Calculs financiers globaux
        saleSubTotal += item.quantity * item.unitPrice
      }

      // 5. Créer la Vente
      const sale = await tx.sale.create({
        data: {
          reference: this.generateReference(),
          sellerId: data.sellerId,
          clientId: data.clientId,
          paymentMethod: data.paymentMethod,

          subTotal: saleSubTotal,
          discountAmount: data.discountAmount,
          taxAmount: 0, // A implémenter selon règles fiscales
          totalAmount: saleSubTotal - data.discountAmount,

          items: {
            create: finalSaleItems
          }
        },
        include: { items: true }
      })

      return sale
    })
  }

  async getSalesHistory(startDate?: Date, endDate?: Date) {
    const where: Prisma.SaleWhereInput = {}

    if (startDate && endDate) {
      where.date = {
        gte: startDate,
        lte: endDate
      }
    }

    return await prisma.sale.findMany({
      where,
      include: {
        seller: { select: { name: true } },
        items: { include: { product: { select: { name: true } } } }
      },
      orderBy: { date: 'desc' },
      take: startDate && endDate ? undefined : 100 // Pas de limite si filtre date
    })
  }
}

export const salesService = new SalesService()
