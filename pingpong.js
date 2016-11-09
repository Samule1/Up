/**
 * Created by Flarpz on 2016-10-04.
 */
"use strict";
module.exports = {
    PingpongGame: function (game, connections) {
        var playerOneScore = 0;
        var playerTwoScore = 0;
        var testspeed = 0;
        var ballSpeed = 6;
        this.players = [];

        this.PlayerOneRed = new component(30, 130, "black", 20, 200);
        this.PlayerTwoBlue = new component(30, 130, "black", 940, 200);
        this.TheBall = new component(20, 20, 'black', 480, 230);
        this.TheBall.speedX = ballSpeed;
        this.Top = new component(1000, 5, "black", 0, 0);
        this.Bottom = new component(1000, 5, "black", 0, 495);
        this.numberOfPlayers = 0;

        this.getNextPlayerNumber  = function getNextPlayerNumber(socketId){
          let np = ++this.numberOfPlayers;
          this.players[np] = socketId;
          return np;

        }
        this.update = function update() {
            if (collisonTest2(this.Top, this.TheBall)) {
                reverseAngel(this.TheBall);
                this.TheBall.collide = true;
            }
            if (collisonTest2(this.Bottom, this.TheBall)) {
                reverseAngel(this.TheBall);
                this.TheBall.collide = true;
            }
            if ((this.PlayerOneRed.y + this.PlayerOneRed.speedY) > 0 && (this.PlayerOneRed.y + this.PlayerOneRed.speedY) < 500 - 130
            && (this.PlayerOneRed.x + this.PlayerOneRed.speedX) > 0 && (this.PlayerOneRed.x + this.PlayerOneRed.speedX) < 400 ) {
                this.PlayerOneRed.newPos();
            }
            if ((this.PlayerTwoBlue.y + this.PlayerTwoBlue.speedY) > 0 && (this.PlayerTwoBlue.y + this.PlayerTwoBlue.speedY) < 500 - 130
                && (this.PlayerTwoBlue.x + this.PlayerTwoBlue.speedX) > 600 && (this.PlayerTwoBlue.x + this.PlayerTwoBlue.speedX) < 970) {
                this.PlayerTwoBlue.newPos();
            }
            this.TheBall.newPos();
            newDirection(this.PlayerOneRed, this.TheBall, ballSpeed);
            if(this.PlayerOneRed.collide && connections[this.players[1]] != undefined ){
              connections[this.players[1]].emit('feedback');
            }
            newDirection(this.PlayerTwoBlue, this.TheBall, ballSpeed);
            if(this.PlayerTwoBlue.collide && connections[this.players[2]] != undefined ){
              connections[this.players[2]].emit('feedback');
            }

            if (this.TheBall.x < 0) {
                this.TheBall.x = 480;
                this.TheBall.y = 230;
                ballSpeed = 6;
                this.TheBall.speedX = ballSpeed;
                this.TheBall.speedY = 0;
                playerOneScore++;
              }
            else if(this.TheBall.x > 1000){
                this.TheBall.x = 480;
                this.TheBall.y = 230;
                ballSpeed = 6;
                this.TheBall.speedX = ballSpeed * -1;
                this.TheBall.speedY = 0;
                playerTwoScore++;
              }
            /*
            if (this.TheBall.x < 0 || this.TheBall.x > 1000) {
                this.TheBall.x = 500;
                this.TheBall.y = 250;
                this.TheBall.speedX = 2;
            }
            */
            //update positions

            let gameState = {
                p1: {x: this.PlayerOneRed.x, y: this.PlayerOneRed.y, collide:this.PlayerOneRed.collide},
                p2: {x: this.PlayerTwoBlue.x, y: this.PlayerTwoBlue.y, collide:this.PlayerTwoBlue.collide},
                ball: {x: this.TheBall.x, y: this.TheBall.y, collide:this.TheBall.collide},
                Top: {collide: this.Top.collide},
                Bottom: {collide: this.Bottom.collide},
                playerScore: {playerOneScore: playerOneScore, playerTwoScore: playerTwoScore},
                timeStamp: new Date().getTime()
            };
            for (var socketId in game.viewSockets) {
                if(connections[socketId] != undefined){
                    connections[socketId].emit('updateGameState', gameState)
                }

            }
            this.Top.collide = false;
            this.Bottom.collide = false;
            this.PlayerOneRed.collide = false;
            this.PlayerTwoBlue.collide = false;

        }

        this.increasespeed = function increasespeed(){
          /*
          console.log("timer increased speed of ball");
          console.log(ballSpeed);
          */
          if(ballSpeed < 12)
            ballSpeed += 4;
            if(this.TheBall.speedX > 0){
              this.TheBall.speedX = ballSpeed;
            }
            else{
              this.TheBall.speedX = ballSpeed *-1;
            }
        }

        this.start = function start() {
            let t = this;
            this.interval = setInterval(function(){t.update()}, 20);
            this.increaseSpeed = setInterval(function(){t.increasespeed()}, 30000);
        }
        this.stop = function stop() {
            //this.interval.
        }

        this.setDirection = function setDirection(playerAndDirection) {
            let speedY = 0;
            let speedX = 0;
            if (playerAndDirection.move === 'U0') {
                speedY = -2;
            }
            if (playerAndDirection.move === 'U1') {
                speedY = -4;
            }
            if (playerAndDirection.move === 'D0') {
                speedY = 2;
            }
            if (playerAndDirection.move === 'D1') {
                speedY = 4;
            }
            if (playerAndDirection.move === 'L0'){
                speedX = -2
            }
            if (playerAndDirection.move === 'L1'){
                speedX = -4;
            }
            if (playerAndDirection.move === 'R0'){
                speedX = 2;
            }
            if (playerAndDirection.move === 'R1'){
                speedX = 4;
            }
            if (playerAndDirection.move === 'LD0'){
                speedX = -2;
                speedY = 2;
            }
            if (playerAndDirection.move === 'LD1'){
                speedX = -4;
                speedY = 4;
            }
            if (playerAndDirection.move === 'RD0'){
                speedX = 2;
                speedY = 2;
            }
            if (playerAndDirection.move === 'RD1'){
                speedX = 4;
                speedY = 4;
            }
            if (playerAndDirection.move === 'RU0'){
                speedX = 2;
                speedY = -2;
            }
            if (playerAndDirection.move === 'RU1'){
                speedX = 4;
                speedY = -4;
            }
            if (playerAndDirection.move === 'LU0'){
                speedX = -2;
                speedY = -2;
            }
            if (playerAndDirection.move === 'LU1'){
                speedX = -4;
                speedY = -4;
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
}

function collisonTest2(rect1, rect2) {
    if (rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.height + rect1.y > rect2.y) {
        return true;
    }
}

function newDirection(rect1, rect2, ballSpeed){  // rect2 ball
    if(collisonTest2(rect1, rect2)){
        var mid = rect2.y + rect2.height/2;
        var interval = rect1.height/5;
        if(mid < (rect1.y + interval)){  //rect2.x
            reverseDirectionX(rect2, ballSpeed);
            rect2.speedY = ((ballSpeed/2) * -1);
            rect1.collide = true;
        }
        if(mid > (rect1.y +interval)  && mid < (rect1.y + interval*2)){
            reverseDirectionX(rect2, ballSpeed);
            rect2.speedY = ((ballSpeed/4) * -1);
            rect1.collide = true;
        }
        if(mid > (rect1.y + interval*2) && mid < (rect1.y + interval*3)){
            reverseDirectionX(rect2, ballSpeed);
            rect2.speedY = 0;
            rect1.collide = true;
        }
        if(mid > (rect1.y + interval*3) && mid < (rect1.y + interval*4)){
            reverseDirectionX(rect2, ballSpeed);
            rect2.speedY = (ballSpeed/4);
            rect1.collide = true;
        }
        if(mid > (rect1.y + interval*4)){
            reverseDirectionX(rect2, ballSpeed);
            rect2.speedY = ballSpeed/2;
            rect1.collide = true;
        }
    }
}

function reverseAngel(rect){
    if(rect.speedY > 0){
        rect.speedY = rect.speedY *-1;
    }
    else{
        rect.speedY = rect.speedY *-1;
    }
}

function reverseDirectionX(rect, ballSpeed){
    if(rect.speedX > 0 ){
        rect.speedX = rect.speedX * -1;
        if(rect.x > 500){
          rect.x = rect.x - (ballSpeed + 4);
        }
        else if(rect.x < 500){
          rect.x = rect.x + (ballSpeed + 4);
        }
    }
    else{
        rect.speedX = rect.speedX * -1;
        if(rect.x < 500){
          rect.x = rect.x + 15;
        }
    }
}
//hampus hej geh hjehjejhej
