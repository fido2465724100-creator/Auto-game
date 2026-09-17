import type {
  EndTurnInput,
  EndTurnOutput,
  GameDate,
  HistoricalEvent,
  MonthlyReport,
  Region,
  RegionId,
  Technology,
  VehicleModel,
  VehicleSegment,
  VehicleComponents,
  VehicleStats,
  VehicleComponentOption,
  BankLoan,
  LoanTemplate,
  MaterialType,
  MaterialMarketItem,
  FactoryInfo,
  FounderPerk,
  Competitor,
  CompetitorMilestone,
  GlobalManufacturerRanking,
} from '@ait/shared-types';

export const MATERIALS_CATALOG: MaterialMarketItem[] = [
  {
    id: 'steel',
    name: 'Сталь и Чугун',
    basePrice: 2,
    unit: 'кг',
    yearAvailable: 1900,
    description: 'Основной металл для блоков цилиндров, рам, рессор и мостов.',
  },
  {
    id: 'wood',
    name: 'Конструкционная древесина',
    basePrice: 1,
    unit: 'ед.',
    yearAvailable: 1900,
    description: 'Критически важный материал эпохи 1900–1920: каретные кузова, спицы колес, щитки.',
  },
  {
    id: 'rubber',
    name: 'Натуральный каучук',
    basePrice: 3,
    unit: 'кг',
    yearAvailable: 1900,
    description: 'Колониальный каучук для ранних сплошных и пневматических шин, сальников и ремней.',
  },
  {
    id: 'leather',
    name: 'Кожа и Обивочный текстиль',
    basePrice: 4,
    unit: 'м²',
    yearAvailable: 1900,
    description: 'Материал отделки открытых диванов экипажа и складных брезентово-кожаных крыш.',
  },
  {
    id: 'aluminum',
    name: 'Алюминий и Сплавы',
    basePrice: 5,
    unit: 'кг',
    yearAvailable: 1915,
    description: 'Легкий и прочный металл. Снижает вес авто и повышает скоростные качества.',
  },
  {
    id: 'plastic',
    name: 'Полимеры и Пластик',
    basePrice: 2,
    unit: 'кг',
    yearAvailable: 1950,
    description: 'Инновация 1950-х годов: удешевляет интерьер, заменяет дерево и тяжелые панели.',
  },
];

export function calculateMaterialRequirements(
  segment: VehicleSegment,
  selectedComponents: Partial<VehicleComponents>,
  year: number = 1900,
  founderPerk?: FounderPerk
): Record<MaterialType, number> {
  const base: Record<VehicleSegment, Record<MaterialType, number>> = {
    economy: { steel: 40, wood: 50, rubber: 12, leather: 5, aluminum: 0, plastic: 0 },
    family: { steel: 70, wood: 65, rubber: 16, leather: 12, aluminum: 0, plastic: 0 },
    luxury: { steel: 110, wood: 90, rubber: 22, leather: 30, aluminum: 0, plastic: 0 },
    utility: { steel: 90, wood: 80, rubber: 18, leather: 6, aluminum: 0, plastic: 0 },
  };

  const req: Record<MaterialType, number> = { ...(base[segment] ?? base.economy) };

  if (selectedComponents.comfort === 'luxury-cabin') {
    req.leather += 15;
    req.steel += 20;
    req.wood += 20;
  } else if (selectedComponents.comfort === 'wooden-cabin') {
    req.wood += 30;
  }

  if (selectedComponents.engine === 'v4-electric') {
    req.steel += 30;
    req.rubber += 4;
  } else if (selectedComponents.engine === 'inline-four') {
    req.steel += 15;
  }

  if (selectedComponents.chassis === 'touring-frame') {
    req.steel += 15;
    req.wood += 10;
  } else if (selectedComponents.chassis === 'reinforced-suspension') {
    req.steel += 25;
  }

  if (year >= 1950) {
    req.plastic = Math.round(req.wood * 0.7);
    req.wood = Math.round(req.wood * 0.1);
  }

  // Coachbuilder founder perk: 25% savings on wood and leather
  if (founderPerk === 'coachbuilder') {
    req.wood = Math.max(1, Math.round(req.wood * 0.75));
    req.leather = Math.max(1, Math.round(req.leather * 0.75));
  }

  return req;
}

