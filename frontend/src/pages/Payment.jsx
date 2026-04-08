// src/pages/Payment.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';

const METHODS = [
  { id: 'bkash', label: 'bKash', icon: '📱', color: '#E91E63' },
  { id: 'nagad', label: 'Nagad', icon: '💰', color: '#F57C00' },
  { id: 'card', label: 'Debit / Credit Card', icon: '💳', color: '#1565C0' },
  { id: 'cash', label: 'Cash at Counter', icon: '💵', color: '#2E7D32' },
];

export default function Payment() {
  const { user } = useAuth();
  const [bill, setBill] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [method, setMethod] = useState('bkash');
  const [amount, setAmount] = useState('');
  const [reference, setReference] = useState('');
  const [paying, setPaying] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState('');

  const load = () => {
    Promise.all([api.get('/payment/bill'), api.get('/payment/history')])
      .then(([billRes, histRes]) => {
        setBill(billRes.data);
        setHistory(histRes.data);
        if (billRes.data?.due > 0) setAmount(String(billRes.data.due));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handlePay = async () => {
    if (!amount || Number(amount) <= 0) { setError('Enter a valid amount.'); return; }
    setPaying(true); setError('');
    try {
      const res = await api.post('/payment/pay', { amount: Number(amount), method, reference });
      setSuccess(res.data.payment);
      load();
      setReference('');
    } catch (err) {
      setError(err.response?.data?.error || 'Payment failed.');
    } finally {
      setPaying(false);
    }
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><div className="loading-spinner" style={{ width: 36, height: 36, borderWidth: 3 }} /></div>;

  if (bill?.billRequired === false) {
    return (
      <div>
        <div className="page-header"><h1>Payment</h1></div>
        <div className="card" style={{ textAlign: 'center', padding: 48 }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🏠</div>
          <h2 style={{ fontFamily: 'var(--font-display)' }}>No Payment Required</h2>
          <p style={{ color: 'var(--gray-400)', marginTop: 8 }}>
            As a residential student, your meals are included in your accommodation fees.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1>Payment</h1>
        <p>Pay your dining bills for the past 10 days</p>
      </div>

      {success && (
        <div className="alert alert-success" style={{ marginBottom: 20 }}>
          ✅ Payment of ৳{success.amount} via {success.method} recorded! Receipt ID: <b>{success.paymentId}</b>
          <button style={{ marginLeft: 12, background: 'none', border: 'none', color: 'var(--success)', cursor: 'pointer' }}
            onClick={() => setSuccess(null)}>✕</button>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 20 }}>
        {/* Bill Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Summary */}
          <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
            <div className="stat-card" style={{ borderLeft: '3px solid var(--crimson)' }}>
              <div className="stat-label">Total Bill</div>
              <div className="stat-value">৳{bill?.total || 0}</div>
              <div className="stat-sub">10-day period</div>
            </div>
            <div className="stat-card" style={{ borderLeft: '3px solid var(--success)' }}>
              <div className="stat-label">Paid</div>
              <div className="stat-value" style={{ color: 'var(--success)' }}>৳{bill?.paid || 0}</div>
            </div>
            <div className="stat-card" style={{ borderLeft: `3px solid ${bill?.due > 0 ? 'var(--crimson)' : 'var(--success)'}` }}>
              <div className="stat-label">Amount Due</div>
              <div className="stat-value" style={{ color: bill?.due > 0 ? 'var(--crimson)' : 'var(--success)' }}>
                ৳{bill?.due || 0}
              </div>
              <div className="stat-sub">{bill?.due === 0 ? '✅ Fully paid' : 'Outstanding'}</div>
            </div>
          </div>

          {/* Bill Items Table */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">Bill Breakdown</div>
              <div className="card-subtitle">{bill?.period?.from} – {bill?.period?.to}</div>
            </div>
            {bill?.billItems?.length === 0 ? (
              <div className="empty-state"><div className="empty-state-icon">🧾</div><div>No meals in this period</div></div>
            ) : (
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Day</th>
                      <th>Meal</th>
                      <th>Token</th>
                      <th style={{ textAlign: 'right' }}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bill?.billItems?.map((item, i) => (
                      <tr key={i}>
                        <td style={{ fontSize: 13 }}>{item.date}</td>
                        <td style={{ fontSize: 13 }}>{item.dayName}</td>
                        <td style={{ textTransform: 'capitalize', fontWeight: 500 }}>{item.mealType}</td>
                        <td style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--crimson)' }}>{item.tokenId}</td>
                        <td style={{ textAlign: 'right', fontWeight: 600 }}>৳{item.price}</td>
                      </tr>
                    ))}
                    <tr style={{ fontWeight: 700, background: 'var(--gray-50)' }}>
                      <td colSpan={4} style={{ textAlign: 'right', paddingRight: 16 }}>Total</td>
                      <td style={{ textAlign: 'right', color: 'var(--crimson)', fontSize: 16 }}>৳{bill?.total}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Payment History */}
          {history.length > 0 && (
            <div className="card">
              <div className="card-title" style={{ marginBottom: 14 }}>Payment History</div>
              <div className="table-wrapper">
                <table>
                  <thead><tr><th>Date</th><th>Method</th><th>Receipt ID</th><th style={{ textAlign: 'right' }}>Amount</th></tr></thead>
                  <tbody>
                    {history.map(p => (
                      <tr key={p.id}>
                        <td style={{ fontSize: 13 }}>{new Date(p.paidAt).toLocaleDateString()}</td>
                        <td style={{ textTransform: 'capitalize' }}>{p.method}</td>
                        <td style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--gray-600)' }}>{p.paymentId}</td>
                        <td style={{ textAlign: 'right', fontWeight: 600, color: 'var(--success)' }}>৳{p.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Payment Form */}
        <div className="card" style={{ alignSelf: 'flex-start', position: 'sticky', top: 80 }}>
          <div className="card-title" style={{ marginBottom: 4 }}>Make Payment</div>
          <div className="card-subtitle" style={{ marginBottom: 20 }}>
            {user?.userType === 'faculty' ? 'Faculty meal payment' : 'Day scholar meal payment'}
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          {/* Amount */}
          <div className="form-group">
            <div className="form-label">Amount (BDT ৳)</div>
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
              className="form-input" placeholder="0.00" min="1" />
            {bill?.due > 0 && (
              <button style={{ fontSize: 12, color: 'var(--crimson)', background: 'none', border: 'none', cursor: 'pointer', marginTop: 4 }}
                onClick={() => setAmount(String(bill.due))}>
                Pay full due amount ৳{bill.due}
              </button>
            )}
          </div>

          {/* Payment Method */}
          <div className="form-group">
            <div className="form-label">Payment Method</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {METHODS.map(m => (
                <button key={m.id} onClick={() => setMethod(m.id)} style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px',
                  border: `2px solid ${method === m.id ? m.color : 'var(--gray-200)'}`,
                  borderRadius: 8, background: method === m.id ? `${m.color}12` : 'var(--white)',
                  cursor: 'pointer', fontSize: 13, fontWeight: method === m.id ? 600 : 400,
                  color: method === m.id ? m.color : 'var(--gray-600)', transition: 'all 0.15s'
                }}>
                  <span>{m.icon}</span> {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Reference */}
          {method !== 'cash' && (
            <div className="form-group">
              <div className="form-label">Transaction Reference (optional)</div>
              <input type="text" value={reference} onChange={e => setReference(e.target.value)}
                className="form-input" placeholder="TXN ID / Reference number" />
            </div>
          )}

          <button className="btn btn-primary" style={{ width: '100%', padding: '13px' }}
            onClick={handlePay} disabled={paying || !amount || Number(amount) <= 0}>
            {paying ? <span className="loading-spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> : `💳 Pay ৳${amount || '0'}`}
          </button>

          <div style={{ marginTop: 14, padding: 12, background: 'var(--gray-50)', borderRadius: 8, fontSize: 12, color: 'var(--gray-400)' }}>
            🔒 Payments are processed securely. Residential students have no payment obligations.
          </div>
        </div>
      </div>
    </div>
  );
}
