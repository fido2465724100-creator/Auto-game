import type { VehicleComponentOption } from '@ait/shared-types';

export const vehicleComponentSeed: VehicleComponentOption[] = [
  // --- CHASSIS ---
  {
    id: 'ladder-frame',
    category: 'chassis',
    name: 'Лестничная рама (базовая)',
    statModifiers: { reliability: 4, complexity: 2 },
    costModifier: 0,
  },
  {
    id: 'touring-frame',
    category: 'chassis',
    name: 'Туринговая лонжеронная рама',
    statModifiers: { comfort: 5, prestige: 3, complexity: 3 },
    costModifier: 150,
  },
  {
    id: 'reinforced-suspension-frame',
    category: 'chassis',
    name: 'Рама с усиленной рессорной подвеской',
    statModifiers: { comfort: 8, reliability: 6, prestige: 5, complexity: 5 },
    costModifier: 280,
    requiredTechnologyId: 'improved-suspension',
  },

  // --- ENGINES ---
  {
    id: 'single-cylinder',
    category: 'engine',
    name: 'Одноцилиндровый двигатель (6 л.с.)',
    statModifiers: { efficiency: 6, performance: 2, reliability: 3, complexity: 1 },
    costModifier: 0,
  },
  {
    id: 'inline-four',
    category: 'engine',
    name: 'Рядный четырехцилиндровый мотор (20 л.с.)',
    statModifiers: { performance: 12, efficiency: 4, prestige: 4, complexity: 4 },
    costModifier: 250,
    requiredTechnologyId: 'carburetor-improvement',
  },
  {
    id: 'electric-start-v4',
    category: 'engine',
    name: 'Мотор V4 с электростартером (35 л.с.)',
    statModifiers: { performance: 18, comfort: 6, prestige: 10, complexity: 7 },
    costModifier: 420,
    requiredTechnologyId: 'electric-starter',
  },

  // --- BRAKES ---
  {
    id: 'band-brakes',
    category: 'brakes',
    name: 'Механические ленточные тормоза',
    statModifiers: { reliability: 2, complexity: 1 },
    costModifier: 0,
  },
  {
    id: 'drum-brakes',
    category: 'brakes',
    name: 'Усиленные барабанные тормоза',
    statModifiers: { reliability: 6, performance: 2, complexity: 2 },
    costModifier: 120,
    requiredTechnologyId: 'mechanical-brake-upgrade',
  },
  {
    id: 'hydraulic-prototype-brakes',
    category: 'brakes',
    name: 'Прототип гидравлических тормозов',
    statModifiers: { reliability: 12, performance: 5, comfort: 4, complexity: 6 },
    costModifier: 300,
    requiredTechnologyId: 'hydraulic-braking-concepts',
  },

  // --- COMFORT / CABIN ---
  {
    id: 'open-runabout',
    category: 'comfort',
    name: 'Открытый кузов «Ранэбаут»',
    statModifiers: { efficiency: 3, complexity: 1 },
    costModifier: 0,
  },
  {
    id: 'basic-cabin',
    category: 'comfort',
    name: 'Деревянная каретная кабина',
    statModifiers: { comfort: 4, prestige: 2, complexity: 2 },
    costModifier: 60,
  },
  {
    id: 'enclosed-limousine-cabin',
    category: 'comfort',
    name: 'Закрытый кузов «Лимузин»',
    statModifiers: { comfort: 14, prestige: 16, complexity: 6 },
    costModifier: 320,
  },

  // --- PACKAGES ---
  {
    id: 'package-none',
    category: 'package',
    name: 'Базовая комплектация (без пакета)',
    statModifiers: {},
    costModifier: 0,
  },
  {
    id: 'weather-package',
    category: 'package',
    name: 'Всепогодный пакет (дворники и тент)',
    statModifiers: { comfort: 4, prestige: 3, reliability: 3 },
    costModifier: 90,
    requiredTechnologyId: 'windshield-wipers',
  },
  {
    id: 'touring-rally-kit',
    category: 'package',
    name: 'Туристический комплект надежности',
    statModifiers: { performance: 4, reliability: 5, prestige: 4 },
    costModifier: 140,
    requiredTechnologyId: 'standardized-steering-wheel',
  },
];
