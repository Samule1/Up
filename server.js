"use strict"; // This is for es6 (so we can use 'let' for instance)
var express = require("express");
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var helper = require('./helpers.js');
var models = require('./models.js');

//Globals
let connections = [];
let activeGames = {};

app.set('view engine', 'ejs');

//Routes
app.get('/', function(req, res){
  res.render('pages/index');
});

app.get('/game', function(req, res){
  let uniqueId = helper.getRandomId5();
  res.render('pages/game', {data: uniqueId});
})

server.listen(process.env.PORT || 3000);
console.log('Server running..');
console.log('Listening on: '+ process.env.PORT);


//Socket events..
io.sockets.on('connection', (socket) => {
  connections.push(socket);
  console.log('Connected: %s sockets connected', connections.length);

  //Disconnect
  socket.on('disconnect', (data)=>{
    connections.splice(connections.indexOf(socket),1);
    console.log('Disconnected: %s sockets connected', connections.length);
  });

  socket.on('register', (data)=>{
    console.log('Registred room: ' + data.id);

    //Adding the connection to the list of games
    let idTemp = data.id;
    let game = new models.Game();

    //Checking if he socket is a browser or phone
    if(data.type === 'output')
      game.viewSockets.push(socket);
    else if(data.type === 'input')
      game.inputSockets.push(socket);

    //Adding the instance
    activeGames[idTemp] = game;

    //Just showing the what you can do here..
    activeGames[idTemp].viewSockets.forEach(function(socket){
      socket.emit('new message', {msg: 'Du är nu anluten som output!'});
    });
  });

});
