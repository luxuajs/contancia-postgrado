# frontend — estado

SPA React + Vite + Tailwind; cliente HTTP en `src/api/client.ts` con tipos escritos a mano.
Pasará a tipos generados del contrato (`../PROGRESO.md`, C-03).

Diseño: `PRODUCT.md` (U-01) y `DESIGN.md` (U-02, refrescado en U-20) en la raíz; `.impeccable/design.json` es su sidecar. Plan de mejora con `/impeccable` en
`../PROGRESO.md` § Diseño (U-01…U-23). Los resultados de critique y audit (U-03…U-06) se anotan aquí.

## Críticas de diseño

### U-03 · DashboardPage (2026-11-11) — 23/40
- **P1** Acciones desconectadas del estudiante: mostrar nombre y cédula junto a los botones; limpiar o marcar desactualizado el resultado al cambiar la cédula; deshabilitar sin materias → `harden`, `clarify`.
- **P1** Sin acción primaria; tres estilos de botón, gradiente y sombra de color contra `DESIGN.md` → `quieter`, `polish`.
- **P2** Héroe con gradiente en `StudentSummary` compite con el documento → `distill`, `quieter`.
- **P2** Teclado: sin `autoFocus` en `#cedula`, sin foco tras buscar, error sin `aria-describedby`; falta "Nueva búsqueda" → `harden`.
- **P3** Estado vacío y pie pesados → `distill`/`onboard`.
- Detector: 0 hallazgos (solo estático; sin revisión en navegador). Informe en `.impeccable/critique/`.
- Decisiones tras U-03: acción primaria = **Imprimir** (PDF y Word secundarias); no se replantea el flujo (U-07 descartada).

### U-04 · UsuariosPage (2026-11-11) — 20/40
- **P1** Eliminar/Desactivar sin salvaguardas: se podría actuar sobre la propia cuenta o el último ROOT (verificar si el backend ya lo impide); botones pegados; `window.confirm` y sin estado de carga → `harden`, `clarify`.
- **P1** Editar exige reescribir el correo (arranca vacío y es obligatorio). Si la API no lo devuelve, hacerlo opcional; si toca el contrato, **parar** y abrir tarea de contrato → `clarify`, `harden`.
- **P2** Modal sin `role="dialog"`, foco inicial, Esc ni retorno de foco; botones de fila sin nombre accesible → `harden`.
- **P2** Roles ROOT/ADMIN sin explicar; sin búsqueda; lista de cédulas siempre completa → `clarify`, `layout`.
- **P3** Vinotinto usado como estado (chip ROOT, banner de éxito) contra `DESIGN.md` → `quieter`, `colorize`.
- Detector: 0 hallazgos (solo estático). Informe en `.impeccable/critique/`.
- Verificado en backend (`usuario.service.ts` l.94-97, 134-143): ya bloquea eliminar la propia cuenta y dejar sin ROOT activo (eliminar, quitar rol, desactivar). El P1 de U-04 es solo de interfaz: reflejar esas reglas (ocultar/deshabilitar acciones sobre la propia fila) y traducir el error. Sin cambio de contrato.

### U-05 · LoginPage + CorreoPages (2026-11-11) — 24/40
- **P1** Panel izquierdo del login decorativo (degradado animado, blur, 3 tarjetas de marketing) contra `DESIGN.md` → `distill`, `quieter`.
- **P1** `/restablecer` sin `token` o con enlace vencido: avisar de entrada y ofrecer "Solicitar un enlace nuevo" (`/olvide`), sin cambiar llamadas → `harden`.
- **P1** `/confirmar-eliminacion`: acción irreversible con botón vinotinto igual a "Guardar"; estilo de peligro con color de estado, "Cancelar" separado. Mostrar a quién se elimina solo si la API ya lo devuelve; si no, **parar** y abrir tarea de contrato → `harden`, `colorize`.
- **P2** `animate-pulse` permanente en el botón de entrar → `quieter`.
- **P2** Error crudo de la API, sin foco ni `aria-describedby`; `role="alert"` también en éxito; falta pista de clave mínima (6) → `clarify`.
- Menores: placeholder con Gmail real, `font-black`, `bg-[#f7f3f5]` literal, logos duplicados en `LoginPage` (usar `InstitutionLogos`), correo sin logos.
- Detector: 0 hallazgos (solo estático). Informe en `.impeccable/critique/`.
- Decisión tras U-05: panel izquierdo del login = **panel plano sobrio** (vinotinto plano, logos, titular y pie; sin tarjetas ni animaciones).

