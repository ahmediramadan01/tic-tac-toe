"use strict";

(function () {
  const gameNewSection = document.querySelector(".game--new");
  const gameStartSection = document.querySelector(".game--start");
  const buttonsNewGame = document.querySelectorAll(".button--new");
  const choiceElement = document.querySelector(".choice");
  const buttonStartGame = document.querySelector(".button--start");
  const gamePlaySection = document.querySelector(".game--play");
  const buttonsResetGame = document.querySelectorAll(".button--reset");
  const gameBoardElement = document.querySelector(".game--play__board");
  const boxesElements = document.querySelectorAll(".board__box");
  const cellElements = document.querySelectorAll(".board__cell");
  const turnIcon = document.querySelector(".turn__icon");
  const playerX = document.querySelector(".player--x");
  const playerXScore = document.querySelector(".score--x");
  const playerO = document.querySelector(".player--o");
  const playerOScore = document.querySelector(".score--o");
  const dialogModal = document.querySelector(".dialog");
  const dialogResult = document.querySelector(".dialog__result");

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

      if (getPlayer1() === "x") {
        playerX.textContent = "1";
        playerO.textContent = "2";
      } else {
        playerX.textContent = "2";
        playerO.textContent = "1";
      }
    };

    const setScore = function (marker, score) {
      marker === "x" ? (playerXScore.textContent = score) : (playerOScore.textContent = score);
    };

    const handleResetGameUI = function () {
      gameNewSection.style.display = "flex";
      gameStartSection.style.display = "none";
      gamePlaySection.style.display = "none";

      setScore("x", 0);
      setScore("o", 0);
    };

    const changeCellBackgroundColor = function (event) {
      if (!event.target.classList.contains("board__cell")) return;

      if (event.type === "mouseover" && event.target.innerHTML === "")
        event.target.style.backgroundColor =
          gameController.getCurrentPlayer().marker === "x"
            ? "rgba(79, 195, 247, 0.16)"
            : "rgba(255, 193, 7, 0.16)";
      else if (event.type === "mouseout" || event.target.innerHTML !== "")
        event.target.style.backgroundColor = "#fff";
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
      }
    };

    const drawLine = function (winningCombination, winner) {
      const [start, , end] = winningCombination;

      const startBox = boxesElements[start].getBoundingClientRect();
      const endBox = boxesElements[end].getBoundingClientRect();
      const boardRect = gameBoardElement.getBoundingClientRect();

      let x1, y1, x2, y2;

      if (start % 3 === end % 3) {
        x1 = startBox.left + startBox.width / 2 - boardRect.left;
        y1 = startBox.top - boardRect.top;
        x2 = endBox.left + endBox.width / 2 - boardRect.left;
        y2 = endBox.bottom - boardRect.top;
      } else if (Math.floor(start / 3) === Math.floor(end / 3)) {
        x1 = startBox.left - boardRect.left;
        y1 = startBox.top + startBox.height / 2 - boardRect.top;
        x2 = endBox.right - boardRect.left;
        y2 = endBox.top + endBox.height / 2 - boardRect.top;
      } else {
        if (start === 0 && end === 8) {
          x1 = startBox.left - boardRect.left;
          y1 = startBox.top - boardRect.top;
          x2 = endBox.right - boardRect.left;
          y2 = endBox.bottom - boardRect.top;
        } else if (start === 2 && end === 6) {
          x1 = startBox.right - boardRect.left;
          y1 = startBox.top - boardRect.top;
          x2 = endBox.left - boardRect.left;
          y2 = endBox.bottom - boardRect.top;
        }
      }

      const lineElement = document.createElement("div");
      lineElement.classList.add("line");
      lineElement.style.backgroundColor = winner === "x" ? "#2f8dde" : "#e26119";

      const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
      const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);

      lineElement.style.width = `${length}px`;
      lineElement.style.transform = `rotate(${angle}deg)`;
      lineElement.style.left = `${x1}px`;
      lineElement.style.top = `${y1}px`;

      setTimeout(() => gameBoardElement.appendChild(lineElement), 150);
    };

    const showDialog = function (result, winner) {
      let markup;

      if (result === "tie") markup = `<p class="typography dialog__text">This game is a tie</p>`;
      else
        markup = `
          <img src="./images/${winner}.svg" alt="Winning icon" class="dialog__icon" />
          <p class="typography dialog__text dialog__text--${winner}">won this round</p>
        `;
      dialogResult.innerHTML = "";
      dialogResult.insertAdjacentHTML("beforeend", markup);

      setTimeout(() => dialogModal.show(), 500);
    };

    const closeDialog = function (result, winner) {
      dialogModal.close();
    };

    const resetBoardUI = function () {
      for (let i = 0; i < 9; i++) {
        document.querySelector(`.board__cell[data-cell="${i}"]`).innerHTML = "";
      }

      document.querySelector(".line")?.remove();
    };

    return {
      handleNewGameUI,
      toggleChoice,
      getPlayer1,
      getPlayer2,
      handleStartGameUI,
      handleResetGameUI,
      setScore,
      changeCellBackgroundColor,
      changeTurnIcon,
      renderCell,
      drawLine,
      showDialog,
      closeDialog,
      resetBoardUI,
    };
  })();

  const gameController = (function () {
    let player1,
      player2,
      firstPlayer,
      currentPlayer,
      scoreX = 0,
      scoreO = 0,
      winner,
      gameOver = true;

    const winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

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
      if (firstPlayer) {
        currentPlayer = firstPlayer = firstPlayer === player1 ? player2 : player1;
        winner = undefined;
        gameOver = false;
        resetState();

        UIController.changeTurnIcon(firstPlayer.marker);
        UIController.handleStartGameUI();
      } else {
        UIController.handleNewGameUI();
      }

      UIController.closeDialog();
    };

    const createPlayer = function (name, marker) {
      return { name, marker };
    };

    const startGame = function () {
      gameOver = false;
      currentPlayer = firstPlayer = player1 = createPlayer("Player 1", UIController.getPlayer1());
      player2 = createPlayer("Player 2", UIController.getPlayer2());

      UIController.handleStartGameUI();
      UIController.changeTurnIcon(firstPlayer.marker);
    };

    const resetGame = function () {
      currentPlayer = firstPlayer = player1 = player2 = undefined;
      scoreX = scoreO = 0;
      winner = undefined;
      gameOver = false;
      resetState();

      UIController.closeDialog();
      UIController.handleResetGameUI();
    };

    const roundWon = function (winningCombinations) {
      for (const combination of winningCombinations) {
        if (
          gameBoard.getBoard()[combination[0]] !== "" &&
          gameBoard.getBoard()[combination[0]] === gameBoard.getBoard()[combination[1]] &&
          gameBoard.getBoard()[combination[0]] === gameBoard.getBoard()[combination[2]]
        ) {
          return combination;
        }
      }
      return false;
    };

    const roundTied = function () {
      for (const marker of gameBoard.getBoard()) {
        if (marker === "") {
          return false;
        }
      }

      return !roundWon();
    };

    const playRound = function (event) {
      if (!gameOver) {
        gameBoard.modifyBoard(event.target.dataset.cell, currentPlayer.marker);
        UIController.renderCell(event.target.dataset.cell);

        let winningCombination = roundWon(winningCombinations);
        if (winningCombination) {
          winner = currentPlayer;

          UIController.setScore(winner.marker, winner.marker === "x" ? ++scoreX : ++scoreO);

          UIController.drawLine(winningCombination, winner.marker);
          gameOver = true;
          UIController.showDialog("won", winner.marker);
        } else if (roundTied()) {
          gameOver = true;
          UIController.showDialog("tie");
        } else {
          currentPlayer = currentPlayer === player1 ? player2 : player1;
          UIController.changeTurnIcon(currentPlayer.marker);
        }
      }
    };

    const resetState = function () {
      for (let i = 0; i < 9; i++) {
        gameBoard.modifyBoard(i, "");
      }

      UIController.resetBoardUI();
    };

    return { getCurrentPlayer, newGame, startGame, resetGame, gameBoard, playRound };
  })();

  buttonsNewGame.forEach((button) => {
    button.addEventListener("click", gameController.newGame);
  });
  gameStartSection.addEventListener("change", UIController.toggleChoice);
  buttonStartGame.addEventListener("click", gameController.startGame);
  buttonsResetGame.forEach((button) => {
    button.addEventListener("click", gameController.resetGame);
  });
  cellElements.forEach((cell) => {
    cell.addEventListener("mouseover", UIController.changeCellBackgroundColor);
    cell.addEventListener("mouseout", UIController.changeCellBackgroundColor);
    cell.addEventListener("click", gameController.playRound);
  });
})();
