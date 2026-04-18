<template>
  <div
    class="modal fade"
    id="cardUploaderModal"
    tabindex="-1"
    aria-labelledby="cardUploaderModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-lg modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="cardUploaderModalLabel">
            Upload Card Data
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <input
            type="file"
            ref="fileInput"
            class="d-none"
            @change="handleFileChange"
          />
          <div
            class="upload-drop-zone"
            :class="{ 'upload-drop-zone--active': dragging }"
            @dragenter.prevent="onDragEnter"
            @dragover.prevent
            @dragleave="onDragLeave"
            @drop.prevent="onDrop"
            @click="fileInput?.click()"
          >
            Drop your card export CSV here, or click to browse
          </div>
          <div v-if="hasCards && !isDefaultData" class="clear-row">
            <button
              class="btn btn-sm btn-danger"
              type="button"
              @click="clearCards"
            >
              Reset to default data
            </button>
          </div>
          <div class="upload-help-section">
            <button
              class="btn-help-toggle"
              type="button"
              @click="helpExpanded = !helpExpanded"
            >
              {{ helpExpanded ? "Hide instructions" : "Show instructions" }}
            </button>
            <div v-if="helpExpanded" class="upload-help-content">
              <p class="upload-help-body">
                To get the latest price data, from the card shop with no filters
                on, click Export Card List to CSV.
              </p>
              <img
                :src="exportHelpImgUrl"
                alt="Shop Cards Export Help"
                class="upload-help-img"
              />
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useCardStore } from "@/stores/useCardStore";

const cardStore = useCardStore();
const hasCards = computed(() => cardStore.hasCards);
const isDefaultData = computed(() => cardStore.isDefaultData);

const fileInput = ref<HTMLInputElement | null>(null);
const dragging = ref(false);
let dragCounter = 0;

function onDragEnter() {
  dragCounter++;
  dragging.value = true;
}

function onDragLeave() {
  if (--dragCounter === 0) dragging.value = false;
}

async function onDrop(e: DragEvent) {
  dragCounter = 0;
  dragging.value = false;
  const file = e.dataTransfer?.files[0];
  if (file) await processFile(file);
}

async function handleFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (file) await processFile(file);
}

async function processFile(file: File) {
  await cardStore.uploadShopFile(file);
  const closeBtn = document.querySelector(
    '#cardUploaderModal [data-bs-dismiss="modal"]',
  );
  if (closeBtn instanceof HTMLElement) closeBtn.click();
}

async function clearCards() {
  await cardStore.clearShopCards();
}

const helpExpanded = ref(false);
const exportHelpImgUrl = "/ootp-missions-27/OotpExportShopCards.jpg";
</script>

<style scoped>
.upload-drop-zone {
  border: 2px dashed #cbd5e1;
  border-radius: 8px;
  padding: 3rem 2rem;
  text-align: center;
  cursor: pointer;
  background: #fff;
  color: #64748b;
  font-size: 0.9rem;
  transition:
    border-color 0.15s,
    background 0.15s;
  margin-bottom: 0.75rem;
}

.upload-drop-zone:hover,
.upload-drop-zone--active {
  border-color: #22c55e;
  background: #f0fdf4;
  color: #1e293b;
}

.clear-row {
  display: flex;
  justify-content: center;
  margin-bottom: 0.75rem;
}

.upload-help-section {
  border-top: 1px solid #e2e8f0;
  padding-top: 0.75rem;
}

.btn-help-toggle {
  background: none;
  border: none;
  padding: 0;
  font-size: 0.85rem;
  color: #94a3b8;
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.btn-help-toggle:hover {
  color: #64748b;
}

.upload-help-content {
  margin-top: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.upload-help-body {
  font-size: 0.875rem;
  color: #475569;
  margin: 0;
  line-height: 1.6;
}

.upload-help-img {
  max-width: 100%;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
}
</style>
