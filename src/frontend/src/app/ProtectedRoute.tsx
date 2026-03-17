import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from './store/store';
import { UserRole } from '@shared/types';

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  // 1. Connexion réelle au State Auth
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  // 2. Vérification de l'authentification
  if (!isAuthenticated) {
    // Si pas connecté, on renvoie vers le login.
    // L'option `state: { from: location }` permettrait de rediriger l'utilisateur 
    // vers la page qu'il voulait voir après le login (UX avancée).
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Vérification du Rôle (RBAC - Role Based Access Control)
  // Si la route exige des rôles spécifiques ET que l'utilisateur n'a pas ce rôle
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // On affiche une page 403 propre au lieu d'un simple div
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700">
          <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Accès Refusé</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-6">
            Votre rôle ({user.role}) ne vous permet pas d'accéder à cette page.
          </p>
          <Navigate to="/dashboard" replace /> {/* Ou un bouton retour */}
        </div>
      </div>
    );
  }

  // 4. Si tout est bon, on laisse passer
  return <Outlet />;
};

export default ProtectedRoute;