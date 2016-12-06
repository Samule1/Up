"use strict";
let helper = require(__dirname + '/../helpers.js');
module.exports = {
  Router: function(app, connections, activeGames){
      this.activeGames = activeGames;
      this.connections = connections;
      app.get('/', function (req, res) {
          res.render('pages/indexNew');
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
      app.get('/gameframedraw', function (req, res) {
          res.render('partials/gameWindowDraw');
      });
      app.get('/inputCard', function (req, res) {
          res.render('partials/inputCard', {roomId: req.query.roomId, nick: req.query.nick})
      });

      app.get('/stage', function (req, res) {
          let uniqueId = helper.getRandomId5();
          let qrSource = "https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=[roomId]"
          let playerLimit = 2;
          qrSource = qrSource.replace("[roomId]", uniqueId);
          res.render('pages/stageNew', {data: uniqueId, qr: qrSource, playerLimit: playerLimit});
      });

      app.get('/stageDrawGame', function (req, res) {
          let uniqueId = helper.getRandomId5();
          let qrSource = "https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=[roomId]"
          let playerLimit = 1;
          qrSource = qrSource.replace("[roomId]", uniqueId);
          res.render('pages/stageDraw', {data: uniqueId, qr: qrSource, playerLimit: playerLimit});
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

      app.get('/activeGame', function(req, res){
        let roomId = req.query.roomId;

      });

      app.get('/watch', function(req, res){
        let roomId = req.query.roomId;
        res.render('pages/watch', {data: roomId});
      });

      app.post('/findRoom', function(req, res){
        let roomId = req.body.room;
        res.setHeader('Content-Type', 'application/json');
        if(activeGames[roomId] != undefined){
            res.send(JSON.stringify({ success: true }));
        }
        res.send(JSON.stringify({ success: false }));
      });

      app.get('/debugGame', function (req, res) {
          res.render('pages/pingpongDebug');
      });

      app.get('/godView', function(req, res){
        res.render('pages/godView');
      });

      app.get('/connectedRooms', function(req, res){
        let outputSockets = [];
        for(let socketId in connections){
          if(connections[socketId].type === 'output')
            outputSockets.push(connections[socketId].id);
        }
        res.render('partials/connectedRooms', {sockets: outputSockets});
      });

      app.get('/connectedAndroids', function(req, res){
        let inputSockets = [];
        for(let socketId in connections){
          if(connections[socketId].type === 'input')
            inputSockets.push(connections[socketId].id);
        }
        res.render('partials/connectedAndroids', {sockets: inputSockets});
      });

      app.get('/dashboard', function(req, res){
        res.render('partials/dashboard');
      });

      app.get('/ping', function(req, res){
        let socketId = req.query.socketid;
        let socket = connections[socketId];
        if(socket != undefined){
          socket.ping(req, res, function(req, res, tStart, tStop){
            let dt = tStop - tStart;
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({ ping: dt, succsess: true }));
          });
        }
        else {
          res.setHeader('Content-Type', 'application/json');
          res.send(JSON.stringify({ succsess: false }));
        }

      })
  }
}
