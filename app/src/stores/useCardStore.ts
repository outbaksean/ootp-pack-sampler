import { ref, computed } from "vue";
import { defineStore } from "pinia";
import type { PackCard, CardType } from "@/models/Card";
import type { Tier } from "@/models/Tier";
import { getCardTier } from "@/models/Tier";
import db from "@/data/indexedDB";
import Papa from "papaparse";

type ShopCardRow = {
  "Card ID": string;
  "//Card Title": string;
  "Card Value": string;
  "Last 10 Price": string;
  "Card Type": string;
  "Card Badge": string;
  packs: string;
};

function parseCardType(row: ShopCardRow): CardType | null {
  if (row["Card Badge"] === "CS") return null;
  if (row["Card Badge"] === "ME") return null;
  if (row["packs"] === "0") return null;
  if (parseInt(row["Card Type"], 10) === 1) return "live";
  return "historical";
}

function parsePackCardRow(row: ShopCardRow): PackCard | null {
  const cardType = parseCardType(row);
  if (cardType === null) return null;
  const cardId = parseInt(row["Card ID"], 10) || 0;
  return {
    cardId,
    cardTitle: row["//Card Title"] || `Card #${cardId}`,
    cardValue: parseInt(row["Card Value"], 10) || 0,
    lastPrice: parseInt(row["Last 10 Price"], 10) || 0,
    cardType,
  };
}

const CARDS_SOURCE_KEY = "ootp-pack-sampler-cards-source";
const CARDS_UPLOADED_AT_KEY = "ootp-pack-sampler-cards-uploaded-at";

export const useCardStore = defineStore("card", () => {
  const packCards = ref<PackCard[]>([]);
  const isDefaultData = ref(localStorage.getItem(CARDS_SOURCE_KEY) !== "user");
  const lastUploadedAt = ref<string | null>(
    localStorage.getItem(CARDS_UPLOADED_AT_KEY),
  );

  const hasCards = computed(() => packCards.value.length > 0);

  const cardsByCardId = computed(() => {
    const map = new Map<number, PackCard>();
    for (const card of packCards.value) {
      map.set(card.cardId, card);
    }
    return map;
  });

  const cardsByTierAndType = computed(() => {
    const map = new Map<Tier, { live: PackCard[]; historical: PackCard[] }>();
    for (const card of packCards.value) {
      const tier = getCardTier(card.cardValue);
      if (!map.has(tier)) map.set(tier, { live: [], historical: [] });
      map.get(tier)![card.cardType].push(card);
    }
    return map;
  });

  async function uploadShopFile(file: File) {
    const text = await file.text();
    await new Promise<void>((resolve) => {
      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        complete: async (results: { data: ShopCardRow[] }) => {
          const cards = results.data
            .map(parsePackCardRow)
            .filter((c): c is PackCard => c !== null);
          await db.shopCards.clear();
          await db.shopCards.bulkAdd(cards);
          packCards.value = cards;
          isDefaultData.value = false;
          localStorage.setItem(CARDS_SOURCE_KEY, "user");
          const uploadedAt = new Date().toISOString();
          lastUploadedAt.value = uploadedAt;
          localStorage.setItem(CARDS_UPLOADED_AT_KEY, uploadedAt);
          resolve();
        },
      });
    });
  }

  async function clearShopCards() {
    await db.shopCards.clear();
    packCards.value = [];
    isDefaultData.value = true;
    localStorage.removeItem(CARDS_SOURCE_KEY);
    lastUploadedAt.value = null;
    localStorage.removeItem(CARDS_UPLOADED_AT_KEY);
    await fetchDefaultCards();
  }

  async function loadFromCache() {
    const cards = await db.shopCards.toArray();
    packCards.value = cards;
    if (
      cards.length > 0 &&
      localStorage.getItem(CARDS_SOURCE_KEY) !== "default"
    ) {
      isDefaultData.value = false;
      localStorage.setItem(CARDS_SOURCE_KEY, "user");
    }
  }

  async function fetchDefaultCards() {
    if (packCards.value.length > 0) return;
    try {
      const response = await fetch("/ootp-missions-27/data/shop_cards.csv");
      const text = await response.text();
      await new Promise<void>((resolve) => {
        Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
          complete: async (results: { data: ShopCardRow[] }) => {
            const cards = results.data
              .map(parsePackCardRow)
              .filter((c): c is PackCard => c !== null);
            await db.shopCards.clear();
            await db.shopCards.bulkAdd(cards);
            packCards.value = cards;
            isDefaultData.value = true;
            localStorage.setItem(CARDS_SOURCE_KEY, "default");
            resolve();
          },
        });
      });
    } catch (e) {
      console.error("Failed to load default shop cards", e);
    }
  }

  return {
    packCards,
    hasCards,
    isDefaultData,
    lastUploadedAt,
    cardsByCardId,
    cardsByTierAndType,
    uploadShopFile,
    clearShopCards,
    loadFromCache,
    fetchDefaultCards,
  };
});
