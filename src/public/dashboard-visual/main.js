import express from 'express';
import bcrypt from 'bcrypt';
import pool from '../database/db.js';
import authenticateToken from '../middleware/auth.js';
import { Server } from 'socket.io';
import http from 'http';
import cors from 'cors';

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
const router = express.Router();

// WebSockets: Conexión con clientes
io.on('connection', (socket) => {
  console.log('Cliente conectado');

  socket.on('backend_en_linea', (message) => {
    console.log(message);
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

// Registrar un nuevo usuario (solo Admin)
router.post('/register', authenticateToken, async (req, res) => {
  if (req.user.role !== 1) return res.status(403).json({ message: 'Acceso denegado' });

  const { username, password, role_id } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      'INSERT INTO users (username, password, role_id) VALUES ($1, $2, $3)',
      [username, hashedPassword, role_id]
    );

    res.status(201).json({ message: 'Usuario creado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el usuario', error });
  }
});

// Listar todos los usuarios (requiere autenticación)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, username, role_id FROM users');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los usuarios' });
  }
});

// Eliminar un cliente por ID (manejo de error de clave foránea con WebSockets)
router.delete('/:id', authenticateToken, async (req, res) => {
  if (req.user.role !== 1) {
    return res.status(403).json({ message: 'Acceso denegado' });
  }

  const { id } = req.params;

  try {
    await pool.query('DELETE FROM clients WHERE id = $1', [id]);
    io.emit('clientDeleted', { id }); // Emitir evento de eliminación de cliente
    res.json({ message: 'Cliente eliminado exitosamente' });
  } catch (error) {
    if (error.code === '23503') {
      res.status(400).json({ message: 'No se puede eliminar el cliente porque está referenciado en otra tabla.', error });
    } else {
      res.status(500).json({ message: 'Error al eliminar el cliente', error });
    }
  }
});

// Actualizar un usuario por ID (solo Admin)
router.put('/:id', authenticateToken, async (req, res) => {
  if (req.user.role !== 1) {
    return res.status(403).json({ message: 'Acceso denegado' });
  }

  const { id } = req.params;
  const { username, password, role_id } = req.body;

  try {
    let updateFields = [];
    let updateValues = [];
    let index = 1;

    if (username) {
      updateFields.push(`username = $${index}`);
      updateValues.push(username);
      index++;
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateFields.push(`password = $${index}`);
      updateValues.push(hashedPassword);
      index++;
    }

    if (role_id) {
      updateFields.push(`role_id = $${index}`);
      updateValues.push(role_id);
      index++;
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ message: 'No se proporcionaron datos para actualizar' });
    }

    updateValues.push(id);

    await pool.query(
      `UPDATE users SET ${updateFields.join(', ')} WHERE id = $${index}`,
      updateValues
    );

    res.json({ message: 'Usuario actualizado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el usuario', error });
  }
});

// Iniciar servidor con WebSockets
server.listen(3000, () => {
  console.log('Servidor corriendo en el puerto 3000');
});

export default router;
