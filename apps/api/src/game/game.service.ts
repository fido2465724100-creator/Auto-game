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
} from '@ait/shared-types';
import { eventsSeed, regionsSeed, technologies1900to1915Seed, vehicleComponentSeed } from '../../../../data';

@Injectable()
export class GameService {
  private readonly regions: Region[] = regionsSeed;
  private readonly technologies: Technology[] = technologies1900to1915Seed;
  private readonly events: HistoricalEvent[] = eventsSeed;

  // TODO: Replace in-memory store with Prisma repository.
  private gameState: GameState = {
    id: 'default-save',
    date: { year: 1900, month: 1 },
    company: {
      id: 'company-1',
      name: 'Anton Motor Works',
      cash: 150_000,
      reputation: 30,
      productionCapacity: 120,
      overheadMonthly: 20_000,
      marketPresence: {
        'north-america': 0.7,
        europe: 0.45,
        'middle-east': 0.2,
      },
      inventoryMaterials: {
        steel: 1500,
        wood: 1200,
        rubber: 500,
        leather: 350,
        aluminum: 0,
        plastic: 0,
      },
      autoProcurement: true,
      factory: {
        name: 'Детройтская мануфактура №1',
        level: 1,
        capacity: 120,
        monthlyOverhead: 8_000,
        upgradeCost: 35_000,
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
          europe: 0.75,
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
          reliability: 55,
          comfort: 35,
          performance: 30,
          efficiency: 45,
          prestige: 20,
          complexity: 25,
        },
        productionCost: 800,
        salePrice: 1400,
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
      'model-a': 80,
    },
    reportHistory: [],
  };

  getGameState(): GameState {
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
      name: 'Главная мануфактура',
      level: 1,
      capacity: this.gameState.company.productionCapacity,
      monthlyOverhead: 8_000,
      upgradeCost: 35_000,
    };

    if (this.gameState.company.cash < factory.upgradeCost) {
      return this.gameState;
    }

    const newLevel = factory.level + 1;
    const newCapacity = factory.capacity + 60;
    const newOverhead = factory.monthlyOverhead + 4_000;
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

  endTurn(): GameState {
    const output = runEndTurn({
      gameState: this.gameState,
      regions: this.regions,
      technologies: this.technologies,
      events: this.events,
    });

    this.gameState = output.gameState;
    return this.gameState;
  }
}
