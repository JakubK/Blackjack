import { Deck } from "./Deck";
import { Card } from "./Card";
import Request from './API/Request'
import CardToValueConverter from './CardToValueConverter'
import { Cards } from "./Cards";

export default class Game {

  deck: Deck;
  currentPlayer: number;
  playerPoints: Array<number>;
  converter: CardToValueConverter;
  playersCount: number;

  drawCardBtn: HTMLButtonElement;
  endTurnBtn: HTMLButtonElement;
  constructor() {
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
    if(this.currentPlayer < this.playersCount -1)
      this.currentPlayer++
    else{

    }
    await this.startTurn();
  }

  async startGame(playersCount: number) {
    this.playerPoints = [];
    this.playersCount = playersCount;
    this.deck = await Request.fetchDeck();
    this.currentPlayer = 0;
    this.startTurn();
  }

  async startTurn() {
    const cards:Cards = await Request.fetchCards(this.deck.deck_id,2);
    cards.cards.forEach(card => {
      console.log('xd');
    })
  }

  evaluatePlayerHand(newCard: Card){
    const newValue = this.converter.Convert(newCard);
    this.playerPoints.push(newValue);
  }

  async nextCard() {
    console.log(this.currentPlayer + " draws a card");
    const card = await Request.fetchCards(this.deck.deck_id,1);
  }
}