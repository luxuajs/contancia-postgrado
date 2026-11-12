# 0001 · Adoptar design by contract

- Fecha: 2026-11-11
- Estado: aceptada (en adopción)

## Contexto
El sistema ya funciona sin contrato de API; frontend y backend comparten la forma de los datos solo por convención.

## Decisión
Adoptar la estructura estándar (contracts/, backend/, frontend/, database/, docs/) y un
`contracts/openapi.yml` como fuente de verdad. La línea base se extraerá del código actual
(única vez que el contrato sale del código); desde ahí el contrato manda.

## Consecuencias
- Organización hecha sin cambiar código. El contrato y su validación entran como tareas (`PROGRESO.md`).
