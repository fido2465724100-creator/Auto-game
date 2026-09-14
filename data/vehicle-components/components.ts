import type { VehicleComponentOption } from '@ait/shared-types';

export const vehicleComponentSeed: VehicleComponentOption[] = [
  // --- CHASSIS ---
  {
    id: 'ladder-frame',
    category: 'chassis',
    name: 'Ladder Frame',
    statModifiers: { reliability: 4, complexity: 2 },
    costModifier: 0,
  },
  {
    id: 'touring-frame',
    category: 'chassis',
    name: 'Touring Frame',
    statModifiers: { comfort: 5, prestige: 3, complexity: 3 },
    costModifier: 150,
  },
  {
    id: 'reinforced-suspension-frame',
    category: 'chassis',
    name: 'Reinforced Suspension Frame',
    statModifiers: { comfort: 8, reliability: 6, prestige: 5, complexity: 5 },
    costModifier: 280,
    requiredTechnologyId: 'improved-suspension',
  },

  // --- ENGINES ---
  {
    id: 'single-cylinder',
    category: 'engine',
    name: 'Single-Cylinder (6 HP)',
    statModifiers: { efficiency: 6, performance: 2, reliability: 3, complexity: 1 },
    costModifier: 0,
  },
  {
    id: 'inline-four',
    category: 'engine',
    name: 'Inline-Four Engine (20 HP)',
    statModifiers: { performance: 12, efficiency: 4, prestige: 4, complexity: 4 },
    costModifier: 250,
    requiredTechnologyId: 'carburetor-improvement',
  },
  {
    id: 'electric-start-v4',
    category: 'engine',
    name: 'Electric-Start V4 (35 HP)',
    statModifiers: { performance: 18, comfort: 6, prestige: 10, complexity: 7 },
    costModifier: 420,
    requiredTechnologyId: 'electric-starter',
  },

  // --- BRAKES ---
  {
    id: 'band-brakes',
    category: 'brakes',
    name: 'Mechanical Band Brakes',
    statModifiers: { reliability: 2, complexity: 1 },
    costModifier: 0,
  },
  {
    id: 'drum-brakes',
    category: 'brakes',
    name: 'Reinforced Drum Brakes',
    statModifiers: { reliability: 6, performance: 2, complexity: 2 },
    costModifier: 120,
    requiredTechnologyId: 'mechanical-brake-upgrade',
  },
  {
    id: 'hydraulic-prototype-brakes',
    category: 'brakes',
    name: 'Hydraulic Prototype Brakes',
    statModifiers: { reliability: 12, performance: 5, comfort: 4, complexity: 6 },
    costModifier: 300,
    requiredTechnologyId: 'hydraulic-braking-concepts',
  },

  // --- COMFORT / CABIN ---
  {
    id: 'open-runabout',
    category: 'comfort',
    name: 'Open Runabout Body',
    statModifiers: { efficiency: 3, complexity: 1 },
    costModifier: 0,
  },
  {
    id: 'basic-cabin',
    category: 'comfort',
    name: 'Basic Wooden Cabin',
    statModifiers: { comfort: 4, prestige: 2, complexity: 2 },
    costModifier: 60,
  },
  {
    id: 'enclosed-limousine-cabin',
    category: 'comfort',
    name: 'Enclosed Luxury Cabin',
    statModifiers: { comfort: 14, prestige: 16, complexity: 6 },
    costModifier: 320,
  },

  // --- PACKAGES ---
  {
    id: 'package-none',
    category: 'package',
    name: 'Standard (No Extra Package)',
    statModifiers: {},
    costModifier: 0,
  },
  {
    id: 'weather-package',
    category: 'package',
    name: 'All-Weather Package (Wipers & Hood)',
    statModifiers: { comfort: 4, prestige: 3, reliability: 3 },
    costModifier: 90,
    requiredTechnologyId: 'windshield-wipers',
  },
  {
    id: 'touring-rally-kit',
    category: 'package',
    name: 'Touring & Endurance Kit',
    statModifiers: { performance: 4, reliability: 5, prestige: 4 },
    costModifier: 140,
    requiredTechnologyId: 'standardized-steering-wheel',
  },
];
