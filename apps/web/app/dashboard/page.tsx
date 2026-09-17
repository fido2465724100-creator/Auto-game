'use client';

import React, { useState, useMemo, useEffect } from 'react';
import type { MaterialType } from '@ait/shared-types';
import { useGame } from '../../context/GameContext';
import { useLanguage } from '../../lib/i18n';
import { getEraTheme, getEraName, getEraMaterial, getAdvisorTitle } from '../../lib/eraTheme';
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

const DESK_TABS: Array<{ id: WorkspaceTab; labelRu: string; labelEn: string; labelUk: string; labelDe: string; icon: string }> = [
  { id: 'overview', labelRu: 'Кабинет управляющего', labelEn: 'Executive Desk', labelUk: 'Кабінет керівника', labelDe: 'Direktionsbüro', icon: '🏛️' },
  { id: 'design', labelRu: 'Конструктор моделей', labelEn: 'Vehicle Design', labelUk: 'Конструктор моделей', labelDe: 'Fahrzeugentwicklung', icon: '🚗' },
  { id: 'production', labelRu: 'Завод и Склады', labelEn: 'Factory & Assembly', labelUk: 'Завод і склади', labelDe: 'Fabrik & Montage', icon: '🏭' },
  { id: 'research', labelRu: 'Лаборатория НИОКР', labelEn: 'R&D Laboratory', labelUk: 'Лабораторія НДДКР', labelDe: 'F&E-Labor', icon: '🔬' },
  { id: 'markets', labelRu: 'Рынки и Конкуренты', labelEn: 'Markets & Sales', labelUk: 'Ринки та конкуренти', labelDe: 'Märkte & Konkurrenz', icon: '🌐' },
  { id: 'bank', labelRu: 'Казначейство и Банк', labelEn: 'Treasury & Bank', labelUk: 'Казначейство та банк', labelDe: 'Finanzen & Bank', icon: '🏦' },
  { id: 'reports', labelRu: 'Финансовая хроника', labelEn: 'Ledgers & Gazette', labelUk: 'Фінансова хроніка', labelDe: 'Finanzchronik & Zeitung', icon: '📜' },
  { id: 'guide', labelRu: 'Справочник и Правила', labelEn: 'Guide & Rules', labelUk: 'Довідник і правила', labelDe: 'Handbuch & Regeln', icon: '📖' },
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
    monthlyOverhead: 40,
    upgradeCost: 4000,
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
      <section className="card-lux p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        {/* Left: Era material identity */}
        <div className="flex items-center gap-3">
          <span className="text-3xl p-2 rounded-xl bg-amber-100/80 border border-amber-900/20 shadow-2xs select-none">
            {eraTheme.icon}
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif font-bold text-base text-amber-950">{getEraName(eraTheme, lang)}</h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-200/80 text-amber-950 font-bold border border-amber-400/50">
                {currentYear} {lang === 'en' ? `(${currentQuarter}/4 Q)` : lang === 'uk' ? `р. (${currentQuarter}/4 кв.)` : lang === 'de' ? `(${currentQuarter}/4 Q.)` : `г. (${currentQuarter}/4 кв.)`}
              </span>
            </div>
            <p className="text-xs text-stone-600 font-serif italic">
              {lang === 'en'
                ? 'Era materials & aesthetic: '
                : lang === 'uk'
                ? 'Матеріали та стиль епохи: '
                : lang === 'de'
                ? 'Materialien & Epochenstil: '
                : 'Материалы и стиль эпохи: '}
              <strong className="text-stone-900">{getEraMaterial(eraTheme, lang)}</strong>
            </p>
          </div>
        </div>

        {/* Right: Quick actions (Newspaper & Design Car) */}
        <div className="flex items-center gap-2 self-stretch md:self-auto flex-wrap">
          {latestReport && (
            <button
              type="button"
              onClick={() => setIsGazetteModalOpen(true)}
              className="flex-1 md:flex-initial rounded-lg border border-amber-900/30 bg-amber-50/80 px-3 py-1.5 text-xs font-serif font-bold text-amber-950 hover:bg-amber-100 shadow-2xs flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <span>📰</span>
              <span>
                {lang === 'en'
                  ? 'Latest Gazette'
                  : lang === 'uk'
                  ? 'Свіжий випуск газети'
                  : lang === 'de'
                  ? 'Aktuelle Zeitung'
                  : 'Свежий выпуск газеты'}
              </span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsDesignModalOpen(true)}
            className="btn-brass flex-1 md:flex-initial rounded-lg px-3.5 py-1.5 text-xs font-bold text-white shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>📐</span>
            <span>
              {lang === 'en'
                ? '+ Design Vehicle'
                : lang === 'uk'
                ? '+ Спроєктувати модель'
                : lang === 'de'
                ? '+ Modell entwerfen'
                : '+ Спроектировать модель'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setHallOfFameOpen(true)}
            className="flex-1 md:flex-initial rounded-lg border border-amber-900/30 bg-amber-50/80 px-3 py-1.5 text-xs font-serif font-bold text-amber-950 hover:bg-amber-100 shadow-2xs flex items-center justify-center gap-1.5 transition cursor-pointer"
            title={
              lang === 'en'
                ? 'Hall of Fame, Trophies & Saves'
                : lang === 'uk'
                ? 'Зал Слави, Нагороди та Збереження'
                : lang === 'de'
                ? 'Ruhmeshalle, Erfolge & Spielstände'
                : 'Зал Славы, Ордена и Сохранения'
            }
          >
            <span>🏆</span>
            <span>
              {lang === 'en'
                ? 'Trophies'
                : lang === 'uk'
                ? 'Зал слави'
                : lang === 'de'
                ? 'Ruhmeshalle'
                : 'Зал славы'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('guide')}
            className="flex-1 md:flex-initial rounded-lg border border-amber-900/30 bg-amber-50/80 px-3 py-1.5 text-xs font-serif font-bold text-amber-950 hover:bg-amber-100 shadow-2xs flex items-center justify-center gap-1.5 transition cursor-pointer"
            title={
              lang === 'en'
                ? 'Industrialist Handbook & Game Guide'
                : lang === 'uk'
                ? 'Довідник промисловця та правила гри'
                : lang === 'de'
                ? 'Industriellen-Handbuch & Spielregeln'
                : 'Руководство промышленника и правила игры'
            }
          >
            <span>📖</span>
            <span>
              {lang === 'en'
                ? 'Handbook'
                : lang === 'uk'
                ? 'Довідник'
                : lang === 'de'
                ? 'Handbuch'
                : 'Справочник'}
            </span>
          </button>
        </div>
      </section>

      {/* 2. UNIFIED WORKSPACE DESK DOCK (ЕДИНОЕ ОКНО) */}
      <nav className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b-2 border-amber-900/30">
        {DESK_TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const tabLabel =
            lang === 'en'
              ? tab.labelEn
              : lang === 'uk'
              ? tab.labelUk
              : lang === 'de'
              ? tab.labelDe
              : tab.labelRu;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabChange(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-serif font-bold transition-all whitespace-nowrap cursor-pointer select-none border-t-2 border-x ${
                isActive
                  ? 'bg-[var(--paper-card)] text-amber-950 border-t-amber-800 border-x-amber-900/30 shadow-md -mb-[2px] z-10'
                  : 'bg-stone-200/50 border-transparent text-stone-600 hover:text-stone-900 hover:bg-stone-200/80'
              }`}
            >
              <span className="text-base">{tab.icon}</span>
              <span className="tracking-wide">{tabLabel}</span>
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
            <div className="rounded-xl border border-amber-900/20 bg-linear-to-b from-[var(--paper-card)] to-amber-50/40 p-3 flex items-start gap-2.5 shadow-2xs">
              <span className="text-xl p-1.5 rounded-lg bg-amber-100/80 border border-amber-900/15 shadow-2xs select-none">👨‍🔧</span>
              <div className="leading-snug">
                <span className="font-serif font-bold text-amber-950 block text-xs tracking-wide">
                  {getAdvisorTitle('engineer', eraTheme, lang)}:
                </span>
                <span className="text-stone-700 text-[11px] leading-relaxed mt-0.5 block">
                  {hasShortage
                    ? lang === 'en'
                      ? 'Sir, raw materials are running out! Assembly lines may grind to a halt.'
                      : lang === 'uk'
                      ? 'Сер, запаси сировини вичерпуються! Частина складальних ліній може зупинитися.'
                      : lang === 'de'
                      ? 'Sir, die Rohstoffe gehen zur Neige! Montagelinien könnten stillstehen.'
                      : 'Сэр, запасы сырья на исходе! Часть сборочных постов может встать.'
                    : activeResearch
                    ? lang === 'en'
                      ? `Laboratory working on: ${t.technologies[activeResearch.technologyId as keyof typeof t.technologies]?.name ?? activeResearch.technologyId}.`
                      : lang === 'uk'
                      ? `Лабораторія працює над: ${t.technologies[activeResearch.technologyId as keyof typeof t.technologies]?.name ?? activeResearch.technologyId}.`
                      : lang === 'de'
                      ? `Labor arbeitet an: ${t.technologies[activeResearch.technologyId as keyof typeof t.technologies]?.name ?? activeResearch.technologyId}.`
                      : `Лаборатория работает над: ${t.technologies[activeResearch.technologyId as keyof typeof t.technologies]?.name ?? activeResearch.technologyId}.`
                    : lang === 'en'
                    ? 'Designers are available. Launch a new research project!'
                    : lang === 'uk'
                    ? 'Конструктори вільні. Відкрийте новий дослідницький проєкт!'
                    : lang === 'de'
                    ? 'Entwickler verfügbar. Starten Sie ein neues Forschungsprojekt!'
                    : 'Конструкторы свободны. Откройте новый исследовательский проект!'}
                </span>
              </div>
            </div>

            {/* Treasurer */}
            <div className="rounded-xl border border-amber-900/20 bg-linear-to-b from-[var(--paper-card)] to-amber-50/40 p-3 flex items-start gap-2.5 shadow-2xs">
              <span className="text-xl p-1.5 rounded-lg bg-amber-100/80 border border-amber-900/15 shadow-2xs select-none">💼</span>
              <div className="leading-snug">
                <span className="font-serif font-bold text-amber-950 block text-xs tracking-wide">
                  {getAdvisorTitle('finance', eraTheme, lang)}:
                </span>
                <span className="text-stone-700 text-[11px] leading-relaxed mt-0.5 block">
                  {latestReport && latestReport.profit < 0
                    ? lang === 'en'
                      ? `Loss last quarter (-$${Math.abs(latestReport.profit).toLocaleString()})! Check your price markup in design (recommended +40–50% over unit cost).`
                      : lang === 'uk'
                      ? `Збиток за минулий кв. (-$${Math.abs(latestReport.profit).toLocaleString()})! Перевірте націнку в конструкторі (рекомендуємо +40–50% до собівартості).`
                      : lang === 'de'
                      ? `Verlust im letzten Quartal (-$${Math.abs(latestReport.profit).toLocaleString()})! Prüfen Sie den Preisaufschlag (empfohlen +40–50% über Selbstkosten).`
                      : `Убыток в прошлом кв. (-$${Math.abs(latestReport.profit).toLocaleString()})! Проверьте наценку в конструкторе (рекомендуем +40–50% к себестоимости).`
                    : latestReport && latestReport.profit > 0
                    ? lang === 'en'
                      ? `Great margin! Net profit for the quarter was +$${latestReport.profit.toLocaleString()}. Treasury is growing.`
                      : lang === 'uk'
                      ? `Чудова маржа! Чистий прибуток за кв. склав +$${latestReport.profit.toLocaleString()}. Казна зростає.`
                      : lang === 'de'
                      ? `Hervorragende Marge! Quartalsüberschuss: +$${latestReport.profit.toLocaleString()}. Kasse wächst.`
                      : `Отличная маржа! Чистая прибыль за кв. составила +$${latestReport.profit.toLocaleString()}. Казна растет.`
                    : company.cash < 2500
                    ? lang === 'en'
                      ? 'Working capital is critical! Consider taking a bank loan.'
                      : lang === 'uk'
                      ? 'Оборотний капітал критично низький! Рекомендуємо залучити банківський кредит.'
                      : lang === 'de'
                      ? 'Umlaufvermögen auf Minimum! Ein Bankkredit wird empfohlen.'
                      : 'Оборотный капитал на минимуме! Рекомендуется привлечь банковский заем.'
                    : activeLoans.length > 0
                    ? lang === 'en'
                      ? `Servicing ${activeLoans.length} active loan(s) (-$${totalQuarterlyLoanPayment.toLocaleString()} / qtr). Treasury stable.`
                      : lang === 'uk'
                      ? `Обслуговуємо ${activeLoans.length} кредит(и) (-$${totalQuarterlyLoanPayment.toLocaleString()} / кв.). Казна стабільна.`
                      : lang === 'de'
                      ? `Bedienen ${activeLoans.length} Darlehen (-$${totalQuarterlyLoanPayment.toLocaleString()} / Q.). Finanzen stabil.`
                      : `Обслуживаем ${activeLoans.length} займа (-$${totalQuarterlyLoanPayment.toLocaleString()} / кв.). Казна стабильна.`
                    : lang === 'en'
                    ? `Capital $${company.cash.toLocaleString()}. Finances in order.`
                    : lang === 'uk'
                    ? `Капітал $${company.cash.toLocaleString()}. Фінанси в повному порядку.`
                    : lang === 'de'
                    ? `Kapital $${company.cash.toLocaleString()}. Finanzen in bester Ordnung.`
                    : `Капитал $${company.cash.toLocaleString()}. Финансы в полном порядке.`}
                </span>
              </div>
            </div>

            {/* Plant Foreman */}
            <div className="rounded-xl border border-amber-900/20 bg-linear-to-b from-[var(--paper-card)] to-amber-50/40 p-3 flex items-start gap-2.5 shadow-2xs">
              <span className="text-xl p-1.5 rounded-lg bg-amber-100/80 border border-amber-900/15 shadow-2xs select-none">🏭</span>
              <div className="leading-snug">
                <span className="font-serif font-bold text-amber-950 block text-xs tracking-wide">
                  {getAdvisorTitle('plant', eraTheme, lang)}:
                </span>
                <span className="text-stone-700 text-[11px] leading-relaxed mt-0.5 block">
                  {isOverCapacity
                    ? lang === 'en'
                      ? `Overcapacity! Planned ${totalPlannedUnits} units against factory limit of ${factory.capacity} cars/qtr.`
                      : lang === 'uk'
                      ? `Перевантаження! Заплановано ${totalPlannedUnits} при ліміті цеху ${factory.capacity} авто/кв.`
                      : lang === 'de'
                      ? `Überlastung! ${totalPlannedUnits} geplant bei Werkskapazität von ${factory.capacity} Autos/Q.`
                      : `Перегруз! Запланировано ${totalPlannedUnits} при лимите цеха ${factory.capacity} авто/кв.`
                    : lang === 'en'
                    ? `Line utilization: ${totalPlannedUnits} / ${factory.capacity} cars/qtr (${Math.round((totalPlannedUnits / factory.capacity) * 100)}%).`
                    : lang === 'uk'
                    ? `Завантаження ліній: ${totalPlannedUnits} / ${factory.capacity} авто/кв. (${Math.round((totalPlannedUnits / factory.capacity) * 100)}%).`
                    : lang === 'de'
                    ? `Linienauslastung: ${totalPlannedUnits} / ${factory.capacity} Autos/Q. (${Math.round((totalPlannedUnits / factory.capacity) * 100)}%).`
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
              <section className="card-lux p-4 space-y-3.5">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-900/20 pb-2.5">
                  <div>
                    <h3 className="font-serif font-bold text-base text-amber-950 flex items-center gap-2">
                      <span className="text-lg">🚗</span>
                      <span>
                        {lang === 'en'
                          ? 'Assembly Lines & Production'
                          : lang === 'uk'
                          ? 'Складальні пости та виробництво'
                          : lang === 'de'
                          ? 'Montagelinien & Produktion'
                          : 'Сборочные посты и производство'}
                      </span>
                    </h3>
                    <span className="text-xs text-stone-600 font-serif">
                      {factory.name} • {lang === 'en' ? 'Capacity' : lang === 'uk' ? 'Потужність' : lang === 'de' ? 'Kapazität' : 'Мощность'}:{' '}
                      <strong className="font-sans text-amber-950">
                        {factory.capacity} {lang === 'en' ? 'cars/qtr' : lang === 'uk' ? 'авто/кв.' : lang === 'de' ? 'Autos/Q.' : 'авто/кв.'}
                      </strong>{' '}
                      • {lang === 'en' ? 'Overhead' : lang === 'uk' ? 'Утримання' : lang === 'de' ? 'Unterhalt' : 'Содержание'}:{' '}
                      <strong className="font-sans text-stone-800">
                        ${factory.monthlyOverhead * 3}/{lang === 'en' ? 'qtr' : lang === 'uk' ? 'кв.' : lang === 'de' ? 'Q.' : 'кв.'}
                      </strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {planSavedNotice && (
                      <span className="text-xs font-bold text-emerald-900 bg-emerald-100 border border-emerald-300 px-2.5 py-1 rounded-lg animate-pulse shadow-2xs">
                        {lang === 'en' ? '✓ Plan saved' : lang === 'uk' ? '✓ План збережено' : lang === 'de' ? '✓ Plan gespeichert' : '✓ План сохранен'}
                      </span>
                    )}
                    <button
                      type="button"
                      disabled={planSaving}
                      onClick={handleSavePlan}
                      className="btn-brass px-3 py-1.5 text-xs font-bold text-white disabled:opacity-50 shadow-md cursor-pointer"
                    >
                      {planSaving
                        ? (lang === 'en' ? 'Saving...' : lang === 'uk' ? 'Збереження...' : lang === 'de' ? 'Speichern...' : 'Запись...')
                        : (lang === 'en' ? 'Save Plan' : lang === 'uk' ? 'Зберегти план' : lang === 'de' ? 'Plan speichern' : 'Сохранить план')}
                    </button>
                  </div>
                </div>

                {/* Models list */}
                {activeModels.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-amber-900/30 bg-amber-50/30 p-8 text-center text-xs text-stone-600 font-serif">
                    <p className="text-sm text-stone-700">
                      {lang === 'en'
                        ? 'No vehicle models designed for production yet.'
                        : lang === 'uk'
                        ? 'У компанії поки немає спроєктованих моделей для випуску.'
                        : lang === 'de'
                        ? 'Das Unternehmen hat noch keine Modelle zur Produktion entworfen.'
                        : 'У компании пока нет спроектированных моделей для выпуска.'}
                    </p>
                    <button
                      onClick={() => setIsDesignModalOpen(true)}
                      className="btn-brass mt-3 px-4 py-2 text-white font-bold text-xs cursor-pointer shadow-md inline-flex items-center gap-1.5"
                    >
                      <span>📐</span>
                      <span>
                        {lang === 'en'
                          ? '+ Design First Vehicle'
                          : lang === 'uk'
                          ? '+ Спроєктувати перший автомобіль'
                          : lang === 'de'
                          ? '+ Erstes Fahrzeug entwerfen'
                          : '+ Спроектировать первый автомобиль'}
                      </span>
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
                          className="rounded-xl border border-amber-900/20 bg-white/90 p-3 shadow-sm space-y-2.5 hover:border-amber-700/40 transition"
                        >
                          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                            {/* 2D Blueprint preview */}
                            <div className="sm:col-span-5">
                              <CarBlueprintSilhouette
                                segment={model.targetSegment}
                                powertrain={powertrain}
                                className="w-full shadow-2xs"
                              />
                            </div>

                            {/* Model Specs & Info */}
                            <div className="sm:col-span-4 space-y-1.5 text-xs">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-serif font-bold text-sm text-amber-950">{model.name}</span>
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100/90 text-amber-950 font-bold border border-amber-900/20">
                                  {trSeg}
                                </span>
                              </div>

                              <div className="flex flex-wrap gap-2 text-[11px] text-stone-700 font-serif">
                                <span>
                                  {lang === 'en' ? 'Cost' : lang === 'uk' ? 'Собіварт' : lang === 'de' ? 'Selbstkosten' : 'Себест'}:{' '}
                                  <strong className="font-mono text-stone-900">${model.productionCost}</strong>
                                </span>
                                <span>
                                  {lang === 'en' ? 'Price' : lang === 'uk' ? 'Ціна' : lang === 'de' ? 'Preis' : 'Цена'}:{' '}
                                  <strong className="font-mono text-amber-950">${model.salePrice}</strong>
                                </span>
                              </div>

                              <div className="flex flex-wrap gap-1 text-[10px] text-stone-600 font-mono">
                                <span className="bg-emerald-50 text-emerald-900 px-1.5 py-0.2 rounded border border-emerald-200">
                                  {lang === 'en' ? 'Rel' : lang === 'uk' ? 'Над' : lang === 'de' ? 'Zuverl' : 'Над'}: {model.stats.reliability}%
                                </span>
                                <span className="bg-amber-50 text-amber-900 px-1.5 py-0.2 rounded border border-amber-200">
                                  {lang === 'en' ? 'Comf' : lang === 'uk' ? 'Комф' : lang === 'de' ? 'Komf' : 'Комф'}: {model.stats.comfort}
                                </span>
                                <span className="bg-purple-50 text-purple-900 px-1.5 py-0.2 rounded border border-purple-200">
                                  {lang === 'en' ? 'Prest' : lang === 'uk' ? 'Прест' : lang === 'de' ? 'Prest' : 'Прест'}: {model.stats.prestige}
                                </span>
                              </div>
                            </div>

                            {/* Interactive Quota Controls */}
                            <div className="sm:col-span-3 flex flex-col items-end justify-center bg-amber-50/40 p-2.5 rounded-xl border border-amber-900/15">
                              <span className="text-[10px] uppercase font-bold text-amber-900 tracking-wider">
                                {lang === 'en' ? 'Production Quota' : lang === 'uk' ? 'Квота випуску' : lang === 'de' ? 'Produktionsquote' : 'Квота выпуска'}
                              </span>
                              <div className="flex items-center gap-1 mt-1">
                                <button
                                  type="button"
                                  onClick={() => handleQuotaChange(model.id, quota - 1)}
                                  className="h-6 w-6 rounded bg-stone-200 hover:bg-stone-300 font-bold text-stone-800 text-xs flex items-center justify-center border border-stone-300 cursor-pointer transition"
                                >
                                  -
                                </button>
                                <input
                                  type="number"
                                  min={0}
                                  max={factory.capacity}
                                  value={quota}
                                  onChange={(e) => handleQuotaChange(model.id, Number(e.target.value))}
                                  className="h-6 w-12 text-center rounded border border-amber-900/30 font-bold font-mono text-xs text-stone-900 bg-white shadow-inner"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleQuotaChange(model.id, quota + 1)}
                                  className="h-6 w-6 rounded bg-stone-200 hover:bg-stone-300 font-bold text-stone-800 text-xs flex items-center justify-center border border-stone-300 cursor-pointer transition"
                                >
                                  +
                                </button>
                              </div>
                              <span className="text-[10px] text-stone-500 font-mono mt-0.5">
                                {lang === 'en' ? 'cars/qtr' : lang === 'uk' ? 'авто/кв.' : lang === 'de' ? 'Autos/Q.' : 'авто/кв.'}
                              </span>
                            </div>
                          </div>

                          {/* Materials required strip */}
                          <div className="flex flex-wrap gap-2 text-[10px] border-t border-amber-900/10 pt-1.5 text-stone-600">
                            <span className="text-stone-400 font-serif">
                              {lang === 'en' ? 'Materials per unit:' : lang === 'uk' ? 'Сировина на одиницю:' : lang === 'de' ? 'Material pro Einheit:' : 'Сырье на единицу:'}
                            </span>
                            {Object.entries(model.materialsRequired ?? {}).map(([mat, amt]) => {
                              if (!amt) return null;
                              return (
                                <span key={mat} className="flex items-center gap-0.5 bg-stone-50 px-1.5 py-0.5 rounded border border-stone-200 text-stone-700">
                                  <span>{MATERIAL_ICONS[mat as MaterialType] ?? ''}</span>
                                  <span>{(t.materials[mat as MaterialType] as string | undefined) ?? mat}: <strong>{amt}</strong></span>
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
              <section className="card-lux p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-amber-900/20 pb-2">
                  <h3 className="font-serif font-bold text-sm text-amber-950 flex items-center gap-1.5">
                    <span className="text-base">📦</span>
                    <span>
                      {lang === 'en'
                        ? 'Raw Materials & Auto-Procure'
                        : lang === 'uk'
                        ? 'Склад сировини та автозакупівля'
                        : lang === 'de'
                        ? 'Rohstofflager & Autobeschaffung'
                        : 'Склад сырья и автозакупка'}
                    </span>
                  </h3>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-stone-600 font-serif">
                      {lang === 'en' ? 'Auto-procure:' : lang === 'uk' ? 'Автозакупівля:' : lang === 'de' ? 'Autobeschaffung:' : 'Автозакупка:'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setAutoProcurement(!isAutoProcure)}
                      className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition shadow-2xs cursor-pointer ${
                        isAutoProcure
                          ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                          : 'bg-stone-300 hover:bg-stone-400 text-stone-800'
                      }`}
                    >
                      {isAutoProcure
                        ? (lang === 'en' ? '✓ ON' : lang === 'uk' ? '✓ УВІМК' : lang === 'de' ? '✓ EIN' : '✓ ВКЛ')
                        : (lang === 'en' ? 'OFF' : lang === 'uk' ? 'ВИМК' : lang === 'de' ? 'AUS' : 'ВЫКЛ')}
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
                        className={`rounded-lg border p-2 flex flex-col justify-between transition ${
                          isShort
                            ? inStock === 0
                              ? 'border-rose-300 bg-rose-50/80 shadow-2xs'
                              : 'border-amber-300 bg-amber-50/70 shadow-2xs'
                            : 'border-stone-200 bg-white/90 shadow-2xs'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-1">
                            <span className="text-sm">{icon}</span>
                            <span className="font-serif font-bold text-stone-900">{t.materials[mat] ?? mat}</span>
                          </div>
                          <span className="text-[10px] text-stone-500 font-mono">
                            {lang === 'en' ? 'Req' : lang === 'uk' ? 'Потр' : lang === 'de' ? 'Bedarf' : 'Потр'}: {needed}
                          </span>
                        </div>

                        <div className="mt-1.5 flex items-baseline justify-between">
                          <span className="text-sm font-bold font-mono text-stone-900">{inStock.toLocaleString()}</span>
                          {isShort && (
                            <button
                              type="button"
                              onClick={() => handleQuickBuy(mat, Math.max(10, needed - inStock))}
                              className="rounded bg-amber-900 hover:bg-amber-950 px-2 py-0.5 text-[9px] font-bold text-white shadow-2xs transition cursor-pointer"
                            >
                              {lang === 'en' ? '+ Buy' : lang === 'uk' ? '+ Купити' : lang === 'de' ? '+ Kaufen' : '+ Купить'}
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
          <section className="card-lux p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-amber-900/20 pb-2">
              <h3 className="font-serif font-bold text-sm text-amber-950 flex items-center gap-1.5">
                <span className="text-base">🔬</span>
                <span>
                  {lang === 'en'
                    ? 'Engineering Bureau (R&D)'
                    : lang === 'uk'
                    ? 'Інженерне бюро (НДДКР)'
                    : lang === 'de'
                    ? 'Ingenieurbüro (F&E)'
                    : 'Инженерное бюро (НИОКР)'}
                </span>
              </h3>
              <button
                type="button"
                onClick={() => setIsResearchModalOpen(true)}
                className="text-xs font-serif font-bold text-amber-900 hover:text-amber-950 hover:underline cursor-pointer"
              >
                {activeResearch
                  ? (lang === 'en' ? 'Change project' : lang === 'uk' ? 'Змінити проєкт' : lang === 'de' ? 'Projekt wechseln' : 'Сменить проект')
                  : (lang === 'en' ? '+ Select Technology' : lang === 'uk' ? '+ Обрати технологію' : lang === 'de' ? '+ Technologie wählen' : '+ Выбрать технологию')}
              </button>
            </div>

            {activeResearch ? (
              <div className="rounded-xl border border-amber-900/25 bg-amber-50/70 p-3 space-y-2.5 text-xs shadow-2xs">
                <div className="flex justify-between items-start">
                  <span className="font-bold text-amber-950 font-serif text-sm">
                    {t.technologies[activeResearch.technologyId as keyof typeof t.technologies]?.name ?? activeResearch.technologyId}
                  </span>
                  <span className="text-[10px] font-bold font-mono text-amber-950 bg-amber-200/80 border border-amber-400/50 px-2 py-0.5 rounded-md">
                    ${activeResearch.allocatedBudget} / {lang === 'en' ? 'mo' : lang === 'uk' ? 'міс.' : lang === 'de' ? 'Monat' : 'мес.'}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-stone-600 font-mono">
                    <span>
                      {lang === 'en' ? 'Research progress:' : lang === 'uk' ? 'Прогрес розробки:' : lang === 'de' ? 'Forschungsfortschritt:' : 'Прогресс разработки:'}
                    </span>
                    <span className="font-bold text-amber-950">
                      {Math.ceil(activeResearch.progressMonths / 3)} / {Math.ceil(activeResearch.totalMonths / 3)}{' '}
                      {lang === 'en' ? 'qtr' : lang === 'uk' ? 'кв.' : lang === 'de' ? 'Q.' : 'кв.'}
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-stone-300/80 overflow-hidden border border-stone-400/30">
                    <div
                      className="h-full bg-linear-to-r from-amber-600 to-amber-900 transition-all duration-300 shadow-2xs"
                      style={{
                        width: `${Math.min(100, Math.round((activeResearch.progressMonths / activeResearch.totalMonths) * 100))}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-amber-900/30 bg-amber-50/30 p-4 text-center text-xs text-stone-600 font-serif">
                <p>
                  {lang === 'en'
                    ? 'Laboratory is idle. No ongoing research.'
                    : lang === 'uk'
                    ? 'Лабораторія вільна. Дослідження не ведуться.'
                    : lang === 'de'
                    ? 'Labor ist frei. Keine aktive Forschung.'
                    : 'Лаборатория свободна. Никаких разработок не ведется.'}
                </p>
                <button
                  type="button"
                  onClick={() => setIsResearchModalOpen(true)}
                  className="btn-brass mt-2.5 px-3.5 py-1.5 font-bold text-white text-xs shadow-md cursor-pointer inline-flex items-center gap-1"
                >
                  <span>🔬</span>
                  <span>
                    {lang === 'en' ? 'Launch Research' : lang === 'uk' ? 'Запустити дослідження' : lang === 'de' ? 'Forschung starten' : 'Запустить исследование'}
                  </span>
                </button>
              </div>
            )}

            {/* Unlocked Technologies badges */}
            <div className="pt-1">
              <span className="text-[10px] uppercase font-bold text-stone-500 font-serif block mb-1.5">
                {lang === 'en' ? 'Unlocked Patents' : lang === 'uk' ? 'Вивчені патенти' : lang === 'de' ? 'Erforschte Patente' : 'Изученные патенты'} ({gameState.unlockedTechnologyIds?.length ?? 0}):
              </span>
              <div className="flex flex-wrap gap-1">
                {(gameState.unlockedTechnologyIds ?? []).map((id) => (
                  <span key={id} className="text-[10px] rounded-md bg-white/80 border border-amber-900/20 px-2 py-0.5 text-amber-950 font-serif shadow-2xs">
                    ✓ {t.technologies[id as keyof typeof t.technologies]?.name ?? id}
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* 2. Global Markets & Competitors */}
          <section className="card-lux p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-amber-900/20 pb-2">
              <h3 className="font-serif font-bold text-sm text-amber-950 flex items-center gap-1.5">
                <span className="text-base">🌍</span>
                <span>
                  {lang === 'en' ? 'Markets & Competitors' : lang === 'uk' ? 'Ринки та Конкуренти' : lang === 'de' ? 'Märkte & Konkurrenten' : 'Рынки и Конкуренты'}
                </span>
              </h3>
              <button
                type="button"
                onClick={() => handleTabChange('markets')}
                className="text-xs font-serif font-bold text-amber-900 hover:text-amber-950 hover:underline cursor-pointer"
              >
                {lang === 'en' ? 'Details →' : lang === 'uk' ? 'Детальніше →' : lang === 'de' ? 'Details →' : 'Подробнее →'}
              </button>
            </div>

            {/* Region presence bars */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center text-[11px] text-stone-700">
                <span className="font-serif">🇺🇸 {t.regions?.['north-america'] ?? 'Северная Америка'}:</span>
                <strong className="text-stone-900 font-mono bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
                  {Math.round((company.marketPresence?.['north-america'] ?? 0) * 100)}%{' '}
                  {lang === 'en' ? 'share' : lang === 'uk' ? 'охоплення' : lang === 'de' ? 'Anteil' : 'охват'}
                </strong>
              </div>
              <div className="flex justify-between items-center text-[11px] text-stone-700">
                <span className="font-serif">🇪🇺 {t.regions?.europe ?? 'Европа'}:</span>
                <strong className="text-stone-900 font-mono bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
                  {Math.round((company.marketPresence?.europe ?? 0) * 100)}%{' '}
                  {lang === 'en' ? 'share' : lang === 'uk' ? 'охоплення' : lang === 'de' ? 'Anteil' : 'охват'}
                </strong>
              </div>
              <div className="flex justify-between items-center text-[11px] text-stone-700">
                <span className="font-serif">🌍 {t.regions?.['middle-east'] ?? 'Ближний Восток'}:</span>
                <strong className="text-stone-900 font-mono bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
                  {Math.round((company.marketPresence?.['middle-east'] ?? 0) * 100)}%{' '}
                  {lang === 'en' ? 'share' : lang === 'uk' ? 'охоплення' : lang === 'de' ? 'Anteil' : 'охват'}
                </strong>
              </div>
            </div>

            {/* Key Competitors snapshot */}
            <div className="border-t border-amber-900/15 pt-2.5 space-y-1.5 text-xs">
              <span className="text-[10px] uppercase font-bold text-stone-500 font-serif block">
                {lang === 'en' ? 'Key rivals of the era:' : lang === 'uk' ? 'Головні суперники епохи:' : lang === 'de' ? 'Hauptkonkurrenten der Epoche:' : 'Главные соперники эпохи:'}
              </span>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="rounded-lg border border-amber-900/15 bg-white/70 p-2 shadow-2xs">
                  <div className="font-serif font-bold text-stone-900">🇺🇸 Fort Motor Co.</div>
                  <span className="text-[10px] text-amber-900 font-mono">
                    {lang === 'en' ? 'Reputation' : lang === 'uk' ? 'Репутація' : lang === 'de' ? 'Ruf' : 'Репутация'}: 65 ★
                  </span>
                </div>
                <div className="rounded-lg border border-amber-900/15 bg-white/70 p-2 shadow-2xs">
                  <div className="font-serif font-bold text-stone-900">🇩🇪 Mercer-Benz</div>
                  <span className="text-[10px] text-amber-900 font-mono">
                    {lang === 'en' ? 'Reputation' : lang === 'uk' ? 'Репутація' : lang === 'de' ? 'Ruf' : 'Репутация'}: 80 ★
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* 3. Bank & Treasury */}
          <section className="card-lux p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-amber-900/20 pb-2">
              <h3 className="font-serif font-bold text-sm text-amber-950 flex items-center gap-1.5">
                <span className="text-base">🏦</span>
                <span>
                  {lang === 'en' ? 'Treasury & Bank' : lang === 'uk' ? 'Казначейство та Банк' : lang === 'de' ? 'Finanzen & Bank' : 'Казначейство и Банк'}
                </span>
              </h3>
              <button
                type="button"
                onClick={() => handleTabChange('bank')}
                className="text-xs font-serif font-bold text-amber-900 hover:text-amber-950 hover:underline cursor-pointer"
              >
                {lang === 'en' ? 'Credit Portfolio →' : lang === 'uk' ? 'Кредитний портфель →' : lang === 'de' ? 'Kreditportfolio →' : 'Кредитный портфель →'}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-xl border border-amber-900/15 bg-white/80 p-2.5 shadow-2xs">
                <span className="text-stone-500 font-serif text-[10px] block">
                  {lang === 'en' ? 'Liquid Capital:' : lang === 'uk' ? 'Вільний капітал:' : lang === 'de' ? 'Freies Kapital:' : 'Свободный капитал:'}
                </span>
                <span className="text-base font-bold font-mono text-emerald-900">${company.cash.toLocaleString()}</span>
              </div>
              <div className="rounded-xl border border-amber-900/15 bg-white/80 p-2.5 shadow-2xs">
                <span className="text-stone-500 font-serif text-[10px] block">
                  {lang === 'en' ? 'Active Loans:' : lang === 'uk' ? 'Активні кредити:' : lang === 'de' ? 'Aktive Kredite:' : 'Активные кредиты:'}
                </span>
                <span className="text-base font-bold font-mono text-stone-900">{activeLoans.length}</span>
              </div>
            </div>

            {/* Quick loan button */}
            <div className="flex items-center justify-between text-xs bg-amber-50/80 border border-amber-900/20 rounded-xl p-2.5 shadow-2xs">
              <span className="text-[11px] text-amber-950 font-serif">
                {lang === 'en' ? 'Need working capital?' : lang === 'uk' ? 'Потрібні оборотні кошти?' : lang === 'de' ? 'Betriebskapital benötigt?' : 'Требуются оборотные средства?'}
              </span>
              <button
                type="button"
                onClick={handleQuickLoan}
                className="btn-brass px-3 py-1 text-[11px] font-bold text-white shadow-md cursor-pointer"
              >
                {lang === 'en' ? '+ Overdraft ($3,000)' : lang === 'uk' ? '+ Овердрафт ($3 000)' : lang === 'de' ? '+ Kontokorrent (3.000 $)' : '+ Овердрафт ($3 000)'}
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
