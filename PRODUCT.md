# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Personal de postgrado de la FACES-UC, en una oficina y desde un PC de escritorio.
- **ADMIN**: coordinación/secretaría de postgrado. Atiende a estudiantes que piden una constancia de notas: busca por cédula, revisa el expediente, genera e imprime.
- **ROOT**: además gestiona los usuarios del sistema (`/usuarios`).
Los estudiantes no usan el sistema.

## Product Purpose
Sistema interno de la Facultad de Ciencias Económicas y Sociales de la Universidad de Carabobo para emitir constancias de notas de postgrado. Éxito: de la cédula a una constancia correcta, en pocos pasos y sin errores.

## Positioning
Genera la constancia oficial a partir de la plantilla institucional de Word (`Notas.docx`) y la exporta a `.docx`/PDF, con registro de consultas.

## Operating Context
Flujo central: iniciar sesión → buscar estudiante por cédula → resumen → notas → generar/imprimir constancia. Flujos de correo: olvidé contraseña, restablecer, confirmar eliminación de usuario. Se imprime con frecuencia.

## Capabilities and Constraints
- Stack: React + Vite + Tailwind; API Express + Prisma + PostgreSQL.
- La constancia sale de la plantilla Word; la UI no la rediseña.
- Interfaz solo en español.
- Cédulas y notas son datos personales: no mostrarlos más de lo necesario.
- Rediseño de UI no puede cambiar llamadas a la API (el contrato manda).

## Brand Commitments
Identidad institucional UC: logos (`frontend/public/logos`) y color vinotinto. Tono institucional.

## Evidence on Hand
Logos institucionales y plantilla `Notas.docx`. No hay testimonios, métricas ni estudios de usuarios; no inventarlos.

## Product Principles
1. Rapidez y cero errores: una constancia oficial equivocada es el costo mayor.
2. Una tarea por pantalla: cédula → constancia sin desvíos.
3. Datos personales visibles solo cuando hacen falta.
4. Sobrio e institucional: la herramienta no compite con el documento.

## Accessibility & Inclusion
Sin estándar formal declarado. Operación principal con teclado en PC; contraste suficiente del vinotinto (se evalúa en U-06).
