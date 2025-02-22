const express = require('express');
const pool = require('../database/db');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

// Crear una nueva orden
router.post('/', authenticateToken, async (req, res) => {
  const { client_id, description, amount } = req.body;

  try {
    await pool.query(
      'INSERT INTO orders (client_id, description, amount) VALUES ($1, $2, $3)',
      [client_id, description, amount]
    );
    res.status(201).json({ message: 'Orden creada exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la orden', error });
  }
});

// Listar todas las órdenes
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT o.id, o.description, o.amount, o.created_at, c.name AS client_name 
      FROM orders o
      JOIN clients c ON o.client_id = c.id
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las órdenes', error });
  }
});

// Actualizar una orden
router.put('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { description, amount } = req.body;

  try {
    await pool.query(
      'UPDATE orders SET description = $1, amount = $2 WHERE id = $3',
      [description, amount, id]
    );
    res.json({ message: 'Orden actualizada exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la orden', error });
  }
});

// Eliminar una orden
router.delete('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query('DELETE FROM orders WHERE id = $1', [id]);
    res.json({ message: 'Orden eliminada exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la orden', error });
  }
});

module.exports = router;
