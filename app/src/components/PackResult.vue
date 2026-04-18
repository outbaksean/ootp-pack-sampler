<template>
  <div class="pack-result">
    <div v-if="cards.length === 0" class="empty-state">
      Select a pack type and click Open Pack to simulate opening one.
    </div>
    <div v-else>
      <div v-if="!cardStore.isDefaultData" class="result-header">
        <span class="total-label">Pack value</span>
        <span class="total-value">{{ formatStubs(totalValue) }} PP</span>
      </div>
      <div class="card-list">
        <div
          v-for="(drawn, i) in cards"
          :key="i"
          class="card-row"
          :class="{ 'card-row--no-price': cardStore.isDefaultData }"
        >
          <span class="tier-badge" :class="`tier-${drawn.tier}`">{{
            drawn.tier
          }}</span>
          <span class="card-name">{{ drawn.card.cardTitle }}</span>
          <span v-if="!cardStore.isDefaultData" class="card-price">{{
            drawn.card.lastPrice > 0 ? formatStubs(drawn.card.lastPrice) : "N/A"
          }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { DrawnCard } from "@/helpers/PackSampler";
import { useCardStore } from "@/stores/useCardStore";

const cardStore = useCardStore();

const props = defineProps<{ cards: DrawnCard[] }>();

function formatStubs(n: number): string {
  return Math.round(n).toLocaleString();
}

const totalValue = computed(() =>
  props.cards.reduce((sum, d) => sum + d.card.lastPrice, 0),
);
</script>

<style scoped>
.pack-result {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
  max-width: 760px;
}

.empty-state {
  padding: 2rem 1.25rem;
  text-align: center;
  color: #94a3b8;
  font-size: 0.88rem;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 0.6rem 1rem;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.total-label {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #94a3b8;
}

.total-value {
  font-size: 0.95rem;
  font-weight: 600;
  color: #1e293b;
}

.card-list {
  display: flex;
  flex-direction: column;
}

.card-row {
  display: grid;
  grid-template-columns: 72px 1fr auto;
  align-items: center;
  gap: 0.6rem;
  padding: 0.5rem 1rem;
  border-bottom: 1px solid #f1f5f9;
  font-size: 0.85rem;
}

.card-row--no-price {
  grid-template-columns: 72px 1fr;
}

.card-row:last-child {
  border-bottom: none;
}

.tier-badge {
  display: inline-block;
  padding: 1px 6px;
  border-radius: 3px;
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  text-align: center;
}

.tier-Iron {
  background: #f1f5f9;
  color: #64748b;
}
.tier-Bronze {
  background: #fef3c7;
  color: #92400e;
}
.tier-Silver {
  background: #e2e8f0;
  color: #334155;
}
.tier-Gold {
  background: #fef9c3;
  color: #713f12;
}
.tier-Diamond {
  background: #e0f2fe;
  color: #075985;
}
.tier-Perfect {
  background: #f3e8ff;
  color: #581c87;
}

.card-name {
  color: #1e293b;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-price {
  font-size: 0.85rem;
  font-weight: 500;
  color: #334155;
  text-align: right;
  white-space: nowrap;
}
</style>
