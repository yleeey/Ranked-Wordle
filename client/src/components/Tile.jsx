import React, { useEffect, useState } from 'react';
import './Tile.css';

export default function Tile({ letter, status, position, isRevealing, isCurrentRow, isEmpty }) {
  const [displayStatus, setDisplayStatus] = useState('');
  const [flipping, setFlipping] = useState(false);

  useEffect(() => {
    if (isRevealing && status) {
      const delay = position * 300;
      setTimeout(() => {
        setFlipping(true);
        setTimeout(() => {
          setDisplayStatus(status);
          setFlipping(false);
        }, 150);
      }, delay);
    } else if (!isRevealing) {
      setDisplayStatus(status || '');
    }
  }, [isRevealing, status, position]);

  const classes = [
    'tile',
    letter ? 'tile--filled' : '',
    displayStatus ? `tile--${displayStatus}` : '',
    flipping ? 'tile--flipping' : '',
    isCurrentRow && letter && !isRevealing ? 'tile--pop' : '',
    isEmpty ? 'tile--empty' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      <span className="tile-letter">{letter}</span>
    </div>
  );
}
