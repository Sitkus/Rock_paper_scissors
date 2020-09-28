const choices = [
  {
    id: 1,
    className: 'rock'
  },
  {
    id: 2,
    className: 'paper'
  },
  {
    id: 3,
    className: 'scissors'
  }
];

// Variables
const main = document.querySelector('.main');
const choicePlayer = document.querySelector('.game__img--left');
const choiceComputer = document.querySelector('.game__img--right');
const playerResult = document.querySelector('.result__left');
const computerResult = document.querySelector('.result__right');
const choose = document.querySelectorAll('.choose__item');
const jokeContainer = document.querySelector('.joke');
const jokeMsg = document.querySelector('.joke__winmsg');
const chuckJoke = document.querySelector('.joke__insert');
const drawMsg = document.querySelector('.draw');
const min = 0;
const max = choices.length;
let playerTotal = 0;
let computerTotal = 0;

// Event listeners
function addBtnEvent() {
  choose.forEach(btn => {
    btn.addEventListener('click', playerChoice);
  });
}

// Calling functions
addBtnEvent();

// Person making a decision
function playerChoice(e) {
  clearChoices();

  if (e.target.classList.contains('choose__item--rock')) {
    playerChoiceMade('rock');
  } else if (e.target.classList.contains('choose__item--paper')) {
    playerChoiceMade('paper');
  } else if (e.target.classList.contains('choose__item--scissors')) {
    playerChoiceMade('scissors');
  }

  computerChoice();
  checkRound();
}

// Player choice registered
function playerChoiceMade(className) {
  choicePlayer.classList.add(className);
}

// Computer random choice made
function computerChoice() {
  const random = Math.floor(Math.random() * max);

  choiceComputer.classList.add(choices[random].className);
}

// Clearing all choices
function clearChoices() {
  choicePlayer.classList.remove('rock', 'paper', 'scissors');
  choiceComputer.classList.remove('rock', 'paper', 'scissors');
}

// Check who wins one round: Computer or Person
function checkRound() {
  if (checkChoices(choicePlayer, 'rock') && checkChoices(choiceComputer, 'paper') ||
      checkChoices(choiceComputer, 'rock') && checkChoices(choicePlayer, 'scissors') ||
      checkChoices(choicePlayer, 'paper') && checkChoices(choiceComputer, 'scissors')) {
    computerTotal++;
    checkWhoWon();

    return setScore(computerResult, computerTotal);
  } else if (checkChoices(choiceComputer, 'rock') && checkChoices(choicePlayer, 'paper') ||
            checkChoices(choiceComputer, 'paper') && checkChoices(choicePlayer, 'scissors') ||
            checkChoices(choicePlayer, 'rock') && checkChoices(choiceComputer, 'scissors')) {
    playerTotal++;
    checkWhoWon();

    return setScore(playerResult, playerTotal);
  } else {
    checkWhoWon();

    return displayDrawMsg();
  }
}

// Decide who won round out of 3 tries
function checkWhoWon() {
  if (computerTotal + playerTotal === 3) {
    removeBtnEvent();

    if (computerTotal > playerTotal) {
      generateMsg('joke__failed', 'YOU LOST! Jokes on you from Mr. Computer!');
      getJoke();

      chuckJoke.style.display = 'block';

      setTimeout(() => {
        tryAgain();
      }, 3000);
    } else {
      generateMsg('joke__success', 'YOU WON! Congrats on beating Mr. Computer!');

      setTimeout(() => {
        tryAgain();
      }, 3000);
    }
  }
}

// Generate win or loss msg
function generateMsg(className, msg) {
  jokeMsg.classList.add(className);
  jokeMsg.innerText = msg;
}

function displayDrawMsg() {
  drawMsg.classList.toggle('display');

  setTimeout(() => {
    drawMsg.classList.toggle('display');
  }, 1000);
}

// Check choices by class names
function checkChoices(side, className) {
  return side.classList.contains(className);
}

// Fetch a joke
function getJoke() {
  fetch('https://api.chucknorris.io/jokes/random')
    .then(response => response.json())
    .then(joke => chuckJoke.innerText = joke.value);
}

// Setting scores into UI
function setScore(side, score) {
  side.innerText = score;
}

// Resetting game score + choices
function resetGame() {
  playerTotal = 0;
  computerTotal = 0;
  setScore(playerResult, playerTotal);
  setScore(computerResult, computerTotal);
  clearChoices();
  addBtnEvent();
}

// Remove event listeners from choices btns
function removeBtnEvent() {
  choose.forEach(btn => {
    btn.removeEventListener('click', playerChoice);
    btn.style.cursor = 'not-allowed';
  });
}

// Ask user if he wants to try again
function tryAgain() {
  const modal = createNode('section', 'modal');
  const div = createNode('div', 'modal__box');
  const yes = createNode('button', 'modal__btn');
  const no = createNode('button', 'modal__btn');
  const p = createNode('p', 'modal__question');

  yes.classList.add('modal__btn--yes');
  no.classList.add('modal__btn--no');
  yes.innerText = 'YES';
  no.innerText = 'NO';
  p.innerText = 'Would you like to play again?';

  div.appendChild(p);
  div.appendChild(yes);
  div.appendChild(no);
  modal.appendChild(div);

  document.body.appendChild(modal);
  main.style.filter = 'blur(0.7rem)';

  setTimeout(() => {
    modal.classList.add('active');
  }, 20);

  yes.addEventListener('click', () => {
    location.reload();
  });

  no.addEventListener('click', () => {
    modal.remove();
    main.style.filter = 'blur(0)';
  });
}

// Creating node - universal function
function createNode(node, className) {
  const element = document.createElement(node);
  element.classList.add(className);

  return element;
}
