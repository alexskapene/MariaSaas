import React, { useState } from 'react'
import { BillingDocument, DocumentType, CashMovementType, CashCategory } from '../types'
import { cashJournalService } from '../services/cashJournalService'

const MOCK_DOCS: BillingDocument[] = [
  {
    id: 'FAC-2024-1022',
    type: DocumentType.INVOICE,
    date: '2024-03-22',
    customerName: 'Sarah Kabeya',
    items: [
      {
        id: '1',
        name: 'Paracétamol',
        code: 'P001',
        category: 'Analgésique',
        dosage: '500mg',
        price: 1500,
        quantity: 2,
        buyingPrice: 1000,
        threshold: 10,
        lots: [],
        selectedLotId: 'L1',
        selectedLotBatch: 'L2401',
        selectedLotExpiry: '2025-12-01'
      },
      {
        id: '4',
        name: 'Vitamine C',
        code: 'V004',
        category: 'Supplément',
        dosage: '1000mg',
        price: 5000,
        quantity: 1,
        buyingPrice: 3500,
        threshold: 20,
        lots: [],
        selectedLotId: 'L4',
        selectedLotBatch: 'L2404',
        selectedLotExpiry: '2026-01-10'
      }
    ],
    subtotal: 8000,
    discountAmount: 0,
    total: 8000,
    status: 'PAID',
    paymentMethod: 'CASH'
  },
  {
    id: 'FAC-2024-1023',
    type: DocumentType.INVOICE,
    date: '2024-03-22',
    customerName: 'Comptoir',
    items: [],
    subtotal: 4500,
    discountAmount: 0,
    total: 4500,
    status: 'CANCELLED'
  },
  {
    id: 'FAC-2024-1024',
    type: DocumentType.INVOICE,
    date: '2024-03-23',
    customerName: 'Michel Mwamba',
    items: [],
    subtotal: 85000,
    discountAmount: 0,
    total: 85000,
    status: 'PENDING',
    paymentMethod: 'CREDIT'
  }
]

const BillingManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'journal' | 'credits'>('journal')
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PAID' | 'PENDING' | 'CANCELLED'>('ALL')
  const [showAddMovement, setShowAddMovement] = useState(false)
  const [selectedDocForPrint, setSelectedDocForPrint] = useState<BillingDocument | null>(null)

  const [newMovement, setNewMovement] = useState({
    type: CashMovementType.OUT,
    category: CashCategory.OTHER,
    amount: 0,
    description: ''
  })

  const movements = cashJournalService.getMovements()
  const totals = cashJournalService.getTotals()

  const filteredDocs = MOCK_DOCS.filter((doc) => {
    const statusMatch = statusFilter === 'ALL' || doc.status === statusFilter
    if (activeTab === 'credits') return statusMatch && doc.type === DocumentType.PROFORMA
    return statusMatch
  })

  const handleAddMovement = (e: React.FormEvent) => {
    e.preventDefault()
    cashJournalService.addMovement({
      ...newMovement,
      performedBy: 'JD (Admin)'
    })
    setShowAddMovement(false)
    setNewMovement({
      type: CashMovementType.OUT,
      category: CashCategory.OTHER,
      amount: 0,
      description: ''
    })
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row gap-6 justify-between items-end no-print">
        <div>
          <h2 className="text-4xl font-black italic text-slate-900 dark:text-white tracking-tighter uppercase leading-none">
            Gestion Financière
          </h2>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em] mt-3">
            Ledger MariaSaas • Flux de Trésorerie GxP
          </p>
        </div>

        <div className="flex bg-white dark:bg-slate-900 p-1.5 rounded-[1.8rem] border border-slate-200 dark:border-slate-800 shadow-sm shadow-slate-200/50 transition-colors">
          <button
            onClick={() => setActiveTab('journal')}
            className={`px-8 py-3 rounded-[1.4rem] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'journal' ? 'bg-slate-900 dark:bg-sky-600 text-white shadow-xl' : 'text-slate-400'}`}
          >
            Journal
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`px-8 py-3 rounded-[1.4rem] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'all' ? 'bg-slate-900 dark:bg-sky-600 text-white shadow-xl' : 'text-slate-400'}`}
          >
            Factures
          </button>
          <button
            onClick={() => setActiveTab('credits')}
            className={`px-8 py-3 rounded-[1.4rem] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'credits' ? 'bg-slate-900 dark:bg-sky-600 text-white shadow-xl' : 'text-slate-400'}`}
          >
            Avoirs
          </button>
        </div>
      </div>

      {activeTab === 'journal' && (
        <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-500 no-print">
          {/* Totals Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-emerald-600 p-10 rounded-[2.5rem] shadow-2xl shadow-emerald-500/20 relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
              <p className="text-[10px] font-black text-emerald-100 uppercase tracking-widest relative z-10">
                Recettes Totales
              </p>
              <h3 className="text-4xl font-black mt-2 tracking-tighter text-white relative z-10">
                {totals.in.toLocaleString()} FC
              </h3>
              <p className="text-[9px] font-black text-emerald-200 mt-4 uppercase opacity-60">
                Collectées en 24h
              </p>
            </div>
            <div className="bg-red-600 p-10 rounded-[2.5rem] shadow-2xl shadow-red-500/20 relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
              <p className="text-[10px] font-black text-red-100 uppercase tracking-widest relative z-10">
                Dépenses Sortantes
              </p>
              <h3 className="text-4xl font-black mt-2 tracking-tighter text-white relative z-10">
                {totals.out.toLocaleString()} FC
              </h3>
              <p className="text-[9px] font-black text-red-200 mt-4 uppercase opacity-60">
                Auditées GxP
              </p>
            </div>
            <div className="bg-slate-900 dark:bg-slate-800 p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden group border border-slate-800 dark:border-slate-700">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <svg width="100" height="100" fill="white" viewBox="0 0 24 24">
                  <path d="M12 1v22m5-18H9.5a4.5 4.5 0 1 0 0 9h5a4.5 4.5 0 1 1 0 9H6" />
                </svg>
              </div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest relative z-10">
                Solde Réel Caisse
              </p>
              <h3 className="text-4xl font-black mt-2 tracking-tighter text-sky-400 relative z-10">
                {totals.balance.toLocaleString()} FC
              </h3>
              <p className="text-[9px] font-black text-slate-400 mt-4 uppercase relative z-10 tracking-widest">
                Liquidité Immédiate
              </p>
            </div>
          </div>

          {/* Actions & Journal Table */}
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center px-4">
              <h3 className="text-xl font-black italic uppercase text-slate-900 dark:text-white tracking-tighter">
                Flux de Trésorerie
              </h3>
              <button
                onClick={() => setShowAddMovement(true)}
                className="px-8 py-4 bg-slate-900 dark:bg-sky-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-sky-600/20 active:scale-95 transition-all"
              >
                Nouvelle Opération
              </button>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
              <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                  <tr>
                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Date / Trace ID
                    </th>
                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Catégorie
                    </th>
                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Description
                    </th>
                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                      Montant
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {movements.map((m) => (
                    <tr
                      key={m.id}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-800 transition-colors group"
                    >
                      <td className="px-10 py-6">
                        <div className="flex flex-col">
                          <span className="text-xs font-black text-slate-800 dark:text-white uppercase">
                            {m.id}
                          </span>
                          <span className="text-[10px] text-slate-400 font-bold">
                            {new Date(m.timestamp).toLocaleDateString()} •{' '}
                            {new Date(m.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      </td>
                      <td className="px-10 py-6">
                        <span
                          className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                            m.type === CashMovementType.IN
                              ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 border-emerald-100 dark:border-emerald-900/50'
                              : 'bg-red-50 dark:bg-red-900/20 text-red-600 border-red-100 dark:border-red-900/50'
                          }`}
                        >
                          {m.category.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-10 py-6">
                        <p className="text-sm font-black text-slate-600 dark:text-slate-400 italic">
                          &quot;{m.description}&quot;
                        </p>
                      </td>
                      <td
                        className={`px-10 py-6 text-right font-black text-xl tracking-tighter ${m.type === CashMovementType.IN ? 'text-emerald-500' : 'text-red-500'}`}
                      >
                        {m.type === CashMovementType.IN ? '+' : '-'}
                        {m.amount.toLocaleString()} FC
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {(activeTab === 'all' || activeTab === 'credits') && (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 no-print">
          <div className="flex items-center gap-3 overflow-x-auto pb-4">
            <span className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest mr-4">
              Filtre Statut :
            </span>
            {(['ALL', 'PAID', 'PENDING', 'CANCELLED'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${
                  statusFilter === s
                    ? 'bg-sky-600 text-white border-sky-600 shadow-xl shadow-sky-600/20'
                    : 'bg-white dark:bg-slate-900 text-slate-500 border-slate-200 dark:border-slate-800'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Référence
                  </th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    client
                  </th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                    Statut
                  </th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredDocs.map((doc) => (
                  <tr
                    key={doc.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
                  >
                    <td className="px-10 py-7 font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">
                      {doc.id}
                    </td>
                    <td className="px-10 py-7">
                      <div className="flex flex-col">
                        <span className="font-black text-slate-800 dark:text-slate-200 text-sm">
                          {doc.customerName}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold">{doc.date}</span>
                      </div>
                    </td>
                    <td className="px-10 py-7 text-center">
                      <span
                        className={`px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest ${
                          doc.status === 'PAID'
                            ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600'
                            : doc.status === 'CANCELLED'
                              ? 'bg-red-50 dark:bg-red-900/20 text-red-600'
                              : 'bg-amber-50 dark:bg-amber-900/20 text-amber-600'
                        }`}
                      >
                        {doc.status}
                      </span>
                    </td>
                    <td className="px-10 py-7 font-black text-slate-900 dark:text-sky-400 text-right">
                      <div className="flex items-center justify-end gap-6">
                        <span className="text-xl tracking-tighter">
                          {doc.total.toLocaleString()} FC
                        </span>
                        {doc.type === DocumentType.INVOICE && (
                          <button
                            onClick={() => setSelectedDocForPrint(doc)}
                            className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-500 hover:text-sky-600 dark:hover:text-sky-400 transition-all active:scale-90"
                            title="Imprimer la facture"
                          >
                            <svg
                              width="18"
                              height="18"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              viewBox="0 0 24 24"
                            >
                              <path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2m-2 4H8v-6h8v6z" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Invoice Print Preview Modal */}
      {selectedDocForPrint && (
        <div className="fixed inset-0 z-[150] bg-slate-900/90 backdrop-blur-xl flex items-center justify-center p-4 md:p-8 overflow-auto">
          <div className="bg-white text-slate-900 w-full max-w-3xl rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col min-h-[80vh]">
            {/* Header No-Print */}
            <div className="p-8 border-b border-slate-100 flex justify-between items-center no-print bg-slate-50 rounded-t-[2.5rem]">
              <h3 className="text-xl font-black italic uppercase tracking-tighter text-slate-800">
                Prévisualisation Facture
              </h3>
              <div className="flex gap-4">
                <button
                  onClick={handlePrint}
                  className="px-8 py-3 bg-sky-600 text-white rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-sky-600/20 hover:bg-sky-500 active:scale-95 transition-all flex items-center gap-2"
                >
                  <svg
                    width="16"
                    height="16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                  >
                    <path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2m-2 4H8v-6h8v6z" />
                  </svg>
                  Imprimer
                </button>
                <button
                  onClick={() => setSelectedDocForPrint(null)}
                  className="p-3 bg-slate-200 rounded-xl text-slate-500 hover:text-slate-900 transition-all active:scale-90"
                >
                  <svg
                    width="20"
                    height="20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Printable Content */}
            <div className="p-12 print:p-0 flex-1 flex flex-col bg-white" id="invoice-printable">
              <div className="flex justify-between items-start mb-16">
                <div className="flex flex-col gap-1">
                  <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black text-xl mb-4">
                    M
                  </div>
                  <h2 className="text-3xl font-black italic uppercase tracking-tighter">
                    MariaSaas
                  </h2>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Pharmacie Maria • GxP Certified
                  </p>
                  <p className="text-[9px] font-medium text-slate-500 mt-2">
                    123 Boulevard de la Santé, Kinshasa
                  </p>
                  <p className="text-[9px] font-medium text-slate-500">+243 812 345 678</p>
                </div>
                <div className="text-right">
                  <h1 className="text-5xl font-black text-slate-200 uppercase tracking-tighter leading-none mb-4">
                    Facture
                  </h1>
                  <p className="text-sm font-black text-slate-900">N° {selectedDocForPrint.id}</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                    Date: {selectedDocForPrint.date}
                  </p>
                </div>
              </div>

              <div className="mb-12 grid grid-cols-2 gap-12 border-y border-slate-100 py-8">
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">
                    Facturé à :
                  </p>
                  <h4 className="text-xl font-black text-slate-900">
                    {selectedDocForPrint.customerName || 'Client de passage'}
                  </h4>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
                    Réf Client: P-9982
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">
                    Paiement :
                  </p>
                  <h4 className="text-lg font-black text-slate-900">
                    {selectedDocForPrint.paymentMethod || 'Espèces'}
                  </h4>
                  <span
                    className={`px-4 py-1 rounded-full text-[8px] font-black uppercase tracking-widest inline-block mt-2 ${selectedDocForPrint.status === 'PAID' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}
                  >
                    {selectedDocForPrint.status}
                  </span>
                </div>
              </div>

              <table className="w-full text-left mb-16">
                <thead>
                  <tr className="border-b-2 border-slate-900">
                    <th className="py-4 text-[10px] font-black uppercase tracking-widest">
                      Désignation
                    </th>
                    <th className="py-4 text-[10px] font-black uppercase tracking-widest text-center">
                      Qté
                    </th>
                    <th className="py-4 text-[10px] font-black uppercase tracking-widest text-right">
                      Prix Unit.
                    </th>
                    <th className="py-4 text-[10px] font-black uppercase tracking-widest text-right">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedDocForPrint.items.length > 0 ? (
                    selectedDocForPrint.items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="py-4 font-bold text-sm">
                          <div className="flex flex-col">
                            <span>{item.name}</span>
                            <span className="text-[8px] text-slate-400 uppercase font-black">
                              {item.dosage} • Lot: {item.selectedLotBatch}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 text-center font-bold text-sm">x{item.quantity}</td>
                        <td className="py-4 text-right font-bold text-sm">
                          {item.price.toLocaleString()} FC
                        </td>
                        <td className="py-4 text-right font-black text-sm">
                          {(item.price * item.quantity).toLocaleString()} FC
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={4}
                        className="py-12 text-center text-slate-300 font-bold uppercase text-[10px] tracking-widest italic"
                      >
                        Aucun article listé (Consultez le ledger POS)
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              <div className="mt-auto flex flex-col items-end gap-3 pt-8 border-t-4 border-slate-900">
                <div className="flex justify-between w-64 text-slate-500">
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    Sous-total
                  </span>
                  <span className="font-bold">
                    {selectedDocForPrint.subtotal.toLocaleString()} FC
                  </span>
                </div>
                <div className="flex justify-between w-64 text-slate-500">
                  <span className="text-[10px] font-black uppercase tracking-widest">Remise</span>
                  <span className="font-bold">
                    -{selectedDocForPrint.discountAmount.toLocaleString()} FC
                  </span>
                </div>
                <div className="flex justify-between w-64 text-slate-900 mt-2">
                  <span className="text-sm font-black uppercase tracking-widest">Total Net</span>
                  <span className="text-3xl font-black italic tracking-tighter">
                    {selectedDocForPrint.total.toLocaleString()} FC
                  </span>
                </div>
              </div>

              <div className="mt-20 flex justify-between items-end grayscale opacity-50">
                <div>
                  <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-2">
                    Signature & Cachet Pharmacie
                  </p>
                  <div className="w-40 h-16 border border-dashed border-slate-300 rounded-lg"></div>
                </div>
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.3em]">
                  MARIASAAS • LOGICIEL DE GESTION GxP • 2024
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CSS for print mode */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #invoice-printable, #invoice-printable * {
            visibility: visible;
          }
          #invoice-printable {
            position: fixed;
            left: 0;
            top: 0;
            width: 100%;
            padding: 40px;
            margin: 0;
            height: auto;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Modal Movement (Caisse) */}
      {showAddMovement && (
        <div className="fixed inset-0 z-[110] bg-slate-900/80 backdrop-blur-xl flex items-center justify-center p-6">
          <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-[3.5rem] p-12 shadow-2xl animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-start mb-10">
              <div>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white italic uppercase tracking-tighter leading-none">
                  Nouvelle Opération
                </h2>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">
                  Enregistrement Trésorerie GxP
                </p>
              </div>
              <button
                onClick={() => setShowAddMovement(false)}
                className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all"
              >
                <svg
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  viewBox="0 0 24 24"
                >
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleAddMovement} className="space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <button
                  type="button"
                  onClick={() => setNewMovement({ ...newMovement, type: CashMovementType.IN })}
                  className={`py-5 rounded-[1.8rem] font-black text-xs uppercase tracking-widest border-2 transition-all ${newMovement.type === CashMovementType.IN ? 'bg-emerald-600 border-emerald-600 text-white shadow-xl shadow-emerald-500/30' : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400'}`}
                >
                  Encaissement (+)
                </button>
                <button
                  type="button"
                  onClick={() => setNewMovement({ ...newMovement, type: CashMovementType.OUT })}
                  className={`py-5 rounded-[1.8rem] font-black text-xs uppercase tracking-widest border-2 transition-all ${newMovement.type === CashMovementType.OUT ? 'bg-red-600 border-red-600 text-white shadow-xl shadow-red-500/30' : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400'}`}
                >
                  Décaissement (-)
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">
                  Catégorie de Flux
                </label>
                <select
                  className="w-full px-8 py-5 bg-slate-50 dark:bg-slate-800 border-none rounded-[1.8rem] outline-none focus:ring-4 focus:ring-sky-500/10 font-bold dark:text-white appearance-none"
                  value={newMovement.category}
                  onChange={(e) =>
                    setNewMovement({ ...newMovement, category: e.target.value as CashCategory })
                  }
                >
                  {Object.values(CashCategory).map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">
                  Montant de l&apos;opération (FC)
                </label>
                <input
                  type="number"
                  required
                  className="w-full px-8 py-5 bg-slate-50 dark:bg-slate-800 border-none rounded-[1.8rem] outline-none focus:ring-4 focus:ring-sky-500/10 font-black text-slate-900 dark:text-white text-3xl tracking-tighter"
                  placeholder="0"
                  value={newMovement.amount || ''}
                  onChange={(e) =>
                    setNewMovement({ ...newMovement, amount: Number(e.target.value) })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">
                  Justification du Mouvement
                </label>
                <textarea
                  required
                  className="w-full px-8 py-5 bg-slate-50 dark:bg-slate-800 border-none rounded-[1.8rem] outline-none focus:ring-4 focus:ring-sky-500/10 font-medium dark:text-white h-32 resize-none"
                  placeholder="Ex: Facture fournisseur SNEL, Achat consommables..."
                  value={newMovement.description}
                  onChange={(e) => setNewMovement({ ...newMovement, description: e.target.value })}
                />
              </div>

              <button
                type="submit"
                className="w-full py-6 bg-slate-900 dark:bg-sky-600 text-white rounded-[1.8rem] font-black uppercase text-sm tracking-[0.3em] shadow-2xl active:scale-95 transition-all mt-4"
              >
                Enregistrer la transaction
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default BillingManagement