### U-06 · Auditoría de frontend/src (2026-11-11) — 12/20 (Aceptable)
Accesibilidad 2 · Rendimiento 3 · Responsive 3 · Theming 2 · Integridad 2. Detector: 0 hallazgos. Responsive e impresión sin verificar en navegador.
- **P1** Animaciones infinitas (`animate-float` ×4, `animate-gradient` ×3, `animate-pulse` ×1) sin `motion-reduce` → `quieter`, `animate` (U-16).
- **P1** `text-slate-400` (5 usos): 2,56:1 sobre blanco, falla AA → `polish`.
- **P1** Modal de usuarios sin `role="dialog"`/foco (de U-04) → `harden` (U-12).
- **P2** `text-xs` ×23, `text-[10px]`, `text-[11px]` → `typeset` (U-10). `<th>` sin `scope` (24) → `harden`. `focus:` en vez de `focus-visible:` en botones del dashboard → `harden`.
- **P2** `#f7f3f5` literal en 6 sitios; falta token `papel-rosado` en `tailwind.config.js`; botones del dashboard sin `.btn-*` → `extract` (U-19).
- **P2** `p-x-[0.58in]` en `PrintConstanciaPage.tsx` no es una clase válida de Tailwind; comprobar el margen real contra la plantilla → `adapt` (U-14).
- **P3** Rutas sin `React.lazy` (solo si hay lentitud, U-21).
- Bien: `lang="es"`, 12/12 `<img>` con `alt`, 12/12 campos con etiqueta, vinotinto-700 10,04:1, anillo de foco 7,05:1, 3 dependencias.

### U-08 · distill UsuariosPage (2026-11-11)
`UsuariosPage.tsx` 523 → 223 líneas; separado en `components/UsuariosTabla.tsx` (listar) y `components/UsuarioDialogo.tsx` (crear/editar). Sin cambios en llamadas a la API.
- Quitado: cabecera duplicada de la tarjeta ("Cuentas registradas" + subtítulo + chip, ahora "N cuentas" bajo el título), subtítulo redundante, "Creado el…" por fila, `backdrop-blur`, "ROOT ·" del encabezado, error duplicado (página y diálogo), código muerto de contraseña, checkbox "Usuario activo" del diálogo (el estado se cambia desde la fila).
- Movido: **Eliminar** sale de la fila al diálogo de edición, separado de Guardar.
- Crear no pide contraseña y avisa de la invitación por correo; editar la deja opcional.
- Pendiente (no hecho aquí): salvaguardas de la propia fila, diálogo propio en vez de `window.confirm`, correo opcional al editar, `role="dialog"`/foco/Esc → U-12; chip ROOT y banner en vinotinto → U-18.
- Verificado: `npm run build` pasa y el detector da 0 hallazgos. No probado en navegador.

### U-09 · layout DashboardPage (2026-11-11)
Orden de lectura: buscar → **expediente con sus acciones** → notas. Antes eran cuatro bloques (héroe, estadísticas, tarjeta de acciones, tabla); ahora son tres. Sin cambios en llamadas a la API.
- `StudentSummary` ya no es un héroe con gradiente y avatar: es una tarjeta blanca con nombre, cédula y programa, y las acciones a la derecha (`children`); las 4 estadísticas quedan como fila compacta debajo.
- Quitada la tarjeta "Constancia lista para generar" (ícono, párrafo, nombre de archivo).
- Botones: **Imprimir** = `.btn-primary` y va primero en el orden de tabulación; PDF y Word = `.btn-secondary`. Sin gradiente ni sombra de color; íconos fuera, el spinner se mantiene.
- Cierra parte de los P1/P2 de U-03 (acciones junto al estudiante, acción primaria, héroe). Pendiente: resultado viejo al editar la cédula, `autoFocus`, "Nueva búsqueda" → U-12; estado vacío → U-13.
- Verificado: `npm run build` pasa y el detector (`--scope layout`) da 0 hallazgos. No probado en navegador.

