import { HashRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from './store/store'
import { UserRole } from '@shared/types'
import { logoutUser } from './store/slice/authSlice'

// Layouts & Guards
import ProtectedRoute from './ProtectedRoute'
import Layout from '@renderer/layouts/Layout'

// Pages
import Login from '../components/Login'
import Dashboard from '../components/Dashboard'
import Inventory from '../components/Inventory'
import POS from '@renderer/components/POS'
import CustomerManagement from '@renderer/components/CustomerManagement'
import BillingManagement from '@renderer/components/BillingManagement'
import AuditTrail from '@renderer/components/AuditTrail'
import Reporting from '@renderer/components/Reporting'
import CashJournal from '@renderer/components/CashJournal'
import EditProfile from '@renderer/components/EditProfile'

// --- COMPOSANT WRAPPER (LE PONT) ---
// Ce composant sert à injecter les données Redux dans le Layout
// et à dire au Layout d'afficher la route active via <Outlet />
const MainLayout = () => {
  // 1. Récupération des données depuis Redux
  // (Adapte selon ton authSlice, pour l'instant je mets des valeurs par défaut si tu n'as pas fini le slice)

  const dispatch = useDispatch<AppDispatch>()
  const { user } = useSelector((state: RootState) => state.auth)

  // Si jamais l'utilisateur est null (bug rare car ProtectedRoute protège), on fallback sur un rôle safe
  const userRole = user?.role || UserRole.ADMIN

  const handleLogout = async () => {
    // 2. On déclenche la vraie déconnexion (IPC + Redux)
    await dispatch(logoutUser())
    // La redirection vers /login sera gérée automatiquement par ProtectedRoute
    // car isAuthenticated passera à false.
  }

  return (
    <Layout userRole={userRole} onLogout={handleLogout}>
      {/* C'est ICI que React Router va injecter Dashboard, POS, etc. */}
      <Outlet />
    </Layout>
  )
}

export const AppRouter = () => {
  return (
    <HashRouter>
      <Routes>
        {/* 1. Route Publique (Login) */}
        {/* Note: Idéalement, Login doit rediriger vers /dashboard si déjà connecté */}
        <Route path="/login" element={<Login />} />

        {/* 2. Routes Protégées (Toute l'app) */}
        <Route element={<ProtectedRoute />}>
          {/* On utilise notre Wrapper qui contient le Layout */}
          <Route element={<MainLayout />}>
            {/* Redirection par défaut */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* Modules accessibles aux Admins/SuperAdmins (géré par le Layout) */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/pos" element={<POS />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/customers" element={<CustomerManagement />} />
            <Route path="/billing" element={<BillingManagement />} />
            <Route path="/reporting" element={<Reporting />} />
            <Route path="/cash-journal" element={<CashJournal />} />
            <Route path="/editprofile" element={<EditProfile />} />

            {/* Route restreinte spécifiquement (SuperAdmin uniquement) */}
            {/* On imbrique une nouvelle protection pour cette route */}
            <Route element={<ProtectedRoute allowedRoles={[UserRole.SUPERADMIN]} />}>
              <Route path="/audit" element={<AuditTrail />} />
            </Route>
          </Route>
        </Route>

        {/* 3. Fallback (404) */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  )
}
