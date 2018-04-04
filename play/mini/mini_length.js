// this file will set up the mini game functions and event listeners
$(function(){
var canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight - 120;
var ctx = canvas.getContext("2d"); // 2D rendering space

// SLIDER
$("#lengthSlider").click(function(){
  lastCarLength = this.value;
  $("#lengthDisplay").text("Length: " + lastCarLength);
  ctx.clearRect(0,0,canvasWidth,canvasHeight);
  drawHorizontalLines();
  var car = new Car(this.value-0, CHOSEN_PADDING);
  car.fill(ctx, lastXPos, lastYPos);
});

var lastXPos, lastYPos, lastCarLength;
var PARKING_SPACING = 200; // spacing between each vertical parking line
var VERTICAL_LINE_LENGTH = 200;
var PARKING_START_LOCATION = 10;
var NUM_SPACES = 4;
var SCALE_FACTOR = 0.2;
var PADDING_FOR_PARKING_FRONT = 5;
var PADDING_FOR_PARKING_SIDES = 5;
var CAR_WIDTH = 100;
var DEFAULT_CAR_LENGTH = 100;
var DEFAULT_CAR_PADDING = 5;
// STAYS UNCHANGE
var CAR_HEIGHT = 50;
// CHANGABLE PARAMETERS
var CHOSEN_CAR_LENGTH = 100;
var CHOSEN_PADDING = 5;

// LOAD THE IMAGE
var img = new Image();
img.onload = function(){
  ctx.drawImage(img, window.innerWidth/2, window.innerHeight/2, img.width*SCALE_FACTOR + CHOSEN_CAR_LENGTH, img.height*SCALE_FACTOR);
}
img.src = "../img/player_car.png";

// DRAWING BOARD ===========================================================================================================
lastCarLength = CHOSEN_CAR_LENGTH;
var car = new Car(CHOSEN_CAR_LENGTH, CHOSEN_PADDING);
car.fill(ctx, window.innerWidth/2, window.innerHeight/2);
drawHorizontalLines();
lastXPos = window.innerWidth/2;
lastYPos = window.innerHeight/2;


// FUNCTIONS ===============================================================================================================


function drawHorizontalLines(){
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.strokeStyle = "black";
  ctx.moveTo(0, PARKING_START_LOCATION);
  ctx.lineTo(PARKING_SPACING*(NUM_SPACES+1), PARKING_START_LOCATION);
  ctx.stroke();
}

function Car(leng, padding){
  this.leng = (leng === null) ? DEFAULT_CAR_LENGTH : leng;
  this.padding = (padding === null) ? DEFAULT_CAR_PADDING : padding;

  this.fill = function(ctx, xPos, yPos){
    ctx.drawImage(img, xPos, yPos, img.width*SCALE_FACTOR + leng, img.height*SCALE_FACTOR);
  }
}


// EVENT HANDELERS
var canvasOffset=$("#canvas").offset();
    var offsetX=canvasOffset.left;
    var offsetY=canvasOffset.top;
    var canvasWidth=canvas.width;
    var canvasHeight=canvas.height;
    var isDragging=false;

    function handleMouseDown(e){
      canMouseX=parseInt(e.clientX-offsetX);
      canMouseY=parseInt(e.clientY-offsetY);
      // set the drag flag
      isDragging=true;
      started = true;
    }

    function handleMouseUp(e){
      canMouseX=parseInt(e.clientX-offsetX);
      canMouseY=parseInt(e.clientY-offsetY);
      // clear the drag flag
      isDragging=false;

      if(started && !isDragging){
          // ADD IN FUNCTION AFTER DROPPING CAR
          parkCarsAI();
      }

    }

    function handleMouseOut(e){
      canMouseX=parseInt(e.clientX-offsetX);
      canMouseY=parseInt(e.clientY-offsetY);
      // user has left the canvas, so clear the drag flag
      //isDragging=false;
    }

    function handleMouseMove(e){
      canMouseX=parseInt(e.clientX-offsetX);
      canMouseY=parseInt(e.clientY-offsetY);
      // if the drag flag is set, clear the canvas and draw the image
      if(isDragging){
          ctx.clearRect(0,0,canvasWidth,canvasHeight);
          drawHorizontalLines();
          var car = new Car(lastCarLength-0, CHOSEN_PADDING);
          car.fill(ctx,canMouseX-128/2,canMouseY-120/2);
          lastXPos = canMouseX-128/2;
          lastYPos = canMouseY-120/2;
        //  ctx.drawImage(img,canMouseX-128/2,canMouseY-120/2, img.width*SCALE_FACTOR, img.height*SCALE_FACTOR);
      }
    }

    $("#canvas").mousedown(function(e){handleMouseDown(e);});
    $("#canvas").mousemove(function(e){handleMouseMove(e);});
    $("#canvas").mouseup(function(e){handleMouseUp(e);});
    $("#canvas").mouseout(function(e){handleMouseOut(e);});


});
