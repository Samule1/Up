var express = require("express");
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

app.set('view engine', 'ejs');

app.get('/', function(req, res){
  res.render('pages/index');
});

app.get('/game', function(req, res){
  res.render('pages/game');
})

server.listen(process.env.PORT || 3000);
console.log('Server running..');
console.log('Listening on: '+ process.env.PORT);
