// src/pages/Profile.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const ALLERGENS = ['gluten','dairy','eggs','nuts','shellfish','fish','soy','peanuts'];

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    email: user?.email || '',
    foodPreference: user?.foodPreference || 'veg',
    allergies: user?.allergies || []
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const typeBadgeClass = { dayscholar: 'badge-dayscholar', residential: 'badge-residential', faculty: 'badge-faculty' };
  const typeColor = { dayscholar: '#1565C0', residential: '#6A1B9A', faculty: '#7B5800' };

  const initials = user?.name?.split(' ').map(n => n[0]).slice(0,2).join('') || 'U';
  const col = typeColor[user?.userType] || 'var(--crimson)';

  const toggleAllergen = (a) => {
    setForm(f => ({
      ...f,
      allergies: f.allergies.includes(a) ? f.allergies.filter(x => x !== a) : [...f.allergies, a]
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile(form);
      setSaved(true);
      setEditing(false);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>My Profile</h1>
        <p>Manage your dining preferences and personal information</p>
      </div>

      {saved && <div className="alert alert-success">✅ Profile updated successfully!</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 20 }}>
        {/* Left - Avatar Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{
              width: 80, height: 80, borderRadius: '50%',
              background: col, color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 28, fontWeight: 700, margin: '0 auto 14px',
              boxShadow: `0 4px 16px ${col}40`
            }}>{initials}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700 }}>{user?.name}</div>
            <div style={{ color: 'var(--gray-400)', fontSize: 13, margin: '4px 0 12px' }}>{user?.department}</div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span className={`badge ${typeBadgeClass[user?.userType]}`} style={{ textTransform: 'capitalize' }}>
                {user?.userType}
              </span>
              <span className={`badge badge-${user?.foodPreference === 'veg' ? 'veg' : 'nonveg'}`}>
                {user?.foodPreference === 'veg' ? '🟢 Veg' : '🔴 Non-Veg'}
              </span>
            </div>
          </div>

          {/* ID Card */}
          <div className="card" style={{
            background: `linear-gradient(135deg, ${col} 0%, ${col}cc 100%)`,
            color: '#fff', border: 'none'
          }}>
            <div style={{ fontSize: 11, opacity: 0.75, textTransform: 'uppercase', letterSpacing: 1 }}>Student / Faculty ID</div>
            <div style={{ fontFamily: 'monospace', fontSize: 22, fontWeight: 700, letterSpacing: 3, margin: '6px 0 4px' }}>{user?.id}</div>
            <div style={{ fontSize: 12, opacity: 0.8 }}>{user?.academicYear} · {user?.department}</div>
            <div style={{ marginTop: 12, fontSize: 11, opacity: 0.7 }}>Asian University for Women</div>
          </div>

          {/* Food preference color key */}
          <div className="card">
            <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 10 }}>🎨 Color System Guide</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 16, height: 16, borderRadius: '50%', background: 'var(--veg-green)', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--veg-green)' }}>Vegetarian</div>
                  <div style={{ fontSize: 11, color: 'var(--gray-400)' }}>Green indicates veg options</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 16, height: 16, borderRadius: '50%', background: 'var(--nonveg-red)', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--nonveg-red)' }}>Non-Vegetarian</div>
                  <div style={{ fontSize: 11, color: 'var(--gray-400)' }}>Red indicates non-veg options</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right - Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">Personal Information</div>
                <div className="card-subtitle">Your academic and contact details</div>
              </div>
              {!editing ? (
                <button className="btn btn-secondary btn-sm" onClick={() => setEditing(true)}>✏️ Edit</button>
              ) : (
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-sm" style={{ background: 'var(--gray-100)', color: 'var(--gray-600)' }} onClick={() => setEditing(false)}>Cancel</button>
                  <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={saving}>
                    {saving ? <span className="loading-spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> : '💾 Save'}
                  </button>
                </div>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[
                { label: 'Full Name', value: user?.name, icon: '👤' },
                { label: 'Student / Faculty ID', value: user?.id, icon: '🪪' },
                { label: 'Academic Year', value: user?.academicYear, icon: '🎓' },
                { label: 'Department', value: user?.department, icon: '🏛️' },
                { label: 'User Type', value: user?.userType, icon: '🏷️', capitalize: true },
              ].map(item => (
                <div key={item.label} style={{ padding: '12px 14px', background: 'var(--gray-50)', borderRadius: 8 }}>
                  <div style={{ fontSize: 11, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>
                    {item.icon} {item.label}
                  </div>
                  <div style={{ fontWeight: 500, textTransform: item.capitalize ? 'capitalize' : 'none' }}>
                    {item.value || '—'}
                  </div>
                </div>
              ))}

              {/* Email - editable */}
              <div style={{ padding: '12px 14px', background: 'var(--gray-50)', borderRadius: 8 }}>
                <div style={{ fontSize: 11, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>
                  📧 Email Address
                </div>
                {editing ? (
                  <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    className="form-input" style={{ padding: '6px 10px', fontSize: 13 }} />
                ) : (
                  <div style={{ fontWeight: 500 }}>{user?.email}</div>
                )}
              </div>
            </div>
          </div>

          {/* Food Preferences */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">Food Preferences</div>
            </div>

            <div className="form-group">
              <div className="form-label">Dietary Preference</div>
              <div style={{ display: 'flex', gap: 12 }}>
                {['veg', 'nonveg'].map(pref => (
                  <label key={pref} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '12px 20px', borderRadius: 8, cursor: editing ? 'pointer' : 'default',
                    border: `2px solid ${form.foodPreference === pref
                      ? (pref === 'veg' ? 'var(--veg-green)' : 'var(--nonveg-red)')
                      : 'var(--gray-200)'}`,
                    background: form.foodPreference === pref
                      ? (pref === 'veg' ? 'var(--veg-light)' : 'var(--nonveg-light)')
                      : 'var(--gray-50)',
                    flex: 1, transition: 'all 0.18s'
                  }}>
                    <input type="radio" value={pref} checked={form.foodPreference === pref}
                      onChange={() => editing && setForm(f => ({ ...f, foodPreference: pref }))}
                      style={{ display: 'none' }} />
                    <div style={{
                      width: 16, height: 16, borderRadius: '50%', flexShrink: 0,
                      background: pref === 'veg' ? 'var(--veg-green)' : 'var(--nonveg-red)'
                    }} />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14, color: pref === 'veg' ? 'var(--veg-green)' : 'var(--nonveg-red)' }}>
                        {pref === 'veg' ? 'Vegetarian' : 'Non-Vegetarian'}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--gray-400)' }}>
                        {pref === 'veg' ? 'Plant-based meals only' : 'Includes meat & seafood'}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <div className="form-label">Food Allergies</div>
              {!editing && form.allergies.length === 0 && (
                <div style={{ color: 'var(--gray-400)', fontSize: 13 }}>No allergies recorded. Click Edit to update.</div>
              )}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {ALLERGENS.map(a => {
                  const selected = form.allergies.includes(a);
                  return (
                    <button
                      key={a}
                      onClick={() => editing && toggleAllergen(a)}
                      style={{
                        padding: '6px 14px', borderRadius: 20, fontSize: 13,
                        border: `1.5px solid ${selected ? '#E65100' : 'var(--gray-200)'}`,
                        background: selected ? '#FFF3E0' : 'var(--gray-50)',
                        color: selected ? '#E65100' : 'var(--gray-400)',
                        cursor: editing ? 'pointer' : 'default',
                        fontWeight: selected ? 600 : 400,
                        transition: 'all 0.15s'
                      }}
                    >
                      {selected ? '⚠️ ' : ''}{a}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
