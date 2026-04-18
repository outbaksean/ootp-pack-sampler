import type { PackCard } from "@/models/Card";
import type { Tier } from "@/models/Tier";
import { TIERS, TIER_WEIGHTS } from "@/models/Tier";
import type { PackDefinition } from "@/models/PackType";

function avgL10(cards: PackCard[]): number {
  const priced = cards.filter((c) => c.lastPrice > 0);
  if (priced.length === 0) return 0;
  return priced.reduce((sum, c) => sum + c.lastPrice, 0) / priced.length;
}

function slotEV(
  guaranteedTier: Tier | null,
  isAllHistorical: boolean,
  cardsByTierAndType: Map<Tier, { live: PackCard[]; historical: PackCard[] }>,
): number {
  if (guaranteedTier !== null) {
    const bucket = cardsByTierAndType.get(guaranteedTier);
    if (!bucket) return 0;
    if (isAllHistorical) return avgL10(bucket.historical);
    return 0.55 * avgL10(bucket.live) + 0.45 * avgL10(bucket.historical);
  }

  let ev = 0;
  for (const tier of TIERS) {
    const bucket = cardsByTierAndType.get(tier);
    if (!bucket) continue;
    const tierAvg = isAllHistorical
      ? avgL10(bucket.historical)
      : 0.55 * avgL10(bucket.live) + 0.45 * avgL10(bucket.historical);
    ev += TIER_WEIGHTS[tier] * tierAvg;
  }
  return ev;
}

export function packExpectedValue(
  packDef: PackDefinition,
  cardsByTierAndType: Map<Tier, { live: PackCard[]; historical: PackCard[] }>,
): number {
  return packDef.guaranteedSlots.reduce(
    (sum, guaranteedTier) =>
      sum + slotEV(guaranteedTier, packDef.isAllHistorical, cardsByTierAndType),
    0,
  );
}
