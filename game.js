var buttonColors = ["red", "blue", "green", "yellow"];
var gamePattern = [];
var userClickedPattern = [];
var level = 0;
var gameStarted = false;
var acceptingInput = false;
var gameExited = false;

function playSound(name) {
  var audio = document.getElementById(name + "-sound");
  if (!audio) {
    console.error("Missing audio element for sound: " + name);
    return;
  }

  audio.currentTime = 0;
  var playPromise = audio.play();
  if (playPromise !== undefined) {
    playPromise.catch(function (error) {
      console.error("Could not play sound: " + name, error);
    });
  }
}

function animatePress(color) {
  $("#" + color).addClass("pressed");
  window.setTimeout(function () {
    $("#" + color).removeClass("pressed");
  }, 100);
}

function nextSequence() {
  userClickedPattern = [];
  acceptingInput = false;
  level++;
  $("#level-title").text("Level " + level);

  var randomNumber = Math.floor(Math.random() * buttonColors.length);
  var randomChosenColor = buttonColors[randomNumber];
  gamePattern.push(randomChosenColor);

  window.setTimeout(function () {
    $("#" + randomChosenColor).fadeIn(100).fadeOut(100).fadeIn(100);
    playSound(randomChosenColor);
    acceptingInput = true;
  }, 300);
}

function startGame() {
  if (gameStarted || gameExited) {
    return;
  }

  gameStarted = true;
  gamePattern = [];
  level = 0;
  $("#game-board").prop("hidden", false);
  $("#game-over-controls").prop("hidden", true);
  nextSequence();
}

function checkAnswer(currentLevel) {
  if (gamePattern[currentLevel] === userClickedPattern[currentLevel]) {
    if (userClickedPattern.length === gamePattern.length) {
      acceptingInput = false;
      window.setTimeout(nextSequence, 1000);
    }
  } else {
    gameStarted = false;
    acceptingInput = false;
    playSound("wrong");
    $("body").addClass("game-over");
    $("#level-title").text("Game over at level " + level);
    $("#game-board").prop("hidden", true);
    $("#game-over-controls").prop("hidden", false);
  }
}

$(".btn").on("click", function () {
  if (!gameStarted || !acceptingInput) {
    return;
  }

  var userChosenColor = this.id;
  userClickedPattern.push(userChosenColor);
  playSound(userChosenColor);
  animatePress(userChosenColor);
  checkAnswer(userClickedPattern.length - 1);
});

$(document).on("keydown", function () {
  if (!gameStarted && !gameExited && $("#game-over-controls").prop("hidden")) {
    $("body").removeClass("game-over");
    startGame();
  }
});

$("#continue-button").on("click", function () {
  $("body").removeClass("game-over");
  startGame();
});

$("#exit-button").on("click", function () {
  gameStarted = false;
  acceptingInput = false;
  gamePattern = [];
  userClickedPattern = [];
  level = 0;
  gameExited = true;
  $("body").removeClass("game-over");
  $("body").addClass("thanks-screen");
  $("#game-board").prop("hidden", true);
  $("#game-over-controls").prop("hidden", true);
  $("#level-title").text("Thanks for playing!");
});