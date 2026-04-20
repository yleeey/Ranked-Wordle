const express = require('express');
const router = express.Router();
const LeaderboardEntry = require('../models/LeaderboardEntry');
const { getDailyWord, isValidWord } = require('../utils/words');

// GET /api/word - returns today's word length (not the word itself)
router.get('/word', (req, res) => {
  const word = getDailyWord();
  res.json({ length: word.length });
});

// GET /api/word-reveal - returns the word (used only after game over)
router.get('/word-reveal', (req, res) => {
  const word = getDailyWord();
  res.json({ word });
});

// POST /api/guess - validate a guess
router.post('/guess', (req, res) => {
  const { guess } = req.body;
  if (!guess || guess.length !== 5) {
    return res.status(400).json({ error: 'Guess must be 5 letters' });
  }

  const upperGuess = guess.toUpperCase();

  if (!isValidWord(upperGuess)) {
    return res.status(400).json({ error: 'Not in word list' });
  }

  const target = getDailyWord();
  const result = evaluateGuess(upperGuess, target);
  const correct = upperGuess === target;

  res.json({ result, correct, guess: upperGuess });
});

// POST /api/leaderboard - submit a score
router.post('/leaderboard', async (req, res) => {
  try {
    const { username, guesses, timeSeconds } = req.body;
    if (!username || !guesses || timeSeconds === undefined) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    const word = getDailyWord();
    const entry = new LeaderboardEntry({
      username: username.trim().substring(0, 20),
      word,
      guesses,
      timeSeconds,
    });

    await entry.save();
    res.status(201).json({ message: 'Score submitted!', entry });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/leaderboard - fetch top scores for today's word
router.get('/leaderboard', async (req, res) => {
  try {
    const word = getDailyWord();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const entries = await LeaderboardEntry.find({
      word,
      date: { $gte: today },
    })
      .sort({ guesses: 1, timeSeconds: 1 })
      .limit(50);

    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

function evaluateGuess(guess, target) {
  const result = Array(5).fill('absent');
  const targetLetters = target.split('');
  const guessLetters = guess.split('');

  // First pass: correct positions
  for (let i = 0; i < 5; i++) {
    if (guessLetters[i] === targetLetters[i]) {
      result[i] = 'correct';
      targetLetters[i] = null;
      guessLetters[i] = null;
    }
  }

  // Second pass: present but wrong position
  for (let i = 0; i < 5; i++) {
    if (guessLetters[i] === null) continue;
    const idx = targetLetters.indexOf(guessLetters[i]);
    if (idx !== -1) {
      result[i] = 'present';
      targetLetters[idx] = null;
    }
  }

  return result;
}

module.exports = router;
