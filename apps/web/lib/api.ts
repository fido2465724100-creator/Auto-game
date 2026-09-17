import type {
  GameState,
  Technology,
  Region,
  VehicleModel,
  VehicleComponentWithStatus,
  LoanTemplate,
  MaterialMarketItem,
  MaterialType,
  CountryId,
  FounderPerk,
  BadgeDesign,
  Competitor,
  CompetitorMilestone,
} from '@ait/shared-types';
import { browserGameEngine } from './browserGameEngine';

const CONFIGURED_API_URL = process.env.NEXT_PUBLIC_API_URL?.trim();

function isBrowserOnlyMode(): boolean {
  if (typeof window !== 'undefined') {
    if (
      window.location.hostname.endsWith('github.io') ||
      window.location.hostname.endsWith('pages.dev') ||
      window.location.protocol === 'file:'
    ) {
      return true;
    }
  }
  return process.env.NEXT_PUBLIC_FORCE_BROWSER_ENGINE === 'true';
}

function getApiBaseUrl(): string {
  if (CONFIGURED_API_URL) {
    return CONFIGURED_API_URL.replace(/\/$/, '');
  }

  if (typeof window !== 'undefined') {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:4000';
    }
    return window.location.origin;
  }

  return 'http://localhost:4000';
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`API ${path} failed with status ${response.status}`);
  }

  return (await response.json()) as T;
}

