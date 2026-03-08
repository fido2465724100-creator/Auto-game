import type { GameState, Technology, Region, VehicleModel } from '@ait/shared-types';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
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