export interface SegmentProfile {
  name: string;
  description: string;
  baseProductionCost: number;
  baseSalePrice: number;
  baseStats: VehicleStats;
  defaultRegionSuitability: Record<RegionId, number>;
}

export const SEGMENT_PROFILES: Record<VehicleSegment, SegmentProfile> = {
  economy: {
    name: 'Эконом (Ранэбаут)',
    description: 'Доступная и простая самоходная повозка для рабочих семей и малого достатка.',
    baseProductionCost: 450,
    baseSalePrice: 900,
    baseStats: {
      reliability: 40,
      comfort: 25,
      performance: 25,
      efficiency: 45,
      prestige: 15,
      complexity: 20,
    },
    defaultRegionSuitability: {
      'north-america': 0.85,
      europe: 0.80,
      'middle-east': 0.60,
    },
  },
  family: {
    name: 'Семейный (Турер)',
    description: 'Вместительный открытый фаэтон со сбалансированным комфортом и надежностью.',
    baseProductionCost: 700,
    baseSalePrice: 1400,
    baseStats: {
      reliability: 50,
      comfort: 45,
      performance: 35,
      efficiency: 35,
      prestige: 30,
      complexity: 30,
    },
    defaultRegionSuitability: {
      'north-america': 0.90,
      europe: 0.85,
      'middle-east': 0.50,
    },
  },
  luxury: {
    name: 'Люкс (Лимузин)',
    description: 'Эксклюзивный каретный экипаж высшего класса для престижа и знатных особ.',
    baseProductionCost: 1500,
    baseSalePrice: 3200,
    baseStats: {
      reliability: 45,
      comfort: 70,
      performance: 50,
      efficiency: 20,
      prestige: 75,
      complexity: 55,
    },
    defaultRegionSuitability: {
      'north-america': 0.70,
      europe: 0.95,
      'middle-east': 0.40,
    },
  },
  utility: {
    name: 'Грузовой / Развозной фургон',
    description: 'Тяговитое прочное шасси для доставки грузов, мастерских и сельского хозяйства.',
    baseProductionCost: 600,
    baseSalePrice: 1200,
    baseStats: {
      reliability: 60,
      comfort: 15,
      performance: 30,
      efficiency: 30,
      prestige: 10,
      complexity: 25,
    },
    defaultRegionSuitability: {
      'north-america': 0.95,
      europe: 0.65,
      'middle-east': 0.75,
    },
  },
};

export const LOAN_TEMPLATES: LoanTemplate[] = [
  {
    id: 'micro-credit',
    name: 'Краткосрочный овердрафт',
    description: 'Небольшой заем для экстренного покрытия кассового разрыва.',
    amount: 15_000,
    durationMonths: 6,
    interestRate: 0.02,
    monthlyPayment: 2680,
  },
  {
    id: 'commercial-expansion',
    name: 'Коммерческий заем на развитие',
    description: 'Среднесрочный кредит на закупку оборудования и наем инженеров.',
    amount: 50_000,
    durationMonths: 12,
    interestRate: 0.015,
    monthlyPayment: 4590,
  },
  {
    id: 'industrial-bond',
    name: 'Индустриальная облигация',
    description: 'Крупный заем для масштабного строительства и экспансии на рынки.',
    amount: 120_000,
    durationMonths: 24,
    interestRate: 0.012,
    monthlyPayment: 5790,
  },
];

