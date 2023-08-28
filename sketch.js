// Game variables
let score = 0;
let level = 1;
let gameStarted = false;
let gameEnded = false;
let easyMode=false;
// Create toggle button for easy mode
let easyModeButton;

// Fibonacci numbers for each level
let fibonacciNumbers = [
  [0, 1, 1, 2, 3], // Level 1
  [0, 1, 1, 2, 3, 5, 8, 13, 21, 34], // Level 2
  [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377] // Level 3
];

let nonFibonacciNumbers = [];
let eatenFibonacciNumbers = [];

// fibman variables
let fibmanX;
let fibmanY;
let fibmanSize = 25;

// Number variables
let numbers = [];
let numSize = 20;
let numSpeed = 2;

// Level variables
let maxLevels = 3;
let numFibonacci = 5;
let numNonFibonacci = 5;

// Game area variables
let gameAreaX = 50;
let gameAreaY = 50;
let gameAreaWidth = 300;
let gameAreaHeight = 300;

//Soundtrack
let audio;
let playButton;
let stopButton;
let audioPlaying = false; // Variable to track audio playing state
let uploadButton;

// Setup function
function setup() {
  createCanvas(400, 400);
   background(0);
    //Game setup
  generateFibonacciNumbers();
  generateNonFibonacciNumbers();

  // Create upload button
uploadButton = createFileInput(handleFile, 'audio/mpeg');
  uploadButton.position(500, 80);
  uploadButton.style('ofibity', '0'); // Hide the default button
  uploadButton.style('position', 'absolute'); // Set absolute position for custom button

  // Create custom button
  let customButton = createButton('Upload Soundtrack');
  customButton.position(500, 80);
  customButton.style('background-color', '#E91E63');
  customButton.style('color', 'white');
  customButton.style('padding', '10px 20px');
  customButton.style('border', 'none');
  customButton.style('border-radius', '4px');
  customButton.style('cursor', 'pointer');
  customButton.style('font-size', '16px');
  customButton.style('font-weight', 'bold');
  customButton.style('box-shadow', '0px 2px 4px rgba(0, 0, 0, 0.2)');
    // Set the custom button's click event to trigger the hidden upload button
  customButton.mouseClicked(() => {
    uploadButton.elt.click();
  });
  
   // Create restart button
  let restartButton = createButton('Restart Game');
  restartButton.position(500, 120);
  restartButton.style('background-color', '#E91E63');
  restartButton.style('color', 'white');
  restartButton.style('padding', '10px 20px');
  restartButton.style('border', 'none');
  restartButton.style('border-radius', '4px');
  restartButton.style('cursor', 'pointer');
  restartButton.style('font-size', '16px');
  restartButton.style('font-weight', 'bold');
  restartButton.style('box-shadow', '0px 2px 4px rgba(0, 0, 0, 0.2)');

  // Set the restart button's click event to restart the game
  restartButton.mouseClicked(restartGame);
  
  // Create easy mode toggle button
  easyModeButton = createButton('Easy Mode: OFF');
  easyModeButton.position(500, 120);
  easyModeButton.style('background-color', '#f44336');
  easyModeButton.style('color', 'white');
  easyModeButton.style('padding', '10px 20px');
  easyModeButton.style('border', 'none');
  easyModeButton.style('border-radius', '4px');
  easyModeButton.style('cursor', 'pointer');
  easyModeButton.style('font-size', '16px');
  easyModeButton.style('font-weight', 'bold');
  easyModeButton.style('box-shadow', '0px 2px 4px rgba(0, 0, 0, 0.2)');

  // Set the easy mode button's click event to toggle easy mode state
  easyModeButton.mouseClicked(toggleEasyMode);

}
// Toggle easy mode state
function toggleEasyMode() {
  easyMode = !easyMode;
  if (easyMode) {
    easyModeButton.html('Easy Mode: ON');
    easyModeButton.style('background-color', '#4CAF50');
  } else {
    easyModeButton.html('Easy Mode: OFF');
    easyModeButton.style('background-color', '#f44336');
  }
}
function playAudio() {
  if (audio) {
    audio.loop();
    audioPlaying = true;
  }
}

