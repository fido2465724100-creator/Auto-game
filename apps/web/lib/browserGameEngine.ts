import {
  runEndTurn,
  LOAN_TEMPLATES,
  MATERIALS_CATALOG,
  calculateMaterialRequirements,
} from '@ait/game-engine';
import type {
  GameState,
  Region,
  Technology,
  HistoricalEvent,
  VehicleModel,
  ResearchProject,
  VehicleComponentWithStatus,
  BankLoan,
  LoanTemplate,
  MaterialType,
  MaterialMarketItem,
  CountryId,
  FounderPerk,
  BadgeDesign,
  Competitor,
  CompetitorMilestone,
  RegionId,
} from '@ait/shared-types';
import {
  eventsSeed,
  regionsSeed,
  technologies1900to1915Seed,
  vehicleComponentSeed,
  competitorsSeed,
  competitorMilestonesSeed,
} from '@ait/data';

const STORAGE_KEY = 'ait_autogame_save_v1';

function createInitialGameState(setup?: {
  name?: string;
  country?: CountryId;
  founderPerk?: FounderPerk;
  badge?: BadgeDesign;
}): GameState {
  const country: CountryId = setup?.country ?? 'usa';
  const name = setup?.name ?? 'Pioneer Motor Works';
  const founderPerk: FounderPerk = setup?.founderPerk ?? 'mechanic';
  const badge: BadgeDesign = setup?.badge ?? { icon: 'cog', color: '#d97706', shape: 'circle' };

  const marketPresence: Record<RegionId, number> =
    country === 'usa'
      ? { 'north-america': 0.25, europe: 0.02, 'middle-east': 0.01 }
      : { europe: 0.25, 'north-america': 0.02, 'middle-east': 0.01 };

  const factoryNames: Record<CountryId, string> = {
    usa: 'Детройтская мастерская №1',
    germany: 'Штутгартская мануфактура №1',
    france: 'Парижское экипажное ателье',
    uk: 'Ковентрийская механическая фабрика',
  };

  return {
    id: 'save-1900-q1',
    date: { year: 1900, quarter: 1, month: 1 },
    company: {
      id: 'company-1',
      name,
      country,
      founderPerk,
      badge,
      cash: 14_000,
      reputation: 30,
      productionCapacity: 4,
      overheadMonthly: 400,
      marketPresence,
      inventoryMaterials: {
        steel: 200,
        wood: 250,
        rubber: 60,
        leather: 30,
        aluminum: 0,
        plastic: 0,
      },
      autoProcurement: true,
      factory: {
        name: factoryNames[country] ?? 'Кустарная мануфактура №1',
        level: 1,
        capacity: 4,
        monthlyOverhead: 200,
        upgradeCost: 6_000,
      },
    },
    unlockedTechnologyIds: ['standardized-steering-wheel'],
    activeResearch: [],
    vehicleModels: [
      {
        id: 'model-a',
        name: 'Model A Runabout',
        targetSegment: 'economy',
        regionSuitability: {
          'north-america': 0.9,
          europe: 0.8,
          'middle-east': 0.6,
        },
        components: {
          chassis: 'ladder-frame',
          engine: 'single-cylinder',
          brakes: 'drum-brakes',
          comfort: 'basic-cabin',
          package: 'weather-package',
        },
        stats: {
          reliability: 50,
          comfort: 30,
          performance: 30,
          efficiency: 45,
          prestige: 20,
          complexity: 20,
        },
        productionCost: 480,
        salePrice: 900,
        active: true,
        materialsRequired: {
          steel: 40,
          wood: 50,
          rubber: 12,
          leather: 5,
          aluminum: 0,
          plastic: 0,
        },
      },
    ],
    productionPlan: {
      'model-a': 3,
    },
    reportHistory: [],
    competitors: competitorsSeed,
    competitorMilestones: competitorMilestonesSeed,
  };
}

class BrowserGameEngineClass {
  private readonly regions: Region[] = regionsSeed;
  private readonly technologies: Technology[] = technologies1900to1915Seed;
  private readonly events: HistoricalEvent[] = eventsSeed;
  private gameState: GameState | null = null;

