import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Spinner from './Spinner';

interface ProtectedRouteProps {
  children: ReactNode;
  roles?: Array<'ROOT' | 'ADMIN'>;
}

export default function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const { usuario, cargando } = useAuth();

  if (cargando) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-papel">
        <div className="flex flex-col items-center gap-3 text-slate-600">
          <Spinner className="h-8 w-8 text-vinotinto-700" />
          <p className="text-sm font-medium">Validando sesión...</p>
        </div>
      </div>
    );
  }

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(usuario.rol)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
