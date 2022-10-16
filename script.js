const myApp = angular
  .module("myApp", [])
  .controller("mycont", function ($scope) {
    //Table size, using a dropdown select to choose
    $scope.tableSize = [
      { val: 9, view: "3X3" },
      { val: 25, view: "5X5" },
      { val: 49, view: "7X7" },
    ];

    $scope.SelectedTable = $scope.tableSize[0].val;

    const X_CLASS = "x";
    const CIRCLE_CLASS = "circle";
    const winningMessageElement = document.querySelector("#winningMessage");
    const winningMessageTextElement = document.querySelector(
      "[data-winning-message-text]"
    );

    //Getting the data need to win on each table
    const WINNING_COMBINATIONS_3x3 = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    const WINNING_COMBINATIONS_5x5 = [
      [0, 1, 2, 3, 4],
      [5, 6, 7, 8, 9],
      [10, 11, 12, 13, 14],
      [15, 16, 17, 18, 19],
      [20, 21, 22, 23, 24],
      [0, 5, 10, 15, 20],
      [1, 6, 11, 16, 21],
      [2, 7, 12, 17, 22],
      [3, 8, 13, 18, 23],
      [4, 9, 14, 19, 24],
      [0, 6, 12, 18, 24],
      [4, 8, 12, 16, 20],
    ];
    const WINNING_COMBINATIONS_7x7 = [
      [0, 1, 2, 3, 4, 5, 6],
      [7, 8, 9, 10, 11, 12, 13],
      [14, 15, 16, 17, 18, 19, 20],
      [21, 22, 23, 24, 25, 26, 27],
      [28, 29, 30, 31, 32, 33, 34],
      [35, 36, 37, 38, 39, 40, 41],
      [42, 43, 44, 45, 46, 47, 48],
      [0, 7, 14, 21, 28, 35, 42],
      [1, 8, 15, 22, 29, 36, 43],
      [2, 9, 16, 23, 30, 37, 44],
      [3, 10, 17, 24, 31, 38, 45],
      [4, 11, 18, 25, 32, 39, 46],
      [5, 12, 19, 26, 33, 40, 47],
      [6, 13, 20, 27, 34, 41, 48],
      [0, 8, 16, 24, 32, 40, 48],
      [6, 12, 18, 24, 30, 36, 42],
    ];

    const restartButton = document.querySelectorAll(".restartButton");
    let cellElements;

    const board = document.querySelector("#board");


    let circleTurn;
    $scope.turnMessage = "its X's turn";

    $scope.TurnClass = "Xturn";

    //Showing who's turn it is
    $scope.turnMessagefunc = () => {
      if (circleTurn) {
        $scope.turnMessage = "its O's turn";
        $scope.TurnClass = "Oturn";
      } else {
        $scope.turnMessage = "its X's turn";
        $scope.TurnClass = "Xturn";
      }
    };

    startGame();

    //When a new table is chosen then create new game with the chosen table size
    $scope.changeGame = () => {
      return startGame();
    };
    restartButton.forEach((item) => {
      item.addEventListener("click", startGame);
    });

//start game here,
//game will start with X's turn
//all the cells will get a click function which only works once

    function startGame() {
      circleTurn = false;


      createGame($scope.SelectedTable);
      cellElements.forEach((cell) => {
        cell.classList.remove(X_CLASS);
        cell.classList.remove(CIRCLE_CLASS);

        cell.addEventListener("click", handleClick, { once: true });
      });
      setBoardHoverClass();
      winningMessageElement.classList.remove("show");
    }

    //Create the board
    //the size depends on the chosen select value
    //when restarting clear board and create new one
    //using vanila js to create all the cells
    function createGame(size) {
      board.innerHTML = "";
      if (size == 9) {
        board.classList.add("threeBythree");
        board.classList.remove("fiveByfive");
        board.classList.remove("sevenByseven");
      } else if (size == 25) {
        board.classList.add("fiveByfive");
        board.classList.remove("threeBythree");
        board.classList.remove("sevenByseven");
      } else {
        board.classList.add("sevenByseven");
        board.classList.remove("fiveByfive");
        board.classList.remove("threeBythree");
      }
      for (let i = 0; i < size; i++) {
        let elemCell = document.createElement("div");
        elemCell.classList.add("cell");
        board.appendChild(elemCell);
      }
      cellElements = document.querySelectorAll(".cell");
    }

    //When clicked, that cell will have a new class with the right turn
    //after click check if a player has one using the a dif function
    // if no winner then continue
    // if all cells all full then draw
    function handleClick(e) {
      $scope.turnMessage = !$scope.turnMessage;
      const cell = e.target;
      const currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS;
      placeMark(cell, currentClass);
      if (checkWin(currentClass)) {
        endGame(false);
      } else if (isDraw()) {
        endGame(true);
      } else {
        swapTurns();
        setBoardHoverClass();
      }
    }
    function placeMark(cell, currentClass) {
      cell.classList.add(currentClass);
    }
    function swapTurns() {
      circleTurn = !circleTurn;
    }

    //Game ends in a draw
    function endGame(draw) {
      if (draw) {
        winningMessageTextElement.innerHTML = `Draw`;
      } else {
        winningMessageTextElement.innerHTML = `${
          circleTurn ? "O" : "X"
        } has won`;
      }
      winningMessageElement.classList.add("show");
    }
//Check if draw
    function isDraw() {
      return [...cellElements].every((cell) => {
        return (
          cell.classList.contains(X_CLASS) ||
          cell.classList.contains(CIRCLE_CLASS)
        );
      });
    }
    //
    

  //Special functions which is mostly use for the hover effect
  //it checks which turn is it and use the correct image as a hover effect
    function setBoardHoverClass() {
      board.classList.remove(X_CLASS);
      board.classList.remove(CIRCLE_CLASS);
      if (circleTurn) board.classList.add(CIRCLE_CLASS);
      else board.classList.add(X_CLASS);
    }

    //uses a formula to check if a player has won
    function checkWin(currentClass) {
      if ($scope.SelectedTable == 9)
        return winningMath(WINNING_COMBINATIONS_3x3, currentClass);
      else if ($scope.SelectedTable == 25)
        return winningMath(WINNING_COMBINATIONS_5x5, currentClass);
      else return winningMath(WINNING_COMBINATIONS_7x7, currentClass);
    }

    function winningMath(arr, currentClass) {
      return arr.some((combination) => {
        return combination.every((index) => {
          return cellElements[index].classList.contains(currentClass);
        });
      });
    }
  });
