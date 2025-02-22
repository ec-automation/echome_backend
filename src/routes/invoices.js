const express = require('express');
const pool = require('../database/db');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

// Generar una nueva factura a partir de una orden existente
router.post('/', authenticateToken, async (req, res) => {
  const { order_id, due_date } = req.body;

  try {
    const order = await pool.query('SELECT amount FROM orders WHERE id = $1', [order_id]);

    if (order.rows.length === 0) {
      return res.status(404).json({ message: 'Orden no encontrada' });
    }

    const total_amount = order.rows[0].amount;

    await pool.query(
      'INSERT INTO invoices (order_id, due_date, total_amount) VALUES ($1, $2, $3)',
      [order_id, due_date, total_amount]
    );

    res.status(201).json({ message: 'Factura generada exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al generar la factura', error });
  }
});

// Listar todas las facturas
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT i.id, i.issue_date, i.due_date, i.status, i.total_amount, o.description AS order_description
      FROM invoices i
      JOIN orders o ON i.order_id = o.id
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las facturas', error });
  }
});

// Actualizar el estado de una factura
router.put('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    await pool.query('UPDATE invoices SET status = $1 WHERE id = $2', [status, id]);
    res.json({ message: 'Estado de la factura actualizado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la factura', error });
  }
});

// Eliminar una factura
router.delete('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query('DELETE FROM invoices WHERE id = $1', [id]);
    res.json({ message: 'Factura eliminada exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la factura', error });
  }
});

module.exports = router;