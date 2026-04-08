// src/pages/WeeklyMenu.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';

const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
const today = new Date();
const todayName = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][today.getDay()];

export default function WeeklyMenu() {
  const { user } = useAuth();
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState(todayName);
  const [pref, setPref] = useState(user?.foodPreference || 'veg');

  useEffect(() => {
    api.get('/dining/menu/week').then(r => setMenu(r.data.menu)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><div className="loading-spinner" style={{ width: 36, height: 36, borderWidth: 3 }} /></div>;

  const dayMenu = menu?.[activeDay];
  const userAllergies = user?.allergies || [];

  return (
    <div>
      <div className="page-header">
        <h1>Weekly Menu</h1>
        <p>Full dining menu for the week. Plan your meals ahead.</p>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        {/* Day tabs */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {days.map(day => (
            <button key={day} onClick={() => setActiveDay(day)} className={`btn btn-sm ${activeDay === day ? 'btn-primary' : 'btn-secondary'}`}
              style={{ position: 'relative' }}>
              {day.substring(0,3)}
              {day === todayName && <span style={{
                position: 'absolute', top: -5, right: -5, width: 10, height: 10,
                borderRadius: '50%', background: 'var(--gold)', border: '2px solid #fff'
              }} />}
            </button>
          ))}
        </div>

        {/* Veg/NonVeg toggle */}
        <div style={{ display: 'flex', border: '1.5px solid var(--gray-200)', borderRadius: 8, overflow: 'hidden' }}>
          <button onClick={() => setPref('veg')} style={{
            padding: '7px 16px', border: 'none', cursor: 'pointer', fontSize: 13,
            background: pref === 'veg' ? 'var(--veg-green)' : 'var(--white)',
            color: pref === 'veg' ? '#fff' : 'var(--gray-600)', fontWeight: pref === 'veg' ? 600 : 400
          }}>🟢 Vegetarian</button>
          <button onClick={() => setPref('nonveg')} style={{
            padding: '7px 16px', border: 'none', cursor: 'pointer', fontSize: 13,
            background: pref === 'nonveg' ? 'var(--nonveg-red)' : 'var(--white)',
            color: pref === 'nonveg' ? '#fff' : 'var(--gray-600)', fontWeight: pref === 'nonveg' ? 600 : 400
          }}>🔴 Non-Vegetarian</button>
        </div>
      </div>

      {/* Day header */}
      <div style={{
        background: activeDay === todayName
          ? 'linear-gradient(135deg, var(--crimson-dark), var(--crimson))'
          : 'var(--gray-800)',
        color: '#fff', borderRadius: 12, padding: '16px 24px', marginBottom: 20,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700 }}>{activeDay}</div>
          {activeDay === todayName && <div style={{ fontSize: 13, opacity: 0.8, marginTop: 2 }}>Today's Menu</div>}
        </div>
        <span style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 14px', borderRadius: 20, fontSize: 13 }}>
          {pref === 'veg' ? '🟢 Showing Vegetarian' : '🔴 Showing Non-Veg'}
        </span>
      </div>

      {/* Meal cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {['breakfast','lunch','dinner'].map(meal => {
          const mealData = dayMenu?.[meal];
          const items = mealData?.[pref] || [];
          const allergens = mealData?.allergens || [];
          const conflicts = userAllergies.filter(a => allergens.includes(a));
          return (
            <div key={meal} className="card" style={{ borderTop: `3px solid ${meal === 'breakfast' ? '#F57F17' : meal === 'lunch' ? 'var(--crimson)' : '#283593'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 22 }}>{meal === 'breakfast' ? '🌅' : meal === 'lunch' ? '☀️' : '🌙'}</span>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, textTransform: 'capitalize' }}>{meal}</span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--gray-400)', marginTop: 2 }}>
                    {meal === 'breakfast' ? '7:00 – 9:00 AM' : meal === 'lunch' ? '12:00 – 2:00 PM' : '7:00 – 9:00 PM'}
                  </div>
                </div>
                {conflicts.length > 0 && (
                  <span className="badge badge-warning" title={`Contains: ${conflicts.join(', ')}`}>⚠️ Allergen</span>
                )}
              </div>

              <div style={{ marginBottom: 12 }}>
                {items.map((item, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '6px 0', borderBottom: i < items.length-1 ? '1px solid var(--gray-100)' : 'none'
                  }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', flexShrink: 0, background: pref === 'veg' ? 'var(--veg-green)' : 'var(--nonveg-red)' }} />
                    <span style={{ fontSize: 13 }}>{item}</span>
                  </div>
                ))}
              </div>

              {/* Allergens */}
              {allergens.length > 0 && (
                <div style={{ borderTop: '1px solid var(--gray-100)', paddingTop: 10, marginTop: 4 }}>
                  <div style={{ fontSize: 11, color: 'var(--gray-400)', marginBottom: 6, fontWeight: 500 }}>CONTAINS ALLERGENS:</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {allergens.map(a => (
                      <span key={a} className={`menu-tag ${conflicts.includes(a) ? 'menu-tag-allergen' : ''}`}
                        style={!conflicts.includes(a) ? { background: 'var(--gray-100)', color: 'var(--gray-600)' } : {}}>
                        {conflicts.includes(a) ? '⚠️' : ''} {a}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Also show veg/nonveg side by side below */}
      <div className="card" style={{ marginTop: 20 }}>
        <div className="card-title" style={{ marginBottom: 16 }}>Full Day Comparison — Veg vs Non-Veg</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {['veg','nonveg'].map(type => (
            <div key={type}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12,
                padding: '8px 14px', borderRadius: 8,
                background: type === 'veg' ? 'var(--veg-light)' : 'var(--nonveg-light)'
              }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: type === 'veg' ? 'var(--veg-green)' : 'var(--nonveg-red)' }} />
                <span style={{ fontWeight: 600, color: type === 'veg' ? 'var(--veg-green)' : 'var(--nonveg-red)' }}>
                  {type === 'veg' ? 'Vegetarian' : 'Non-Vegetarian'}
                </span>
              </div>
              {['breakfast','lunch','dinner'].map(meal => {
                const items = dayMenu?.[meal]?.[type] || [];
                return (
                  <div key={meal} style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 5 }}>
                      {meal === 'breakfast' ? '🌅' : meal === 'lunch' ? '☀️' : '🌙'} {meal}
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--gray-600)' }}>{items.join(' · ') || '—'}</div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
