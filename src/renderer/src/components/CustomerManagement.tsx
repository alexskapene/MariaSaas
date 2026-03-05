import React, { useState, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@renderer/app/store/store'
import { fetchClients, removeClient } from '@renderer/app/store/slice/clientSlice'
import { fetchSuppliers, removeSupplier } from '@renderer/app/store/slice/inventorySlice'
import { ClientTable } from './ClientTable'
import { SupplierTable } from './SupplierTable'
import { AddClientModal } from './AddClientModal'
import { AddSupplierModal } from './AddSupplierModal'
import { UserRole, ClientDTO, SupplierDTO } from '@shared/types'

// Sous-composant StatCard
const StatCard: React.FC<{
  title: string
  value: string | number
  subtext?: string
  colorClass: string
  iconPath: string
}> = ({ title, value, subtext, colorClass, iconPath }) => (
  <div
    className={`${colorClass} p-8 rounded-[2.5rem] shadow-xl text-white relative overflow-hidden group transition-all duration-300 hover:scale-[1.02]`}
  >
    <p className="text-[10px] font-black uppercase tracking-widest opacity-80 relative z-10">
      {title}
    </p>
    <h3 className="text-4xl font-black mt-2 tracking-tighter relative z-10">{value}</h3>
    {subtext && <p className="text-[10px] font-bold mt-2 opacity-60 relative z-10">{subtext}</p>}
    <div className="absolute -bottom-6 -right-6 text-white/10 rotate-12 group-hover:rotate-0 transition-transform duration-700">
      <svg width="120" height="120" fill="currentColor" viewBox="0 0 24 24">
        <path d={iconPath} />
      </svg>
    </div>
    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
  </div>
)

const CustomerManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()

  const { list: clients, isLoading: loadingClients } = useSelector(
    (state: RootState) => state.clients
  )
  const { suppliers, isLoading: loadingSuppliers } = useSelector(
    (state: RootState) => state.inventory
  )
  const { user } = useSelector((state: RootState) => state.auth)

  const [activeTab, setActiveTab] = useState<'clients' | 'suppliers'>('clients')
  const [searchTerm, setSearchTerm] = useState('')

  // États pour les modales
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<ClientDTO | null>(null)
  const [editingSupplier, setEditingSupplier] = useState<SupplierDTO | null>(null)

  const isAdmin = user?.role === UserRole.SUPERADMIN || user?.role === UserRole.ADMIN
  const isLoading = activeTab === 'clients' ? loadingClients : loadingSuppliers

  // Chargement initial
  useEffect(() => {
    dispatch(fetchClients(''))
    dispatch(fetchSuppliers())
  }, [dispatch])

  // --- Gestionnaire de clic optimisé ---
  const handleTabChange = (tab: 'clients' | 'suppliers') => {
    setActiveTab(tab)
    setSearchTerm('')
  }

  // --- ACTIONS CRUD ---

  const handleEditClient = (client: ClientDTO) => {
    setEditingClient(client)
    setIsAddModalOpen(true)
  }

  const handleDeleteClient = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce client ? Cette action est irréversible.')) {
      await dispatch(removeClient(id))
    }
  }

  const handleEditSupplier = (supplier: SupplierDTO) => {
    setEditingSupplier(supplier)
    setIsAddModalOpen(true)
  }

  const handleDeleteSupplier = async (id: string) => {
    if (
      confirm(
        "Supprimer ce fournisseur ?\nAttention : Impossible s'il a un historique de commandes."
      )
    ) {
      const result = await dispatch(removeSupplier(id))
      if (removeSupplier.rejected.match(result)) {
        alert('Erreur : ' + result.payload)
      }
    }
  }

  const handleCloseModal = () => {
    setIsAddModalOpen(false)
    setEditingClient(null)
    setEditingSupplier(null)
  }

  // --- FILTRAGE TYPÉ ---

  const filteredClients = useMemo(() => {
    const term = searchTerm.toLowerCase()
    return clients.filter(
      (c) =>
        c.name.toLowerCase().includes(term) ||
        c.phone?.includes(term) ||
        c.code.toLowerCase().includes(term)
    )
  }, [clients, searchTerm])

  const filteredSuppliers = useMemo(() => {
    const term = searchTerm.toLowerCase()
    return suppliers.filter(
      (s) => s.name.toLowerCase().includes(term) || s.contact?.toLowerCase().includes(term)
    )
  }, [suppliers, searchTerm])

  // Stats Calculation
  const stats = useMemo(() => {
    if (activeTab === 'clients') {
      const totalCredit = clients.reduce((acc, c) => acc + c.currentCredit, 0)
      return [
        {
          title: 'Total clients',
          value: clients.length,
          subtext: 'Base de données active',
          icon: 'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z',
          color: 'bg-emerald-600 shadow-emerald-600/20'
        },
        {
          title: 'Encours Crédit',
          value: `${totalCredit.toLocaleString()} FC`,
          subtext: 'Créances globales',
          icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05 1.18 1.91 2.53 1.91 1.29 0 2.13-.77 2.13-2.11 0-2.85-6.65-2.61-6.65-7.03 0-1.7 1.36-3.11 3.29-3.41V2h2.67v1.91c1.81.42 2.97 1.64 3.03 3.45h-1.95c-.07-1.07-1.1-1.76-2.51-1.76-1.31 0-2.02.76-2.02 1.96 0 2.65 6.67 2.56 6.67 7.09 0 1.83-1.46 3.17-3.22 3.44z',
          color: 'bg-emerald-800 shadow-emerald-800/20'
        },
        {
          title: 'Taux Fidélité',
          value: '12%',
          subtext: 'clients réguliers',
          icon: 'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z',
          color: 'bg-slate-800 shadow-slate-800/20'
        }
      ]
    } else {
      return [
        {
          title: 'Total Fournisseurs',
          value: suppliers.length,
          subtext: 'Partenaires référencés',
          icon: 'M4 19h16v-2H4v2zm16-4v-2H4v2h16zm-8-6h8V7h-8v2zm-2 2H4V7h6v4z',
          color: 'bg-sky-600 shadow-sky-600/20'
        },
        {
          title: 'Contacts Directs',
          value: suppliers.filter((s) => s.contact).length,
          subtext: 'Avec point de contact',
          icon: 'M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z',
          color: 'bg-sky-800 shadow-sky-800/20'
        },
        {
          title: 'Dernier Ajout',
          value: '24h',
          subtext: 'Mise à jour récente',
          icon: 'M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z',
          color: 'bg-slate-800 shadow-slate-800/20'
        }
      ]
    }
  }, [activeTab, clients, suppliers])

  return (
    <div className="space-y-8 pb-10">
      {/* Header & Tabs Navigation */}
      <div className="flex flex-col md:flex-row items-end justify-between gap-6 animate-in slide-in-from-top-4 duration-500">
        <div>
          <h2 className="text-4xl font-black italic text-slate-900 dark:text-white tracking-tighter uppercase leading-none">
            Annuaire Tiers
          </h2>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em] mt-3">
            CRM & SRM • Gestion des Partenaires
          </p>
        </div>

        <div className="flex bg-white dark:bg-slate-900 p-1.5 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
          <button
            onClick={() => handleTabChange('clients')}
            className={`px-8 py-3 rounded-[1.6rem] text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${activeTab === 'clients' ? 'bg-slate-900 dark:bg-emerald-600 text-white shadow-lg scale-105' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
          >
            clients
          </button>
          <button
            onClick={() => handleTabChange('suppliers')}
            className={`px-8 py-3 rounded-[1.6rem] text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${activeTab === 'suppliers' ? 'bg-slate-900 dark:bg-sky-600 text-white shadow-lg scale-105' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
          >
            Fournisseurs
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div
        key={`stats-${activeTab}`}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-bottom-2 duration-500 fade-in"
      >
        {stats.map((stat, idx) => (
          <StatCard key={idx} {...stat} colorClass={stat.color} iconPath={stat.icon} />
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
        <div className="relative w-full md:w-96 group">
          <input
            type="text"
            placeholder={`Rechercher un ${activeTab === 'clients' ? 'client' : 'fournisseur'}...`}
            className={`w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none transition-all font-bold dark:text-white focus:ring-2 ${activeTab === 'clients' ? 'focus:ring-emerald-500' : 'focus:ring-sky-500'}`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg
            className={`absolute left-4 top-4 text-slate-400 transition-colors ${activeTab === 'clients' ? 'group-focus-within:text-emerald-500' : 'group-focus-within:text-sky-500'}`}
            width="22"
            height="22"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </div>

        {isAdmin && (
          <button
            onClick={() => {
              setEditingClient(null)
              setEditingSupplier(null)
              setIsAddModalOpen(true)
            }}
            className={`w-full md:w-auto px-8 py-4 text-white font-black rounded-2xl transition-all shadow-xl flex items-center justify-center gap-3 uppercase text-xs tracking-widest hover:scale-105 active:scale-95 ${activeTab === 'clients' ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20' : 'bg-sky-600 hover:bg-sky-500 shadow-sky-600/20'}`}
          >
            <svg
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              viewBox="0 0 24 24"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            Nouveau {activeTab === 'clients' ? 'client' : 'Fournisseur'}
          </button>
        )}
      </div>

      {/* Tableaux (Rendu conditionnel SANS any) */}
      <div
        key={`table-${activeTab}`}
        className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden min-h-[400px] transition-colors animate-in fade-in duration-700"
      >
        {isLoading ? (
          <div className="p-20 text-center flex flex-col items-center justify-center gap-4">
            <div
              className={`w-10 h-10 border-4 border-slate-100 rounded-full animate-spin ${activeTab === 'clients' ? 'border-t-emerald-500' : 'border-t-sky-500'}`}
            ></div>
            <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">
              Chargement...
            </p>
          </div>
        ) : (
          <>
            {activeTab === 'clients' ? (
              <ClientTable
                clients={filteredClients}
                isAdmin={isAdmin}
                onEdit={handleEditClient}
                onDelete={handleDeleteClient}
              />
            ) : (
              <SupplierTable
                suppliers={filteredSuppliers}
                isAdmin={isAdmin}
                onEdit={handleEditSupplier}
                onDelete={handleDeleteSupplier}
              />
            )}
          </>
        )}
      </div>

      {/* Modales (Conditionnelles) */}
      {isAddModalOpen &&
        (activeTab === 'clients' ? (
          <AddClientModal onClose={handleCloseModal} initialData={editingClient} />
        ) : (
          <AddSupplierModal onClose={handleCloseModal} initialData={editingSupplier} />
        ))}
    </div>
  )
}

export default CustomerManagement
