import { MateriaConstancia } from '../api/client';
import Chip from './Chip';

interface NotesTableProps {
  materias: MateriaConstancia[];
}

export default function NotesTable({ materias }: NotesTableProps) {
  return (
    <section className="card animate-fade-up overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Expediente de notas</h2>
        </div>
        <Chip tono="marca">
          {materias.length} {materias.length === 1 ? 'registro' : 'registros'}
        </Chip>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-vinotinto-50">
            <tr>
              <th className="hidden whitespace-nowrap px-2.5 py-3 md:px-4 font-semibold text-vinotinto-800 md:table-cell">Código</th>
              <th className="md:min-w-[220px] px-2.5 py-3 md:px-4 font-semibold text-vinotinto-800">Asignatura</th>
              <th className="whitespace-nowrap px-2.5 py-3 md:px-4 text-center font-semibold text-vinotinto-800"><abbr title="Unidades de crédito" className="no-underline">UC</abbr></th>
              <th className="hidden whitespace-nowrap px-2.5 py-3 md:px-4 text-center font-semibold text-vinotinto-800 md:table-cell">Período</th>
              <th className="hidden whitespace-nowrap px-2.5 py-3 md:px-4 text-center font-semibold text-vinotinto-800 md:table-cell">Sección</th>
              <th className="whitespace-nowrap px-2.5 py-3 md:px-4 text-center font-semibold text-vinotinto-800">Nota</th>
              <th className="hidden whitespace-nowrap px-2.5 py-3 md:px-4 font-semibold text-vinotinto-800 lg:table-cell">
                En letras
              </th>
              <th className="whitespace-nowrap px-2.5 py-3 md:px-4 text-center font-semibold text-vinotinto-800">Estado</th>
              <th className="hidden whitespace-nowrap px-2.5 py-3 md:px-4 font-semibold text-vinotinto-800 xl:table-cell">
                Profesor
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 bg-white">
            {materias.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-6 py-10 text-center text-slate-500">
                  El estudiante no tiene notas registradas.
                </td>
              </tr>
            ) : (
              materias.map((materia, indice) => {
                const aprobada = materia.aprobada === 'SI';
                return (
                  <tr key={`${materia.codigo}-${materia.periodo}-${indice}`} className="hover:bg-slate-50/70">
                    <td className="hidden whitespace-nowrap px-2.5 py-3 md:px-4 font-mono text-xs text-slate-600 md:table-cell">
                      {materia.codigo}
                    </td>
                    <td className="px-2.5 py-3 md:px-4 font-medium text-slate-900">{materia.asignatura}</td>
                    <td className="whitespace-nowrap px-2.5 py-3 md:px-4 text-center tabular-nums text-slate-700">{materia.uc}</td>
                    <td className="hidden whitespace-nowrap px-2.5 py-3 md:px-4 text-center tabular-nums text-slate-700 md:table-cell">
                      {materia.periodo}
                    </td>
                    <td className="hidden whitespace-nowrap px-2.5 py-3 md:px-4 text-center tabular-nums text-slate-700 md:table-cell">
                      {materia.seccion || '—'}
                    </td>
                    <td className={`whitespace-nowrap px-2.5 py-3 md:px-4 text-center text-base font-bold tabular-nums ${aprobada ? 'text-slate-900' : 'text-rose-700'}`}>
                      {materia.nota}
                    </td>
                    <td className="hidden whitespace-nowrap px-2.5 py-3 md:px-4 text-slate-600 lg:table-cell">
                      {materia.nota_letras}
                    </td>
                    <td className="whitespace-nowrap px-2.5 py-3 md:px-4 text-center">
                      <Chip tono={aprobada ? 'ok' : 'error'}>{aprobada ? 'Aprobada' : 'Reprobada'}</Chip>
                    </td>
                    <td className="hidden whitespace-nowrap px-2.5 py-3 md:px-4 text-slate-600 xl:table-cell">
                      {materia.profesor || '—'}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
