import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ApiError, ConstanciaData, obtenerConstancia } from '../api/client';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';

export default function PrintConstanciaPage() {
  const { cedula } = useParams<{ cedula: string }>();
  const { token } = useAuth();

  const [data, setData] = useState<ConstanciaData | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let activo = true;

    async function cargar() {
      if (!cedula || !token) return;

      try {
        const resultado = await obtenerConstancia(cedula, token);
        if (activo) setData(resultado);
      } catch (err) {
        if (activo) {
          setError(
            err instanceof ApiError
              ? err.message
              : 'No fue posible cargar la constancia para imprimir.',
          );
        }
      }
    }

    void cargar();

    return () => {
      activo = false;
    };
  }, [cedula, token]);

  useEffect(() => {
    if (!data) return;

    // imprime cuando los logos ya están cargados; si no, salen en blanco
    let activo = true;
    void Promise.all(Array.from(document.images, (img) => img.decode().catch(() => undefined))).then(() => {
      if (activo) window.print();
    });

    return () => {
      activo = false;
    };
  }, [data]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="max-w-md p-8 text-center">
          <h1 className="text-lg font-bold text-black mb-2">No se pudo preparar la impresión</h1>
          <p className="text-sm text-slate-600">{error}</p>
          <Link to="/" className="mt-4 inline-block text-black underline">
            Volver al panel
          </Link>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3 text-slate-600">
          <Spinner className="h-8 w-8 text-slate-600" />
          <p className="text-sm font-medium">Preparando constancia para impresión...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Solo en pantalla: tras cerrar el diálogo de impresión no queda al usuario sin salida */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-4 py-2 text-sm print:hidden">
        <Link to="/" className="font-semibold text-vinotinto-800 hover:underline">
          Volver al panel
        </Link>
        <button type="button" onClick={() => window.print()} className="btn-secondary px-3 py-1.5">
          Imprimir de nuevo
        </button>
      </div>

      {/* Hoja carta. En pantalla el margen es padding; al imprimir lo da @page (index.css) para repetirse en cada hoja */}
      <div
        className="mx-auto flex min-h-[11in] max-w-[8.5in] flex-col px-[1.18in] py-[0.98in] font-[Arial] text-black print:min-h-[9in] print:max-w-none print:p-0"
        style={{ boxSizing: 'border-box' }}
      >
        {/* Encabezado: escudo UC | texto institucional | logo Postgrado FACES (como Word) */}
        <div className="mb-6 flex items-center justify-between gap-3">
          <img
            src="/logos/uc.png"
            alt="Universidad de Carabobo"
            className="h-[62pt] w-auto shrink-0"
          />
          <div className="flex-1 text-center text-[8.5pt] font-bold leading-snug text-[#808080]">
            <p>UNIVERSIDAD DE CARABOBO</p>
            <p>FACULTAD DE CIENCIAS ECONÓMICAS Y SOCIALES</p>
            <p>DIRECCIÓN DE ASUNTOS ESTUDIANTILES – POSTGRADO</p>
          </div>
          <img
            src="/logos/faces-postgrado.png"
            alt="FACES Postgrado"
            className="h-[57pt] w-auto shrink-0"
          />
        </div>

        {/* Título principal: centrado, negrita, 13pt */}
        <h1 className="text-center font-bold text-[13pt] mt-2 mb-2">
          REPORTE INTERNO DE NOTAS
        </h1>

        {/* Párrafo introductorio: justificado, normal, 11pt */}
        <p className="text-[11pt] leading-relaxed text-justify mb-2">
          Reporte interno de Notas para la ciudadana{' '}
          <span className="font-bold">{data.nombres}</span>, titular de la cedula de identidad{' '}
          <span className="font-bold">{data.cedula_formateada}</span>, cursó las siguientes asignaturas
          correspondiente al programa:
        </p>

        {/* Programa: centrado, negrita, 13pt */}
        <p className="text-center font-bold text-[13pt] mb-3">
          {data.programa}
        </p>

        {/* Tabla de materias, con cuadrícula como la plantilla */}
        <table className="mb-3 w-full table-fixed border-collapse text-[7.5pt]">
          <colgroup>
            <col style={{ width: '48.5%' }} />
            <col style={{ width: '6.5%' }} />
            <col style={{ width: '6.7%' }} />
            <col style={{ width: '9.9%' }} />
            <col style={{ width: '7.2%' }} />
            <col style={{ width: '9%' }} />
            <col style={{ width: '12.2%' }} />
          </colgroup>
          <thead>
            <tr className="text-[8pt]">
              <th className="border border-black px-0.5 py-0.5 text-center font-bold">Asignatura</th>
              <th className="border border-black px-0.5 py-0.5 text-center font-bold">Niv.</th>
              <th className="border border-black px-0.5 py-0.5 text-center font-bold">UC</th>
              <th className="border border-black px-0.5 py-0.5 text-center font-bold">Periodo</th>
              <th className="border border-black px-0.5 py-0.5 text-center font-bold">Sec.</th>
              <th className="border border-black px-0.5 py-0.5 text-center font-bold">Notas</th>
              <th className="border border-black px-0.5 py-0.5 text-center font-bold">Notas en letras</th>
            </tr>
          </thead>
          <tbody>
            {data.materias.map((materia, indice) => (
              <tr key={`${materia.codigo}-${materia.periodo}-${indice}`} className="break-inside-avoid">
                <td className="border border-black px-0.5 py-0.5 text-center">{materia.asignatura}</td>
                <td className="border border-black px-0.5 py-0.5 text-center">{materia.nivel}</td>
                <td className="border border-black px-0.5 py-0.5 text-center">{materia.uc}</td>
                <td className="border border-black px-0.5 py-0.5 text-center">{materia.periodo}</td>
                <td className="border border-black px-0.5 py-0.5 text-center">{materia.seccion || ''}</td>
                <td className="border border-black px-0.5 py-0.5 text-center">{materia.nota}</td>
                <td className="border border-black px-0.5 py-0.5 text-center">{materia.nota_letras}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Cuadro de totales: punteado, a la derecha */}
        <table className="mb-2 ml-auto w-[170pt] break-inside-avoid border-collapse border border-dashed border-black text-[8pt]">
          <tbody>
            <tr>
              <td className="border border-dashed border-black px-1 py-0.5 text-right font-bold">Total de créditos Cursados:</td>
              <td className="w-[50pt] border border-dashed border-black px-1 py-0.5 text-center font-bold">{data.total_creditos}</td>
            </tr>
            <tr>
              <td className="border border-dashed border-black px-1 py-0.5 text-right font-bold">Total de créditos Aprobados:</td>
              <td className="border border-dashed border-black px-1 py-0.5 text-center font-bold">{data.creditos_aprobados}</td>
            </tr>
            <tr>
              <td className="border border-dashed border-black px-1 py-0.5 text-right font-bold">Índice Académico:</td>
              <td className="border border-dashed border-black px-1 py-0.5 text-center font-bold">{data.indice_academico}</td>
            </tr>
          </tbody>
        </table>

        {/* Firma: el nombre de la profesora queda al pie de la hoja (mt-auto) */}
        <div className="mt-auto break-inside-avoid pt-10 text-center">
          <p className="text-[11pt] font-bold">{data.profesor_coordinacion}</p>
          <p className="text-[9pt] font-bold">Dirección de Asuntos Estudiantiles – Postgrado</p>
        </div>
      </div>
    </div>
  );
}
