import { ReactNode } from 'react';
import { ConstanciaData } from '../api/client';

interface Props {
  data: ConstanciaData;
  /** Acciones sobre este estudiante (imprimir, descargar), junto a su nombre. */
  children?: ReactNode;
  /** Mensaje de estado bajo el encabezado (p. ej. constancia generada), junto a las acciones. */
  confirmacion?: ReactNode;
}

export default function StudentSummary({ data, children, confirmacion }: Props) {
  const estadisticas = [
    { etiqueta: 'Créditos cursados', valor: data.total_creditos },
    { etiqueta: 'Créditos aprobados', valor: data.creditos_aprobados },
    { etiqueta: 'Asignaturas', valor: data.total_asignaturas },
    { etiqueta: 'Índice académico', valor: data.indice_academico, destacado: true },
  ];

  return (
    <section className="card animate-fade-up overflow-hidden">
      <div className="flex flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <h2 className="break-words text-xl font-bold text-slate-900 sm:text-2xl">{data.nombres}</h2>
          <p className="mt-1 text-sm text-slate-700">
            {data.cedula_formateada}
            <span className="mx-2 text-slate-300">|</span>
            {data.programa}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Código de programa: {data.programa_codigo}
            {data.ultimo_periodo ? ` · Último período: ${data.ultimo_periodo}` : ''}
          </p>
        </div>

        {children}
      </div>

      {confirmacion}

      <dl className="grid grid-cols-2 divide-slate-200 border-t border-slate-200 sm:grid-cols-4 sm:divide-x">
        {estadisticas.map((estadistica) => (
          <div key={estadistica.etiqueta} className="px-5 py-3 sm:px-6">
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
              {estadistica.etiqueta}
            </dt>
            <dd
              className={`mt-0.5 text-xl font-bold tabular-nums ${
                estadistica.destacado ? 'text-vinotinto-700' : 'text-slate-900'
              }`}
            >
              {estadistica.valor}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
