# CAMBIOS del contrato

Todo cambio en `openapi.yml` añade aquí una entrada y sube `info.version`.
Incompatible (quita o renombra campos, rutas o códigos; endurece validaciones) → versión
mayor y ADR.

## 0.2.0 · 2026-11-12
- `UsuarioPublico.cedula` y `UsuarioListado.cedula` pasan a `string | null`: el ROOT no tiene
  cédula (inicia sesión con su correo). Los clientes deben tolerar `null`.

## 0.1.0 · 2026-11-11
- Línea base extraída del código (ADR 0001): 14 operaciones bajo `/api/*`.
- `x-pendiente` abiertos (cada uno puede volverse tarea):
  - Errores sin RFC 9457 y validación con 400 (`common/errores.yml`).
  - `detalle` interno en errores fuera de producción.
  - `iniciarSesion`: campos `cedula`/`usuario` redundantes.
  - `obtenerConstancia`: GET con efecto secundario (registra consulta).
  - Parámetro `cedula` acepta prefijo y puntos; decidir si solo dígitos.
  - `listarUsuarios` sin paginación.
  - `UsuarioListado` sin `email`.
  - `solicitarEliminacionUsuario`: DELETE que no borra y responde 200.
  - `Materia.calculo_promedio` siempre vacío.
