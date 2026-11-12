import { FormEvent, ReactNode, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ApiError, confirmarEliminacionApi, olvideApi, restablecerApi } from '../api/client';
import Aviso from '../components/Aviso';
import InstitutionLogos from '../components/InstitutionLogos';

function Marco({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-papel px-5 py-10">
      <div className="card w-full max-w-md space-y-5 p-7 sm:p-9">
        <InstitutionLogos compact />
        <h1 className="text-2xl font-bold text-slate-900">{titulo}</h1>
        {children}
        <Link to="/login" className="block text-center text-sm font-semibold text-vinotinto-800 hover:underline">
          Volver al inicio de sesión
        </Link>
      </div>
    </div>
  );
}

/** Ejecuta una acción de API y gestiona estado de envío/error/éxito. */
function useAccion() {
  const [error, setError] = useState('');
  const [hecho, setHecho] = useState(false);
  const [enviando, setEnviando] = useState(false);
  async function ejecutar(fn: () => Promise<unknown>) {
    setError('');
    setEnviando(true);
    try {
      await fn();
      setHecho(true);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'No fue posible completar la solicitud. Intente nuevamente.');
    } finally {
      setEnviando(false);
    }
  }
  return { error, hecho, enviando, ejecutar };
}

/** Enlace ya vencido o inválido: no tiene sentido pedir datos, hay que pedir otro. */
const enlaceVencido = (error: string) => error.includes('venció');

export function OlvidePage() {
  const [email, setEmail] = useState('');
  const { error, hecho, enviando, ejecutar } = useAccion();

  return (
    <Marco titulo="Recuperar contraseña">
      {hecho ? (
        <Aviso tono="ok">
          Si el correo está registrado, recibirá un enlace para cambiar su contraseña. Revise también la carpeta de
          correo no deseado.
        </Aviso>
      ) : (
        <form
          className="space-y-4"
          onSubmit={(e: FormEvent) => {
            e.preventDefault();
            void ejecutar(() => olvideApi(email));
          }}
        >
          <div>
            <label htmlFor="email" className="label">
              Correo electrónico registrado
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={enviando}
              autoFocus
            />
          </div>
          {error ? <Aviso>{error}</Aviso> : null}
          <button type="submit" className="btn-primary w-full" disabled={enviando}>
            {enviando ? 'Enviando...' : 'Enviar enlace'}
          </button>
        </form>
      )}
    </Marco>
  );
}

export function RestablecerPage() {
  const token = useSearchParams()[0].get('token') ?? '';
  const [password, setPassword] = useState('');
  const [repetir, setRepetir] = useState('');
  const [ver, setVer] = useState(false);
  const [local, setLocal] = useState('');
  const { error, hecho, enviando, ejecutar } = useAccion();

  function enviar(e: FormEvent) {
    e.preventDefault();
    if (password.length < 6) return setLocal('La contraseña debe tener al menos 6 caracteres.');
    if (password !== repetir) return setLocal('Las contraseñas no coinciden.');
    setLocal('');
    void ejecutar(() => restablecerApi(token, password));
  }

  return (
    <Marco titulo="Definir contraseña">
      {!token || enlaceVencido(error) ? (
        <>
          <Aviso>{token ? error : 'Este enlace está incompleto.'}</Aviso>
          <Link to="/olvide" className="btn-primary w-full">
            Solicitar un enlace nuevo
          </Link>
        </>
      ) : hecho ? (
        <Aviso tono="ok">Contraseña guardada. Ya puede iniciar sesión.</Aviso>
      ) : (
        <form className="space-y-4" onSubmit={enviar}>
          <div>
            <label htmlFor="p1" className="label">
              Nueva contraseña (mínimo 6 caracteres)
            </label>
            <input
              id="p1"
              type={ver ? 'text' : 'password'}
              className="input"
              value={password}
              autoComplete="new-password"
              onChange={(e) => setPassword(e.target.value)}
              disabled={enviando}
              autoFocus
            />
          </div>
          <div>
            <label htmlFor="p2" className="label">
              Repetir contraseña
            </label>
            <input
              id="p2"
              type={ver ? 'text' : 'password'}
              className="input"
              value={repetir}
              autoComplete="new-password"
              onChange={(e) => setRepetir(e.target.value)}
              disabled={enviando}
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300 text-vinotinto-700 focus:ring-vinotinto-600"
              checked={ver}
              onChange={(e) => setVer(e.target.checked)}
            />
            Mostrar contraseñas
          </label>
          {local || error ? <Aviso>{local || error}</Aviso> : null}
          <button type="submit" className="btn-primary w-full" disabled={enviando}>
            {enviando ? 'Guardando...' : 'Guardar contraseña'}
          </button>
        </form>
      )}
    </Marco>
  );
}

export function ConfirmarEliminacionPage() {
  const token = useSearchParams()[0].get('token') ?? '';
  const { error, hecho, enviando, ejecutar } = useAccion();

  return (
    <Marco titulo="Confirmar eliminación">
      {!token || enlaceVencido(error) ? (
        <>
          <Aviso>
            {token ? error : 'Este enlace está incompleto.'} Solicite la eliminación de nuevo desde la lista de usuarios.
          </Aviso>
          <Link to="/usuarios" className="btn-secondary w-full">
            Ir a usuarios
          </Link>
        </>
      ) : hecho ? (
        <Aviso tono="ok">El usuario fue eliminado.</Aviso>
      ) : (
        <>
          <p className="text-sm text-slate-600">
            Al confirmar, la cuenta del usuario se elimina de forma definitiva. No se puede deshacer.
          </p>
          {error ? <Aviso>{error}</Aviso> : null}
          <button
            type="button"
            className="btn-danger w-full"
            disabled={enviando}
            onClick={() => void ejecutar(() => confirmarEliminacionApi(token))}
          >
            {enviando ? 'Eliminando...' : 'Eliminar usuario'}
          </button>
        </>
      )}
    </Marco>
  );
}
