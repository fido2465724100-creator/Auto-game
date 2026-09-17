'use client';

import { useEffect, useState } from 'react';
import { useGame } from '../../context/GameContext';
import { useLanguage } from '../../lib/i18n';
import { api } from '../../lib/api';

type TechnologyWithStatus = Awaited<ReturnType<typeof api.getTechnologies>>[number];

export default function ResearchPage(): React.JSX.Element {
  const { startResearch, gameState } = useGame();
  const { t } = useLanguage();
  const [techs, setTechs] = useState<TechnologyWithStatus[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const load = (): void => {
    api.getTechnologies().then(setTechs).catch((e) => setError(String(e)));
  };

  useEffect(load, [gameState]);

  const handleStartResearch = async (technologyId: string): Promise<void> => {
    setPendingId(technologyId);
    try {
      await startResearch(technologyId, 100);
      load();
    } finally {
      setPendingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <header className="border-b border-stone-300 pb-3">
        <h2 className="text-2xl font-bold tracking-tight text-amber-950">{t.research.title}</h2>
        <p className="text-sm text-stone-600">{t.research.subtitle}</p>
      </header>

      {error ? <div className="rounded border border-red-300 bg-red-50 p-4 text-red-700">{error}</div> : null}

      <div className="grid gap-4 md:grid-cols-2">
        {techs.map((tech) => {
          const status = tech.status;
          const statusText = t.research.statuses[status as keyof typeof t.research.statuses] ?? status;

          const badgeColor =
            status === 'completed'
              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
              : status === 'researching'
              ? 'bg-amber-100 text-amber-850 border-amber-300 animate-pulse'
              : status === 'available'
              ? 'bg-blue-100 text-blue-800 border-blue-300'
              : 'bg-stone-200 text-stone-600 border-stone-300';

          return (
            <article
              key={tech.id}
              className={`rounded border border-stone-300 bg-[var(--paper)] p-5 shadow-sm flex flex-col justify-between space-y-3 transition ${
                status === 'completed' ? 'opacity-90' : status === 'locked' ? 'opacity-60' : ''
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-amber-950 text-base">
                    {t.technologies[tech.id]?.name ?? tech.name}
                  </h3>
                  <span className={`rounded border px-2 py-0.5 text-[11px] font-bold ${badgeColor}`}>
                    {statusText}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-stone-500 mt-1">
                  <span>{t.research.year}: <strong className="text-stone-700">{tech.yearAvailable}</strong></span>
                  <span>•</span>
                  <span>{t.research.budgetMonth}: <strong className="text-stone-700">$100</strong> <span className="text-[10px] text-stone-500">($300 / кв.)</span></span>
                </div>

                <p className="my-3 text-xs text-stone-700 leading-relaxed">
                  {t.technologies[tech.id]?.description ?? tech.description}
                </p>
              </div>

              {status === 'available' ? (
                <button
                  type="button"
                  disabled={pendingId === tech.id}
                  onClick={() => void handleStartResearch(tech.id)}
                  className="w-full rounded bg-[var(--accent)] py-2 text-xs font-bold text-white shadow hover:bg-amber-900 transition disabled:opacity-60 cursor-pointer"
                >
                  {pendingId === tech.id ? t.research.starting : t.research.startBtn}
                </button>
              ) : null}
            </article>
          );
        })}
      </div>
    </div>
  );
}
