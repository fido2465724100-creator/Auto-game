import type { HistoricalEvent } from '@ait/shared-types';

export const eventsSeed: HistoricalEvent[] = [
  {
    id: 'post-horse-transition',
    name: 'Urban Shift From Horse Carriages',
    startYear: 1903,
    startMonth: 1,
    endYear: 1909,
    endMonth: 12,
    affectedRegions: ['north-america', 'europe'],
    description: 'Cities become more open to automotive transport.',
    modifiers: [{ key: 'demandMultiplier', value: 1.08 }],
  },
  {
    id: 'ww1',
    name: 'World War I',
    startYear: 1914,
    startMonth: 7,
    endYear: 1918,
    endMonth: 11,
    affectedRegions: ['europe', 'middle-east'],
    description: 'Civilian demand drops and logistics become unstable.',
    modifiers: [{ key: 'demandMultiplier', value: 0.78 }],
  },
];
