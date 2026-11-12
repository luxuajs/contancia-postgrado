import type { RowDataPacket } from 'mysql2';
import { sucai } from '../lib/sucai';
import { AppError } from '../utils/AppError';
import { env } from '../config/env';
import { esCedulaValida, formatearCedula, normalizarCedula } from '../utils/cedula';
import { formatearIndice, formatearNota, parseNumero } from '../utils/format';
import { numeroALetras } from '../utils/numberToWords';

export interface MateriaConstancia {
  codigo: string;
  asignatura: string;
  nivel: number;
  uc: number;
  periodo_lectivo: string;
  anno_lectivo: string;
  periodo: string;
  seccion: string;
  nota: string;
  nota_letras: string;
  aprobada: string;
  profesor: string;
  calculo_promedio: string;
}

export interface ConstanciaData {
  nombres: string;
  cedula: string;
  cedula_formateada: string;
  programa: string;
  programa_codigo: string;
  total_asignaturas: number;
  total_creditos: number;
  creditos_aprobados: number;
  indice_academico: string;
  fecha_actual: string;
  ultimo_periodo: string;
  profesor_coordinacion: string;
  materias: MateriaConstancia[];
}

function fechaActualLarga(): string {
  return new Intl.DateTimeFormat('es-VE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());
}

/**
 * Obtiene y prepara toda la información que se inyectará en la plantilla
 * Notas.docx para un estudiante identificado por su cédula.
 */
export async function obtenerConstancia(cedulaIngresada: string): Promise<ConstanciaData> {
  const cedula = normalizarCedula(cedulaIngresada);

  if (!esCedulaValida(cedula)) {
    throw new AppError(400, 'La cédula debe contener entre 5 y 9 dígitos');
  }

  // La vista guarda la cédula con o sin prefijo de nacionalidad; IN usa el índice.
  const candidatas = [cedula, ...['V', 'E'].flatMap((p) => [`${p}${cedula}`, `${p}-${cedula}`])];
  const [rows] = await sucai.query<RowDataPacket[]>(
    `SELECT DISTINCT nombres, codigo_programa, desc_programa, codigo_asignatura, desc_asignatura,
            nivel, uc, desc_periodo, periodo_lectivo, anno_lectivo, seccion,
            nota_final, aprobada, calculo_promedio, nombre_profesor
       FROM v_expedientes_alumnos_completo
      WHERE cedula IN (?)
      ORDER BY anno_lectivo, periodo_lectivo, codigo_asignatura`,
    [candidatas],
  );

  if (rows.length === 0) {
    throw new AppError(404, `No se encontró un estudiante con la cédula ${formatearCedula(cedula)}`);
  }

  const flag = (v: unknown) => ['1', 's', 'si', 'sí', 'true'].includes(String(v).trim().toLowerCase());

  const notas = rows.map((r) => {
    const numerica = parseNumero(r.nota_final);
    return {
      r,
      numerica,
      uc: Number(r.uc) || 0,
      aprobada: flag(r.aprobada),
      cuentaPromedio: flag(r.calculo_promedio) && numerica !== null,
    };
  });

  const materias: MateriaConstancia[] = notas.map(({ r, numerica, uc, aprobada }) => ({
    codigo: r.codigo_asignatura,
    asignatura: r.desc_asignatura,
    nivel: Number(r.nivel) || 0,
    uc,
    periodo_lectivo: String(r.periodo_lectivo ?? ''),
    anno_lectivo: String(r.anno_lectivo ?? ''),
    periodo: `${r.periodo_lectivo}-${r.anno_lectivo}`,
    seccion: r.seccion ?? '',
    nota: numerica === null ? String(r.nota_final ?? '') : formatearNota(numerica),
    nota_letras: numerica === null ? '' : numeroALetras(numerica),
    aprobada: aprobada ? 'SI' : 'NO',
    profesor: r.nombre_profesor ?? '',
    calculo_promedio: '',
  }));

  const totalCreditos = materias.reduce((acc, m) => acc + m.uc, 0);
  const creditosAprobados = notas.reduce((acc, n) => acc + (n.aprobada ? n.uc : 0), 0);

  // Índice académico = promedio ponderado por UC de las notas que cuentan para promedio.
  const contables = notas.filter((n) => n.cuentaPromedio);
  const ucContables = contables.reduce((acc, n) => acc + n.uc, 0);
  const indiceAcademico =
    ucContables > 0 ? contables.reduce((acc, n) => acc + n.numerica! * n.uc, 0) / ucContables : 0;

  const primera = rows[0];
  const ultima = rows[rows.length - 1];

  return {
    nombres: primera.nombres,
    cedula,
    cedula_formateada: formatearCedula(cedula),
    programa: primera.desc_programa,
    programa_codigo: primera.codigo_programa,
    total_asignaturas: materias.length,
    total_creditos: totalCreditos,
    creditos_aprobados: creditosAprobados,
    indice_academico: formatearIndice(indiceAcademico),
    fecha_actual: fechaActualLarga(),
    ultimo_periodo: String(ultima.periodo_lectivo ?? ''),
    profesor_coordinacion: env.PROFESOR_COORDINACION,
    materias,
  };
}
