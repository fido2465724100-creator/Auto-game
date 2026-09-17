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
      <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg border border-amber-900/30 bg-[var(--paper)] p-5 shadow-2xl text-stone-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-300 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔬</span>
            <div>
              <h2 className="font-bold text-lg text-amber-950 font-serif">Научно-исследовательское бюро (НИОКР)</h2>
              <p className="text-xs text-stone-500">Выбор технологии для финансирования лаборатории</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded p-1 text-stone-400 hover:bg-stone-200 hover:text-stone-700 text-lg font-bold"
          >
            ✕
          </button>
        </div>

        {/* Budget selector */}
        <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-amber-50/80 border border-amber-200 rounded p-3 text-xs">
          <div>
            <span className="font-bold text-amber-950 block">Финансирование разработки:</span>
            <span className="text-[11px] text-stone-600">
              Текущий расход казны: <strong>${budget * 3} / квартал</strong> (${budget} / месяц)
            </span>
          </div>
          <div className="flex items-center gap-2">
            {BUDGET_TIERS.map((tier) => (
              <button
                key={tier.monthly}
                type="button"
                onClick={() => setBudget(tier.monthly)}
                className={`rounded px-2.5 py-1.5 font-bold transition text-xs cursor-pointer ${
                  budget === tier.monthly
                    ? 'bg-amber-900 text-white shadow-sm'
                    : 'bg-white border border-stone-300 text-stone-700 hover:bg-stone-100'
                }`}
              >
                <div>{tier.label}</div>
                <div className="text-[10px] font-normal opacity-90">${tier.quarterly}/кв.</div>
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-sm text-stone-500">Сбор патентных заявок...</div>
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
                  className={`rounded border p-3 flex flex-col justify-between text-xs space-y-2 transition ${
                    isCompleted
                      ? 'border-emerald-300 bg-emerald-50/40 text-stone-700'
                      : isResearching
                      ? 'border-amber-400 bg-amber-50/60 ring-1 ring-amber-400'
                      : isAvailable
                      ? 'border-stone-300 bg-white hover:border-amber-700/40'
                      : 'border-stone-200 bg-stone-100/60 opacity-60'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-1 mb-1">
                      <span className="font-bold text-stone-900 font-serif leading-tight">{name}</span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap ${
                          isCompleted
                            ? 'bg-emerald-100 text-emerald-800'
                            : isResearching
                            ? 'bg-amber-200 text-amber-900'
                            : isAvailable
                            ? 'bg-stone-200 text-stone-800'
                            : 'bg-stone-200 text-stone-500'
                        }`}
                      >
                        {isCompleted && '✓ Изучено'}
                        {isResearching && '⚙️ В работе'}
                        {isAvailable && 'Доступно'}
                        {isLocked && '🔒 Закрыто'}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-600 line-clamp-2">{desc}</p>
                  </div>

                  <div className="flex items-center justify-between border-t border-stone-200/60 pt-2 text-[11px] text-stone-500">
                    <span>Срок: ~{Math.ceil(tech.researchDurationMonths / 3)} кв.</span>
                    {isAvailable && (
                      <button
                        type="button"
                        disabled={startingId === tech.id || currentCash < budget}
                        onClick={() => handleStart(tech.id)}
                        className="rounded bg-amber-900 px-3 py-1 font-bold text-white hover:bg-amber-950 disabled:opacity-50 text-[11px]"
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
