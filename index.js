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
})();
