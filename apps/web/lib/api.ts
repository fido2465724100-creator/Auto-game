import type { GameState, Technology, Region, VehicleModel, VehicleComponentWithStatus, LoanTemplate } from '@ait/shared-types';

const CONFIGURED_API_URL = process.env.NEXT_PUBLIC_API_URL?.trim();

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
  getGameState: () => request<GameState>('/game/state'),
  endTurn: () => request<GameState>('/game/end-turn', { method: 'POST' }),
  getTechnologies: () => request<Array<Technology & { status: string }>>('/game/technologies'),
  startResearch: (technologyId: string, allocatedBudget: number) =>
    request<GameState>('/game/research/start', {
      method: 'POST',
      body: JSON.stringify({ technologyId, allocatedBudget }),
    }),
  saveVehicleModel: (model: VehicleModel) =>
    request<GameState>('/game/vehicles', { method: 'POST', body: JSON.stringify(model) }),
  getRegions: () => request<Region[]>('/game/regions'),
  getVehicleComponents: () => request<VehicleComponentWithStatus[]>('/game/components'),
  getLoanTemplates: () => request<LoanTemplate[]>('/game/bank/templates'),
  takeLoan: (templateId: string) =>
    request<GameState>('/game/bank/loan', { method: 'POST', body: JSON.stringify({ templateId }) }),
  repayLoan: (loanId: string) =>
    request<GameState>('/game/bank/repay', { method: 'POST', body: JSON.stringify({ loanId }) }),
};
