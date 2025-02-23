const express = require('express');
const pool = require('../database/db');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

// Obtener todos los clientes
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM clients');
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los clientes', error });
  }
});

// Crear un nuevo cliente
router.post('/', authenticateToken, async (req, res) => {
  const { name, email } = req.body;
  try {
    await pool.query('INSERT INTO clients (name, email) VALUES ($1, $2)', [name, email]);
    res.status(201).json({ message: 'Cliente creado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el cliente', error });
  }
});

// Actualizar cliente
router.put('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  try {
    await pool.query('UPDATE clients SET name = $1, email = $2 WHERE id = $3', [name, email, id]);
    res.status(200).json({ message: 'Cliente actualizado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el cliente', error });
  }
});

// Eliminar cliente
router.delete('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM clients WHERE id = $1', [id]);
    res.status(200).json({ message: 'Cliente eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el cliente', error });
  }
});

module.exports = router;
