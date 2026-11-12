import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';
import { env } from '../config/env';
import { ConstanciaData } from './constancia.service';

// Formato de la plantilla Notas.docx: encabezado institucional, tabla con cuadrícula,
// cuadro de totales punteado y nombre de la profesora al pie de la hoja.
const PAGE_WIDTH = 612; // Letter
const PAGE_HEIGHT = 792;

const MARGIN_LEFT = 1701 / 20; // 85.05 pt (3 cm)
const MARGIN_RIGHT = 1701 / 20;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT;

const HEADER_TOP = 36; // el encabezado se repite en cada hoja
const BODY_TOP = 130; // donde empieza el título
const SIGNATURE_Y = PAGE_HEIGHT - 120; // nombre de la profesora, siempre al pie de la última hoja
const TABLE_BOTTOM = PAGE_HEIGHT - 70; // la tabla no pasa de aquí

const FONT = 'Helvetica'; // equivalente a Arial
const FONT_BOLD = 'Helvetica-Bold';
const GRIS = '#808080';

// Anchos de columna como fracción de la tabla (medidos de la plantilla).
const COLUMNAS = [
  { titulo: 'Asignatura', ancho: 0.485 },
  { titulo: 'Niv.', ancho: 0.065 },
  { titulo: 'UC', ancho: 0.067 },
  { titulo: 'Periodo', ancho: 0.099 },
  { titulo: 'Sec.', ancho: 0.072 },
  { titulo: 'Notas', ancho: 0.09 },
  { titulo: 'Notas en letras', ancho: 0.122 },
].map((c) => ({ ...c, ancho: c.ancho * CONTENT_WIDTH }));

const PAD_X = 2;
const PAD_Y = 2;

function leerLogo(ruta: string): Buffer | null {
  const absoluta = path.resolve(ruta);
  if (!fs.existsSync(absoluta)) {
    return null;
  }
  return fs.readFileSync(absoluta);
}

