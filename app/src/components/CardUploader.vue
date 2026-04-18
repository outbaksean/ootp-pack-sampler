<template>
  <div class="upload-section">
    <div class="section-header">
      <span class="section-label">Card Data</span>
    </div>
    <div class="status-block">
      <div class="status-row">
        <div class="status-indicator">
          <span
            class="status-dot"
            :class="hasUserCards ? 'dot-green' : 'dot-red'"
          ></span>
          <span :class="statusClass">{{ statusText }}</span>
        </div>
        <button
          class="action-btn"
          type="button"
          data-bs-toggle="modal"
          data-bs-target="#cardUploaderModal"
        >
          Upload
        </button>
      </div>
      <div v-if="hasUserCards && lastUploadedText" class="upload-time">
        {{ lastUploadedText }}
      </div>
    </div>

    <teleport to="body">
      <CardUploaderModal />
    </teleport>
  </div>
</template>

<script setup lang="ts">
import CardUploaderModal from "./CardUploaderModal.vue";
import { useCardStore } from "@/stores/useCardStore";
import { computed } from "vue";

const cardStore = useCardStore();

const hasUserCards = computed(
  () => cardStore.hasCards && !cardStore.isDefaultData,
);

const statusClass = computed(() =>
  hasUserCards.value ? "status-loaded" : "status-missing",
);
const statusText = computed(() =>
  hasUserCards.value ? "Cards loaded" : "User data not imported",
);

const lastUploadedText = computed(() => {
  const iso = cardStore.lastUploadedAt;
  if (!iso) return null;
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
});
</script>

<style scoped>
.upload-section {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--sidebar-border);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.section-label {
  font-size: 0.63rem;
  font-weight: 600;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: var(--sidebar-muted);
}

.status-block {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.status-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  min-width: 0;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

.dot-green {
  background: #4ade80;
  box-shadow: 0 0 5px rgba(74, 222, 128, 0.45);
}

.dot-red {
  background: #fca5a5;
  box-shadow: 0 0 5px rgba(252, 165, 165, 0.45);
}

.status-loaded {
  font-size: 0.78rem;
  color: #4ade80;
  font-weight: 500;
}

.status-missing {
  font-size: 0.78rem;
  color: #fca5a5;
  font-weight: 500;
}

.upload-time {
  font-size: 0.66rem;
  color: var(--sidebar-muted);
  padding-left: 0.95rem;
}

.action-btn {
  background: rgba(255, 255, 255, 0.07);
  color: var(--sidebar-text);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 4px;
  padding: 2px 8px;
  font-size: 0.72rem;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.15s;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.13);
}
</style>
