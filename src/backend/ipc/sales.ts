import { ipcMain } from 'electron';
import { procedure } from '../lib/procedure';
import { salesService } from '../services/salesService';
import { createSaleSchema } from '../../shared/schemas/salesSchema';

export function setupSalesHandlers() {
    ipcMain.removeHandler('sales:create');

    ipcMain.handle(
        'sales:create',
        procedure.input(createSaleSchema).mutation(async (input) => {
            return await salesService.processSale(input);
        })
    );

    ipcMain.handle('sales:history', async (_event, filter?: { from: Date | string, to: Date | string }) => {
        const startDate = filter?.from ? new Date(filter.from) : undefined;
        const endDate = filter?.to ? new Date(filter.to) : undefined;

        const data = await salesService.getSalesHistory(startDate, endDate);
        return { success: true, data };
    });
}