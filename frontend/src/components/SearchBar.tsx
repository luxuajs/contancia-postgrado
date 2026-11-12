import { FormEvent } from 'react';
import Spinner from './Spinner';

interface SearchBarProps {
  cedula: string;
  onChange: (valor: string) => void;
  onSubmit: (evento: FormEvent<HTMLFormElement>) => void;
  buscando: boolean;
  /** Hay un error de búsqueda mostrado en `#error-busqueda`. */
  invalido?: boolean;
}

export default function SearchBar({ cedula, onChange, onSubmit, buscando, invalido }: SearchBarProps) {
  return (
    <form onSubmit={onSubmit} className="card p-5 sm:p-6" noValidate>
      <label htmlFor="cedula" className="label">
        Cédula de identidad del estudiante
      </label>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5" aria-hidden="true">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="m21 21-4.35-4.35M17 10.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z"
              />
            </svg>
          </span>

          <input
            id="cedula"
            name="cedula"
            type="text"
            inputMode="numeric"
            autoComplete="off"
            autoFocus
            onFocus={(evento) => evento.target.select()}
            aria-invalid={invalido || undefined}
            aria-describedby={invalido ? 'error-busqueda' : undefined}
            value={cedula}
            onChange={(evento) => onChange(evento.target.value)}
            placeholder="Ej. 12345678 o V-12.345.678"
            className="input pl-11"
            readOnly={buscando}
            aria-busy={buscando}
          />
        </div>

        <button type="submit" className="btn-primary sm:w-48" disabled={buscando}>
          {buscando ? (
            <>
              <Spinner className="h-4 w-4" />
              Buscando...
            </>
          ) : (
            <>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4" aria-hidden="true">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="m21 21-4.35-4.35M17 10.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z"
                />
              </svg>
              Buscar estudiante
            </>
          )}
        </button>
      </div>

      <p className="mt-2 text-xs text-slate-500">
        Puede escribir la cédula con o sin puntos y con o sin la letra V.
      </p>
    </form>
  );
}
