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

      app.get('/activeGame', function(req, res){
        let roomId = req.query.roomId;

      });

      app.get('/watch', function(req, res){
        let roomId = req.query.roomId;
        res.render('pages/watch', {data: roomId}); 
      });

      app.post('/findRoom', function(req, res){
        console.log(req.body.room)
        let roomId = req.body.room;
        res.setHeader('Content-Type', 'application/json');
        if(connections[roomId] != undefined){
            res.send(JSON.stringify({ success: true }));
        }
        res.send(JSON.stringify({ success: false }));
      });
  }
}
