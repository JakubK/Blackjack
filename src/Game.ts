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
  gameResultText: HTMLSpanElement;

  gameTable: HTMLElement;
  gameEnd: HTMLElement;
  cardsContainer: HTMLElement;

  constructor() {
    this.drawCardBtn = document.querySelector('.game-table__draw');
    this.endTurnBtn = document.querySelector('.game-table__turn');
    this.playAgainBtn = document.querySelector('.game-table__repeat');

    this.playerInfoText = document.querySelector('.game-table__info');
    this.gameResultText = document.querySelector('.game-table__result');

    this.gameTable = document.querySelector('.game-table');
    this.gameEnd = document.querySelector('.game-end');
    this.cardsContainer = document.querySelector('.game-table__cards');

    this.drawCardBtn.addEventListener('click', async() => await this.nextCard());
    this.endTurnBtn.addEventListener('click', async() => await this.endTurn());
    this.playAgainBtn.addEventListener('click', async() => await this.startGame(this.playersCount, this.gameMode));
  }
  updateScore() {
    this.playerInfoText.innerText += `\nGracz ${this.currentPlayer + 1}, ${this.playerScore} punktów`;
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
    this.playerInfoText.innerText = this.gameResultText.innerText = '';

    this.gameTable.style.display = this.drawCardBtn.style.display = this.endTurnBtn.style.display = 'block';
    this.gameEnd.style.display = 'none';

    this.winner = this.winnerScore = -1;
    this.deck = await Request.fetchDeck();
    this.currentPlayer = 0;
    this.startTurn();
  }

  async startTurn() {
    this.cardsContainer.innerHTML = '';
    this.playerScore = 0;
    const cards = await Request.fetchCards(this.deck.deck_id,2);
    this.evaluateCards(cards.cards, 0, 2);

    if(this.playerScore == 22) //2 aces
      this.promoteCurrentPlayer();
    else if(this.gameMode == GameMode.SinglePlayer && this.currentPlayer == 1){ //evaluate the bot logic
      this.drawCardBtn.style.display = this.endTurnBtn.style.display = 'none';
      if(this.playerScore > this.winnerScore)
        this.promoteCurrentPlayer()
      else{
        const scoreToBeat = this.winnerScore;
        while(this.playerScore <= scoreToBeat)
          await this.nextCard();
        
        await this.endTurn();
      }
    }
  }

  promoteCurrentPlayer(){
    this.winner = this.currentPlayer;
    this.winnerScore = this.playerScore;
    this.endGame();
  }

  endGame() {
    if(this.winner == -1)
      this.gameResultText.innerText = 'Nikt nie wygrał';
    else
      this.gameResultText.innerText = 'Wygrywa gracz ' + (this.winner+1) + " z wynikiem " + this.winnerScore;
    this.drawCardBtn.style.display = this.endTurnBtn.style.display = 'none';
    this.gameEnd.style.display = 'block';
  }

  async evaluateCards(cards: Card[], from: number, count: number){
    const newValue = CardToValueConverter.Convert(cards[from]);
    this.playerScore += newValue;
    this.cardsContainer.innerHTML += `<img class="card" src="${cards[from].image}"/>`;
    this.updateScore();
    if(this.playerScore >= 22){ //player lost{
      await this.endTurn();
      return;
    }
    else if(this.playerScore == 21){ //player won
      this.promoteCurrentPlayer();  
      return;
    }
    if(from < count-1)
      await this.evaluateCards(cards, from+1,count);
  }

  async nextCard() {
    const cards = await Request.fetchCards(this.deck.deck_id,1);
    await this.evaluateCards(cards.cards, 0, 1);
    if(this.currentPlayer == this.playersCount-1 && this.winner == -1 && this.playerScore < 22) //walkover
      this.promoteCurrentPlayer()
  }
}