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
} from '@ait/shared-types';

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

  const productionCost = currentState.vehicleModels.reduce((acc, model) => {
    const planned = currentState.productionPlan[model.id] ?? 0;
    return acc + planned * model.productionCost;
  }, 0);

  const researchCost = currentState.activeResearch.reduce((acc, project) => acc + project.allocatedBudget, 0);
  const expenses = productionCost + researchCost + currentState.company.overheadMonthly;
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
      },
      reportHistory: [report, ...currentState.reportHistory].slice(0, 24),
    },
    report,
  };
}
