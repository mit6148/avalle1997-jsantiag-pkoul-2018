const http = require('http');
const express = require('express');


const app = express();

app.use('/static', express.static('public'));

app.get('/', function(req, res) {
  res.sendFile('index.html', { root: 'src/views' });
});

app.get('/u/forum', function(req, res) {
  res.sendFile('forum.html', { root: 'src/views' });
});

const port = 3000;
const server = http.Server(app);
server.listen(port, function() {
  console.log('Server running on port: ' + port);
});
