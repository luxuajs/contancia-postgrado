import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ApiError,
  ConstanciaData,
  descargarConstancia,
  obtenerConstancia,
} from '../api/client';
import InstitutionLogos from '../components/InstitutionLogos';
import NotesTable from '../components/NotesTable';
import SearchBar from '../components/SearchBar';
import StudentSummary from '../components/StudentSummary';
import { useAuth } from '../context/AuthContext';
import { guardarArchivo } from '../utils/download';
import Spinner from '../components/Spinner';
import Aviso from '../components/Aviso';
import Chip from '../components/Chip';

type FormatoDescarga = 'docx' | 'pdf';

export default function DashboardPage() {
  const { usuario, token, cerrarSesion } = useAuth();
  const navigate = useNavigate();

  const [cedula, setCedula] = useState('');
  const [constancia, setConstancia] = useState<ConstanciaData | null>(null);
  const [buscando, setBuscando] = useState(false);
  const [formatoActivo, setFormatoActivo] = useState<FormatoDescarga | null>(null);
  const [error, setError] = useState('');
  const [generada, setGenerada] = useState<{ formato: string; archivo: string } | null>(null);

  async function buscar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setError('');
    setGenerada(null);

    const digitos = cedula.replace(/\D/g, '');

    if (!/^\d{5,9}$/.test(digitos)) {
      setError('Ingrese una cédula válida (entre 5 y 9 dígitos).');
      return;
    }

    if (!token) return;

    setBuscando(true);
    setConstancia(null);

    try {
      const datos = await obtenerConstancia(digitos, token);
      setConstancia(datos);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.status === 404
            ? `${err.message}. Verifique el número e intente de nuevo.`
            : err.message
          : 'No fue posible consultar el estudiante. Intente nuevamente.',
      );
    } finally {
      setBuscando(false);
    }
  }

  // al cambiar la cédula, el resultado anterior deja de ser válido: no se puede generar para otro estudiante
  function cambiarCedula(valor: string) {
    setCedula(valor);
    setConstancia(null);
    setGenerada(null);
  }

  async function descargar(formato: FormatoDescarga) {
    if (!constancia || !token) return;

    setError('');
    setGenerada(null);
    setFormatoActivo(formato);

    try {
      const { blob, filename } = await descargarConstancia(constancia.cedula, token, formato);
      const guardado = await guardarArchivo(blob, filename, formato);

      if (guardado) {
        setGenerada({ formato: formato === 'pdf' ? 'PDF' : 'Word', archivo: filename });
      }
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'No fue posible generar la constancia. Intente nuevamente.',
      );
    } finally {
      setFormatoActivo(null);
    }
  }

  function imprimir() {
    if (!constancia) return;

    navigate(`/imprimir/${constancia.cedula}`);
  }

  function salir() {
    cerrarSesion();
    navigate('/login', { replace: true });
  }

  const esRoot = usuario?.rol === 'ROOT';

  return (
    <div className="min-h-screen bg-papel">
      <header className="sticky top-0 z-20 border-b border-vinotinto-100 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
          <InstitutionLogos compact />

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden text-right sm:block">
              <div className="flex items-center justify-end gap-2">
                <p className="text-sm font-semibold text-slate-800">{usuario?.nombre}</p>
                <Chip tono={esRoot ? 'oscuro' : 'neutro'}>{usuario?.rol}</Chip>
              </div>
              <p className="text-xs text-slate-500">
                {usuario?.email}
                {usuario?.cedula && ` · C.I. ${usuario.cedula}`}
              </p>
            </div>

            {esRoot ? (
              <Link to="/usuarios" className="btn-secondary min-h-11 min-w-11 px-3 py-2 lg:min-h-0 lg:min-w-0" title="Gestionar usuarios">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm13 10v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
                  />
                </svg>
                <span className="hidden sm:inline">Usuarios</span>
              </Link>
            ) : null}

            <button type="button" onClick={salir} className="btn-secondary min-h-11 min-w-11 px-3 py-2 lg:min-h-0 lg:min-w-0" title="Cerrar sesión">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 17l5-5-5-5M15 12H3"
                />
              </svg>
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Consulta de constancias</h1>
          <p className="mt-1 text-sm text-slate-600">
            Busque por cédula para revisar el expediente y generar la constancia.
          </p>
        </div>

        <SearchBar
          cedula={cedula}
          onChange={cambiarCedula}
          onSubmit={buscar}
          buscando={buscando}
          invalido={Boolean(error) && !constancia}
        />

        {error ? (
          <Aviso id="error-busqueda" className="animate-fade-up">
            {error}
          </Aviso>
        ) : null}

        {buscando ? (
          <div className="card flex flex-col items-center justify-center gap-3 px-6 py-12 text-center">
            <Spinner className="h-8 w-8 text-vinotinto-700" />
            <p className="text-sm font-medium text-slate-600">Consultando expediente académico...</p>
          </div>
        ) : null}

        {constancia ? (
          <>
            <StudentSummary
              data={constancia}
              confirmacion={
                generada ? (
                  <div
                    role="status"
                    className="flex items-start gap-3 border-t border-emerald-200 bg-emerald-50 px-5 py-3 text-sm text-emerald-800 sm:px-6"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true">
                      <path
                        pathLength={1}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.2}
                        d="m5 13 4 4L19 7"
                        className="animate-draw [stroke-dasharray:1]"
                      />
                    </svg>
                    <p>
                      <span className="font-semibold">Constancia generada en {generada.formato}.</span>{' '}
                      <span className="break-all font-mono text-xs">{generada.archivo}</span>
                    </p>
                  </div>
                ) : null
              }
            >
              <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                <button type="button" onClick={imprimir} className="btn-primary whitespace-nowrap">
                  Imprimir
                </button>

                {(['pdf', 'docx'] as const).map((formato) => (
                  <button
                    key={formato}
                    type="button"
                    onClick={() => descargar(formato)}
                    disabled={formatoActivo !== null}
                    className="btn-secondary whitespace-nowrap"
                  >
                    {formatoActivo === formato ? (
                      <Spinner className="h-4 w-4" />
                    ) : null}
                    {formato === 'pdf' ? 'PDF' : 'Word'}
                  </button>
                ))}
              </div>
            </StudentSummary>

            <NotesTable materias={constancia.materias} />
          </>
        ) : null}

        <footer className="pt-4 text-center text-xs text-slate-600">
          Facultad de Ciencias Económicas y Sociales · Universidad de Carabobo · Sistema interno
        </footer>
      </main>
    </div>
  );
}
