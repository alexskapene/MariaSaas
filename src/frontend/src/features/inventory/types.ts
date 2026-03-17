// Interface UI alignée avec Prisma
export interface UILot {
    id: string;
    batchNumber: string;
    expiryDate: string;
    quantity: number;
    receivedDate: string;
}

export interface UIMedication {
    id: string;

    // Identification
    name: string;
    dci?: string; // Ajouté
    code: string;
    codeCip7?: string; // Ajouté
    codeAtc?: string; // Ajouté

    // Caractéristiques
    category: string;
    form?: string; // Ajouté
    dosage?: string; // Ajouté
    packaging?: string; // Ajouté
    description?: string;
    isPrescriptionRequired: boolean; // Ajouté

    // Stock & Prix
    currentStock: number;
    minStock: number;
    maxStock?: number; // Ajouté
    location?: string; // Ajouté

    sellPrice: number;
    buyingPrice: number;
    vatRate: number; // Ajouté

    // Relations UI
    lots: UILot[];
    qrCode?: string;
}

export const CATEGORIES = ['Tous', 'Analgésique', 'Antibiotique', 'Anti-inflammatoire', 'Supplément', 'Générique'];