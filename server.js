"use strict"; // This is for es6 (so we can use 'let' for instance)
var express = require("express");
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var helper = require('./helpers.js');
var models = require('./models.js');
var games = require('./pingpong.js');

//Globals
let connections = [];
let activeGames = {};

app.set('view engine', 'ejs');
app.set('views', __dirname + '/Views');
//app.use(express.static(__dirname+ '/Scripts'));
app.use(express.static('Public'));
//Routes
app.get('/', function (req, res) {
    res.render('pages/index');
});

app.get('/game', function (req, res) {
    let uniqueId = helper.getRandomId5();
    res.render('pages/game', {data: uniqueId});
});

app.get('/connectionTest', function (req, res) {
    res.render('pages/connectionTest');
});

app.get('/testGame', function (req, res) {
    res.render('pages/pingpong');
});
app.get('/gameframe', function (req, res) {
    res.render('partials/gameWindow');
});
app.get('/inputCard', function (req, res) {
    res.render('partials/inputCard', {roomId: req.query.roomId, nick: req.query.nick})
});

app.get('/stage', function (req, res) {
    let uniqueId = helper.getRandomId5();
    let qrSource = "https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=[roomId]"
    let playerLimit = 2;
    qrSource = qrSource.replace("[roomId]", uniqueId);
    res.render('pages/stage', {data: uniqueId, qr: qrSource, playerLimit: playerLimit});
});

app.get('/androidtest', function(req, res){
  let uniqueId = helper.getRandomId5();
  let qrSource = "https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=[roomId]"
  let playerLimit = 1;
  qrSource = qrSource.replace("[roomId]", uniqueId);
  res.render('pages/androidtester', {data: uniqueId, qr: qrSource, playerLimit: playerLimit});
});

app.get('/androidtestsite', function(req, res){
  res.render('partials/androidtestsite');
});

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
        console.log(data);
        for(var viewSocketId in activeGames[data.id].viewSockets){
            console.log('in the leep');
            connections[viewSocketId].emit('new message', {msg: data.msg, nick: data.nick});
        }
    });

    //Register a new socket
    socket.on('register', (data)=> {

        //Checking if he socket is a browser or phone
        if (data.type === 'output') {

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
                for(var viewSocketId in activeGames[data.id].viewSockets){
                    connections[viewSocketId].emit('new player connected', data);
                }
                socket.emit('new message', {msg: 'You are connected as input!', success: true});

                console.log('Registred new input to room: ' + data.id);
            }
        }
    });

  //Trigger vibrate event on phone.. WILL NOT WORK FOR MULTIPLE PHONES...
  socket.on('feedback', (data)=>{
    activeGames[data.roomId].inputSockets.forEach(function(socket){
      socket.emit('move received');
    });
  });

  //Disconnect input
  socket.on('quit session', (data)=>{

    });

    //Register new move to game
    socket.on('new move', (data)=>{
        activeGames[socket.roomId].gameState.setDirection(data.move);
    });

    socket.on('start game', (data)=>{
        activeGames[socket.roomId].gameState.start();
    });
});
