var playerArray = [];
var lastPackage = 0;
// pic
var imageKanye = new Image();
imageKanye.src = '/Images/kanye.png';

function startGame(){
  console.log('StartGame() has been called1')
  myBackgroundArea.start();
  myGameArea.start();
  setUpPlayers();
  drawGameArea();
}

var requestAnimationFrame =
          window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          window.mozRequestAnimationFrame;

var myBackgroundArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.pressedKeys = [];
        this.canvas.width = 1000;
        this.canvas.height = 500    ;
        this.canvas.style.position = "absolute";
        this.canvas.style.zIndex = "0";
        //this.canvas.style.backgroundColor = "white";
        this.context = this.canvas.getContext("2d");
        document.getElementById('canvasContainer').appendChild(this.canvas);
        //document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.pressedKeys = [];
        this.canvas.width = 1000;
        this.canvas.height = 500    ;
        this.canvas.style.zIndex = "1";
        this.canvas.style.backgroundColor = "white";
        this.context = this.canvas.getContext("2d");
        document.getElementById('canvasContainer').appendChild(this.canvas);
        //document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function setUpPlayers(){
  for(var i = 0; i<connectedPlayers; i++){
    var player = new component(70, 100, "black", 1500, 1500, imageKanye);
    playerArray[i] = player;
  }
}

function updatePositons(data){
  /*
  console.log(data);
  console.log(data[0].x);
  console.log(data[0].y);
  console.log(connectedPlayers);
  console.log(playerArray);
  */
  for(var i = 0; i<connectedPlayers; i++){
    playerArray[i].nextX = data[i].x;
    playerArray[i].nextY = data[i].y;
    playerArray[i].width = data[i].width;
    playerArray[i].height = data[i].height;
  }

}


function drawGameArea(){
  for(var i = 0; i<connectedPlayers; i++){
    //console.log("Player : " + i + " " + playerArray[i].x + " " + playerArray[i].y);
    playerArray[i].clearObj();
    //console.log(playerArray[i]);
    playerArray[i].newPos();
    playerArray[i].updateImage();
  }

  requestAnimationFrame(drawGameArea);
}

function component(width, height, color, x, y, img) {
    this.width = width;
    this.height = height;
    this.nextX = 200;
    this.nextY = 200;
    this.x = x;
    this.y = y;
    this.sprite = img;
    this.collide = false;
    this.update = function(){
        ctx = myGameArea.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    this.updateCircle = function(){
        ctx = myGameArea.context;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(this.x+10,this.y+10,9,0*Math.PI,2*Math.PI);
        ctx.stroke();
        ctx.fill();
    }
    this.clearCircle = function(){
        ctx = myGameArea.context;
        ctx.clearRect(this.x, this.y, this.width, this.height);
    }
    this.clearObj = function(){
        ctx = myGameArea.context;
        ctx.clearRect(this.x, this.y, this.width, this.height);
    }
    this.newPos = function() {
        this.x = this.nextX;
        this.y = this.nextY;
    }
    this.updateImage = function(){
        ctx = myGameArea.context;
        /*
        ctx.shadowColor = '#999';
        ctx.shadowBlur = 20;
        ctx.shadowOffsetX = 15;
        ctx.shadowOffsetY = 15;
        */
        ctx.drawImage(this.sprite, this.x, this.y, this.width, this.height);
    }////
}
