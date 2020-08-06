import { Deck } from "./Deck";
import { Card } from "./Card";
import Request from './API/Request'
import CardToValueConverter from './CardToValueConverter'
import { GameMode } from './GameMode'

export default class Game {
  deck: Deck;

  currentPlayer: number;
  playerScore: number;

  winner: number;
  winnerScore: number;

  playersCount: number;
  gameMode: GameMode;

  drawCardBtn: HTMLButtonElement;
  endTurnBtn: HTMLButtonElement;
  playAgainBtn:HTMLButtonElement;

  playerInfoText: HTMLSpanElement;
  gameTable: HTMLElement;
  gameEnd: HTMLElement;

  constructor() {
    this.drawCardBtn = document.querySelector('.game-table__draw');
    this.endTurnBtn = document.querySelector('.game-table__turn');
    this.playAgainBtn = document.querySelector('.game-table__repeat');

    this.playerInfoText = document.querySelector('.game-table__info');
    this.gameTable = document.querySelector('.game-table');
    this.gameEnd = document.querySelector('.game-end');

    this.drawCardBtn.addEventListener('click', async() => await this.nextCard());
    this.endTurnBtn.addEventListener('click', async() => await this.endTurn());
    this.playAgainBtn.addEventListener('click', async() => await this.startGame(this.playersCount, this.gameMode));
  }
  updateScore() {
    this.playerInfoText.innerText = `Gracz ${this.currentPlayer + 1}, ${this.playerScore} punktów`;
  }
  async endTurn(){
    if(this.playerScore < 22 && this.playerScore > this.winnerScore){  //compare to previous champion
      this.winner = this.currentPlayer;
      this.winnerScore = this.playerScore;
    }

    if(this.currentPlayer < this.playersCount - 1)
      this.currentPlayer++
    else //finalize the game
    {
      this.endGame();
      return;
    }
    await this.startTurn();
  }
  async startGame(playersCount: number, gameMode: GameMode) {
    this.gameMode = gameMode;
    this.playersCount = playersCount;
    this.playerInfoText.innerText = '';
    this.gameTable.style.display = 'block';
    this.gameEnd.style.display = 'none';
    this.winner = this.winnerScore = -1;
    this.deck = await Request.fetchDeck();
    this.currentPlayer = 0;
    this.startTurn();
  }
  async startTurn() {
    this.playerScore = 0;
    const cards = await Request.fetchCards(this.deck.deck_id,2);
    cards.cards.forEach(card => { this.evaluatePlayerHand(card); })

    if(this.playerScore == 22 || (this.currentPlayer == this.playersCount-1 && this.winner == -1)) //2 aces || walkover
      this.promoteCurrentPlayer();
    else if(this.gameMode == GameMode.SinglePlayer && this.currentPlayer == 1){ //evaluate the bot logic
      const scoreToBeat = this.winnerScore;
      while(this.playerScore <= scoreToBeat)
        await this.nextCard();
      await this.endTurn();  
    }
  }

  promoteCurrentPlayer(){
    this.winner = this.currentPlayer;
    this.winnerScore = this.playerScore;
    this.endGame();
  }

  endGame() {
    console.log('wygrywa gracz ' + this.winner + " z wynikiem " + this.winnerScore);
    this.gameTable.style.display = 'none';
    this.gameEnd.style.display = 'block';
  }

  async evaluatePlayerHand(newCard: Card){
    const newValue = CardToValueConverter.Convert(newCard);
    this.playerScore += newValue;
    this.updateScore();
    if(this.playerScore >= 22) //player lost
      await this.endTurn();
    else if(this.playerScore == 21){ //player won
      this.promoteCurrentPlayer();
    }
  }

  async nextCard() {
    const cards = await Request.fetchCards(this.deck.deck_id,1);
    this.evaluatePlayerHand(cards.cards[0]);
  }
}