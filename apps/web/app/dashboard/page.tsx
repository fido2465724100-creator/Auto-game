'use client';

import React, { useState, useMemo, useEffect } from 'react';
import type { MaterialType } from '@ait/shared-types';
import { useGame } from '../../context/GameContext';
import { useLanguage } from '../../lib/i18n';
import { getEraTheme } from '../../lib/eraTheme';
import { CarBlueprintSilhouette } from '../../components/CarBlueprintSilhouette';
import { QuickVehicleDesignModal } from '../../components/QuickVehicleDesignModal';
import { QuickResearchModal } from '../../components/QuickResearchModal';
import { MorningGazetteModal } from '../../components/MorningGazetteModal';

import VehicleDesignView from '../../components/views/VehicleDesignView';
import ProductionView from '../../components/views/ProductionView';
import ResearchView from '../../components/views/ResearchView';
import MarketsView from '../../components/views/MarketsView';
import BankView from '../../components/views/BankView';
import ReportsView from '../../components/views/ReportsView';
import GameGuideView from '../../components/views/GameGuideView';

export type WorkspaceTab =
  | 'overview'
  | 'design'
  | 'production'
  | 'research'
  | 'markets'
  | 'bank'
  | 'reports'
  | 'guide';

const DESK_TABS: Array<{ id: WorkspaceTab; labelRu: string; labelEn: string; icon: string }> = [
  { id: 'overview', labelRu: 'Кабинет управляющего', labelEn: 'Executive Desk', icon: '🏛️' },
  { id: 'design', labelRu: 'Конструктор моделей', labelEn: 'Vehicle Design', icon: '🚗' },
  { id: 'production', labelRu: 'Завод и Склады', labelEn: 'Factory & Assembly', icon: '🏭' },
  { id: 'research', labelRu: 'Лаборатория НИОКР', labelEn: 'R&D Laboratory', icon: '🔬' },
  { id: 'markets', labelRu: 'Рынки и Конкуренты', labelEn: 'Markets & Sales', icon: '🌐' },
  { id: 'bank', labelRu: 'Казначейство и Банк', labelEn: 'Treasury & Bank', icon: '🏦' },
  { id: 'reports', labelRu: 'Финансовая хроника', labelEn: 'Ledgers & Gazette', icon: '📜' },
  { id: 'guide', labelRu: 'Справочник и Правила', labelEn: 'Guide & Rules', icon: '📖' },
];

const MATERIAL_ICONS: Record<MaterialType, string> = {
  steel: '⚙️',
  wood: '🪵',
  rubber: '🛞',
  leather: '🛋️',
  aluminum: '✈️',
  plastic: '🧪',
};

