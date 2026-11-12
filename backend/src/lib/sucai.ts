import mysql from 'mysql2/promise';
import { env } from '../config/env';

/** Pool de solo lectura hacia la BD local de SUCAI (MySQL). */
export const sucai = mysql.createPool({
  host: env.SUCAI_DB_HOST,
  port: env.SUCAI_DB_PORT,
  user: env.SUCAI_DB_USER,
  password: env.SUCAI_DB_PASSWORD,
  database: env.SUCAI_DB_NAME,
  connectionLimit: 5,
});
