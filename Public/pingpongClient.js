var lastPackage = 0;

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

    myBackgroundArea.clear();
    myGameArea.clear();
    ctx = myBackgroundArea.context;
    ctx.fillRect(0, 0, 1000, 5);


    //var increaseGameSpeed = setInterval(myTimer, 10000);
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
        this.context = this.canvas.getContext("2d");
        document.getElementById('canvasBackground').appendChild(this.canvas);
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
        this.context = this.canvas.getContext("2d");
        document.getElementById('canvasGame').appendChild(this.canvas);
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
        ctx.clearRect(this.x, this.y, this.width, this.height);
    }
    this.clearObj = function(){
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
/*
for(var i=0; i<10; i++){
    Middle.update();
    Middle.y += 50;
}
Middle.y = 12;
*/