### U-10 · typeset frontend/src (2026-11-11)
Escala de roles (solo Inter/system-ui, sin segunda familia): título `text-2xl/3xl font-bold`, sección `text-base font-semibold`, cuerpo `text-sm`, metadato `text-xs`. Pesos 500/600/700.
- `font-black` (×3) → `font-bold`; `text-[10px]` y `text-[11px]` → `text-xs` (suelo de 12 px).
- `tabular-nums` en UC, período, sección y nota de `NotesTable` y en las 4 cifras de `StudentSummary`.
- Jerarquía de títulos: los `h3` sueltos (estado vacío, "Expediente de notas") pasan a `h2` bajo el `h1`.
- **Inter no se cargaba** (solo estaba declarada). Decidido con el usuario: instalada `@fontsource-variable/inter`, importada en `src/main.tsx` y añadida como `Inter Variable` en `tailwind.config.js`. Se sirve desde el propio sitio; el navegador solo descarga los subconjuntos que usa (latin y latin-ext cubren el español).
- Fuera de alcance: `text-xs` ×23 restantes son metadatos (válidos); la escala `pt` de `PrintConstanciaPage` es del documento (U-14); `slate-400` → U-22.
- Verificado: `npm run build` pasa y el detector `--scope type` da 0 hallazgos. No probado en navegador.

### U-11 · clarify frontend/src (2026-11-11)
Solo textos; sin cambios de comportamiento ni de API.
- Login: el placeholder ya no expone un Gmail real (`nombre@uc.edu.ve`); se quitó el placeholder que repetía la etiqueta de contraseña; un 401 muestra "La cédula, el correo o la contraseña no son correctos. Revise los datos o recupere su contraseña." en vez de "Credenciales inválidas"; validación más corta.
- Correo: "Correo electrónico registrado"; aviso de éxito suma "revise la carpeta de correo no deseado"; pista "mínimo 6 caracteres" en la etiqueta de la nueva contraseña; la confirmación dice que la eliminación es definitiva y el botón es "Eliminar usuario" (sin "Sí"); error genérico con recuperación.
- Dashboard: introducción en una línea. `NotesTable`: se quitó el subtítulo redundante y "UC" lleva `abbr` "Unidades de crédito".
- Usuarios: opciones de rol explican qué hace cada una; el error de correo ya no habla de SMTP ("Avise a soporte técnico"); el `confirm` de eliminar se lee natural.
- No incluido (U-12): enlace vencido o sin token en `/restablecer`, foco tras error, `role="status"` en éxitos, mostrar a quién se elimina (requiere API).
- Verificado: `npm run build` pasa y el detector da 0 hallazgos. No probado en navegador.

### U-12a · harden (parte 1) frontend/src (2026-11-11)
Sin cambios de contrato: todo usa respuestas que la API ya devuelve.
- **Sesión expirada:** un 401 fuera del login (`peticionJson` y `descargarConstancia`) llama a `alSesionExpirada` → `AuthProvider` cierra la sesión y `ProtectedRoute` redirige a `/login`, donde `LoginForm` muestra "Su sesión venció. Inicie sesión de nuevo para continuar." (`aviso` en `useAuth`).
- **Servidor caído:** el mensaje de red ya no habla del backend ("Revise su conexión… avise a soporte técnico").
- **Enlaces de correo:** `/restablecer` y `/confirmar-eliminacion` sin `token` muestran "enlace incompleto" con salida (`/olvide` o `/usuarios`); si la API responde "venció", se ofrece pedir otro. Los avisos de éxito usan `role="status"`.
- **Login:** tras un error el foco vuelve al campo a corregir (contraseña seleccionada).
- **Panel:** al editar la cédula se descarta el expediente anterior (no se puede generar para otro estudiante); el campo tiene `autoFocus`, selecciona al enfocar y enlaza el error con `aria-invalid`/`aria-describedby`. Cédula inexistente ya estaba cubierta por el mensaje 404 del backend.
- Verificado: `npm run build` pasa y el detector da 0 hallazgos. No probado en navegador (la sesión vencida y los enlaces requieren backend).

**U-12b (pendiente) · harden de `UsuariosPage`:** ocultar o deshabilitar Desactivar/Eliminar sobre la propia fila (el backend ya lo bloquea); deshabilitar Eliminar mientras la solicitud está en vuelo y reemplazar `window.confirm` por un diálogo propio; `role="dialog"`, `aria-modal`, foco inicial, Esc y retorno de foco; nombres accesibles en los botones de fila; correo opcional al editar (solo si la API lo permite sin cambiar el contrato); `<th scope>` en las tablas.