export function calculateVehicleSpecs(
  segment: VehicleSegment,
  selectedComponents: VehicleComponents,
  allComponents: VehicleComponentOption[],
  year: number = 1900,
  founderPerk?: FounderPerk
): {
  stats: VehicleStats;
  productionCost: number;
  regionSuitability: Record<RegionId, number>;
  materialsRequired: Record<MaterialType, number>;
} {
  const profile = SEGMENT_PROFILES[segment] ?? SEGMENT_PROFILES.economy;
  const compMap = new Map(allComponents.map((c) => [c.id, c]));

  const stats: VehicleStats = { ...profile.baseStats };
  let extraCost = 0;

  for (const compId of Object.values(selectedComponents)) {
    if (!compId) continue;
    const comp = compMap.get(compId);
    if (!comp) continue;

    extraCost += comp.costModifier;
    if (comp.statModifiers.reliability) stats.reliability += comp.statModifiers.reliability;
    if (comp.statModifiers.comfort) stats.comfort += comp.statModifiers.comfort;
    if (comp.statModifiers.performance) stats.performance += comp.statModifiers.performance;
    if (comp.statModifiers.efficiency) stats.efficiency += comp.statModifiers.efficiency;
    if (comp.statModifiers.prestige) stats.prestige += comp.statModifiers.prestige;
    if (comp.statModifiers.complexity) stats.complexity += comp.statModifiers.complexity;
  }

  // Pre-1912 hand crank start penalty for internal combustion engines (dangerous and awkward)
  const engineComp = compMap.get(selectedComponents.engine);
  if (
    engineComp &&
    engineComp.powertrainType === 'ice' &&
    year < 1912 &&
    selectedComponents.engine !== 'v4-electric'
  ) {
    stats.comfort = Math.max(5, stats.comfort - 10);
  }

  // Founder perk bonuses
  if (founderPerk === 'mechanic') {
    stats.reliability = Math.round(stats.reliability * 1.15);
  } else if (founderPerk === 'coachbuilder') {
    stats.comfort = Math.round(stats.comfort * 1.15);
    stats.prestige = Math.round(stats.prestige * 1.15);
  }

  const clamp = (val: number) => Math.max(5, Math.min(100, val));
  stats.reliability = clamp(stats.reliability);
  stats.comfort = clamp(stats.comfort);
  stats.performance = clamp(stats.performance);
  stats.efficiency = clamp(stats.efficiency);
  stats.prestige = clamp(stats.prestige);
  stats.complexity = clamp(stats.complexity);

  const productionCost = profile.baseProductionCost + extraCost;
  const suitability: Record<RegionId, number> = { ...profile.defaultRegionSuitability };
  const materialsRequired = calculateMaterialRequirements(segment, selectedComponents, year, founderPerk);

  return {
    stats,
    productionCost,
    regionSuitability: suitability,
    materialsRequired,
  };
}

export function nextYear(date: GameDate): GameDate {
  return { year: date.year + 1, quarter: 1, month: 1 };
}

export function nextQuarter(date: GameDate): GameDate {
  const currentQ = date.quarter ?? (date.month ? (Math.ceil(date.month / 3) as 1 | 2 | 3 | 4) : 1);
  if (currentQ === 4) {
    return { year: date.year + 1, quarter: 1, month: 1 };
  }
  const nextQ = (currentQ + 1) as 1 | 2 | 3 | 4;
  return { year: date.year, quarter: nextQ, month: (nextQ - 1) * 3 + 1 };
}

export function nextMonth(date: GameDate): GameDate {
  if (date.month === 12) {
    return { year: date.year + 1, month: 1, quarter: 1 };
  }
  const nextM = (date.month ?? 1) + 1;
  return { year: date.year, month: nextM, quarter: Math.ceil(nextM / 3) as 1 | 2 | 3 | 4 };
}

function isEventActive(event: HistoricalEvent, date: GameDate): boolean {
  return date.year >= event.startYear && date.year <= event.endYear;
}

function getActiveEventMultiplier(events: HistoricalEvent[], regionId: RegionId, date: GameDate): number {
  return events
    .filter((event) => isEventActive(event, date) && event.affectedRegions.includes(regionId))
    .flatMap((event) => event.modifiers)
    .filter((modifier) => modifier.key === 'demandMultiplier')
    .reduce((acc, modifier) => acc * modifier.value, 1);
}

