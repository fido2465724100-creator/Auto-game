export interface VehicleComponentOption {
  id: string;
  category: 'chassis' | 'engine' | 'brakes' | 'comfort' | 'package';
  name: string;
  statModifiers: {
    reliability?: number;
    comfort?: number;
    performance?: number;
    efficiency?: number;
    prestige?: number;
    complexity?: number;
  };
  costModifier: number;
  requiredTechnologyId?: string;
}

export const vehicleComponentSeed: VehicleComponentOption[] = [
  {
    id: 'ladder-frame',
    category: 'chassis',
    name: 'Ladder Frame',
    statModifiers: { reliability: 3, complexity: 2 },
    costModifier: 0,
  },
  {
    id: 'touring-frame',
    category: 'chassis',
    name: 'Touring Frame',
    statModifiers: { comfort: 2, prestige: 1, complexity: 1 },
    costModifier: 150,
  },
  {
    id: 'single-cylinder',
    category: 'engine',
    name: 'Single-Cylinder Engine',
    statModifiers: { efficiency: 2, performance: -1, reliability: 1 },
    costModifier: 0,
  },
  {
    id: 'inline-four',
    category: 'engine',
    name: 'Inline-Four Engine',
    statModifiers: { performance: 3, complexity: 2 },
    costModifier: 250,
  },
  {
    id: 'drum-brakes',
    category: 'brakes',
    name: 'Drum Brakes',
    statModifiers: { reliability: 2 },
    costModifier: 100,
  },
  {
    id: 'basic-cabin',
    category: 'comfort',
    name: 'Basic Cabin',
    statModifiers: { comfort: 1 },
    costModifier: 50,
  },
  {
    id: 'weather-package',
    category: 'package',
    name: 'Weather Package',
    statModifiers: { comfort: 1, prestige: 1 },
    costModifier: 80,
    requiredTechnologyId: 'windshield-wipers',
  },
];
