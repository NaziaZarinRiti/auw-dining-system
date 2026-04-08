// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [menu, setMenu] = useState(null);
  const [tokens, setTokens] = useState([]);
  const [bill, setBill] = useState(null);
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/dining/menu'),
      api.get('/dining/tokens'),
      user?.userType !== 'residential' ? api.get('/payment/bill') : Promise.resolve(null),
      api.get('/dining/notify')
    ]).then(([menuRes, tokensRes, billRes, notifyRes]) => {
      setMenu(menuRes.data);
      setTokens(tokensRes.data);
      if (billRes) setBill(billRes.data);
      setNotification(notifyRes.data);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const today = new Date();
  const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const todayName = days[today.getDay()];
  const todayMenu = menu?.menu?.[todayName];

  const todayTokens = tokens.filter(t => t.date === today.toDateString() && t.status === 'active');
  const mealsLeft = ['breakfast','lunch','dinner'].filter(m => !todayTokens.find(t => t.mealType === m));

  const greeting = () => {
    const h = today.getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <div style={{ textAlign: 'center' }}>
        <div className="loading-spinner" style={{ width: 36, height: 36, borderWidth: 3 }} />
        <div style={{ marginTop: 12, color: 'var(--gray-400)' }}>Loading your dashboard...</div>
      </div>
    </div>
  );

  return (
    <div>
      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, var(--crimson-dark) 0%, var(--crimson) 60%, #e84060 100%)',
        borderRadius: 'var(--radius-lg)',
        padding: '28px 32px',
        color: '#fff',
        marginBottom: 24,
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', right: -20, top: -20, width: 160, height: 160, background: 'rgba(255,255,255,0.06)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', right: 40, bottom: -40, width: 100, height: 100, background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />
        <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 4 }}>{greeting()},</div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 700, marginBottom: 6 }}>
          {user?.name} 👋
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 10 }}>
          <span style={{ background: 'rgba(255,255,255,0.18)', padding: '4px 12px', borderRadius: 20, fontSize: 13 }}>
            🎓 {user?.academicYear}
          </span>
          <span style={{ background: 'rgba(255,255,255,0.18)', padding: '4px 12px', borderRadius: 20, fontSize: 13, textTransform: 'capitalize' }}>
            🏠 {user?.userType}
          </span>
          <span style={{ background: 'rgba(255,255,255,0.18)', padding: '4px 12px', borderRadius: 20, fontSize: 13 }}>
            {user?.foodPreference === 'veg' ? '🟢 Vegetarian' : '🔴 Non-Vegetarian'}
          </span>
        </div>
      </div>

      {/* 3-Day Menu Notification */}
      {notification && (
        <div className="alert alert-info" style={{ marginBottom: 20 }}>
          <div>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>🔔 Upcoming 3-Day Menu Preview</div>
            <div style={{ fontSize: 13 }}>
              {Object.keys(notification.menu).slice(0,3).map(day => (
                <span key={day} style={{ marginRight: 16 }}>
                  <b>{day}:</b> {notification.menu[day]?.lunch?.[user?.foodPreference]?.[0] || '—'} & more
                </span>
              ))}
            </div>
            <button className="btn btn-sm" style={{ marginTop: 8, background: 'rgba(13,71,161,0.1)', border: '1px solid #90CAF9', color: '#0D47A1' }}
              onClick={() => navigate('/menu')}>View Full Menu →</button>
          </div>
        </div>
      )}

      {/* Stats Row */}
      <div className="stats-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card" style={{ borderLeft: '3px solid var(--crimson)' }}>
          <div className="stat-label">Today's Tokens</div>
          <div className="stat-value" style={{ color: 'var(--crimson)' }}>{todayTokens.length}</div>
          <div className="stat-sub">of 3 meals</div>
        </div>
        <div className="stat-card" style={{ borderLeft: '3px solid var(--gold)' }}>
          <div className="stat-label">Meals Remaining</div>
          <div className="stat-value" style={{ color: 'var(--gold)' }}>{mealsLeft.length}</div>
          <div className="stat-sub">{mealsLeft.join(', ') || 'All done today!'}</div>
        </div>
        {bill && (
          <div className="stat-card" style={{ borderLeft: '3px solid var(--info)' }}>
            <div className="stat-label">Amount Due</div>
            <div className="stat-value" style={{ color: bill.due > 0 ? 'var(--crimson)' : 'var(--success)' }}>
              ৳{bill.due}
            </div>
            <div className="stat-sub">10-day bill</div>
          </div>
        )}
        <div className="stat-card" style={{ borderLeft: '3px solid #6A1B9A' }}>
          <div className="stat-label">Allergies on File</div>
          <div className="stat-value" style={{ color: '#6A1B9A' }}>{user?.allergies?.length || 0}</div>
          <div className="stat-sub">{user?.allergies?.join(', ') || 'None recorded'}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Today's Menu */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Today's Menu</div>
              <div className="card-subtitle">{todayName}</div>
            </div>
            <button className="btn btn-sm btn-secondary" onClick={() => navigate('/menu')}>Full Menu</button>
          </div>
          {todayMenu ? (
            ['breakfast','lunch','dinner'].map(meal => {
              const mealData = todayMenu[meal];
              const pref = user?.foodPreference || 'veg';
              const items = mealData?.[pref] || [];
              return (
                <div key={meal} style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 16 }}>{meal === 'breakfast' ? '🌅' : meal === 'lunch' ? '☀️' : '🌙'}</span>
                    <span style={{ fontWeight: 600, textTransform: 'capitalize', fontSize: 14 }}>{meal}</span>
                    <span className={`badge badge-${pref === 'veg' ? 'veg' : 'nonveg'}`} style={{ fontSize: 10 }}>
                      {pref === 'veg' ? '🟢' : '🔴'}
                    </span>
                  </div>
                  <div className="menu-item-list">
                    {items.slice(0,3).map((item, i) => (
                      <span key={i} className={`menu-tag menu-tag-${pref === 'veg' ? 'veg' : 'nonveg'}`}>{item}</span>
                    ))}
                    {items.length > 3 && <span className="menu-tag" style={{ background: 'var(--gray-100)', color: 'var(--gray-600)' }}>+{items.length-3} more</span>}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="empty-state"><div className="empty-state-icon">🍽️</div><div>Menu not available</div></div>
          )}
        </div>

        {/* Quick Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="card" style={{ flex: 1 }}>
            <div className="card-header">
              <div className="card-title">Quick Actions</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                { icon: '🍽️', label: 'Sign Up for Meal', path: '/dining', color: 'var(--crimson)' },
                { icon: '🎫', label: 'View My Tokens', path: '/tokens', color: '#1565C0' },
                { icon: '💳', label: 'Pay Bill', path: '/payment', color: '#2E7D32' },
                { icon: '⭐', label: 'Give Feedback', path: '/feedback', color: '#F57F17' },
              ].map(action => (
                <button
                  key={action.path}
                  onClick={() => navigate(action.path)}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    gap: 8, padding: '16px 8px', borderRadius: 10,
                    border: `1.5px solid ${action.color}20`,
                    background: `${action.color}08`,
                    cursor: 'pointer', transition: 'all 0.18s', fontSize: 13,
                    fontWeight: 500, color: action.color
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = `${action.color}15`; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = `${action.color}08`; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  <span style={{ fontSize: 24 }}>{action.icon}</span>
                  {action.label}
                </button>
              ))}
            </div>
          </div>

          {/* Today's tokens summary */}
          <div className="card">
            <div className="card-title" style={{ marginBottom: 12 }}>Today's Tokens</div>
            {todayTokens.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '12px 0', color: 'var(--gray-400)', fontSize: 13 }}>
                No tokens issued today. <button className="btn btn-sm btn-primary" style={{ marginLeft: 8 }} onClick={() => navigate('/dining')}>Sign Up</button>
              </div>
            ) : (
              todayTokens.map(t => (
                <div key={t.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--gray-100)' }}>
                  <span style={{ fontWeight: 600, textTransform: 'capitalize' }}>{t.mealType}</span>
                  <span style={{ fontFamily: 'monospace', fontSize: 13, color: 'var(--crimson)' }}>{t.tokenNumber}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
