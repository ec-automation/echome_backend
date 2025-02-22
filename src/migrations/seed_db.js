const pool = require('../database/db');
const bcrypt = require('bcrypt');

const seedDatabase = async () => {
  try {
    // Insertar roles
    await pool.query(`
      INSERT INTO roles (name)
      VALUES ('Admin'), ('User')
      ON CONFLICT (name) DO NOTHING;
    `);

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Insertar usuario administrador
    await pool.query(`
      INSERT INTO users (username, password, role_id)
      VALUES ('admin', '${hashedPassword}', 1)
      ON CONFLICT (username) DO NOTHING;
    `);

    console.log('Datos iniciales insertados exitosamente');
  } catch (error) {
    console.error('Error al insertar datos iniciales', error);
  } finally {
    pool.end();
  }
};

seedDatabase();
