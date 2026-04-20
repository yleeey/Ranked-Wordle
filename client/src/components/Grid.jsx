import React from 'react';
import Tile from './Tile';
import './Grid.css';

export default function Grid({ guesses, results, currentGuess, currentRow, isRevealing, shakingRow }) {
  const rows = Array(6).fill(null);

  return (
    <div className="grid">
      {rows.map((_, rowIdx) => {
        const isSubmitted = rowIdx < currentRow;
        const isCurrentRow = rowIdx === currentRow;
        const guess = isSubmitted
          ? guesses[rowIdx]
          : isCurrentRow
          ? currentGuess
          : '';
        const result = results[rowIdx] || [];
        const shaking = shakingRow === rowIdx;
        const revealing = isRevealing && rowIdx === currentRow - 1;

        return (
          <div
            key={rowIdx}
            className={`grid-row ${shaking ? 'grid-row--shake' : ''} ${
              revealing && result.every(s => s === 'correct') ? 'grid-row--win' : ''
            }`}
          >
            {Array(5).fill(null).map((_, colIdx) => (
              <Tile
                key={colIdx}
                letter={guess[colIdx] || ''}
                status={isSubmitted ? result[colIdx] : ''}
                position={colIdx}
                isRevealing={revealing}
                isCurrentRow={isCurrentRow}
                isEmpty={!guess[colIdx]}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}
