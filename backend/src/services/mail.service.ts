import nodemailer from 'nodemailer';
import { env } from '../config/env';

const transporte = env.SMTP_PASS
  ? nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
    })
  : null;

const esc = (t: string) => t.replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);

function plantilla(titulo: string, texto: string, boton: string, enlace: string, nota: string): string {
  return `<div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;color:#1e293b">
<h2 style="color:#7B1E3B">${esc(titulo)}</h2><p>${texto}</p>
<p style="margin:28px 0"><a href="${esc(enlace)}" style="background:#7B1E3B;color:#fff;padding:12px 22px;border-radius:8px;text-decoration:none;font-weight:bold">${esc(boton)}</a></p>
<p style="font-size:12px;color:#64748b">${esc(nota)}<br>Si no esperaba este correo, ignórelo.<br>Constancias FACES - UC</p></div>`;
}

/** Devuelve true si el correo salió. Nunca lanza: el flujo de negocio no debe caer por el SMTP. */
async function enviar(to: string, subject: string, html: string, enlace: string): Promise<boolean> {
  if (!transporte) {
    console.warn(`[MAIL] SMTP_PASS no configurado. Correo a ${to} (${subject}): ${enlace}`);
    return false;
  }
  try {
    await transporte.sendMail({ from: `"Constancias FACES UC" <${env.SMTP_USER}>`, to, subject, html });
    return true;
  } catch (error) {
    console.error('[MAIL] Error enviando correo:', error instanceof Error ? error.message : error);
    return false;
  }
}

const enlace = (ruta: string, token: string) => `${env.APP_URL.replace(/\/+$/, '')}${ruta}?token=${token}`;

export function correoInvitacion(to: string, nombre: string, token: string) {
  const url = enlace('/restablecer', token);
  return enviar(to, 'Invitación al sistema de constancias FACES', plantilla(
    'Bienvenido(a) al sistema', `Hola ${esc(nombre)}, se creó una cuenta para usted. Defina su contraseña para activarla.`,
    'Definir contraseña', url, 'El enlace es de un solo uso y vence en 48 horas.'), url);
}

export function correoReset(to: string, nombre: string, token: string) {
  const url = enlace('/restablecer', token);
  return enviar(to, 'Cambio de contraseña', plantilla(
    'Cambio de contraseña', `Hola ${esc(nombre)}, recibimos una solicitud para cambiar su contraseña.`,
    'Cambiar contraseña', url, 'El enlace es de un solo uso y vence en 1 hora.'), url);
}

export function correoEliminacion(to: string, nombreObjetivo: string, token: string) {
  const url = enlace('/confirmar-eliminacion', token);
  return enviar(to, 'Confirme la eliminación de un usuario', plantilla(
    'Confirmar eliminación', `Solicitó eliminar al usuario <b>${esc(nombreObjetivo)}</b>. Esta acción no se puede deshacer.`,
    'Confirmar eliminación', url, 'El enlace es de un solo uso y vence en 30 minutos.'), url);
}