### U-12b · harden de UsuariosPage (2026-11-11)
Sin cambios de contrato: el PATCH ya acepta `email` ausente (el cambio de estado desde la fila envía solo `activo`).
- **Propia cuenta:** Desactivar queda deshabilitado en su fila (con aviso) y "Eliminar usuario" no aparece en su diálogo. El backend sigue siendo la barrera real (ya bloqueaba la autoeliminación y dejar sin ROOT).
- **Eliminar:** `window.confirm` reemplazado por una confirmación dentro del diálogo ("se enviará un correo a su cuenta… no se elimina hasta que usted lo confirme"), con botón "Enviar correo de confirmación" y "No eliminar", ambos deshabilitados mientras la solicitud está en vuelo (ya no se duplican correos). Nueva clase `.btn-danger` (rose, color de estado) en `index.css`; también la usa `/confirmar-eliminacion`.
- **Diálogo:** `role="dialog"`, `aria-modal`, `aria-labelledby`, foco inicial en el primer campo editable, Tab atrapado, Esc cierra, el foco vuelve al botón que lo abrió, el botón de cerrar (`slate-500`, antes `slate-400`) se deshabilita mientras guarda.
- **Editar:** el correo es opcional (solo se valida y envía si se escribe); etiqueta "solo si desea cambiarlo".
- **Tabla:** `scope="col"` en las cabeceras y nombre accesible en cada botón de fila ("Editar a …").
- Fuera de alcance: degradar al último ROOT desde el rol (lo bloquea el backend; el error se muestra en el diálogo), búsqueda, enmascarar cédulas.
- Verificado: `npm run build` pasa y el detector da 0 hallazgos. No probado en navegador (diálogo, foco y Esc sin verificar a mano).

### U-13 · onboard DashboardPage (2026-11-11)
Decisión: para quien usa la pantalla a diario, la mejor pantalla inicial es la que no estorba.
- **Pantalla inicial:** se eliminó la tarjeta de estado vacío (ícono, título y párrafo). La orientación queda en el subtítulo, el campo con foco, el ejemplo del placeholder y la línea de formato de `SearchBar`; cada cosa se dice una vez.
- **Sin resultados:** antes el error de "no se encontró" convivía con "Aún no hay un estudiante seleccionado". Ahora solo aparece el aviso, y con recuperación: "No se encontró un estudiante con la cédula V-… Verifique el número e intente de nuevo." (el campo queda enfocado y seleccionado, de U-12a).
- Pendiente de decisión del negocio (no hecho): ¿se debe impedir generar la constancia de un estudiante sin notas? Hoy `NotesTable` avisa "no tiene notas registradas" pero los botones siguen activos.
- Verificado: `npm run build` pasa y el detector da 0 hallazgos. No probado en navegador.

### U-14 · adapt PrintConstanciaPage (2026-11-11)
Sin cambios de API. La vista de impresión es la única que se imprime.
- **Página:** `@page` era A4 con margen 0, pero la hoja y la plantilla son carta (`Notas.docx`: 12240×15840 twips) y el PDF del backend también (`size: 'letter'`): el contenido de 8,5 in no cabía en A4. Ahora `@page { size: letter; margin: 0.98in 1.18in }`.
- **Márgenes:** el comentario decía "márgenes exactos de la plantilla", pero se usaban 0,79 in por lado y `p-x-[0.58in]` no era una clase válida (no hacía nada). La plantilla Word usa 2,5 cm arriba/abajo y 3 cm a los lados; se igualó (decisión del usuario). Al imprimir los da `@page` (se repiten en cada hoja, antes el padding solo valía en la primera) y el padding se anula con `print:p-0`.
- **Saltos:** filas de la tabla y tabla resumen con `break-inside-avoid` (una fila no se parte entre hojas); la cabecera de la tabla se repite en cada hoja.
- **Logos:** se imprime cuando las imágenes ya cargaron (`img.decode()`), no a los 700 ms fijos.
- **Sin interfaz al imprimir:** barra "Volver al panel" / "Imprimir de nuevo" solo en pantalla (`print:hidden`); antes, al cerrar el diálogo, el usuario quedaba sin salida.
- Efecto a vigilar: el texto es más angosto (6,14 in) y un expediente con muchas asignaturas puede pasar a dos hojas. Comparar con un `.docx` real antes de dar por buena la impresión.
- Verificado: `npm run build` pasa y el detector da 0 hallazgos. No probado imprimiendo (necesita backend con datos).

