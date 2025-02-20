const jwt = require('jsonwebtoken');
const User = require('../models/usuariosModels'); // Asegúrate de importar correctamente el modelo de Usuario

const login = async (req, res) => {
  const { username, password } = req.body;

  // Validar usuario y contraseña (simplificado)
  const user = await User.findOne({ where: { usuario: username } }); // Ajuste para Sequelize

  if (!user || user.password !== password) {
    return res.status(400).json({ message: 'Credenciales incorrectas' });
  }

  // Crear el token JWT con una duración de 6 meses (180 días)
  const token = jwt.sign({ id: user.id, role: user.rol }, process.env.JWT_SECRET, { expiresIn: '180d' });

  // Opcional: Configurar el token como una cookie
  res.cookie('authToken', token, {
    httpOnly: true,          // Impide que el token sea accesible desde JavaScript en el cliente
    maxAge: 180 * 24 * 60 * 60 * 1000, // Expiración de 180 días en milisegundos
    secure: process.env.NODE_ENV === 'production' // Solo en HTTPS en producción
  });

  res.json({ token });
};

module.exports = { login };

