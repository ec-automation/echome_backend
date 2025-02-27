//para crear o actualizar la base de datos usar esta orden
// node c:/Users/fsoar/Desktop/echome_backend/src/migrations/seed_db.js

import pool from '../database/db.js';
import bcrypt from 'bcrypt';

const seedDatabase = async () => {
  try {
    // Insert roles
    await pool.query(`
      INSERT INTO roles (name)
      VALUES ('Admin'), ('User')
      ON CONFLICT (name) DO NOTHING;
    `);

    // Encrypt passwords
    const hashedPassword1 = await bcrypt.hash('user123', 10);
    const hashedPassword2 = await bcrypt.hash('user456', 10);

    // Insert users
    await pool.query(`
      INSERT INTO users (username, password, role_id)
      VALUES 
        ('user1', '${hashedPassword1}', 2),
        ('user2', '${hashedPassword2}', 2)
      ON CONFLICT (username) DO NOTHING;
    `);

    // Insert companies
    await pool.query(`
      INSERT INTO companies (name, ruc, website, user_id)
      VALUES 
        ('Company A1', '12345678901', 'www.companya1.com', 1),
        ('Company A2', '12345678902', 'www.companya2.com', 1),
        ('Company B1', '12345678903', 'www.companyb1.com', 2),
        ('Company B2', '12345678904', 'www.companyb2.com', 2)
      ON CONFLICT (ruc) DO NOTHING;
    `);

    // Insert products
    await pool.query(`
      INSERT INTO products (name, description, price, stock, company_id)
      VALUES 
        ('Product A1-1', 'Description A1-1', 10.00, 100, 1),
        ('Product A1-2', 'Description A1-2', 20.00, 200, 1),
        ('Product A2-1', 'Description A2-1', 30.00, 300, 2),
        ('Product A2-2', 'Description A2-2', 40.00, 400, 2),
        ('Product B1-1', 'Description B1-1', 50.00, 500, 3),
        ('Product B1-2', 'Description B1-2', 60.00, 600, 3),
        ('Product B2-1', 'Description B2-1', 70.00, 700, 4),
        ('Product B2-2', 'Description B2-2', 80.00, 800, 4)
      ON CONFLICT (name) DO NOTHING;
    `);

    // Insert clients
    await pool.query(`
      INSERT INTO clients (name, email, phone, company_id)
      VALUES 
        ('Client A1', 'clienta1@example.com', '1234567890', 1),
        ('Client A2', 'clienta2@example.com', '1234567891', 2),
        ('Client B1', 'clientb1@example.com', '1234567892', 3),
        ('Client B2', 'clientb2@example.com', '1234567893', 4)
      ON CONFLICT (email) DO NOTHING;
    `);

// Clear existing orders if needed
await pool.query(`DELETE FROM orders`);

// Insert orders and retrieve their IDs
const orderResults = await pool.query(`
  INSERT INTO orders (client_id, description, amount, company_id)
  VALUES 
    (1, 'Order A1-1', 100.00, 1),
    (1, 'Order A1-2', 200.00, 1),
    (2, 'Order A2-1', 300.00, 2),
    (2, 'Order A2-2', 400.00, 2),
    (3, 'Order B1-1', 500.00, 3),
    (3, 'Order B1-2', 600.00, 3),
    (4, 'Order B2-1', 700.00, 4),
    (4, 'Order B2-2', 800.00, 4)
  RETURNING id;
`);

// Check if orderResults.rows is populated
if (orderResults.rows.length === 0) {
  console.error('No orders were inserted or returned.');
  return;
}

// Use the returned IDs for invoices
const orderIds = orderResults.rows.map(row => row.id);

await pool.query(`
  INSERT INTO invoices (order_id, due_date, total_amount, company_id)
  VALUES 
    (${orderIds[0]}, '2025-12-31', 100.00, 1),
    (${orderIds[1]}, '2025-12-31', 200.00, 1),
    (${orderIds[2]}, '2025-12-31', 300.00, 2),
    (${orderIds[3]}, '2025-12-31', 400.00, 2),
    (${orderIds[4]}, '2025-12-31', 500.00, 3),
    (${orderIds[5]}, '2025-12-31', 600.00, 3),
    (${orderIds[6]}, '2025-12-31', 700.00, 4),
    (${orderIds[7]}, '2025-12-31', 800.00, 4)
  ON CONFLICT (order_id) DO NOTHING;
`);
    console.log('Datos iniciales insertados exitosamente');
  } catch (error) {
    console.error('Error al insertar datos iniciales', error);
  } finally {
    pool.end();
  }
};

seedDatabase();
