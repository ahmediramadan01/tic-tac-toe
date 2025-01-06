"use strict";

(function () {
  const gameNewSection = document.querySelector(".game--new");
  const gameStartSection = document.querySelector(".game--start");
  const buttonNewGame = document.querySelector(".button--new");
  const choiceElement = document.querySelector(".choice");
  const buttonStartGame = document.querySelector(".button--start");
  const gamePlaySection = document.querySelector(".game--play");
  const buttonResetGame = document.querySelector(".button--reset");

  const UIController = (function () {
    const handleNewGameUI = function () {
      gameNewSection.style.display = "none";
      gameStartSection.style.display = "block";
    };

    const getPlayer1 = () => document.querySelector('input[name="choice"]:checked').value;
    const getPlayer2 = () => document.querySelector('input[name="choice"]:not(:checked)').value;

    const toggleChoice = function () {
      choiceElement.textContent = getPlayer1();
    };

    const handleStartGameUI = function () {
      gameStartSection.style.display = "none";
      gamePlaySection.style.display = "block";
    };

    const handleResetGameUI = function () {
      gamePlaySection.style.display = "none";
      gameStartSection.style.display = "flex";
    };

    return {
      handleNewGameUI,
      toggleChoice,
      getPlayer1,
      getPlayer2,
      handleStartGameUI,
      handleResetGameUI,
    };
  })();

  const gameController = (function () {
    const newGame = function () {
      UIController.handleNewGameUI();
    };

    const createPlayer = function (name, marker) {
      return { name, marker };
    };

    const startGame = function () {
      UIController.handleStartGameUI();

      const player1 = createPlayer("Player 1", UIController.getPlayer1());
      const player2 = createPlayer("Player 2", UIController.getPlayer2());
    };

    const resetGame = function () {
      UIController.handleResetGameUI();
    };

    return { newGame, startGame, resetGame };
  })();

  buttonNewGame.addEventListener("click", gameController.newGame);
  gameStartSection.addEventListener("change", UIController.toggleChoice);
  buttonStartGame.addEventListener("click", gameController.startGame);
  buttonResetGame.addEventListener("click", gameController.resetGame);
})();