function stopAudio() {
  if (audio) {
    audio.pause();
     audioPlaying = false;
  }
}

function handleFile(file) {
  if (file.type === 'audio') {
    if (audio) {
      audio.stop();
      audio.remove();
    }
    audio = loadSound(file.data, () => {
      //audio.play();
    });
  } else {
    console.log('Please upload an MP3 file.');
  }
}

// Generate Fibonacci numbers
function generateFibonacciNumbers() {
  fibonacciNumbers[0] = 0;
  fibonacciNumbers[1] = 1;
  for (let i = 2; i < 10; i++) {
    fibonacciNumbers[i] = fibonacciNumbers[i - 1] + fibonacciNumbers[i - 2];
  }
}

// Generate non-Fibonacci numbers
function generateNonFibonacciNumbers() {
  let count = 0;
  let num = 1;
  while (count < numNonFibonacci) {
    if (!fibonacciNumbers.includes(num)) {
      nonFibonacciNumbers.push(num);
      count++;
    }
    num++;
  }
}

// Start the game
function startGame() {

  score = 0;
  level = 1;
  gameStarted = true;
  gameEnded = false;
  numbers = [];
  generateNumbers();
  createfibman();
}

// Generate numbers for the current level
function generateNumbers() {
  let numCount = 0;
  let maxNum = numFibonacci * (level === 1 ? 1 : Math.pow(2, level - 1));

  while (numCount < numFibonacci + numNonFibonacci) {
    let num;
    if (numCount < numFibonacci) {
      num = fibonacciNumbers[Math.floor(random(fibonacciNumbers.length))];
    } else {
      num = nonFibonacciNumbers[Math.floor(random(nonFibonacciNumbers.length))];
    }

    let xPos = random(gameAreaX + numSize, gameAreaX + gameAreaWidth - numSize);
    let yPos = random(gameAreaY + numSize, gameAreaY + gameAreaHeight - numSize);
    let overlapping = false;
    // Check for overlapping with fibman
    let distanceTofibman = dist(xPos, yPos, fibmanX, fibmanY);
    if (distanceTofibman < fibmanSize + numSize) {
      overlapping = true;
    }
    for (let i = 0; i < numbers.length; i++) {
      let otherNum = numbers[i];
      let distance = dist(xPos, yPos, otherNum.x, otherNum.y);

      if (distance < numSize) {
        overlapping = true;
        break;
      }
    }

    if (!overlapping) {
     numbers.push({ value: num, x: xPos, y: yPos });
numCount++;
}
}
}

// Create fibman within the game area without overlapping with numbers
function createfibman() {
  let overlapping = true;
  while (overlapping) {
    fibmanX = random(gameAreaX + fibmanSize / 2, gameAreaX + gameAreaWidth - fibmanSize / 2);
    fibmanY = random(gameAreaY + fibmanSize / 2, gameAreaY + gameAreaHeight - fibmanSize / 2);
    overlapping = false;

    // Check for overlapping with numbers
    for (let i = 0; i < numbers.length; i++) {
      let num = numbers[i];
      let distance = dist(fibmanX, fibmanY, num.x, num.y);
      if (distance < fibmanSize / 2 + numSize / 2) {
        overlapping = true;
        break;
      }
    }
  }
}

// Update fibman's position
function updatefibman() {
if (keyIsDown(LEFT_ARROW) && fibmanX > gameAreaX + fibmanSize / 2) {
fibmanX -= numSpeed;
} else if (keyIsDown(RIGHT_ARROW) && fibmanX < gameAreaX + gameAreaWidth - fibmanSize / 2) {
fibmanX += numSpeed;
} else if (keyIsDown(UP_ARROW) && fibmanY > gameAreaY + fibmanSize / 2) {
fibmanY -= numSpeed;
} else if (keyIsDown(DOWN_ARROW) && fibmanY < gameAreaY + gameAreaHeight - fibmanSize / 2) {
fibmanY += numSpeed;
}
}

