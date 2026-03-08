import type { GameState, Technology, Region, VehicleModel } from '@ait/shared-types';

const CONFIGURED_API_URL = process.env.NEXT_PUBLIC_API_URL?.trim();

function getApiBaseUrl(): string {
  if (CONFIGURED_API_URL) {
    return CONFIGURED_API_URL.replace(/\/$/, '');
  }

  // In browser/hosting, use same origin by default to avoid mixed-content errors.
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }

  // SSR/local dev fallback when no env is provided.
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
};
