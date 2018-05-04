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
var CHOSEN_CAR_LENGTH = 20;
var CHOSEN_PADDING = 10;

// LOAD THE IMAGE
var img = new Image();
var blueCar = new Image();
var yellowCar = new Image();

img.onload = function(){
  ctx.drawImage(img, window.innerWidth/2, window.innerHeight/2, img.width*SCALE_FACTOR + CHOSEN_CAR_LENGTH, img.height*SCALE_FACTOR);
  ctx.drawImage(img, 590, 30, img.width*SCALE_FACTOR + CHOSEN_CAR_LENGTH, img.height*SCALE_FACTOR);


}

blueCar.onload = function(){
  ctx.drawImage(blueCar, 75, 30, img.width*SCALE_FACTOR + 100, img.height*SCALE_FACTOR);
}

img.src = "../img/player_car.png";
blueCar.src = "../img/blue_car.png";
yellowCar.src = "../img/yellow_car.png";


function Car(leng, padding){
  this.leng = (leng === null) ? DEFAULT_CAR_LENGTH : leng;
  this.padding = (padding === null) ? DEFAULT_CAR_PADDING : padding;

  this.fill = function(ctx, xPos, yPos){
    ctx.drawImage(img, xPos, yPos, img.width*SCALE_FACTOR + leng, img.height*SCALE_FACTOR);
  }
}

// DRAWING BOARD ===========================================================================================================
lastCarLength = CHOSEN_CAR_LENGTH;
removeCarsAndReset();

lastXPos = window.innerWidth/2;
lastYPos = window.innerHeight/2;


// FUNCTIONS ===============================================================================================================
function verticalBorders(){
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, PARKING_START_LOCATION);
  ctx.lineTo(0, 150);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(canvas.width, PARKING_START_LOCATION);
  ctx.lineTo(canvas.width, 150)
  ctx.stroke();
}

function placeNotJerkCar(){
  var randomPadding = Math.floor(Math.random()*Math.floor(50));

  ctx.drawImage(yellowCar, 110 + randomPadding, 30, img.width*SCALE_FACTOR + 1, img.height*SCALE_FACTOR);
}

function removeCarsAndReset(){
  var car = new Car(CHOSEN_CAR_LENGTH, CHOSEN_PADDING);
  ctx.clearRect(0,0,canvasWidth,canvasHeight);
  car.fill(ctx, lastXPos, lastYPos);
  verticalBorders();
  drawHorizontalLines();
}

function addResultText(text , position){
  ctx.fillStyle = "black";
  ctx.fillRect(canvas.width*0.2, 165, canvas.width*0.6, 50);
  ctx.fillStyle = "white"
  ctx.font = "30px sans-serif"
  console.log("hi");
  ctx.fillText(text, position, 200);
}




function drawPackedCars(parkCarType){
  // left side
  for(var i = 0; i < parkCarType[0].length; i++){
    var stop = false;
    var carLength;

    if(parkCarType[0][i] == 1){
      carLength = SMALL_CAR_LENGTH;
    } else if(parkCarType[0][i] == 2){
      carLength = MED_CAR_LENGTH;
    } else if(parkCarType[0][i] == 3){
      carLength = LARGE_CAR_LENGTH;
    } else{
      stop = true;
    }

    carLength -= 170;
    if(!stop){
      var car = new Car(carLength, CHOSEN_PADDING);
      car.fill(ctx,i*SMALL_CAR_LENGTH + CHOSEN_PADDING + 340, 40);

      }
  }

  // right side
  for(var i = 0; i < parkCarType[1].length; i++){

    var stop = false;
    var carLength;

    if(parkCarType[1][i] == 1){
      carLength = SMALL_CAR_LENGTH;
    } else if(parkCarType[1][i] == 2){
      carLength = MED_CAR_LENGTH;
    } else if(parkCarType[1][i] == 3){
      carLength = LARGE_CAR_LENGTH;
    } else{
      stop = true;

    }

    carLength -= 173;
    if(!stop){
      var car = new Car(carLength, CHOSEN_PADDING);
      car.fill(ctx,(i*SMALL_CAR_LENGTH) + CHOSEN_PADDING + lastXPos + CHOSEN_CAR_LENGTH + 173, 40);

      }
  }


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
      rand = Math.floor(Math.random()*Math.floor(3)) + 1;
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


function drawHorizontalLines(){
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.strokeStyle = "black";
  ctx.moveTo(0, PARKING_START_LOCATION);
  ctx.lineTo(PARKING_SPACING*(NUM_SPACES+1), PARKING_START_LOCATION);
  ctx.stroke();
}



/////////////////////
// EVENT HANDELERS //
/////////////////////



// PARK BUTTON
$("#park").click(function(){
  if(lastYPos > 75 || lastYPos < 15 || lastXPos > 409 || lastXPos < 336){
    addResultText("NOPE. Try again", 280);
  } else {
      removeCarsAndReset();
      ctx.drawImage(img, 590, 30, img.width*SCALE_FACTOR + CHOSEN_CAR_LENGTH, img.height*SCALE_FACTOR);
      placeNotJerkCar();

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
          //ctx.fillText("X: "+ lastXPos +", Y: "+ lastYPos, lastXPos, lastYPos + 100);
          removeCarsAndReset();

          //var car = new Car(lastCarLength-0, CHOSEN_PADDING);
          ctx.drawImage(blueCar, 75, 30, img.width*SCALE_FACTOR + 100, img.height*SCALE_FACTOR);
          ctx.drawImage(img, 590, 30, img.width*SCALE_FACTOR + CHOSEN_CAR_LENGTH, img.height*SCALE_FACTOR);

          var car = new Car(CHOSEN_CAR_LENGTH, CHOSEN_PADDING);
          car.fill(ctx,canMouseX-128/2,canMouseY-120/2);

          lastXPos = canMouseX-128/2;
          lastYPos = canMouseY-120/2;

          //ctx.fillText("X: "+ lastXPos +", Y: "+ lastYPos, lastXPos, lastYPos + 100);

        //  ctx.drawImage(img,canMouseX-128/2,canMouseY-120/2, img.width*SCALE_FACTOR, img.height*SCALE_FACTOR);
      }
    }

    $("#canvas").mousedown(function(e){handleMouseDown(e);});
    $("#canvas").mousemove(function(e){handleMouseMove(e);});
    $("#canvas").mouseup(function(e){handleMouseUp(e);});
    $("#canvas").mouseout(function(e){handleMouseOut(e);});


});