function techAppealBonus(unlockedTechIds: string[], technologies: Technology[]): number {
  const bonus = technologies
    .filter((tech) => unlockedTechIds.includes(tech.id))
    .flatMap((tech) => tech.effects)
    .filter((effect) => effect.key === 'appealBonus')
    .reduce((acc, effect) => acc + effect.value, 0);

  return 1 + bonus;
}

/**
 * Calculates quarterly rent for production premises and land.
 * In 1900, base rent is $100/quarter.
 * By 2020, base rent scales to $100,000/quarter (historical cost escalation).
 * Expanded factory levels scale rent proportionally with floor space.
 */
export function calculatePremisesRent(year: number, factoryLevel: number = 1): number {
  const yearsPast = Math.max(0, year - 1900);
  const r = Math.log(1000) / 120; // ln(1000)/120 ≈ 0.057564627
  const baseRent = 100 * Math.exp(r * yearsPast);
  const levelMultiplier = 1 + Math.max(0, factoryLevel - 1) * 0.2;
  return Math.round(baseRent * levelMultiplier);
}

/**
 * Returns demand factor based on vehicle model age (years since designYear).
 * Fresh (0-4 yrs): 1.0
 * Maturing (5-7 yrs): 0.95 -> 0.85
 * Outdated (8-12 yrs): 0.77 -> 0.45
 * Archaic (13-20 yrs): 0.40 -> 0.05
 * Obsolete (>20 yrs): 0.05
 */
export function getModelAgeFactor(modelAge: number): number {
  if (modelAge <= 4) {
    return 1.0;
  }
  if (modelAge <= 7) {
    return Math.max(0.7, 1.0 - (modelAge - 4) * 0.05);
  }
  if (modelAge <= 12) {
    return Math.max(0.3, 0.85 - (modelAge - 7) * 0.08);
  }
  if (modelAge <= 20) {
    return Math.max(0.05, 0.45 - (modelAge - 12) * 0.05);
  }
  return 0.05;
}

function simulateRegionDemand(
  model: VehicleModel,
  region: Region,
  reputation: number,
  eventMultiplier: number,
  appealBonus: number,
  year: number = 1900
): number {
  const weightedStats =
    model.stats.comfort * region.preferenceWeights.comfort +
    model.stats.efficiency * region.preferenceWeights.efficiency +
    model.stats.performance * region.preferenceWeights.performance +
    model.stats.prestige * region.preferenceWeights.prestige;

  const normalizedStats = Math.max(0.2, weightedStats / 100);

  // Price competitiveness compared to baseline segment price
  const basePrice = SEGMENT_PROFILES[model.targetSegment]?.baseSalePrice ?? 1000;
  const priceRatio = model.salePrice / (basePrice || 1);
  const priceFactor = priceRatio <= 1
    ? Math.min(1.35, 1 + (1 - priceRatio) * 0.7)
    : Math.max(0.1, 1 - (priceRatio - 1) * 1.1);

  const reputationFactor = 0.7 + reputation / 200;

  // Era scaling: pioneer automobile market in 1900-1905 is healthy enough to support early workshops
  const eraDemandFactor = Math.min(1.0, 0.35 + Math.max(0, year - 1900) * 0.02);

  // Model age decay: older designs lose consumer appeal against modern competitors
  const modelAge = Math.max(0, year - (model.designYear ?? 1900));
  const ageFactor = getModelAgeFactor(modelAge);

  const baseDemand = region.marketSize * normalizedStats * priceFactor * reputationFactor * appealBonus * eraDemandFactor * ageFactor;
  return Math.max(1, Math.floor(baseDemand * eventMultiplier));
}

