# PROGRESO — cola de tareas

Estado al 2026-11-11. Una tarea por sesión, en orden.

## Hecho
- [x] Sistema de constancias funcionando (auth, usuarios, consultas, constancias .docx/PDF).
- [x] Repo organizado según la estructura estándar (docs/, database/, AGENTS.md, colas).
- [x] C-01 · Contrato de línea base v0.1.0 (2026-11-11).
- [x] C-02a · Validación contra el contrato en modo aviso (2026-11-11).
- [x] U-01 · `PRODUCT.md` creado con `/impeccable init` (2026-11-11).
- [x] U-02 · `DESIGN.md` + `.impeccable/design.json` con `/impeccable document` (2026-11-11).
- [x] U-03 · Crítica de DashboardPage: 23/40, 2 P1 (2026-11-11), anotada en `frontend/PROGRESO.md`.
- [x] U-04 · Crítica de UsuariosPage: 20/40, 2 P1 (2026-11-11), anotada en `frontend/PROGRESO.md`.
- [x] U-05 · Crítica de LoginPage y CorreoPages: 24/40, 3 P1 (2026-11-11), anotada en `frontend/PROGRESO.md`.
- [x] U-06 · Auditoría de `frontend/src`: 12/20, 3 P1 (2026-11-11). Fase 1 completa.
- [x] U-08 · distill de `UsuariosPage` (2026-11-11): 523 → 223 líneas, crear/editar/listar separados.
- [x] U-09 · layout de `DashboardPage` (2026-11-11): acciones junto al estudiante, Imprimir primario.
- [x] U-10 · typeset de `frontend/src` (2026-11-11): tabulares, sin `font-black` ni texto <12 px; Inter instalada y cargada desde el propio sitio.
- [x] U-11 · clarify de `frontend/src` (2026-11-11): textos de login, correo, roles y errores.
- [x] U-12a · harden parte 1 (2026-11-11): sesión expirada, enlaces de correo, foco del login y de la búsqueda.
- [x] U-12b · harden de `UsuariosPage` (2026-11-11): propia fila, confirmación propia, diálogo accesible, correo opcional.
- [x] U-13 · onboard de `DashboardPage` (2026-11-11): sin tarjeta de estado vacío; "sin resultados" con recuperación.
- [x] U-14 · adapt de `PrintConstanciaPage` (2026-11-11): hoja carta y márgenes de la plantilla, logos cargados, barra solo en pantalla.
- [x] U-15 · adapt de login y dashboard en móvil y tablet (2026-11-11): sin scroll horizontal a 375 px (medido), nombre completo, nota visible, 44 px táctiles.
- [x] U-16 · animate de `frontend/src` (2026-11-11): sin animaciones infinitas ni escalonadas; `prefers-reduced-motion` respetado (medido).
- [x] U-17 · delight de `DashboardPage` (2026-11-11): confirmación de constancia generada junto a los botones, con el check trazado una vez.
- [x] U-18 · colorize (2026-11-11): colores de estado separados del vinotinto; contraste de estados verificado.
- [x] U-19 · extract (2026-11-11): `Spinner`, `Aviso`, `Chip`, `.btn-text` y token `papel`.
- [x] U-20 · document (2026-11-11): `DESIGN.md` y su sidecar refrescados con el sistema resultante.
- [x] U-21 · optimize (2026-11-11): descartada con medición; sin lentitud (login 117 ms, bundle 66 KB gzip, 40 filas en 275 ms).
- [x] ROOT sin cédula y sin admin por defecto (2026-11-12): contrato v0.2.0 (`cedula` nula), seed solo del ROOT por correo, admin 12345678 borrado; cabeceras con correo y rol.
- [x] README actualizado (2026-11-12): SUCAI como MySQL externo, ROOT por correo, rutas reales y guía de despliegue en VPS (§10).

- [x] U-22a · polish de Login (2026-11-11): panel plano, logos legibles, sombras y blur fuera.
- [x] U-22b · polish de Panel (2026-11-11): contraste de texto y placeholders, foco que no se pierde al buscar, sin avatar.
- [x] U-22c · polish de Usuarios (2026-11-11): diálogo alcanzable en pantallas bajas, reintento si falla la carga, cédulas con formato.
- [x] U-22d · polish de Correo (2026-11-11): logos, enlace vencido con salida clara, campos agrupados. **U-22 completa.**

## En curso
- **C-02b · Convertir la deriva en tareas** — tras usar la app con C-02a, cada línea
  `[contrato]` distinta pasa a tarea (`plans/C-02b.md`).

## Pendiente
3. **C-03 · Tipos del frontend desde el contrato** — `openapi-typescript` y migrar
   `frontend/src/api/client.ts`.
