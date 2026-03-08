import { Injectable, NotFoundException } from '@nestjs/common';
import { runEndTurn } from '@ait/game-engine';
import type { GameState, Region, Technology, HistoricalEvent, VehicleModel, ResearchProject } from '@ait/shared-types';
import { eventsSeed, regionsSeed, technologies1900to1915Seed } from '../../../../data';

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
    },
    unlockedTechnologyIds: ['standardized-steering-wheel'],
    activeResearch: [],
    vehicleModels: [
      {
        id: 'model-a',
        name: 'Model A',
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

    if (existingIndex >= 0) {
      vehicleModels[existingIndex] = model;
    } else {
      vehicleModels.push(model);
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
