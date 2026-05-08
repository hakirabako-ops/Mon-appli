const jwt = require('jsonwebtoken');

module.exports = function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ message: 'Token manquant.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.utilisateur = decoded;
    next();
  } catch {
    return res.status(403).json({ message: 'Token invalide ou expiré.' });
  }
};