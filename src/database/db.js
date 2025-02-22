const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.connect()
  .then(() => console.log('Conexión a PostgreSQL establecida'))
  .catch(err => console.error('Error al conectar con PostgreSQL', err));

module.exports = pool;
