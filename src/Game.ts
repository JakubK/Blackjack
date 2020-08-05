import { Deck } from "./Deck";
import { Card } from "./Card";
import Request from './API/Request'
import CardToValueConverter from './CardToValueConverter'
import { Cards } from "./Cards";

export default class Game {

  deck: Deck;

  currentPlayer: number;
  playerPoints: Array<number>;
  playerScore: number;
  playerAcesCount: number;

  winner: number;
  winnerScore: number;

  scores: Array<number>;
  converter: CardToValueConverter;
  playersCount: number;

  drawCardBtn: HTMLButtonElement;
  endTurnBtn: HTMLButtonElement;

  constructor() {
    this.converter = new CardToValueConverter();
    this.drawCardBtn = document.querySelector('.game-table__draw');
    this.endTurnBtn = document.querySelector('.game-table__turn');

    this.drawCardBtn.addEventListener('click', async() => {
      await this.nextCard();
    })
    this.endTurnBtn.addEventListener('click', async() => {
      await this.endTurn()
    })
  }

  async endTurn(){
    //compare to previous champion
    if(this.playerScore < 22 && this.playerScore > this.winnerScore){
      this.winner = this.currentPlayer;
      this.winnerScore = this.playerScore;
    }

    if(this.currentPlayer < this.playersCount -1)
      this.currentPlayer++
    else{ //finalize the game
      this.endGame();
    }
    await this.startTurn();
  }

  async startGame(playersCount: number) {
    this.drawCardBtn.style.display = this.endTurnBtn.style.display = 'block';
    this.winner = this.winnerScore = -1;
    this.playerPoints = this.scores = [];
    this.playersCount = playersCount;
    this.deck = await Request.fetchDeck();
    this.currentPlayer = 0;
    this.startTurn();
  }

  async startTurn() {
    console.log(this.currentPlayer + " zaczyna ture")
    this.playerAcesCount = this.playerScore = 0;
    const cards:Cards = await Request.fetchCards(this.deck.deck_id,2);
    cards.cards.forEach(card => {
      this.evaluatePlayerHand(card);
    })

    if(this.currentPlayer == this.playersCount-1 && this.winner == -1){ //walkover
      this.winner = this.currentPlayer;
      this.winnerScore = this.playerScore;
      this.endGame();
    }
  }

  endGame() {
    console.log('wygrywa gracz ' + this.winner + " z wynikiem " + this.winnerScore);
    //toggle buttons
    this.drawCardBtn.style.display = this.endTurnBtn.style.display = 'none';
  }

  evaluatePlayerHand(newCard: Card){
    if(newCard.value == 'ACE'){
      this.playerAcesCount++;
      console.log('gracz znalazł asa');
    }
    if(this.playerAcesCount > 1){ //player won
      console.log("gracz ma 2 asy, wygrywa");
      this.winner = this.currentPlayer;
      this.winnerScore = this.playerScore;
      this.endGame();
      return;
    }
    const newValue = this.converter.Convert(newCard);
    this.playerPoints.push(newValue);
    this.playerScore += newValue;
    console.log("gracz " + this.currentPlayer + " podnosi karte o wartosci " + newValue)
    console.log("gracz " + this.currentPlayer + " ma punktow" + this.playerScore)
    if(this.playerScore >= 22){ //player lost
      console.log('gracz ma >=22 pkt więc przegrywa')
      this.endTurn();
    }
  }

  async nextCard() {
    const cards = await Request.fetchCards(this.deck.deck_id,1);
    this.evaluatePlayerHand(cards.cards[0]);
  }
}