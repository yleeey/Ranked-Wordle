import React from 'react';
import './GameOverModal.css';

export default function GameOverModal({ answer, onLeaderboard }) {
  return (
    <div className="modal-overlay">
      <div className="gameover-modal">
        <div className="gameover-header">
          <div className="gameover-label">GAME OVER</div>
          <div className="gameover-title">BETTER LUCK<br />TOMORROW</div>
        </div>

        <div className="gameover-answer">
          <div className="gameover-answer-label">THE WORD WAS</div>
          <div className="gameover-word">
            {answer.split('').map((l, i) => (
              <span key={i} className="gameover-letter" style={{ animationDelay: `${i * 80}ms` }}>
                {l}
              </span>
            ))}
          </div>
        </div>

        <button className="gameover-lb-btn" onClick={onLeaderboard}>
          <span>⚡</span> VIEW TODAY'S LEADERBOARD
        </button>
      </div>
    </div>
  );
}
