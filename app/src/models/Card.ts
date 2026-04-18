export type CardType = "live" | "historical";

export interface PackCard {
  cardId: number;
  cardTitle: string;
  cardValue: number;
  lastPrice: number;
  cardType: CardType;
}
