"use strict";

(function () {
  const gameNewSection = document.querySelector(".game--new");
  const buttonNewGame = document.querySelector(".button--new");

  const gameController = (function () {
    const newGame = function () {
      gameNewSection.style.display = "none";
    };

    return { newGame };
  })();

  buttonNewGame.addEventListener("click", gameController.newGame);
})();