// Check collision between fibman and numbers
function checkCollision() {
for (let i = 0; i < numbers.length; i++) {
let num = numbers[i];
let distance = dist(fibmanX, fibmanY, num.x, num.y);
if (distance < fibmanSize / 2 + numSize / 2) {
  if (fibonacciNumbers.includes(num.value)) {
    score += num.value;
    eatenFibonacciNumbers.push(num.value);
      // Play or stop audio based on Fibonacci numbers eaten
  if (audio && !audioPlaying) {
    playAudio();
  } 
  } else {
    score -= num.value;
     stopAudio();
  }

  numbers.splice(i, 1);
  i--; // Decrement i to recheck the current index since the array length has changed;
}
}

}

// Check if the game has ended
function checkGameEnd() {
 
  let allFibonacciEaten = eatenFibonacciNumbers.length === numFibonacci;

  if (numbers.length === 0 || allFibonacciEaten) {
    if (level < maxLevels) {
      level++;
      eatenFibonacciNumbers = []; // Reset the eaten Fibonacci numbers for the new level
      generateNumbers();
      createfibman();
    } else {
      gameEnded = true;
      stopAudio();
    }
  } else if (score < 0 || score < -500) {
    stopAudio();
    gameEnded = true;
  }

}



// Draw the game
function draw() {
background(0);

if (gameStarted) {
if (!gameEnded) {
updatefibman();
checkCollision();
checkGameEnd();
}
  // Update the background color based on the level
  if (level === 1) {
    background("#9E9E9E"); // Change the background color for level 1
  } else if (level === 2) {
    background("#4E6570"); // Change the background color for level 2
  } else if (level === 3) {
    background("#000000"); // Change the background color for level 3
  }
  // Draw the game area border
stroke(255);
noFill();
rect(gameAreaX, gameAreaY, gameAreaWidth, gameAreaHeight);

// Draw numbers
for (let i = 0; i < numbers.length; i++) {
  let numX = numbers[i].x;
  let numY = numbers[i].y;
if(easyMode){
  if (fibonacciNumbers.includes(numbers[i].value)) {
    fill(0, 255, 0); // Green for Fibonacci numbers
  } else {
    fill(255, 0, 0); // Red for non-Fibonacci numbers
  }}

  textSize(numSize);
  textAlign(CENTER, CENTER);
  text(numbers[i].value, numX, numY);
}

// Draw fibman
fill(255, 255, 0);
arc(fibmanX, fibmanY, fibmanSize, fibmanSize, PI / 6, -11 * PI / 6,PIE);

// Display score and level
fill(255);
textSize(15);
textAlign(LEFT);
text("Score: " + score, 30, 20);
text("Level: " + level, 30, 40);
// Check if the game has ended
if (gameEnded) {
  // Display game over message
  textSize(32);
  textAlign(CENTER, CENTER);
  if (score < 0 || score < -500) {
    text("You Lose!", width / 2, height / 2 + 50);
  } else {
    text("You Won!", width / 2, height / 2 + 50);
  }
  text("Press ENTER to restart", width / 2, height / 2 + 100);
}
} else {
    // Display start message
 displayInitialScreen();
  
  }
}
function displayInitialScreen() {
  background(0);
  fill(255);
  textSize(32);
  textAlign(CENTER, CENTER);
  text("Fib Man", width / 2, height / 2);
  textSize(20);
  text("Press ENTER to start", width / 2, height / 2 + 40);
}


// Restart the game
function restartGame() {

   gameStarted = false;
    gameEnded = false;
    level = 1;
    score = 0;
    eatenFibonacciNumbers = [];
    numbers = [];
    fibman = null;
    generateNumbers();
    createfibman();
  displayInitialScreen();

}

// Start the game or restart when Enter key is pressed
function keyPressed() {
if (keyCode === ENTER) {
if (gameStarted) {
if (gameEnded) {
restartGame();
}
} else {
startGame();
}
}
}