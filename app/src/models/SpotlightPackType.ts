export interface SpotlightCard {
  cardId: number;
  weight: number;
}

export interface SpotlightPackDefinition {
  key: string;
  label: string;
  cards: SpotlightCard[];
}

export const SPOTLIGHT_PACK_DEFINITIONS: SpotlightPackDefinition[] = [
  {
    key: "spotlight1",
    label: "Spotlight #1",
    cards: [
      // weight 1 (card value 100)
      { cardId: 84789, weight: 1 }, // Baseball Reference 1 CL Jonathan Papelbon BOS 2007
      { cardId: 84634, weight: 1 }, // FLF 1 - Future Legend C Samuel Basallo BAL 2026
      { cardId: 84637, weight: 1 }, // FLF 2 - Future Legend 3B Kevin McGonigle DET 2026
      { cardId: 84630, weight: 1 }, // FLF 2 - Future Legend SP Bubba Chandler PIT 2026
      { cardId: 84782, weight: 1 }, // Future Legend SP Andrew Painter PHI 2026
      { cardId: 84625, weight: 1 }, // Future Legend SS Konnor Griffin PIT 2026
      { cardId: 84087, weight: 1 }, // Opening Day Heroes - Historical All-Star SP Camilo Pascual WS1 1960
      { cardId: 84663, weight: 1 }, // Opening Day Heroes - Snapshot LF Jimmy Sheckard BRO 1901
      // weight 2 (card values 91-99)
      { cardId: 84674, weight: 2 }, // FLF 2 - Future Legend RF Chase DeLauter CLE 2026
      { cardId: 84659, weight: 2 }, // Opening Day Heroes - Historical All-Star SP Mel Harder CLE 1935
      { cardId: 84725, weight: 2 }, // FLF 3 - Future Legend CF Max Clark DET 2026
      { cardId: 84801, weight: 2 }, // Baseball Reference 1 SP Jesse Petty BRO 1926
      { cardId: 84632, weight: 2 }, // FLF 1 - Future Legend 1B Bryce Eldridge SF 2026
      { cardId: 84649, weight: 2 }, // Future Legend 3B Sal Stewart CIN 2026
      { cardId: 84633, weight: 2 }, // FLF 2 - Future Legend 2B J.J. Wetherholt STL 2026
      { cardId: 84638, weight: 2 }, // FLF 2 - Future Legend SP Connelly Early BOS 2026
      { cardId: 83867, weight: 2 }, // Baseball Reference 1 SP Shane Bieber CLE 2021
      { cardId: 84813, weight: 2 }, // Baseball Reference 1 CL Kazuhiro Sasaki SEA 2001
      { cardId: 84812, weight: 2 }, // In Memoriam - Super Utility 2B Davey Lopes LAD Peak
      { cardId: 84792, weight: 2 }, // Baseball Reference 1 C Jason Kendall PIT 1998
      // weight 3 (card values 81-89)
      { cardId: 84644, weight: 3 }, // Future Legend C Carter Jensen KC 2026
      { cardId: 84662, weight: 3 }, // Opening Day Heroes - Snapshot LF Brant Alyea MIN 1970
      { cardId: 84631, weight: 3 }, // Future Legend SP Brandon Sproat MIL 2026
      { cardId: 84660, weight: 3 }, // Opening Day Heroes - Snapshot SP Madison Bumgarner SF 2017
      { cardId: 84790, weight: 3 }, // Baseball Reference 1 1B Tino Martinez NYY 1997
      { cardId: 84636, weight: 3 }, // FLF 1 - Future Legend SP Rhett Lowder CIN 2026
      { cardId: 84635, weight: 3 }, // Future Legend SS Carson Williams TB 2026
      { cardId: 84796, weight: 3 }, // Baseball Reference 1 LF Bob Fothergill DET 1927
      { cardId: 84831, weight: 3 }, // Baseball Reference 1 C Devin Mesoraco CIN 2014
      { cardId: 84665, weight: 3 }, // Opening Day Heroes - Snapshot SP Brad Radke MIN 2001
      { cardId: 84661, weight: 3 }, // Opening Day Heroes - Snapshot CF Tuffy Rhodes CHC 1994
    ],
  },
];
