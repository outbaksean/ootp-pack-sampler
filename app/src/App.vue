<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import CardUploader from "./components/CardUploader.vue";
import PackSelector from "./components/PackSelector.vue";
import PackResult from "./components/PackResult.vue";
import CalcDetailsModal from "./components/CalcDetailsModal.vue";
import { useCardStore } from "./stores/useCardStore";
import { PACK_DEFINITIONS } from "./models/PackType";
import { openPack, type DrawnCard } from "./helpers/PackSampler";

const cardStore = useCardStore();

const selectedPackKey = ref("standard");
const lastResult = ref<DrawnCard[]>([]);

const selectedPack = computed(
  () =>
    PACK_DEFINITIONS.find((p) => p.key === selectedPackKey.value) ??
    PACK_DEFINITIONS[0],
);

function handleOpenPack() {
  lastResult.value = openPack(selectedPack.value, cardStore.cardsByTierAndType);
}

const moonSvgUrl = "/ootp-missions-27/moon.svg";
const exportHelpImgUrl = "/ootp-missions-27/OotpExportShopCards.jpg";

const calcDetailsOpen = ref(false);

// Sidebar
const SIDEBAR_COLLAPSED_KEY = "ootp-pack-sampler-sidebar-collapsed";
const isSidebarCollapsed = ref(
  localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === "true",
);
const isMobile = ref(window.innerWidth < 768);

function toggleSidebar() {
  isSidebarCollapsed.value = !isSidebarCollapsed.value;
  localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(isSidebarCollapsed.value));
}

function onWindowResize() {
  const wasDesktop = !isMobile.value;
  isMobile.value = window.innerWidth < 768;
  if (isMobile.value && wasDesktop && !isSidebarCollapsed.value) {
    isSidebarCollapsed.value = true;
  }
}

onMounted(() => {
  window.addEventListener("resize", onWindowResize);
  if (isMobile.value && localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === null) {
    isSidebarCollapsed.value = true;
  }
});
onUnmounted(() => window.removeEventListener("resize", onWindowResize));

// Drop zone
const showDropZone = computed(
  () => cardStore.isDefaultData && !dropZoneDismissed.value,
);
const dropZoneDismissed = ref(false);
const dropZoneDragging = ref(false);
const dropZoneHelpExpanded = ref(false);
const dropZoneFileInput = ref<HTMLInputElement | null>(null);
let dropZoneDragCounter = 0;

function onDropZoneDragEnter() {
  dropZoneDragCounter++;
  dropZoneDragging.value = true;
}

function onDropZoneDragLeave() {
  if (--dropZoneDragCounter === 0) dropZoneDragging.value = false;
}

async function onDropZoneDrop(e: DragEvent) {
  dropZoneDragCounter = 0;
  dropZoneDragging.value = false;
  const file = e.dataTransfer?.files[0];
  if (file) await cardStore.uploadShopFile(file);
}

async function handleDropZoneFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (file) await cardStore.uploadShopFile(file);
}
</script>

<template>
  <nav class="app-nav">
    <a href="https://cratervar.com" class="home-link">
      <img :src="moonSvgUrl" alt="cratervar" class="home-icon" />
      cratervar.com
    </a>
    <span class="app-title">OOTP Pack Sampler</span>
  </nav>

  <div class="disclaimer-banner">
    Pack odds are based on my best understanding and are not confirmed by the
    developers.
    <button class="banner-link" @click="calcDetailsOpen = true">
      Calculation Details
    </button>
  </div>

  <CalcDetailsModal v-if="calcDetailsOpen" @close="calcDetailsOpen = false" />

  <div class="app-layout">
    <aside
      class="sidebar"
      :class="{ 'sidebar--collapsed': isSidebarCollapsed }"
    >
      <CardUploader />

      <div class="sidebar-section">
        <PackSelector v-model="selectedPackKey" />
      </div>

      <div class="sidebar-section">
        <button class="open-btn" @click="handleOpenPack">
          Open {{ selectedPack.label }} Pack
        </button>
      </div>

      <div class="sidebar-spacer" />
    </aside>

    <div
      v-if="isMobile && !isSidebarCollapsed"
      class="sidebar-backdrop"
      @click="toggleSidebar"
    />

    <button
      class="sidebar-toggle"
      :class="{ 'sidebar-toggle--collapsed': isSidebarCollapsed }"
      @click="toggleSidebar"
    />

    <div class="main-area">
      <template v-if="showDropZone">
        <input
          type="file"
          ref="dropZoneFileInput"
          class="drop-zone-input"
          @change="handleDropZoneFileChange"
        />
        <div
          class="main-drop-zone"
          :class="{ 'main-drop-zone--active': dropZoneDragging }"
          @dragenter.prevent="onDropZoneDragEnter"
          @dragover.prevent
          @dragleave="onDropZoneDragLeave"
          @drop.prevent="onDropZoneDrop"
          @click="dropZoneFileInput?.click()"
        >
          <p class="drop-zone-heading">Drop your card export CSV here</p>
          <p class="drop-zone-sub">or click to browse</p>
        </div>
        <div class="drop-zone-footer">
          <button
            class="btn-drop-link"
            type="button"
            @click="dropZoneHelpExpanded = !dropZoneHelpExpanded"
          >
            {{
              dropZoneHelpExpanded ? "Hide instructions" : "Show instructions"
            }}
          </button>
          <button
            class="btn-drop-link"
            type="button"
            @click="dropZoneDismissed = true"
          >
            Skip for now
          </button>
        </div>
        <div v-if="dropZoneHelpExpanded" class="drop-zone-help">
          <p class="help-body">
            To get the latest price data, from the card shop with no filters on,
            click Export Card List to CSV.
          </p>
          <img
            :src="exportHelpImgUrl"
            alt="Shop Cards Export Help"
            class="help-img"
          />
        </div>
      </template>

      <PackResult :cards="lastResult" />
    </div>
  </div>

  <footer class="app-footer">
    Open source:
    <a href="https://github.com/outbaksean/ootp-pack-sampler" target="_blank">
      github.com/outbaksean/ootp-pack-sampler
    </a>
  </footer>
