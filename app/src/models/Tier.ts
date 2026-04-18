export type Tier =
  | "Iron"
  | "Bronze"
  | "Silver"
  | "Gold"
  | "Diamond"
  | "Perfect";

export const TIERS: Tier[] = [
  "Iron",
  "Bronze",
  "Silver",
  "Gold",
  "Diamond",
  "Perfect",
];

const BRONZE_WEIGHT = 1 / 5;
const SILVER_WEIGHT = 1 / 10;
const GOLD_WEIGHT = 1 / 50;
const DIAMOND_WEIGHT = 1 / 150;
const PERFECT_WEIGHT = 1 / 1000;
const IRON_WEIGHT =
  1 -
  BRONZE_WEIGHT -
  SILVER_WEIGHT -
  GOLD_WEIGHT -
  DIAMOND_WEIGHT -
  PERFECT_WEIGHT;

export const TIER_WEIGHTS: Record<Tier, number> = {
  Iron: IRON_WEIGHT,
  Bronze: BRONZE_WEIGHT,
  Silver: SILVER_WEIGHT,
  Gold: GOLD_WEIGHT,
  Diamond: DIAMOND_WEIGHT,
  Perfect: PERFECT_WEIGHT,
};

export function getCardTier(cardValue: number): Tier {
  if (cardValue >= 100) return "Perfect";
  if (cardValue >= 90) return "Diamond";
  if (cardValue >= 80) return "Gold";
  if (cardValue >= 70) return "Silver";
  if (cardValue >= 60) return "Bronze";
  return "Iron";
}
