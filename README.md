# OOTP Pack Sampler

A pack opening simulator for OOTP Baseball's Perfect Team mode. Simulates pulling cards from any pack type and shows expected value per pack based on current market prices.

Live at [cratervar.com/ootp-pack-sampler](https://cratervar.com/ootp-pack-sampler/)

## Features

- Simulate opening any pack type (Standard, Silver, Gold, Diamond, Perfect, Rainbow, Historical variants, and full-tier packs)
- Shows expected value for each pack type based on your card data
- Upload your own card export CSV from the OOTP client for live price data, or use the built-in default data
- Drop zone on the main page for quick CSV upload

## Pack odds disclaimer

Pack odds are based on my best understanding of the game and may be completely wrong. See the Calculation Details link in the app for a full explanation of how pack output and expected value are calculated.

## Card data

Export your card data from the OOTP card shop with no filters applied using Export Card List to CSV. Drop the file onto the app or use the Upload button. Without your own data, the app uses a recent snapshot of card prices.

## Development

```bash
cd app
npm install
npm run dev       # Dev server at http://localhost:5174/ootp-pack-sampler/
npm run build     # Type-check + build to app/dist/
npm run lint
npm run format
npm run type-check
```

The ootp-missions-27 app must also be running locally (on port 5173) for the default card data proxy to work in development.

## Tech stack

Vue 3 + TypeScript + Vite + Pinia + Dexie (IndexedDB) + PapaParse + Bootstrap 5
