// server.js
const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const { users, weeklyMenu, notifications } = require('./data/db');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── MIDDLEWARE ────────────────────────────────────────────────────────────────
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:3000'], credentials: true }));
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ─── ROUTES ────────────────────────────────────────────────────────────────────
app.use('/api/auth', require('./routes/auth'));
app.use('/api/dining', require('./routes/dining'));
app.use('/api/payment', require('./routes/payment'));
app.use('/api/feedback', require('./routes/feedback'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString(), service: 'AUW Dining API' });
});

// ─── CRON: SEND 3-DAY MENU NOTIFICATION DAILY AT 7AM ─────────────────────────
cron.schedule('0 7 * * *', () => {
  const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const upcoming = {};
  for (let i = 1; i <= 3; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const day = days[d.getDay()];
    upcoming[day] = weeklyMenu[day];
  }

  const notification = {
    id: Date.now(),
    type: 'menu_preview',
    title: '3-Day Menu Preview',
    menu: upcoming,
    sentAt: new Date().toISOString(),
    recipients: users.length
  };

  notifications.push(notification);
  console.log(`[CRON] 3-day menu notification sent to ${users.length} users at ${notification.sentAt}`);
});

// ─── 404 HANDLER ──────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ─── ERROR HANDLER ────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// ─── START ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🍽️  AUW Dining Management System`);
  console.log(`✅  Server running on http://localhost:${PORT}`);
  console.log(`📋  API docs: http://localhost:${PORT}/api/health\n`);
});
