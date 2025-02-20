// middlewares/roleAuth.js

const roleAuth = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(403).json({ message: 'No autorizado: usuario no autenticado' });
    }

    const userRole = req.user.role;  // Obtenemos el rol del usuario desde `req.user`

    // Verificamos si el rol del usuario está en los roles permitidos
    if (allowedRoles.includes(userRole)) {
      next();  // Si el rol es permitido, continuar
    } else {
      return res.status(403).json({ message: 'No autorizado: rol insuficiente' }); // Rechazar si el rol no es permitido
    }
  };
};

module.exports = roleAuth;
