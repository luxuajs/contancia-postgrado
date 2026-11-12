import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL es obligatoria'),
  JWT_SECRET: z.string().min(16, 'JWT_SECRET debe tener al menos 16 caracteres'),
  JWT_EXPIRES_IN: z.string().default('8h'),
  TEMPLATE_PATH: z.string().default('./templates/Notas.docx'),
  LOGO_UC_PATH: z.string().default('./templates/logos/uc.png'),
  LOGO_POSTGRADO_PATH: z.string().default('./templates/logos/faces-postgrado.png'),
  CORS_ORIGIN: z.string().default('*'),
  ROOT_EMAIL: z.string().email().optional(),
  ROOT_PASSWORD: z.string().optional(),
  ROOT_NOMBRE: z.string().default('Root FACES UC'),
  SMTP_USER: z.string().default('dticucfaces@gmail.com'),
  SMTP_PASS: z.string().optional(), // app password de Gmail; sin él los correos solo se registran en consola
  APP_URL: z.string().default('http://localhost:5173'),
  SUCAI_DB_HOST: z.string().default('127.0.0.1'),
  SUCAI_DB_PORT: z.coerce.number().int().positive().default(3306),
  SUCAI_DB_USER: z.string().min(1, 'SUCAI_DB_USER es obligatoria'),
  SUCAI_DB_PASSWORD: z.string().default(''),
  SUCAI_DB_NAME: z.string().default('sucai_local'),
  // Nombre que firma al pie de la constancia.
  PROFESOR_COORDINACION: z.string().default('Prof. Karla Padrón'),
  // Validación contra el contrato: 'aviso' registra la deriva sin bloquear; 'off' la apaga.
  CONTRATO_VALIDACION: z.enum(['off', 'aviso']).default('aviso'),
  // Contrato empaquetado (sin $ref externos). Relativo al directorio de arranque (backend/).
  CONTRATO_RUTA: z.string().default('../contracts/dist/openapi.bundled.yml'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Variables de entorno inválidas:');
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
