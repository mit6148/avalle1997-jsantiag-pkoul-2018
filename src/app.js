const http = require('http');
const express = require('express');


// express app instance
const app = express();

// make the server by hooking it up to the app
app.get('/', function(req, res) {
  res.send('Back to the routes!');
});

// const server = http.createServer(function(req, res) {
//   res.end('Back to the routes!');
// });

const port = 3001;
server.listen(port, function() {
  console.log('Server running on port: ' + port);
});
