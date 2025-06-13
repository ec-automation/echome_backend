import dotenv from 'dotenv';
dotenv.config();

import pkg from 'pg';
const { Pool } = pkg;

// 🔍 Debug: mostrar las variables críticas
console.log('[DEBUG] DB_HOST:', process.env.DB_HOST);
console.log('[DEBUG] DB_PORT:', process.env.DB_PORT);
console.log('[DEBUG] DB_USER:', process.env.DB_USER);
console.log('[DEBUG] DB_PASSWORD:', process.env.DB_PASSWORD, typeof process.env.DB_PASSWORD);
console.log('[DEBUG] DB_NAME:', process.env.DB_NAME);

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: false // desactivado para Pooler de Supabase
});

export default pool;
