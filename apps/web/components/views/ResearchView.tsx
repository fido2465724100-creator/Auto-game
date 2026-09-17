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
      <header className="border-b border-[var(--border-subtle)] pb-3">
        <h2 className="text-2xl font-bold tracking-tight text-[var(--ink-heading)] era-heading">{t.research.title}</h2>
        <p className="text-sm text-[var(--ink-secondary)]">{t.research.subtitle}</p>
      </header>

      {error ? <div className="rounded-lg border border-rose-500/60 bg-rose-950/20 p-4 text-rose-300">{error}</div> : null}

      <div className="grid gap-4 md:grid-cols-2">
        {techs.map((tech) => {
          const status = tech.status;
          const statusText = t.research.statuses[status as keyof typeof t.research.statuses] ?? status;

          const badgeColor =
            status === 'completed'
              ? 'bg-emerald-950/40 text-emerald-300 border-emerald-600/50'
              : status === 'researching'
              ? 'bg-amber-950/40 text-amber-300 border-amber-500/60 animate-pulse'
              : status === 'available'
              ? 'era-badge-accent'
              : 'bg-[var(--surface-nested)] text-[var(--ink-secondary)] border-[var(--border-subtle)]';

          return (
            <article
              key={tech.id}
              className={`era-card p-5 shadow-sm flex flex-col justify-between space-y-3 transition ${
                status === 'completed' ? 'opacity-90' : status === 'locked' ? 'opacity-50' : ''
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-[var(--ink-heading)] era-heading text-base">
                    {t.technologies[tech.id]?.name ?? tech.name}
                  </h3>
                  <span className={`rounded border px-2 py-0.5 text-[11px] font-bold ${badgeColor}`}>
                    {statusText}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-[var(--ink-secondary)] mt-1 font-sans">
                  <span>{t.research.year}: <strong className="text-[var(--ink)]">{tech.yearAvailable}</strong></span>
                  <span>•</span>
                  <span>{t.research.budgetMonth}: <strong className="text-[var(--ink-value)]">$100</strong> <span className="text-[10px] opacity-70">($300 / кв.)</span></span>
                </div>

                <p className="my-3 text-xs text-[var(--ink-secondary)] leading-relaxed">
                  {t.technologies[tech.id]?.description ?? tech.description}
                </p>
              </div>

              {status === 'available' ? (
                <button
                  type="button"
                  disabled={pendingId === tech.id}
                  onClick={() => void handleStartResearch(tech.id)}
                  className="w-full rounded-lg btn-brass py-2 text-xs font-bold text-white shadow transition disabled:opacity-50 cursor-pointer"
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
