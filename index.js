"use strict";

(function () {
  const gameNewSection = document.querySelector(".game--new");
  const gameStartSection = document.querySelector(".game--start");
  const buttonNewGame = document.querySelector(".button--new");
  const choiceElement = document.querySelector(".choice");
  const buttonStartGame = document.querySelector(".button--start");
  const gamePlaySection = document.querySelector(".game--play");
  const buttonResetGame = document.querySelector(".button--reset");
  const gameBoardElement = document.querySelector(".game--play__board");
  const cellElements = document.querySelectorAll(".board__cell");
  const turnIcon = document.querySelector(".turn__icon");

  const UIController = (function () {
    const handleNewGameUI = function () {
      gameNewSection.style.display = "none";
      gameStartSection.style.display = "block";
      gamePlaySection.style.display = "none";
    };

    const getPlayer1 = () => document.querySelector('input[name="choice"]:checked').value;
    const getPlayer2 = () => document.querySelector('input[name="choice"]:not(:checked)').value;

    const toggleChoice = function () {
      choiceElement.textContent = getPlayer1();
    };

    const handleStartGameUI = function () {
      gameNewSection.style.display = "none";
      gameStartSection.style.display = "none";
      gamePlaySection.style.display = "block";

      changeTurnIcon(getPlayer1());
    };

    const handleResetGameUI = function () {
      gameNewSection.style.display = "flex";
      gameStartSection.style.display = "none";
      gamePlaySection.style.display = "none";
    };

    const changeCellBackgroundColor = function (event) {
      if (!event.target.classList.contains("board__cell")) return;

      if (event.type === "mouseenter")
        event.target.style.backgroundColor =
          gameController.getCurrentPlayer().marker === "x"
            ? "rgba(79, 195, 247, 0.16)"
            : "rgba(255, 193, 7, 0.16)";
      else if (event.type === "mouseleave") event.target.style.backgroundColor = "#fff";
    };

    const changeTurnIcon = function (currentMarker) {
      turnIcon.src = `./images/${currentMarker}.svg`;
    };

    const renderCell = function (position) {
      if (document.querySelector(`[data-cell="${position}"]`)) {
        const currentMarker = gameController.gameBoard.getBoard()[position];
        document.querySelector(
          `[data-cell="${position}"]`
        ).innerHTML = `<img src="./images/${currentMarker}.svg" alt="${currentMarker.toUpperCase()} icon" />`;

        changeTurnIcon(currentMarker === "x" ? "o" : "x");
      }
    };

    return {
      handleNewGameUI,
      toggleChoice,
      getPlayer1,
      getPlayer2,
      handleStartGameUI,
      handleResetGameUI,
      changeCellBackgroundColor,
      changeTurnIcon,
      renderCell,
    };
  })();

  const gameController = (function () {
    let player1,
      player2,
      firstPlayer,
      currentPlayer,
      score1,
      score2,
      winner,
      gameOver = true;

    const getCurrentPlayer = () => currentPlayer;

    const gameBoard = (function () {
      const board = ["", "", "", "", "", "", "", "", ""];
      const getBoard = () => board;
      const modifyBoard = function (position, marker) {
        board[position] = marker;
      };

      return { getBoard, modifyBoard };
    })();

    const newGame = function () {
      UIController.handleNewGameUI();
    };

    const createPlayer = function (name, marker) {
      return { name, marker };
    };

    const startGame = function () {
      gameOver = false;
      currentPlayer = firstPlayer = player1 = createPlayer("Player 1", UIController.getPlayer1());
      player2 = createPlayer("Player 2", UIController.getPlayer2());

      UIController.handleStartGameUI();
    };

    const resetGame = function () {
      UIController.handleResetGameUI();

      currentPlayer = winner = undefined;
      gameOver = true;
    };

    const playRound = function (event) {
      if (!gameOver) {
        gameBoard.modifyBoard(event.target.dataset.cell, currentPlayer.marker);
        UIController.renderCell(event.target.dataset.cell);
        currentPlayer = currentPlayer === player1 ? player2 : player1;
      }
    };

    return { getCurrentPlayer, newGame, startGame, resetGame, gameBoard, playRound };
  })();

  buttonNewGame.addEventListener("click", gameController.newGame);
  gameStartSection.addEventListener("change", UIController.toggleChoice);
  buttonStartGame.addEventListener("click", gameController.startGame);
  buttonResetGame.addEventListener("click", gameController.resetGame);
  cellElements.forEach((cell) => {
    cell.addEventListener("mouseenter", UIController.changeCellBackgroundColor);
    cell.addEventListener("mouseleave", UIController.changeCellBackgroundColor);
    cell.addEventListener("click", gameController.playRound);
  });
})();
