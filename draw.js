"use strict";
module.exports ={
  //constructor
  DrawGame: function(game, connections){
    var fastSpeed = 8;
    var slowSpeed = 4;
    this.playerComponents = [];
    this.players = [];
    this.numberOfPlayers = 0;
    this.gameState = [];
    this.getNextPlayerNumber  = function getNextPlayerNumber(socketId){
      let np = ++this.numberOfPlayers;
      this.players[np] = socketId;
      return np;
    };

    this.start = function(){
      this.setUpPlayers();
      let t = this;
      this.interval = setInterval(function(){t.update()}, 20);
    };

    this.stop = function(){

    };

    this.update = function(){
      for(var i = 0; i<this.numberOfPlayers; i++){
        var newX = this.playerComponents[i].x + this.playerComponents[i].speedX;
        var newY = this.playerComponents[i].y + this.playerComponents[i].speedY;
        var objHeight = this.playerComponents[i].height;
        var objWidth = this.playerComponents[i].width;
        if(newX > 0 && newY > 0 && ((newY + objHeight) < 500) && ((newX + objWidth) < 1000 )){
          this.playerComponents[i].newPos();
        }
        var playerPos = new playerPackage(this.playerComponents[i].x, this.playerComponents[i].y, this.playerComponents[i].width, this.playerComponents[i].height);
        this.gameState[i] = playerPos;
      }

      for (var socketId in game.viewSockets) {
          connections[socketId].emit('updateGameState', this.gameState)
      }

    };

    this.setUpPlayers = function(){
      for(var i = 0; i<this.numberOfPlayers; i++){
        var x = Math.random()*500;
        x = Math.round(x);
        var y = Math.random()*500;
        y = Math.round(y);
        this.playerComponents[i] = new component(100, 100, "black", x, y);
      }
      console.log(this.playerComponents);
    };

    this.setDirection = function setDirection(playerAndDirection) {
        let speedY = 0;
        let speedX = 0;
        if (playerAndDirection.move === 'U0') {
            speedY = slowSpeed *-1;
        }
        if (playerAndDirection.move === 'U1') {
            speedY = fastSpeed * -1;
        }
        if (playerAndDirection.move === 'D0') {
            speedY = slowSpeed;
        }
        if (playerAndDirection.move === 'D1') {
            speedY = fastSpeed;
        }
        if (playerAndDirection.move === 'L0'){
            speedX = slowSpeed *-1;
        }
        if (playerAndDirection.move === 'L1'){
            speedX = fastSpeed*-1;
        }
        if (playerAndDirection.move === 'R0'){
            speedX = slowSpeed;
        }
        if (playerAndDirection.move === 'R1'){
            speedX = fastSpeed;
        }
        if (playerAndDirection.move === 'LD0'){
            speedX = slowSpeed * -1;
            speedY = slowSpeed;
        }
        if (playerAndDirection.move === 'LD1'){
            speedX = fastSpeed *-1;
            speedY = fastSpeed;
        }
        if (playerAndDirection.move === 'RD0'){
            speedX = slowSpeed;
            speedY = slowSpeed;
        }
        if (playerAndDirection.move === 'RD1'){
            speedX = fastSpeed;
            speedY = fastSpeed;
        }
        if (playerAndDirection.move === 'RU0'){
            speedX = slowSpeed;
            speedY = slowSpeed * -1;
        }
        if (playerAndDirection.move === 'RU1'){
            speedX = fastSpeed;
            speedY = fastSpeed * -1;
        }
        if (playerAndDirection.move === 'LU0'){
            speedX = slowSpeed * -1;
            speedY = slowSpeed * -1;
        }
        if (playerAndDirection.move === 'LU1'){
            speedX = fastSpeed * -1;
            speedY = fastSpeed * -1;
        }
        console.log(playerAndDirection);
        this.playerComponents[playerAndDirection.player-1].speedX = speedX;
        this.playerComponents[playerAndDirection.player-1].speedY = speedY;
    }
  }
}

function playerPackage(x, y, width, height){
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
}

function component(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.collide = false;
    this.newPos = function() {
        this.x += this.speedX;
        this.y += this.speedY;
    }
    this.newPosX = function(){
      this.x += this.speedX;
    }
    this.newPosY = function(){
      this.y += this.speedY;
    }
}

//Private methods goes here..