export function generarConstanciaPdf(data: ConstanciaData): Promise<Buffer> {
  return new Promise<Buffer>((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'letter',
      margin: 0,
      bufferPages: true,
      info: {
        Title: `Constancia de Notas - ${data.nombres}`,
        Author: 'FACES - Universidad de Carabobo',
        Subject: 'Constancia de notas de postgrado',
        Creator: 'Sistema de Constancias FACES-UC',
      },
    });

    const partes: Buffer[] = [];
    doc.on('data', (parte: Buffer) => partes.push(parte));
    doc.on('end', () => resolve(Buffer.concat(partes)));
    doc.on('error', reject);

    const logoUC = leerLogo(env.LOGO_UC_PATH);
    const logoPostgrado = leerLogo(env.LOGO_POSTGRADO_PATH);

    // --- Encabezado: escudo UC | texto institucional | logo Postgrado FACES ---
    function dibujarEncabezado(): void {
      const altoEscudo = 62;
      const anchoEscudo = altoEscudo * 0.75; // uc.png es 3:4
      const anchoPostgrado = 105;

      if (logoUC) {
        doc.image(logoUC, MARGIN_LEFT, HEADER_TOP, { width: anchoEscudo, height: altoEscudo });
      }
      if (logoPostgrado) {
        doc.image(logoPostgrado, PAGE_WIDTH - MARGIN_RIGHT - anchoPostgrado, HEADER_TOP + 4, {
          width: anchoPostgrado,
        });
      }

      const textoX = MARGIN_LEFT + anchoEscudo + 6;
      const textoAncho = CONTENT_WIDTH - anchoEscudo - anchoPostgrado - 12;
      doc
        .font(FONT_BOLD)
        .fontSize(8.5)
        .fillColor(GRIS)
        .text(
          'UNIVERSIDAD DE CARABOBO\nFACULTAD DE CIENCIAS ECONÓMICAS Y SOCIALES\nDIRECCIÓN DE ASUNTOS ESTUDIANTILES – POSTGRADO',
          textoX,
          HEADER_TOP + 10,
          { width: textoAncho, align: 'center', lineGap: 3 },
        )
        .fillColor('black');
    }

    // Texto centrado en vertical dentro de una celda con borde.
    function celda(
      texto: string,
      x: number,
      y: number,
      ancho: number,
      alto: number,
      alineacion: 'center' | 'left',
    ): void {
      doc.lineWidth(0.5).rect(x, y, ancho, alto).stroke();
      const altoTexto = doc.heightOfString(texto, { width: ancho - 2 * PAD_X });
      doc.text(texto, x + PAD_X, y + (alto - altoTexto) / 2, {
        width: ancho - 2 * PAD_X,
        align: alineacion,
      });
    }

    function dibujarFila(valores: string[], y: number, negrita: boolean, tamano: number): number {
      doc.font(negrita ? FONT_BOLD : FONT).fontSize(tamano);
      const alto =
        Math.max(
          ...valores.map((v, i) => doc.heightOfString(v, { width: COLUMNAS[i].ancho - 2 * PAD_X })),
        ) +
        2 * PAD_Y;
      let x = MARGIN_LEFT;
      valores.forEach((v, i) => {
        celda(v, x, y, COLUMNAS[i].ancho, alto, 'center');
        x += COLUMNAS[i].ancho;
      });
      return alto;
    }

    dibujarEncabezado();

    // --- Título principal ---
    doc
      .font(FONT_BOLD)
      .fontSize(13)
      .text('REPORTE INTERNO DE NOTAS', MARGIN_LEFT, BODY_TOP, {
        width: CONTENT_WIDTH,
        align: 'center',
      });

    // --- Párrafo introductorio ---
    doc
      .font(FONT)
      .fontSize(11)
      .text(
        `Reporte interno de Notas para la ciudadana ${data.nombres}, titular de la cedula de identidad ${data.cedula_formateada}, cursó las siguientes asignaturas correspondiente al programa:`,
        MARGIN_LEFT,
        doc.y + 14,
        { width: CONTENT_WIDTH, align: 'justify' },
      );

    // --- Programa ---
    doc
      .font(FONT_BOLD)
      .fontSize(13)
      .text(data.programa, MARGIN_LEFT, doc.y + 14, {
        width: CONTENT_WIDTH,
        align: 'center',
      });

    // --- Tabla de materias (el encabezado de la tabla se repite en cada hoja) ---
    let y = doc.y + 14;
    y += dibujarFila(COLUMNAS.map((c) => c.titulo), y, true, 8);

    data.materias.forEach((materia) => {
      const valores = [
        materia.asignatura,
        String(materia.nivel),
        String(materia.uc),
        materia.periodo,
        materia.seccion || '',
        materia.nota,
        materia.nota_letras,
      ];

      // Si la fila no cabe, nueva hoja con encabezado institucional y de tabla.
      doc.font(FONT).fontSize(7.5);
      const altoFila =
        Math.max(
          ...valores.map((v, i) => doc.heightOfString(v, { width: COLUMNAS[i].ancho - 2 * PAD_X })),
        ) +
        2 * PAD_Y;
      if (y + altoFila > TABLE_BOTTOM) {
        doc.addPage();
        dibujarEncabezado();
        y = BODY_TOP;
        y += dibujarFila(COLUMNAS.map((c) => c.titulo), y, true, 8);
      }

      y += dibujarFila(valores, y, false, 7.5);
    });

    // --- Cuadro de totales (punteado, a la derecha) ---
    const filaResumen = 12;
    const resumen = [
      ['Total de créditos Cursados:', String(data.total_creditos)],
      ['Total de créditos Aprobados:', String(data.creditos_aprobados)],
      ['Índice Académico:', data.indice_academico],
    ];
    const cajaAncho = 170;
    const etiquetaAncho = 120;
    const cajaAlto = filaResumen * resumen.length;

    y += 12;
    if (y + cajaAlto > SIGNATURE_Y - 20) {
      doc.addPage();
      dibujarEncabezado();
      y = BODY_TOP;
    }

    const cajaX = MARGIN_LEFT + CONTENT_WIDTH - cajaAncho;
    doc.lineWidth(0.5).dash(2, { space: 2 }).rect(cajaX, y, cajaAncho, cajaAlto).stroke();
    for (let i = 1; i < resumen.length; i += 1) {
      doc
        .moveTo(cajaX, y + i * filaResumen)
        .lineTo(cajaX + cajaAncho, y + i * filaResumen)
        .stroke();
    }
    doc
      .moveTo(cajaX + etiquetaAncho, y)
      .lineTo(cajaX + etiquetaAncho, y + cajaAlto)
      .stroke()
      .undash();

    doc.font(FONT_BOLD).fontSize(8);
    resumen.forEach(([etiqueta, valor], i) => {
      const ty = y + i * filaResumen + 2.5;
      doc.text(etiqueta, cajaX, ty, { width: etiquetaAncho - 4, align: 'right' });
      doc.text(valor, cajaX + etiquetaAncho, ty, {
        width: cajaAncho - etiquetaAncho,
        align: 'center',
      });
    });

    // --- Firma: nombre de la profesora al pie de la última hoja ---
    doc
      .font(FONT_BOLD)
      .fontSize(11)
      .text(data.profesor_coordinacion, MARGIN_LEFT, SIGNATURE_Y, {
        width: CONTENT_WIDTH,
        align: 'center',
      });
    doc
      .fontSize(9)
      .text('Dirección de Asuntos Estudiantiles – Postgrado', MARGIN_LEFT, SIGNATURE_Y + 16, {
        width: CONTENT_WIDTH,
        align: 'center',
      });

    // Número de página discreto al pie
    const totalPages = doc.bufferedPageRange().count;
    for (let i = 0; i < totalPages; i += 1) {
      doc.switchToPage(i);
      doc
        .font(FONT)
        .fontSize(7)
        .text(`Página ${i + 1} de ${totalPages}`, MARGIN_LEFT, PAGE_HEIGHT - 35, {
          width: CONTENT_WIDTH,
          align: 'center',
        });
    }

    doc.end();
  });
}