### U-15 · adapt login y dashboard en móvil y tablet (2026-11-11)
Medido en Chrome sin interfaz (Playwright, datos simulados con 8 asignaturas largas y nombres largos) a 375, 768 y 1280 px sobre login, `/olvide`, dashboard con resultado, usuarios y su diálogo: **15/15 sin scroll horizontal** (`scrollWidth == innerWidth`, antes y después de los cambios). También se miró la captura a 375 y 768.
- **Nombre del estudiante:** `truncate` cortaba "MARÍA ALEJANDRA FERNÁ…"; ahora salta de línea (es el dato que identifica la constancia).
- **Tabla de notas a 375 px:** Nota y Estado quedaban fuera de vista (había que desplazar la tabla). Ahora Código, Período y Sección aparecen desde `md`; en móvil quedan Asignatura, UC, Nota y Estado, con menos padding; la tabla cabe en su contenedor (341/341).
- **Tablet (768):** el encabezado se apretaba (logos y "FACES · UC" partido en dos líneas). Los logos secundarios aparecen desde `lg` y el título no se parte.
- **Táctil:** botones del encabezado (Panel, Usuarios, Salir) de 44 px mínimo hasta `lg`.
- Sin cambios en llamadas a la API. No probado en un teléfono real ni en Safari/iOS. Las acciones de fila de Usuarios siguen siendo pequeñas (`text-xs`): pantalla de escritorio de ROOT, no se tocó.
- Verificado: `npm run build` pasa y el detector da 0 hallazgos.

### U-16 · animate frontend/src (2026-11-11)
Criterio: la animación solo comunica un cambio de estado; nada se mueve en reposo. Sin cambios de API.
- **Quitado (decoración):** `animate-gradient` (×2), `animate-float` (×3), `animate-pulse` del botón de entrar, `animate-slide-up` con retardos escalonados de 250 a 700 ms (×5) y la doble entrada anidada del formulario; también sus `@keyframes` en `index.css` (slideUp, gradient-move, float). Los retardos además provocaban un parpadeo (el elemento se veía y luego arrancaba desde opacidad 0).
- **Se mantiene (un solo momento):** `fade-in` de 0,25 s al cargar el formulario de login (antes 0,7 s); `fade-up` de 0,25 s en el resultado del panel y en los avisos; `animate-spin` en cargas; transiciones de 150 ms al pasar el ratón.
- **`prefers-reduced-motion: reduce`:** las entradas pasan a ser instantáneas (`animation: none`); los indicadores de carga siguen girando porque comunican estado. No se anulan las transiciones de forma global.
- Medido en Chrome con `document.getAnimations()` en `/login`: normal → 1 animación de entrada (250 ms, 1 iteración) y transiciones de 150 ms, **ninguna infinita**; con movimiento reducido → ninguna.
- El panel izquierdo del login queda estático (degradado y manchas sin movimiento); su rediseño plano es decisión de U-22.
- Verificado: `npm run build` pasa y el detector da 0 hallazgos.

### U-17 · delight, confirmación al generar la constancia (2026-11-11)
Un solo detalle, sin cambios de API: cuando PDF o Word se guarda, aparece una fila de confirmación **dentro de la tarjeta del estudiante, debajo de sus botones**, y el check se traza una vez (0,35 s).
- Antes el aviso era un banner vinotinto sobre la tarjeta con el nombre de archivo en `break-all`, lejos de los botones y fuera de vista en móvil. Ahora: verde (color de estado, no la marca), texto "Constancia generada en PDF." más el nombre del archivo en monoespaciado.
- Desaparece al buscar otra cédula o al editarla (de U-12a) y no aparece si se cancela el diálogo de guardado. Imprimir no muestra confirmación (abre la vista de impresión).
- `prefers-reduced-motion`: el check se muestra ya dibujado, sin animación.
- Medido en Chrome (descarga simulada): aparece un `role="status"` con el texto esperado, 1 animación `draw` de 350 ms (0 con movimiento reducido) y desaparece al editar la cédula. Capturas revisadas.
- Verificado: `npm run build` pasa y el detector da 0 hallazgos.

