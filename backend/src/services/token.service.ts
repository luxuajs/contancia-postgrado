import crypto from 'crypto';
import { TipoToken } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { AppError } from '../utils/AppError';

const VIGENCIA_MIN: Record<TipoToken, number> = {
  INVITACION: 48 * 60,
  RESET: 60,
  ELIMINACION: 30,
};

const sha256 = (t: string) => crypto.createHash('sha256').update(t).digest('hex');

/** Crea un token y anula los anteriores sin usar del mismo tipo/usuario. Devuelve el token en claro. */
export async function crearToken(usuarioId: number, tipo: TipoToken): Promise<string> {
  const token = crypto.randomBytes(32).toString('hex');
  await prisma.$transaction([
    prisma.tokenUsuario.deleteMany({ where: { usuarioId, tipo, usadoEn: null } }),
    prisma.tokenUsuario.create({
      data: { usuarioId, tipo, hash: sha256(token), expiraEn: new Date(Date.now() + VIGENCIA_MIN[tipo] * 60_000) },
    }),
  ]);
  return token;
}

/** Marca el token como usado (atómico: dos usos simultáneos no pasan) y devuelve el usuarioId. */
export async function consumirToken(token: string, tipos: TipoToken[]): Promise<number> {
  const hash = sha256(token);
  const ahora = new Date();
  const res = await prisma.tokenUsuario.updateMany({
    where: { hash, tipo: { in: tipos }, usadoEn: null, expiraEn: { gt: ahora } },
    data: { usadoEn: ahora },
  });
  if (res.count !== 1) throw new AppError(400, 'El enlace es inválido o ya venció');
  const fila = await prisma.tokenUsuario.findUniqueOrThrow({ where: { hash } });
  return fila.usuarioId;
}
