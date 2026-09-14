'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { GameState, VehicleModel, MaterialType } from '@ait/shared-types';
import { api } from '../lib/api';

interface GameContextType {
  gameState: GameState | null;
  loading: boolean;
  error: string | null;
  pendingEndTurn: boolean;
  refreshState: () => Promise<void>;
  endTurn: () => Promise<void>;
  takeLoan: (templateId: string) => Promise<void>;
  repayLoan: (loanId: string) => Promise<void>;
  saveVehicleModel: (model: VehicleModel) => Promise<void>;
  startResearch: (technologyId: string, budget: number) => Promise<void>;
  updateProductionPlan: (plan: Record<string, number>) => Promise<void>;
  buyMaterial: (materialId: MaterialType, amount: number) => Promise<void>;
  setAutoProcurement: (enabled: boolean) => Promise<void>;
  expandFactory: () => Promise<void>;
}

const GameContext = createContext<GameContextType>({
  gameState: null,
  loading: true,
  error: null,
  pendingEndTurn: false,
  refreshState: async () => {},
  endTurn: async () => {},
  takeLoan: async () => {},
  repayLoan: async () => {},
  saveVehicleModel: async () => {},
  startResearch: async () => {},
  updateProductionPlan: async () => {},
  buyMaterial: async () => {},
  setAutoProcurement: async () => {},
  expandFactory: async () => {},
});

export function GameProvider({ children }: { children: ReactNode }): React.JSX.Element {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingEndTurn, setPendingEndTurn] = useState(false);

  const refreshState = async (): Promise<void> => {
    try {
      const state = await api.getGameState();
      setGameState(state);
      setError(null);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refreshState();
  }, []);

  const endTurn = async (): Promise<void> => {
    setPendingEndTurn(true);
    try {
      const updated = await api.endTurn();
      setGameState(updated);
      setError(null);
    } catch (err) {
      setError(String(err));
    } finally {
      setPendingEndTurn(false);
    }
  };

  const takeLoan = async (templateId: string): Promise<void> => {
    const updated = await api.takeLoan(templateId);
    setGameState(updated);
  };

  const repayLoan = async (loanId: string): Promise<void> => {
    const updated = await api.repayLoan(loanId);
    setGameState(updated);
  };

  const saveVehicleModel = async (model: VehicleModel): Promise<void> => {
    const updated = await api.saveVehicleModel(model);
    setGameState(updated);
  };

  const startResearch = async (technologyId: string, budget: number): Promise<void> => {
    const updated = await api.startResearch(technologyId, budget);
    setGameState(updated);
  };

  const updateProductionPlan = async (plan: Record<string, number>): Promise<void> => {
    const updated = await api.updateProductionPlan(plan);
    setGameState(updated);
  };

  const buyMaterial = async (materialId: MaterialType, amount: number): Promise<void> => {
    const updated = await api.buyMaterial(materialId, amount);
    setGameState(updated);
  };

  const setAutoProcurement = async (enabled: boolean): Promise<void> => {
    const updated = await api.setAutoProcurement(enabled);
    setGameState(updated);
  };

  const expandFactory = async (): Promise<void> => {
    const updated = await api.expandFactory();
    setGameState(updated);
  };

  return (
    <GameContext.Provider
      value={{
        gameState,
        loading,
        error,
        pendingEndTurn,
        refreshState,
        endTurn,
        takeLoan,
        repayLoan,
        saveVehicleModel,
        startResearch,
        updateProductionPlan,
        buyMaterial,
        setAutoProcurement,
        expandFactory,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame(): GameContextType {
  return useContext(GameContext);
}
