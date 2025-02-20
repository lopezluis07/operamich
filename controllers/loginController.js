const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize'); // Asegúrate de tener esta línea
const Usuario = require('../models/usuariosModels');

exports.login = async (req, res) => {
  const { identificador, password } = req.body;

  try {

    // Buscar al usuario por cédula o nombre de usuario
    const usuario = await Usuario.findOne({
      where: {
        [Op.or]: [{ cedula: identificador }, { usuario: identificador }]
      }
    });

    if (!usuario) {
      console.error('Usuario no encontrado');
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    // Verificar la contraseña
    const isPasswordValid = await bcrypt.compare(password, usuario.password);
    if (!isPasswordValid) {
      console.error('Contraseña incorrecta');
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // Generar el token JWT si la contraseña es válida
    const token = jwt.sign(
      { 
        usuarioId: usuario.id,
        role: usuario.rol 
      },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    return res.status(200).json({ token });
  } catch (error) {
    console.error('Error en el controlador del login:', error.message, error.stack);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};