### U-18 · colorize, solo colores de estado (2026-11-11)
Regla aplicada (`DESIGN.md` · Status Apart): el vinotinto es marca y acción; los estados usan esmeralda (bien), rosa (error o reprobado), ámbar (aviso) y slate (neutro/inactivo). `quieter` sí hacía falta: U-03 a U-05 marcaron el vinotinto usado como estado. Sin cambios de API.
- **Rol ROOT/ADMIN:** el chip ROOT ya no es vinotinto sólido (competía con el botón primario): ROOT = slate-800 con texto blanco, ADMIN = slate-100; igual en la tabla de usuarios y en el encabezado del panel.
- **Éxito en Usuarios:** el banner de "Usuario actualizado/creado…" pasa de vinotinto a esmeralda, como el resto de confirmaciones.
- **Reprobada:** además del chip "Reprobada" (el texto es la señal principal, no solo el color), la nota se muestra en rosa-700; la aprobada sigue en slate-900. Medido: `rgb(190,18,60)` frente a `rgb(15,23,42)`.
- **Contraste de estados (WCAG AA 4,5:1):** esmeralda-700/50 5,21 · esmeralda-800/50 7,29 · rosa-700/50 5,72 · ámbar-800/50 6,84 · blanco/rosa-700 6,29. Una falla corregida: el chip "Inactivo" (slate-500 sobre slate-100) daba 4,34 y pasa a slate-600 (6,92).
- Vinotinto que se mantiene a propósito: botón primario, enlaces, foco, cabeceras de tabla, índice académico y chip "N registros" (marca e información, no estado).
- Fuera de alcance: el panel izquierdo del login (U-22) y el `backdrop-blur` del encabezado del panel.
- Verificado: `npm run build` pasa, el detector da 0 hallazgos y las capturas de Usuarios y Panel en Chrome coinciden.

### U-19 · extract, componentes compartidos (2026-11-11)
Regla: se extrae a partir de la tercera repetición (`estilo.md`); lo que se repite solo dos veces se deja. Sin cambios de API ni de comportamiento.
- **`components/Spinner.tsx`** (8 usos): el SVG de carga; tamaño y color por `className`.
- **`components/Aviso.tsx`** (8 usos): bloque de mensaje con `tono` `error` | `ok` | `info`; el error se anuncia como `alert`, el resto como `status`. Sustituye al `Aviso` local de `CorreoPages` y a los bloques de Login, Panel y Usuarios. El éxito unifica texto en esmeralda-800 (antes 700 en correo y 800 en usuarios; 7,29:1).
- **`components/Chip.tsx`** (5 usos): `ok`, `error`, `neutro`, `oscuro` (ROOT) y `marca`; sustituye a las etiquetas de aprobada/reprobada, activo/inactivo, rol (tabla y encabezado) y "N registros".
- **`.btn-text`** (3 usos) en `index.css`: acción de texto en filas y diálogo (Editar, Activar/Desactivar, Eliminar usuario).
- **Token `papel`** (`#f7f3f5`) en `tailwind.config.js`: sustituye `bg-[#f7f3f5]` en 7 sitios y en el `body`. Cierra el hallazgo de U-06.
- **No se extrajo** (2 usos): el encabezado de Panel/Usuarios y las cabeceras de tabla; la fila de confirmación de constancia generada (1 uso); el panel del login (U-22).
- Un ajuste de comportamiento detectado al comparar capturas: al pedir eliminar, el error local de validación del diálogo se limpia (antes quedaba visible junto a la confirmación).
- Verificación: 12 estados (login con error local y 401, olvidé, restablecer vencido/local, panel 404/resultado/generada, usuarios, tras activar, diálogo con error y con confirmación) capturados en Chrome antes y después. Se revisaron las capturas; los píxeles no son idénticos (el chip del encabezado ahora tiene el tamaño estándar y cambia el texto esmeralda), pero no hay cambios de maquetación. `npm run build` pasa y el detector da 0 hallazgos.

### U-20 · document, refresco de DESIGN.md (2026-11-11)
`DESIGN.md` y `.impeccable/design.json` regenerados desde el código actual; se conservaron el North Star y las reglas que siguen vigentes. No se tocó código.
- **Tipografía:** Inter Variable (antes declarada pero no cargada); roles title/section/body/label/button/meta con suelo de 12 px, tres pesos y cifras tabulares.
- **Color:** token `papel`; sección de **estado** con los contrastes medidos en U-18 (esmeralda, rosa, ámbar) y la regla Status Apart ya cumplida.
- **Componentes nuevos o cambiados:** `.btn-danger`, `.btn-text`, `Chip`, `Aviso`, `Spinner`, diálogo accesible, tabla con `scope`, expediente con acciones y confirmación, movimiento (0,25 s, check de 0,35 s, `prefers-reduced-motion`).
- **Layout:** orden buscar → expediente con acciones → notas; comportamiento responsive medido (375/768/1280) e impresión en carta con márgenes de la plantilla.
- **Quitado por obsoleto:** `animate-float`, gradientes animados, héroe con avatar, "colores de estado pendientes de definir", Inter "sin cargar".
- **Sección "Pendiente (transitorio)":** el panel del login (degradado, manchas y tarjetas de marketing) y el `backdrop-blur` del encabezado, que se quitan en U-22.
- Comprobado: el frontmatter resuelve todas sus referencias `{colors.x}` y `{rounded.x}` y el JSON del sidecar es válido. No hay linter de DESIGN.md en este entorno.

