const express = require('express');
const pool = require('../database/db');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
    try {
      const [users, clients, orders, invoices] = await Promise.all([
        pool.query('SELECT COUNT(*) FROM users'),
        pool.query('SELECT COUNT(*) FROM clients'),
        pool.query('SELECT COUNT(*) FROM orders'),
        pool.query('SELECT COUNT(*) AS total_invoices, COALESCE(SUM(total_amount), 0) AS total_amount FROM invoices')
      ]);
  
      res.setHeader('Content-Type', 'application/json'); // Forzar respuesta JSON
      res.status(200).json({
        total_users: parseInt(users.rows[0].count),
        total_clients: parseInt(clients.rows[0].count),
        total_orders: parseInt(orders.rows[0].count),
        total_invoices: parseInt(invoices.rows[0].total_invoices),
        total_billed: parseFloat(invoices.rows[0].total_amount)
      });
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener los datos del dashboard', error });
    }
  });
  
  

module.exports = router;
