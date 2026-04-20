import React from 'react';
import './Header.css';

export default function Header({ onLeaderboard, timer }) {
  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-left">
          <div className="logo">
            <span className="logo-w">Ranked</span>
            <span className="logo-rest">Wordle</span>
          </div>
        </div>
        <div className="header-center">
          <div className="timer">
            <span className="timer-icon">⏱</span>
            <span className="timer-value">{formatTime(timer)}</span>
          </div>
        </div>
        <div className="header-right">
          <button className="lb-button" onClick={onLeaderboard}>
            <span className="lb-icon">🏆</span>
            LEADERBOARD
          </button>
        </div>
      </div>
    </header>
  );
}