### U-21 · optimize, descartada con medición (2026-11-11)
La cola decía "solo si hay lentitud medible". Se midió y no la hay; no se tocó código.
- **Bundle:** JS 214 KB (**66 KB con gzip**), CSS 32 KB (6 KB con gzip). 3 dependencias de ejecución (react, react-dom, react-router-dom). Inter: 7 archivos `woff2` por subconjunto de caracteres, pero el navegador solo baja los que usa (a 375 y 1280 px se cargaron 2 recursos de fuente o menos).
- **Entrega ya optimizada:** `nginx.conf` comprime con gzip y sirve `/assets/` con caché de un año (`immutable`, nombres con hash de Vite).
- **Carga de `/login`** (Chrome sin interfaz, build de producción): 117 ms; en un equipo lento simulado (CPU ×6 y 3G rápida, 150 ms de latencia) 809 ms con 71 KB transferidos.
- **Tabla de notas:** de la búsqueda a la tabla visible con 40 asignaturas, 275 ms (511 ms en el equipo lento). Un estudiante real tiene decenas de asignaturas; con 300 filas (irreal) 409 ms y 1,6 s en el equipo lento, aceptable y sin virtualizar.
- **No se hizo, a propósito:** `React.lazy` por ruta (ahorraría pocos KB sobre 66 KB), virtualizar la tabla ni `memo`. Reabrir solo si aparece una queja o una medición real en los equipos de la oficina.

## Formato de la constancia impresa
`PrintConstanciaPage.tsx` igualada al formato de Notas.docx (encabezado institucional, tabla con cuadrícula, totales punteados, firma al pie). Logo `faces.png` retirado de impresión, login y `InstitutionLogos`.

### U-22a · polish de Login (2026-11-11)
La tarea U-22 pedía "una sesión por página", así que se parte: **U-22a Login** (hecha), U-22b Panel, U-22c Usuarios, U-22d Correo. Se leyó la crítica U-05 (24/40) y se cerró lo que quedaba abierto. Sin cambios de API ni de comportamiento.
- **Panel izquierdo plano** (decisión de U-05): vinotinto-900 sin degradado, manchas ni tarjetas de marketing; logos arriba, titular, una frase y "Uso exclusivo del personal autorizado". Se borraron `FeatureCard` y las tres tarjetas, los `drop-shadow` y los `backdrop-blur`. La frase ahora termina en punto; el titular, sin él.
- **Defecto detectado al verlo:** el logo de Postgrado (rojo oscuro) casi no se veía sobre el vinotinto. Los logos están hechos para fondo claro: van dentro de una pastilla blanca. Se reutiliza `InstitutionLogos` en vez de `<img>` a mano.
- **Textos:** pie sin el espacio mal puesto ("·Facultad"); el placeholder del usuario se acorta a "Ej. 12345678" porque a 375 px se cortaba.
- **Sombras:** `shadow-md` fuera de los logos móviles; también se quitó `backdrop-blur` del encabezado del Panel (pendiente anotado en `DESIGN.md`, que ya no tiene la sección "transitorio").
- Comprobado en Chrome a 1280, 1024 y 375 px: sin scroll horizontal y capturas revisadas. `npm run build` pasa y el detector da 0 hallazgos.
- Cierra de U-03 a U-05: el P1 "panel decorativo contradice el producto" y el P2 "`animate-pulse`" (este ya cerrado en U-16). Siguen abiertos para U-22b/c/d lo que quede de sus críticas.

