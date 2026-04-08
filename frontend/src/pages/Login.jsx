// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!id || !password) { setError('Please enter your ID and password.'); return; }
    setLoading(true);
    setError('');
    try {
      await login(id, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      background: '#1a2a1a'
    }}>
      {/* Campus background with overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `url('/campus-bg.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'brightness(0.55) saturate(0.9)',
        zIndex: 0
      }} />
      {/* Glassmorphism panel */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        background: 'rgba(255,255,255,0.88)',
        backdropFilter: 'blur(20px)',
        borderRadius: 16,
        padding: '0 0 8px',
        width: '100%',
        maxWidth: 400,
        boxShadow: '0 8px 48px rgba(0,0,0,0.35)',
        overflow: 'hidden'
      }}>
        {/* Logo box - white inner box like AUW ERP */}
        <div style={{
          background: '#fff',
          padding: '28px 32px 20px',
          textAlign: 'center',
          borderBottom: '1px solid rgba(0,0,0,0.07)'
        }}>
          {/* SVG AUW Lotus Logo (inline SVG representation) */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
            <svg width="72" height="60" viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg">
              {/* Central golden petals */}
              <ellipse cx="60" cy="55" rx="10" ry="22" fill="#F0A500" transform="rotate(-10,60,55)"/>
              <ellipse cx="60" cy="52" rx="10" ry="22" fill="#F0A500"/>
              <ellipse cx="60" cy="55" rx="10" ry="22" fill="#F0A500" transform="rotate(10,60,55)"/>
              {/* Side golden petals */}
              <ellipse cx="44" cy="60" rx="8" ry="18" fill="#F0A500" transform="rotate(-28,44,60)"/>
              <ellipse cx="76" cy="60" rx="8" ry="18" fill="#F0A500" transform="rotate(28,76,60)"/>
              {/* Outer crimson petals */}
              <ellipse cx="30" cy="68" rx="7" ry="15" fill="#C0152A" transform="rotate(-45,30,68)"/>
              <ellipse cx="90" cy="68" rx="7" ry="15" fill="#C0152A" transform="rotate(45,90,68)"/>
              <ellipse cx="20" cy="78" rx="6" ry="12" fill="#8B0E1E" transform="rotate(-58,20,78)"/>
              <ellipse cx="100" cy="78" rx="6" ry="12" fill="#8B0E1E" transform="rotate(58,100,78)"/>
            </svg>
          </div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: 20,
            fontWeight: 700,
            color: '#C0152A',
            lineHeight: 1.2,
            letterSpacing: 0.5
          }}>
            ASIAN UNIVERSITY<br />FOR WOMEN
          </div>
        </div>

        {/* Form area */}
        <div style={{ padding: '22px 32px 28px' }}>
          <div style={{
            textAlign: 'center',
            fontWeight: 700,
            fontSize: 16,
            color: '#333',
            marginBottom: 22,
            letterSpacing: 1
          }}>AUW DINING SYSTEM</div>

          {error && (
            <div className="alert alert-danger" style={{ marginBottom: 16 }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* ID Field */}
            <div style={{ position: 'relative', marginBottom: 12 }}>
              <span style={{
                position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                color: '#9E9E9E', fontSize: 16
              }}>👤</span>
              <input
                type="text"
                value={id}
                onChange={e => setId(e.target.value)}
                placeholder="Student / Faculty ID"
                className="form-input"
                style={{ paddingLeft: 40, background: '#F5F5F5', border: '1.5px solid #E0E0E0' }}
                autoComplete="username"
              />
            </div>

            {/* Password Field */}
            <div style={{ position: 'relative', marginBottom: 14 }}>
              <span style={{
                position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                color: '#9E9E9E', fontSize: 16
              }}>🔒</span>
              <input
                type={showPwd ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Password"
                className="form-input"
                style={{ paddingLeft: 40, paddingRight: 40, background: '#F5F5F5', border: '1.5px solid #E0E0E0' }}
                autoComplete="current-password"
              />
              <span
                style={{
                  position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                  cursor: 'pointer', color: '#9E9E9E', fontSize: 14
                }}
                onClick={() => setShowPwd(v => !v)}
              >{showPwd ? '🙈' : '👁️'}</span>
            </div>

            {/* Remember */}
            <label style={{
              display: 'flex', alignItems: 'center', gap: 8,
              fontSize: 13, color: '#616161', marginBottom: 18, cursor: 'pointer'
            }}>
              <input
                type="checkbox"
                checked={remember}
                onChange={e => setRemember(e.target.checked)}
                style={{ accentColor: '#C0152A', width: 15, height: 15 }}
              />
              Remember username
            </label>

            {/* Sign In */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '13px',
                background: loading ? '#E57373' : '#C0152A',
                color: '#fff', border: 'none',
                borderRadius: 8, fontFamily: 'var(--font-body)',
                fontSize: 15, fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                letterSpacing: 1,
                transition: 'background 0.2s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
              }}
            >
              {loading && <span className="loading-spinner" style={{ borderTopColor: '#fff', width: 16, height: 16 }} />}
              Sign In
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <button style={{
              background: 'none', border: 'none',
              color: '#616161', fontSize: 13, cursor: 'pointer',
              textDecoration: 'underline'
            }}>
              Forgot Your Password?
            </button>
          </div>

          {/* Demo credentials */}
          <div style={{
            marginTop: 20, padding: 12, background: '#FFF8E1',
            borderRadius: 8, border: '1px solid #FFD54F', fontSize: 12
          }}>
            <div style={{ fontWeight: 600, color: '#5D4037', marginBottom: 6 }}>Demo Credentials:</div>
            <div style={{ color: '#5D4037', lineHeight: 1.8 }}>
              Day Scholar: <b>220018</b> / <b>auw2024</b><br/>
              Residential: <b>220045</b> / <b>auw2024</b><br/>
              Faculty: <b>FAC001</b> / <b>auw2024</b>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
