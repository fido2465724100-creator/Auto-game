'use client';

import { useEffect, useState } from 'react';
import type { GameState } from '@ait/shared-types';
import { api } from '../../lib/api';

export default function DashboardPage(): JSX.Element {
  const [state, setState] = useState<GameState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    api.getGameState().then(setState).catch((e) => setError(String(e)));
  }, []);

  const endTurn = async (): Promise<void> => {
    setPending(true);
    setError(null);
    try {
      const next = await api.endTurn();
      setState(next);
    } catch (e) {
      setError(String(e));
    } finally {
      setPending(false);
    }
  };

  if (error) return <p>{error}</p>;
  if (!state) return <p>Loading...</p>;

  const latest = state.reportHistory[0];

  return (
    <section className="space-y-4">
      <div className="rounded border border-stone-300 bg-[var(--paper)] p-4">
        <p>Date: {state.date.month}/{state.date.year}</p>
        <p>Cash: ${state.company.cash.toLocaleString()}</p>
        <p>Reputation: {state.company.reputation}</p>
        <p>Production capacity: {state.company.productionCapacity} units</p>
        <p>Active research: {state.activeResearch.length}</p>
        <button
          type="button"
          onClick={endTurn}
          disabled={pending}
          className="mt-3 rounded bg-[var(--accent)] px-4 py-2 text-white disabled:opacity-60"
        >
          {pending ? 'Simulating...' : 'End Turn'}
        </button>
      </div>

      <div className="rounded border border-stone-300 bg-[var(--paper)] p-4">
        <h2 className="font-semibold">Latest report</h2>
        {latest ? (
          <>
            <p>Revenue: ${latest.revenue.toLocaleString()}</p>
            <p>Expenses: ${latest.expenses.toLocaleString()}</p>
            <p>Profit: ${latest.profit.toLocaleString()}</p>
            <p>Units sold: {latest.unitsSold}</p>
          </>
        ) : (
          <p>No report yet. Finish first month.</p>
        )}
      </div>
    </section>
  );
}
