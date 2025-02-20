const jwt = require('jsonwebtoken');

// Middleware de autenticación
const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  let token;

  // Extraer el token del encabezado
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else {
    return res.status(401).json({ message: 'No autorizado. Token no proporcionado.' });
  }

  try {
    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Confirmar que el token contiene los datos esperados
    if (!decoded.usuarioId) {
      return res.status(400).json({ message: 'El token no contiene un ID de usuario.' });
    }

    // Agregar los datos del usuario autenticado al request
    req.user = {
      id: decoded.usuarioId,
      role: decoded.role || 'user', // Rol opcional con valor predeterminado
    };

    console.log("Usuario autenticado:", req.user); // Depuración

    next(); // Continuar al siguiente middleware o controlador
  } catch (error) {
    console.error("Error en el middleware auth:", error.message);

    // Responder con un error específico según el tipo de problema
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({ message: 'El token ha caducado.' });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ message: 'Token inválido.' });
    }

    // Responder con un error genérico para otros casos
    return res.status(403).json({ message: 'Error al validar el token.' });
  }
};

module.exports = auth;
