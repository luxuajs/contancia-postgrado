import fs from 'fs';
import path from 'path';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import * as OpenApiValidator from 'express-openapi-validator';

// Modo aviso: compara peticiones y respuestas con el contrato y registra la deriva,
// sin bloquear ni cambiar la respuesta. Cada línea "[contrato]" es una posible tarea.

type Deriva = {
  dir: 'peticion' | 'respuesta';
  metodo: string;
  ruta: string;
  status?: number;
  errores: { campo: string; mensaje: string }[];
};

// atajo: deduplicación en memoria con tope fijo; si hiciera falta histórico, a un log externo.
const vistas = new Set<string>();
const MAX_VISTAS = 1000;

/** Escribe una deriva una sola vez por proceso (nunca el cuerpo: puede llevar datos personales). */
function avisar(d: Deriva): void {
  const clave = JSON.stringify([d.dir, d.metodo, d.ruta, d.errores]);
  if (vistas.has(clave)) return;
  if (vistas.size < MAX_VISTAS) vistas.add(clave);
  console.warn('[contrato]', JSON.stringify(d));
}

/** Ruta del contrato (p. ej. /api/constancias/{cedula}); nunca la URL real, que lleva la cédula. */
function rutaDe(req: Request): string {
  const openapi = (req as Request & { openapi?: { openApiRoute?: string } }).openapi;
  return openapi?.openApiRoute ?? `${req.baseUrl}${req.path}`.slice(0, 120);
}

function aErrores(err: unknown): Deriva['errores'] {
  const e = err as { errors?: { path?: string; message?: string }[]; message?: string };
  if (Array.isArray(e.errors) && e.errors.length > 0) {
    return e.errors.map((x) => ({ campo: x.path ?? '', mensaje: x.message ?? '' }));
  }
  return [{ campo: '', mensaje: e.message ?? String(err) }];
}

/**
 * Middleware de validación en modo aviso, o null si está apagado o falta el contrato.
 * Va después de express.json() y antes de las rutas.
 */
export function crearValidadorContrato(modo: 'off' | 'aviso', ruta: string): RequestHandler | null {
  if (modo === 'off') return null;

  const apiSpec = path.resolve(ruta);
  if (!fs.existsSync(apiSpec)) {
    // Falla abierto a propósito: en modo aviso el contrato nunca tumba la API.
    console.warn(`[contrato] No se encontró ${apiSpec}; validación desactivada.`);
    return null;
  }

  const validadores = OpenApiValidator.middleware({
    apiSpec,
    validateRequests: true,
    validateResponses: {
      // Se llama en res.json() con una respuesta fuera de contrato; la respuesta sale igual.
      onError: (err, _json, req) =>
        avisar({ dir: 'respuesta', metodo: req.method, ruta: rutaDe(req), errores: aErrores(err) }),
    },
    // La autenticación la hace requireAuth; aquí solo se compara la forma.
    validateSecurity: false,
  });

  return (req: Request, res: Response, next: NextFunction): void => {
    let i = 0;
    // Ejecuta los validadores en cadena; un error se registra y se sigue con el siguiente.
    const siguiente = (err?: unknown): void => {
      if (err) {
        const status = (err as { status?: number }).status;
        avisar({ dir: 'peticion', metodo: req.method, ruta: rutaDe(req), status, errores: aErrores(err) });
      }
      const mw = validadores[i++];
      if (!mw) {
        next();
        return;
      }
      try {
        mw(req, res, siguiente);
      } catch (e) {
        siguiente(e);
      }
    };
    siguiente();
  };
}
