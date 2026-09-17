import { Injectable, NotFoundException } from '@nestjs/common';
import { runEndTurn, LOAN_TEMPLATES, MATERIALS_CATALOG, calculateMaterialRequirements } from '@ait/game-engine';
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
  achievementsSeed,
} from '../../../../data';

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
      cash: 15_000,
      reputation: 30,
      productionCapacity: 4,
      overheadMonthly: 50,
      marketPresence,
      inventoryMaterials: {
        steel: 500,
        wood: 600,
        rubber: 150,
        leather: 80,
        aluminum: 20,
        plastic: 0,
      },
      autoProcurement: true,
      factory: {
        name: factoryNames[country] ?? 'Кустарная мануфактура №1',
        level: 1,
        capacity: 4,
        monthlyOverhead: 40,
        upgradeCost: 4_000,
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
    achievements: achievementsSeed.map((a) => ({ ...a })),
  };
}

@Injectable()
export class GameService {
  private readonly regions: Region[] = regionsSeed;
  private readonly technologies: Technology[] = technologies1900to1915Seed;
  private readonly events: HistoricalEvent[] = eventsSeed;

  private gameState: GameState = createInitialGameState();

  getGameState(): GameState {
    if (this.gameState.company.cash < 0) {
      const deficit = -this.gameState.company.cash;
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
      const currentLoans = this.gameState.company.loans ?? [];
      this.gameState = {
        ...this.gameState,
        company: {
          ...this.gameState.company,
          cash: this.gameState.company.cash + loanAmount,
          loans: [...currentLoans, overdraftLoan],
        },
      };
    }
    return this.gameState;
  }

  getTechnologies(): Array<Technology & { status: 'locked' | 'available' | 'researching' | 'completed' }> {
    const researchingIds = new Set(this.gameState.activeResearch.map((item) => item.technologyId));
    const unlockedIds = new Set(this.gameState.unlockedTechnologyIds);

    return this.technologies.map((tech) => {
      if (unlockedIds.has(tech.id)) {
        return { ...tech, status: 'completed' as const };
      }

      if (researchingIds.has(tech.id)) {
        return { ...tech, status: 'researching' as const };
      }

      const available =
        this.gameState.date.year >= tech.yearAvailable &&
        tech.prerequisites.every((id) => unlockedIds.has(id));

      return { ...tech, status: available ? ('available' as const) : ('locked' as const) };
    });
  }

  startResearch(technologyId: string, allocatedBudget: number): GameState {
    const tech = this.technologies.find((item) => item.id === technologyId);
    if (!tech) {
      throw new NotFoundException(`Technology ${technologyId} not found`);
    }

    if (this.gameState.unlockedTechnologyIds.includes(technologyId)) {
      return this.gameState;
    }

    if (this.gameState.activeResearch.some((item) => item.technologyId === technologyId)) {
      return this.gameState;
    }

    const project: ResearchProject = {
      id: `rp-${technologyId}`,
      technologyId,
      allocatedBudget,
      progressMonths: 0,
      totalMonths: tech.researchDurationMonths,
      isCompleted: false,
    };

    this.gameState = {
      ...this.gameState,
      activeResearch: [...this.gameState.activeResearch, project],
    };

    return this.gameState;
  }

  saveVehicleModel(model: VehicleModel): GameState {
    const existingIndex = this.gameState.vehicleModels.findIndex((item) => item.id === model.id);
    const vehicleModels = [...this.gameState.vehicleModels];

    const materialsRequired =
      model.materialsRequired ??
      calculateMaterialRequirements(model.targetSegment, model.components, this.gameState.date.year);

    const modelWithMaterials: VehicleModel = {
      ...model,
      materialsRequired,
    };

    if (existingIndex >= 0) {
      vehicleModels[existingIndex] = modelWithMaterials;
    } else {
      vehicleModels.push(modelWithMaterials);
    }

    this.gameState = {
      ...this.gameState,
      vehicleModels,
      productionPlan: {
        ...this.gameState.productionPlan,
        [model.id]: this.gameState.productionPlan[model.id] ?? 0,
      },
    };

    return this.gameState;
  }

  updateProductionPlan(productionPlan: Record<string, number>): GameState {
    this.gameState = {
      ...this.gameState,
      productionPlan,
    };

    return this.gameState;
  }

  getRegions(): Region[] {
    return this.regions;
  }

  getVehicleComponents(): VehicleComponentWithStatus[] {
    const unlockedIds = new Set(this.gameState.unlockedTechnologyIds);
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
    if (!template) {
      throw new NotFoundException(`Loan template ${templateId} not found`);
    }

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

    const currentLoans = this.gameState.company.loans ?? [];
    this.gameState = {
      ...this.gameState,
      company: {
        ...this.gameState.company,
        cash: this.gameState.company.cash + template.amount,
        loans: [...currentLoans, newLoan],
      },
    };

    return this.gameState;
  }

