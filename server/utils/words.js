const fs = require('fs');
const path = require('path');

// Resolve the path to your txt file
const filePath = path.join(__dirname, 'words.txt');

// Read file, convert to string, and split by new line/carriage return
const WORDS = fs.readFileSync(filePath, 'utf-8')
  .split(/\r?\n/)
  .map(word => word.trim().toUpperCase())
  .filter(word => word.length > 0); // Remove empty lines

function getDailyWord() {
  const now = new Date();
  const start = new Date(2024, 0, 1);
  const diff = Math.floor((now - start) / (1000 * 60 * 60 * 24));
  return WORDS[diff % WORDS.length];
}

function isValidWord(word) {
  return WORDS.includes(word.toUpperCase());
}

module.exports = { getDailyWord, isValidWord, WORDS };