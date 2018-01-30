// dependencies
const express = require('express');

const router = express.Router();

// public endpoints
router.get('/', function(req, res, next) {
  res.sendFile('index.html', { root: 'src/views' });
});
router.get('/u/end', function(req,res,next){
	res.sendFile('logout.html', {root:'src/views'});
});
router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/u/end'); 
});

router.get('/u/profile', function(req, res) {
  res.sendFile('profile.html', { root: 'src/views' });
});

router.get('/u/forum', function(req, res) {
  res.sendFile('forum.html', { root: 'src/views' });
});

router.get('/u/game', function(req, res) {
  res.sendFile('game.html', { root: 'src/views' });
});

module.exports = router;
