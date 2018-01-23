const http = require('http');
const express = require('express');


const app = express();

app.use('/static', express.static('public'));

app.get('/', function(req, res) {
  res.sendFile('login.html', { root: 'public/login' });
});

app.get('/u/game', function(req, res) {
  res.sendFile('game.html', { root: 'public/game' });
});

app.get('/u/forum', function(req, res) {
  res.sendFile('forum.html', { root: 'public/forum' });
});

const port = 3000;
const server = http.Server(app);
server.listen(port, function() {
  console.log('Server running on port: ' + port);
});
