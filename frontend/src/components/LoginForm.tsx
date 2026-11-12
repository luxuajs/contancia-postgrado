import { FormEvent, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ApiError } from '../api/client';
import { useAuth } from '../context/AuthContext';
import Spinner from './Spinner';
import Aviso from './Aviso';

export default function LoginForm() {
  const { iniciarSesion, aviso } = useAuth();
  const navigate = useNavigate();

  const [cedula, setCedula] = useState('');
  const [password, setPassword] = useState('');
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);
  const usuarioRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const destinoFoco = useRef(passwordRef);

  // tras un error, el foco vuelve al campo que hay que corregir
  useEffect(() => {
    if (error) destinoFoco.current.current?.select();
  }, [error]);

  async function manejarEnvio(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setError('');

    const identificador = cedula.trim();

    if (!identificador) {
      destinoFoco.current = usuarioRef;
      setError('Ingrese su cédula de identidad o correo institucional.');
      return;
    }

    const esEmail = identificador.includes('@');
    if (!esEmail && !/^\d{5,9}$/.test(identificador.replace(/\D/g, ''))) {
      destinoFoco.current = usuarioRef;
      setError('Escriba una cédula de 5 a 9 dígitos o un correo electrónico.');
      return;
    }

    if (!password) {
      destinoFoco.current = passwordRef;
      setError('Ingrese su contraseña.');
      return;
    }

    destinoFoco.current = passwordRef;
    setEnviando(true);

    try {
      await iniciarSesion(identificador, password);
      navigate('/', { replace: true });
    } catch (err) {
      setError(
        err instanceof ApiError && err.status === 401
          ? 'La cédula, el correo o la contraseña no son correctos. Revise los datos o recupere su contraseña.'
          : err instanceof ApiError
            ? err.message
            : 'No fue posible iniciar sesión. Intente nuevamente.',
      );
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={manejarEnvio} className="space-y-5" noValidate>
      {aviso ? (
        <Aviso tono="info">{aviso}</Aviso>
      ) : null}

      <div>
        <label htmlFor="usuario" className="label">
          Cédula o correo institucional
        </label>
        <input
          id="usuario"
          name="usuario"
          type="text"
          inputMode="text"
          autoComplete="username"
          autoFocus
          ref={usuarioRef}
          value={cedula}
          onChange={(evento) => setCedula(evento.target.value)}
          placeholder="Ej. 12345678"
          className="input"
          disabled={enviando}
        />
      </div>

      <div>
        <label htmlFor="password" className="label">
          Contraseña
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={mostrarPassword ? 'text' : 'password'}
            autoComplete="current-password"
            ref={passwordRef}
            value={password}
            onChange={(evento) => setPassword(evento.target.value)}
            className="input pr-12"
            disabled={enviando}
          />
          <button
            type="button"
            onClick={() => setMostrarPassword((valor) => !valor)}
            className="absolute inset-y-0 right-0 flex items-center px-4 text-slate-500 transition hover:text-slate-700"
            aria-label={mostrarPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {mostrarPassword ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M3 3l18 18M10.58 10.58A2 2 0 0 0 13.42 13.42M9.88 5.09A10.94 10.94 0 0 1 12 4.9c5.4 0 9 5.1 9 7.1 0 .7-.4 1.7-1.2 2.7M6.2 6.2C3.9 7.8 2.4 10 2.4 12c0 2 3.6 7.1 9.6 7.1 1.2 0 2.3-.2 3.3-.6"
                />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M2.4 12S6 4.9 12 4.9 21.6 12 21.6 12 18 19.1 12 19.1 2.4 12 2.4 12Z"
                />
                <circle cx="12" cy="12" r="3" strokeWidth={1.8} />
              </svg>
            )}
          </button>
        </div>
      </div>

      <div className="text-right">
        <Link to="/olvide" className="text-sm font-semibold text-vinotinto-800 hover:underline">
          ¿Olvidó su contraseña?
        </Link>
      </div>

      {error ? (
        <Aviso>{error}</Aviso>
      ) : null}

      <button type="submit" className="btn-primary w-full py-3.5" disabled={enviando}>
        {enviando ? (
          <>
            <Spinner className="h-4 w-4" />
            Verificando...
          </>
        ) : (
          'Iniciar sesión'
        )}
      </button>
    </form>
  );
}
