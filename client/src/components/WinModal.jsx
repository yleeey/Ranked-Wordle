import React, { useState } from 'react';
import './WinModal.css';

export default function WinModal({ guesses, timeSeconds, onSubmit, onSkip }) {
  const [username, setUsername] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const getScoreRating = () => {
    if (guesses === 1) return { label: 'IMPOSSIBLE', color: '#e8ff47' };
    if (guesses === 2) return { label: 'GENIUS', color: '#4caf50' };
    if (guesses === 3) return { label: 'GREAT', color: '#66bb6a' };
    if (guesses === 4) return { label: 'SOLID', color: '#ff9800' };
    if (guesses === 5) return { label: 'CLOSE CALL', color: '#ff7043' };
    return { label: 'PHEW!', color: '#ef5350' };
  };

  const rating = getScoreRating();

  const handleSubmit = async () => {
    if (!username.trim()) {
      setError('Enter a username');
      return;
    }
    if (username.trim().length < 2) {
      setError('At least 2 characters');
      return;
    }
    setSubmitting(true);
    setError('');
    await onSubmit(username.trim());
    setSubmitting(false);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">YOU GOT IT!</div>
          <div className="modal-rating" style={{ color: rating.color }}>
            {rating.label}
          </div>
        </div>

        <div className="modal-stats">
          <div className="stat-block">
            <div className="stat-value">{guesses}</div>
            <div className="stat-label">{guesses === 1 ? 'GUESS' : 'GUESSES'}</div>
          </div>
          <div className="stat-divider" />
          <div className="stat-block">
            <div className="stat-value">{formatTime(timeSeconds)}</div>
            <div className="stat-label">TIME</div>
          </div>
        </div>

        <div className="modal-leaderboard-section">
          <div className="modal-section-label">JOIN THE LEADERBOARD</div>
          <div className="modal-input-row">
            <input
              className={`modal-input ${error ? 'modal-input--error' : ''}`}
              type="text"
              placeholder="YOUR NAME"
              maxLength={20}
              value={username}
              onChange={(e) => { setUsername(e.target.value); setError(''); }}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              autoFocus
            />
            <button
              className="modal-submit-btn"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? '...' : '→'}
            </button>
          </div>
          {error && <div className="modal-error">{error}</div>}
        </div>

        <button className="modal-skip" onClick={onSkip}>
          Skip — just show me the leaderboard
        </button>
      </div>
    </div>
  );
}
