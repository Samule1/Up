"use strict";
module.exports ={
  //constructor
  DrawGame: function(game, connections){
    this.playerComponents = [];
    this.players = [];
    this.numberOfPlayers = 0;
    this.getNextPlayerNumber  = function getNextPlayerNumber(socketId){
      let np = ++this.numberOfPlayers;
      this.players[np] = socketId;
      return np;
    };

    this.start = function(){
      setUpPlayers();
      let t = this;
      this.interval = setInterval(function(){t.update()}, 20);
    };

    this.stop = function(){

    };

    this.update = function(){
      for(int i = 0; i<this.numberOfPlayers; i++){
        this.playerComponents[i].newPos();
      }


      let gameState = {
          nrOfPlayer: {nr: this.numberOfPlayers},
          p1: {x: this.PlayerOneRed.x, y: this.PlayerOneRed.y, collide:this.PlayerOneRed.collide},
          p2: {x: this.PlayerTwoBlue.x, y: this.PlayerTwoBlue.y, collide:this.PlayerTwoBlue.collide},
          ball: {x: this.TheBall.x, y: this.TheBall.y, collide:this.TheBall.collide},
          Top: {collide: this.Top.collide},
          Bottom: {collide: this.Bottom.collide},
          playerScore: {playerOneScore: playerOneScore, playerTwoScore: playerTwoScore},
          timeStamp: new Date().getTime()
      };
    };

    this.setUpPlayers = function(){
      for(int i = 0; i<this.numberOfPlayers; i++){
        var x = Math.random()*1000;
        var y = Math.random()*800;
        this.playerComponents[i] = new component(100, 100, "black", x, y);
      }
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
        if (playerAndDirection.player === 1) {
            this.PlayerOneRed.speedY = speedY;
            this.PlayerOneRed.speedX = speedX;
        }
        else if (playerAndDirection.player === 2) {
            this.PlayerTwoBlue.speedY = speedY;
            this.PlayerTwoBlue.speedX = speedX;
        }
        else {
            console.log('error in playerDirection');
        }
    }
  }
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
