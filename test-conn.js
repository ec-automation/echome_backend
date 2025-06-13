import dotenv from 'dotenv';
dotenv.config();

import pool from './src/database/db.js'; // Esto ejecutará los console.log de db.js

try {
  const res = await pool.query('SELECT NOW()');
  console.log('✅ Conexión exitosa:', res.rows[0]);
} catch (err) {
  console.error('❌ Error:', err);
} finally {
  pool.end();
}
