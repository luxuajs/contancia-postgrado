import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
import type { UsuarioListado } from '../api/client';
import Aviso from './Aviso';

export type Rol = 'ROOT' | 'ADMIN';

export interface FormularioUsuario {
  cedula: string;
  nombre: string;
  email: string;
  password: string;
  rol: Rol;
}

interface Props {
  /** Usuario a editar; `null` crea uno nuevo. */
  editando: UsuarioListado | null;
  /** Id del usuario conectado: su propia cuenta no se puede eliminar. */
  propioId?: number;
  guardando: boolean;
  eliminando: boolean;
  /** Error del servidor al guardar. */
  error: string;
  onCerrar: () => void;
  onGuardar: (datos: FormularioUsuario) => void;
  onEliminar: (usuario: UsuarioListado) => void;
}

/** Valida el formulario; devuelve el primer error o '' si es válido. */
function validar(f: FormularioUsuario, editando: boolean): string {
  if (!editando && !/^\d{5,9}$/.test(f.cedula)) return 'La cédula debe contener entre 5 y 9 dígitos numéricos.';
  if (!editando && !f.email) return 'El correo electrónico es obligatorio.';
  if (f.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) return 'Ingrese un correo electrónico válido.';
  if (f.nombre.trim().length < 3) return 'Ingrese el nombre completo del usuario.';
  if (!/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s.']+$/.test(f.nombre.trim()))
    return 'El nombre solo puede contener letras, espacios, puntos y apóstrofos.';
  if (f.password && f.password.length < 6) return 'La contraseña debe tener al menos 6 caracteres.';
  return '';
}

const FOCALIZABLES = 'button:not([disabled]), input:not([disabled]), select:not([disabled])';

/** Diálogo para crear o editar un usuario. Se monta solo mientras está abierto. */
export default function UsuarioDialogo({
  editando,
  propioId,
  guardando,
  eliminando,
  error,
  onCerrar,
  onGuardar,
  onEliminar,
}: Props) {
  const [formulario, setFormulario] = useState<FormularioUsuario>({
    cedula: editando?.cedula ?? '',
    nombre: editando?.nombre ?? '',
    email: '',
    password: '',
    rol: editando?.rol ?? 'ADMIN',
  });
  const [errorLocal, setErrorLocal] = useState('');
  const [confirmando, setConfirmando] = useState(false);
  const caja = useRef<HTMLDivElement>(null);
  const ocupado = guardando || eliminando;
  const puedeEliminar = editando !== null && editando.id !== propioId;

  // el foco entra al primer campo editable (la cédula no se edita)
  useEffect(() => {
    caja.current?.querySelector<HTMLElement>('input:not([disabled])')?.focus();
  }, []);

  const cambiar = (campo: keyof FormularioUsuario, valor: string) =>
    setFormulario((actual) => ({ ...actual, [campo]: valor }));

  function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const mensaje = validar(formulario, editando !== null);
    setErrorLocal(mensaje);
    if (!mensaje) onGuardar(formulario);
  }

  // Esc cierra; Tab no sale del diálogo
  function teclado(evento: KeyboardEvent<HTMLDivElement>) {
    if (evento.key === 'Escape' && !ocupado) {
      onCerrar();
      return;
    }
    if (evento.key !== 'Tab' || !caja.current) return;
    const elementos = caja.current.querySelectorAll<HTMLElement>(FOCALIZABLES);
    const primero = elementos[0];
    const ultimo = elementos[elementos.length - 1];
    if (evento.shiftKey && document.activeElement === primero) {
      evento.preventDefault();
      ultimo.focus();
    } else if (!evento.shiftKey && document.activeElement === ultimo) {
      evento.preventDefault();
      primero.focus();
    }
  }

  const alerta = errorLocal || error;

  return (
    <div className="fixed inset-0 z-50 flex overflow-y-auto bg-slate-950/50 px-4 py-6" onKeyDown={teclado}>
      <div
        ref={caja}
        role="dialog"
        aria-modal="true"
        aria-labelledby="usuario-titulo"
        className="m-auto w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 id="usuario-titulo" className="text-lg font-bold text-slate-900">
              {editando ? 'Editar usuario' : 'Nuevo usuario'}
            </h2>
            {editando ? null : (
              <p className="mt-1 text-sm text-slate-500">
                Se enviará una invitación al correo para que defina su contraseña.
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onCerrar}
            disabled={ocupado}
            className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Cerrar"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={enviar} className="space-y-4" noValidate>
          <div>
            <label htmlFor="usuario-cedula" className="label">
              Cédula
            </label>
            <input
              id="usuario-cedula"
              type="text"
              inputMode="numeric"
              className="input"
              value={formulario.cedula}
              onChange={(e) => cambiar('cedula', e.target.value.replace(/\D/g, ''))}
              disabled={Boolean(editando) || ocupado}
              placeholder="Ej. 12345678"
            />
          </div>

          <div>
            <label htmlFor="usuario-nombre" className="label">
              Nombre completo
            </label>
            <input
              id="usuario-nombre"
              type="text"
              className="input"
              value={formulario.nombre}
              onChange={(e) => cambiar('nombre', e.target.value)}
              disabled={ocupado}
              placeholder="Ej. Prof. María Fernández"
            />
          </div>

          <div>
            <label htmlFor="usuario-email" className="label">
              {editando ? 'Correo electrónico (solo si desea cambiarlo)' : 'Correo electrónico'}
            </label>
            <input
              id="usuario-email"
              type="email"
              className="input"
              value={formulario.email}
              onChange={(e) => cambiar('email', e.target.value.trim())}
              disabled={ocupado}
              placeholder="Ej. nombre@uc.edu.ve"
            />
          </div>

          <div>
            <label htmlFor="usuario-rol" className="label">
              Rol
            </label>
            <select
              id="usuario-rol"
              className="input"
              value={formulario.rol}
              onChange={(e) => cambiar('rol', e.target.value)}
              disabled={ocupado}
            >
              <option value="ADMIN">ADMIN: emite constancias</option>
              <option value="ROOT">ROOT: emite constancias y gestiona usuarios</option>
            </select>
          </div>

          {editando ? (
            <div>
              <label htmlFor="usuario-password" className="label">
                Contraseña (opcional)
              </label>
              <input
                id="usuario-password"
                type="password"
                className="input"
                value={formulario.password}
                onChange={(e) => cambiar('password', e.target.value)}
                disabled={ocupado}
                placeholder="Dejar vacío para mantener la actual"
                autoComplete="new-password"
              />
            </div>
          ) : null}

          {alerta ? (
            <Aviso>{alerta}</Aviso>
          ) : null}

          {confirmando && editando ? (
            <div className="space-y-3 rounded-xl border border-rose-200 bg-rose-50 p-4">
              <p className="text-sm text-rose-800">
                Se enviará un correo a su cuenta para confirmar. <strong>{editando.nombre}</strong> no se elimina
                hasta que usted lo confirme.
              </p>
              <div className="flex justify-end gap-3">
                <button type="button" className="btn-secondary" disabled={eliminando} onClick={() => setConfirmando(false)}>
                  No eliminar
                </button>
                <button type="button" className="btn-danger" disabled={eliminando} onClick={() => onEliminar(editando)}>
                  {eliminando ? 'Enviando...' : 'Enviar correo de confirmación'}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-3 pt-2">
              {puedeEliminar ? (
                <button
                  type="button"
                  onClick={() => {
                    setErrorLocal('');
                    setConfirmando(true);
                  }}
                  disabled={ocupado}
                  className="btn-text text-sm text-rose-700 hover:bg-rose-50"
                >
                  Eliminar usuario
                </button>
              ) : (
                <span />
              )}
              <div className="flex gap-3">
                <button type="button" onClick={onCerrar} className="btn-secondary" disabled={ocupado}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary" disabled={ocupado}>
                  {guardando ? 'Guardando...' : editando ? 'Guardar cambios' : 'Crear usuario'}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
