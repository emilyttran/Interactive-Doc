// this file will set up the mini game functions and event listeners
$(function(){
var canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight - 120;
var ctx = canvas.getContext("2d"); // 2D rendering space

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
// RESULT CAR VARIABLES
var SMALL_CAR_LENGTH = 180;
var MED_CAR_LENGTH = 200;
var LARGE_CAR_LENGTH = 250;
// STAYS UNCHANGE
var CAR_HEIGHT = 50;
// CHANGABLE PARAMETERS
var CHOSEN_CAR_LENGTH = 100;
var CHOSEN_PADDING = 10;
// DRAW RATIOS
var RATIO_DRAW_PADDING = 0.5;
var ADDED_DRAW_LENGTH = 160;
var REQUIRED_PARKING_SPACE = 1;
var PARKING_WIDTH = canvas.width/NUM_SPACES;

// LOAD THE IMAGE
var img = new Image();
img.onload = function(){
  ctx.drawImage(img, window.innerWidth/2, window.innerHeight/2, img.width*SCALE_FACTOR + CHOSEN_CAR_LENGTH, img.height*SCALE_FACTOR);
}
img.src = "../img/player_car.png";

// DRAWING BOARD ===========================================================================================================
lastXPos = window.innerWidth/2;
lastYPos = window.innerHeight/2;
lastCarLength = CHOSEN_CAR_LENGTH;
removeCarsAndReset();


// FUNCTIONS ===============================================================================================================
function addResultText(){
  ctx.fillStyle = "black";
  ctx.fillRect(canvas.width*0.2, 165, canvas.width*0.6, 50);
  ctx.fillStyle = "white"
  ctx.font = "30px sans-serif"
  ctx.fillText("Well, this is awkward", 260, 200);
}


function drawSmallCars(){

  for(var i = 0; i < 4; i++){
    var randomPadding = 15 + Math.floor(Math.random()*Math.floor(10));
    var smallRand = 5 + Math.floor(Math.random()*Math.floor(10));
    var car = new Car(SMALL_CAR_LENGTH-170, CHOSEN_PADDING);
    car.fill(ctx, smallRand + (randomPadding*i) + (SMALL_CAR_LENGTH*i), 175);

  }
}

function removeCarsAndReset(){
  ctx.clearRect(0,0,canvasWidth,canvasHeight);
  drawHorizontalLines(PARKING_START_LOCATION);
  drawVerticalLines(NUM_SPACES, PARKING_START_LOCATION);
  var car = new Car(CHOSEN_CAR_LENGTH, CHOSEN_PADDING);
  car.fill(ctx, lastXPos, lastYPos);


}

function placeParkZone(spot){
  ctx.beginPath();
  ctx.fillStyle = "#bdffb7";
  ctx.fillRect((PARKING_WIDTH)*spot, PARKING_START_LOCATION, (PARKING_WIDTH),100);
  ctx.stroke();
  ctx.closePath();
}


function drawCarsWithMarkers(){
  for(var i = 0; i < NUM_SPACES; i++){
    // if index is at the REQUIRED_PARKING_SPACE, do nothing. Else, check
    if(i == REQUIRED_PARKING_SPACE){
      // do nothing
    } else {
      drawCarInParkingSpace(i);
    }
  }
}

function drawCarInParkingSpace(spot){
  var bin = [];

  bin[0] = PARKING_WIDTH;
  var parkedCar = 1;
  drawPackedCarPerSpace(parkedCar, spot);

}

function chooseRandomCarType(){
  var randomType = Math.floor(Math.random()*Math.floor(3)) + 1;
  return randomType;
}

function chooseRandomPadding(){
  var randomPadding = 20 + Math.floor(Math.random()*Math.floor(50));
  return randomPadding;
}

function onPark(){
  removeCarsAndReset();;
  drawPadding();

      var PIXEL_CHOSEN_CAR_LENGTH = CHOSEN_CAR_LENGTH + 160;
      ctx.fillText("X: "+ lastXPos +", Y: "+ lastYPos, lastXPos, lastYPos + 100);
      // lengths depending on the last position of the car (aka parked)
      LengthL = lastXPos;
      LengthR = 800 - (lastXPos + PIXEL_CHOSEN_CAR_LENGTH);
      ctx.fillText("L", LengthL, 25);
      ctx.fillText("R", -(LengthR - 800), 25);
      var bin = [];
      bin[0] = LengthL;
      bin[1] = LengthR;
      //bin[0] = 200;
      //bin[1] = 170;
      var parkedCars = binPack(bin);
      ctx.fillText(parkedCars[0], 50, 50);
      ctx.fillText(parkedCars[1], 200, 50);
      drawPackedCarPerSpace(parkedCars);
      drawResults(parkedCars);

}

function drawResults(parkedCars){
  var sum = 0;

  // get sum of parked cars
 for(var i = 0; i < parkedCars.length; i++){
   for(var j = 0; j < parkedCars[i].length; j++){
     sum += parkedCars[i][j];
     console.log(parkedCars[i][j]);
   }
 }

if(sum == 3){
   $("#result").text("Thanks for parking well :)");
 }
   else if (sum == 0){
   $("#result").text("Nice. You managed to be the parking jerk.");
 } else {
   $("#result").text("That's an OK job. Try again");
 }
}

function drawCar(randomPadding, carLength, spot){
  var car = new Car(carLength-170, CHOSEN_PADDING);
  car.fill(ctx,randomPadding + (PARKING_WIDTH*spot), 25);
}

function drawPackedCarPerSpace(parkCarType, spot){

    var carLength;

    if(parkCarType == 1){
      carLength = SMALL_CAR_LENGTH-0;
    } else if(parkCarType == 2){
      carLength = MED_CAR_LENGTH-0;
    } else if(parkCarType == 3){
      carLength = LARGE_CAR_LENGTH-0;
    }

    var randomPadding = chooseRandomPadding();
    drawCar(randomPadding,carLength, spot);

}

// takes in array of bin capacities. Returns array of types that can fit
function binPack(binCapacity){ // bin = capacity of each bin
  var hasRoom;
  var tempCarType = []; // keep track of all the cars per bin
  var parkCarType = []; // 1 = small, 2 = medium, 3 = large
  var rand;
  for(var i = 0; i < binCapacity.length; i++){ // go through every bin
    hasRoom = true;
    tempCarType = []; // empty out the temp
    while(hasRoom){
      rand = chooseRandomCarType();
        if(SMALL_CAR_LENGTH + CHOSEN_PADDING > binCapacity[i]){
          hasRoom = false;
        } else if((rand == 1) && binCapacity[i] >= SMALL_CAR_LENGTH + CHOSEN_PADDING){
          binCapacity[i] -= SMALL_CAR_LENGTH + CHOSEN_PADDING;
          tempCarType.push(1);
        } else if((rand == 2) && binCapacity[i] >= MED_CAR_LENGTH + CHOSEN_PADDING){
          binCapacity[i] -= MED_CAR_LENGTH + CHOSEN_PADDING;
          tempCarType.push(2);
        } else if((rand == 3) && binCapacity[i] >= LARGE_CAR_LENGTH + CHOSEN_PADDING){
          binCapacity[i] -= LARGE_CAR_LENGTH + CHOSEN_PADDING;
          tempCarType.push(3);
        }
      }
      if(tempCarType.length == 0) // if no car was able to fit, add "NO FIT". Otherwise, push the cars
        parkCarType.push(0);
      else
        parkCarType.push(tempCarType);
  }
  return parkCarType;

}

function drawPadding(){
  // draw the padding lines
  ctx.lineWidth = 1;
  ctx.strokeStyle = "blue";

  // left side
  ctx.beginPath();
  ctx.moveTo(lastXPos-CHOSEN_PADDING*RATIO_DRAW_PADDING, lastYPos-20);
  ctx.lineTo(lastXPos-CHOSEN_PADDING*RATIO_DRAW_PADDING, lastYPos+100);
  ctx.stroke();

// right side
  ctx.beginPath();
  ctx.moveTo(lastXPos+(CHOSEN_CAR_LENGTH+ADDED_DRAW_LENGTH)+CHOSEN_PADDING*RATIO_DRAW_PADDING, lastYPos-20);
  ctx.lineTo(lastXPos+(CHOSEN_CAR_LENGTH+ADDED_DRAW_LENGTH)+CHOSEN_PADDING*RATIO_DRAW_PADDING, lastYPos+100);
  ctx.stroke();

}


function drawHorizontalLines(YStart){
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.strokeStyle = "black";
  ctx.moveTo(0, YStart);
  ctx.lineTo(PARKING_SPACING*(NUM_SPACES+1), YStart);
  ctx.stroke();
}

function drawVerticalLines(lines, YStart){
  ctx.lineWidth = 4;
  ctx.strokeStyle = "black";
  for(var i = 0 ; i <= lines; i++){
    ctx.beginPath();
    ctx.moveTo((canvas.width/lines)*(i), YStart);
    ctx.lineTo((canvas.width/lines)*(i), YStart + 100);
    ctx.stroke();
  }
}

function Car(leng, padding){
  this.leng = (leng === null) ? DEFAULT_CAR_LENGTH : leng;
  this.padding = (padding === null) ? DEFAULT_CAR_PADDING : padding;

  this.fill = function(ctx, xPos, yPos){
    ctx.drawImage(img, xPos, yPos, img.width*SCALE_FACTOR + leng, img.height*SCALE_FACTOR);
  }
}



/////////////////////
// EVENT HANDELERS //
/////////////////////

// SLIDERS
$("#lengthSlider").click(function(){
  //lastCarLength = this.value;
  CHOSEN_CAR_LENGTH = this.value-0;
  $("#lengthDisplay").text("Length: " + CHOSEN_CAR_LENGTH);
  ctx.clearRect(0,0,canvasWidth,canvasHeight);
  drawHorizontalLines(PARKING_START_LOCATION);
  drawVerticalLines(NUM_SPACES, PARKING_START_LOCATION);
  var car = new Car(CHOSEN_CAR_LENGTH, CHOSEN_PADDING);
  drawPadding();
  car.fill(ctx, lastXPos, lastYPos);
});

$("#padSlider").click(function(){
  //lastCarLength = this.value;
  CHOSEN_PADDING = this.value-0;
  $("#padDisplay").text("Padding: " + CHOSEN_PADDING);
  ctx.clearRect(0,0,canvasWidth,canvasHeight);
  drawHorizontalLines(PARKING_START_LOCATION);
  drawVerticalLines(NUM_SPACES, PARKING_START_LOCATION);
  var car = new Car(CHOSEN_CAR_LENGTH, CHOSEN_PADDING);
  drawPadding();
  car.fill(ctx, lastXPos, lastYPos);
});

var animation;
var resetBtnToggle = true;
var parkBtnToggle = false;

// PARK BUTTON
$("#park").click(function(){

  if(lastYPos > 36 || lastYPos < 15 || lastXPos > 541 || lastXPos < 0){
    $("#result").text("Way off, buddy. Please try again");
  } else if(resetBtnToggle){
      removeCarsAndReset();
      addResultText();
    parkBtnToggle = true;
    resetBtnToggle = false;
  }
})

$("#reset").click(function(){
  if(parkBtnToggle){
    removeCarsAndReset();
    clearInterval(animation);
    resetBtnToggle = true;
    parkBtnToggle = false;
  }
})



// MOUSE
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
          clearInterval(animation);
          resetBtnToggle = true;
          parkBtnToggle = false;

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
        clearInterval(animation);
          removeCarsAndReset();
          //var car = new Car(lastCarLength-0, CHOSEN_PADDING);
          var car = new Car(CHOSEN_CAR_LENGTH, CHOSEN_PADDING);
          car.fill(ctx,canMouseX-128/2,canMouseY-120/2);
          lastXPos = canMouseX-128/2;
          lastYPos = canMouseY-120/2;
          drawPadding();

          ctx.fillStyle = "black";
          ctx.fillText("X: "+ lastXPos +", Y: "+ lastYPos, lastXPos, lastYPos + 100);


        //  ctx.drawImage(img,canMouseX-128/2,canMouseY-120/2, img.width*SCALE_FACTOR, img.height*SCALE_FACTOR);
      }
    }

    $("#canvas").mousedown(function(e){handleMouseDown(e);});
    $("#canvas").mousemove(function(e){handleMouseMove(e);});
    $("#canvas").mouseup(function(e){handleMouseUp(e);});
    $("#canvas").mouseout(function(e){handleMouseOut(e);});


});
