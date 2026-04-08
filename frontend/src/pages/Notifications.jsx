// src/pages/Notifications.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';

export default function Notifications() {
  const { user } = useAuth();
  const [notify, setNotify] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dining/notify').then(r => setNotify(r.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><div className="loading-spinner" style={{ width: 36, height: 36, borderWidth: 3 }} /></div>;

  const pref = user?.foodPreference || 'veg';

  return (
    <div>
      <div className="page-header">
        <h1>Notifications</h1>
        <p>Menu previews and dining updates</p>
      </div>

      <div className="alert alert-info" style={{ marginBottom: 20 }}>
        🔔 A 3-day menu preview is automatically sent to all users every morning at 7:00 AM.
      </div>

      {notify && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">📅 Upcoming 3-Day Menu Preview</div>
            <div className="card-subtitle">Sent: {new Date(notify.sentAt).toLocaleString()}</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {Object.entries(notify.menu).map(([day, dayMenu]) => (
              <div key={day} style={{ padding: 16, background: 'var(--gray-50)', borderRadius: 10, border: '1px solid var(--gray-200)' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, marginBottom: 12, color: 'var(--crimson)' }}>{day}</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
                  {['breakfast','lunch','dinner'].map(meal => {
                    const items = dayMenu?.[meal]?.[pref] || [];
                    return (
                      <div key={meal}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--gray-400)', textTransform: 'uppercase', marginBottom: 6 }}>
                          {meal === 'breakfast' ? '🌅' : meal === 'lunch' ? '☀️' : '🌙'} {meal}
                        </div>
                        {items.slice(0,3).map((item, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                            <div style={{ width: 6, height: 6, borderRadius: '50%', background: pref === 'veg' ? 'var(--veg-green)' : 'var(--nonveg-red)', flexShrink: 0 }} />
                            <span style={{ fontSize: 12, color: 'var(--gray-700)' }}>{item}</span>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
