"use strict";
module.exports ={
  //constructor
  DrawGame: function(game, connections){
    this.players = [];
    this.numberOfPlayers = 0;
    this.getNextPlayerNumber  = function getNextPlayerNumber(socketId){
      let np = ++this.numberOfPlayers;
      this.players[np] = socketId;
      return np;
    };
    this.start = function(){

    };
  }
}

//Private methods goes here..