export const api = {
  getGameState: async (): Promise<GameState> => {
    if (isBrowserOnlyMode()) return browserGameEngine.getGameState();
    try {
      return await request<GameState>('/game/state');
    } catch {
      return browserGameEngine.getGameState();
    }
  },

  endTurn: async (): Promise<GameState> => {
    if (isBrowserOnlyMode()) return browserGameEngine.endTurn();
    try {
      return await request<GameState>('/game/end-turn', { method: 'POST' });
    } catch {
      return browserGameEngine.endTurn();
    }
  },

  getTechnologies: async (): Promise<Array<Technology & { status: string }>> => {
    if (isBrowserOnlyMode()) return browserGameEngine.getTechnologies();
    try {
      return await request<Array<Technology & { status: string }>>('/game/technologies');
    } catch {
      return browserGameEngine.getTechnologies();
    }
  },

  startResearch: async (technologyId: string, allocatedBudget: number): Promise<GameState> => {
    if (isBrowserOnlyMode()) return browserGameEngine.startResearch(technologyId, allocatedBudget);
    try {
      return await request<GameState>('/game/research/start', {
        method: 'POST',
        body: JSON.stringify({ technologyId, allocatedBudget }),
      });
    } catch {
      return browserGameEngine.startResearch(technologyId, allocatedBudget);
    }
  },

  saveVehicleModel: async (model: VehicleModel): Promise<GameState> => {
    if (isBrowserOnlyMode()) return browserGameEngine.saveVehicleModel(model);
    try {
      return await request<GameState>('/game/vehicles', {
        method: 'POST',
        body: JSON.stringify(model),
      });
    } catch {
      return browserGameEngine.saveVehicleModel(model);
    }
  },

  getRegions: async (): Promise<Region[]> => {
    if (isBrowserOnlyMode()) return browserGameEngine.getRegions();
    try {
      return await request<Region[]>('/game/regions');
    } catch {
      return browserGameEngine.getRegions();
    }
  },

  getVehicleComponents: async (): Promise<VehicleComponentWithStatus[]> => {
    if (isBrowserOnlyMode()) return browserGameEngine.getVehicleComponents();
    try {
      return await request<VehicleComponentWithStatus[]>('/game/components');
    } catch {
      return browserGameEngine.getVehicleComponents();
    }
  },

  getLoanTemplates: async (): Promise<LoanTemplate[]> => {
    if (isBrowserOnlyMode()) return browserGameEngine.getLoanTemplates();
    try {
      return await request<LoanTemplate[]>('/game/bank/templates');
    } catch {
      return browserGameEngine.getLoanTemplates();
    }
  },

  takeLoan: async (templateId: string): Promise<GameState> => {
    if (isBrowserOnlyMode()) return browserGameEngine.takeLoan(templateId);
    try {
      return await request<GameState>('/game/bank/loan', {
        method: 'POST',
        body: JSON.stringify({ templateId }),
      });
    } catch {
      return browserGameEngine.takeLoan(templateId);
    }
  },

  repayLoan: async (loanId: string): Promise<GameState> => {
    if (isBrowserOnlyMode()) return browserGameEngine.repayLoan(loanId);
    try {
      return await request<GameState>('/game/bank/repay', {
        method: 'POST',
        body: JSON.stringify({ loanId }),
      });
    } catch {
      return browserGameEngine.repayLoan(loanId);
    }
  },

  getMaterialsMarket: async (): Promise<MaterialMarketItem[]> => {
    if (isBrowserOnlyMode()) return browserGameEngine.getMaterialsMarket();
    try {
      return await request<MaterialMarketItem[]>('/game/materials/market');
    } catch {
      return browserGameEngine.getMaterialsMarket();
    }
  },

  buyMaterial: async (materialId: MaterialType, amount: number): Promise<GameState> => {
    if (isBrowserOnlyMode()) return browserGameEngine.buyMaterial(materialId, amount);
    try {
      return await request<GameState>('/game/materials/buy', {
        method: 'POST',
        body: JSON.stringify({ materialId, amount }),
      });
    } catch {
      return browserGameEngine.buyMaterial(materialId, amount);
    }
  },

  setAutoProcurement: async (enabled: boolean): Promise<GameState> => {
    if (isBrowserOnlyMode()) return browserGameEngine.setAutoProcurement(enabled);
    try {
      return await request<GameState>('/game/materials/auto-procurement', {
        method: 'POST',
        body: JSON.stringify({ enabled }),
      });
    } catch {
      return browserGameEngine.setAutoProcurement(enabled);
    }
  },

  expandFactory: async (): Promise<GameState> => {
    if (isBrowserOnlyMode()) return browserGameEngine.expandFactory();
    try {
      return await request<GameState>('/game/factory/expand', { method: 'POST' });
    } catch {
      return browserGameEngine.expandFactory();
    }
  },

  updateProductionPlan: async (productionPlan: Record<string, number>): Promise<GameState> => {
    if (isBrowserOnlyMode()) return browserGameEngine.updateProductionPlan(productionPlan);
    try {
      return await request<GameState>('/game/production', {
        method: 'PATCH',
        body: JSON.stringify({ productionPlan }),
      });
    } catch {
      return browserGameEngine.updateProductionPlan(productionPlan);
    }
  },

  setupCompany: async (dto: {
    name: string;
    country: CountryId;
    founderPerk: FounderPerk;
    badge: BadgeDesign;
  }): Promise<GameState> => {
    if (isBrowserOnlyMode()) return browserGameEngine.setupCompany(dto);
    try {
      return await request<GameState>('/game/company/setup', {
        method: 'POST',
        body: JSON.stringify(dto),
      });
    } catch {
      return browserGameEngine.setupCompany(dto);
    }
  },

  getCompetitors: async (): Promise<{ competitors: Competitor[]; milestones: CompetitorMilestone[] }> => {
    if (isBrowserOnlyMode()) return browserGameEngine.getCompetitors();
    try {
      return await request<{ competitors: Competitor[]; milestones: CompetitorMilestone[] }>('/game/competitors');
    } catch {
      return browserGameEngine.getCompetitors();
    }
  },

  resetGame: async (
    dto?: Partial<{ name: string; country: CountryId; founderPerk: FounderPerk; badge: BadgeDesign }>
  ): Promise<GameState> => {
    if (isBrowserOnlyMode()) return browserGameEngine.resetGame(dto);
    try {
      return await request<GameState>('/game/reset', {
        method: 'POST',
        body: JSON.stringify(dto ?? {}),
      });
    } catch {
      return browserGameEngine.resetGame(dto);
    }
  },

  exportSave: async (): Promise<string> => {
    return browserGameEngine.exportSave();
  },

  importSave: async (jsonString: string): Promise<GameState> => {
    return browserGameEngine.importSave(jsonString);
  },
};
