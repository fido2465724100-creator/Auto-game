'use client';

import { useEffect, useState } from 'react';
import type { GameState } from '@ait/shared-types';
import { api } from '../../lib/api';

export default function ReportsPage(): JSX.Element {
  const [state, setState] = useState<GameState | null>(null);

  useEffect(() => {
    api.getGameState().then(setState).catch(() => setState(null));
  }, []);

  if (!state) return <p>Loading reports...</p>;

  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold">Monthly Reports</h2>
      {state.reportHistory.length === 0 ? <p>No reports yet.</p> : null}
      {state.reportHistory.map((report) => (
        <article key={report.id} className="rounded border border-stone-300 bg-[var(--paper)] p-4">
          <h3 className="font-semibold">
            {report.date.month}/{report.date.year}
          </h3>
          <p>Produced: {report.unitsProduced}</p>
          <p>Sold: {report.unitsSold}</p>
          <p>Revenue: ${report.revenue.toLocaleString()}</p>
          <p>Expenses: ${report.expenses.toLocaleString()}</p>
          <p>Profit: ${report.profit.toLocaleString()}</p>
        </article>
      ))}
    </section>
  );
}
