import React from 'react';
import './Keyboard.css';

const ROWS = [
  ['Q','W','E','R','T','Y','U','I','O','P'],
  ['A','S','D','F','G','H','J','K','L'],
  ['ENTER','Z','X','C','V','B','N','M','⌫'],
];

export default function Keyboard({ onKey, letterStatuses, disabled }) {
  return (
    <div className="keyboard">
      {ROWS.map((row, i) => (
        <div key={i} className="keyboard-row">
          {row.map((key) => {
            const status = letterStatuses[key] || '';
            return (
              <button
                key={key}
                className={`key ${key.length > 1 ? 'key--wide' : ''} ${status ? `key--${status}` : ''}`}
                onClick={() => !disabled && onKey(key)}
                disabled={disabled}
              >
                {key}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
