---
name: Sistema de Constancias FACES-UC
description: Herramienta institucional sobria para emitir constancias de notas de postgrado.
colors:
  vinotinto-50: "#fbf2f5"
  vinotinto-100: "#f7e4ea"
  vinotinto-200: "#efc9d5"
  vinotinto-300: "#e2a1b6"
  vinotinto-400: "#d06f90"
  vinotinto-500: "#b8436c"
  vinotinto-600: "#9d2f57"
  vinotinto-700: "#7b1e3b"
  vinotinto-800: "#651a32"
  vinotinto-900: "#55182c"
  vinotinto-950: "#300a18"
  papel: "#f7f3f5"
  superficie: "#ffffff"
  tinta: "#0f172a"
  tinta-suave: "#334155"
  tinta-tenue: "#64748b"
  borde: "#cbd5e1"
  borde-tarjeta: "#e2e8f0"
  rol-oscuro: "#1e293b"
  ok: "#047857"
  ok-fondo: "#ecfdf5"
  ok-borde: "#a7f3d0"
  error: "#be123c"
  error-fondo: "#fff1f2"
  error-borde: "#fecdd3"
  aviso: "#92400e"
  aviso-fondo: "#fffbeb"
  aviso-borde: "#fde68a"
typography:
  title:
    fontFamily: "Inter Variable, Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.25
  section:
    fontFamily: "Inter Variable, Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
  body:
    fontFamily: "Inter Variable, Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
  label:
    fontFamily: "Inter Variable, Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
  button:
    fontFamily: "Inter Variable, Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
  meta:
    fontFamily: "Inter Variable, Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
rounded:
  lg: "8px"
  xl: "12px"
  2xl: "16px"
  full: "9999px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "24px"
components:
  button-primary:
    backgroundColor: "{colors.vinotinto-700}"
    textColor: "{colors.superficie}"
    rounded: "{rounded.xl}"
    padding: "12px 20px"
    typography: "{typography.button}"
  button-primary-hover:
    backgroundColor: "{colors.vinotinto-800}"
  button-secondary:
    backgroundColor: "{colors.superficie}"
    textColor: "{colors.tinta-suave}"
    rounded: "{rounded.xl}"
    padding: "10px 16px"
    typography: "{typography.button}"
  button-danger:
    backgroundColor: "{colors.error}"
    textColor: "{colors.superficie}"
    rounded: "{rounded.xl}"
    padding: "10px 16px"
    typography: "{typography.button}"
  button-text:
    textColor: "{colors.tinta-suave}"
    rounded: "{rounded.lg}"
    padding: "6px 10px"
    typography: "{typography.meta}"
  input:
    backgroundColor: "{colors.superficie}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.xl}"
    padding: "12px 16px"
  card:
    backgroundColor: "{colors.superficie}"
    rounded: "{rounded.2xl}"
  chip-ok:
    backgroundColor: "{colors.ok-fondo}"
    textColor: "{colors.ok}"
    rounded: "{rounded.full}"
    padding: "4px 10px"
    typography: "{typography.meta}"
  chip-error:
    backgroundColor: "{colors.error-fondo}"
    textColor: "{colors.error}"
    rounded: "{rounded.full}"
    padding: "4px 10px"
    typography: "{typography.meta}"
  chip-oscuro:
    backgroundColor: "{colors.rol-oscuro}"
    textColor: "{colors.superficie}"
    rounded: "{rounded.full}"
    padding: "4px 10px"
    typography: "{typography.meta}"
  aviso-error:
    backgroundColor: "{colors.error-fondo}"
    textColor: "{colors.error}"
    rounded: "{rounded.xl}"
    padding: "12px 16px"
  aviso-ok:
    backgroundColor: "{colors.ok-fondo}"
    textColor: "{colors.ok}"
    rounded: "{rounded.xl}"
    padding: "12px 16px"
---

# Design System: Sistema de Constancias FACES-UC

## Overview

**Creative North Star: "El Registro Académico"**

Una oficina universitaria bien llevada: papel claro, tinta oscura y un único acento vinotinto. Es una herramienta de trabajo (modo *Operate*) para personal de postgrado en un PC de oficina: el documento oficial es el protagonista, no la pantalla. Densidad media, tarjetas blancas sobre fondo papel, esquinas amplias, sombras suaves y nada que se mueva sin motivo.

El sistema se sostiene en tres separaciones: **marca** (vinotinto) distinta de **estado** (esmeralda, rosa, ámbar), **dato** (cifras tabulares) distinto de **decoración** (ninguna) y **movimiento** que comunica distinto de movimiento que adorna (solo el primero existe).

**Key Characteristics:**
- Un solo acento (vinotinto) para acciones, foco e identidad; los estados tienen sus propios colores.
- Neutros slate sobre papel rosado; sin gradientes ni decoración en el flujo de trabajo.
- Inter Variable en toda la interfaz, en español, con cifras tabulares en los datos.
- Logos institucionales (UC y FACES Postgrado) como sello de identidad.
- Una constancia equivocada es el costo mayor: las acciones destructivas se separan y se confirman.

