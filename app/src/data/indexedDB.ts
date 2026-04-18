import type { PackCard } from "@/models/Card";
import Dexie from "dexie";

export class OOTPPackSamplerDB extends Dexie {
  shopCards: Dexie.Table<PackCard, number>;

  constructor() {
    super("OOTPPackSamplerDB");
    this.version(1).stores({
      shopCards: "cardId, cardTitle, cardValue, lastPrice, cardType",
    });
    this.shopCards = this.table("shopCards");
  }
}

const db = new OOTPPackSamplerDB();
export default db;
