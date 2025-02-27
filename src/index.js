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
import { Server } from 'socket.io'; // Importar socket.io

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const PORT = process.env.PORT || 3001;

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


// Emit database update event
const emitDbUpdate = async () => {
  try {
    const usersCount = await pool.query('SELECT COUNT(*) FROM users');
    const companiesCount = await pool.query('SELECT COUNT(*) FROM companies');
    const productsCount = await pool.query('SELECT COUNT(*) FROM products');
    const ordersCount = await pool.query('SELECT COUNT(*) FROM orders');
    const invoicesCount = await pool.query('SELECT COUNT(*) FROM invoices');
    const clientsCount = await pool.query('SELECT COUNT(*) FROM clients');

    io.emit('db_update', {
      users: usersCount.rows[0].count,
      companies: companiesCount.rows[0].count,
      products: productsCount.rows[0].count,
      orders: ordersCount.rows[0].count,
      invoices: invoicesCount.rows[0].count,
      clients: clientsCount.rows[0].count,
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
  }
};
//emitDbUpdate();

// Crear el servidor HTTP
const server = app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
  emitDbUpdate();
});

// Configurar WebSockets con socket.io y habilitar CORS
const io = new Server(server, {
  cors: {
    origin: true, // Permite conexiones desde cualquier origen
    methods: ["GET", "POST"]
  }
});

console.log('Servidor WebSocket iniciado correctamente');

// Conexión de clientes WebSocket
io.on('connection', (socket) => {
  console.log('Un cliente se ha conectado', socket.id);

  // Escuchar eventos desde el cliente
  socket.on('disconnect', () => {
    console.log('Un cliente se ha desconectado', socket.id);
  });

  socket.on('message', (message) => {
    console.log('Mensaje recibido:', message);
    io.emit('message', message);
  });

  socket.on("get_cart_count", () => {
    const totalItems = 7; // Función que obtiene el total de ítems en BD
    console.log(" Enviando cantidad de ítems:", totalItems);
    socket.emit("cart_update", { type: "cart_update", totalItems });
  });
  

  socket.on('cart_update', (message) => {
    console.log(" Enviando cantidad de ítems:", totalItems);
    socket.emit("cart_update", { type: "cart_update", totalItems });
  });

  // Ejemplo de enviar un mensaje al cliente
  socket.emit('message', 'Conexión WebSocket exitosa');
});

setTimeout(() => {
  io.emit('message', 'backend_en_linea');
  console.log('backend_en_linea emitido');
}, 10000);


// Example: Emit updates periodically or after certain events
setInterval(emitDbUpdate, 60000); // Emit every 60 seconds

// Call emitDbUpdate after certain database operations, like adding a new order