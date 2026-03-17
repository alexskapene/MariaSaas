import React from 'react';


interface Props {
    onScan: () => void;
    onNew: () => void;
    onSupply: () => void;
}

export const InventoryHeader: React.FC<Props> = ({ onScan, onNew, onSupply }) => {
    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
                <h2 className="text-3xl md:text-4xl font-black italic text-slate-900 dark:text-white tracking-tighter uppercase leading-none">Stock Professionnel</h2>
                <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em] mt-3 italic">Contrôle Inventaire • GxP Compliance</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">

                {/* SCANNER */}
                <button onClick={onScan} className="flex-1 sm:flex-none px-6 py-3.5 bg-slate-900 dark:bg-slate-800 text-white font-black rounded-2xl text-[10px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 border border-slate-700 hover:bg-slate-800 transition-all">
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M3 7V5a2 2 0 0 1 2-2h2m10 0h2a2 2 0 0 1 2 2v2m0 10v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2M7 12h10M12 7v10" /></svg>
                    Scanner
                </button>

                {/* ENTRÉE STOCK (Supply) */}
                <button onClick={onSupply} className="flex-1 sm:flex-none px-6 py-3.5 bg-emerald-600 text-white font-black rounded-2xl text-[10px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 hover:bg-emerald-500 transition-all">
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M12 4v16m-8-8h16" /></svg>
                    Entrée Stock
                </button>

                {/* NOUVEAU PRODUIT */}
                <button onClick={onNew} className="flex-1 sm:flex-none px-6 py-3.5 bg-sky-600 text-white font-black rounded-2xl text-[10px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 hover:bg-sky-500 transition-all">
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></svg>
                    Nouveau
                </button>
            </div>
        </div>
    );
};