<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-box">
      <div class="modal-header">
        <span class="modal-title">Calculation Details</span>
        <button class="modal-close" @click="$emit('close')">Close</button>
      </div>
      <div class="modal-body">
        <section>
          <h3>Tier Classification</h3>
          <p>
            Each card is assigned a tier based on its Card Value (overall
            rating) from the exported CSV:
          </p>
          <table class="detail-table">
            <thead>
              <tr>
                <th>Tier</th>
                <th>Card Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Perfect</td>
                <td>100+</td>
              </tr>
              <tr>
                <td>Diamond</td>
                <td>90 - 99</td>
              </tr>
              <tr>
                <td>Gold</td>
                <td>80 - 89</td>
              </tr>
              <tr>
                <td>Silver</td>
                <td>70 - 79</td>
              </tr>
              <tr>
                <td>Bronze</td>
                <td>60 - 69</td>
              </tr>
              <tr>
                <td>Iron</td>
                <td>below 60</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section>
          <h3>Random Slot Odds</h3>
          <p>
            When a slot has no guaranteed tier, a tier is drawn using these
            assumed probabilities:
          </p>
          <table class="detail-table">
            <thead>
              <tr>
                <th>Tier</th>
                <th>Probability</th>
                <th>1 in N</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Iron</td>
                <td>~67.2%</td>
                <td>~1 in 1.5</td>
              </tr>
              <tr>
                <td>Bronze</td>
                <td>20%</td>
                <td>1 in 5</td>
              </tr>
              <tr>
                <td>Silver</td>
                <td>10%</td>
                <td>1 in 10</td>
              </tr>
              <tr>
                <td>Gold</td>
                <td>2%</td>
                <td>1 in 50</td>
              </tr>
              <tr>
                <td>Diamond</td>
                <td>~0.67%</td>
                <td>1 in 150</td>
              </tr>
              <tr>
                <td>Perfect</td>
                <td>0.1%</td>
                <td>1 in 1,000</td>
              </tr>
            </tbody>
          </table>
          <p class="note">
            These odds are based on my best understanding of the game and and
            may be incorrect.
          </p>
        </section>

        <section>
          <h3>Live vs. Historical</h3>
          <p>
            Each card slot draws from either the live or historical card pool.
            For standard packs, each slot independently has a 55% chance of
            being live and 45% chance of being historical. Historical packs
            always draw from the historical pool. Once the pool is determined, a
            card is selected at random from all eligible cards in that tier and
            pool.
          </p>
        </section>

        <section>
          <h3>Guaranteed Slots</h3>
          <p>
            Each pack has 6 slots. Packs with a guaranteed tier (e.g. Gold Pack)
            draw exactly that tier for one slot - not "at least" that tier. The
            remaining slots are random. Rainbow packs have all 6 slots
            guaranteed: one of each tier.
          </p>
        </section>

        <section>
          <h3>Expected Value</h3>
          <p>
            EV is the sum of each slot's expected value, using the last-10-sale
            price from your uploaded CSV.
          </p>
          <p>
            For a guaranteed tier slot, the slot EV is the average L10 price of
            all cards in that tier, weighted 55% live / 45% historical (or 100%
            historical for historical packs).
          </p>
          <p>
            For a random slot, each tier's average L10 price is multiplied by
            its draw probability, then summed across all tiers.
          </p>
          <p class="note">
            EV does not account for pack cost or the actual value of cards you
            already own. Cards with no last-10-sale price are excluded from tier
            averages, which causes EVs to be slightly understated.
          </p>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineEmits<{ close: [] }>();
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-box {
  background: #fff;
  border-radius: 10px;
  width: 100%;
  max-width: 520px;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.85rem 1.25rem;
  border-bottom: 1px solid #e2e8f0;
  flex-shrink: 0;
}

.modal-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: #1e293b;
}

.modal-close {
  background: none;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  padding: 3px 10px;
  font-size: 0.8rem;
  color: #64748b;
  cursor: pointer;
}

.modal-close:hover {
  background: #f1f5f9;
}

.modal-body {
  overflow-y: auto;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

h3 {
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #64748b;
  margin: 0;
}

p {
  font-size: 0.875rem;
  color: #334155;
  margin: 0;
  line-height: 1.6;
}

.note {
  font-size: 0.8rem;
  color: #94a3b8;
  font-style: italic;
}

.detail-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.82rem;
}

.detail-table th {
  text-align: left;
  padding: 0.3rem 0.75rem;
  font-size: 0.72rem;
  font-weight: 600;
  color: #64748b;
  border-bottom: 1px solid #e2e8f0;
  background: #f8fafc;
}

.detail-table td {
  padding: 0.3rem 0.75rem;
  color: #1e293b;
  border-bottom: 1px solid #f1f5f9;
}

.detail-table tbody tr:last-child td {
  border-bottom: none;
}
</style>
