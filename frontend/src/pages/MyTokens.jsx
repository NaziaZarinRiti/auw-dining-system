// src/pages/MyTokens.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';

const MEAL_INFO = {
  breakfast: { icon: '🌅', time: '7:00 AM – 9:00 AM' },
  lunch:     { icon: '☀️', time: '12:00 PM – 2:00 PM' },
  dinner:    { icon: '🌙', time: '7:00 PM – 9:00 PM' }
};

export default function MyTokens() {
  const { user } = useAuth();
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    api.get('/dining/tokens').then(res => setTokens(res.data)).finally(() => setLoading(false));
  }, []);

  const handleCancel = async (tokenId) => {
    if (!window.confirm('Cancel this token?')) return;
    await api.delete(`/dining/tokens/${tokenId}`);
    setTokens(ts => ts.map(t => t.id === tokenId ? { ...t, status: 'cancelled' } : t));
  };

  const filtered = tokens.filter(t => filter === 'all' || t.status === filter);
  const today = new Date().toDateString();

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><div className="loading-spinner" style={{ width: 36, height: 36, borderWidth: 3 }} /></div>;

  return (
    <div>
      <div className="page-header">
        <h1>My Tokens</h1>
        <p>All dining tokens issued to you</p>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {['all','active','cancelled'].map(f => (
          <button key={f} className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter(f)} style={{ textTransform: 'capitalize' }}>{f}</button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🎫</div>
          <div className="empty-state-text">No tokens found</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 14 }}>
          {filtered.map(token => (
            <div key={token.id} className="token-card" style={{
              opacity: token.status === 'cancelled' ? 0.6 : 1,
              position: 'relative'
            }}>
              {token.status === 'cancelled' && (
                <div style={{
                  position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  zIndex: 2
                }}>
                  <div style={{
                    transform: 'rotate(-20deg)', fontSize: 32, fontWeight: 900, color: 'var(--crimson)',
                    border: '3px solid var(--crimson)', padding: '4px 16px', borderRadius: 4, opacity: 0.5
                  }}>CANCELLED</div>
                </div>
              )}

              {token.userType === 'dayscholar' && (
                <div className="token-dayscholar-label">⚡ Day Scholar Token</div>
              )}
              {token.userType === 'faculty' && (
                <div className="token-dayscholar-label" style={{ background: 'var(--gold-light)', color: '#7B5800' }}>
                  🎓 Faculty Token
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div className="token-number">{token.tokenNumber}</div>
                  <div style={{ fontSize: 13, color: 'var(--gray-600)', marginTop: 2 }}>{token.userName} · {token.id}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, fontSize: 18, textTransform: 'capitalize' }}>
                    {MEAL_INFO[token.mealType]?.icon} {token.mealType}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--gray-400)' }}>{token.date}</div>
                  {token.date === today && <span className="badge badge-success" style={{ marginTop: 4 }}>Today</span>}
                </div>
              </div>

              <hr className="divider" style={{ margin: '10px 0' }} />

              <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                <span className={`badge badge-${token.foodPreference === 'veg' ? 'veg' : 'nonveg'}`}>
                  {token.foodPreference === 'veg' ? '🟢 Veg' : '🔴 Non-Veg'}
                </span>
                <span style={{ fontSize: 12, color: 'var(--gray-400)' }}>{MEAL_INFO[token.mealType]?.time}</span>
                {token.price > 0 && <span className="badge" style={{ background: 'var(--gold-light)', color: '#7B5800' }}>৳{token.price}</span>}
                <span className={`badge ${token.status === 'active' ? 'badge-success' : 'badge-danger'}`} style={{ marginLeft: 'auto', textTransform: 'capitalize' }}>
                  {token.status}
                </span>
                {token.status === 'active' && token.date === today && (
                  <button className="btn btn-sm" style={{ background: 'var(--nonveg-light)', color: 'var(--nonveg-red)', border: 'none' }}
                    onClick={() => handleCancel(token.id)}>Cancel</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