### U-22b · polish de Panel (2026-11-11)
Segunda sesión de U-22. Se leyó la crítica U-03 (23/40) y se cerró lo que quedaba abierto; sin cambios de API.
- **Contraste:** el pie (`slate-400`, 2,33:1) y el subtítulo del Panel, del login y de Usuarios (`slate-500` directo sobre el papel, 4,33:1) pasan a `slate-600` (6,89:1). El placeholder de `.input` (`slate-400`, 2,56:1) pasa a `slate-500` (4,76:1) y los íconos de la lupa y del ojo de contraseña también. **Ya no queda `slate-400` en texto ni íconos de acción.** Se documentó en `DESIGN.md` que `slate-500` solo vale sobre blanco.
- **Teclado:** al buscar, el campo de cédula pasaba a `disabled` y el foco se perdía (el siguiente Tab arrancaba en el encabezado). Ahora es `readOnly` con `aria-busy`: medido en Chrome, el foco permanece en el campo durante y después de la búsqueda, y **dos Tab llevan a Imprimir** (1280 y 375 px).
- **Encabezado:** se quitó el avatar de iniciales (decoración que repetía el nombre) y su función; queda nombre, rol y cédula del usuario.
- Sin scroll horizontal a 1280 y 375 px. `npm run build` pasa y el detector da 0 hallazgos.
- Cierra de U-03: P2 "teclado y foco" y P3 "estado vacío y pie". Queda de U-03 solo la decisión de negocio sobre estudiantes sin notas.

### U-22c · polish de Usuarios (2026-11-11)
Tercera sesión de U-22. Se leyó la crítica U-04 (20/40); sus P1, el P2 del diálogo y el P3 de color ya estaban cerrados (U-08, U-12b, U-18). Sin cambios de API.
- **Defecto real del diálogo en pantallas bajas:** a 375×520 px el diálogo quedaba a −113 px del borde superior, con el título y la cédula **inalcanzables** (el contenedor no hacía scroll). Ahora el contenedor tiene `overflow-y-auto` y el diálogo `m-auto`: al desplazarse el borde superior queda a 24 px. En 1280×800 sigue centrado.
- **Fallo al cargar:** si la lista no carga, antes quedaba una tabla con solo la cabecera; ahora muestra "No se pudo mostrar la lista de usuarios." con el botón **Reintentar**. El aviso de carga lleva `role="status"`.
- **Cédulas:** se muestran con separador de miles (`12.345.678`, `es-VE`) y cifras tabulares, como en el resto del sistema.
- **Avisos:** abrir el diálogo limpia el aviso de éxito anterior.
- Decisión de producto, **no tomada**: enmascarar las cédulas de la lista (hoy se ven todas, siempre). Sigue abierta por el principio 3 de `PRODUCT.md`.
- Sin scroll horizontal a 375 y 1280 px. `npm run build` pasa y el detector da 0 hallazgos.

### U-22d · polish de Correo (2026-11-11)
Última página de U-22. Se leyó la crítica U-05 (24/40); sus P1 ya estaban cerrados (panel de login en U-22a, enlace vencido en U-12a, confirmación de eliminación en U-12b y U-18). Sin cambios de API.
- **Identidad:** las tres pantallas de correo no mostraban nada institucional; ahora el marco lleva `InstitutionLogos compact` arriba (a 375 px caben, sin scroll horizontal).
- **Enlace vencido:** antes el formulario seguía visible con "Guardar contraseña" aunque ya no servía, con el enlace para pedir otro debajo como texto. Ahora, si no hay token o la API responde "venció", el formulario se reemplaza por el aviso y **un botón primario** "Solicitar un enlace nuevo" (en eliminación, "Ir a usuarios").
- **Agrupación:** cada etiqueta va pegada a su campo (antes el `space-y-4` las separaba tanto como a los grupos entre sí).
- **Contraseña:** casilla "Mostrar contraseñas" para ver las dos a la vez; `autoComplete="email"` en recuperar.
- Se limpiaron las cadenas `{"..."}` que había dejado la extracción de `Aviso` (U-19).
- Capturas revisadas a 375 y 1000 px; sin scroll horizontal. `npm run build` pasa y el detector da 0 hallazgos. No probado el flujo real con un enlace de correo.

**U-22 completa (Login, Panel, Usuarios y Correo).** Pendientes abiertos que no son de diseño: decidir si se enmascaran las cédulas de la lista de usuarios y si se bloquea generar la constancia de un estudiante sin notas.

**Cabecera de usuario (2026-11-12):** Panel y Usuarios muestran nombre, chip de rol y debajo el correo; la C.I. solo si existe (el ROOT no tiene). La tabla muestra «—» sin cédula y el diálogo no exige cédula al editar.
