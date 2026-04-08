// src/pages/UserGuide.jsx
import React from 'react';

const steps = [
  { icon: '🔐', title: 'Login', desc: 'Use your AUW student or faculty ID and password to sign in. Your session lasts 8 hours.' },
  { icon: '👤', title: 'Set Up Profile', desc: 'Go to Profile to set your food preference (Veg/Non-Veg) and register any food allergies. This protects your health.' },
  { icon: '📋', title: 'Check the Menu', desc: 'Visit Weekly Menu to see meals for the whole week. You will receive a 3-day advance menu notification every morning at 7AM.' },
  { icon: '🍽️', title: 'Sign Up for Meals', desc: 'Go to Dining Sign Up and tick the meals you want. You can sign up for breakfast, lunch, and dinner. One token per meal per day.' },
  { icon: '⚠️', title: 'Allergy Warnings', desc: 'If today\'s menu contains items matching your registered allergies, the system will warn you before confirming your token.' },
  { icon: '🎫', title: 'Collect Your Token', desc: 'After signing up, a digital token is issued. Show your token number at the dining hall counter to collect your meal.' },
  { icon: '💳', title: 'Payment (Day Scholars & Faculty)', desc: 'Day Scholars and Faculty must pay for meals. Visit the Payment page to see your 10-day bill and pay via bKash, Nagad, card, or cash.' },
  { icon: '⭐', title: 'Give Feedback', desc: 'After dining, rate your experience in the Feedback section. Your feedback directly influences menu planning.' },
];

export default function UserGuide() {
  return (
    <div>
      <div className="page-header">
        <h1>User Guide</h1>
        <p>How to use the AUW Dining Management System</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        {steps.map((step, i) => (
          <div key={i} className="card" style={{ display: 'flex', gap: 14 }}>
            <div style={{
              width: 44, height: 44, borderRadius: '50%', background: 'var(--crimson-light)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20, flexShrink: 0
            }}>{step.icon}</div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--crimson)', color: '#fff', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i+1}</span>
                <span style={{ fontWeight: 600, fontSize: 15 }}>{step.title}</span>
              </div>
              <div style={{ fontSize: 13, color: 'var(--gray-600)', lineHeight: 1.6 }}>{step.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{ background: 'var(--gold-light)', border: '1px solid var(--gold)' }}>
        <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 10 }}>🏠 Residential vs Day Scholar vs Faculty</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, fontSize: 13 }}>
          <div>
            <div style={{ fontWeight: 600, color: '#6A1B9A', marginBottom: 6 }}>🏠 Residential</div>
            <div style={{ color: 'var(--gray-600)' }}>Meals are included in accommodation. No payment required. Still needs to sign up for tokens.</div>
          </div>
          <div>
            <div style={{ fontWeight: 600, color: '#1565C0', marginBottom: 6 }}>⚡ Day Scholar</div>
            <div style={{ color: 'var(--gray-600)' }}>Must pay for all meals. Tokens will clearly display "Day Scholar" in bold. Bill is generated every 10 days.</div>
          </div>
          <div>
            <div style={{ fontWeight: 600, color: '#7B5800', marginBottom: 6 }}>🎓 Faculty</div>
            <div style={{ color: 'var(--gray-600)' }}>Faculty members pay for meals. Tokens display "Faculty" clearly. Slightly higher meal rates apply.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
