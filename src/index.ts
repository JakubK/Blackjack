const gameMenu:HTMLElement = document.querySelector('.game-menu');
const gameTable:HTMLElement = document.querySelector('.game-table');
gameTable.style.display = 'none';

const modeButtons = document.querySelectorAll('.game-menu__btn');
const singlePlayerBtn = modeButtons[0];
const multiPlayerBtn = modeButtons[1];

const playersInput:HTMLInputElement = document.querySelector('.game-menu__players');
let playersCount: number;
let playersPoints: Array<number>;
let currentPlayerIndex: number;

const drawCardBtn = document.querySelector('.game-table__draw');
drawCardBtn.addEventListener('click', () => {
  drawCard()
});
const endTurnBtn = document.querySelector('.game-table__turn');
endTurnBtn.addEventListener('click', async () => {
  playersPoints.push(0);
  if(currentPlayerIndex < playersCount-1)
    currentPlayerIndex++;
  else {
    //end game
  }
  await startTurn();
});

const handsContainer = document.querySelector('.game-table__hands');

const playAgainBtn = document.querySelector('.game-table__repeat');
playAgainBtn.addEventListener('click', () => {
  handsContainer.innerHTML = '';
});

const backToMenuBtn = document.querySelector('.game-table__menu');
backToMenuBtn.addEventListener('click', () => {
  gameTable.style.display = 'none';
  gameMenu.style.display = 'block';
});

async function startGame() {
  // let deck = await fetchDeck();
  // let deckId = deck.deck_id;
  currentPlayerIndex = 0;
  startTurn();
}

async function startTurn() {
  console.log('current player id ' + currentPlayerIndex);
}

async function drawCard() {
  console.log(currentPlayerIndex + " draws a card");
}

singlePlayerBtn.addEventListener('click', async () => { 
  gameMenu.style.display = 'none';
  gameTable.style.display = 'block';
  playersCount = 1;
  playersPoints = [];
  await startGame();
});

multiPlayerBtn.addEventListener('click', async () => {
  gameMenu.style.display = 'none';
  gameTable.style.display = 'block';
  playersCount = parseInt(playersInput.value);
  playersPoints = [];
  await startGame();
});