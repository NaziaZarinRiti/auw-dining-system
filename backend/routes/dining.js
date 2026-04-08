// routes/dining.js
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const auth = require('../middleware/auth');
const { weeklyMenu, pricing, users, tokens } = require('../data/db');

// Helper: get today's day name
const getDay = (offset = 0) => {
  const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return days[d.getDay()];
};

// GET /api/dining/menu - today + next 3 days menu
router.get('/menu', auth, (req, res) => {
  const menu = {};
  for (let i = 0; i < 4; i++) {
    const day = getDay(i);
    menu[day] = weeklyMenu[day] || weeklyMenu['Monday'];
  }
  res.json({ menu, pricing });
});

// GET /api/dining/menu/week
router.get('/menu/week', auth, (req, res) => {
  res.json({ menu: weeklyMenu, pricing });
});

// GET /api/dining/tokens - my tokens today
router.get('/tokens', auth, (req, res) => {
  const today = new Date().toDateString();
  const myTokens = tokens.filter(t => t.userId === req.user.id);
  res.json(myTokens);
});

// POST /api/dining/signup - sign up for a meal
router.post('/signup', auth, (req, res) => {
  const { mealType, date } = req.body; // mealType: breakfast|lunch|dinner
  if (!['breakfast','lunch','dinner'].includes(mealType)) {
    return res.status(400).json({ error: 'Invalid meal type' });
  }

  const user = users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const targetDate = date ? new Date(date).toDateString() : new Date().toDateString();

  // One token per meal per day rule
  const existing = tokens.find(
    t => t.userId === req.user.id && t.mealType === mealType && t.date === targetDate
  );
  if (existing) {
    return res.status(409).json({ error: 'You already have a token for this meal today' });
  }

  // Get day and check allergens
  const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const d = date ? new Date(date) : new Date();
  const dayName = days[d.getDay()];
  const dayMenu = weeklyMenu[dayName] || weeklyMenu['Monday'];
  const mealMenu = dayMenu[mealType];
  const menuAllergens = mealMenu ? mealMenu.allergens : [];
  const userAllergies = user.allergies || [];
  const conflicts = userAllergies.filter(a => menuAllergens.includes(a));

  // Compute price
  const price = pricing[mealType][user.userType] || 0;

  const token = {
    id: uuidv4(),
    tokenNumber: `AUW-${mealType.toUpperCase().substring(0,1)}-${Date.now().toString().slice(-6)}`,
    userId: user.id,
    userName: user.name,
    userType: user.userType,
    mealType,
    date: targetDate,
    dayName,
    foodPreference: user.foodPreference,
    allergyWarning: conflicts,
    price,
    status: 'active',
    issuedAt: new Date().toISOString()
  };

  tokens.push(token);
  res.status(201).json({ token, allergyWarning: conflicts });
});

// DELETE /api/dining/tokens/:id - cancel token
router.delete('/tokens/:id', auth, (req, res) => {
  const idx = tokens.findIndex(t => t.id === req.params.id && t.userId === req.user.id);
  if (idx === -1) return res.status(404).json({ error: 'Token not found' });
  tokens[idx].status = 'cancelled';
  res.json({ message: 'Token cancelled' });
});

// GET /api/dining/notify - get 3-day menu notification
router.get('/notify', auth, (req, res) => {
  const upcoming = {};
  for (let i = 1; i <= 3; i++) {
    const day = getDay(i);
    upcoming[day] = weeklyMenu[day] || weeklyMenu['Monday'];
  }
  res.json({
    message: 'Upcoming 3-day menu',
    menu: upcoming,
    sentAt: new Date().toISOString()
  });
});

module.exports = router;
