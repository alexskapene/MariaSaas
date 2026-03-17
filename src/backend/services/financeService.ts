import { prisma } from '../lib/prisma';

export class FinanceService {

    // Récupérer le dernier taux connu
    async getLatestRate() {
        const lastRate = await prisma.exchangeRate.findFirst({
            orderBy: { date: 'desc' }
        });
        return lastRate?.rate || 2300; // Valeur par défaut si vide (à ajuster)
    }

    // Définir le taux du jour
    async setDailyRate(rate: number, userId: string) {
        return await prisma.exchangeRate.create({
            data: {
                rate,
                setById: userId
            }
        });
    }
}

export const financeService = new FinanceService();