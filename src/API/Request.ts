import { Deck } from '../Deck'
import { Cards } from '../Cards'

class Request {
  async get<T>(url: string): Promise<T> {
    return await fetch(`https://deckofcardsapi.com/api/deck/${url}`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => res.json())
  }

  async fetchDeck(): Promise<Deck>{
    return await this.get<Deck>('new/shuffle/?deck_count=1');
  }
  
  async fetchCards(deckId: string, count: number): Promise<Cards>{
    return await this.get<Cards>(`${deckId}/draw/?count=${count}`);
  }
}

export default new Request();