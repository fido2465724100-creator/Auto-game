'use client';

import React, { useEffect, useState } from 'react';
import type { Technology } from '@ait/shared-types';
import { useGame } from '../context/GameContext';
import { useLanguage } from '../lib/i18n';
import { api } from '../lib/api';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onStarted?: () => void;
}

export function QuickResearchModal({ isOpen, onClose, onStarted }: Props): React.JSX.Element | null {
  const { gameState, startResearch } = useGame();
  const { t } = useLanguage();

  const [technologies, setTechnologies] = useState<Array<Technology & { status: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [startingId, setStartingId] = useState<string | null>(null);
  const [budget, setBudget] = useState<number>(100);

  const currentCash = gameState?.company.cash ?? 0;

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      api.getTechnologies()
        .then(setTechnologies)
        .catch(() => setTechnologies([]))
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleStart = async (techId: string) => {
    setStartingId(techId);
    try {
      await startResearch(techId, budget);
      onStarted?.();
      onClose();
    } catch (err) {
      alert(`Ошибка: ${String(err)}`);
    } finally {
      setStartingId(null);
    }
  };

  const BUDGET_TIERS = [
    { monthly: 50, quarterly: 150, label: 'Эконом' },
    { monthly: 100, quarterly: 300, label: 'Стандарт' },
    { monthly: 200, quarterly: 600, label: 'Ускоренный' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 backdrop-blur-xs">
      <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl border border-[var(--border-subtle)] bg-[var(--paper)] p-5 shadow-2xl text-[var(--ink)]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔬</span>
            <div>
              <h2 className="font-bold text-lg text-[var(--ink-heading)] era-heading">Научно-исследовательское бюро (НИОКР)</h2>
              <p className="text-xs text-[var(--ink-secondary)]">Выбор технологии для финансирования лаборатории</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded p-1 text-[var(--ink-secondary)] hover:text-[var(--ink)] text-lg font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Budget selector */}
        <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-[var(--surface-nested)] border border-[var(--border-subtle)] rounded-lg p-3 text-xs">
          <div>
            <span className="font-bold text-[var(--ink-heading)] block">Финансирование разработки:</span>
            <span className="text-[11px] text-[var(--ink-secondary)]">
              Текущий расход казны: <strong className="text-[var(--ink-value)]">${budget * 3} / квартал</strong> (${budget} / месяц)
            </span>
          </div>
          <div className="flex items-center gap-2">
            {BUDGET_TIERS.map((tier) => (
              <button
                key={tier.monthly}
                type="button"
                onClick={() => setBudget(tier.monthly)}
                className={`rounded-lg px-2.5 py-1.5 font-bold transition text-xs cursor-pointer ${
                  budget === tier.monthly
                    ? 'btn-brass text-white shadow-sm'
                    : 'bg-[var(--paper)] border border-[var(--border-subtle)] text-[var(--ink)] hover:bg-[var(--surface-nested)]'
                }`}
              >
                <div>{tier.label}</div>
                <div className="text-[10px] font-normal opacity-90">${tier.quarterly}/кв.</div>
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-sm text-[var(--ink-secondary)]">Сбор патентных заявок...</div>
        ) : (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {technologies.map((tech) => {
              const tr = t.technologies[tech.id as keyof typeof t.technologies];
              const name = tr?.name ?? tech.name;
              const desc = tr?.description ?? tech.description;

              const isCompleted = tech.status === 'completed';
              const isResearching = tech.status === 'researching';
              const isAvailable = tech.status === 'available';
              const isLocked = tech.status === 'locked';

              return (
                <div
                  key={tech.id}
                  className={`rounded-lg border p-3 flex flex-col justify-between text-xs space-y-2 transition ${
                    isCompleted
                      ? 'border-emerald-600/50 bg-emerald-950/20 text-[var(--ink)]'
                      : isResearching
                      ? 'border-amber-500/60 bg-amber-950/20 ring-1 ring-amber-500/40'
                      : isAvailable
                      ? 'border-[var(--border-subtle)] bg-[var(--surface-nested)] hover:border-[var(--border-brass)]'
                      : 'border-[var(--border-subtle)] bg-[var(--surface-nested)] opacity-40'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-1 mb-1">
                      <span className="font-bold text-[var(--ink-heading)] era-heading leading-tight">{name}</span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap ${
                          isCompleted
                            ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-600/50'
                            : isResearching
                            ? 'bg-amber-950/40 text-amber-300 border border-amber-500/60'
                            : isAvailable
                            ? 'era-badge-accent'
                            : 'bg-[var(--surface-nested)] text-[var(--ink-secondary)] border border-[var(--border-subtle)]'
                        }`}
                      >
                        {isCompleted && '✓ Изучено'}
                        {isResearching && '⚙️ В работе'}
                        {isAvailable && 'Доступно'}
                        {isLocked && '🔒 Закрыто'}
                      </span>
                    </div>
                    <p className="text-[11px] text-[var(--ink-secondary)] line-clamp-2">{desc}</p>
                  </div>

                  <div className="flex items-center justify-between border-t border-[var(--border-subtle)] pt-2 text-[11px] text-[var(--ink-secondary)]">
                    <span>Срок: ~{Math.ceil(tech.researchDurationMonths / 3)} кв.</span>
                    {isAvailable && (
                      <button
                        type="button"
                        disabled={startingId === tech.id || currentCash < budget}
                        onClick={() => handleStart(tech.id)}
                        className="rounded-lg btn-brass px-3 py-1 font-bold text-white disabled:opacity-50 text-[11px] cursor-pointer"
                      >
                        {startingId === tech.id ? 'Запуск...' : 'Начать проект'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
