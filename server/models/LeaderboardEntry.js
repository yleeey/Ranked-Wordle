const mongoose = require('mongoose');

const leaderboardSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    maxlength: 20,
  },
  word: {
    type: String,
    required: true,
  },
  guesses: {
    type: Number,
    required: true,
    min: 1,
    max: 6,
  },
  timeSeconds: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('LeaderboardEntry', leaderboardSchema);
