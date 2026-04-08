// routes/payment.js
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const auth = require('../middleware/auth');
const { tokens, payments, users, pricing } = require('../data/db');

// GET /api/payment/bill - get 10-day bill summary
router.get('/bill', auth, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  // Residential students don't pay
  if (user.userType === 'residential') {
    return res.json({ billRequired: false, message: 'Residential students have meals included' });
  }

  // Get last 10 days tokens
  const now = new Date();
  const tenDaysAgo = new Date(now);
  tenDaysAgo.setDate(now.getDate() - 10);

  const myTokens = tokens.filter(t => {
    const tokenDate = new Date(t.date);
    return t.userId === req.user.id &&
           t.status !== 'cancelled' &&
           tokenDate >= tenDaysAgo && tokenDate <= now;
  });

  const billItems = myTokens.map(t => ({
    date: t.date,
    dayName: t.dayName,
    mealType: t.mealType,
    price: t.price,
    tokenId: t.tokenNumber,
    status: t.status
  }));

  const total = billItems.reduce((sum, item) => sum + item.price, 0);

  // Check existing payments for this period
  const paid = payments
    .filter(p => p.userId === req.user.id)
    .reduce((sum, p) => sum + p.amount, 0);

  const due = Math.max(0, total - paid);

  res.json({
    billRequired: true,
    userType: user.userType,
    billItems,
    total,
    paid,
    due,
    currency: 'BDT',
    period: { from: tenDaysAgo.toDateString(), to: now.toDateString() }
  });
});

// POST /api/payment/pay
router.post('/pay', auth, (req, res) => {
  const { amount, method, reference } = req.body;
  const user = users.find(u => u.id === req.user.id);

  if (!user) return res.status(404).json({ error: 'User not found' });
  if (user.userType === 'residential') {
    return res.status(400).json({ error: 'Residential students do not have payment obligations' });
  }
  if (!amount || amount <= 0) return res.status(400).json({ error: 'Invalid amount' });

  const payment = {
    id: uuidv4(),
    paymentId: `PAY-${Date.now().toString().slice(-8)}`,
    userId: req.user.id,
    userName: user.name,
    userType: user.userType,
    amount: Number(amount),
    method: method || 'cash',
    reference: reference || '',
    status: 'completed',
    paidAt: new Date().toISOString()
  };

  payments.push(payment);
  res.status(201).json({ payment, message: 'Payment recorded successfully' });
});

// GET /api/payment/history
router.get('/history', auth, (req, res) => {
  const myPayments = payments.filter(p => p.userId === req.user.id);
  res.json(myPayments);
});

module.exports = router;
