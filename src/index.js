require('dotenv').config();
const express = require('express');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const app = express(); // ⚠️ Inicialización de 'app'
const pool = require('./database/db');
const authenticateToken = require('./middleware/auth');
const PORT = process.env.PORT || 3000;
const userRoutes = require('./routes/users');
const clientRoutes = require('./routes/clients');
const orderRoutes = require('./routes/orders');
const invoiceRoutes = require('./routes/invoices');
const dashboardRoutes = require('./routes/dashboard');


// Middleware para parsear JSON
app.use(express.json());

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', userRoutes);
app.use('/clients', clientRoutes);
app.use('/orders', orderRoutes);
app.use('/invoices', invoiceRoutes);
// Rutas protegidas primero
app.use('/dashboard', dashboardRoutes);

// Luego servimos los archivos estáticos (frontend)
//app.use('/dashboard-view', express.static(path.join(__dirname, 'public', 'dashboard')));
app.use('/dashboard-visual', express.static(path.join(__dirname, 'public', 'dashboard')));


// Ruta de login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    const user = result.rows[0];

    if (!user) return res.status(400).json({ message: 'Usuario no encontrado' });

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) return res.status(403).json({ message: 'Contraseña incorrecta' });

    const token = jwt.sign({ userId: user.id, role: user.role_id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Ruta protegida de prueba
app.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'Acceso permitido', user: req.user });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
