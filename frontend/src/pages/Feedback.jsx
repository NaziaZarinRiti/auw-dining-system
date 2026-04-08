// src/pages/Feedback.jsx
import React, { useState, useEffect } from 'react';
import api from '../api';

const CATEGORIES = [
  { id: 'taste', label: 'Taste & Flavor', icon: '😋' },
  { id: 'hygiene', label: 'Hygiene & Cleanliness', icon: '🧼' },
  { id: 'portion', label: 'Portion Size', icon: '🍽️' },
  { id: 'variety', label: 'Menu Variety', icon: '🌈' },
  { id: 'service', label: 'Staff & Service', icon: '👩‍🍳' },
  { id: 'value', label: 'Value for Money', icon: '💰' },
];

const TAGS = ['🔥 Hot', '❄️ Cold', '🌱 Fresh', '🧂 Too Salty', '🍬 Too Sweet', '✨ Excellent', '⏱️ Slow Service', '💯 Perfect', '📦 Small Portion', '🚫 Stale'];

const EMOJIS = ['😠', '😕', '😐', '😊', '🤩'];
const EMOJI_LABELS = ['Very Bad', 'Bad', 'Okay', 'Good', 'Excellent'];

export default function Feedback() {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [category, setCategory] = useState('taste');
  const [mealType, setMealType] = useState('lunch');
  const [comment, setComment] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [summary, setSummary] = useState(null);
  const [myFeedbacks, setMyFeedbacks] = useState([]);

  useEffect(() => {
    api.get('/feedback/summary').then(r => setSummary(r.data)).catch(() => {});
    api.get('/feedback/mine').then(r => setMyFeedbacks(r.data)).catch(() => {});
  }, [submitted]);

  const toggleTag = (tag) => {
    setSelectedTags(t => t.includes(tag) ? t.filter(x => x !== tag) : [...t, tag]);
  };

  const handleSubmit = async () => {
    if (!rating) return;
    setSubmitting(true);
    try {
      await api.post('/feedback', { rating, category, mealType, comment, tags: selectedTags });
      setSubmitted(true);
      setRating(0); setComment(''); setSelectedTags([]);
      setTimeout(() => setSubmitted(false), 4000);
    } catch (e) { console.error(e); }
    finally { setSubmitting(false); }
  };

  const active = hovered || rating;
  const pct = (n) => summary?.total ? Math.round((summary.breakdown[n] / summary.total) * 100) : 0;

  return (
    <div>
      <div className="page-header">
        <h1>Feedback</h1>
        <p>Help us improve the dining experience at AUW</p>
      </div>

      {submitted && (
        <div className="alert alert-success" style={{ marginBottom: 20, fontSize: 15 }}>
          🙏 Thank you for your feedback! Your voice helps us serve you better.
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}>
        {/* Feedback Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card">
            <div className="card-title" style={{ marginBottom: 4 }}>Rate Your Experience</div>
            <div className="card-subtitle" style={{ marginBottom: 24 }}>How was your meal today?</div>

            {/* Emoji Rating */}
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 10 }}>
                {EMOJIS.map((emoji, i) => (
                  <button key={i} onClick={() => setRating(i + 1)}
                    onMouseEnter={() => setHovered(i + 1)}
                    onMouseLeave={() => setHovered(0)}
                    style={{
                      fontSize: active === i + 1 ? 44 : 32,
                      cursor: 'pointer', background: 'none', border: 'none',
                      transition: 'all 0.18s',
                      filter: active && active !== i + 1 ? 'grayscale(1) opacity(0.4)' : 'none',
                      transform: active === i + 1 ? 'scale(1.15)' : 'scale(1)'
                    }}>
                    {emoji}
                  </button>
                ))}
              </div>
              {active > 0 && (
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600, color: 'var(--crimson)' }}>
                  {EMOJI_LABELS[active - 1]}
                </div>
              )}
            </div>

            {/* Star Rating (classic) */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginBottom: 24 }}>
              {[1,2,3,4,5].map(n => (
                <span key={n} className={`star ${n <= (hovered || rating) ? 'active' : ''}`}
                  onClick={() => setRating(n)}
                  onMouseEnter={() => setHovered(n)}
                  onMouseLeave={() => setHovered(0)}
                >{n <= (hovered || rating) ? '★' : '☆'}</span>
              ))}
            </div>

            {/* Meal Type */}
            <div className="form-group">
              <div className="form-label">Which Meal?</div>
              <div style={{ display: 'flex', gap: 10 }}>
                {['breakfast','lunch','dinner'].map(m => (
                  <button key={m} onClick={() => setMealType(m)} style={{
                    flex: 1, padding: '10px', borderRadius: 8, cursor: 'pointer',
                    border: `2px solid ${mealType === m ? 'var(--crimson)' : 'var(--gray-200)'}`,
                    background: mealType === m ? 'var(--crimson-light)' : 'var(--white)',
                    color: mealType === m ? 'var(--crimson)' : 'var(--gray-600)',
                    fontWeight: mealType === m ? 600 : 400, fontSize: 13, textTransform: 'capitalize',
                    transition: 'all 0.15s'
                  }}>
                    {m === 'breakfast' ? '🌅' : m === 'lunch' ? '☀️' : '🌙'} {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Category */}
            <div className="form-group">
              <div className="form-label">Feedback Category</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                {CATEGORIES.map(c => (
                  <button key={c.id} onClick={() => setCategory(c.id)} style={{
                    padding: '10px 8px', borderRadius: 8, cursor: 'pointer',
                    border: `2px solid ${category === c.id ? 'var(--crimson)' : 'var(--gray-200)'}`,
                    background: category === c.id ? 'var(--crimson-light)' : 'var(--gray-50)',
                    color: category === c.id ? 'var(--crimson)' : 'var(--gray-600)',
                    fontSize: 12, fontWeight: category === c.id ? 600 : 400,
                    textAlign: 'center', transition: 'all 0.15s'
                  }}>
                    <div style={{ fontSize: 18, marginBottom: 3 }}>{c.icon}</div>
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Tags */}
            <div className="form-group">
              <div className="form-label">Quick Tags (optional)</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {TAGS.map(tag => (
                  <button key={tag} onClick={() => toggleTag(tag)} style={{
                    padding: '5px 12px', borderRadius: 20, fontSize: 13, cursor: 'pointer',
                    border: `1.5px solid ${selectedTags.includes(tag) ? 'var(--crimson)' : 'var(--gray-200)'}`,
                    background: selectedTags.includes(tag) ? 'var(--crimson-light)' : 'var(--white)',
                    color: selectedTags.includes(tag) ? 'var(--crimson)' : 'var(--gray-600)',
                    transition: 'all 0.15s'
                  }}>
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Comment */}
            <div className="form-group">
              <div className="form-label">Comments (optional)</div>
              <textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Tell us more about your experience — what did you love? What should we improve?"
                rows={4}
                className="form-input"
                style={{ resize: 'vertical', fontFamily: 'var(--font-body)' }}
              />
            </div>

            <button className="btn btn-primary btn-lg" style={{ width: '100%' }}
              onClick={handleSubmit}
              disabled={!rating || submitting}>
              {submitting ? <span className="loading-spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> : '⭐ Submit Feedback'}
            </button>
          </div>

          {/* My past feedbacks */}
          {myFeedbacks.length > 0 && (
            <div className="card">
              <div className="card-title" style={{ marginBottom: 14 }}>My Previous Feedback</div>
              {myFeedbacks.slice(-3).reverse().map(fb => (
                <div key={fb.id} style={{ padding: '12px 0', borderBottom: '1px solid var(--gray-100)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontWeight: 500, textTransform: 'capitalize' }}>{fb.mealType} — {fb.category}</span>
                    <span>{'★'.repeat(fb.rating)}{'☆'.repeat(5 - fb.rating)}</span>
                  </div>
                  {fb.comment && <div style={{ fontSize: 13, color: 'var(--gray-600)' }}>{fb.comment}</div>}
                  <div style={{ fontSize: 12, color: 'var(--gray-400)', marginTop: 4 }}>{fb.date}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right — Summary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card">
            <div className="card-title" style={{ marginBottom: 16 }}>Community Ratings</div>
            {!summary || summary.total === 0 ? (
              <div className="empty-state" style={{ padding: '24px 0' }}>
                <div className="empty-state-icon">⭐</div>
                <div>No feedback yet</div>
              </div>
            ) : (
              <>
                <div style={{ textAlign: 'center', marginBottom: 20 }}>
                  <div style={{ fontSize: 52, fontWeight: 700, color: 'var(--gold)', fontFamily: 'var(--font-display)' }}>
                    {summary.average}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 2, fontSize: 18, color: 'var(--gold)' }}>
                    {[1,2,3,4,5].map(n => <span key={n}>{n <= Math.round(summary.average) ? '★' : '☆'}</span>)}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--gray-400)', marginTop: 4 }}>
                    Based on {summary.total} reviews
                  </div>
                </div>

                {[5,4,3,2,1].map(n => (
                  <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <span style={{ fontSize: 12, width: 14, color: 'var(--gray-600)' }}>{n}</span>
                    <span style={{ color: 'var(--gold)', fontSize: 14 }}>★</span>
                    <div style={{ flex: 1 }}>
                      <div className="progress-bar-wrap">
                        <div className="progress-bar-fill" style={{
                          width: `${pct(n)}%`,
                          background: n >= 4 ? 'var(--veg-green)' : n === 3 ? 'var(--gold)' : 'var(--crimson)'
                        }} />
                      </div>
                    </div>
                    <span style={{ fontSize: 12, color: 'var(--gray-400)', width: 28, textAlign: 'right' }}>{pct(n)}%</span>
                  </div>
                ))}

                {summary.byMeal && Object.keys(summary.byMeal).length > 0 && (
                  <>
                    <hr className="divider" />
                    <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 10 }}>Rating by Meal</div>
                    {Object.entries(summary.byMeal).map(([meal, data]) => (
                      <div key={meal} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <span style={{ fontSize: 13, textTransform: 'capitalize' }}>
                          {meal === 'breakfast' ? '🌅' : meal === 'lunch' ? '☀️' : '🌙'} {meal}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ color: 'var(--gold)' }}>★</span>
                          <span style={{ fontWeight: 600 }}>{data.avg}</span>
                          <span style={{ fontSize: 11, color: 'var(--gray-400)' }}>({data.total})</span>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </>
            )}
          </div>

          <div className="card" style={{ background: 'var(--crimson-light)', border: '1px solid var(--crimson)30' }}>
            <div style={{ fontSize: 22, marginBottom: 8 }}>💌</div>
            <div style={{ fontWeight: 600, color: 'var(--crimson)', marginBottom: 6 }}>Your Feedback Matters</div>
            <div style={{ fontSize: 13, color: 'var(--crimson-dark)', lineHeight: 1.6 }}>
              Our dining team reviews all feedback daily. Your suggestions directly influence menu planning and service improvements at AUW.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