## Colors

Vinotinto institucional sobre neutros fríos; el fondo rosado casi blanco da calidez.

### Primary
- **Vinotinto Institucional** (#7b1e3b, `vinotinto-700`): botón primario, enlaces de acción, marca. Hover `vinotinto-800` (#651a32).
- **Vinotinto de foco** (#9d2f57, `vinotinto-600`): anillo de foco (7,05:1 sobre blanco) y borde de campo activo.
- **Rampa vinotinto** (50 #fbf2f5 … 950 #300a18): cabeceras de tabla, hover de filas y chip de marca.

### Neutral
- **Papel** (#f7f3f5, token `papel` → `bg-papel`): fondo de página.
- **Superficie** (#ffffff): tarjetas y campos.
- **Tinta** (#0f172a): texto principal; **tinta suave** (#334155) para etiquetas; **tinta tenue** (#64748b, 4,76:1 sobre blanco pero 4,33:1 sobre papel) como mínimo para texto secundario **sobre blanco**; el texto que va directo sobre el papel usa slate-600 (6,89:1). Los placeholders y los íconos de acción usan slate-500, nunca slate-400.
- **Borde** (#cbd5e1 en campos y botones; #e2e8f0 en tarjetas).
- **Rol oscuro** (#1e293b): chip ROOT.

### Estado
Contraste medido contra su fondo (mínimo AA 4,5:1):
- **Bien / aprobada / activo:** esmeralda #047857 sobre #ecfdf5 (5,21:1); texto de aviso #065f46 (7,29:1).
- **Error / reprobada / peligro:** rosa #be123c sobre #fff1f2 (5,72:1); blanco sobre #be123c en `.btn-danger` (6,29:1).
- **Aviso (p. ej. sesión vencida):** ámbar #92400e sobre #fffbeb (6,84:1).
- **Inactivo / neutro:** slate-600 sobre slate-100 (6,92:1). `slate-400` no se usa para texto (2,56:1).

### Named Rules
**The One Voice Rule.** El vinotinto marca acciones e identidad; no se usa como relleno de grandes superficies ni como estado.
**The Status Apart Rule.** Aprobado, reprobado, error, éxito y aviso usan esmeralda, rosa y ámbar, nunca el vinotinto. El color nunca es la única señal: el estado también se escribe ("Reprobada").

## Typography

**Font:** Inter Variable, servida desde el propio sitio con `@fontsource-variable/inter` (importada en `main.tsx`), con Inter y la fuente del sistema como respaldo. Una sola familia.

**Character:** Neutral y legible; la jerarquía se hace con peso y tamaño, no con familias.

### Hierarchy
- **Title** (700, 1.5rem → 1.875rem desde `sm`, 1.25): título de página (`h1`).
- **Section** (600, 1rem): título de tarjeta o sección (`h2`). Los `h3` sueltos no se usan.
- **Body** (400, 0.875rem): contenido y celdas. Los campos de formulario usan 1rem.
- **Label** (500, 0.875rem): etiquetas de campo (`.label`).
- **Button** (600, 0.875rem): botones.
- **Meta** (500, 0.75rem): ayudas, chips y pies. **Suelo de 12 px**: no se usa texto menor.

### Named Rules
**The Three Weights Rule.** Solo 500, 600 y 700; `font-black` no existe en este sistema.
**The Tabular Rule.** Todo número que se compara o se alinea (UC, período, sección, nota, cifras del resumen) lleva `tabular-nums`.

## Layout

Contenedor centrado de 6xl en escritorio, flujo vertical. **Panel:** buscar → *expediente con sus acciones* → notas: las acciones (Imprimir, PDF, Word) viven en la tarjeta del estudiante, junto a su nombre, y la confirmación de "constancia generada" aparece debajo de ellas. Espaciado en múltiplos de 4/8 px.

**Login:** desde `lg` dos columnas: panel vinotinto plano (logos sobre pastilla blanca, titular, una frase y "Uso exclusivo del personal autorizado") y formulario; en móvil, solo el formulario con los logos arriba.

Rutas: `/login`, correo (`/olvide`, `/restablecer`, `/confirmar-eliminacion`), panel, `/usuarios` (solo ROOT) y la vista de impresión.

**Responsive (medido sin scroll horizontal a 375, 768 y 1280 px):**
- Tabla de notas: desde `md` se ven Código, Período y Sección; en móvil quedan Asignatura, UC, Nota y Estado.
- Encabezado: los logos secundarios aparecen desde `lg`; los botones del encabezado miden 44 px mínimo hasta `lg`.
- El nombre del estudiante salta de línea; nunca se trunca.

**Impresión:** hoja carta con los márgenes de la plantilla Word (2,5 cm arriba y abajo, 3 cm a los lados) dados por `@page`; filas sin cortarse entre hojas; la barra "Volver / Imprimir de nuevo" solo existe en pantalla.

## Elevation & Depth

Tonal y contenido: tarjetas con borde slate-200 y `shadow-sm` en reposo; la sombra mayor (`shadow-2xl`) es solo del diálogo.

### Named Rules
**The Quiet Shadow Rule.** La sombra separa capas, nunca decora; sin sombras de color en el flujo de trabajo.

## Shapes

Esquinas amplias y amables: campos y botones `rounded-xl` (12px), tarjetas `rounded-2xl` (16px), chips `rounded-full`, acciones de texto `rounded-lg` (8px). Bordes de 1px.

## Components

### Buttons
- **Primary (`.btn-primary`):** vinotinto-700, texto blanco, 12×20px, `rounded-xl`; hover vinotinto-800; foco `ring-4 vinotinto-600/20`. **Una por pantalla**: en el panel es Imprimir.
- **Secondary (`.btn-secondary`):** blanco, borde slate-300, texto slate-700; PDF y Word.
- **Danger (`.btn-danger`):** rosa-700; solo para confirmar una eliminación.
- **Text (`.btn-text`):** acción de fila (Editar, Activar/Desactivar), `text-xs`; el color lo da el uso.
- **Estados:** deshabilitado a 50–60 % de opacidad; en curso muestra `Spinner`.

### Inputs / Fields
- Blanco, borde slate-300, `rounded-xl`, 12×16px, `shadow-sm`; foco: borde vinotinto-600 + `ring-4 vinotinto-600/10`. Etiqueta arriba (`.label`); el correo y la contraseña opcionales lo dicen en la etiqueta. El error de la búsqueda de cédula se enlaza con `aria-invalid` y `aria-describedby`.

### Cards / Containers
- Blanco, borde slate-200, `rounded-2xl`, `shadow-sm` (`.card`). Nunca tarjetas dentro de tarjetas.

### Chip (`Chip`)
- `ok`, `error`, `neutro`, `oscuro` (ROOT) y `marca`: `rounded-full`, 4×10px, `text-xs font-semibold`, `ring-1` interior. Aprobada/Reprobada, Activo/Inactivo, rol y "N registros".

### Aviso (`Aviso`)
- Bloque `rounded-xl` con borde, tono `error` (rosa, `role="alert"`), `ok` (esmeralda) o `info` (ámbar), ambos `role="status"`. Un mensaje, una vez.

### Diálogo (`UsuarioDialogo`)
- `role="dialog"` y `aria-modal`, foco inicial en el primer campo editable, Tab atrapado, Esc cierra y el foco vuelve a quien lo abrió. La eliminación se confirma dentro del diálogo y se separa de Guardar.

### Tablas
- Cabecera `vinotinto-50` con texto vinotinto-800 y `scope="col"`; filas con `divide-slate-100`; cifras tabulares; contenedor con `overflow-x-auto`. Reprobada: nota en rosa-700 **y** chip "Reprobada".

### Expediente del estudiante (`StudentSummary`)
- Tarjeta blanca: nombre (`h2`), cédula y programa, acciones a la derecha, confirmación debajo y cuatro cifras en una fila. Sin avatar ni gradiente.

### Movimiento
- Entradas de 0,25 s (`fade-in`, `fade-up`), el check de confirmación se traza una vez (0,35 s) y `Spinner` para cargas. Todo lo demás está quieto.
- Con `prefers-reduced-motion: reduce`, las entradas son instantáneas y el check aparece dibujado; el `Spinner` sigue, porque comunica estado.

### Logos
- `InstitutionLogos`: UC y FACES Postgrado desde `/logos`. Los logos están hechos para fondo claro: sobre vinotinto van dentro de una pastilla blanca.

## Do's and Don'ts

### Do:
- **Do** usar `.btn-*`, `.input`, `.card`, `.label`, `Aviso`, `Chip` y `Spinner` antes de inventar estilos.
- **Do** reservar el vinotinto para acción e identidad, y esmeralda, rosa y ámbar para estados.
- **Do** mantener el foco visible (`:focus-visible` con anillo vinotinto-600) y probar el teclado.
- **Do** escribir el estado con palabras además de color.
- **Do** mostrar cédulas y notas solo cuando hacen falta.

### Don't:
- **Don't** usar gradientes, manchas con blur ni animaciones infinitas, ni en el login.
- **Don't** usar `font-black`, texto menor de 12 px ni `slate-400` para texto.
- **Don't** poner Desactivar o Eliminar junto a la acción habitual sin separación ni confirmación.
- **Don't** rediseñar el documento de la constancia: sale de la plantilla Word.
- **Don't** introducir colores literales (`bg-[#…]`): añadir un token.
