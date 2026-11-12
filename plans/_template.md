# <ID> · <título de la tarea>

> Carril: backend | frontend · Contrato: v<x.y.z> · Plan escrito el <AAAA-MM-DD>
> Implementa: en UNA sesión. Lee solo este archivo y los archivos que nombra "Archivos".

## Objetivo
<2–3 líneas: qué existe al terminar que hoy no existe.>

## Archivos
- Crear: <rutas exactas>
- Modificar: <rutas exactas, y qué parte de cada una>
- No tocar: <rutas que parecen relacionadas y no lo son>

## Contrato aplicable
<Los bloques YAML de las operaciones y esquemas de esta tarea, COPIADOS de
`contracts/`. Si no toca operaciones, "No aplica".>

## Decisiones ya tomadas
- <decisión> — <por qué> (ADR NNNN). No se reabren aquí.

## Pasos
1. <paso concreto; en lo delicado, el código exacto: firmas, SQL, reglas de seguridad>

## Seguridad
- <riesgo OWASP Top 10:2025 que toca esta tarea> — <cómo queda cubierto, o "lo cubre el cargador/middleware X">

## Skills
- <skill y en qué paso>, o "Ninguna".

## No leer
- `contracts/dist/`, `contracts/generated/`, lockfiles, `node_modules/`, <otras>

## Verificación
```bash
<comandos exactos>
```
Salida esperada: <qué tiene que decir>.

## Cierre
- `PROGRESO.md` (raíz): <ID> a *Hecho* con fecha; en *En curso*, la siguiente de su carril.
- `<carpeta>/PROGRESO.md`: <qué marcar>.
- Commit: `<mensaje exacto>`

## Si algo choca con el contrato
PARAR. No cambiar el contrato ni improvisar. Escribir en *Bloqueos* qué no encaja y por qué,
hacer commit de lo hecho y terminar. El que planifica lo resuelve y actualiza el plan.

## Bloqueos
<Vacío. Solo se rellena si el implementador se detiene.>
