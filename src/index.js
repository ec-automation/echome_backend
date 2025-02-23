import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import pool from './database/db.js';
import authenticateToken from './middleware/auth.js';
import userRoutes from './routes/users.js';
import clientRoutes from './routes/clients.js';
import orderRoutes from './routes/orders.js';
import invoiceRoutes from './routes/invoices.js';
import dashboardRoutes from './routes/dashboard.js';
import changePasswordRoutes from './routes/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para parsear JSON
app.use(express.json());

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', userRoutes);
app.use('/clients', clientRoutes);
app.use('/orders', orderRoutes);
app.use('/invoices', invoiceRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/auth', changePasswordRoutes);

// Servir archivos estáticos del frontend
app.use('/dashboard-visual', express.static('public/dashboard-visual'));
app.use('/login', express.static('public/login'));

// Ruta de login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    const user = result.rows[0];

    if (!user) return res.status(400).json({ message: 'Usuario no encontrado' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    const token = jwt.sign({ userId: user.id, role: user.role_id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

app.use('/dashboard-visual', express.static(path.join(__dirname, 'dashboard-visual'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    }
  }
}));

// Ruta protegida de prueba
app.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'Acceso permitido', user: req.user });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