export function runEndTurn(input: EndTurnInput): EndTurnOutput {
  const currentState = input.gameState;
  const newDate = nextYear(currentState.date);

  // Advance research by 12 months (annual step).
  // Mechanic perk: +3 extra months for engine and chassis technologies.
  const researchProgress = currentState.activeResearch.map((project) => {
    const tech = input.technologies.find((t) => t.id === project.technologyId);
    let monthsToAdd = 12;
    if (
      currentState.company.founderPerk === 'mechanic' &&
      tech &&
      (tech.category === 'engine' || tech.category === 'chassis')
    ) {
      monthsToAdd = 15;
    }
    const nextProgress = Math.min(project.totalMonths, project.progressMonths + monthsToAdd);
    return {
      ...project,
      progressMonths: nextProgress,
      isCompleted: nextProgress >= project.totalMonths,
    };
  });

  const completedTechIds = researchProgress
    .filter((project) => project.isCompleted)
    .map((project) => project.technologyId)
    .filter((techId) => !currentState.unlockedTechnologyIds.includes(techId));

  const unlockedTechnologyIds = [...currentState.unlockedTechnologyIds, ...completedTechIds];
  const activeResearch = researchProgress.filter((project) => !project.isCompleted);

  // Factory capacity & inventory setup (annual capacity)
  const factoryLevel = currentState.company.factory?.level ?? 1;
  const factoryCapacity = currentState.company.factory?.capacity ?? currentState.company.productionCapacity ?? 16;
  const factoryMonthlyOverhead = currentState.company.factory?.monthlyOverhead ?? 40;
  const annualOverhead = (currentState.company.overheadMonthly + factoryMonthlyOverhead) * 12;
  const annualRent = calculatePremisesRent(newDate.year, factoryLevel);

  const defaultInventory: Record<MaterialType, number> = {
    steel: 2000,
    wood: 2400,
    rubber: 600,
    leather: 320,
    aluminum: 80,
    plastic: 0,
  };

  const inventory: Record<MaterialType, number> = {
    ...defaultInventory,
    ...(currentState.company.inventoryMaterials ?? {}),
  };

  const totalPlannedProduction = Object.values(currentState.productionPlan).reduce((acc, units) => acc + units, 0);
  const targetProductionUnits = Math.min(totalPlannedProduction, factoryCapacity);

  // Proportional effective plan scaled to factory capacity
  const effectivePlan: Record<string, number> = {};
  const activeModels = currentState.vehicleModels.filter((item) => item.active);
  const plannedModels = activeModels.filter((item) => (currentState.productionPlan[item.id] ?? 0) > 0);

  if (totalPlannedProduction > 0 && plannedModels.length > 0) {
    const scale = targetProductionUnits / totalPlannedProduction;
    let allocatedSum = 0;
    for (let i = 0; i < plannedModels.length; i++) {
      const model = plannedModels[i];
      if (!model) continue;
      const rawPlanned = currentState.productionPlan[model.id] ?? 0;
      if (i === plannedModels.length - 1) {
        effectivePlan[model.id] = Math.max(0, targetProductionUnits - allocatedSum);
      } else {
        const alloc = Math.floor(rawPlanned * scale);
        effectivePlan[model.id] = alloc;
        allocatedSum += alloc;
      }
    }
  }

  // Calculate material demand for effective planned units
  const materialDemand: Record<MaterialType, number> = {
    steel: 0,
    wood: 0,
    rubber: 0,
    leather: 0,
    aluminum: 0,
    plastic: 0,
  };

  for (const model of plannedModels) {
    const planned = effectivePlan[model.id] ?? 0;
    if (planned <= 0) continue;
    const req =
      model.materialsRequired ??
      calculateMaterialRequirements(
        model.targetSegment,
        model.components,
        currentState.date.year,
        currentState.company.founderPerk
      );
    for (const mat of Object.keys(materialDemand) as MaterialType[]) {
      materialDemand[mat] += (req[mat] ?? 0) * planned;
    }
  }

  let materialProcurementCost = 0;
  let currentCash = currentState.company.cash;

  // Merchant perk: 15% wholesale discount on materials
  const materialPriceMultiplier = currentState.company.founderPerk === 'merchant' ? 0.85 : 1.0;

  // Auto-procurement if enabled
  if (currentState.company.autoProcurement) {
    let totalShortageCost = 0;
    const shortages: Partial<Record<MaterialType, { amount: number; cost: number; unitPrice: number }>> = {};

    for (const item of MATERIALS_CATALOG) {
      const needed = materialDemand[item.id] ?? 0;
      const inStock = inventory[item.id] ?? 0;
      const effectivePrice = Math.round(item.basePrice * materialPriceMultiplier);
      if (needed > inStock) {
        const shortage = needed - inStock;
        const cost = shortage * effectivePrice;
        totalShortageCost += cost;
        shortages[item.id] = { amount: shortage, cost, unitPrice: effectivePrice };
      }
    }

    if (totalShortageCost > 0) {
      if (currentCash >= totalShortageCost) {
        // Full procurement
        for (const [mat, info] of Object.entries(shortages) as Array<[MaterialType, { amount: number; cost: number; unitPrice: number }]>) {
          inventory[mat] = (inventory[mat] ?? 0) + info.amount;
          currentCash -= info.cost;
          materialProcurementCost += info.cost;
        }
      } else {
        const budgetRatio = Math.max(0, (currentCash * 0.95) / totalShortageCost);
        for (const [mat, info] of Object.entries(shortages) as Array<[MaterialType, { amount: number; cost: number; unitPrice: number }]>) {
          const buyCount = Math.min(info.amount, Math.max(1, Math.floor(info.amount * budgetRatio)));
          const itemCost = buyCount * info.unitPrice;
          if (currentCash >= itemCost) {
            inventory[mat] = (inventory[mat] ?? 0) + buyCount;
            currentCash -= itemCost;
            materialProcurementCost += itemCost;
          }
        }
      }
    }
  }

  // Model-by-model assembly using available inventory
  const materialsConsumed: Partial<Record<MaterialType, number>> = {
    steel: 0,
    aluminum: 0,
    wood: 0,
    rubber: 0,
    leather: 0,
    plastic: 0,
  };

  let totalProduced = 0;
  const producedByModel: Record<string, number> = {};

  const modelsInPlan = plannedModels.slice();
  let capacityRemaining = targetProductionUnits;
  let canProduceMore = true;

  while (capacityRemaining > 0 && canProduceMore) {
    let producedInRound = 0;
    for (const model of modelsInPlan) {
      const planned = effectivePlan[model.id] ?? 0;
      const alreadyProduced = producedByModel[model.id] ?? 0;
      if (alreadyProduced >= planned || capacityRemaining <= 0) continue;

      const req =
        model.materialsRequired ??
        calculateMaterialRequirements(
          model.targetSegment,
          model.components,
          currentState.date.year,
          currentState.company.founderPerk
        );

      let canBuild = true;
      for (const [mat, amount] of Object.entries(req)) {
        if ((amount ?? 0) > (inventory[mat as MaterialType] ?? 0)) {
          canBuild = false;
          break;
        }
      }

      if (canBuild) {
        for (const [mat, amount] of Object.entries(req)) {
          const m = mat as MaterialType;
          inventory[m] = Math.max(0, (inventory[m] ?? 0) - (amount ?? 0));
          materialsConsumed[m] = (materialsConsumed[m] ?? 0) + (amount ?? 0);
        }
        producedByModel[model.id] = (producedByModel[model.id] ?? 0) + 1;
        totalProduced++;
        capacityRemaining--;
        producedInRound++;
      }
    }

    if (producedInRound === 0) {
      canProduceMore = false;
    }
  }

  const producedUnits = totalProduced;
  const shortageOccurred = producedUnits < targetProductionUnits && totalPlannedProduction > 0;

  const salesByRegion: Record<RegionId, number> = {
    'north-america': 0,
    europe: 0,
    'middle-east': 0,
  };

  const appealBonus = techAppealBonus(unlockedTechnologyIds, input.technologies);

  let unitsSold = 0;
  let revenue = 0;

  for (const model of currentState.vehicleModels.filter((item) => item.active)) {
    let modelStock = producedByModel[model.id] ?? 0;
    if (modelStock <= 0) continue;

    for (const region of input.regions) {
      if (modelStock <= 0) {
        break;
      }

      const eventMultiplier = getActiveEventMultiplier(input.events, region.id, newDate);
      const expectedDemand = simulateRegionDemand(
        model,
        region,
        currentState.company.reputation,
        eventMultiplier,
        appealBonus,
        newDate.year
      );
      const marketPresence = currentState.company.marketPresence[region.id] ?? 0;
      const suitability = model.regionSuitability[region.id] ?? 0.5;
      const adjustedDemand = Math.max(1, Math.floor(expectedDemand * marketPresence * suitability));
      const sold = Math.min(modelStock, adjustedDemand);

      unitsSold += sold;
      modelStock -= sold;
      salesByRegion[region.id] += sold;
      revenue += sold * model.salePrice;
    }
  }

  // Merchant perk: +10% revenue margin
  if (currentState.company.founderPerk === 'merchant') {
    revenue = Math.round(revenue * 1.1);
  }

  // Annual loan amortization (up to 12 months)
  const currentLoans = currentState.company.loans ?? [];
  let loanPayments = 0;
  const updatedLoans: BankLoan[] = [];

  for (const loan of currentLoans) {
    let principal = loan.remainingPrincipal;
    let monthsLeft = loan.remainingMonths;
    const monthsToProcess = Math.min(12, monthsLeft);

    for (let m = 0; m < monthsToProcess; m++) {
      loanPayments += loan.monthlyPayment;
      const interest = Math.round(principal * loan.interestRate);
      const principalReduction = Math.max(0, loan.monthlyPayment - interest);
      principal = Math.max(0, principal - principalReduction);
      monthsLeft -= 1;
    }

    if (monthsLeft > 0 && principal > 0) {
      updatedLoans.push({
        ...loan,
        remainingPrincipal: principal,
        remainingMonths: monthsLeft,
      });
    }
  }

  const productionCost = plannedModels.reduce((acc, model) => {
    const built = producedByModel[model.id] ?? 0;
    return acc + built * model.productionCost;
  }, 0);

  // Annual research cost (12 months)
  const researchCost = currentState.activeResearch.reduce((acc, project) => acc + project.allocatedBudget * 12, 0);
  const expenses = productionCost + researchCost + annualOverhead + annualRent + loanPayments;
  const profit = revenue - expenses;

  // Calculate Global Auto Manufacturer Rankings for the year
  const competitorsList = input.competitors ?? currentState.competitors ?? [];
  const competitorRankings: GlobalManufacturerRanking[] = competitorsList.map((comp) => {
    let compUnits = 0;
    for (const region of input.regions) {
      const share = comp.marketShares[region.id] ?? 0.05;
      compUnits += Math.round(region.marketSize * share);
    }
    const availableModels = comp.activeModels.filter((m) => m.releaseYear <= newDate.year);
    const topModel = availableModels[availableModels.length - 1] ?? comp.activeModels[0];
    const avgPrice = topModel ? topModel.price : 1000;
    const compRevenue = compUnits * avgPrice;

    return {
      rank: 0,
      companyId: comp.id,
      companyName: comp.name,
      country: comp.country,
      isPlayer: false,
      annualUnitsSold: compUnits,
      annualRevenue: compRevenue,
      globalMarketShare: 0,
      topModelName: topModel?.name,
    };
  });

  const playerRanking: GlobalManufacturerRanking = {
    rank: 0,
    companyId: currentState.company.id,
    companyName: currentState.company.name,
    country: currentState.company.country,
    isPlayer: true,
    annualUnitsSold: unitsSold,
    annualRevenue: revenue,
    globalMarketShare: 0,
    topModelName: activeModels[0]?.name ?? 'Model A Runabout',
  };

  const allRankings = [...competitorRankings, playerRanking];
  const totalWorldSales = allRankings.reduce((sum, r) => sum + r.annualUnitsSold, 0);

  allRankings.sort((a, b) => b.annualUnitsSold - a.annualUnitsSold || b.annualRevenue - a.annualRevenue);

  allRankings.forEach((item, index) => {
    item.rank = index + 1;
    item.globalMarketShare = totalWorldSales > 0 ? Math.round((item.annualUnitsSold / totalWorldSales) * 1000) / 1000 : 0;
  });

  const playerRank = allRankings.find((r) => r.isPlayer)?.rank ?? allRankings.length;

  // Reputation change based on rank and sales
  const reputationChange = playerRank === 1 ? 4 : playerRank <= 3 ? 2 : unitsSold > 0 ? 1 : -1;
  const nextReputation = Math.max(0, Math.min(100, currentState.company.reputation + reputationChange));

  // Check competitor milestones for this year
  const competitorNews: string[] = [];
  const allMilestones = input.competitorMilestones ?? currentState.competitorMilestones ?? [];
  for (const milestone of allMilestones) {
    if (milestone.year === newDate.year) {
      competitorNews.push(`${milestone.title}: ${milestone.description}`);
    }
  }

  // Automatic Bank Overdraft / Emergency Credit on cash deficit
  let finalCash = currentState.company.cash + profit;
  const overdraftNotes: string[] = [];

  if (finalCash < 0) {
    const deficit = -finalCash;
    const overdraftAmount = Math.ceil((deficit + 1000) / 1000) * 1000;
    const overdraftLoan: BankLoan = {
      id: `overdraft-${newDate.year}-${Date.now().toString().slice(-4)}`,
      name: `Банковский заем на покрытие дефицита (${newDate.year} г.)`,
      principal: overdraftAmount,
      remainingPrincipal: overdraftAmount,
      interestRate: 0.02,
      monthlyPayment: Math.max(120, Math.round((overdraftAmount * 1.15) / 12)),
      remainingMonths: 12,
      totalMonths: 12,
    };
    updatedLoans.push(overdraftLoan);
    finalCash += overdraftAmount;
    overdraftNotes.push(
      `⚠️ Дефицит капитала ($${deficit.toLocaleString()}): банк предоставил кредитную линию на $${overdraftAmount.toLocaleString()}`
    );
  }

  const activeEvents = input.events.filter((event) => isEventActive(event, newDate));
  const report: MonthlyReport = {
    id: `${currentState.id}-${newDate.year}`,
    date: newDate,
    unitsProduced: producedUnits,
    unitsSold,
    revenue,
    expenses,
    profit,
    productionCost,
    overheadCost: annualOverhead,
    researchCost,
    rentCost: annualRent,
    globalRank: playerRank,
    globalRankings: allRankings,
    researchProgress: researchProgress.map((project) => ({
      technologyId: project.technologyId,
      progressMonths: project.progressMonths,
      completed: project.isCompleted,
    })),
    reputationChange,
    loanPayments,
    eventNotes: [
      `🌐 Мировой рейтинг: #${playerRank} место (${unitsSold.toLocaleString()} авто)`,
      ...activeEvents.map((event) => event.name),
      ...overdraftNotes,
    ],
    competitorNews,
    salesByRegion,
    materialsConsumed,
    materialExpenses: materialProcurementCost,
    capacityUsed: producedUnits,
    shortageOccurred,
  };

  return {
    gameState: {
      ...currentState,
      date: newDate,
      unlockedTechnologyIds,
      activeResearch,
      company: {
        ...currentState.company,
        cash: finalCash,
        reputation: nextReputation,
        worldRank: playerRank,
        loans: updatedLoans,
        inventoryMaterials: inventory,
      },
      reportHistory: [report, ...currentState.reportHistory].slice(0, 48),
    },
    report,
  };
}
