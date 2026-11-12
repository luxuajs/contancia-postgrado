import { ReactNode } from 'react';

type Tono = 'ok' | 'error' | 'neutro' | 'oscuro' | 'marca';

const ESTILO: Record<Tono, string> = {
  ok: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  error: 'bg-rose-50 text-rose-700 ring-rose-200',
  neutro: 'bg-slate-100 text-slate-600 ring-slate-200',
  oscuro: 'bg-slate-800 text-white ring-slate-800',
  marca: 'bg-vinotinto-50 text-vinotinto-800 ring-vinotinto-100',
};

/** Etiqueta corta: estado (ok, error, neutro), rol (oscuro, neutro) o dato de marca. */
export default function Chip({ tono = 'neutro', className = '', children }: { tono?: Tono; className?: string; children: ReactNode }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${ESTILO[tono]} ${className}`}>
      {children}
    </span>
  );
}
