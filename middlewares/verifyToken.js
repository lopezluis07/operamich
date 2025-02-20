// middlewares/verifyToken.js
const  jwt = require ('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  let token;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'No autorizado. No se proporcionó un token.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id, role: decoded.role }; // Asegúrate de que `id` es el `supervisor_id`
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Token inválido o caducado.' });
  }
};

module.exports = verifyToken;
