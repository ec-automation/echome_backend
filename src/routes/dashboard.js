import express from 'express';
import pool from '../database/db.js';
import authenticateToken from '../middleware/auth.js';

const router = express.Router();

// Get data for dashboard chart
router.get('/chart-data', authenticateToken, async (req, res) => {
  try {
    const usersCount = await pool.query('SELECT COUNT(*) FROM users');
    const companiesCount = await pool.query('SELECT COUNT(*) FROM companies');
    const productsCount = await pool.query('SELECT COUNT(*) FROM products');
    const ordersCount = await pool.query('SELECT COUNT(*) FROM orders');
    const invoicesCount = await pool.query('SELECT COUNT(*) FROM invoices');
    const clientsCount = await pool.query('SELECT COUNT(*) FROM clients');

    res.status(200).json({
      users: usersCount.rows[0].count,
      companies: companiesCount.rows[0].count,
      products: productsCount.rows[0].count,
      orders: ordersCount.rows[0].count,
      invoices: invoicesCount.rows[0].count,
      clients: clientsCount.rows[0].count,
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ message: 'Error fetching dashboard data' });
  }
});

export default router;