  private loadFromStorage(): GameState {
    if (typeof window === 'undefined') {
      return createInitialGameState();
    }
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as GameState;
        if (parsed && parsed.date && parsed.company) {
          return parsed;
        }
      }
    } catch {
      // Ignore storage read error
    }
    const initial = createInitialGameState();
    this.saveToStorage(initial);
    return initial;
  }

  private saveToStorage(state: GameState): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage write error
    }
  }

  private getState(): GameState {
    if (!this.gameState) {
      this.gameState = this.loadFromStorage();
    }
    return this.gameState;
  }

  private updateState(updater: (prev: GameState) => GameState): GameState {
    const prev = this.getState();
    const next = updater(prev);
    this.gameState = next;
    this.saveToStorage(next);
    return next;
  }

  getGameState(): GameState {
    const current = this.getState();
    if (current.company.cash < 0) {
      const deficit = -current.company.cash;
      const loanAmount = Math.ceil((deficit + 1000) / 1000) * 1000;
      const overdraftLoan: BankLoan = {
        id: `overdraft-heal-${Date.now().toString().slice(-4)}`,
        name: `Банковский заем на покрытие дефицита`,
        principal: loanAmount,
        remainingPrincipal: loanAmount,
        interestRate: 0.02,
        monthlyPayment: Math.max(120, Math.round((loanAmount * 1.15) / 12)),
        remainingMonths: 12,
        totalMonths: 12,
      };
      const currentLoans = current.company.loans ?? [];
      return this.updateState((s) => ({
        ...s,
        company: {
          ...s.company,
          cash: s.company.cash + loanAmount,
          loans: [...currentLoans, overdraftLoan],
        },
      }));
    }
    return current;
  }

  getTechnologies(): Array<Technology & { status: 'locked' | 'available' | 'researching' | 'completed' }> {
    const state = this.getState();
    const researchingIds = new Set(state.activeResearch.map((item) => item.technologyId));
    const unlockedIds = new Set(state.unlockedTechnologyIds);

    return this.technologies.map((tech) => {
      if (unlockedIds.has(tech.id)) {
        return { ...tech, status: 'completed' as const };
      }
      if (researchingIds.has(tech.id)) {
        return { ...tech, status: 'researching' as const };
      }
      const available =
        state.date.year >= tech.yearAvailable &&
        tech.prerequisites.every((id) => unlockedIds.has(id));

      return { ...tech, status: available ? ('available' as const) : ('locked' as const) };
    });
  }

  startResearch(technologyId: string, allocatedBudget: number): GameState {
    const tech = this.technologies.find((item) => item.id === technologyId);
    if (!tech) return this.getState();

    const state = this.getState();
    if (state.unlockedTechnologyIds.includes(technologyId)) return state;
    if (state.activeResearch.some((item) => item.technologyId === technologyId)) return state;

    const project: ResearchProject = {
      id: `rp-${technologyId}`,
      technologyId,
      allocatedBudget,
      progressMonths: 0,
      totalMonths: tech.researchDurationMonths,
      isCompleted: false,
    };

    return this.updateState((s) => ({
      ...s,
      activeResearch: [...s.activeResearch, project],
    }));
  }

  saveVehicleModel(model: VehicleModel): GameState {
    const state = this.getState();
    const existingIndex = state.vehicleModels.findIndex((item) => item.id === model.id);
    const vehicleModels = [...state.vehicleModels];

    const materialsRequired =
      model.materialsRequired ??
      calculateMaterialRequirements(model.targetSegment, model.components, state.date.year);

    const modelWithMaterials: VehicleModel = {
      ...model,
      materialsRequired,
    };

    if (existingIndex >= 0) {
      vehicleModels[existingIndex] = modelWithMaterials;
    } else {
      vehicleModels.push(modelWithMaterials);
    }

    return this.updateState((s) => ({
      ...s,
      vehicleModels,
      productionPlan: {
        ...s.productionPlan,
        [model.id]: s.productionPlan[model.id] ?? 0,
      },
    }));
  }

  updateProductionPlan(productionPlan: Record<string, number>): GameState {
    return this.updateState((s) => ({
      ...s,
      productionPlan,
    }));
  }

  getRegions(): Region[] {
    return this.regions;
  }

  getVehicleComponents(): VehicleComponentWithStatus[] {
    const state = this.getState();
    const unlockedIds = new Set(state.unlockedTechnologyIds);
    return vehicleComponentSeed.map((comp) => ({
      ...comp,
      isUnlocked: !comp.requiredTechnologyId || unlockedIds.has(comp.requiredTechnologyId),
    }));
  }

  getLoanTemplates(): LoanTemplate[] {
    return LOAN_TEMPLATES;
  }

  takeLoan(templateId: string): GameState {
    const template = LOAN_TEMPLATES.find((t) => t.id === templateId);
    if (!template) return this.getState();

    const newLoan: BankLoan = {
      id: `loan-${template.id}-${Date.now().toString().slice(-4)}`,
      name: template.name,
      principal: template.amount,
      remainingPrincipal: template.amount,
      interestRate: template.interestRate,
      monthlyPayment: template.monthlyPayment,
      remainingMonths: template.durationMonths,
      totalMonths: template.durationMonths,
    };

    return this.updateState((s) => {
      const currentLoans = s.company.loans ?? [];
      return {
        ...s,
        company: {
          ...s.company,
          cash: s.company.cash + template.amount,
          loans: [...currentLoans, newLoan],
        },
      };
    });
  }

  repayLoan(loanId: string): GameState {
    const state = this.getState();
    const currentLoans = state.company.loans ?? [];
    const loan = currentLoans.find((l) => l.id === loanId);
    if (!loan || state.company.cash < loan.remainingPrincipal) return state;

    return this.updateState((s) => ({
      ...s,
      company: {
        ...s.company,
        cash: s.company.cash - loan.remainingPrincipal,
        loans: currentLoans.filter((l) => l.id !== loanId),
      },
    }));
  }

  getMaterialsMarket(): MaterialMarketItem[] {
    const currentYear = this.getState().date.year;
    return MATERIALS_CATALOG.filter((item) => item.yearAvailable <= currentYear);
  }

  buyMaterial(materialId: MaterialType, amount: number): GameState {
    const item = MATERIALS_CATALOG.find((m) => m.id === materialId);
    if (!item || amount <= 0) return this.getState();

    const totalCost = item.basePrice * amount;
    const state = this.getState();
    if (state.company.cash < totalCost) return state;

    return this.updateState((s) => {
      const currentInventory = s.company.inventoryMaterials ?? {
        steel: 0,
        wood: 0,
        rubber: 0,
        leather: 0,
        aluminum: 0,
        plastic: 0,
      };
      return {
        ...s,
        company: {
          ...s.company,
          cash: s.company.cash - totalCost,
          inventoryMaterials: {
            ...currentInventory,
            [materialId]: (currentInventory[materialId] ?? 0) + amount,
          },
        },
      };
    });
  }

  setAutoProcurement(enabled: boolean): GameState {
    return this.updateState((s) => ({
      ...s,
      company: {
        ...s.company,
        autoProcurement: enabled,
      },
    }));
  }

  expandFactory(): GameState {
    const state = this.getState();
    const factory = state.company.factory ?? {
      name: 'Кустарная мануфактура №1',
      level: 1,
      capacity: state.company.productionCapacity,
      monthlyOverhead: 200,
      upgradeCost: 6_000,
    };

    if (state.company.cash < factory.upgradeCost) return state;

    const newLevel = factory.level + 1;
    const newCapacity = factory.capacity + 4;
    const newOverhead = factory.monthlyOverhead + 150;
    const nextUpgradeCost = Math.round(factory.upgradeCost * 1.6);

    return this.updateState((s) => ({
      ...s,
      company: {
        ...s.company,
        cash: s.company.cash - factory.upgradeCost,
        productionCapacity: newCapacity,
        factory: {
          ...factory,
          level: newLevel,
          capacity: newCapacity,
          monthlyOverhead: newOverhead,
          upgradeCost: nextUpgradeCost,
        },
      },
    }));
  }

  setupCompany(dto: {
    name: string;
    country: CountryId;
    founderPerk: FounderPerk;
    badge: BadgeDesign;
  }): GameState {
    const regionPresence: Record<RegionId, number> =
      dto.country === 'usa'
        ? { 'north-america': 0.25, europe: 0.02, 'middle-east': 0.01 }
        : { europe: 0.25, 'north-america': 0.02, 'middle-east': 0.01 };

    return this.updateState((s) => ({
      ...s,
      company: {
        ...s.company,
        name: dto.name,
        country: dto.country,
        founderPerk: dto.founderPerk,
        badge: dto.badge,
        marketPresence: regionPresence,
      },
    }));
  }

  getCompetitors(): { competitors: Competitor[]; milestones: CompetitorMilestone[] } {
    const state = this.getState();
    return {
      competitors: state.competitors ?? competitorsSeed,
      milestones: state.competitorMilestones ?? competitorMilestonesSeed,
    };
  }

  resetGame(dto?: {
    name?: string;
    country?: CountryId;
    founderPerk?: FounderPerk;
    badge?: BadgeDesign;
  }): GameState {
    const newState = createInitialGameState(dto);
    this.gameState = newState;
    this.saveToStorage(newState);
    return newState;
  }

  endTurn(): GameState {
    const state = this.getState();
    const output = runEndTurn({
      gameState: state,
      regions: this.regions,
      technologies: this.technologies,
      events: this.events,
      ...(state.competitors ? { competitors: state.competitors } : {}),
      ...(state.competitorMilestones ? { competitorMilestones: state.competitorMilestones } : {}),
    });

    this.gameState = output.gameState;
    this.saveToStorage(output.gameState);
    return this.gameState;
  }
}

export const browserGameEngine = new BrowserGameEngineClass();
