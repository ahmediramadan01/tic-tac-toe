"use strict";

const gameBoard = (function () {
	const gameBoardElement = document.querySelector(".game-board");
	gameBoardElement.style.backgroundColor = "#000";

	const board = ["", "", "", "", "", "", "", "", ""];

	const getGameBoardElement = () => gameBoardElement;

	const getBoard = () => board;

	const modifyBoard = function (position, marker) {
		board[position] = marker;
	};

	const renderCell = function (position) {
		const cell = gameBoardElement.querySelector(`[data-cell="${position}"]`);
		if (board[position] !== "") {
			cell.innerHTML = `<img src="./images/${board[position]}.svg" alt="" />`;
		} else {
			cell.innerHTML = "";
		}
	};

	const clearBoard = function () {
		gameBoardElement.innerHTML = "";
		board.forEach((_, index) => {
			gameBoardElement.insertAdjacentHTML("beforeend", `<div class="cell" data-cell="${index}"></div>`);
		});
	};

	return { getGameBoardElement, getBoard, modifyBoard, clearBoard, renderCell };
})();
gameBoard.clearBoard();

const gameController = (function () {
	const Player = function (name, marker) {
		const move = function (position) {
			if (position >= 0 && position < 9) {
				gameBoard.modifyBoard(position, marker);
			}
		};

		return { name, marker, move };
	};

	const playerX = Player("playerX", "x");
	const playerO = Player("playerO", "o");

	const announcementElement = document.querySelector(".announcement");
	announcementElement.style.color = "#000";

	const restartButtonElement = document.querySelector(".restart-button");
	restartButtonElement.style.color = "#000";

	let currentPlayer = playerX,
		gameOver = false,
		winner;

	const playGame = (function () {
		const checkForWin = function () {
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

			for (const combination of winningCombinations) {
				if (
					gameBoard.getBoard()[combination[0]] !== "" &&
					gameBoard.getBoard()[combination[0]] === gameBoard.getBoard()[combination[1]] &&
					gameBoard.getBoard()[combination[0]] === gameBoard.getBoard()[combination[2]]
				) {
					return true;
				}
			}
			return false;
		};

		const checkForTie = function () {
			for (const marker of gameBoard.getBoard()) {
				if (marker === "") {
					return false;
				}
			}

			return !checkForWin();
		};

		const handlePlayerMove = function (event) {
			if (!gameOver) {
				gameBoard.modifyBoard(event.target.dataset.cell, currentPlayer.marker);

				gameBoard.renderCell(event.target.dataset.cell);

				if (checkForWin()) {
					gameOver = true;
					winner = currentPlayer;
					announcementElement.textContent = winner === playerX ? "Player X WON!" : "Player O WON!";
					return;
				} else if (checkForTie()) {
					gameOver = true;
					announcementElement.textContent = "TIE!";
					return;
				}

				currentPlayer = currentPlayer === playerX ? playerO : playerX;
				announcementElement.textContent = currentPlayer === playerX ? "Player X's turn" : "Player O's turn";
			}
		};

		const restartGame = function (event) {
			if (event.key === "r" || event.key === "R" || event.target.closest(".restart-button")) {
				for (let i = 0; i < 9; i++) {
					gameBoard.modifyBoard(i, "");
				}
				gameOver = false;
				gameBoard.clearBoard();
				currentPlayer = playerX;
				announcementElement.textContent = currentPlayer === playerX ? "Player X's turn" : "Player O's turn";
			}
		};

		gameBoard.getGameBoardElement().addEventListener("click", function (event) {
			if (event.target.classList.contains("cell")) {
				handlePlayerMove(event);
			}
		});
		restartButtonElement.addEventListener("click", restartGame);
		window.addEventListener("keydown", restartGame);
	})();
})();
