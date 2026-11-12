// Comprobación del validador en modo aviso, sin base de datos:
// npx tsx scripts/probarContrato.ts   (desde backend/, con el contrato empaquetado)
import assert from 'assert';
import express from 'express';
import { crearValidadorContrato } from '../src/middleware/contrato';

const avisos: string[] = [];
const warnOriginal = console.warn;
console.warn = (...args: unknown[]) => avisos.push(args.join(' '));

const validador = crearValidadorContrato('aviso', '../contracts/dist/openapi.bundled.yml');
assert.ok(validador, 'no se cargó el contrato empaquetado');

const app = express();
app.use(express.json());
app.use(validador);
// Respuestas a propósito: una conforme y dos fuera de contrato.
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', servicio: 'facesuc-constancias', fecha: new Date().toISOString() });
});
app.get('/api/constancias/:cedula', (_req, res) => {
  res.status(404).json({ mensaje: 'sin campo error' });
});
app.post('/api/auth/login', (_req, res) => {
  res.status(400).json({ error: 'Datos inválidos' });
});

const servidor = app.listen(0, async () => {
  try {
    const { port } = servidor.address() as { port: number };
    const pedir = async (metodo: string, ruta: string, cuerpo?: object) => {
      const r = await fetch(`http://127.0.0.1:${port}${ruta}`, {
        method: metodo,
        headers: { 'content-type': 'application/json' },
        body: cuerpo ? JSON.stringify(cuerpo) : undefined,
      });
      return { status: r.status, cuerpo: (await r.json()) as { error?: string } };
    };

    // 1. Respuesta conforme: sin avisos.
    assert.equal((await pedir('GET', '/api/health')).status, 200);
    assert.equal(avisos.length, 0, `avisos inesperados: ${avisos.join('\n')}`);

    // 2. Respuesta fuera de contrato: sale igual, se avisa una vez, sin la cédula real.
    const r = await pedir('GET', '/api/constancias/12345678');
    assert.deepEqual(r, { status: 404, cuerpo: { mensaje: 'sin campo error' } });
    await pedir('GET', '/api/constancias/12345678');
    assert.equal(avisos.length, 1, 'la deriva repetida debe avisarse una sola vez');
    assert.match(avisos[0], /"dir":"respuesta".*\/api\/constancias\/\{cedula\}/);
    assert.ok(!avisos[0].includes('12345678'), 'el aviso no debe llevar la cédula');

    // 3. Petición fuera de contrato: no se bloquea y no se registra la contraseña.
    const l = await pedir('POST', '/api/auth/login', { password: 'secreta' });
    assert.equal(l.status, 400);
    assert.equal(l.cuerpo.error, 'Datos inválidos');
    assert.equal(avisos.length, 2);
    assert.match(avisos[1], /"dir":"peticion".*\/api\/auth\/login/);
    assert.ok(!avisos[1].includes('secreta'), 'el aviso no debe llevar el cuerpo');

    // 4. Sin contrato: devuelve null y no lanza.
    assert.equal(crearValidadorContrato('aviso', '/no/existe.yml'), null);
    assert.equal(crearValidadorContrato('off', '../contracts/dist/openapi.bundled.yml'), null);

    console.warn = warnOriginal;
    console.log('OK: validador de contrato en modo aviso');
  } catch (e) {
    console.warn = warnOriginal;
    console.error(e);
    process.exitCode = 1;
  } finally {
    servidor.close();
  }
});
