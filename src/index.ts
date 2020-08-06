import Game from './Game'
import { GameMode } from './GameMode'

const gameMenu:HTMLElement = document.querySelector('.game-menu');
const gameTable:HTMLElement = document.querySelector('.game-table');
gameTable.style.display = 'none';

const modeButtons = document.querySelectorAll('.game-menu__btn');
const singlePlayerBtn = modeButtons[0];
const multiPlayerBtn = modeButtons[1];

const playersInput:HTMLInputElement = document.querySelector('.game-menu__players');

const backToMenuBtn = document.querySelector('.game-table__menu');
backToMenuBtn.addEventListener('click', () => {
  gameTable.style.display = 'none';
  gameMenu.style.display = 'block';
});
let game: Game = new Game();

singlePlayerBtn.addEventListener('click', async () => { 
  gameMenu.style.display = 'none';
  gameTable.style.display = 'block';
  await game.startGame(2, GameMode.SinglePlayer);
});

multiPlayerBtn.addEventListener('click', async () => {
  gameMenu.style.display = 'none';
  gameTable.style.display = 'block';
  await game.startGame(parseInt(playersInput.value), GameMode.MultiPlayer);
});