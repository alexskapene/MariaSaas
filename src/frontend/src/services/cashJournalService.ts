import { CashMovement, CashMovementType, CashCategory } from '../types';

class CashJournalService {
    private static instance: CashJournalService;
    private movements: CashMovement[] = [
        {
            id: 'CSH-001',
            timestamp: new Date().toISOString(),
            type: CashMovementType.IN,
            category: CashCategory.REINVESTMENT,
            amount: 5000000,
            description: 'Capital initial MariaSaas',
            performedBy: 'Admin'
        },
        {
            id: 'CSH-002',
            timestamp: new Date().toISOString(),
            type: CashMovementType.OUT,
            category: CashCategory.RENT,
            amount: 1200000,
            description: 'Loyer local Mars 2024',
            performedBy: 'Admin'
        }
    ];

    private constructor() { }

    public static getInstance(): CashJournalService {
        if (!CashJournalService.instance) {
            CashJournalService.instance = new CashJournalService();
        }
        return CashJournalService.instance;
    }

    public addMovement(movement: Omit<CashMovement, 'id' | 'timestamp'>) {
        const newMovement: CashMovement = {
            ...movement,
            id: `CSH-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
            timestamp: new Date().toISOString(),
        };
        this.movements.unshift(newMovement);
        return newMovement;
    }

    public getMovements() {
        return this.movements;
    }

    public getTotals() {
        return this.movements.reduce(
            (acc, m) => {
                if (m.type === CashMovementType.IN) acc.in += m.amount;
                else acc.out += m.amount;
                acc.balance = acc.in - acc.out;
                return acc;
            },
            { in: 0, out: 0, balance: 0 }
        );
    }
}

export const cashJournalService = CashJournalService.getInstance();