export default function DashboardPage(): React.JSX.Element {
  const {
    gameState,
    loading,
    error,
    updateProductionPlan,
    setAutoProcurement,
    buyMaterial,
    takeLoan,
    setHallOfFameOpen,
  } = useGame();
  const { t, lang } = useLanguage();

  // Modals state
  const [isDesignModalOpen, setIsDesignModalOpen] = useState(false);
  const [isResearchModalOpen, setIsResearchModalOpen] = useState(false);
  const [isGazetteModalOpen, setIsGazetteModalOpen] = useState(false);

  // Active Desk Workspace Tab (Single Unified Window)
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('overview');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get('tab') as WorkspaceTab;
      if (
        tab &&
        ['overview', 'design', 'production', 'research', 'markets', 'bank', 'reports', 'guide'].includes(tab)
      ) {
        setActiveTab(tab);
      }
    }
  }, []);

  const handleTabChange = (tab: WorkspaceTab) => {
    setActiveTab(tab);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (tab === 'overview') {
        url.searchParams.delete('tab');
      } else {
        url.searchParams.set('tab', tab);
      }
      window.history.pushState({}, '', url.toString());
    }
  };

  // Local state for plan draft to allow immediate editing
  const [planDraft, setPlanDraft] = useState<Record<string, number>>({});
  const [planSaving, setPlanSaving] = useState(false);
  const [planSavedNotice, setPlanSavedNotice] = useState(false);

  // Sync plan draft with game state
  useEffect(() => {
    if (gameState?.productionPlan) {
      setPlanDraft(gameState.productionPlan);
    }
  }, [gameState?.productionPlan]);

  // Open Gazette when new turn report arrives
  const latestReport = gameState?.reportHistory?.[0] ?? null;
  const prevReportIdRef = React.useRef<string | null>(null);

  useEffect(() => {
    if (latestReport && latestReport.id !== prevReportIdRef.current) {
      if (prevReportIdRef.current !== null) {
        setIsGazetteModalOpen(true);
      }
      prevReportIdRef.current = latestReport.id;
    }
  }, [latestReport]);

  if (loading) {
    return (
      <div className="py-16 text-center text-stone-500 font-serif">
        <span className="text-2xl animate-spin inline-block mr-2">⚙️</span>
        Загрузка командного центра...
      </div>
    );
  }

  if (error) {
    return <div className="rounded border border-red-300 bg-red-50 p-4 text-red-700">{error}</div>;
  }

  if (!gameState) {
    return <p className="py-8 text-center text-stone-500">Нет данных о компании</p>;
  }

  const company = gameState.company;
  const currentYear = gameState.date.year;
  const currentQuarter = gameState.date.quarter ?? 1;
  const eraTheme = getEraTheme(currentYear);

  const factory = company.factory ?? {
    name: 'Мастерская №1',
    level: 1,
    capacity: company.productionCapacity,
    monthlyOverhead: 200,
    upgradeCost: 6000,
  };

  const activeModels = gameState.vehicleModels.filter((m) => m.active);
  const isAutoProcure = company.autoProcurement ?? true;
  const inventory = company.inventoryMaterials ?? { steel: 0, wood: 0, rubber: 0, leather: 0, aluminum: 0, plastic: 0 };

  // Calculate planned units & material demand
  const totalPlannedUnits = Object.values(planDraft).reduce((sum, n) => sum + (n || 0), 0);
  const isOverCapacity = totalPlannedUnits > factory.capacity;

  const materialDemand: Record<MaterialType, number> = {
    steel: 0,
    wood: 0,
    rubber: 0,
    leather: 0,
    aluminum: 0,
    plastic: 0,
  };

  const scale = totalPlannedUnits > factory.capacity && totalPlannedUnits > 0
    ? factory.capacity / totalPlannedUnits
    : 1;

  for (const model of activeModels) {
    const planned = planDraft[model.id] ?? 0;
    if (planned <= 0) continue;
    const effectiveUnits = Math.round(planned * scale);
    const req = model.materialsRequired ?? {};
    for (const [mat, amount] of Object.entries(req)) {
      const m = mat as MaterialType;
      materialDemand[m] = (materialDemand[m] ?? 0) + (amount ?? 0) * effectiveUnits;
    }
  }

  const hasShortage = (Object.keys(materialDemand) as MaterialType[]).some(
    (mat) => materialDemand[mat] > (inventory[mat] ?? 0)
  );

  // Active Research Project
  const activeResearch = gameState.activeResearch?.[0] ?? null;

  // Active Loans
  const activeLoans = company.loans ?? [];
  const totalQuarterlyLoanPayment = activeLoans.reduce((sum, l) => sum + l.monthlyPayment * 3, 0);

  // Quota change handlers
  const handleQuotaChange = (modelId: string, val: number) => {
    setPlanDraft((prev) => ({
      ...prev,
      [modelId]: Math.max(0, val),
    }));
  };

  const handleSavePlan = async () => {
    setPlanSaving(true);
    try {
      await updateProductionPlan(planDraft);
      setPlanSavedNotice(true);
      setTimeout(() => setPlanSavedNotice(false), 2500);
    } finally {
      setPlanSaving(false);
    }
  };

  // Quick purchase of a missing material
  const handleQuickBuy = async (mat: MaterialType, amount: number) => {
    try {
      await buyMaterial(mat, amount);
    } catch (err) {
      alert(`Не удалось закупить сырье: ${String(err)}`);
    }
  };

  // Quick take emergency loan
  const handleQuickLoan = async () => {
    try {
      await takeLoan('short-overdraft');
    } catch (err) {
      alert(`Ошибка банка: ${String(err)}`);
    }
  };

  return (
    <div className="space-y-4">
      {/* 1. ERA & ADVISOR STATUS BAR */}
      <section className="rounded-lg border border-amber-900/20 bg-[var(--paper)] p-4 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        {/* Left: Era material identity */}
        <div className="flex items-center gap-3">
          <span className="text-3xl p-2 rounded bg-amber-100/60 border border-amber-900/10 select-none">
            {eraTheme.icon}
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif font-bold text-base text-amber-950">{eraTheme.nameRu}</h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-200/60 text-amber-900 font-semibold">
                {currentYear} г. ({currentQuarter}/4 кв.)
              </span>
            </div>
            <p className="text-xs text-stone-600 font-serif italic">
              Материалы и стиль эпохи: <strong className="text-stone-800">{eraTheme.materialRu}</strong>
            </p>
          </div>
        </div>

        {/* Right: Quick actions (Newspaper & Design Car) */}
        <div className="flex items-center gap-2 self-stretch md:self-auto">
          {latestReport && (
            <button
              type="button"
              onClick={() => setIsGazetteModalOpen(true)}
              className="flex-1 md:flex-initial rounded border border-amber-900/30 bg-amber-50 px-3 py-1.5 text-xs font-serif font-bold text-amber-950 hover:bg-amber-100 shadow-xs flex items-center justify-center gap-1.5"
            >
              <span>📰</span>
              <span>Свежий выпуск газеты</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsDesignModalOpen(true)}
            className="flex-1 md:flex-initial rounded bg-amber-900 px-3.5 py-1.5 text-xs font-serif font-bold text-white hover:bg-amber-950 shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>📐</span>
            <span>+ Спроектировать модель</span>
          </button>

          <button
            type="button"
            onClick={() => setHallOfFameOpen(true)}
            className="flex-1 md:flex-initial rounded border border-amber-900/30 bg-amber-50 px-3 py-1.5 text-xs font-serif font-bold text-amber-950 hover:bg-amber-100 shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
            title="Зал Славы, Ордена и Сохранения"
          >
            <span>🏆</span>
            <span>{lang === 'en' ? 'Trophies' : 'Зал славы'}</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('guide')}
            className="flex-1 md:flex-initial rounded border border-amber-900/30 bg-amber-50 px-3 py-1.5 text-xs font-serif font-bold text-amber-950 hover:bg-amber-100 shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
            title="Руководство промышленника и правила игры"
          >
            <span>📖</span>
            <span>{lang === 'en' ? 'Handbook' : 'Справочник'}</span>
          </button>
        </div>
      </section>

      {/* 2. UNIFIED WORKSPACE DESK DOCK (ЕДИНОЕ ОКНО) */}
      <nav className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-stone-300/80">
        {DESK_TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabChange(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-t-lg text-xs font-serif font-bold transition-all whitespace-nowrap cursor-pointer select-none border-t border-x ${
                isActive
                  ? 'bg-[var(--paper)] text-amber-950 border-t-amber-800 border-x-stone-300 border-t-2 shadow-xs -mb-[1px] z-10'
                  : 'bg-stone-100/70 border-transparent text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
              }`}
            >
              <span className="text-sm">{tab.icon}</span>
              <span>{lang === 'en' ? tab.labelEn : tab.labelRu}</span>
            </button>
          );
        })}
      </nav>

      {/* 3. EXECUTIVE COMMAND DESK (ОБЗОР) */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          {/* ADVISORS LIVE FEEDBACK STRIP */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        {/* Chief Mechanic */}
        <div className="rounded border border-stone-200 bg-[var(--paper)] p-2.5 flex items-start gap-2 shadow-2xs">
          <span className="text-lg">👨‍🔧</span>
          <div className="leading-snug">
            <span className="font-bold text-stone-900 block font-serif">{eraTheme.advisorTitles.engineerRu}:</span>
            <span className="text-stone-600">
              {hasShortage
                ? 'Сэр, запасы сырья на исходе! Часть сборочных постов может встать.'
                : activeResearch
                ? `Лаборатория работает над: ${t.technologies[activeResearch.technologyId as keyof typeof t.technologies]?.name ?? activeResearch.technologyId}.`
                : 'Конструкторы свободны. Откройте новый исследовательский проект!'}
            </span>
          </div>
        </div>

        {/* Treasurer */}
        <div className="rounded border border-stone-200 bg-[var(--paper)] p-2.5 flex items-start gap-2 shadow-2xs">
          <span className="text-lg">💼</span>
          <div className="leading-snug">
            <span className="font-bold text-stone-900 block font-serif">{eraTheme.advisorTitles.financeRu}:</span>
            <span className="text-stone-600">
              {company.cash < 2500
                ? 'Оборотный капитал на минимуме! Рекомендуется привлечь банковский заем.'
                : activeLoans.length > 0
                ? `Обслуживаем ${activeLoans.length} займа (-$${totalQuarterlyLoanPayment.toLocaleString()} / кв.). Казна стабильна.`
                : `Свободный капитал $${company.cash.toLocaleString()}. Финансы в идеальном порядке.`}
            </span>
          </div>
        </div>

        {/* Plant Foreman */}
        <div className="rounded border border-stone-200 bg-[var(--paper)] p-2.5 flex items-start gap-2 shadow-2xs">
          <span className="text-lg">🏭</span>
          <div className="leading-snug">
            <span className="font-bold text-stone-900 block font-serif">{eraTheme.advisorTitles.plantRu}:</span>
            <span className="text-stone-600">
              {isOverCapacity
                ? `Перегруз! Запланировано ${totalPlannedUnits} при лимите цеха ${factory.capacity} авто/кв.`
                : `Загрузка линий: ${totalPlannedUnits} / ${factory.capacity} авто/кв. (${Math.round((totalPlannedUnits / factory.capacity) * 100)}%).`}
            </span>
          </div>
        </div>
      </section>

      {/* 3. MAIN WORKSPACE GRID: FACTORY (LEFT 7/12) & DISPATCH/RESEARCH (RIGHT 5/12) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* ================= LEFT COLUMN: THE FACTORY FLOOR ================= */}
        <div className="lg:col-span-7 space-y-4">
          {/* Active Production Lines */}
          <section className="rounded-lg border border-stone-300 bg-[var(--paper)] p-4 shadow-sm space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200 pb-2.5">
              <div>
                <h3 className="font-serif font-bold text-base text-amber-950 flex items-center gap-2">
                  <span>🚗</span>
                  <span>Сборочные посты и производство</span>
                </h3>
                <span className="text-xs text-stone-500">
                  {factory.name} • Мощность: <strong>{factory.capacity} авто/кв.</strong> • Содержание: <strong>${factory.monthlyOverhead * 3}/кв.</strong>
                </span>
              </div>

              <div className="flex items-center gap-2">
                {planSavedNotice && (
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded animate-pulse">
                    ✓ План сохранен
                  </span>
                )}
                <button
                  type="button"
                  disabled={planSaving}
                  onClick={handleSavePlan}
                  className="rounded bg-amber-900 px-3 py-1 text-xs font-bold text-white hover:bg-amber-950 disabled:opacity-50 shadow-xs"
                >
                  {planSaving ? 'Запись...' : 'Сохранить план'}
                </button>
              </div>
            </div>

            {/* Models list */}
            {activeModels.length === 0 ? (
              <div className="rounded border border-dashed border-stone-300 p-8 text-center text-xs text-stone-500">
                <p>У компании нет активных моделей для сборки.</p>
                <button
                  onClick={() => setIsDesignModalOpen(true)}
                  className="mt-2 rounded bg-amber-900 px-3 py-1.5 text-white font-bold"
                >
                  + Спроектировать первый автомобиль
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {activeModels.map((model) => {
                  const quota = planDraft[model.id] ?? 0;
                  const trSeg = t.design.segments[model.targetSegment]?.name ?? model.targetSegment;

                  // Powertrain type
                  const powertrain = model.components.engine.includes('steam')
                    ? 'steam'
                    : model.components.engine.includes('electric')
                    ? 'electric'
                    : 'ice';

                  return (
                    <div
                      key={model.id}
                      className="rounded border border-stone-200 bg-white p-3 shadow-2xs space-y-2"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                        {/* 2D Blueprint preview */}
                        <div className="sm:col-span-4">
                          <CarBlueprintSilhouette
                            segment={model.targetSegment}
                            powertrain={powertrain}
                            className="h-20"
                          />
                        </div>

                        {/* Model Specs & Info */}
                        <div className="sm:col-span-5 space-y-1 text-xs">
                          <div className="flex items-center gap-1.5">
                            <span className="font-serif font-bold text-sm text-stone-900">{model.name}</span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 font-semibold">
                              {trSeg}
                            </span>
                          </div>

                          <div className="flex gap-3 text-[11px] text-stone-600">
                            <span>Себестоимость: <strong>${model.productionCost}</strong></span>
                            <span>Цена: <strong className="text-amber-950">${model.salePrice}</strong></span>
                          </div>

                          <div className="flex gap-2 text-[10px] text-stone-500 font-mono">
                            <span>Надеж: {model.stats.reliability}%</span>
                            <span>Комфорт: {model.stats.comfort}</span>
                            <span>Престиж: {model.stats.prestige}</span>
                          </div>
                        </div>

                        {/* Interactive Quota Controls */}
                        <div className="sm:col-span-3 flex flex-col items-end justify-center bg-stone-50 p-2 rounded border border-stone-200">
                          <span className="text-[10px] uppercase font-bold text-stone-500">Квота выпуска</span>
                          <div className="flex items-center gap-1 mt-1">
                            <button
                              type="button"
                              onClick={() => handleQuotaChange(model.id, quota - 1)}
                              className="h-6 w-6 rounded bg-stone-200 hover:bg-stone-300 font-bold text-stone-800 text-xs flex items-center justify-center"
                            >
                              -
                            </button>
                            <input
                              type="number"
                              min={0}
                              max={factory.capacity}
                              value={quota}
                              onChange={(e) => handleQuotaChange(model.id, Number(e.target.value))}
                              className="h-6 w-12 text-center rounded border border-stone-300 font-bold text-xs text-stone-900 bg-white"
                            />
                            <button
                              type="button"
                              onClick={() => handleQuotaChange(model.id, quota + 1)}
                              className="h-6 w-6 rounded bg-stone-200 hover:bg-stone-300 font-bold text-stone-800 text-xs flex items-center justify-center"
                            >
                              +
                            </button>
                          </div>
                          <span className="text-[10px] text-stone-500 mt-0.5">авто/кв.</span>
                        </div>
                      </div>

                      {/* Materials required strip */}
                      <div className="flex flex-wrap gap-2 text-[10px] border-t border-stone-100 pt-1.5 text-stone-600">
                        <span className="text-stone-400">Сырье на авто:</span>
                        {Object.entries(model.materialsRequired ?? {}).map(([mat, amt]) => {
                          if (!amt) return null;
                          return (
                            <span key={mat} className="flex items-center gap-0.5">
                              <span>{MATERIAL_ICONS[mat as MaterialType] ?? ''}</span>
                              <span>{(t.materials[mat as MaterialType] as string | undefined) ?? mat}: {amt}</span>
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Warehouse & Materials */}
          <section className="rounded-lg border border-stone-300 bg-[var(--paper)] p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-stone-200 pb-2">
              <h3 className="font-serif font-bold text-sm text-amber-950 flex items-center gap-1.5">
                <span>📦</span>
                <span>Склад сырья и автозакупка</span>
              </h3>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-stone-600 font-sans">Автозакупка сырья:</span>
                <button
                  type="button"
                  onClick={() => setAutoProcurement(!isAutoProcure)}
                  className={`rounded px-2.5 py-0.5 text-[11px] font-bold transition ${
                    isAutoProcure
                      ? 'bg-emerald-700 text-white'
                      : 'bg-stone-300 text-stone-700'
                  }`}
                >
                  {isAutoProcure ? '✓ ВКЛ' : 'ВЫКЛ'}
                </button>
              </div>
            </div>

            {/* Grid of Materials */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              {(['steel', 'wood', 'rubber', 'leather', 'aluminum', 'plastic'] as MaterialType[]).map((mat) => {
                const inStock = inventory[mat] ?? 0;
                const needed = materialDemand[mat] ?? 0;
                const isShort = needed > inStock;
                const icon = MATERIAL_ICONS[mat] ?? '📦';

                return (
                  <div
                    key={mat}
                    className={`rounded border p-2 flex flex-col justify-between ${
                      isShort
                        ? inStock === 0
                          ? 'border-rose-300 bg-rose-50/70'
                          : 'border-amber-300 bg-amber-50/50'
                        : 'border-stone-200 bg-white'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-1">
                        <span>{icon}</span>
                        <span className="font-bold text-stone-800">{t.materials[mat] ?? mat}</span>
                      </div>
                      <span className="text-[10px] text-stone-500">Потр: {needed}</span>
                    </div>

                    <div className="mt-1 flex items-baseline justify-between">
                      <span className="text-sm font-bold text-stone-900">{inStock.toLocaleString()}</span>
                      {isShort && (
                        <button
                          type="button"
                          onClick={() => handleQuickBuy(mat, Math.max(10, needed - inStock))}
                          className="rounded bg-amber-800 px-1.5 py-0.5 text-[9px] font-bold text-white hover:bg-amber-900"
                        >
                          + Купить
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* ================= RIGHT COLUMN: R&D, MARKETS, AND BANK ================= */}
        <div className="lg:col-span-5 space-y-4">
          {/* 1. Research & Development Widget */}
          <section className="rounded-lg border border-stone-300 bg-[var(--paper)] p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-stone-200 pb-2">
              <h3 className="font-serif font-bold text-sm text-amber-950 flex items-center gap-1.5">
                <span>🔬</span>
                <span>Инженерное бюро (НИОКР)</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsResearchModalOpen(true)}
                className="text-xs font-bold text-amber-900 hover:underline"
              >
                {activeResearch ? 'Сменить проект' : '+ Выбрать технологию'}
              </button>
            </div>

            {activeResearch ? (
              <div className="rounded border border-amber-300 bg-amber-50/60 p-3 space-y-2 text-xs">
                <div className="flex justify-between items-start">
                  <span className="font-bold text-stone-900 font-serif">
                    {t.technologies[activeResearch.technologyId as keyof typeof t.technologies]?.name ?? activeResearch.technologyId}
                  </span>
                  <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded">
                    ${activeResearch.allocatedBudget} / мес.
                  </span>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-stone-600 font-mono">
                    <span>Прогресс разработки:</span>
                    <span>
                      {Math.ceil(activeResearch.progressMonths / 3)} / {Math.ceil(activeResearch.totalMonths / 3)} кв.
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-stone-200 overflow-hidden">
                    <div
                      className="h-full bg-amber-800 transition-all duration-300"
                      style={{
                        width: `${Math.min(100, Math.round((activeResearch.progressMonths / activeResearch.totalMonths) * 100))}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded border border-dashed border-stone-300 p-4 text-center text-xs text-stone-500">
                <p>Лаборатория свободна. Никаких разработок не ведется.</p>
                <button
                  type="button"
                  onClick={() => setIsResearchModalOpen(true)}
                  className="mt-2 rounded bg-amber-900 px-3 py-1 font-bold text-white text-xs"
                >
                  Запустить исследование
                </button>
              </div>
            )}

            {/* Unlocked Technologies badges */}
            <div className="pt-1">
              <span className="text-[10px] uppercase font-bold text-stone-400 block mb-1">
                Изученные патенты ({gameState.unlockedTechnologyIds?.length ?? 0}):
              </span>
              <div className="flex flex-wrap gap-1">
                {(gameState.unlockedTechnologyIds ?? []).map((id) => (
                  <span key={id} className="text-[10px] rounded bg-stone-100 border border-stone-200 px-1.5 py-0.5 text-stone-700">
                    ✓ {t.technologies[id as keyof typeof t.technologies]?.name ?? id}
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* 2. Global Markets & Competitors */}
          <section className="rounded-lg border border-stone-300 bg-[var(--paper)] p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-stone-200 pb-2">
              <h3 className="font-serif font-bold text-sm text-amber-950 flex items-center gap-1.5">
                <span>🌍</span>
                <span>Рынки и Конкуренты</span>
              </h3>
              <button
                type="button"
                onClick={() => handleTabChange('markets')}
                className="text-xs font-bold text-amber-900 hover:underline cursor-pointer"
              >
                Подробнее →
              </button>
            </div>

            {/* Region presence bars */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between items-center text-[11px] text-stone-600">
                <span>🇺🇸 Северная Америка:</span>
                <strong className="text-stone-900 font-mono">
                  {Math.round((company.marketPresence?.['north-america'] ?? 0) * 100)}% охват
                </strong>
              </div>
              <div className="flex justify-between items-center text-[11px] text-stone-600">
                <span>🇪🇺 Европа:</span>
                <strong className="text-stone-900 font-mono">
                  {Math.round((company.marketPresence?.europe ?? 0) * 100)}% охват
                </strong>
              </div>
              <div className="flex justify-between items-center text-[11px] text-stone-600">
                <span>🌍 Ближний Восток:</span>
                <strong className="text-stone-900 font-mono">
                  {Math.round((company.marketPresence?.['middle-east'] ?? 0) * 100)}% охват
                </strong>
              </div>
            </div>

            {/* Key Competitors snapshot */}
            <div className="border-t border-stone-200 pt-2 space-y-1.5 text-xs">
              <span className="text-[10px] uppercase font-bold text-stone-400 block">Главные соперники эпохи:</span>
              <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                <div className="rounded border border-stone-200 bg-stone-50 p-1.5">
                  <div className="font-bold text-stone-900">🇺🇸 Fort Motor Co.</div>
                  <span className="text-[10px] text-stone-500">Репутация: 65 ★</span>
                </div>
                <div className="rounded border border-stone-200 bg-stone-50 p-1.5">
                  <div className="font-bold text-stone-900">🇩🇪 Mercer-Benz</div>
                  <span className="text-[10px] text-stone-500">Репутация: 80 ★</span>
                </div>
              </div>
            </div>
          </section>

          {/* 3. Bank & Treasury */}
          <section className="rounded-lg border border-stone-300 bg-[var(--paper)] p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-stone-200 pb-2">
              <h3 className="font-serif font-bold text-sm text-amber-950 flex items-center gap-1.5">
                <span>🏦</span>
                <span>Казначейство и Банк</span>
              </h3>
              <button
                type="button"
                onClick={() => handleTabChange('bank')}
                className="text-xs font-bold text-amber-900 hover:underline cursor-pointer"
              >
                Кредитный портфель →
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="rounded border border-stone-200 bg-white p-2">
                <span className="text-stone-500 text-[10px] block">Свободный капитал:</span>
                <span className="text-base font-bold text-emerald-800">${company.cash.toLocaleString()}</span>
              </div>
              <div className="rounded border border-stone-200 bg-white p-2">
                <span className="text-stone-500 text-[10px] block">Активные кредиты:</span>
                <span className="text-base font-bold text-stone-900">{activeLoans.length}</span>
              </div>
            </div>

            {/* Quick loan button */}
            <div className="flex items-center justify-between text-xs bg-amber-50/70 border border-amber-200 rounded p-2">
              <span className="text-[11px] text-amber-950 font-serif">Требуются оборотные средства?</span>
              <button
                type="button"
                onClick={handleQuickLoan}
                className="rounded bg-amber-900 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-amber-950 shadow-xs"
              >
                + Овердрафт ($3 000)
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  )}

  {/* 4. INTEGRATED DEPARTMENT VIEWS (ЕДИНОЕ ОКНО БЕЗ ПЕРЕЗАГРУЗОК) */}
  {activeTab === 'design' && <VehicleDesignView />}
  {activeTab === 'production' && <ProductionView />}
  {activeTab === 'research' && <ResearchView />}
  {activeTab === 'markets' && <MarketsView />}
  {activeTab === 'bank' && <BankView />}
  {activeTab === 'reports' && <ReportsView />}
  {activeTab === 'guide' && <GameGuideView />}

      {/* Modals */}
      <QuickVehicleDesignModal
        isOpen={isDesignModalOpen}
        onClose={() => setIsDesignModalOpen(false)}
      />

      <QuickResearchModal
        isOpen={isResearchModalOpen}
        onClose={() => setIsResearchModalOpen(false)}
      />

      <MorningGazetteModal
        isOpen={isGazetteModalOpen}
        onClose={() => setIsGazetteModalOpen(false)}
        report={latestReport}
        companyName={company.name}
      />
    </div>
  );
}
