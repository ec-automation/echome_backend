const pool = require('../database/db');

const createInvoicesTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS invoices (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id),
        issue_date TIMESTAMP DEFAULT NOW(),
        due_date TIMESTAMP,
        status VARCHAR(50) DEFAULT 'pending',
        total_amount DECIMAL(10, 2) NOT NULL
      );
    `);
    console.log('Tabla de facturas creada exitosamente');
  } catch (error) {
    console.error('Error al crear la tabla de facturas', error);
  } finally {
    pool.end();
  }
};

createInvoicesTable();
