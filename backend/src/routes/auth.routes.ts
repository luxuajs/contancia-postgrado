import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../utils/asyncHandler';
import { requireAuth } from '../middleware/auth';
import { autenticar, obtenerUsuarioPorId, restablecerPassword, solicitarReset } from '../services/auth.service';
import { confirmarEliminacion } from '../services/usuario.service';
import { AuthRequest } from '../types/auth';

const router = Router();

const loginSchema = z
  .object({
    cedula: z.string().trim().min(1).optional(),
    usuario: z.string().trim().min(1).optional(),
    password: z.string().min(1, 'La contraseña es obligatoria'),
  })
  .refine((data) => Boolean(data.cedula || data.usuario), {
    message: 'Debe indicar la cédula o el usuario',
    path: ['cedula'],
  });

router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { cedula, usuario, password } = loginSchema.parse(req.body);
    const resultado = await autenticar(cedula ?? usuario ?? '', password);
    res.json(resultado);
  }),
);

router.get(
  '/me',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { user } = req as AuthRequest;
    const usuario = await obtenerUsuarioPorId(Number(user?.sub));
    res.json({ usuario });
  }),
);

const tokenSchema = z.string().trim().regex(/^[a-f0-9]{64}$/, 'Enlace inválido');

router.post(
  '/olvide',
  asyncHandler(async (req, res) => {
    const { email } = z.object({ email: z.string().trim().email('Correo inválido').max(255) }).parse(req.body);
    await solicitarReset(email);
    res.json({ ok: true });
  }),
);

router.post(
  '/restablecer',
  asyncHandler(async (req, res) => {
    const datos = z
      .object({ token: tokenSchema, password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres').max(100) })
      .parse(req.body);
    await restablecerPassword(datos.token, datos.password);
    res.json({ ok: true });
  }),
);

router.post(
  '/eliminacion/confirmar',
  asyncHandler(async (req, res) => {
    const { token } = z.object({ token: tokenSchema }).parse(req.body);
    await confirmarEliminacion(token);
    res.json({ ok: true });
  }),
);

export default router;
