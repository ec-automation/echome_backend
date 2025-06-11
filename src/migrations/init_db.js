// init_db.js

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
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        company_id INTEGER REFERENCES companies(id),
        CONSTRAINT unique_product_name UNIQUE (name)
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
        description TEXT NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        company_id INTEGER REFERENCES companies(id),
        CONSTRAINT unique_order_description UNIQUE (description)
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
        prompt_name TEXT,
        prompt_formula TEXT,
        prompt_example TEXT,
        prompt_hint TEXT,
        prompts_ex1_part1 VARCHAR(255),
        prompts_ex1_part2 VARCHAR(255),
        prompts_ex2_part1 VARCHAR(255),
        prompts_ex2_part2 VARCHAR(255),
        created_by VARCHAR(255),
        user_email VARCHAR(255),
        prompt_image_url TEXT,
        prompt_price VARCHAR(255),
        ts_creation VARCHAR(255)
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
        additional_flags JSON,
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
        graph_id INTEGER REFERENCES graphs(id) ON DELETE CASCADE,
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
        graph_id INTEGER REFERENCES graphs(id) ON DELETE CASCADE,
        source_id VARCHAR(255) NOT NULL,
        target_id VARCHAR(255) NOT NULL,
        label VARCHAR(255)
      );

      CREATE TABLE IF NOT EXISTS supply (
        id SERIAL PRIMARY KEY,
        product_id INTEGER,
        quote_id INTEGER,
        supplier_id INTEGER,
        product_code VARCHAR(100),
        product_name VARCHAR(1000),
        quantity INTEGER,
        company_name VARCHAR(1000),
        attended VARCHAR(10),
        purchase_order_code VARCHAR(15)
      );

      CREATE TABLE IF NOT EXISTS purchase_order (
        id SERIAL PRIMARY KEY,
        supplier_id INTEGER,
        order_code VARCHAR(50),
        status VARCHAR(50),
        created_by INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS quotations (
        id SERIAL PRIMARY KEY,
        client_id INTEGER,
        total_amount DECIMAL(10,2),
        issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(50)
      );

      CREATE TABLE IF NOT EXISTS quotation_items (
        id SERIAL PRIMARY KEY,
        quotation_id INTEGER REFERENCES quotations(id),
        product_id INTEGER REFERENCES products(id),
        quantity INTEGER,
        unit_price DECIMAL(10,2)
      );

      CREATE TABLE IF NOT EXISTS expenses (
        id SERIAL PRIMARY KEY,
        company_id INTEGER REFERENCES companies(id),
        amount DECIMAL(10,2),
        description TEXT,
        category VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('✅ Tablas creadas exitosamente incluyendo EC_WORLD traducidas');
  } catch (error) {
    console.error('❌ Error al crear las tablas:', error);
  } finally {
    pool.end();
  }
};

createTables();