</template>

<style scoped>
.app-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.55rem 1.25rem;
  border-bottom: 1px solid #e2e8f0;
  background: #fff;
  flex-shrink: 0;
}

.home-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #1e293b;
  font-weight: 500;
  text-decoration: none;
}

.home-icon {
  width: 16px;
  height: 16px;
}

.app-title {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--text-muted);
}

/* ── Disclaimer banner ── */
.disclaimer-banner {
  padding: 0.5rem 1.25rem;
  background: #fffbeb;
  border-bottom: 1px solid #fde68a;
  font-size: 0.82rem;
  color: #92400e;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  flex-shrink: 0;
}

.banner-link {
  background: none;
  border: none;
  padding: 0;
  font-size: 0.82rem;
  color: #92400e;
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 2px;
  font-weight: 600;
}

.banner-link:hover {
  color: #78350f;
}

/* ── App layout ── */
.app-layout {
  flex: 1;
  display: flex;
  min-height: 0;
  overflow: hidden;
}

/* ── Sidebar ── */
.sidebar {
  width: 240px;
  flex-shrink: 0;
  background: var(--sidebar-bg);
  color: var(--sidebar-text);
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  transition: width 0.2s ease;
}

.sidebar--collapsed {
  width: 0;
  overflow: hidden;
}

.sidebar-section {
  padding: 0.5rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.sidebar-spacer {
  flex: 1;
}

/* ── Sidebar toggle ── */
.sidebar-toggle {
  width: 14px;
  flex-shrink: 0;
  background: var(--sidebar-bg);
  border: none;
  border-right: 1px solid var(--sidebar-border);
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
}

.sidebar-toggle:hover {
  background: color-mix(in srgb, var(--sidebar-bg) 80%, white);
}

.sidebar-toggle::before {
  content: "";
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
  border-right: 5px solid #64748b;
  transition: transform 0.2s ease;
}

.sidebar-toggle--collapsed::before {
  transform: rotate(180deg);
}

/* ── Sidebar backdrop (mobile) ── */
.sidebar-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: 149;
}

/* ── Open Pack button ── */
.open-btn {
  background: rgba(34, 197, 94, 0.15);
  color: #86efac;
  border: 1px solid #4ade80;
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 0.83rem;
  font-weight: 500;
  cursor: pointer;
  width: 100%;
  transition:
    background 0.15s,
    color 0.15s;
}

.open-btn:hover {
  background: rgba(34, 197, 94, 0.25);
  color: #bbf7d0;
}

/* ── Main area ── */
.main-area {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  background: #f1f5f9;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* ── Drop zone ── */
.drop-zone-input {
  display: none;
}

.main-drop-zone {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 3rem 2rem;
  background: #fff;
  border: 2px dashed #cbd5e1;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  transition:
    border-color 0.15s,
    background 0.15s;
}

.main-drop-zone:hover,
.main-drop-zone--active {
  border-color: #22c55e;
  background: #f0fdf4;
}

.drop-zone-heading {
  font-size: 1.05rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.drop-zone-sub {
  font-size: 0.9rem;
  color: #64748b;
  margin: 0;
}

.drop-zone-footer {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  padding: 0.5rem 0 0;
}

.btn-drop-link {
  background: none;
  border: none;
  padding: 0;
  font-size: 0.85rem;
  color: #64748b;
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.btn-drop-link:hover {
  color: #475569;
}

.drop-zone-help {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.help-body {
  font-size: 0.875rem;
  color: #475569;
  margin: 0;
  line-height: 1.6;
}

.help-img {
  max-width: 100%;
  border-radius: 4px;
  border: 1px solid #e2e8f0;
}

/* ── Footer ── */
.app-footer {
  flex-shrink: 0;
  padding: 9px 20px;
  text-align: center;
  font-size: 0.82rem;
  color: #64748b;
  border-top: 1px solid #e2e8f0;
  background: #fff;
}

.app-footer a {
  color: #22c55e;
  text-decoration: none;
}

.app-footer a:hover {
  text-decoration: underline;
}

/* ── Mobile ── */
@media (max-width: 767px) {
  .app-layout {
    position: relative;
  }

  .sidebar {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: min(300px, 82vw);
    z-index: 200;
    transform: translateX(0);
    transition: transform 0.25s ease;
    padding-left: 36px;
  }

  .sidebar--collapsed {
    width: min(300px, 82vw);
    overflow: hidden;
    transform: translateX(-100%);
  }

  .sidebar-toggle {
    position: relative;
    z-index: 201;
    width: 36px;
  }
}
</style>
