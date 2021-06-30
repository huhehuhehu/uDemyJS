'use strict';

//Use . for class and # for ID
// console.log(document.querySelector('.message').textContent);

// setTimeout(() => {
//   document.querySelector('.number').textContent = 'OI';
// }, 3000);

let goal = Math.trunc(Math.random() * 20 + 1);
let playable = true;
console.log(goal);

const checking = function () {
  var value = document.querySelector('.guess').value;

  //if game over, don't bother checking
  if (!playable) return;
  if (value == goal) {
    document.querySelector('.message').textContent = 'Correct!';
    document.querySelector('.number').textContent = goal;
    playable = false;
    //replace highscore when applicable
    if (
      document.querySelector('.highscore').textContent <
      document.querySelector('.score').textContent
    )
      document.querySelector('.highscore').textContent =
        document.querySelector('.score').textContent;

    //modify CSS
    document.querySelector('body').style.backgroundColor = '#60b347';
    document.querySelector('.number').style.color = '#60b347';

    return;
    //if empty
  } else if (!value) {
    document.querySelector('.message').textContent = 'No number!';
    return;
  } else if (value < goal)
    document.querySelector('.message').textContent = 'Too low!';
  else if (value > goal)
    document.querySelector('.message').textContent = 'Too high!';

  //reduce score
  document.querySelector('.score').textContent--;

  //game over
  if (document.querySelector('.score').textContent === '0') {
    document.querySelector('.message').textContent = 'Game Over!';
    playable = false;
  }
  return;
};

document.querySelector('.check').addEventListener('click', checking);

document.querySelector('.again').addEventListener('click', function () {
  goal = Math.trunc(Math.random() * 20 + 1);
  playable = true;
  console.log(goal);
  document.querySelector('body').style.backgroundColor = '#222';
  document.querySelector('.number').style.color = '#222';
  document.querySelector('.message').textContent = 'Start Guessing...';
  document.querySelector('.score').textContent = '20';
  document.querySelector('.guess').value = '';
  document.querySelector('.number').textContent = '?';
});
