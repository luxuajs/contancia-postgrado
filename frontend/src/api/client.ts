export interface Usuario {
  id: number;
  /** Nula solo para el ROOT. */
  cedula: string | null;
  email?: string | null;
  nombre: string;
  rol: 'ROOT' | 'ADMIN';
}

export interface UsuarioListado extends Usuario {
  activo: boolean;
  creadoEn: string;
}

export interface NuevoUsuario {
  cedula: string;
  nombre: string;
  email: string;
  password?: string;
  rol: 'ROOT' | 'ADMIN';
}

export interface CambiosUsuario {
  nombre?: string;
  email?: string;
  password?: string;
  rol?: 'ROOT' | 'ADMIN';
  activo?: boolean;
}

export type FormatoConstancia = 'docx' | 'pdf';

export interface MateriaConstancia {
  codigo: string;
  asignatura: string;
  nivel: number;
  uc: number;
  periodo_lectivo: string;
  anno_lectivo: string;
  periodo: string;
  seccion: string;
  nota: string;
  nota_letras: string;
  aprobada: string;
  profesor: string;
  calculo_promedio: string;
}

export interface ConstanciaData {
  nombres: string;
  cedula: string;
  cedula_formateada: string;
  programa: string;
  programa_codigo: string;
  total_asignaturas: number;
  total_creditos: number;
  creditos_aprobados: number;
  indice_academico: string;
  fecha_actual: string;
  ultimo_periodo: string;
  profesor_coordinacion: string;
  materias: MateriaConstancia[];
}

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

const API_BASE = (import.meta.env.VITE_API_URL ?? '/api').replace(/\/+$/, '');

function authHeaders(token: string): HeadersInit {
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

let alExpirarSesion: (() => void) | null = null;

/** Registra qué hacer cuando el servidor rechaza el token (sesión vencida). */
export function alSesionExpirada(fn: (() => void) | null): void {
  alExpirarSesion = fn;
}

async function mensajeDeError(res: Response): Promise<string> {
  const datos = await res.json().catch(() => null);
  if (datos && typeof datos.error === 'string') return datos.error;
  return `Error ${res.status}: no fue posible completar la solicitud`;
}

async function peticionJson<T>(ruta: string, opciones: RequestInit): Promise<T> {
  let res: Response;

  try {
    res = await fetch(`${API_BASE}${ruta}`, opciones);
  } catch {
    throw new ApiError(0, 'No se pudo conectar con el servidor. Revise su conexión e intente de nuevo; si continúa, avise a soporte técnico.');
  }

  if (!res.ok) {
    // un 401 fuera del login significa token vencido o revocado
    if (res.status === 401 && ruta !== '/auth/login') alExpirarSesion?.();
    throw new ApiError(res.status, await mensajeDeError(res));
  }

  return (await res.json()) as T;
}

export async function loginApi(cedula: string, password: string): Promise<{ token: string; usuario: Usuario }> {
  return peticionJson<{ token: string; usuario: Usuario }>('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cedula, password }),
  });
}

export async function meApi(token: string): Promise<Usuario> {
  const respuesta = await peticionJson<{ usuario: Usuario }>('/auth/me', {
    method: 'GET',
    headers: authHeaders(token),
  });
  return respuesta.usuario;
}

export async function obtenerConstancia(cedula: string, token: string): Promise<ConstanciaData> {
  return peticionJson<ConstanciaData>(`/constancias/${encodeURIComponent(cedula)}`, {
    method: 'GET',
    headers: authHeaders(token),
  });
}

function nombreDesdeCabecera(
  cabecera: string | null,
  cedula: string,
  formato: FormatoConstancia,
): string {
  const nombrePorDefecto = `Constancia_Notas_${cedula}.${formato}`;

  if (!cabecera) return nombrePorDefecto;

  const coincidencia = /filename\*?=(?:UTF-8'')?"?([^";]+)"?/i.exec(cabecera);
  if (!coincidencia || !coincidencia[1]) return nombrePorDefecto;

  try {
    return decodeURIComponent(coincidencia[1]);
  } catch {
    return coincidencia[1];
  }
}

export async function descargarConstancia(
  cedula: string,
  token: string,
  formato: FormatoConstancia = 'docx',
): Promise<{ blob: Blob; filename: string }> {
  let res: Response;

  const ruta =
    formato === 'pdf'
      ? `/constancias/pdf/${encodeURIComponent(cedula)}`
      : `/constancias/download/${encodeURIComponent(cedula)}`;

  try {
    res = await fetch(`${API_BASE}${ruta}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch {
    throw new ApiError(0, 'No se pudo conectar con el servidor para descargar la constancia. Revise su conexión e intente de nuevo.');
  }

  if (!res.ok) {
    if (res.status === 401) alExpirarSesion?.();
    throw new ApiError(res.status, await mensajeDeError(res));
  }

  const blob = await res.blob();
  const filename = nombreDesdeCabecera(res.headers.get('Content-Disposition'), cedula, formato);

  return { blob, filename };
}

export async function listarUsuarios(token: string): Promise<UsuarioListado[]> {
  const respuesta = await peticionJson<{ usuarios: UsuarioListado[] }>('/usuarios', {
    method: 'GET',
    headers: authHeaders(token),
  });
  return respuesta.usuarios;
}

export async function crearUsuario(token: string, datos: NuevoUsuario): Promise<UsuarioListado> {
  const respuesta = await peticionJson<{ usuario: UsuarioListado }>('/usuarios', {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(datos),
  });
  return respuesta.usuario;
}

export async function actualizarUsuario(
  token: string,
  id: number,
  datos: CambiosUsuario,
): Promise<UsuarioListado> {
  const respuesta = await peticionJson<{ usuario: UsuarioListado }>(`/usuarios/${id}`, {
    method: 'PATCH',
    headers: authHeaders(token),
    body: JSON.stringify(datos),
  });
  return respuesta.usuario;
}

export async function registrarConsultaApi(
  token: string,
  cedula: string,
): Promise<{ consulta: { id: number; fechaConsulta: string } }> {
  return peticionJson<{ consulta: { id: number; fechaConsulta: string } }>('/consultas', {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({ cedula }),
  });
}

const postJson = (ruta: string, cuerpo: unknown) =>
  peticionJson<{ ok?: boolean }>(ruta, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cuerpo),
  });

export const olvideApi = (email: string) => postJson('/auth/olvide', { email });
export const restablecerApi = (token: string, password: string) =>
  postJson('/auth/restablecer', { token, password });
export const confirmarEliminacionApi = (token: string) =>
  postJson('/auth/eliminacion/confirmar', { token });

export async function solicitarEliminacionApi(token: string, id: number): Promise<{ correoEnviado: boolean }> {
  return peticionJson<{ correoEnviado: boolean }>(`/usuarios/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
}
