// dependencies
const express = require('express');
const router = express.Router();

// public endpoints
router.get('/u/game', function(req, res, next) {
  res.sendFile('game.html', { root: 'public/game' });
});

router.get('/u/forum', function(req, res) {
  res.sendFile('forum.html', { root: 'public/forum' });
});

module.exports = router;