  repayLoan(loanId: string): GameState {
    const currentLoans = this.gameState.company.loans ?? [];
    const loan = currentLoans.find((l) => l.id === loanId);
    if (!loan) {
      throw new NotFoundException(`Loan ${loanId} not found`);
    }

    if (this.gameState.company.cash < loan.remainingPrincipal) {
      return this.gameState;
    }

    this.gameState = {
      ...this.gameState,
      company: {
        ...this.gameState.company,
        cash: this.gameState.company.cash - loan.remainingPrincipal,
        loans: currentLoans.filter((l) => l.id !== loanId),
      },
    };

    return this.gameState;
  }

  getMaterialsMarket(): MaterialMarketItem[] {
    const currentYear = this.gameState.date.year;
    return MATERIALS_CATALOG.filter((item) => item.yearAvailable <= currentYear);
  }

  buyMaterial(materialId: MaterialType, amount: number): GameState {
    const item = MATERIALS_CATALOG.find((m) => m.id === materialId);
    if (!item) {
      throw new NotFoundException(`Material ${materialId} not found`);
    }
    if (amount <= 0) return this.gameState;

    const totalCost = item.basePrice * amount;
    if (this.gameState.company.cash < totalCost) {
      return this.gameState;
    }

    const currentInventory = this.gameState.company.inventoryMaterials ?? {
      steel: 0,
      wood: 0,
      rubber: 0,
      leather: 0,
      aluminum: 0,
      plastic: 0,
    };

    this.gameState = {
      ...this.gameState,
      company: {
        ...this.gameState.company,
        cash: this.gameState.company.cash - totalCost,
        inventoryMaterials: {
          ...currentInventory,
          [materialId]: (currentInventory[materialId] ?? 0) + amount,
        },
      },
    };

    return this.gameState;
  }

  toggleAutoProcurement(enabled: boolean): GameState {
    this.gameState = {
      ...this.gameState,
      company: {
        ...this.gameState.company,
        autoProcurement: enabled,
      },
    };
    return this.gameState;
  }

  expandFactory(): GameState {
    const factory = this.gameState.company.factory ?? {
      name: 'Кустарная мануфактура №1',
      level: 1,
      capacity: this.gameState.company.productionCapacity,
      monthlyOverhead: 40,
      upgradeCost: 4_000,
    };

    if (this.gameState.company.cash < factory.upgradeCost) {
      return this.gameState;
    }

    const newLevel = factory.level + 1;
    const newCapacity = factory.capacity + 4; // handcrafted expansion (+4 cars/quarter)
    const newOverhead = factory.monthlyOverhead + 50;
    const nextUpgradeCost = Math.round(factory.upgradeCost * 1.5);

    this.gameState = {
      ...this.gameState,
      company: {
        ...this.gameState.company,
        cash: this.gameState.company.cash - factory.upgradeCost,
        productionCapacity: newCapacity,
        factory: {
          ...factory,
          level: newLevel,
          capacity: newCapacity,
          monthlyOverhead: newOverhead,
          upgradeCost: nextUpgradeCost,
        },
      },
    };

    return this.gameState;
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

    this.gameState = {
      ...this.gameState,
      company: {
        ...this.gameState.company,
        name: dto.name,
        country: dto.country,
        founderPerk: dto.founderPerk,
        badge: dto.badge,
        marketPresence: regionPresence,
      },
    };
    return this.gameState;
  }

  getCompetitors(): { competitors: Competitor[]; milestones: CompetitorMilestone[] } {
    return {
      competitors: this.gameState.competitors ?? competitorsSeed,
      milestones: this.gameState.competitorMilestones ?? competitorMilestonesSeed,
    };
  }

  resetGame(dto?: {
    name?: string;
    country?: CountryId;
    founderPerk?: FounderPerk;
    badge?: BadgeDesign;
  }): GameState {
    this.gameState = createInitialGameState(dto);
    return this.gameState;
  }

  endTurn(): GameState {
    const output = runEndTurn({
      gameState: this.gameState,
      regions: this.regions,
      technologies: this.technologies,
      events: this.events,
      ...(this.gameState.competitors ? { competitors: this.gameState.competitors } : {}),
      ...(this.gameState.competitorMilestones ? { competitorMilestones: this.gameState.competitorMilestones } : {}),
    });

    this.gameState = output.gameState;
    return this.gameState;
  }
}
