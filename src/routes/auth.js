const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../database/db');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

// Ruta para actualizar la contraseña
router.post('/change-password', authenticateToken, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    // Verificar si el usuario está autenticado
    const userId = req.user.userId;

    // Obtener el usuario desde la base de datos
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Verificar la contraseña actual
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Contraseña actual incorrecta' });
    }

    // Generar el nuevo hash de la contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Actualizar la contraseña en la base de datos
    await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, userId]);

    res.status(200).json({ message: 'Contraseña actualizada exitosamente' });
  } catch (error) {
    console.error('Error al cambiar la contraseña:', error);
    res.status(500).json({ message: 'Error al cambiar la contraseña' });
  }
});

module.exports = router;
