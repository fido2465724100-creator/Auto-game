'use client';

import React, { useState, useMemo, useEffect } from 'react';
import type { MaterialType } from '@ait/shared-types';
import { calculatePremisesRent } from '@ait/game-engine';
import { useGame } from '../../context/GameContext';
import { useLanguage } from '../../lib/i18n';
import { getEraTheme, getEraName, getEraMaterial, getAdvisorTitle } from '../../lib/eraTheme';
import { CarBlueprintSilhouette } from '../../components/CarBlueprintSilhouette';
import { QuickVehicleDesignModal } from '../../components/QuickVehicleDesignModal';
import { QuickResearchModal } from '../../components/QuickResearchModal';

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

function getLocalizedFactoryName(factoryName: string, country: string | undefined, lang: string): string {
  const c = (country || '').toLowerCase();
  if (c === 'usa' || c === 'us') {
    if (lang === 'en') return 'Detroit Workshop No. 1';
    if (lang === 'uk') return 'Детройтська майстерня №1';
    if (lang === 'de') return 'Detroit Werkstatt Nr. 1';
    return 'Детройтская мастерская №1';
  }
  if (c === 'germany' || c === 'de') {
    if (lang === 'en') return 'Stuttgart Manufactory No. 1';
    if (lang === 'uk') return 'Штутгартська мануфактура №1';
    if (lang === 'de') return 'Stuttgarter Manufaktur Nr. 1';
    return 'Штутгартская мануфактура №1';
  }
  if (c === 'france' || c === 'fr') {
    if (lang === 'en') return 'Paris Carriage Atelier';
    if (lang === 'uk') return 'Паризьке екіпажне ательє';
    if (lang === 'de') return 'Pariser Kutschen-Atelier';
    return 'Парижское экипажное ателье';
  }
  if (c === 'uk' || c === 'gb') {
    if (lang === 'en') return 'Coventry Mechanical Works';
    if (lang === 'uk') return 'Ковентрійська механічна фабрика';
    if (lang === 'de') return 'Coventry Maschinenfabrik';
    return 'Ковентрийская механическая фабрика';
  }
  return factoryName;
}

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
    setGazetteModalOpen,
    decommissionVehicleModel,
  } = useGame();
  const { t, lang } = useLanguage();

  // Modals state
  const [isDesignModalOpen, setIsDesignModalOpen] = useState(false);
  const [isResearchModalOpen, setIsResearchModalOpen] = useState(false);

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
        setGazetteModalOpen(true);
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
  const premisesRent = calculatePremisesRent(gameState.date.year, factory.level);

  const activeModels = gameState.vehicleModels.filter((m) => m.active);
  const oldestAgingModel = activeModels.reduce<{ name: string; age: number } | null>((acc, m) => {
    const age = Math.max(0, gameState.date.year - (m.designYear ?? 1900));
    if (!acc || age > acc.age) return { name: m.name, age };
    return acc;
  }, null);
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

  // Quota change handlers with strict factory capacity enforcement
  const handleQuotaChange = (modelId: string, val: number) => {
    const currentVal = Number(planDraft[modelId]) || 0;
    const otherPlanned = Object.entries(planDraft).reduce((sum, [id, n]) => {
      return id === modelId ? sum : sum + (Number(n) || 0);
    }, 0);
    const remainingFree = Math.max(0, factory.capacity - otherPlanned);
    const maxAllowed = Math.max(currentVal, remainingFree);
    const clamped = Math.max(0, Math.min(maxAllowed, val));

    setPlanDraft((prev) => ({
      ...prev,
      [modelId]: clamped,
    }));
  };

  const handleBalancePlan = () => {
    if (totalPlannedUnits <= 0 || activeModels.length === 0) return;
    const plannedModels = activeModels.filter((m) => (planDraft[m.id] ?? 0) > 0);
    if (plannedModels.length === 0) return;
    const scale = factory.capacity / totalPlannedUnits;
    const newPlan: Record<string, number> = { ...planDraft };
    let allocated = 0;
    plannedModels.forEach((m, idx) => {
      if (idx === plannedModels.length - 1) {
        newPlan[m.id] = Math.max(0, factory.capacity - allocated);
      } else {
        const val = Math.floor((planDraft[m.id] ?? 0) * scale);
        newPlan[m.id] = val;
        allocated += val;
      }
    });
    setPlanDraft(newPlan);
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
      {/* 1. UNIFIED WORKSPACE DESK DOCK (ЕДИНОЕ ОКНО) */}
      <nav className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b-2 border-[var(--border-brass)]">
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
              className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-serif transition-all whitespace-nowrap cursor-pointer select-none border-t-2 border-x ${
                isActive
                  ? 'bg-[var(--paper-card)] text-[var(--ink-heading)] border-t-[var(--border-brass)] border-x-[var(--border-subtle)] font-bold shadow-md -mb-[2px] z-10'
                  : 'bg-[var(--paper)]/25 border-transparent text-[var(--ink-secondary)] hover:text-[var(--ink-heading)] hover:bg-[var(--paper)]/50 font-medium'
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
          {/* ADVISORS LIVE FEEDBACK STRIP */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            {/* Chief Mechanic */}
            <div className="era-card p-3.5 flex items-start gap-3 shadow-2xs">
              <span className="text-xl p-2 rounded-xl era-stat-box select-none shrink-0">👨‍🔧</span>
              <div className="leading-snug min-w-0">
                <span className="font-serif font-bold era-heading block text-xs tracking-wide">
                  {getAdvisorTitle('engineer', eraTheme, lang)}:
                </span>
                <span className="era-label text-xs leading-relaxed mt-1 block">
                  {hasShortage
                    ? lang === 'en'
                      ? 'Sir, raw materials are running out! Assembly lines may grind to a halt.'
                      : lang === 'uk'
                      ? 'Сер, запаси сировини вичерпуються! Частина складальних ліній може зупинитися.'
                      : lang === 'de'
                      ? 'Sir, die Rohstoffe gehen zur Neige! Montagelinien könnten stillstehen.'
                      : 'Сэр, запасы сырья на исходе! Часть сборочных постов может встать.'
                    : oldestAgingModel && oldestAgingModel.age >= 6
                    ? lang === 'en'
                      ? `Attention: Model "${oldestAgingModel.name}" is ${oldestAgingModel.age} years old and losing appeal! Design a modern successor in the Vehicle Designer.`
                      : lang === 'uk'
                      ? `Увага: Модель "${oldestAgingModel.name}" має вік ${oldestAgingModel.age} р. та застаріває! Спроєктуйте наступника в Конструкторі.`
                      : lang === 'de'
                      ? `Achtung: Modell "${oldestAgingModel.name}" ist ${oldestAgingModel.age} Jahre alt und veraltet! Entwerfen Sie ein modernes Folgemodell.`
                      : `Внимание: Модель «${oldestAgingModel.name}» (возраст: ${oldestAgingModel.age} лет) морально устаревает! Спроектируйте преемника в Конструкторе.`
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
            <div className="era-card p-3.5 flex items-start gap-3 shadow-2xs">
              <span className="text-xl p-2 rounded-xl era-stat-box select-none shrink-0">💼</span>
              <div className="leading-snug min-w-0">
                <span className="font-serif font-bold era-heading block text-xs tracking-wide">
                  {getAdvisorTitle('finance', eraTheme, lang)}:
                </span>
                <span className="era-label text-xs leading-relaxed mt-1 block">
                  {latestReport && latestReport.profit < 0
                    ? lang === 'en'
                      ? `Loss last year (-$${Math.abs(latestReport.profit).toLocaleString()})! Check markup and growing plant rent ($${premisesRent.toLocaleString()}/yr).`
                      : lang === 'uk'
                      ? `Збиток за минулий рік (-$${Math.abs(latestReport.profit).toLocaleString()})! Перевірте націнку та оренду цехів ($${premisesRent.toLocaleString()}/рік).`
                      : lang === 'de'
                      ? `Verlust im letzten Jahr (-$${Math.abs(latestReport.profit).toLocaleString()})! Prüfen Sie den Aufschlag und Werksmiete (${premisesRent.toLocaleString()} $/Jahr).`
                      : `Убыток в прошлом году (-$${Math.abs(latestReport.profit).toLocaleString()})! Проверьте наценку и растущую аренду цехов ($${premisesRent.toLocaleString()}/год).`
                    : premisesRent >= 3200 && factory.capacity <= 16
                    ? lang === 'en'
                      ? `Premises rent has climbed to $${premisesRent.toLocaleString()}/yr! Workshop capacity is becoming tight; expand factory lines.`
                      : lang === 'uk'
                      ? `Оренда площ зросла до $${premisesRent.toLocaleString()}/рік! Базова потужність стає замалою; розширюйте заводські лінії.`
                      : lang === 'de'
                      ? `Flächenmiete ist auf ${premisesRent.toLocaleString()} $/Jahr gestiegen! Erweitern Sie die Werkslinien.`
                      : `Аренда цехов выросла до $${premisesRent.toLocaleString()}/год! Базовая мощность маловата; расширяйте заводские линии.`
                    : latestReport && latestReport.profit > 0
                    ? lang === 'en'
                      ? `Great margin! Net profit for the year was +$${latestReport.profit.toLocaleString()}. Treasury is growing.`
                      : lang === 'uk'
                      ? `Чудова маржа! Чистий прибуток за рік склав +$${latestReport.profit.toLocaleString()}. Казна зростає.`
                      : lang === 'de'
                      ? `Hervorragende Marge! Jahresüberschuss: +$${latestReport.profit.toLocaleString()}. Kasse wächst.`
                      : `Отличная маржа! Чистая прибыль за год составила +$${latestReport.profit.toLocaleString()}. Казна растет.`
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
                      ? `Servicing ${activeLoans.length} active loan(s) (-$${(totalQuarterlyLoanPayment * 4).toLocaleString()} / yr). Treasury stable.`
                      : lang === 'uk'
                      ? `Обслуговуємо ${activeLoans.length} кредит(и) (-$${(totalQuarterlyLoanPayment * 4).toLocaleString()} / рік). Казна стабільна.`
                      : lang === 'de'
                      ? `Bedienen ${activeLoans.length} Darlehen (-$${(totalQuarterlyLoanPayment * 4).toLocaleString()} / Jahr). Finanzen stabil.`
                      : `Обслуживаем ${activeLoans.length} займа (-$${(totalQuarterlyLoanPayment * 4).toLocaleString()} / год). Казна стабильна.`
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
            <div className="era-card p-3.5 flex items-start gap-3 shadow-2xs">
              <span className="text-xl p-2 rounded-xl era-stat-box select-none shrink-0">🏭</span>
              <div className="leading-snug min-w-0">
                <span className="font-serif font-bold era-heading block text-xs tracking-wide">
                  {getAdvisorTitle('plant', eraTheme, lang)}:
                </span>
                <span className="era-label text-xs leading-relaxed mt-1 block">
                  {isOverCapacity
                    ? lang === 'en'
                      ? `Overcapacity! Planned ${totalPlannedUnits} units against factory limit of ${factory.capacity} cars/yr.`
                      : lang === 'uk'
                      ? `Перевантаження! Заплановано ${totalPlannedUnits} при ліміті цеху ${factory.capacity} авто/рік.`
                      : lang === 'de'
                      ? `Überlastung! ${totalPlannedUnits} geplant bei Werkskapazität von ${factory.capacity} Fz./Jahr.`
                      : `Перегруз! Запланировано ${totalPlannedUnits} при лимите цеха ${factory.capacity} авто/год.`
                    : lang === 'en'
                    ? `Line utilization: ${totalPlannedUnits} / ${factory.capacity} cars/yr (${Math.round((totalPlannedUnits / factory.capacity) * 100)}%).`
                    : lang === 'uk'
                    ? `Завантаження ліній: ${totalPlannedUnits} / ${factory.capacity} авто/рік (${Math.round((totalPlannedUnits / factory.capacity) * 100)}%).`
                    : lang === 'de'
                    ? `Linienauslastung: ${totalPlannedUnits} / ${factory.capacity} Fz./Jahr (${Math.round((totalPlannedUnits / factory.capacity) * 100)}%).`
                    : `Загрузка линий: ${totalPlannedUnits} / ${factory.capacity} авто/год (${Math.round((totalPlannedUnits / factory.capacity) * 100)}%).`}
                </span>
              </div>
            </div>
          </section>

          {/* 3. MAIN WORKSPACE GRID: FACTORY (LEFT 7/12) & DISPATCH/RESEARCH (RIGHT 5/12) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* ================= LEFT COLUMN: THE FACTORY FLOOR ================= */}
            <div className="lg:col-span-7 space-y-4">
              {/* Active Production Lines */}
              <section className="era-card p-4 space-y-3.5">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border-subtle)] pb-2.5">
                  <div>
                    <h3 className="font-serif font-bold text-base era-heading flex items-center gap-2">
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
                    <span className="text-xs era-label font-serif">
                      {getLocalizedFactoryName(factory.name, company.country, lang)} • {lang === 'en' ? 'Capacity' : lang === 'uk' ? 'Потужність' : lang === 'de' ? 'Kapazität' : 'Мощность'}:{' '}
                      <strong className="font-sans era-value">
                        {factory.capacity} {lang === 'en' ? 'cars/yr' : lang === 'uk' ? 'авто/рік' : lang === 'de' ? 'Fz./Jahr' : 'авто/год'}
                      </strong>{' '}
                      • {lang === 'en' ? 'Overhead' : lang === 'uk' ? 'Утримання' : lang === 'de' ? 'Unterhalt' : 'Содержание'}:{' '}
                      <strong className="font-sans era-value">
                        ${(factory.monthlyOverhead * 12).toLocaleString()}/{lang === 'en' ? 'yr' : lang === 'uk' ? 'рік' : lang === 'de' ? 'Jahr' : 'год'}
                      </strong>{' '}
                      • {lang === 'en' ? 'Premises Rent' : lang === 'uk' ? 'Оренда площ' : lang === 'de' ? 'Flächenmiete' : 'Аренда цехов'}:{' '}
                      <strong className="font-sans era-value font-bold">
                        ${premisesRent.toLocaleString()}/{lang === 'en' ? 'yr' : lang === 'uk' ? 'рік' : lang === 'de' ? 'Jahr' : 'год'}
                      </strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {isOverCapacity && (
                      <button
                        type="button"
                        onClick={handleBalancePlan}
                        className="px-2.5 py-1 text-xs font-bold bg-amber-500/20 text-amber-950 dark:text-amber-300 border border-amber-500/60 hover:bg-amber-500/30 rounded-lg transition shadow-xs cursor-pointer flex items-center gap-1 animate-pulse"
                        title={lang === 'en' ? 'Fit quotas to factory capacity' : 'Вписать план в лимит завода'}
                      >
                        <span>⚖️</span>
                        <span>{lang === 'en' ? 'Fit to Capacity' : lang === 'uk' ? 'Вписати в ліміт' : lang === 'de' ? 'Anpassen' : 'Вписать в лимит'} ({factory.capacity})</span>
                      </button>
                    )}
                    {planSavedNotice && (
                      <span className="text-xs font-bold text-emerald-900 bg-emerald-100 border border-emerald-300 px-2.5 py-1 rounded-lg animate-pulse shadow-2xs">
                        {lang === 'en' ? '✓ Plan saved' : lang === 'uk' ? '✓ План збережено' : lang === 'de' ? '✓ Plan gespeichert' : '✓ План сохранен'}
                      </span>
                    )}
                    <button
                      type="button"
                      disabled={planSaving}
                      onClick={handleSavePlan}
                      className="btn-brass px-3.5 py-1.5 text-xs font-bold text-white disabled:opacity-50 shadow-md cursor-pointer"
                    >
                      {planSaving
                        ? (lang === 'en' ? 'Saving...' : lang === 'uk' ? 'Збереження...' : lang === 'de' ? 'Speichern...' : 'Запись...')
                        : (lang === 'en' ? 'Save Plan' : lang === 'uk' ? 'Зберегти план' : lang === 'de' ? 'Plan speichern' : 'Сохранить план')}
                    </button>
                  </div>
                </div>

                {/* Models list */}
                {activeModels.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-[var(--border-subtle)] bg-[var(--surface-nested)] p-8 text-center text-xs era-label font-serif">
                    <p className="text-sm era-heading">
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
                          className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-nested)] p-3 shadow-xs space-y-2.5 hover:border-[var(--border-brass)] transition"
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
                                <span className="font-serif font-bold text-sm era-heading">{model.name}</span>
                                <span className="text-[10px] px-1.5 py-0.5 rounded font-bold font-mono bg-[var(--tag-bg)] text-[var(--tag-text)] border border-[var(--border-brass)]/30">
                                  {trSeg}
                                </span>
                                {(() => {
                                  const modelAge = Math.max(0, (gameState?.date?.year ?? 1900) - (model.designYear ?? 1900));
                                  const badges = t?.production?.modelAgeBadge;
                                  const freshLabel = badges?.fresh ?? 'Актуальная';
                                  const matureLabel = badges?.mature ?? 'Зрелая';
                                  const agingLabel = badges?.aging ?? 'Устаревает';
                                  const obsoleteLabel = badges?.obsolete ?? 'Устарела';

                                  let ageBadgeClass = 'bg-emerald-100 text-emerald-900 border-emerald-300';
                                  let ageLabel = `${model.designYear ?? 1900} • ${freshLabel} (${modelAge} ${lang === 'en' ? (modelAge === 1 ? 'yr' : 'yrs') : lang === 'uk' ? 'р.' : lang === 'de' ? 'J.' : 'г.'})`;
                                  if (modelAge > 12) {
                                    ageBadgeClass = 'bg-rose-100 text-rose-900 border-rose-300 animate-pulse';
                                    ageLabel = `⚠️ ${model.designYear ?? 1900} • ${obsoleteLabel} (${modelAge} ${lang === 'en' ? 'yrs' : lang === 'uk' ? 'р.' : lang === 'de' ? 'J.' : 'л.'})`;
                                  } else if (modelAge > 7) {
                                    ageBadgeClass = 'bg-amber-100 text-amber-950 border-amber-300';
                                    ageLabel = `⚠️ ${model.designYear ?? 1900} • ${agingLabel} (${modelAge} ${lang === 'en' ? 'yrs' : lang === 'uk' ? 'р.' : lang === 'de' ? 'J.' : 'л.'})`;
                                  } else if (modelAge > 4) {
                                    ageBadgeClass = 'bg-yellow-100 text-yellow-950 border-yellow-300';
                                    ageLabel = `${model.designYear ?? 1900} • ${matureLabel} (${modelAge} ${lang === 'en' ? 'yrs' : lang === 'uk' ? 'р.' : lang === 'de' ? 'J.' : 'л.'})`;
                                  }
                                  return (
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold border ${ageBadgeClass}`}>
                                      {ageLabel}
                                    </span>
                                  );
                                })()}
                              </div>

                              <div className="flex flex-wrap gap-2 text-[11px] era-label font-serif">
                                <span>
                                  {lang === 'en' ? 'Cost' : lang === 'uk' ? 'Собіварт' : lang === 'de' ? 'Selbstkosten' : 'Себест'}:{' '}
                                  <strong className="font-mono era-value">${model.productionCost}</strong>
                                </span>
                                <span>
                                  {lang === 'en' ? 'Price' : lang === 'uk' ? 'Ціна' : lang === 'de' ? 'Preis' : 'Цена'}:{' '}
                                  <strong className="font-mono era-value">${model.salePrice}</strong>
                                </span>
                              </div>

                              <div className="flex flex-wrap gap-1 text-[10px] font-mono">
                                <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20 font-bold">
                                  {lang === 'en' ? 'Rel' : lang === 'uk' ? 'Над' : lang === 'de' ? 'Zuverl' : 'Над'}: {model.stats.reliability}%
                                </span>
                                <span className="bg-amber-500/10 text-amber-600 dark:text-amber-400 px-1.5 py-0.5 rounded border border-amber-500/20 font-bold">
                                  {lang === 'en' ? 'Comf' : lang === 'uk' ? 'Комф' : lang === 'de' ? 'Komf' : 'Комф'}: {model.stats.comfort}
                                </span>
                                <span className="bg-purple-500/10 text-purple-600 dark:text-purple-400 px-1.5 py-0.5 rounded border border-purple-500/20 font-bold">
                                  {lang === 'en' ? 'Prest' : lang === 'uk' ? 'Прест' : lang === 'de' ? 'Prest' : 'Прест'}: {model.stats.prestige}
                                </span>
                              </div>
                            </div>

                            {/* Interactive Quota Controls */}
                            {(() => {
                              const otherPlanned = totalPlannedUnits - quota;
                              const maxForThisModel = Math.max(quota, factory.capacity - otherPlanned);
                              return (
                                <div className="sm:col-span-3 flex flex-col items-end justify-center era-stat-box p-2.5 rounded-xl">
                                  <div className="flex items-center justify-between w-full text-[10px] uppercase font-bold era-heading tracking-wider">
                                    <span>{lang === 'en' ? 'Quota' : lang === 'uk' ? 'Квота' : lang === 'de' ? 'Quote' : 'Квота'}</span>
                                    <span className="opacity-70 font-mono">
                                      ({lang === 'en' ? 'max' : lang === 'uk' ? 'макс' : lang === 'de' ? 'max' : 'макс'}: {maxForThisModel})
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1 mt-1">
                                    <button
                                      type="button"
                                      disabled={quota <= 0}
                                      onClick={() => handleQuotaChange(model.id, quota - 1)}
                                      className="h-6 w-6 rounded bg-[var(--paper)] hover:bg-[var(--paper)]/80 disabled:opacity-30 font-bold era-heading text-xs flex items-center justify-center border border-[var(--border-subtle)] cursor-pointer transition shadow-2xs"
                                    >
                                      -
                                    </button>
                                    <input
                                      type="number"
                                      min={0}
                                      max={maxForThisModel}
                                      value={quota}
                                      onChange={(e) => handleQuotaChange(model.id, Number(e.target.value))}
                                      className="h-6 w-12 text-center rounded border border-[var(--border-subtle)] font-bold font-mono text-xs era-value bg-[var(--paper)] shadow-inner"
                                    />
                                    <button
                                      type="button"
                                      disabled={quota >= maxForThisModel}
                                      onClick={() => handleQuotaChange(model.id, quota + 1)}
                                      className="h-6 w-6 rounded bg-[var(--paper)] hover:bg-[var(--paper)]/80 disabled:opacity-30 font-bold era-heading text-xs flex items-center justify-center border border-[var(--border-subtle)] cursor-pointer transition shadow-2xs"
                                    >
                                      +
                                    </button>
                                    <button
                                      type="button"
                                      disabled={quota >= maxForThisModel}
                                      onClick={() => handleQuotaChange(model.id, maxForThisModel)}
                                      className="px-1.5 h-6 rounded bg-[var(--paper)] hover:bg-[var(--surface-nested)] disabled:opacity-30 border border-[var(--border-subtle)] text-[9px] font-bold era-label cursor-pointer shadow-2xs transition"
                                      title={lang === 'en' ? 'Take all remaining factory capacity' : 'Занять весь свободный резерв цеха'}
                                    >
                                      {lang === 'en' ? 'Max' : lang === 'uk' ? 'Макс' : lang === 'de' ? 'Max' : 'Макс'}
                                    </button>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={async () => {
                                      try {
                                        await decommissionVehicleModel(model.id);
                                      } catch (err) {
                                        console.error(err);
                                      }
                                    }}
                                    className="mt-2 text-[10px] font-bold text-rose-700 dark:text-rose-400 hover:text-rose-950 dark:hover:text-rose-200 border border-rose-300/80 dark:border-rose-800/60 bg-rose-50/80 dark:bg-rose-950/30 px-2 py-0.5 rounded transition flex items-center gap-1 cursor-pointer shadow-2xs"
                                    title={lang === 'en' ? 'Discontinue from production' : lang === 'uk' ? 'Зняти з виробництва' : lang === 'de' ? 'Aus Produktion nehmen' : 'Снять с производства'}
                                  >
                                    <span>🛑</span>
                                    <span>{lang === 'en' ? 'Discontinue' : lang === 'uk' ? 'Зняти з серії' : lang === 'de' ? 'Einstellen' : 'Снять с серии'}</span>
                                  </button>
                                </div>
                              );
                            })()}
                          </div>

                          {/* Materials required strip */}
                          <div className="flex flex-wrap gap-2 text-[10px] border-t border-[var(--border-subtle)] pt-1.5 era-label">
                            <span className="font-serif">
                              {lang === 'en' ? 'Materials per unit:' : lang === 'uk' ? 'Сировина на одиницю:' : lang === 'de' ? 'Material pro Einheit:' : 'Сырье на единицу:'}
                            </span>
                            {Object.entries(model.materialsRequired ?? {}).map(([mat, amt]) => {
                              if (!amt) return null;
                              return (
                                <span key={mat} className="flex items-center gap-1 era-stat-box px-1.5 py-0.5 rounded text-[10px] font-mono">
                                  <span>{MATERIAL_ICONS[mat as MaterialType] ?? ''}</span>
                                  <span>{(t.materials[mat as MaterialType] as string | undefined) ?? mat}: <strong className="era-value">{amt}</strong></span>
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
              <section className="era-card p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2">
                  <h3 className="font-serif font-bold text-sm era-heading flex items-center gap-1.5">
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
                    <span className="era-label font-serif">
                      {lang === 'en' ? 'Auto-procure:' : lang === 'uk' ? 'Автозакупівля:' : lang === 'de' ? 'Autobeschaffung:' : 'Автозакупка:'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setAutoProcurement(!isAutoProcure)}
                      className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition shadow-2xs cursor-pointer ${
                        isAutoProcure
                          ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                          : 'bg-[var(--surface-nested)] hover:bg-[var(--border-subtle)] era-label border border-[var(--border-subtle)]'
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
                              ? 'border-rose-400 bg-rose-500/10 shadow-2xs'
                              : 'border-amber-400 bg-amber-500/10 shadow-2xs'
                            : 'border-[var(--border-subtle)] bg-[var(--surface-nested)] shadow-2xs'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-1">
                            <span className="text-sm">{icon}</span>
                            <span className="font-serif font-bold era-heading">{t.materials[mat] ?? mat}</span>
                          </div>
                          <span className="text-[10px] era-label font-mono">
                            {lang === 'en' ? 'Req' : lang === 'uk' ? 'Потр' : lang === 'de' ? 'Bedarf' : 'Потр'}: {needed}
                          </span>
                        </div>

                        <div className="mt-1.5 flex items-baseline justify-between">
                          <span className="text-sm font-bold font-mono era-value">{inStock.toLocaleString()}</span>
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
          <section className="era-card p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2">
              <h3 className="font-serif font-bold text-sm era-heading flex items-center gap-1.5">
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
                className="text-xs font-serif font-bold era-heading hover:underline cursor-pointer"
              >
                {activeResearch
                  ? (lang === 'en' ? 'Change project' : lang === 'uk' ? 'Змінити проєкт' : lang === 'de' ? 'Projekt wechseln' : 'Сменить проект')
                  : (lang === 'en' ? '+ Select Technology' : lang === 'uk' ? '+ Обрати технологію' : lang === 'de' ? '+ Technologie wählen' : '+ Выбрать технологию')}
              </button>
            </div>

            {activeResearch ? (
              <div className="rounded-xl border border-[var(--border-brass)]/40 bg-[var(--surface-nested)] p-3 space-y-2.5 text-xs shadow-2xs">
                <div className="flex justify-between items-start">
                  <span className="font-bold era-heading font-serif text-sm">
                    {t.technologies[activeResearch.technologyId as keyof typeof t.technologies]?.name ?? activeResearch.technologyId}
                  </span>
                  <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-md bg-[var(--tag-bg)] text-[var(--tag-text)] border border-[var(--border-brass)]/40">
                    ${activeResearch.allocatedBudget} / {lang === 'en' ? 'mo' : lang === 'uk' ? 'міс.' : lang === 'de' ? 'Monat' : 'мес.'}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] era-label font-mono">
                    <span>
                      {lang === 'en' ? 'Research progress:' : lang === 'uk' ? 'Прогрес розробки:' : lang === 'de' ? 'Forschungsfortschritt:' : 'Прогресс разработки:'}
                    </span>
                    <span className="font-bold era-value">
                      {Math.ceil(activeResearch.progressMonths / 3)} / {Math.ceil(activeResearch.totalMonths / 3)}{' '}
                      {lang === 'en' ? 'qtr' : lang === 'uk' ? 'кв.' : lang === 'de' ? 'Q.' : 'кв.'}
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-[var(--paper)] overflow-hidden border border-[var(--border-subtle)]">
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
              <div className="rounded-xl border border-dashed border-[var(--border-subtle)] bg-[var(--surface-nested)] p-4 text-center text-xs era-label font-serif">
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
              <span className="text-[10px] uppercase font-bold era-label font-serif block mb-1.5">
                {lang === 'en' ? 'Unlocked Patents' : lang === 'uk' ? 'Вивчені патенти' : lang === 'de' ? 'Erforschte Patente' : 'Изученные патенты'} ({gameState.unlockedTechnologyIds?.length ?? 0}):
              </span>
              <div className="flex flex-wrap gap-1">
                {(gameState.unlockedTechnologyIds ?? []).map((id) => (
                  <span key={id} className="text-[10px] rounded-md era-stat-box px-2 py-0.5 era-heading font-serif shadow-2xs">
                    ✓ {t.technologies[id as keyof typeof t.technologies]?.name ?? id}
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* 2. Global Markets & Competitors */}
          <section className="era-card p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2">
              <h3 className="font-serif font-bold text-sm era-heading flex items-center gap-1.5">
                <span className="text-base">🌍</span>
                <span>
                  {lang === 'en' ? 'Markets & Competitors' : lang === 'uk' ? 'Ринки та Конкуренти' : lang === 'de' ? 'Märkte & Konkurrenten' : 'Рынки и Конкуренты'}
                </span>
              </h3>
              <button
                type="button"
                onClick={() => handleTabChange('markets')}
                className="text-xs font-serif font-bold era-heading hover:underline cursor-pointer"
              >
                {lang === 'en' ? 'Details →' : lang === 'uk' ? 'Детальніше →' : lang === 'de' ? 'Details →' : 'Подробнее →'}
              </button>
            </div>

            {/* Region presence bars */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center text-[11px] era-label">
                <span className="font-serif">🇺🇸 {t.regions?.['north-america'] ?? 'Северная Америка'}:</span>
                <strong className="era-value font-mono era-stat-box px-2 py-0.5 rounded">
                  {Math.round((company.marketPresence?.['north-america'] ?? 0) * 100)}%{' '}
                  {lang === 'en' ? 'share' : lang === 'uk' ? 'охоплення' : lang === 'de' ? 'Anteil' : 'охват'}
                </strong>
              </div>
              <div className="flex justify-between items-center text-[11px] era-label">
                <span className="font-serif">🇪🇺 {t.regions?.europe ?? 'Европа'}:</span>
                <strong className="era-value font-mono era-stat-box px-2 py-0.5 rounded">
                  {Math.round((company.marketPresence?.europe ?? 0) * 100)}%{' '}
                  {lang === 'en' ? 'share' : lang === 'uk' ? 'охоплення' : lang === 'de' ? 'Anteil' : 'охват'}
                </strong>
              </div>
              <div className="flex justify-between items-center text-[11px] era-label">
                <span className="font-serif">🌍 {t.regions?.['middle-east'] ?? 'Ближний Восток'}:</span>
                <strong className="era-value font-mono era-stat-box px-2 py-0.5 rounded">
                  {Math.round((company.marketPresence?.['middle-east'] ?? 0) * 100)}%{' '}
                  {lang === 'en' ? 'share' : lang === 'uk' ? 'охоплення' : lang === 'de' ? 'Anteil' : 'охват'}
                </strong>
              </div>
            </div>

            {/* Key Competitors snapshot */}
            <div className="border-t border-[var(--border-subtle)] pt-2.5 space-y-1.5 text-xs">
              <span className="text-[10px] uppercase font-bold era-label font-serif block">
                {lang === 'en' ? 'Key rivals of the era:' : lang === 'uk' ? 'Головні суперники епохи:' : lang === 'de' ? 'Hauptkonkurrenten der Epoche:' : 'Главные соперники эпохи:'}
              </span>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-nested)] p-2 shadow-2xs">
                  <div className="font-serif font-bold era-heading">🇺🇸 Fort Motor Co.</div>
                  <span className="text-[10px] era-value font-mono">
                    {lang === 'en' ? 'Reputation' : lang === 'uk' ? 'Репутація' : lang === 'de' ? 'Ruf' : 'Репутация'}: 65 ★
                  </span>
                </div>
                <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-nested)] p-2 shadow-2xs">
                  <div className="font-serif font-bold era-heading">🇩🇪 Mercer-Benz</div>
                  <span className="text-[10px] era-value font-mono">
                    {lang === 'en' ? 'Reputation' : lang === 'uk' ? 'Репутація' : lang === 'de' ? 'Ruf' : 'Репутация'}: 80 ★
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* 3. Bank & Treasury */}
          <section className="era-card p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2">
              <h3 className="font-serif font-bold text-sm era-heading flex items-center gap-1.5">
                <span className="text-base">🏦</span>
                <span>
                  {lang === 'en' ? 'Treasury & Bank' : lang === 'uk' ? 'Казначейство та Банк' : lang === 'de' ? 'Finanzen & Bank' : 'Казначейство и Банк'}
                </span>
              </h3>
              <button
                type="button"
                onClick={() => handleTabChange('bank')}
                className="text-xs font-serif font-bold era-heading hover:underline cursor-pointer"
              >
                {lang === 'en' ? 'Credit Portfolio →' : lang === 'uk' ? 'Кредитний портфель →' : lang === 'de' ? 'Kreditportfolio →' : 'Кредитный портфель →'}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-nested)] p-2.5 shadow-2xs">
                <span className="era-label font-serif text-[10px] block">
                  {lang === 'en' ? 'Liquid Capital:' : lang === 'uk' ? 'Вільний капітал:' : lang === 'de' ? 'Freies Kapital:' : 'Свободный капитал:'}
                </span>
                <span className="text-base font-bold font-mono text-emerald-600 dark:text-emerald-400">${company.cash.toLocaleString()}</span>
              </div>
              <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-nested)] p-2.5 shadow-2xs">
                <span className="era-label font-serif text-[10px] block">
                  {lang === 'en' ? 'Active Loans:' : lang === 'uk' ? 'Активні кредити:' : lang === 'de' ? 'Aktive Kredite:' : 'Активные кредиты:'}
                </span>
                <span className="text-base font-bold font-mono era-value">{activeLoans.length}</span>
              </div>
            </div>

            {/* Quick loan button */}
            <div className="flex items-center justify-between text-xs bg-[var(--surface-nested)] border border-[var(--border-subtle)] rounded-xl p-2.5 shadow-2xs">
              <span className="text-[11px] era-heading font-serif">
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
    </div>
  );
}
