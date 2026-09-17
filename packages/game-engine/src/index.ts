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
} from '@ait/shared-types';

export const MATERIALS_CATALOG: MaterialMarketItem[] = [
  {
    id: 'steel',
    name: 'Сталь и Чугун',
    basePrice: 25,
    unit: 'кг',
    yearAvailable: 1900,
    description: 'Основной металл для блоков цилиндров, рам, рессор и мостов.',
  },
  {
    id: 'wood',
    name: 'Конструкционная древесина',
    basePrice: 15,
    unit: 'ед.',
    yearAvailable: 1900,
    description: 'Критически важный материал эпохи 1900–1920: каретные кузова, спицы колес, щитки.',
  },
  {
    id: 'rubber',
    name: 'Натуральный каучук',
    basePrice: 30,
    unit: 'кг',
    yearAvailable: 1900,
    description: 'Колониальный каучук для ранних сплошных и пневматических шин, сальников и ремней.',
  },
  {
    id: 'leather',
    name: 'Кожа и Обивочный текстиль',
    basePrice: 40,
    unit: 'м²',
    yearAvailable: 1900,
    description: 'Материал отделки открытых диванов экипажа и складных брезентово-кожаных крыш.',
  },
  {
    id: 'aluminum',
    name: 'Алюминий и Сплавы',
    basePrice: 75,
    unit: 'кг',
    yearAvailable: 1915,
    description: 'Легкий и дорогой металл. Снижает вес авто и повышает скоростные качества.',
  },
  {
    id: 'plastic',
    name: 'Полимеры и Пластик',
    basePrice: 12,
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
  const currentMonth = date.month ?? ((date.quarter ?? 1) - 1) * 3 + 1;
  const current = date.year * 12 + currentMonth;
  const start = event.startYear * 12 + event.startMonth;
  const end = event.endYear * 12 + event.endMonth;
  return current >= start && current <= end;
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

  const normalizedStats = weightedStats / 100;
  const pricePenalty = Math.max(0.45, 1 - model.salePrice / 100_000);
  const reputationFactor = 0.6 + reputation / 200;

  // Era scaling: pioneer automobile market in 1900-1905 is a handcrafted boutique niche
  const eraDemandFactor = Math.min(1.0, 0.05 + Math.max(0, year - 1900) * 0.02);

  const baseDemand = region.marketSize * normalizedStats * pricePenalty * reputationFactor * appealBonus * eraDemandFactor;
  return Math.max(1, Math.floor(baseDemand * eventMultiplier));
}

export function runEndTurn(input: EndTurnInput): EndTurnOutput {
  const currentState = input.gameState;
  const newDate = nextQuarter(currentState.date);

  // Advance research by 3 months (quarterly step).
  // Mechanic perk: +1 extra month for engine and chassis technologies.
  const researchProgress = currentState.activeResearch.map((project) => {
    const tech = input.technologies.find((t) => t.id === project.technologyId);
    let monthsToAdd = 3;
    if (
      currentState.company.founderPerk === 'mechanic' &&
      tech &&
      (tech.category === 'engine' || tech.category === 'chassis')
    ) {
      monthsToAdd = 4;
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

  // Factory capacity & inventory setup (quarterly capacity)
  const factoryCapacity = currentState.company.factory?.capacity ?? currentState.company.productionCapacity ?? 4;
  const factoryMonthlyOverhead = currentState.company.factory?.monthlyOverhead ?? 0;
  const quarterlyOverhead = (currentState.company.overheadMonthly + factoryMonthlyOverhead) * 3;

  const defaultInventory: Record<MaterialType, number> = {
    steel: 200,
    wood: 250,
    rubber: 60,
    leather: 30,
    aluminum: 0,
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
        // Balanced procurement: allocate available cash proportionally across all missing materials
        // so that no critical material is left at 0
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

  // Sort models: produce simpler/high-priority models first so assembly never stalls completely
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

      // Check if all materials for 1 car are available in inventory
      let canBuild = true;
      for (const [mat, amount] of Object.entries(req)) {
        if ((amount ?? 0) > (inventory[mat as MaterialType] ?? 0)) {
          canBuild = false;
          break;
        }
      }

      if (canBuild) {
        // Deduct materials for 1 unit
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

  let remainingInventory = producedUnits;
  let unitsSold = 0;
  let revenue = 0;

  for (const model of currentState.vehicleModels.filter((item) => item.active)) {
    for (const region of input.regions) {
      if (remainingInventory <= 0) {
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
      const sold = Math.min(remainingInventory, adjustedDemand);

      unitsSold += sold;
      remainingInventory -= sold;
      salesByRegion[region.id] += sold;
      revenue += sold * model.salePrice;
    }
  }

  // Merchant perk: +10% revenue margin
  if (currentState.company.founderPerk === 'merchant') {
    revenue = Math.round(revenue * 1.1);
  }

  // Quarterly loan amortization (3 months)
  const currentLoans = currentState.company.loans ?? [];
  let loanPayments = 0;
  const updatedLoans: BankLoan[] = [];

  for (const loan of currentLoans) {
    let principal = loan.remainingPrincipal;
    let monthsLeft = loan.remainingMonths;
    const monthsToProcess = Math.min(3, monthsLeft);

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

  // Quarterly research cost (3 months)
  const researchCost = currentState.activeResearch.reduce((acc, project) => acc + project.allocatedBudget * 3, 0);
  const expenses = productionCost + researchCost + quarterlyOverhead + loanPayments + materialProcurementCost;
  const profit = revenue - expenses;

  // Reputation change
  const reputationChange = unitsSold > 0 ? Math.max(1, Math.min(4, Math.floor(unitsSold / 50) + 1)) : -1;
  const nextReputation = Math.max(0, Math.min(100, currentState.company.reputation + reputationChange));

  // Check competitor milestones for this quarter
  const competitorNews: string[] = [];
  const allMilestones = input.competitorMilestones ?? currentState.competitorMilestones ?? [];
  for (const milestone of allMilestones) {
    if (milestone.year === newDate.year && milestone.quarter === newDate.quarter) {
      competitorNews.push(`${milestone.title}: ${milestone.description}`);
    }
  }

  // Automatic Bank Overdraft / Emergency Credit on cash deficit
  let finalCash = currentState.company.cash + profit;
  const overdraftNotes: string[] = [];

  if (finalCash < 0) {
    const deficit = -finalCash;
    // Issue emergency bank overdraft to cover deficit + provide $1,000 working cushion
    const overdraftAmount = Math.ceil((deficit + 1000) / 1000) * 1000;
    const overdraftLoan: BankLoan = {
      id: `overdraft-${newDate.year}-Q${newDate.quarter}-${Date.now().toString().slice(-4)}`,
      name: `Банковский заем на покрытие дефицита (${newDate.year} Q${newDate.quarter})`,
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
    id: `${currentState.id}-${newDate.year}-Q${newDate.quarter}`,
    date: newDate,
    unitsProduced: producedUnits,
    unitsSold,
    revenue,
    expenses,
    profit,
    researchProgress: researchProgress.map((project) => ({
      technologyId: project.technologyId,
      progressMonths: project.progressMonths,
      completed: project.isCompleted,
    })),
    reputationChange,
    loanPayments,
    eventNotes: [...activeEvents.map((event) => event.name), ...overdraftNotes],
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
        loans: updatedLoans,
        inventoryMaterials: inventory,
      },
      reportHistory: [report, ...currentState.reportHistory].slice(0, 48),
    },
    report,
  };
}
