import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  actualizarUsuario,
  solicitarEliminacionApi,
  ApiError,
  crearUsuario,
  listarUsuarios,
  UsuarioListado,
} from '../api/client';
import InstitutionLogos from '../components/InstitutionLogos';
import UsuarioDialogo, { FormularioUsuario } from '../components/UsuarioDialogo';
import UsuariosTabla from '../components/UsuariosTabla';
import Chip from '../components/Chip';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';
import Aviso from '../components/Aviso';

export default function UsuariosPage() {
  const { token, usuario, cerrarSesion } = useAuth();
  const navigate = useNavigate();

  const [usuarios, setUsuarios] = useState<UsuarioListado[]>([]);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [eliminando, setEliminando] = useState(false);
  const origenFoco = useRef<HTMLElement | null>(null);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editando, setEditando] = useState<UsuarioListado | null>(null);

  const cargarUsuarios = useCallback(async () => {
    if (!token) return;

    setCargando(true);
    setError('');

    try {
      setUsuarios(await listarUsuarios(token));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No fue posible cargar los usuarios.');
    } finally {
      setCargando(false);
    }
  }, [token]);

  useEffect(() => {
    void cargarUsuarios();
  }, [cargarUsuarios]);

  function abrir(item: UsuarioListado | null) {
    origenFoco.current = document.activeElement as HTMLElement | null;
    setMensaje('');
    setEditando(item);
    setError('');
    setModalAbierto(true);
  }

  // al cerrar, el foco vuelve al botón que abrió el diálogo
  function cerrarDialogo() {
    setModalAbierto(false);
    setEditando(null);
    window.setTimeout(() => origenFoco.current?.focus(), 0);
  }

  function cerrarModal() {
    if (guardando || eliminando) return;
    cerrarDialogo();
  }

  async function guardar(datos: FormularioUsuario) {
    if (!token) return;

    setError('');
    setMensaje('');
    setGuardando(true);

    const nombre = datos.nombre.trim();
    const email = datos.email.trim().toLowerCase();

    try {
      if (editando) {
        await actualizarUsuario(token, editando.id, {
          nombre,
          rol: datos.rol,
          ...(email ? { email } : {}),
          ...(datos.password ? { password: datos.password } : {}),
        });
        setMensaje('Usuario actualizado correctamente.');
      } else {
        await crearUsuario(token, { cedula: datos.cedula, nombre, email, rol: datos.rol });
        setMensaje('Usuario creado. Se envió una invitación a su correo para definir la contraseña.');
      }

      cerrarDialogo();
      await cargarUsuarios();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No fue posible guardar el usuario.');
    } finally {
      setGuardando(false);
    }
  }

  async function cambiarEstado(item: UsuarioListado) {
    if (!token) return;

    setError('');
    setMensaje('');

    try {
      await actualizarUsuario(token, item.id, { activo: !item.activo });
      setMensaje(item.activo ? 'Usuario desactivado.' : 'Usuario activado.');
      await cargarUsuarios();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No fue posible cambiar el estado.');
    }
  }

  async function eliminar(item: UsuarioListado) {
    if (!token) return;
    setError('');
    setMensaje('');
    setEliminando(true);
    try {
      const { correoEnviado } = await solicitarEliminacionApi(token, item.id);
      setMensaje(
        correoEnviado
          ? 'Le enviamos un correo para confirmar la eliminación.'
          : 'No se pudo enviar el correo de confirmación. Avise a soporte técnico.',
      );
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No fue posible solicitar la eliminación.');
    } finally {
      setEliminando(false);
      cerrarDialogo();
    }
  }

  function salir() {
    cerrarSesion();
    navigate('/login', { replace: true });
  }

  return (
    <div className="min-h-screen bg-papel">
      <header className="sticky top-0 z-20 border-b border-vinotinto-100 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
          <InstitutionLogos compact />

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden text-right sm:block">
              <div className="flex items-center justify-end gap-2">
                <p className="text-sm font-semibold text-slate-800">{usuario?.nombre}</p>
                <Chip tono={usuario?.rol === 'ROOT' ? 'oscuro' : 'neutro'}>{usuario?.rol}</Chip>
              </div>
              <p className="text-xs text-slate-500">
                {usuario?.email}
                {usuario?.cedula && ` · C.I. ${usuario.cedula}`}
              </p>
            </div>
            <Link to="/" className="btn-secondary min-h-11 min-w-11 px-3 py-2 lg:min-h-0 lg:min-w-0" title="Volver al panel">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M19 12H5m0 0 6-6m-6 6 6 6"
                />
              </svg>
              <span className="hidden sm:inline">Panel</span>
            </Link>
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
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Usuarios del sistema</h1>
            <p className="mt-1 text-sm text-slate-600">
              {usuarios.length} {usuarios.length === 1 ? 'cuenta' : 'cuentas'}
            </p>
          </div>
          <button type="button" onClick={() => abrir(null)} className="btn-primary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14M5 12h14" />
            </svg>
            Nuevo usuario
          </button>
        </div>

        {error && !modalAbierto ? (
          <Aviso>{error}</Aviso>
        ) : null}

        {mensaje ? (
          <Aviso tono="ok">{mensaje}</Aviso>
        ) : null}

        <section className="card overflow-hidden">
          {cargando ? (
            <div role="status" className="flex items-center justify-center gap-3 px-6 py-12 text-sm font-medium text-slate-600">
              <Spinner className="h-5 w-5 text-vinotinto-700" />
              Cargando usuarios...
            </div>
          ) : usuarios.length === 0 ? (
            <div className="flex flex-col items-center gap-3 px-6 py-12 text-center text-sm text-slate-600">
              <p>No se pudo mostrar la lista de usuarios.</p>
              <button type="button" onClick={() => void cargarUsuarios()} className="btn-secondary">
                Reintentar
              </button>
            </div>
          ) : (
            <UsuariosTabla usuarios={usuarios} propioId={usuario?.id} onEditar={abrir} onCambiarEstado={(u) => void cambiarEstado(u)} />
          )}
        </section>
      </main>

      {modalAbierto ? (
        <UsuarioDialogo
          editando={editando}
          propioId={usuario?.id}
          guardando={guardando}
          eliminando={eliminando}
          error={error}
          onCerrar={cerrarModal}
          onGuardar={(d) => void guardar(d)}
          onEliminar={(u) => void eliminar(u)}
        />
      ) : null}
    </div>
  );
}
