
function startGame() {
    myGameArea.start();
    PlayerOneRed = new component(30, 130, "red", 20, 200);
    PlayerTwoBlue = new component(30, 130, "blue", 940, 200);
    TheBall = new component(20,20, 'black', 480, 230);
    TheBall.speedX = 2;
    Top = new component(1000, 5, "black", 0, 0);
    Bottom = new component(1000, 5, "black", 0, 495);
    //var increaseGameSpeed = setInterval(myTimer, 10000);
}

function updatePositons(data){
    PlayerOneRed.x = data.p1.x;
    PlayerOneRed.y = data.p1.y;
    PlayerTwoBlue.x = data.p2.x;
    PlayerTwoBlue.y = data.p2.y;
    TheBall.x = data.ball.x;
    TheBall.y = data.ball.y;
    updateGameArea();
}


var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.pressedKeys = [];
        this.canvas.width = 1000;
        this.canvas.height = 500    ;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function component(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.update = function(){
        ctx = myGameArea.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    this.newPos = function() {
        this.x += this.speedX;
        this.y += this.speedY;
    }
}

function updateGameArea() {
    myGameArea.clear();
    PlayerOneRed.update();
    PlayerTwoBlue.update();
    TheBall.update();
    Top.update();
    Bottom.update();
}
