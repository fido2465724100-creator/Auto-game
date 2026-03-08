import type { Region } from '@ait/shared-types';

export const regionsSeed: Region[] = [
  {
    id: 'north-america',
    name: 'North America',
    marketSize: 1200,
    incomeLevel: 0.7,
    infrastructureLevel: 0.65,
    priceSensitivity: 0.55,
    prestigeSensitivity: 0.45,
    economySensitivity: 0.6,
    preferenceWeights: {
      comfort: 0.2,
      efficiency: 0.25,
      performance: 0.2,
      prestige: 0.15,
    },
  },
  {
    id: 'europe',
    name: 'Europe',
    marketSize: 980,
    incomeLevel: 0.6,
    infrastructureLevel: 0.58,
    priceSensitivity: 0.62,
    prestigeSensitivity: 0.35,
    economySensitivity: 0.68,
    preferenceWeights: {
      comfort: 0.18,
      efficiency: 0.28,
      performance: 0.17,
      prestige: 0.12,
    },
  },
  {
    id: 'middle-east',
    name: 'Middle East',
    marketSize: 420,
    incomeLevel: 0.45,
    infrastructureLevel: 0.4,
    priceSensitivity: 0.7,
    prestigeSensitivity: 0.2,
    economySensitivity: 0.75,
    preferenceWeights: {
      comfort: 0.15,
      efficiency: 0.22,
      performance: 0.14,
      prestige: 0.1,
    },
  },
];
