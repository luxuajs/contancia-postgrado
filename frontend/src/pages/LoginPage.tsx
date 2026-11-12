import { Navigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import { useAuth } from '../context/AuthContext';
import InstitutionLogos from '../components/InstitutionLogos';
import Spinner from '../components/Spinner';

export default function LoginPage() {
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

  if (usuario) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-papel lg:grid lg:grid-cols-2">
      {/* Panel institucional (escritorio): plano, sin decoración */}
      <aside className="hidden bg-vinotinto-900 p-10 text-white lg:flex lg:flex-col lg:justify-between">
        {/* los logos están hechos para fondo claro */}
        {/* franja de borde a borde: UC a la izquierda, texto al centro, Postgrado a la derecha */}
        <div className="-mx-10 -mt-10 bg-white px-10 py-5">
          <InstitutionLogos className="w-full justify-between" />
        </div>

        <div className="max-w-md">
          <h1 className="text-4xl font-bold leading-tight">Constancias de notas de postgrado</h1>
          <p className="mt-4 text-lg leading-relaxed text-vinotinto-100">
            Sistema interno de la Facultad de Ciencias Económicas y Sociales para consultar el expediente
            académico y generar la constancia oficial.
          </p>
        </div>

        <p className="text-xs font-medium uppercase tracking-wider text-vinotinto-200">
          Uso exclusivo del personal autorizado
        </p>
      </aside>

      {/* Formulario */}
      <main className="flex min-h-screen items-center justify-center px-5 py-10 lg:min-h-0">
        <div className="w-full max-w-md animate-fade-in">
          <div className="mb-8 lg:hidden">
            <div className="flex justify-center gap-2">
              <div className="w-16 h-16 rounded-xl overflow-hidden ring-2 ring-vinotinto-200 bg-white">
                <img src="/logos/uc.png" alt="UC" className="w-full h-full object-contain" />
              </div>
              <div className="w-16 h-16 rounded-xl overflow-hidden ring-2 ring-vinotinto-200 bg-white">
                <img src="/logos/faces-postgrado.png" alt="FACES Postgrado" className="w-full h-full object-contain" />
              </div>
            </div>
          </div>

          <div className="card p-7 sm:p-9">
            <div className="mb-7">
              <h2 className="text-2xl font-bold text-slate-900">Acceso al sistema</h2>
              <p className="mt-1.5 text-sm text-slate-500">
                Ingrese con la cédula o correo institucional y su contraseña.
              </p>
            </div>

            <LoginForm />
          </div>

          <p className="mt-6 text-center text-xs text-slate-600">
            Universidad de Carabobo · Facultad de Ciencias Económicas y Sociales
          </p>
        </div>
      </main>
    </div>
  );
}
