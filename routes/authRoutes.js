// controllers/authController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Usuario = require('../models/usuariosModels');

exports.login = async (req, res) => {
  const { cedula, password } = req.body;

  try {
    // Buscar usuario por cedula
    const user = await Usuario.findOne({ where: { cedula } });
    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    // Verificar la contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // Crear payload para el token JWT
    const payload = {
      usuarioId: user.id,
      role: user.rol,  // Asegúrate de que `user.rol` contiene el rol ('Admin' o 'Supervisor')
    };

    // Generar el token
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1d', // Token válido por 1 día
    });

    res.json({ token, role: user.rol });
  } catch (error) {
    console.error('Error en el inicio de sesión:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};
