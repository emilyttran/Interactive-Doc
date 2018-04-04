// this file will set up the mini game functions and event listeners
$(function(){
var canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight - 50;
var ctx = canvas.getContext("2d"); // 2D rendering space

var PARKING_SPACING = 150; // spacing between each vertical parking line
var VERTICAL_LINE_LENGTH = 200;
var NUM_SPACES = 5;


var img = new Image();
var SCALE_FACTOR = 0.3;
img.onload = function(){
  ctx.drawImage(img, window.innerWidth/2, window.innerHeight/2, img.width*SCALE_FACTOR, img.height*SCALE_FACTOR);
}

img.src = "../img/player_car.png";


$("#reset").click(function(){
  ctx.clearRect(0,0,canvasWidth,canvasHeight);
  drawVerticalLines(NUM_SPACES);
  ctx.drawImage(img, window.innerWidth/2, window.innerHeight/2, img.width*SCALE_FACTOR, img.height*SCALE_FACTOR);
})
drawVerticalLines(NUM_SPACES);
// DRAW VERTICAL LINES
function drawVerticalLines(NUM_SPACES){
  var verticalLines = [];
  var yPos = 10;
  var xPos;

  // create vertical line data
  for(var i = 1; i < NUM_SPACES; i++){
    ctx.lineWidth = 10;
    xPos = i * PARKING_SPACING;
    ctx.beginPath();
    ctx.strokeStyle = "black";
    ctx.moveTo(xPos, yPos);
    ctx.lineTo(xPos, yPos + VERTICAL_LINE_LENGTH);
    ctx.stroke();
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
    }

    function handleMouseUp(e){
      canMouseX=parseInt(e.clientX-offsetX);
      canMouseY=parseInt(e.clientY-offsetY);
      // clear the drag flag
      isDragging=false;
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
          drawVerticalLines(NUM_SPACES);
          ctx.drawImage(img,canMouseX-128/2,canMouseY-120/2, img.width*SCALE_FACTOR, img.height*SCALE_FACTOR);
      }
    }

    $("#canvas").mousedown(function(e){handleMouseDown(e);});
    $("#canvas").mousemove(function(e){handleMouseMove(e);});
    $("#canvas").mouseup(function(e){handleMouseUp(e);});
    $("#canvas").mouseout(function(e){handleMouseOut(e);});

});
