import express from 'express';
import pool from '../database/db.js';
import authenticateToken from '../middleware/auth.js';

const router = express.Router();

// Obtener todos los clientes
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM clients');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error al obtener los clientes:', error);
    res.status(500).json({ message: 'Error al obtener los clientes' });
  }
});

// Crear un nuevo cliente
router.post('/', authenticateToken, async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: 'Nombre y email son obligatorios' });
  }

  try {
    await pool.query('INSERT INTO clients (name, email) VALUES ($1, $2)', [name, email]);
    res.status(201).json({ message: 'Cliente creado exitosamente' });
  } catch (error) {
    console.error('Error al crear el cliente:', error);
    res.status(500).json({ message: 'Error al crear el cliente' });
  }
});

// Actualizar cliente
router.put('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: 'Nombre y email son obligatorios' });
  }

  try {
    const result = await pool.query('UPDATE clients SET name = $1, email = $2 WHERE id = $3 RETURNING *', [name, email, id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }
    res.status(200).json({ message: 'Cliente actualizado exitosamente' });
  } catch (error) {
    console.error('Error al actualizar el cliente:', error);
    res.status(500).json({ message: 'Error al actualizar el cliente' });
  }
});

// Eliminar cliente
router.delete('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM clients WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }
    res.status(200).json({ message: 'Cliente eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar el cliente:', error);
    res.status(500).json({ message: 'Error al eliminar el cliente' });
  }
});

// Generar una nueva factura a partir de una orden existente
router.post('/invoices', authenticateToken, async (req, res) => {
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

// Crear una nueva orden
router.post('/orders', authenticateToken, async (req, res) => {
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

export default router;
