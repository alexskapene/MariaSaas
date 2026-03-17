import { prisma } from '../lib/prisma';

export class StatsService {

    async getDashboardStats() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // 1. Chiffre d'Affaires du jour
        const salesToday = await prisma.sale.aggregate({
            where: {
                date: { gte: today },
                status: 'COMPLETED'
            },
            _sum: { totalAmount: true },
            _count: { id: true }
        });

        // 2. Alertes Stock Bas
        const lowStockCount = await prisma.product.count({
            where: {
                currentStock: { lte: 5 } // Ou utiliser le champ minStock dynamique : currentStock <= minStock (requête raw nécessaire pour ça, on simplifie ici)
            }
        });

        // 3. Valeur du Stock (Prix Achat)
        // Note: Prisma ne permet pas facilement de faire sum(currentStock * buyingPrice) directement sans raw query
        // On va faire une approximation via JS ou une RawQuery pour la performance
        const stockValue = await prisma.$queryRaw`
      SELECT SUM(currentStock * buyingPrice) as totalValue FROM Product
    `;

        // 4. Ventes des 7 derniers jours (pour le graph)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const salesHistory = await prisma.sale.findMany({
            where: { date: { gte: sevenDaysAgo } },
            select: { date: true, totalAmount: true }
        });

        return {
            revenueToday: salesToday._sum.totalAmount || 0,
            salesCount: salesToday._count.id || 0,
            lowStockCount,
            stockValue: Number(stockValue?.[0]?.totalValue) || 0,
            recentSales: salesHistory
        };
    }
}

export const statsService = new StatsService();