4. **D-01 · Decidir el destino de `backend/templates/Notas.docx.bak`** (está versionado pese a
   `.gitignore`).

### Diseño (UX) — independiente del contrato
Mejorar el diseño con `/impeccable` para que sea más intuitivo y elegante. Es solo presentación:
**no cambia llamadas a la API**. Si una tarea necesita un endpoint o un campo nuevo, se detiene
y antes se crea una tarea de contrato. Modo *Operate*: herramienta institucional, sin `bolder`
ni `overdrive`. Las fases 0 y 1 son obligatorias; desde la 2, cada tarea se confirma o
se descarta según lo que encuentren U-03…U-06. Para todas, salvo U-01 a U-06: Hecho cuando
`cd frontend && npm run build` pasa, además del criterio propio.

**Fase 0 · Contexto**
- ~~U-01~~ · `/impeccable init` → `PRODUCT.md` (usuarios ROOT/ADMIN de postgrado, tarea
  cédula → constancia, tono institucional). Hecho cuando: existe `PRODUCT.md`.
- ~~U-02~~ · `/impeccable document` → `DESIGN.md` desde el sistema actual (`vinotinto`, Inter,
  logos). Leer: `frontend/tailwind.config.js`, `frontend/src/index.css`. Hecho cuando: existe `DESIGN.md`.

**Fase 1 · Evaluar (sin tocar código)**
- ~~U-03~~ · `/impeccable critique frontend/src/pages/DashboardPage.tsx` — flujo buscar → resumen → notas → imprimir.
- ~~U-04~~ · `/impeccable critique frontend/src/pages/UsuariosPage.tsx` — la pantalla más pesada (523 líneas).
- ~~U-05~~ · `/impeccable critique frontend/src/pages/LoginPage.tsx` — login y flujos de correo (`CorreoPages.tsx`).
- ~~U-06~~ · `/impeccable audit frontend/src` — a11y, contraste del vinotinto, teclado, responsive, impresión.
- Hecho cuando (U-03…U-06): puntuación y problemas P0/P1 anotados en `frontend/PROGRESO.md`.

**Fase 2 · Estructura y claridad**
- ~~U-07~~ · `/impeccable shape` — descartada (2026-11-11): U-03 se resuelve puliendo, sin replantear el flujo.
- ~~U-08~~ · `/impeccable distill frontend/src/pages/UsuariosPage.tsx` — separar crear/editar/listar.
- ~~U-09~~ · `/impeccable layout frontend/src/pages/DashboardPage.tsx` — qué se mira primero entre búsqueda, resumen y tabla.
- ~~U-10~~ · `/impeccable typeset frontend/src` — escala tipográfica y cifras alineadas en `NotesTable.tsx`.
- ~~U-11~~ · `/impeccable clarify frontend/src` — etiquetas, validaciones, errores de login y textos de correo.

**Fase 3 · Robustez**
- ~~U-12b~~ · harden de `UsuariosPage` (hecho).
- ~~U-13~~ · `/impeccable onboard frontend/src/pages/DashboardPage.tsx` — pantalla inicial y "sin resultados".
- ~~U-14~~ · `/impeccable adapt frontend/src/pages/PrintConstanciaPage.tsx` — impresión: página, márgenes, sin UI.
- ~~U-15~~ · `/impeccable adapt frontend/src` — login y dashboard en móvil y tablet. Hecho cuando además: sin scroll horizontal a 375 px.

**Fase 4 · Expresión, con moderación**
- ~~U-16~~ · `/impeccable animate frontend/src` — transiciones discretas; respeta `prefers-reduced-motion`.
- ~~U-17~~ · `/impeccable delight frontend/src` — un solo detalle (confirmación al generar constancia).
- ~~U-18~~ · `/impeccable colorize` — solo colores de estado (aprobado/reprobado/error). `quieter` solo si U-03…U-05 marcan exceso de vinotinto.

**Fase 5 · Sistema**
- ~~U-19~~ · `/impeccable extract frontend/src` — botones, campos, tarjetas y tablas repetidos → `frontend/src/components/`.
- ~~U-20~~ · `/impeccable document` — refrescar `DESIGN.md` con el sistema resultante.

**Fase 6 · Cierre**
- ~~U-21~~ · `/impeccable optimize frontend/src` — solo si hay lentitud medible (tabla de notas, bundle).
- ~~U-22~~ · `/impeccable polish <página>` — hecha en cuatro sesiones (U-22a Login, U-22b Panel, U-22c Usuarios, U-22d Correo).
- U-23 · `/impeccable live` — ajuste fino en el navegador con `cd frontend && npm run dev`.
