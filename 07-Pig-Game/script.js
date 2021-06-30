'use strict';

const diceEl = document.querySelector('.dice');
diceEl.classList.add('hidden');

const player0El = document.querySelector('.player--0');
const player1El = document.querySelector('.player--1');
const playerEl = [player0El, player1El];

const score0El = document.querySelector('#score--0');
const score1El = document.getElementById('score--1'); //same function
const scoreEl = [score0El, score1El];

const current0El = document.getElementById('current--0');
const current1El = document.getElementById('current--1');
const currentEl = [current0El, current1El];

const btnRoll = document.querySelector('.btn--roll');
const btnNew = document.querySelector('.btn--new');
const btnHold = document.querySelector('.btn--hold');

let scores = [0, 0];
let tempScore = 0;
let activePlayer = 0;
const winScore = 25; //how many points to win
let won = false;

//switch function
const switchPlayer = function () {
  currentEl[activePlayer].textContent = 0;
  tempScore = 0;
  activePlayer = (activePlayer + 1) % 2;
  player0El.classList.toggle('player--active');
  player1El.classList.toggle('player--active');
};

//roll function
const roll = function () {
  if (won) return;
  var val = Math.trunc(Math.random() * 6 + 1);

  diceEl.classList.remove('hidden');
  diceEl.src = `dice-${val}.png`;

  if (val === 1) {
    switchPlayer();
    return;
  }

  tempScore += val;
  currentEl[activePlayer].textContent = tempScore;
  checkWin();

  return;
};

//hold function
const hold = function () {
  if (won) return;
  scores[activePlayer] += tempScore;
  scoreEl[activePlayer].textContent = scores[activePlayer];
  switchPlayer();
};

//check if anyone won
const checkWin = function () {
  if (scores[activePlayer] + tempScore >= winScore) {
    scores[activePlayer] += tempScore;
    scoreEl[activePlayer].textContent = scores[activePlayer];
    currentEl[activePlayer].textContent = 0;
    playerEl[activePlayer].classList.add('player--winner');
    won = true;
    diceEl.classList.add('hidden');
  }
  return;
};

//initialise everything for new game
const initialise = function () {
  playerEl[activePlayer].classList.remove('player--winner');
  scores = [0, 0];
  tempScore = 0;
  activePlayer = 0;
  won = false;
  score0El.textContent = 0;
  score1El.textContent = 0;
  player0El.classList.add('player--active');
  player1El.classList.remove('player--active');
};

//check if someone won disable buttons
btnRoll.addEventListener('click', roll);
btnHold.addEventListener('click', hold);
btnNew.addEventListener('click', initialise);
