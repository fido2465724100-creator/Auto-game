'use client';

import Link from 'next/link';
import { useGame } from '../../context/GameContext';
import { useLanguage } from '../../lib/i18n';

export default function DashboardPage(): React.JSX.Element {
  const { gameState, loading, error } = useGame();
  const { t } = useLanguage();

  if (loading) return <p className="py-8 text-center text-stone-600">Загрузка данных компании...</p>;
  if (error) return <div className="rounded border border-red-300 bg-red-50 p-4 text-red-700">{error}</div>;
  if (!gameState) return <p>Нет данных</p>;

  const company = gameState.company;
  const latestReport = gameState.reportHistory[0];
  const activeModels = gameState.vehicleModels.filter((m) => m.active);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <header className="border-b border-stone-300 pb-3">
        <h2 className="text-2xl font-bold tracking-tight text-amber-950">{t.dashboard.title}</h2>
        <p className="text-sm text-stone-600">
          {company.name} — {t.brand}
        </p>
      </header>

      {/* 1. KEY METRICS TILES */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Cash */}
        <div className="rounded border border-stone-300 bg-[var(--paper)] p-4 shadow-xs">
          <span className="text-xs font-semibold text-stone-500 uppercase">{t.topbar.cash}</span>
          <div className="mt-1 text-2xl font-bold text-emerald-800">
            ${company.cash.toLocaleString()}
          </div>
          <span className="text-[11px] text-stone-500">Доступно на счетах</span>
        </div>

        {/* Capacity */}
        <div className="rounded border border-stone-300 bg-[var(--paper)] p-4 shadow-xs">
          <span className="text-xs font-semibold text-stone-500 uppercase">{t.dashboard.capacity}</span>
          <div className="mt-1 text-2xl font-bold text-amber-950">
            {company.productionCapacity} <span className="text-xs font-normal text-stone-600">{t.dashboard.unitsMonth}</span>
          </div>
          <span className="text-[11px] text-stone-500">Лимит сборочных цехов</span>
        </div>

        {/* Reputation */}
        <div className="rounded border border-stone-300 bg-[var(--paper)] p-4 shadow-xs">
          <span className="text-xs font-semibold text-stone-500 uppercase">{t.topbar.reputation}</span>
          <div className="mt-1 text-2xl font-bold text-amber-800">
            ★ {company.reputation} <span className="text-xs font-normal text-stone-500">/ 100</span>
          </div>
          <span className="text-[11px] text-stone-500">Престиж марки на рынках</span>
        </div>

        {/* Active Research */}
        <div className="rounded border border-stone-300 bg-[var(--paper)] p-4 shadow-xs">
          <span className="text-xs font-semibold text-stone-500 uppercase">{t.dashboard.activeResearchCount}</span>
          <div className="mt-1 text-2xl font-bold text-stone-800">
            {gameState.activeResearch.length}
          </div>
          <span className="text-[11px] text-stone-500">Проектов в лаборатории</span>
        </div>
      </div>

      {/* 2. LATEST REPORT SUMMARY */}
      <section className="rounded border border-stone-300 bg-[var(--paper)] p-5 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-amber-950 flex items-center gap-2">
          <span>📊</span> {t.dashboard.latestReport}
        </h3>

        {latestReport ? (
          <div className="grid gap-4 sm:grid-cols-4 border-t border-stone-200 pt-3 text-xs">
            <div>
              <span className="text-stone-500 block">{t.dashboard.revenue}:</span>
              <span className="font-bold text-stone-900 text-sm">${latestReport.revenue.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-stone-500 block">{t.dashboard.expenses}:</span>
              <span className="font-semibold text-stone-800 text-sm">${latestReport.expenses.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-stone-500 block">{t.dashboard.profit}:</span>
              <span
                className={`font-bold text-sm ${
                  latestReport.profit >= 0 ? 'text-emerald-700' : 'text-red-700'
                }`}
              >
                {latestReport.profit >= 0 ? '+' : ''}${latestReport.profit.toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-stone-500 block">{t.dashboard.carsSold}:</span>
              <span className="font-bold text-amber-950 text-sm">{latestReport.unitsSold} авто</span>
            </div>
          </div>
        ) : (
          <p className="text-xs text-stone-600 italic border-t border-stone-200 pt-3">
            {t.dashboard.noReport}
          </p>
        )}
      </section>

      {/* 3. ACTIVE VEHICLES SUMMARY */}
      <section className="rounded border border-stone-300 bg-[var(--paper)] p-5 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-amber-950 flex items-center gap-2">
            <span>🚗</span> {t.dashboard.activeModelsSummary} ({activeModels.length})
          </h3>
          <Link
            href="/vehicle-design"
            className="text-xs font-bold text-amber-900 hover:underline"
          >
            + Создать новую модель →
          </Link>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {activeModels.map((model) => (
            <div key={model.id} className="rounded border border-stone-200 bg-white p-3 text-xs space-y-1.5">
              <div className="flex justify-between items-start">
                <span className="font-bold text-stone-900">{model.name}</span>
                <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-900 capitalize">
                  {model.targetSegment}
                </span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Себестоимость: ${model.productionCost}</span>
                <span className="font-semibold text-stone-900">Цена: ${model.salePrice}</span>
              </div>
              <div className="flex justify-between text-stone-500 text-[11px] border-t border-stone-100 pt-1">
                <span>Надежность: {model.stats.reliability}</span>
                <span>Комфорт: {model.stats.comfort}</span>
                <span>Скорость: {model.stats.performance}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
