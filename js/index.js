"use strict";
/*
User Story: I can play a game of Tic Tac Toe with the computer.
User Story: My game will reset as soon as it's over so I can play again.
User Story: I can choose whether I want to play as X or O.
*/

// clear the console
console.clear();

$(document).ready(function() {
  
  // variable declaration
  var difficulty = 2;
  var tempo = 1;
  var playerPiece = "";
  var compPiece = "";
  var playing = false;
  var playerTurn = false;
  var gameboard = [];
  var playerScore = 0;
  var compScore = 0;
  var tieScore = 0;
  var regexX = /^[X]{3}$/;
  var regexO = /^[O]{3}$/;
  var potWinO = /^(?!\s\s\s|\sO\s|\s\sO|O\s\s$)[^X]+$/;
  var potWinX = /^(?!\s\s\s|\sX\s|\s\sX|X\s\s$)[^O]+$/;
  var openO = /^(?=[^O]*[O][^O]*)[^X]+$/;
  var openX = /^(?=[^X]*[X][^X]*)[^O]+$/;
  var lastBox = /^[^\s]*[\s][^\s]*$/;
  
  // choose piece buttons
  $("#chooseX").click(function() {
    if (!playing) {
      setPiece("X");
    } else {
      var feedback = "Wait till the game is over.";
      updateFeedbackText(feedback);
    }
  });
  $("#chooseO").click(function() {
    if (!playing) {
      setPiece("O");
    } else {
      var feedback = "Wait till the game is over.";
      updateFeedbackText(feedback);
    }
  });
  
  // choose difficulty divs
  $("#easy").click(function() {setDifficulty(1, "easy")});
  $("#normal").click(function() {setDifficulty(2, "normal")});
  $("#hard").click(function() {setDifficulty(3, "hard")});
  
  // gameboard buttons
  $("#box0").click(function() {populateBox(0)});
  $("#box1").click(function() {populateBox(1)});
  $("#box2").click(function() {populateBox(2)});
  $("#box3").click(function() {populateBox(3)});
  $("#box4").click(function() {populateBox(4)});
  $("#box5").click(function() {populateBox(5)});
  $("#box6").click(function() {populateBox(6)});
  $("#box7").click(function() {populateBox(7)});
  $("#box8").click(function() {populateBox(8)});
  
  function setDifficulty(diff, id) {
    if (playing === false) {
      difficulty = diff;
      tempo = (diff == 3) ? 0.25 : (diff == 2) ? 0.5 : 1;
      $("#easy").children("h3").removeClass("selected");
      $("#normal").children("h3").removeClass("selected");
      $("#hard").children("h3").removeClass("selected");
      $("#" + id).children("h3").addClass("selected");
      console.log("difficulty:", difficulty, "tempo:", tempo);
    } else {
      updateFeedbackText("Wait till the game is over.");
    }
  }
  
  function generateBoard() {
    gameboard.length = 0;
    for (var i = 0; i < 9; i++) {
      gameboard.push(" ");
    }
  }
  
  function clearBoard() {
    var i = 0;
    var myInterval = setInterval(function() {
      $("#box" + i).html(gameboard[i]);
      i++;
      if (i == 9) {
        clearInterval(myInterval);
      }
    }, 200);
  }
  
  function populateBox(box) {
    var feedback = "";
    if (playing && playerTurn) {
      if (gameboard[box] === " ") {
        $("#box" + box).html("<h1 class='giant'>" + playerPiece + "</h1>");
        gameboard[box] = playerPiece;
        feedback = "";
        updateFeedbackText(feedback);
        playerTurn = false;
        computerTurn();
      } else {
        feedback = "An " + gameboard[box] + " was already played there.";
        updateFeedbackText(feedback);
      }
    }
  }
  
  function updateFeedbackText(feedback) {
    $("#feedback-text").text(feedback);
  }
  
  function setPiece(piece) {
    var otherPiece = "X";
    if (piece == "X") {
      otherPiece = "O";
    }
    playerPiece = piece;
    compPiece = otherPiece;
    $("#choose" + piece).addClass("selected");
    $("#choose" + otherPiece).removeClass("selected");
    updateFeedbackText("Player chose " + piece + ". Game starting.");
    beginGame();
  }
  
  function updateScores() {
    $("#player-score").html(playerScore);
    $("#comp-score").html(compScore);
    $("#tie-score").html(tieScore);
  }
  
  function resetBoard() {
    $("#chooseX").removeClass("selected");
    $("#chooseO").removeClass("selected");
    var playerPiece = "";
    var compPiece = "";
  }
  
  function checkForTie() {
    if (gameboard.indexOf(" ") == -1) {
      playing = false;
      updateFeedbackText("It's a tie.");
      tieScore = tieScore + 1;
      updateScores();
      resetBoard();
    }
  }
  
  function computerTurn() {
    // check for win
    if (checkForWin(playerPiece)) {
      playerScore = playerScore + 1;
      updateScores();
      playing = false;
      console.log("You won!");
      updateFeedbackText("You won!");
      resetBoard();
    }
    
    if (playing) {
      checkForTie();
    }
    
    // calculate move and update board
    if (playing) {
      computerMove();
    }
    
  }
  
  function compBox() {
    var rowArray = [];
    
    // check last move
    var gameboardJoin = gameboard.join("");
    if (gameboardJoin.search(lastBox) == 0) {
      console.log("Last place to move.");
      return gameboardJoin.indexOf(" ");
    }
    
    // check for potential computer wins
    for (var i = 0; i < winArray.length; i++) {
      for (var j = 0; j < winArray[i].length; j++) {
        rowArray.push(gameboard[winArray[i][j]]);
      }
      var rowArrayJoin = rowArray.join("");
      var regex = (compPiece == "O") ? potWinO : potWinX;
      if (rowArrayJoin.search(regex) == 0) {
        console.log("Potential computer win found!");
        return winArray[i][rowArrayJoin.indexOf(" ")];
      }
      rowArray.length = 0;
    }
    
    // check for potential player wins
    for (i = 0; i < winArray.length; i++) {
      for (j = 0; j < winArray[i].length; j++) {
        rowArray.push(gameboard[winArray[i][j]]);
      }
      rowArrayJoin = rowArray.join("");
      regex = (compPiece == "O") ? potWinX : potWinO;
      if (rowArrayJoin.search(regex) == 0) {
        console.log("Potential player win found!");
        console.log("move location:", winArray[i][rowArrayJoin.indexOf(" ")]);
        return winArray[i][rowArrayJoin.indexOf(" ")];
      }
      rowArray.length = 0;
    }
    
    // check for open row
    for (i = 0; i < winArray.length; i++) {
      for (j = 0; j < winArray[i].length; j++) {
        rowArray.push(gameboard[winArray[i][j]]);
      }
      console.log("checking open rows");
      rowArrayJoin = rowArray.join("");
      regex = (compPiece == "O") ? openO : openX;
      if (rowArrayJoin.search(regex) == 0) {
        console.log("Open row found!");
        var bestMove = (rowArrayJoin.lastIndexOf(" ") == 1) ? winArray[i][rowArrayJoin.indexOf(" ")] : winArray[i][rowArrayJoin.lastIndexOf(" ")];
        return bestMove;
      }
      rowArray.length = 0;
    }
    
    if (difficulty == 3) {
      var goodMoves = [0, 2, 4, 6];
      return goodMoves[Math.floor(Math.random() * 4)];
    } else {
      return Math.floor(Math.random() * 9)
    }
  }
  
  function computerMove() {
    var feedback = "Thinking";
    var myInterval = setInterval(function() {
      // potential move is chosen
      var chosenBox;
      switch (difficulty) {
        case 1:
          chosenBox = Math.floor(Math.random() * 9);
          break;
        case 2:
        case 3:
          chosenBox = compBox();
          break;
      }
      console.log("chosenBox", chosenBox);
      
      // check if potential box is empty
      if (gameboard[chosenBox] === " ") {
        $("#box" + chosenBox).html("<h1 class='giant'>" + compPiece + "</h1>");
        updateFeedbackText("");
        gameboard[chosenBox] = compPiece;
        clearInterval(myInterval);
        // check for win
        if (checkForWin(compPiece)) {
          compScore = compScore + 1;
          updateScores();
          playing = false;
          updateFeedbackText("I won!");
          resetBoard();
        } 
        if (playing) {
          checkForTie();
        }
        if (playing) {
          playerTurn = true;
        }
      } else {
        feedback = feedback + ".";
        updateFeedbackText(feedback);
      }      
    }, 2000 * tempo);
  }
  
  function checkForWin(piece) {
    var rowArray = [];
    for (var i = 0; i < winArray.length; i++) {
      for (var j = 0; j < winArray[i].length; j++) {
        rowArray.push(gameboard[winArray[i][j]]);
      }
      var rowArrayJoin = rowArray.join("");
      var regex = regexX;
      if (piece == "O") {
        regex = regexO;
      }
      if (rowArrayJoin.search(regex) == 0) {
        console.log("Win found!");
        return true;
      }
      rowArray.length = 0;
    }
    return false;
  }
  
  function beginGame() {
    playing = true;
    generateBoard();
    clearBoard();
    var i = 0;
    var myInterval = setInterval(function() {
      if (i > 0) {
        clearInterval(myInterval);
        if (playerPiece == "X") {
          updateFeedbackText("Your turn!");
          playerTurn = true;
        } else {
          updateFeedbackText("My turn...");
          computerTurn();
        }
      }
      i++;
    }, 1000);    
  }
  
  // tips
  (function tipStart() {
    $("#tipText").html(tips[0]);

    function rotateTip() {
      // #tipText for tip div
      $("#tipText").html(getNextTip($("#tipText").html()));
    }

    (function rotateTips() {
      setInterval(function() {rotateTip();}, 10000);    
    })();

    function getNextTip(lastTip) {
    // return the next tip
    var lastTipIndex = tips.indexOf(lastTip);
    var nextTipIndex = (lastTipIndex == (tips.length - 1) || lastTipIndex == -1) ? 0 : lastTipIndex + 1;
    return tips[nextTipIndex];
  }
  })();
  
});

var tips = [
  "Choose X or O to start a game.",
  "Good luck and have fun!",
  "X always goes first."  
];
var winArray = [
  [ 0 , 1 , 2 ],
  [ 7 , 8 , 3 ],
  [ 6 , 5 , 4 ],
  [ 0 , 7 , 6 ],
  [ 1 , 8 , 5 ],
  [ 2 , 3 , 4 ],
  [ 0 , 8 , 4 ],
  [ 6 , 8 , 2 ]
];
