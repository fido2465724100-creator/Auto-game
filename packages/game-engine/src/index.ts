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
} from '@ait/shared-types';

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
    name: 'Economy Runabout',
    description: 'Affordable, simple personal transport for working families.',
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
    name: 'Family Touring Car',
    description: 'Spacious carriage with balanced comfort and reliability.',
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
    name: 'Luxury Town Car',
    description: 'Exclusive hand-crafted vehicle for high-society prestige.',
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
    name: 'Utility Work Truck',
    description: 'Heavy-duty transport for trade, cargo, and rural commerce.',
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
  allComponents: VehicleComponentOption[]
): {
  stats: VehicleStats;
  productionCost: number;
  regionSuitability: Record<RegionId, number>;
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

  const clamp = (val: number) => Math.max(5, Math.min(100, val));
  stats.reliability = clamp(stats.reliability);
  stats.comfort = clamp(stats.comfort);
  stats.performance = clamp(stats.performance);
  stats.efficiency = clamp(stats.efficiency);
  stats.prestige = clamp(stats.prestige);
  stats.complexity = clamp(stats.complexity);

  const productionCost = profile.baseProductionCost + extraCost;
  const suitability: Record<RegionId, number> = { ...profile.defaultRegionSuitability };

  return {
    stats,
    productionCost,
    regionSuitability: suitability,
  };
}

function nextMonth(date: GameDate): GameDate {
  if (date.month === 12) {
    return { year: date.year + 1, month: 1 };
  }

  return { year: date.year, month: date.month + 1 };
}

function isEventActive(event: HistoricalEvent, date: GameDate): boolean {
  const current = date.year * 12 + date.month;
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

function simulateRegionDemand(model: VehicleModel, region: Region, reputation: number, eventMultiplier: number, appealBonus: number): number {
  const weightedStats =
    model.stats.comfort * region.preferenceWeights.comfort +
    model.stats.efficiency * region.preferenceWeights.efficiency +
    model.stats.performance * region.preferenceWeights.performance +
    model.stats.prestige * region.preferenceWeights.prestige;

  const normalizedStats = weightedStats / 100;
  const pricePenalty = Math.max(0.45, 1 - model.salePrice / 100_000);
  const reputationFactor = 0.6 + reputation / 200;

  const baseDemand = region.marketSize * normalizedStats * pricePenalty * reputationFactor * appealBonus;
  return Math.max(0, Math.floor(baseDemand * eventMultiplier));
}

export function runEndTurn(input: EndTurnInput): EndTurnOutput {
  const currentState = input.gameState;
  const newDate = nextMonth(currentState.date);

  const researchProgress = currentState.activeResearch.map((project) => {
    const nextProgress = Math.min(project.totalMonths, project.progressMonths + 1);
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

  const totalPlannedProduction = Object.values(currentState.productionPlan).reduce((acc, units) => acc + units, 0);
  const producedUnits = Math.min(totalPlannedProduction, currentState.company.productionCapacity);

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
      const expectedDemand = simulateRegionDemand(model, region, currentState.company.reputation, eventMultiplier, appealBonus);
      const marketPresence = currentState.company.marketPresence[region.id] ?? 0;
      const suitability = model.regionSuitability[region.id] ?? 0.5;
      const adjustedDemand = Math.floor(expectedDemand * marketPresence * suitability);
      const sold = Math.min(remainingInventory, adjustedDemand);

      unitsSold += sold;
      remainingInventory -= sold;
      salesByRegion[region.id] += sold;
      revenue += sold * model.salePrice;
    }
  }

  const currentLoans = currentState.company.loans ?? [];
  let loanPayments = 0;
  const updatedLoans: BankLoan[] = [];

  for (const loan of currentLoans) {
    loanPayments += loan.monthlyPayment;
    const interest = Math.round(loan.remainingPrincipal * loan.interestRate);
    const principalReduction = Math.max(0, loan.monthlyPayment - interest);
    const nextPrincipal = Math.max(0, loan.remainingPrincipal - principalReduction);
    const nextMonths = loan.remainingMonths - 1;

    if (nextMonths > 0 && nextPrincipal > 0) {
      updatedLoans.push({
        ...loan,
        remainingPrincipal: nextPrincipal,
        remainingMonths: nextMonths,
      });
    }
  }

  const productionCost = currentState.vehicleModels.reduce((acc, model) => {
    const planned = currentState.productionPlan[model.id] ?? 0;
    return acc + planned * model.productionCost;
  }, 0);

  const researchCost = currentState.activeResearch.reduce((acc, project) => acc + project.allocatedBudget, 0);
  const expenses = productionCost + researchCost + currentState.company.overheadMonthly + loanPayments;
  const profit = revenue - expenses;

  const reputationChange = unitsSold > 0 ? Math.min(3, Math.floor(unitsSold / 200)) : -1;
  const nextReputation = Math.max(0, Math.min(100, currentState.company.reputation + reputationChange));

  const activeEvents = input.events.filter((event) => isEventActive(event, newDate));
  const report: MonthlyReport = {
    id: `${currentState.id}-${newDate.year}-${newDate.month}`,
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
    eventNotes: activeEvents.map((event) => event.name),
    salesByRegion,
  };

  return {
    gameState: {
      ...currentState,
      date: newDate,
      unlockedTechnologyIds,
      activeResearch,
      company: {
        ...currentState.company,
        cash: currentState.company.cash + profit,
        reputation: nextReputation,
        loans: updatedLoans,
      },
      reportHistory: [report, ...currentState.reportHistory].slice(0, 24),
    },
    report,
  };
}
