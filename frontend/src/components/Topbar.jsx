// src/components/Topbar.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';

const pageNames = {
  '/dashboard': 'Dashboard',
  '/profile': 'My Profile',
  '/dining': 'Dining Sign Up',
  '/menu': 'Weekly Menu',
  '/tokens': 'My Tokens',
  '/payment': 'Payment',
  '/feedback': 'Feedback',
  '/guide': 'User Guide',
  '/notifications': 'Notifications',
};

export default function Topbar() {
  const { user } = useAuth();
  const path = window.location.pathname;
  const pageName = pageNames[path] || 'AUW Dining';

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <div className="topbar">
      <div>
        <div style={{ fontWeight: 600, fontSize: 16, color: 'var(--gray-800)' }}>{pageName}</div>
        <div style={{ fontSize: 12, color: 'var(--gray-400)' }}>{today}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <span className={`badge badge-${user?.userType}`} style={{ textTransform: 'capitalize' }}>
          {user?.userType}
        </span>
        <span className={`badge badge-${user?.foodPreference === 'veg' ? 'veg' : 'nonveg'}`}>
          {user?.foodPreference === 'veg' ? '🟢 Vegetarian' : '🔴 Non-Vegetarian'}
        </span>
        {user?.allergies?.length > 0 && (
          <span className="badge badge-warning">⚠️ {user.allergies.length} Allergy</span>
        )}
      </div>
    </div>
  );
}
