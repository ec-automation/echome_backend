//para crear o actualizar la base de datos usar esta orden
// node c:/Users/fsoar/Desktop/echome_backend/src/migrations/init_db.js

import pool from '../database/db.js';

const createTables = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS roles (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) UNIQUE NOT NULL
      );

      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role_id INTEGER REFERENCES roles(id)
      );

      CREATE TABLE IF NOT EXISTS companies (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        ruc VARCHAR(11) UNIQUE NOT NULL,
        website VARCHAR(255),
        user_id INTEGER REFERENCES users(id)
      );
      
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        stock INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        company_id INTEGER REFERENCES companies(id)
      );

      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1
          FROM pg_constraint
          WHERE conname = 'unique_product_name'
        ) THEN
          ALTER TABLE products ADD CONSTRAINT unique_product_name UNIQUE (name);
        END IF;
      END $$;

      CREATE TABLE IF NOT EXISTS clients (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        phone VARCHAR(20),
        company_id INTEGER REFERENCES companies(id)
      );

      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        client_id INTEGER REFERENCES clients(id),
        description TEXT NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        company_id INTEGER REFERENCES companies(id)
      );
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1
          FROM pg_constraint
          WHERE conname = 'unique_order_description'
        ) THEN
          ALTER TABLE orders ADD CONSTRAINT unique_order_description UNIQUE (description);
        END IF;
      END $$;

      CREATE TABLE IF NOT EXISTS invoices (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id),
        due_date DATE NOT NULL,
        total_amount DECIMAL(10, 2) NOT NULL,
        company_id INTEGER REFERENCES companies(id)
      );

    `);

    console.log('Tablas creadas exitosamente');
  } catch (error) {
    console.error('Error al crear las tablas', error);
  } finally {
    pool.end();
  }
};

createTables();
