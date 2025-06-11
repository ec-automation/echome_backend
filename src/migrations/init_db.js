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
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  stock INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  company_id INTEGER REFERENCES companies(id)
);

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
  description TEXT NOT NULL UNIQUE,
  amount DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  company_id INTEGER REFERENCES companies(id)
);

CREATE TABLE IF NOT EXISTS invoices (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id),
  due_date DATE NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  company_id INTEGER REFERENCES companies(id),
  status VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS payments (
  id SERIAL PRIMARY KEY,
  invoice_id INTEGER REFERENCES invoices(id),
  amount DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  company_id INTEGER REFERENCES companies(id)
);

CREATE TABLE IF NOT EXISTS workbook (
  id SERIAL PRIMARY KEY,
  prompt_parent VARCHAR(255),
  prompt_given_hint VARCHAR(255),
  generated_result TEXT,
  user_id VARCHAR(100),
  creation VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS prompts_list (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(100),
  prompt_name VARCHAR(450),
  prompt_formula TEXT,
  prompt_example TEXT,
  prompt_hint TEXT,
  prompts_ex1_part1 VARCHAR(100),
  prompts_ex1_part2 VARCHAR(100),
  prompts_ex2_part1 VARCHAR(100),
  prompts_ex2_part2 VARCHAR(100),
  created_by VARCHAR(100),
  user_email VARCHAR(100),
  prompt_image_url TEXT,
  prompt_price VARCHAR(45),
  ts_creation VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS actions_list (
  id SERIAL PRIMARY KEY,
  actions_listcol VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS dashboard_current_status (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  company_id INTEGER REFERENCES companies(id),
  current_page VARCHAR(100),
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  additional_flags JSONB,
  socket_id VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS product_images (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS graphs (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS graph_nodes (
  id SERIAL PRIMARY KEY,
  graph_id INTEGER NOT NULL REFERENCES graphs(id) ON DELETE CASCADE,
  node_id VARCHAR(255) NOT NULL,
  label VARCHAR(255),
  description TEXT,
  background_color VARCHAR(20),
  position_x FLOAT,
  position_y FLOAT,
  icon VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS graph_edges (
  id SERIAL PRIMARY KEY,
  graph_id INTEGER NOT NULL REFERENCES graphs(id) ON DELETE CASCADE,
  source_id VARCHAR(255) NOT NULL,
  target_id VARCHAR(255) NOT NULL,
  label VARCHAR(255)
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
