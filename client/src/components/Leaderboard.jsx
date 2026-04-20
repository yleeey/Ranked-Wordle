import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Leaderboard.css';

export default function Leaderboard({ onClose, highlightUsername }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/leaderboard');
      setEntries(res.data);
    } catch {
      setError('Could not load leaderboard');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const getGuessColor = (guesses) => {
    if (guesses <= 2) return '#e8ff47';
    if (guesses === 3) return '#4caf50';
    if (guesses === 4) return '#ff9800';
    return '#ef5350';
  };

  return (
    <div className="lb-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="lb-panel">
        <div className="lb-panel-header">
          <div className="lb-panel-title">
            TODAY'S LEADERBOARD
          </div>
          <button className="lb-close" onClick={onClose}>✕</button>
        </div>

        <div className="lb-meta">
          <div className="lb-meta-label">RANKED BY GUESSES, THEN TIME</div>
          <button className="lb-refresh" onClick={fetchLeaderboard}>↻ REFRESH</button>
        </div>

        <div className="lb-content">
          {loading && (
            <div className="lb-loading">
              <div className="lb-loading-dots">
                <span /><span /><span />
              </div>
            </div>
          )}
          {error && <div className="lb-error">{error}</div>}
          {!loading && !error && entries.length === 0 && (
            <div className="lb-empty">
              <div className="lb-empty-icon">🏆</div>
              <div>No scores yet today.</div>
              <div className="lb-empty-sub">Be the first on the board!</div>
            </div>
          )}
          {!loading && !error && entries.length > 0 && (
            <div className="lb-list">
              <div className="lb-list-header">
                <span>RANK</span>
                <span>PLAYER</span>
                <span>GUESSES</span>
                <span>TIME</span>
              </div>
              {entries.map((entry, i) => {
                const isHighlighted = highlightUsername &&
                  entry.username.toLowerCase() === highlightUsername.toLowerCase();
                return (
                  <div
                    key={entry._id}
                    className={`lb-row ${isHighlighted ? 'lb-row--highlight' : ''} ${i < 3 ? 'lb-row--top' : ''}`}
                    style={{ animationDelay: `${i * 40}ms` }}
                  >
                    <span className="lb-rank">{getRankIcon(i + 1)}</span>
                    <span className="lb-username">
                      {entry.username}
                      {isHighlighted && <span className="lb-you">YOU</span>}
                    </span>
                    <span className="lb-guesses" style={{ color: getGuessColor(entry.guesses) }}>
                      {entry.guesses}/6
                    </span>
                    <span className="lb-time">{formatTime(entry.timeSeconds)}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
