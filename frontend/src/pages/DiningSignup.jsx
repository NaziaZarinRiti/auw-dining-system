// src/pages/DiningSignup.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';

const MEAL_INFO = {
  breakfast: { icon: '🌅', time: '7:00 AM – 9:00 AM', label: 'Breakfast' },
  lunch:     { icon: '☀️', time: '12:00 PM – 2:00 PM', label: 'Lunch' },
  dinner:    { icon: '🌙', time: '7:00 PM – 9:00 PM', label: 'Dinner' }
};

export default function DiningSignup() {
  const { user } = useAuth();
  const [menu, setMenu] = useState(null);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [tokens, setTokens] = useState([]);
  const [existingTokens, setExistingTokens] = useState([]);
  const [warnings, setWarnings] = useState([]);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [pendingMeal, setPendingMeal] = useState(null);
  const [error, setError] = useState('');

  const today = new Date();
  const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const todayName = days[today.getDay()];

  useEffect(() => {
    Promise.all([api.get('/dining/menu'), api.get('/dining/tokens')])
      .then(([menuRes, tokenRes]) => {
        setMenu(menuRes.data);
        setExistingTokens(tokenRes.data.filter(t =>
          t.date === today.toDateString() && t.status === 'active'
        ));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const todayMenu = menu?.menu?.[todayName];
  const pricing = menu?.pricing || {};

  const hasTodayToken = (mealType) =>
    existingTokens.some(t => t.mealType === mealType);

  const checkAllergens = (mealType) => {
    const mealData = todayMenu?.[mealType];
    if (!mealData) return [];
    const menuAllergens = mealData.allergens || [];
    const userAllergies = user?.allergies || [];
    return userAllergies.filter(a => menuAllergens.includes(a));
  };

  const handleMealToggle = (mealType) => {
    if (hasTodayToken(mealType)) return;
    const conflicts = checkAllergens(mealType);
    if (conflicts.length > 0 && !selected.includes(mealType)) {
      setPendingMeal(mealType);
      setWarnings(conflicts);
      setShowWarningModal(true);
      return;
    }
    setSelected(s => s.includes(mealType) ? s.filter(m => m !== mealType) : [...s, mealType]);
  };

  const confirmDespiteWarning = () => {
    setSelected(s => [...s, pendingMeal]);
    setShowWarningModal(false);
    setPendingMeal(null);
  };

  const handleSignup = async () => {
    if (!selected.length) { setError('Please select at least one meal.'); return; }
    setSubmitting(true);
    setError('');
    const newTokens = [];
    try {
      for (const mealType of selected) {
        const res = await api.post('/dining/signup', { mealType });
        newTokens.push(res.data.token);
      }
      setTokens(prev => [...prev, ...newTokens]);
      setExistingTokens(prev => [...prev, ...newTokens]);
      setSelected([]);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create token. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
      <div className="loading-spinner" style={{ width: 36, height: 36, borderWidth: 3 }} />
    </div>
  );

  const pref = user?.foodPreference || 'veg';

  return (
    <div>
      <div className="page-header">
        <h1>Dining Sign Up</h1>
        <p>Select meals for today — {todayName}, {today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
      </div>

      {/* Allergy Warning Modal */}
      {showWarningModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="card" style={{ maxWidth: 420, width: '90%', padding: 28 }}>
            <div style={{ fontSize: 36, textAlign: 'center', marginBottom: 12 }}>⚠️</div>
            <h3 style={{ fontFamily: 'var(--font-display)', textAlign: 'center', color: '#E65100', marginBottom: 10 }}>
              Allergy Warning
            </h3>
            <p style={{ fontSize: 14, textAlign: 'center', color: 'var(--gray-600)', marginBottom: 16 }}>
              Today's <strong>{pendingMeal}</strong> menu contains items that may conflict with your registered allergies:
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
              {warnings.map(w => (
                <span key={w} className="badge badge-warning" style={{ fontSize: 14, padding: '6px 14px' }}>⚠️ {w}</span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-secondary" style={{ flex: 1 }}
                onClick={() => { setShowWarningModal(false); setPendingMeal(null); }}>
                Cancel — Stay Safe
              </button>
              <button className="btn btn-primary" style={{ flex: 1, background: '#E65100' }}
                onClick={confirmDespiteWarning}>
                Proceed Anyway
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Today's Menu Preview */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header">
          <div className="card-title">Today's Menu Preview</div>
          <span className={`badge badge-${pref === 'veg' ? 'veg' : 'nonveg'}`}>
            {pref === 'veg' ? '🟢 Vegetarian' : '🔴 Non-Vegetarian'}
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {['breakfast','lunch','dinner'].map(meal => {
            const mealData = todayMenu?.[meal];
            const items = mealData?.[pref] || [];
            const allergens = mealData?.allergens || [];
            const conflicts = (user?.allergies || []).filter(a => allergens.includes(a));
            return (
              <div key={meal} style={{ padding: 14, background: 'var(--gray-50)', borderRadius: 8 }}>
                <div style={{ fontWeight: 600, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                  {MEAL_INFO[meal].icon} {MEAL_INFO[meal].label}
                  {conflicts.length > 0 && <span className="badge badge-warning" style={{ fontSize: 10 }}>⚠️ Allergen</span>}
                </div>
                <div className="menu-item-list">
                  {items.map((item, i) => (
                    <span key={i} className={`menu-tag menu-tag-${pref === 'veg' ? 'veg' : 'nonveg'}`}>{item}</span>
                  ))}
                </div>
                {allergens.length > 0 && (
                  <div style={{ marginTop: 8 }}>
                    {allergens.map(a => (
                      <span key={a} className="menu-tag menu-tag-allergen" style={{ marginRight: 4 }}>{a}</span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Meal Selection */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header">
          <div>
            <div className="card-title">Select Meals</div>
            <div className="card-subtitle">One token per meal per day. Click to select.</div>
          </div>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="meal-checkbox-group">
          {['breakfast','lunch','dinner'].map(meal => {
            const info = MEAL_INFO[meal];
            const hasToken = hasTodayToken(meal);
            const isSelected = selected.includes(meal);
            const price = pricing[meal]?.[user?.userType] || 0;
            const conflicts = checkAllergens(meal);
            return (
              <div key={meal} className="meal-checkbox" onClick={() => handleMealToggle(meal)}>
                <input type="checkbox" checked={isSelected || hasToken} readOnly />
                <div className={`meal-checkbox-label`} style={{
                  opacity: hasToken ? 0.7 : 1,
                  cursor: hasToken ? 'not-allowed' : 'pointer',
                  borderColor: hasToken ? 'var(--gray-200)' : isSelected ? 'var(--crimson)' : 'var(--gray-200)',
                  background: hasToken ? 'var(--gray-100)' : isSelected ? 'var(--crimson-light)' : 'var(--white)',
                  position: 'relative'
                }}>
                  {conflicts.length > 0 && (
                    <span style={{
                      position: 'absolute', top: 8, right: 8,
                      fontSize: 14
                    }}>⚠️</span>
                  )}
                  <div className="meal-icon">{info.icon}</div>
                  <div className="meal-name">{info.label}</div>
                  <div className="meal-time">{info.time}</div>
                  {hasToken ? (
                    <span className="badge badge-success" style={{ fontSize: 11 }}>✅ Token Issued</span>
                  ) : (
                    <div className="meal-price">
                      {user?.userType === 'residential' ? 'Included' : `৳${price}`}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {selected.length > 0 && (
          <div style={{ marginTop: 20, padding: 16, background: 'var(--crimson-light)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--crimson)' }}>
                {selected.length} meal{selected.length > 1 ? 's' : ''} selected: {selected.map(m => MEAL_INFO[m].label).join(', ')}
              </div>
              {user?.userType !== 'residential' && (
                <div style={{ fontSize: 13, color: 'var(--gray-600)', marginTop: 2 }}>
                  Total: ৳{selected.reduce((s, m) => s + (pricing[m]?.[user?.userType] || 0), 0)}
                </div>
              )}
            </div>
            <button className="btn btn-primary" onClick={handleSignup} disabled={submitting}>
              {submitting ? <span className="loading-spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> : '🎫 Get Tokens'}
            </button>
          </div>
        )}
      </div>

      {/* Newly issued tokens */}
      {tokens.length > 0 && (
        <div className="card">
          <div className="card-title" style={{ marginBottom: 16 }}>🎫 Tokens Issued</div>
          <div style={{ display: 'grid', gap: 14 }}>
            {tokens.map(token => (
              <div key={token.id} className="token-card">
                {(token.userType === 'dayscholar') && (
                  <div className="token-dayscholar-label">⚡ Day Scholar Token</div>
                )}
                {(token.userType === 'faculty') && (
                  <div className="token-dayscholar-label" style={{ background: 'var(--gold-light)', color: '#7B5800' }}>
                    🎓 Faculty Token
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div className="token-number">{token.tokenNumber}</div>
                    <div style={{ fontSize: 13, color: 'var(--gray-600)', marginTop: 4 }}>{token.userName}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, fontSize: 18, textTransform: 'capitalize' }}>
                      {MEAL_INFO[token.mealType].icon} {token.mealType}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--gray-400)' }}>{token.date}</div>
                  </div>
                </div>
                <hr className="divider" style={{ margin: '12px 0' }} />
                <div style={{ display: 'flex', gap: 12, fontSize: 12, color: 'var(--gray-600)' }}>
                  <span className={`badge badge-${token.foodPreference === 'veg' ? 'veg' : 'nonveg'}`}>
                    {token.foodPreference === 'veg' ? '🟢 Veg' : '🔴 Non-Veg'}
                  </span>
                  <span>{MEAL_INFO[token.mealType].time}</span>
                  {token.price > 0 && <span style={{ marginLeft: 'auto', fontWeight: 600, color: 'var(--crimson)' }}>৳{token.price}</span>}
                </div>
                {token.allergyWarning?.length > 0 && (
                  <div style={{ marginTop: 8, fontSize: 12, color: '#E65100', background: '#FFF3E0', padding: '6px 10px', borderRadius: 6 }}>
                    ⚠️ Allergen note: {token.allergyWarning.join(', ')} present in today's menu
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
