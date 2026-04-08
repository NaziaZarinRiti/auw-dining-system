// src/components/Sidebar.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { path: '/dashboard', icon: '🏠', label: 'Dashboard' },
  { path: '/profile', icon: '👤', label: 'Profile' },
  { path: '/dining', icon: '🍽️', label: 'Dining Sign Up' },
  { path: '/menu', icon: '📋', label: 'Weekly Menu' },
  { path: '/tokens', icon: '🎫', label: 'My Tokens' },
  { path: '/payment', icon: '💳', label: 'Payment' },
  { path: '/feedback', icon: '⭐', label: 'Feedback' },
];

const typeColors = {
  dayscholar: '#1565C0',
  residential: '#6A1B9A',
  faculty: '#7B5800'
};

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const avatarBg = typeColors[user?.userType] || '#C0152A';
  const initials = user?.name?.split(' ').map(n => n[0]).slice(0,2).join('') || 'U';

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <img src="/auw-logo.png" alt="AUW Logo" onError={e => { e.target.style.display='none'; }} />
        <div className="brand-name">Asian University for Women</div>
        <div className="brand-sub">Dining System</div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-label">Navigation</div>
        {navItems.map(item => (
          <div
            key={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </div>
        ))}

        <div className="nav-section-label" style={{ marginTop: 12 }}>Account</div>
        <div className="nav-item" onClick={() => navigate('/guide')}>
          <span className="nav-icon">📖</span>
          User Guide
        </div>
        <div className="nav-item" onClick={() => navigate('/notifications')}>
          <span className="nav-icon">🔔</span>
          Notifications
        </div>
        <div
          className="nav-item"
          onClick={logout}
          style={{ color: '#EF9A9A' }}
        >
          <span className="nav-icon">🚪</span>
          Logout
        </div>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div
            className="sidebar-avatar"
            style={{ background: avatarBg, color: '#fff' }}
          >
            {initials}
          </div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{user?.name}</div>
            <div className="sidebar-user-type">{user?.userType} · {user?.id}</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
