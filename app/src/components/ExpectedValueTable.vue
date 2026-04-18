<template>
  <div class="ev-table-wrap">
    <div class="ev-header">Expected Value per Pack</div>
    <div v-if="!cardStore.hasCards" class="ev-empty">
      Upload card data to see expected values.
    </div>
    <table v-else class="ev-table">
      <thead>
        <tr>
          <th>Pack</th>
          <th class="num-col">Expected Value</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="row in sortedRows"
          :key="row.key"
          :class="{ 'row--selected': row.key === selectedPackKey }"
        >
          <td>{{ row.label }}</td>
          <td class="num-col">
            {{ cardStore.isDefaultData ? "-" : formatStubs(row.ev) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useCardStore } from "@/stores/useCardStore";
import { PACK_DEFINITIONS } from "@/models/PackType";
import { packExpectedValue } from "@/helpers/expectedValue";

defineProps<{ selectedPackKey: string }>();

const cardStore = useCardStore();

function formatStubs(n: number): string {
  return Math.round(n).toLocaleString();
}

const sortedRows = computed(() => {
  const map = cardStore.cardsByTierAndType;
  return PACK_DEFINITIONS.map((pack) => ({
    key: pack.key,
    label: pack.label,
    ev: packExpectedValue(pack, map),
  })).sort((a, b) => b.ev - a.ev);
});
</script>

<style scoped>
.ev-table-wrap {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
}

.ev-header {
  padding: 0.6rem 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #94a3b8;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.ev-empty {
  padding: 1.5rem 1rem;
  font-size: 0.85rem;
  color: #94a3b8;
  text-align: center;
}

.ev-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;
}

.ev-table thead tr {
  background: #f8fafc;
}

.ev-table th {
  padding: 0.45rem 1rem;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 600;
  color: #64748b;
  border-bottom: 1px solid #e2e8f0;
}

.ev-table td {
  padding: 0.45rem 1rem;
  color: #1e293b;
  border-bottom: 1px solid #f1f5f9;
}

.ev-table tbody tr:last-child td {
  border-bottom: none;
}

.ev-table tbody tr:hover td {
  background: #f8fafc;
}

.num-col {
  text-align: right;
}

.row--selected td {
  background: #f0fdf4;
  font-weight: 500;
}

.row--selected:hover td {
  background: #dcfce7;
}
</style>
