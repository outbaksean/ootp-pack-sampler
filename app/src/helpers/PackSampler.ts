import type { PackCard } from "@/models/Card";
import type { Tier } from "@/models/Tier";
import { TIERS, TIER_WEIGHTS } from "@/models/Tier";
import type { PackDefinition } from "@/models/PackType";

export interface DrawnCard {
  card: PackCard;
  tier: Tier;
  isHistorical: boolean;
}

// Precomputed cumulative weights for O(n) weighted tier selection
const CUMULATIVE: Array<{ tier: Tier; cumulative: number }> = (() => {
  let sum = 0;
  return TIERS.map((tier) => {
    sum += TIER_WEIGHTS[tier];
    return { tier, cumulative: sum };
  });
})();

function drawRandomTier(): Tier {
  const r = Math.random();
  for (const { tier, cumulative } of CUMULATIVE) {
    if (r < cumulative) return tier;
  }
  return "Iron";
}

function drawCard(
  tier: Tier,
  isHistorical: boolean,
  cardsByTierAndType: Map<Tier, { live: PackCard[]; historical: PackCard[] }>,
): PackCard | null {
  const bucket = cardsByTierAndType.get(tier);
  if (!bucket) return null;

  const primary = isHistorical ? bucket.historical : bucket.live;
  if (primary.length > 0) {
    return primary[Math.floor(Math.random() * primary.length)];
  }

  // Fallback: try opposite type if the preferred pool is empty
  const fallback = isHistorical ? bucket.live : bucket.historical;
  if (fallback.length > 0) {
    return fallback[Math.floor(Math.random() * fallback.length)];
  }

  return null;
}

export function openPack(
  packDef: PackDefinition,
  cardsByTierAndType: Map<Tier, { live: PackCard[]; historical: PackCard[] }>,
): DrawnCard[] {
  const result: DrawnCard[] = [];

  for (const guaranteedTier of packDef.guaranteedSlots) {
    const tier = guaranteedTier ?? drawRandomTier();
    const isHistorical = packDef.isAllHistorical ? true : Math.random() < 0.45;
    const card = drawCard(tier, isHistorical, cardsByTierAndType);
    if (card !== null) {
      result.push({ card, tier, isHistorical });
    }
  }

  return result;
}
