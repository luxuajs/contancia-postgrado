import { ReactNode } from 'react';

type Tono = 'error' | 'ok' | 'info';

const ESTILO: Record<Tono, string> = {
  error: 'border-rose-200 bg-rose-50 text-rose-700',
  ok: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  info: 'border-amber-200 bg-amber-50 text-amber-800',
};

interface Props {
  tono?: Tono;
  id?: string;
  className?: string;
  children: ReactNode;
}

/** Mensaje de estado en bloque. Los errores se anuncian como alerta; el resto, como estado. */
export default function Aviso({ tono = 'error', id, className = '', children }: Props) {
  return (
    <div
      id={id}
      role={tono === 'error' ? 'alert' : 'status'}
      className={`rounded-xl border px-4 py-3 text-sm font-medium ${ESTILO[tono]} ${className}`}
    >
      {children}
    </div>
  );
}
