import type { Tier } from "./Tier";

export interface PackDefinition {
  key: string;
  label: string;
  guaranteedSlots: Array<Tier | null>;
  isAllHistorical: boolean;
}

const r = null; // random slot alias for readability

export const PACK_DEFINITIONS: PackDefinition[] = [
  {
    key: "standard",
    label: "Standard",
    guaranteedSlots: ["Bronze", r, r, r, r, r],
    isAllHistorical: false,
  },
  {
    key: "silver",
    label: "Silver",
    guaranteedSlots: ["Silver", r, r, r, r, r],
    isAllHistorical: false,
  },
  {
    key: "gold",
    label: "Gold",
    guaranteedSlots: ["Gold", r, r, r, r, r],
    isAllHistorical: false,
  },
  {
    key: "diamond",
    label: "Diamond",
    guaranteedSlots: ["Diamond", r, r, r, r, r],
    isAllHistorical: false,
  },
  {
    key: "perfect",
    label: "Perfect",
    guaranteedSlots: ["Perfect", r, r, r, r, r],
    isAllHistorical: false,
  },
  {
    key: "rainbow",
    label: "Rainbow",
    guaranteedSlots: ["Iron", "Bronze", "Silver", "Gold", "Diamond", "Perfect"],
    isAllHistorical: false,
  },
  {
    key: "histSilver",
    label: "Hist Silver",
    guaranteedSlots: ["Silver", r, r, r, r, r],
    isAllHistorical: true,
  },
  {
    key: "histGold",
    label: "Hist Gold",
    guaranteedSlots: ["Gold", r, r, r, r, r],
    isAllHistorical: true,
  },
  {
    key: "histDiamond",
    label: "Hist Diamond",
    guaranteedSlots: ["Diamond", r, r, r, r, r],
    isAllHistorical: true,
  },
  {
    key: "histPerfect",
    label: "Hist Perfect",
    guaranteedSlots: ["Perfect", r, r, r, r, r],
    isAllHistorical: true,
  },
  {
    key: "histRainbow",
    label: "Hist Rainbow",
    guaranteedSlots: ["Iron", "Bronze", "Silver", "Gold", "Diamond", "Perfect"],
    isAllHistorical: true,
  },
  {
    key: "allDiamond",
    label: "All Diamond",
    guaranteedSlots: [
      "Diamond",
      "Diamond",
      "Diamond",
      "Diamond",
      "Diamond",
      "Diamond",
    ],
    isAllHistorical: false,
  },
  {
    key: "allPerfect",
    label: "All Perfect",
    guaranteedSlots: [
      "Perfect",
      "Perfect",
      "Perfect",
      "Perfect",
      "Perfect",
      "Perfect",
    ],
    isAllHistorical: false,
  },
  {
    key: "histAllDiamond",
    label: "Hist All Diamond",
    guaranteedSlots: [
      "Diamond",
      "Diamond",
      "Diamond",
      "Diamond",
      "Diamond",
      "Diamond",
    ],
    isAllHistorical: true,
  },
  {
    key: "histAllPerfect",
    label: "Hist All Perfect",
    guaranteedSlots: [
      "Perfect",
      "Perfect",
      "Perfect",
      "Perfect",
      "Perfect",
      "Perfect",
    ],
    isAllHistorical: true,
  },
];
