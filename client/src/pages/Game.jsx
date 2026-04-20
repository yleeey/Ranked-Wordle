import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Grid from '../components/Grid';
import Keyboard from '../components/Keyboard';
import Toast from '../components/Toast';
import WinModal from '../components/WinModal';
import GameOverModal from '../components/GameOverModal';
import Leaderboard from '../components/Leaderboard';
import './Game.css';

const MAX_GUESSES = 6;
const WORD_LENGTH = 5;

export default function Game() {
  const [guesses, setGuesses] = useState([]);
  const [results, setResults] = useState([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [currentRow, setCurrentRow] = useState(0);
  const [gameState, setGameState] = useState('playing'); // 'playing' | 'won' | 'lost'
  const [isRevealing, setIsRevealing] = useState(false);
  const [shakingRow, setShakingRow] = useState(null);
  const [toastMsg, setToastMsg] = useState('');
  const [letterStatuses, setLetterStatuses] = useState({});
  const [showWinModal, setShowWinModal] = useState(false);
  const [showGameOverModal, setShowGameOverModal] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [timer, setTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(true);
  const [submittedUsername, setSubmittedUsername] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const timerRef = useRef(null);

  // Timer
  useEffect(() => {
    if (timerActive) {
      timerRef.current = setInterval(() => setTimer(t => t + 1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [timerActive]);

  const showToast = (msg) => {
    setToastMsg(msg);
  };

  const shakeRow = (row) => {
    setShakingRow(row);
    setTimeout(() => setShakingRow(null), 500);
  };

  const updateLetterStatuses = useCallback((guess, result) => {
    setLetterStatuses(prev => {
      const next = { ...prev };
      const priority = { correct: 3, present: 2, absent: 1 };
      guess.split('').forEach((letter, i) => {
        const newStatus = result[i];
        const existing = next[letter];
        if (!existing || (priority[newStatus] || 0) > (priority[existing] || 0)) {
          next[letter] = newStatus;
        }
      });
      return next;
    });
  }, []);

  const submitGuess = useCallback(async () => {
    if (currentGuess.length !== WORD_LENGTH) {
      showToast('Not enough letters');
      shakeRow(currentRow);
      return;
    }

    try {
      const res = await axios.post('/api/guess', { guess: currentGuess });
      const { result, correct, guess } = res.data;

      const newGuesses = [...guesses, guess];
      const newResults = [...results, result];
      setGuesses(newGuesses);
      setResults(newResults);
      setCurrentGuess('');
      setCurrentRow(r => r + 1);
      setIsRevealing(true);

      updateLetterStatuses(guess, result);

      // After reveal animation completes
      const revealDuration = WORD_LENGTH * 300 + 400;
      setTimeout(() => {
        setIsRevealing(false);
        if (correct) {
          setTimerActive(false);
          setGameState('won');
          setTimeout(() => setShowWinModal(true), 300);
        } else if (newGuesses.length >= MAX_GUESSES) {
          setTimerActive(false);
          setGameState('lost');
          // Fetch the answer to show in game over modal
          fetchAnswer(newResults);
          setTimeout(() => setShowGameOverModal(true), 300);
        }
      }, revealDuration);

    } catch (err) {
      if (err.response?.data?.error) {
        showToast(err.response.data.error);
        shakeRow(currentRow);
      } else {
        showToast('Error submitting guess');
      }
    }
  }, [currentGuess, currentRow, guesses, results, updateLetterStatuses]);

  const fetchAnswer = async () => {
    // We reconstruct by checking the server or we can just decode from the last result
    // Since the server doesn't expose the word, we'll call a special reveal endpoint
    // For now, we reveal via the game logic — call with a known correct dummy approach
    // Instead, we ask the API for the word only on game over
    try {
      const res = await axios.get('/api/word-reveal');
      setCorrectAnswer(res.data.word);
    } catch {
      setCorrectAnswer('?????');
    }
  };

  const handleKey = useCallback((key) => {
    if (gameState !== 'playing' || isRevealing) return;

    if (key === '⌫' || key === 'Backspace') {
      setCurrentGuess(g => g.slice(0, -1));
    } else if (key === 'ENTER' || key === 'Enter') {
      submitGuess();
    } else if (/^[A-Za-z]$/.test(key) && currentGuess.length < WORD_LENGTH) {
      setCurrentGuess(g => g + key.toUpperCase());
    }
  }, [gameState, isRevealing, currentGuess, submitGuess]);

  useEffect(() => {
    const handler = (e) => handleKey(e.key);
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleKey]);

  const handleLeaderboardSubmit = async (username) => {
    try {
      await axios.post('/api/leaderboard', {
        username,
        guesses: currentRow,
        timeSeconds: timer,
      });
      setSubmittedUsername(username);
      setShowWinModal(false);
      setShowLeaderboard(true);
    } catch {
      showToast('Failed to submit score');
    }
  };

  const handleSkipToLeaderboard = () => {
    setShowWinModal(false);
    setShowLeaderboard(true);
  };

  return (
    <div className="game">
      <Header
        onLeaderboard={() => setShowLeaderboard(true)}
        timer={timer}
      />

      <main className="game-main">
        <Grid
          guesses={guesses}
          results={results}
          currentGuess={currentGuess}
          currentRow={currentRow}
          isRevealing={isRevealing}
          shakingRow={shakingRow}
        />
        <Keyboard
          onKey={handleKey}
          letterStatuses={letterStatuses}
          disabled={gameState !== 'playing' || isRevealing}
        />
      </main>

      {toastMsg && (
        <Toast message={toastMsg} onDone={() => setToastMsg('')} />
      )}

      {showWinModal && (
        <WinModal
          guesses={currentRow}
          timeSeconds={timer}
          onSubmit={handleLeaderboardSubmit}
          onSkip={handleSkipToLeaderboard}
        />
      )}

      {showGameOverModal && (
        <GameOverModal
          answer={correctAnswer}
          onLeaderboard={() => {
            setShowGameOverModal(false);
            setShowLeaderboard(true);
          }}
        />
      )}

      {showLeaderboard && (
        <Leaderboard
          onClose={() => setShowLeaderboard(false)}
          highlightUsername={submittedUsername}
        />
      )}
    </div>
  );
}
