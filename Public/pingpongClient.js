var lastPackage = 0;
var player1Score = 0;
var p1Changed = false;
var player2Score = 2;
var p2Changed = false;

var dataBuffer = [];

var previouseTestupdateFreq = 0;
var testUpdateFreq = 0
var firstrun = true;

var imageBall = new Image();
imageBall.src = '/Images/ball.png';
var imagePad = new Image();
imagePad.src = '/Images/pad.png';
//
var requestAnimationFrame =
          window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          window.mozRequestAnimationFrame;

function startGame() {
    myBackgroundArea.start();
    myGameArea.start();
    myGameArea.clear();
    PlayerOneRed = new component(30, 130, "black", 20, 200, imagePad);
    PlayerTwoBlue = new component(30, 130, "black", 940, 200, imagePad);
    TheBall = new component(20,20, 'black', 480, 230, imageBall);
    TheBall.speedX = 2;
    Top = new component(1000, 5, "black", 0, 0);
    Bottom = new component(1000, 5, "black", 0, 495);
    Middle = new component(6, 25, "black", 497, 0);
    setUpGameScreen();
    drawGameArea();
    //var increaseGameSpeed = setInterval(myTimer, 10000);
}

function setUpGameScreen(){
  myBackgroundArea.clear();
  myGameArea.clear();
  ctx = myBackgroundArea.context;
  ctx.fillRect(0, 0, 1000, 5); // Top
  ctx.fillRect(0, 495, 1000, 5); // Bottom
  ctx.fillRect(497, 0, 6, 500);

  PlayerOneRed.updateImage();
  PlayerTwoBlue.updateImage();
}

function addToDataBuffer(data){
  dataBuffer.push(data);
}

function getDataFromBuffer(){
  if(dataBuffer.length > 0){
    return null;
  }
  else{
    return dataBuffer.pop();
  }
}

function updatePositons(data){

  if(data.timeStamp > lastPackage){
    PlayerOneRed.nextX = data.p1.x;
    PlayerOneRed.nextY = data.p1.y;
    PlayerOneRed.collide = data.p1.collide;
    PlayerTwoBlue.nextX = data.p2.x;
    PlayerTwoBlue.nextY = data.p2.y;
    PlayerTwoBlue.collide = data.p2.collide;
    TheBall.nextX = data.ball.x;
    TheBall.nextY = data.ball.y;
    Bottom.collide = data.Bottom.collide;
    Top.collide = data.Top.collide;
    if(player1Score != data.playerScore.playerOneScore){
      player1Score = data.playerScore.playerOneScore;
      p1Changed = true;
    }
    if(player2Score != data.playerScore.playerTwoScore){
      player2Score = data.playerScore.playerTwoScore;
      p2Changed = true;
    }
    lastPackage = data.timeStamp;
    updateGameArea();
    }
    else{
      console.log('lost packet..');
    }
}

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
        ctx.drawImage(this.sprite, this.x, this.y, this.width, this.height);
    }
}

function updateNewXandY(obj){
  obj.x = obj.nextX;
  obj.y = obj.nextY;
}

function updateGameArea() {
  // Check for changes in scores
  var newPosFromBuffer = getDataFromBuffer();
  if(newPosFromBuffer != null){
    updatePositons(newPosFromBuffer);
  }
  if(p1Changed){
    $('#playerTwoScoreLabel').text(player1Score);
    p1Changed = false;
  }
  if(p2Changed){
    $('#playerOneScoreLabel').text(player2Score);
    p2Changed = false;
  }

/*
  if(PlayerOneRed.collide){
    PlayerOneRed.update();
    PlayerOneRed.collide = false;
  }
  if(PlayerTwoBlue.collide){
    PlayerTwoBlue.update();
    PlayerTwoBlue.collide = false;
  }
  if(Bottom.collide){
    Bottom.update();
    Bottom.collide = false;
  }
  if(Top.collide){
    Top.update();
    Top.collide = false;
  }
  */
}


  function drawGameArea(){
    testUpdate();
    // If pads are moving clearrect and repaint
    if(PlayerOneRed.nextX != PlayerOneRed.x || PlayerOneRed.nextY != PlayerOneRed.y){
      PlayerOneRed.clearObj();
      updateNewXandY(PlayerOneRed);
    }
    if(PlayerTwoBlue.nextX != PlayerTwoBlue.x || PlayerTwoBlue.nextY != PlayerTwoBlue.y){
      PlayerTwoBlue.clearObj()
      updateNewXandY(PlayerTwoBlue);
    }
    // clearCircle and update new x and y
    TheBall.clearCircle();
    updateNewXandY(TheBall);

    TheBall.updateImage();
    PlayerOneRed.updateImage();
    PlayerTwoBlue.updateImage();
    requestAnimationFrame(drawGameArea);
  }

  function testUpdate(){
    if(firstrun){
      previouseTestupdateFreq = Date.now();
    }
    else{
      testUpdateFreq = Date.now();
    }
    if((testUpdateFreq - previouseTestupdateFreq) > 40){
        console.log(testUpdateFreq - previouseTestupdateFreq);
    }

    if(firstrun){
      firstrun = false;
    }
    else{
      previouseTestupdateFreq = testUpdateFreq;
    }
  }
