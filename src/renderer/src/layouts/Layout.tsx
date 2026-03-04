import * as React from 'react'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom' // Hooks du router
import { Icons } from '../constants'
import { UserRole } from '@shared/types'
import { selectIsDarkMode, toggleTheme } from '@renderer/app/store/slice/themeSlice'
import { RootState } from '@renderer/app/store/store'
import ProfileModal from '@renderer/components/ProfileModal'

interface LayoutProps {
  children: React.ReactNode
  userRole: UserRole
  onLogout: () => void
}

const Layout: React.FC<LayoutProps> = ({ children, userRole, onLogout }) => {
  // --- 1. HOOKS (Toujours au début du composant) ---
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()

  // Lecture du state Redux
  const isDarkMode = useSelector(selectIsDarkMode)

  // --- 2. STATE LOCAL ---
  const [isSidebarOpen, setSidebarOpen] = useState(false)
  const [isDesktopOpen, setIsDesktopOpen] = useState(true)
  const [isModelOpen, setIsModelOpen] = useState(false)

  const user = useSelector((state: RootState) => state.auth.user)

  // Calcul des initiales dynamiques
  const userInitials = React.useMemo(() => {
    if (!user || !user.name) return '??'
    const names = user.name.trim().split(' ')
    if (names.length >= 2) return `${names[0][0]}${names[1][0]}`.toUpperCase()
    return names[0].substring(0, 2).toUpperCase()
  }, [user])

  // --- 3. LOGIQUE ROUTEUR ---
  // On détermine la vue active grâce à l'URL.
  // Ex: "/dashboard" devient "dashboard". Si on est à la racine "/", on met "dashboard" par défaut.
  const currentView = location.pathname.replace('/', '') || 'dashboard'

  const handleNavClick = (route: string) => {
    navigate(`/${route}`) // C'est ici qu'on change l'URL
    setSidebarOpen(false)
  }

  // const handleClick = (): void => {
  //   navigate('/userprofil')
  // }

  // --- 4. EFFECTS ---
  // Synchronisation du Dark Mode avec le DOM
  useEffect(() => {
    const html = document.documentElement
    if (isDarkMode) {
      html.classList.add('dark')
    } else {
      html.classList.remove('dark')
    }
  }, [isDarkMode])

  // --- 5. CONFIG NAVIGATION ---
  const navItems = [
    {
      id: 'dashboard',
      label: 'Tableau Bord',
      icon: Icons.Dashboard,
      roles: [UserRole.SUPERADMIN, UserRole.ADMIN]
    },
    {
      id: 'pos',
      label: 'Ventes (POS)',
      icon: Icons.POS,
      roles: [UserRole.SUPERADMIN, UserRole.ADMIN]
    },
    {
      id: 'cash-journal',
      label: 'Journal Caisse',
      icon: (props: React.SVGProps<SVGSVGElement>) => (
        <svg
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          {...props}
        >
          <path d="M12 1v22m5-18H9.5a4.5 4.5 0 1 0 0 9h5a4.5 4.5 0 1 1 0 9H6" />
        </svg>
      ),
      roles: [UserRole.SUPERADMIN, UserRole.ADMIN]
    },
    {
      id: 'inventory',
      label: 'Stocks Pro',
      icon: Icons.Inventory,
      roles: [UserRole.SUPERADMIN, UserRole.ADMIN]
    },
    {
      id: 'billing',
      label: 'Documents',
      icon: (props: React.SVGProps<SVGSVGElement>) => (
        <svg
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          {...props}
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
      ),
      roles: [UserRole.SUPERADMIN, UserRole.ADMIN]
    },
    {
      id: 'reporting',
      label: 'Reporting',
      icon: (props: React.SVGProps<SVGSVGElement>) => (
        <svg
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          {...props}
        >
          <path d="M12 20V10M18 20V4M6 20v-4" />
        </svg>
      ),
      roles: [UserRole.SUPERADMIN, UserRole.ADMIN]
    },
    {
      id: 'customers',
      label: 'Patients',
      icon: (props: React.SVGProps<SVGSVGElement>) => (
        <svg
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          {...props}
        >
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
      roles: [UserRole.SUPERADMIN, UserRole.ADMIN]
    },
    {
      id: 'audit',
      label: 'Audit',
      icon: (props: React.SVGProps<SVGSVGElement>) => (
        <svg
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          {...props}
        >
          <path d="M12 2v20M17 5H9.5a4.5 4.5 0 1 0 0 9h5a4.5 4.5 0 1 1 0 9H6" />
        </svg>
      ),
      roles: [UserRole.SUPERADMIN]
    }
  ]

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 overflow-hidden font-sans text-slate-900 dark:text-slate-100">
      {/* Sidebar Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed inset-y-0 left-0 z-50 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 ease-in-out flex flex-col
        ${isSidebarOpen ? 'translate-x-0 w-[280px]' : '-translate-x-full w-[280px]'} 
        lg:translate-x-0 lg:relative ${isDesktopOpen ? 'lg:w-[280px]' : 'lg:w-[88px]'}
      `}
      >
        {/* LOGO */}
        <div className="p-6 md:p-8 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 flex-none h-20 md:h-24">
          <div className="flex items-center gap-4 overflow-hidden">
            <div className="w-10 h-10 bg-slate-900 dark:bg-sky-600 rounded-xl flex items-center justify-center text-white font-black text-xl flex-none shadow-lg transition-colors">
              M
            </div>
            {(isSidebarOpen || isDesktopOpen) && (
              <span className="font-black text-2xl text-slate-900 dark:text-white uppercase italic tracking-tighter truncate animate-in fade-in slide-in-from-left-2">
                MariaSaas
              </span>
            )}
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
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

        {/* NAV */}
        <nav className="flex-1 mt-6 px-4 space-y-2 overflow-y-auto no-scrollbar py-2 relative">
          {navItems
            .filter((item) => item.roles.includes(userRole))
            .map((item) => {
              const Icon = item.icon
              const isActive = currentView.includes(item.id)
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-200 group ${
                    isActive
                      ? 'bg-slate-900 dark:bg-sky-600 text-white shadow-xl shadow-sky-600/20'
                      : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-600 dark:hover:text-slate-200'
                  }`}
                >
                  <div
                    className={`flex-none transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-300 dark:text-slate-500'}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  {(isSidebarOpen || isDesktopOpen) && (
                    <span className="text-[10px] font-black uppercase tracking-widest text-left whitespace-nowrap animate-in fade-in slide-in-from-left-1">
                      {item.label}
                    </span>
                  )}
                </button>
              )
            })}
        </nav>

        {/* LOGOUT */}
        <div className="p-6 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-4 px-5 py-4 text-red-500 font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors group"
          >
            <svg
              className="w-5 h-5 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            {(isSidebarOpen || isDesktopOpen) && <span>Déconnexion</span>}
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        <header className="h-16 md:h-24 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 md:px-10 transition-colors flex-none z-30">
          {/* HEADER LEFT */}
          <div className="flex items-center gap-3 md:gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-slate-500 shadow-sm active:scale-95 transition-transform"
            >
              <svg
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                viewBox="0 0 24 24"
              >
                <path d="M3 12h18M3 6h18M3 18h18" />
              </svg>
            </button>
            <button
              onClick={() => setIsDesktopOpen(!isDesktopOpen)}
              className="hidden lg:block p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-slate-500 hover:scale-105 transition-all active:scale-95"
            >
              <svg
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                viewBox="0 0 24 24"
              >
                <path d="M3 12h18M3 6h18M3 18h18" />
              </svg>
            </button>
            <h1 className="text-xs md:text-sm font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 truncate max-w-[140px] md:max-w-none">
              {navItems.find((i) => currentView.includes(i.id))?.label || 'MariaSaaS'}
            </h1>
          </div>

          {/* HEADER RIGHT (USER PROFILE) */}
          <div className="flex items-center gap-3 md:gap-6">
            <button
              onClick={() => dispatch(toggleTheme())}
              className="w-10 h-10 md:w-12 md:h-12 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl md:rounded-2xl flex items-center justify-center text-slate-400 dark:text-sky-400 flex-none hover:scale-105 active:scale-95 transition-all shadow-sm"
            >
              {isDarkMode ? (
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="5" />
                  <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
                </svg>
              ) : (
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end">
                {/* NOM UTILISATEUR DYNAMIQUE */}
                <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase leading-none">
                  {user?.name || 'Utilisateur'}
                </p>
                {/* ROLE DYNAMIQUE */}
                <p className="text-[8px] font-bold text-sky-600 uppercase tracking-widest mt-1">
                  {user?.role || 'Guest'}
                </p>
              </div>

              {/* INITIALES DYNAMIQUES */}
              <div
                onClick={() => setIsModelOpen(!isModelOpen)}
                className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-slate-900 dark:bg-sky-600 flex items-center justify-center text-white font-black shadow-xl text-xs md:text-sm flex-none border-2 border-white/10 transition-colors cursor-pointer "
              >
                {userInitials}
              </div>

              {isModelOpen && <ProfileModal user={user} onClose={() => setIsModelOpen(false)} />}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-10 bg-slate-50 dark:bg-slate-950 transition-colors custom-scrollbar relative">
          <div className="max-w-7xl mx-auto pb-10 md:pb-0">{children}</div>
        </div>
      </main>
    </div>
  )
}

export default Layout
