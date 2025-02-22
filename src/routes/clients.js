const express = require('express');
const pool = require('../database/db');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

// Crear un nuevo cliente
router.post('/', authenticateToken, async (req, res) => {
  const { name, email, phone } = req.body;

  try {
    await pool.query(
      'INSERT INTO clients (name, email, phone) VALUES ($1, $2, $3)',
      [name, email, phone]
    );
    res.status(201).json({ message: 'Cliente creado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el cliente', error });
  }
});

// Listar todos los clientes
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM clients');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los clientes' });
  }
});

// Actualizar un cliente
router.put('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { name, email, phone } = req.body;

  try {
    await pool.query(
      'UPDATE clients SET name = $1, email = $2, phone = $3 WHERE id = $4',
      [name, email, phone, id]
    );
    res.json({ message: 'Cliente actualizado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el cliente', error });
  }
});

// Eliminar un cliente
router.delete('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query('DELETE FROM clients WHERE id = $1', [id]);
    res.json({ message: 'Cliente eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el cliente', error });
  }
});

module.exports = router;
