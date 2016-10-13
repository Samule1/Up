"use strict"; // This is for es6 (so we can use 'let' for instance)
var express = require("express");
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var helper = require('./helpers.js');
var models = require('./models.js');
var games = require('./pingpong.js');
var bodyParser = require('body-parser')

//Globals
let connections = [];
let activeGames = {};

app.set('view engine', 'ejs');
app.set('views', __dirname + '/Views');
app.use(express.static('Public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var router = new require( __dirname + '/Routes/routes_get.js').Router(app,connections,activeGames);


server.listen(process.env.PORT || 3000);
console.log('Server running..');
console.log('Listening on: ' + process.env.PORT);



//Socket events..
io.sockets.on('connection', (socket) => {
    let id = helper.getRandomId5();
    while (connections[id] != undefined) {
        id = helper.getRandomId5();
    }
    socket.id = id;
    connections[socket.id] = socket;
    connections.length++;
    console.log('Connected: %s sockets connected', connections.length);

    //Disconnect
    socket.on('disconnect', (data)=> {
        if(socket.type === 'output'){
            activeGames[socket.roomId].viewSockets.splice(socket.id, 1);
            //generate disconnect event
        }
        else if(socket.type === 'input'){
            activeGames[socket.roomId].inputSockets.splice(socket.id, 1);
        }
        else{
            console.log('Error in disconnect' + socket);
        }
        connections.splice(connections[socket.id], 1)
        console.log('Disconnected: %s sockets connected', connections.length);
    });


    //Send message
    socket.on('send message', (data)=> {
        for(var viewSocketId in activeGames[data.id].viewSockets){
            connections[viewSocketId].emit('new message', {msg: data.msg, nick: data.nick});
        }
    });

    //Register a new socket
    socket.on('register', (data)=> {

        //Checking if he socket is a browser or phone
        if (data.type === 'output') {

          //Is the viewSocket starting the game ir joining as observer?
          if(activeGames[data.id] === undefined){
            //Creating a new Game-object
            let game = new models.Game();
            game.viewSockets[socket.id] = socket.id;

            //Adding the instance
            activeGames[data.id] = game;
            socket.roomId = data.id;
            socket.type = 'output';

            console.log('Registred room: ' + data.id);

            //Here maybe an instance of the game should be created..
            activeGames[data.id].gameState = new games.PingpongGame(activeGames[data.id], connections);
            //activeGames[data.id].gameState.initGame();
          }
          else {
            activeGames[data.id].viewSockets[socket.id] = socket.id;
            console.log('Connected new observer socket!');
          }


        }

        else if (data.type === 'input') {
            if (activeGames[data.id] === undefined) {
                socket.emit('new message', {msg: 'No room found', success: false});
                socket.disconnect();
                //disconnect the socket here..
            }
            else {
                activeGames[data.id].inputSockets[socket.id] = socket.id;
                socket.roomId = data.id;
                socket.type = 'input';
                socket.player = activeGames[data.id].gameState.getNextPlayerNumber();

                for(var viewSocketId in activeGames[data.id].viewSockets){
                    connections[viewSocketId].emit('new player connected', data);
                }
                socket.emit('new message', {msg: 'You are connected as input!', success: true});

                //Special for andriodtester..
                /*
                if(data.nick === testare){
                  console.log('testare!')
                  socket.isTesting = true;
                }
                */

                console.log('Registred new input to room: ' + data.id);
            }
        }
    });

  //Trigger vibrate event on phone.. WILL NOT WORK FOR MULTIPLE PHONES...
  socket.on('feedback', (data)=>{
    for(let socketId in activeGames[socket.roomId].inputSockets){
      connections[socketId].emit('move received', data);
    }
  });

  //Disconnect input
  socket.on('quit session', (data)=>{

    });

    //Register new move to game
    socket.on('new move', (data)=>{
        data.player = socket.player;
        activeGames[socket.roomId].gameState.setDirection(data);

        if(socket.isTesting === true){
          for(let socketId in activeGames[socket.roomId].viewSockets){
            connections[socketId].emit('new move', data);
          }
        }
    });

    socket.on('start game', (data)=>{
        activeGames[socket.roomId].gameState.start();
    });
});
