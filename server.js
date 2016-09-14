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
app.set('views', __dirname + '/Views');

//Routes
app.get('/', function(req, res){
  res.render('pages/index');
});

app.get('/game', function(req, res){
  let uniqueId = helper.getRandomId5();
  res.render('pages/game', {data: uniqueId});
})

app.get('/connectionTest', function(req, res){
  res.render('pages/connectionTest');
});

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

  //Send message
  socket.on('send message', (data)=>{
    console.log(data);
    activeGames[data.id].viewSockets.forEach(function(socket){
      socket.emit('new message', {msg: data.msg});
    });
  });

  //Register a new socket
  socket.on('register', (data)=>{

    //Checking if he socket is a browser or phone
    if(data.type === 'output'){

      //Creating a new Game-object
      let game = new models.Game();
      game.viewSockets.push(socket);

      //Adding the instance
      activeGames[data.id] = game;

      console.log('Registred room: ' + data.id);

      //Here maybe an instance of the game should be created..
    }

    else if(data.type === 'input'){
      if(activeGames[data.id] === undefined){
          socket.emit('new message', {msg: 'No room found'});
          //disconnect the socket here..
      }
      else{
          activeGames[data.id].inputSockets.push(socket);
          socket.emit('new message', {msg: 'You are connected as input!'});
          console.log('Registred new input to room: ' + data.id);
      }
    }
  });

});
