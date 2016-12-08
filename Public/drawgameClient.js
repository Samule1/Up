var playerArray = [];
var lastPackage = 0;

function startGame(){
  console.log('StartGame() has been called1')
  myBackgroundArea.start();
  myGameArea.start();
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

function updatePositons(data){
  console.log(data);
}


function drawGameArea(){


  requestAnimationFrame(drawGameArea);
}

function component(width, height, color, x, y, img) {
    this.width = width;
    this.height = height;
    this.nextX = 0;
    this.nextY = 0;
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
        this.x += this.speedX;
        this.y += this.speedY;
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
    }
}
