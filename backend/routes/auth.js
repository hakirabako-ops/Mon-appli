const express    = require('express');
const bcrypt     = require('bcryptjs');
const jwt        = require('jsonwebtoken');
const db         = require('../db');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email et mot de passe requis.' });
  }

  db.query(
    'SELECT * FROM utilisateurs WHERE email = ?',
    [email],
    async (err, results) => {
      if (err) return res.status(500).json({ message: 'Erreur serveur.' });
      if (results.length === 0) {
        return res.status(401).json({ message: 'Identifiants incorrects.' });
      }

      const utilisateur = results[0];
      const match = await bcrypt.compare(password, utilisateur.password);
      if (!match) {
        return res.status(401).json({ message: 'Identifiants incorrects.' });
      }

      const token = jwt.sign(
        { id: utilisateur.id, email: utilisateur.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      res.json({
        token,
        utilisateur: {
          id:    utilisateur.id,
          nom:   utilisateur.nom,
          email: utilisateur.email,
        },
      });
    }
  );
});

// GET /api/auth/me
router.get('/me', verifyToken, (req, res) => {
  db.query(
    'SELECT id, nom, email FROM utilisateurs WHERE id = ?',
    [req.utilisateur.id],
    (err, results) => {
      if (err || results.length === 0) {
        return res.status(404).json({ message: 'Utilisateur introuvable.' });
      }
      res.json(results[0]);
    }
  );
});

module.exports = router;