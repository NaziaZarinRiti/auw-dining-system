// routes/feedback.js
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const auth = require('../middleware/auth');
const { feedbacks, users } = require('../data/db');

// POST /api/feedback
router.post('/', auth, (req, res) => {
  const { mealType, date, rating, category, comment, tags } = req.body;
  const user = users.find(u => u.id === req.user.id);

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Rating must be between 1 and 5' });
  }

  const fb = {
    id: uuidv4(),
    userId: req.user.id,
    userName: user ? user.name : 'Anonymous',
    userType: user ? user.userType : 'unknown',
    mealType: mealType || 'general',
    date: date || new Date().toDateString(),
    rating: Number(rating),
    category: category || 'general',
    comment: comment || '',
    tags: tags || [],
    submittedAt: new Date().toISOString()
  };

  feedbacks.push(fb);
  res.status(201).json({ feedback: fb, message: 'Feedback submitted. Thank you!' });
});

// GET /api/feedback/summary - aggregate stats
router.get('/summary', auth, (req, res) => {
  if (!feedbacks.length) return res.json({ total: 0, average: 0, breakdown: {} });

  const total = feedbacks.length;
  const avgRating = feedbacks.reduce((s, f) => s + f.rating, 0) / total;

  const breakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  feedbacks.forEach(f => breakdown[f.rating]++);

  const byMeal = {};
  feedbacks.forEach(f => {
    if (!byMeal[f.mealType]) byMeal[f.mealType] = { total: 0, sum: 0 };
    byMeal[f.mealType].total++;
    byMeal[f.mealType].sum += f.rating;
  });

  Object.keys(byMeal).forEach(k => {
    byMeal[k].avg = (byMeal[k].sum / byMeal[k].total).toFixed(1);
  });

  res.json({ total, average: avgRating.toFixed(1), breakdown, byMeal });
});

// GET /api/feedback/mine
router.get('/mine', auth, (req, res) => {
  const mine = feedbacks.filter(f => f.userId === req.user.id);
  res.json(mine);
});

module.exports = router;
