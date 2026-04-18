<template>
  <div class="pack-selector">
    <div v-for="group in PACK_GROUPS" :key="group.label" class="pack-group">
      <div class="group-label">{{ group.label }}</div>
      <div class="pack-buttons">
        <button
          v-for="pack in group.packs"
          :key="pack.key"
          class="pack-btn"
          :class="{ 'pack-btn--selected': pack.key === modelValue }"
          @click="$emit('update:modelValue', pack.key)"
        >
          <span class="pack-btn-label">{{ pack.label }}</span>
          <span class="pack-btn-ev">{{
            cardStore.isDefaultData ? "-" : formatEv(evMap[pack.key])
          }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { PACK_DEFINITIONS } from "@/models/PackType";
import { packExpectedValue } from "@/helpers/expectedValue";
import { useCardStore } from "@/stores/useCardStore";

defineProps<{ modelValue: string }>();
defineEmits<{ "update:modelValue": [key: string] }>();

const cardStore = useCardStore();

function formatEv(n: number): string {
  return "EV: " + Math.round(n).toLocaleString() + " PP";
}

const evMap = computed(() => {
  const map = cardStore.cardsByTierAndType;
  return Object.fromEntries(
    PACK_DEFINITIONS.map((p) => [p.key, packExpectedValue(p, map)]),
  );
});

const PACK_GROUPS = [
  {
    label: "Standard",
    packs: PACK_DEFINITIONS.filter((p) =>
      ["standard", "silver", "gold", "diamond", "perfect", "rainbow"].includes(
        p.key,
      ),
    ),
  },
  {
    label: "Historical",
    packs: PACK_DEFINITIONS.filter((p) =>
      [
        "histSilver",
        "histGold",
        "histDiamond",
        "histPerfect",
        "histRainbow",
      ].includes(p.key),
    ),
  },
  {
    label: "Full Tier",
    packs: PACK_DEFINITIONS.filter((p) =>
      ["allDiamond", "allPerfect", "histAllDiamond", "histAllPerfect"].includes(
        p.key,
      ),
    ),
  },
];
</script>

<style scoped>
.pack-selector {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.pack-group {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.group-label {
  font-size: 0.63rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--sidebar-muted);
}

.pack-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.pack-btn {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 4px 10px;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.05);
  color: var(--sidebar-text);
  font-size: 0.8rem;
  cursor: pointer;
  transition:
    background 0.12s,
    border-color 0.12s,
    color 0.12s;
}

.pack-btn-label {
  line-height: 1.3;
}

.pack-btn-ev {
  font-size: 0.68rem;
  color: var(--sidebar-muted);
  line-height: 1.2;
}

.pack-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
}

.pack-btn--selected {
  background: rgba(34, 197, 94, 0.15);
  border-color: #4ade80;
  color: #86efac;
}

.pack-btn--selected .pack-btn-ev {
  color: #4ade80;
}

.pack-btn--selected:hover {
  background: rgba(34, 197, 94, 0.22);
}
</style>
