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

function addButtonEvent() {
  choose.forEach((btn) => {
    btn.addEventListener('click', playerChoice);
  });
}

addButtonEvent();

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

function playerChoiceMade(className) {
  choicePlayer.classList.add(className);
}

function computerChoice() {
  const random = Math.floor(Math.random() * max);

  choiceComputer.classList.add(choices[random].className);
}

function clearChoices() {
  choicePlayer.classList.remove('rock', 'paper', 'scissors');
  choiceComputer.classList.remove('rock', 'paper', 'scissors');
}

function checkRound() {
  if (
    (checkChoices(choicePlayer, 'rock') && checkChoices(choiceComputer, 'paper')) ||
    (checkChoices(choiceComputer, 'rock') && checkChoices(choicePlayer, 'scissors')) ||
    (checkChoices(choicePlayer, 'paper') && checkChoices(choiceComputer, 'scissors'))
  ) {
    computerTotal++;
    checkWhoWon();

    return setScore(computerResult, computerTotal);
  } else if (
    (checkChoices(choiceComputer, 'rock') && checkChoices(choicePlayer, 'paper')) ||
    (checkChoices(choiceComputer, 'paper') && checkChoices(choicePlayer, 'scissors')) ||
    (checkChoices(choicePlayer, 'rock') && checkChoices(choiceComputer, 'scissors'))
  ) {
    playerTotal++;
    checkWhoWon();

    return setScore(playerResult, playerTotal);
  } else {
    checkWhoWon();

    return displayDrawMsg();
  }
}

function checkChoices(side, className) {
  return side.classList.contains(className);
}

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

async function getJoke() {
  try {
    const response = await fetch('https://api.chucknorris.io/jokes/random');
    const joke = await response.json();

    chuckJoke.innerText = joke.value;
  } catch (err) {
    console.log(err.message);
  }
}

function setScore(side, score) {
  side.innerText = score;
}

function resetGame() {
  playerTotal = 0;
  computerTotal = 0;
  setScore(playerResult, playerTotal);
  setScore(computerResult, computerTotal);
  clearChoices();
  addBtnEvent();
}

function removeBtnEvent() {
  choose.forEach((btn) => {
    btn.removeEventListener('click', playerChoice);
    btn.style.cursor = 'not-allowed';
  });
}

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

function createNode(node, className) {
  const element = document.createElement(node);
  element.classList.add(className);

  return element;
}
