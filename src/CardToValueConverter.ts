import { Card } from './Card';

export default class CardToValueConverter {
  private conversionMap: Map<string,number> = new Map([
    ["JACK",2],
    ["QUEEN",3],
    ["KING",4],
    ["ACE",11]
  ])

  Convert(card: Card): number{
    if(isNaN(parseInt(card.value)))
      return this.conversionMap.get(card.value);
    else
      return parseInt(card.value);
  }
}