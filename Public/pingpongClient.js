var lastPackage = 0;
var player1Score = 0;
var p1Changed = false;
var player2Score = 2;
var p2Changed = false;
//Ello
function startGame() {
    myBackgroundArea.start();
    myGameArea.start();
    myGameArea.clear();
    PlayerOneRed = new component(30, 130, "black", 20, 200);
    PlayerTwoBlue = new component(30, 130, "black", 940, 200);
    TheBall = new component(20,20, 'black', 480, 230);
    TheBall.speedX = 2;
    Top = new component(1000, 5, "black", 0, 0);
    Bottom = new component(1000, 5, "black", 0, 495);
    Middle = new component(6, 25, "black", 497, 0);
    setUpGameScreen();
    //var increaseGameSpeed = setInterval(myTimer, 10000);
}

function setUpGameScreen(){
  myBackgroundArea.clear();
  myGameArea.clear();
  ctx = myBackgroundArea.context;
  ctx.fillRect(0, 0, 1000, 5); // Top
  ctx.fillRect(0, 495, 1000, 5); // Bottom
  ctx.fillRect(497, 0, 6, 500);
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
    updateGameArea();
    lastPackage = data.timeStamp;
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

function component(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.nextX = 0;
    this.nextY = 0;
    this.x = x;
    this.y = y;
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
}

function updateNewXandY(obj){
  obj.x = obj.nextX;
  obj.y = obj.nextY;
}

function updateGameArea() {
  if(p1Changed){
    $('#playertwoScoreLabel').text(player1Score);
    p1Changed = false;
  }
  if(p2Changed){
    $('#playerOneScoreLabel').text(player2Score);
    p2Changed = false;
  }
  if(PlayerOneRed.nextX != PlayerOneRed.x || PlayerOneRed.nextY != PlayerOneRed.y){
    PlayerOneRed.clearObj();
    updateNewXandY(PlayerOneRed);
  }
  if(PlayerTwoBlue.nextX != PlayerTwoBlue.x || PlayerTwoBlue.nextY != PlayerTwoBlue.y){
    PlayerTwoBlue.clearObj()
    updateNewXandY(PlayerTwoBlue);
  }
  TheBall.clearCircle();
  updateNewXandY(TheBall);

  TheBall.updateCircle();
  PlayerOneRed.update();
  PlayerTwoBlue.update();

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
}