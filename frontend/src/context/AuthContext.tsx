import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { alSesionExpirada, loginApi, meApi, Usuario } from '../api/client';

const TOKEN_KEY = 'facesuc_token';

interface AuthContextValue {
  usuario: Usuario | null;
  token: string | null;
  cargando: boolean;
  /** Aviso para la pantalla de ingreso (p. ej. sesión vencida). */
  aviso: string;
  iniciarSesion: (cedula: string, password: string) => Promise<void>;
  cerrarSesion: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [cargando, setCargando] = useState(true);
  const [aviso, setAviso] = useState('');

  useEffect(() => {
    let activo = true;

    async function validarSesion() {
      const tokenGuardado = localStorage.getItem(TOKEN_KEY);

      if (!tokenGuardado) {
        if (activo) setCargando(false);
        return;
      }

      try {
        const usuarioValidado = await meApi(tokenGuardado);
        if (activo) {
          setToken(tokenGuardado);
          setUsuario(usuarioValidado);
        }
      } catch {
        if (activo) {
          localStorage.removeItem(TOKEN_KEY);
          setToken(null);
          setUsuario(null);
        }
      } finally {
        if (activo) setCargando(false);
      }
    }

    void validarSesion();

    return () => {
      activo = false;
    };
  }, []);

  const iniciarSesion = useCallback(async (cedula: string, password: string) => {
    const resultado = await loginApi(cedula, password);
    localStorage.setItem(TOKEN_KEY, resultado.token);
    setAviso('');
    setToken(resultado.token);
    setUsuario(resultado.usuario);
  }, []);

  const cerrarSesion = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUsuario(null);
  }, []);

  useEffect(() => {
    alSesionExpirada(() => {
      if (!localStorage.getItem(TOKEN_KEY)) return;
      cerrarSesion();
      setAviso('Su sesión venció. Inicie sesión de nuevo para continuar.');
    });
    return () => alSesionExpirada(null);
  }, [cerrarSesion]);

  const valor = useMemo<AuthContextValue>(
    () => ({ usuario, token, cargando, aviso, iniciarSesion, cerrarSesion }),
    [usuario, token, cargando, aviso, iniciarSesion, cerrarSesion],
  );

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const contexto = useContext(AuthContext);
  if (!contexto) {
    throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  }
  return contexto;
}
