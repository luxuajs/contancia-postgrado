import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { Rol } from '@prisma/client';
import { env } from '../src/config/env';
import { prisma } from '../src/lib/prisma';

/**
 * Crea o actualiza el usuario ROOT a partir de ROOT_EMAIL, ROOT_PASSWORD y ROOT_NOMBRE.
 * El ROOT es el único usuario sin cédula: inicia sesión con su correo.
 * Es idempotente: puede ejecutarse en cada arranque del contenedor.
 */
async function main(): Promise<void> {
  const email = env.ROOT_EMAIL?.trim().toLowerCase();
  const password = env.ROOT_PASSWORD ?? '';

  if (!email || password.length < 6) {
    console.warn('[SEED] ROOT_EMAIL o ROOT_PASSWORD (mín. 6) no definidos. No se creó el usuario ROOT.');
    return;
  }

  const datos = {
    cedula: null,
    nombre: env.ROOT_NOMBRE,
    passwordHash: await bcrypt.hash(password, 10),
    rol: Rol.ROOT,
    activo: true,
  };

  const usuario = await prisma.usuario.upsert({
    where: { email },
    update: datos,
    create: { ...datos, email },
  });

  console.log(`[SEED] Usuario ROOT listo: ${usuario.nombre} · Email: ${email}`);
}

main()
  .catch((error) => {
    console.error('[SEED] Error creando el usuario ROOT:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
