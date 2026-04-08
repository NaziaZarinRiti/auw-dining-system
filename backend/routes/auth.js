// routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { users } = require('../data/db');

const JWT_SECRET = process.env.JWT_SECRET || 'auw-dining-secret-2024';

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { id, password } = req.body;
  if (!id || !password) return res.status(400).json({ error: 'ID and password required' });

  const user = users.find(u => u.id === id);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const valid = bcrypt.compareSync(password, user.password);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign(
    { id: user.id, name: user.name, userType: user.userType },
    JWT_SECRET,
    { expiresIn: '8h' }
  );

  const { password: _, ...safeUser } = user;
  res.json({ token, user: safeUser });
});

// GET /api/auth/me
router.get('/me', require('../middleware/auth'), (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const { password: _, ...safeUser } = user;
  res.json(safeUser);
});

// PUT /api/auth/profile
router.put('/profile', require('../middleware/auth'), (req, res) => {
  const idx = users.findIndex(u => u.id === req.user.id);
  if (idx === -1) return res.status(404).json({ error: 'User not found' });

  const allowed = ['foodPreference', 'allergies', 'email'];
  allowed.forEach(field => {
    if (req.body[field] !== undefined) users[idx][field] = req.body[field];
  });

  const { password: _, ...safeUser } = users[idx];
  res.json(safeUser);
});

module.exports = router;
