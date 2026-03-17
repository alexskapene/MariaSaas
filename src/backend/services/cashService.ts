import { prisma } from '../lib/prisma';
import { CashMovementType, CashCategory, CreateMovementInput, CashJournalEntry } from '@shared/types';

export class CashService {

    async createMovement(data: CreateMovementInput) {
        return await prisma.cashMovement.create({
            data: {
                type: data.type,
                category: data.category,
                amount: data.amount,
                description: data.description,
                performedById: data.performedById
            },
            include: { performedBy: true }
        });
    }

    async getCashJournal(startDate?: Date, endDate?: Date): Promise<CashJournalEntry[]> {
        // 1. Récupérer les Ventes (Entrées auto)
        const sales = await prisma.sale.findMany({
            where: {
                date: {
                    gte: startDate,
                    lte: endDate
                }
            },
            include: { seller: true, items: true },
            orderBy: { date: 'desc' }
        });

        // 2. Récupérer les mouvements manuels (Dépenses, etc.)
        const manualMovements = await prisma.cashMovement.findMany({
            where: {
                date: {
                    gte: startDate,
                    lte: endDate
                }
            },
            include: { performedBy: true },
            orderBy: { date: 'desc' }
        });

        // 3. Unification (Formatage pour le Frontend)
        const formattedSales: CashJournalEntry[] = sales.map(sale => ({
            id: sale.id,
            timestamp: sale.date,
            type: CashMovementType.IN,
            category: CashCategory.SALE,
            amount: sale.totalAmount,
            reference: sale.reference,
            description: `Vente effectuée (${sale.items.length} art.)`,
            performedBy: sale.seller.name,
            isManual: false
        }));

        const formattedManual: CashJournalEntry[] = manualMovements.map(m => ({
            id: m.id,
            timestamp: m.date,
            type: m.type as CashMovementType,
            category: m.category as CashCategory,
            amount: m.amount,
            reference: 'MANUEL',
            description: m.description || '',
            performedBy: m.performedBy.name,
            isManual: true
        }));

        return [...formattedSales, ...formattedManual].sort(
            (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
        );
    }
}

export const cashService = new CashService();