'use client';

import { useEffect, useState } from 'react';
import type { MaterialMarketItem, MaterialType } from '@ait/shared-types';
import { calculatePremisesRent, calculateRecommendedSalePrice } from '@ait/game-engine';
import { useGame } from '../../context/GameContext';
import { useLanguage } from '../../lib/i18n';
import { api } from '../../lib/api';
import { evaluateVehiclePrice } from '../../lib/pricingHelper';

const MATERIAL_ICONS: Record<MaterialType, string> = {
  wood: '🪵',
  steel: '⚙️',
  rubber: '🛞',
  leather: '🛋️',
  aluminum: '✈️',
  plastic: '🧪',
};

export default function ProductionPage(): React.JSX.Element {
  const {
    gameState,
    updateProductionPlan,
    buyMaterial,
    setAutoProcurement,
    expandFactory,
    decommissionVehicleModel,
  } = useGame();
  const { t, lang } = useLanguage();

  const [marketMaterials, setMarketMaterials] = useState<MaterialMarketItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [planDraft, setPlanDraft] = useState<Record<string, number>>({});
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [actionPending, setActionPending] = useState(false);

  useEffect(() => {
    api.getMaterialsMarket()
      .then((items) => {
        setMarketMaterials(items);
      })
      .catch(() => setMarketMaterials([]))
      .finally(() => setLoading(false));
  }, [gameState?.date.year]);

  useEffect(() => {
    if (gameState?.productionPlan) {
      setPlanDraft(gameState.productionPlan);
    }
  }, [gameState?.productionPlan]);

  if (loading || !gameState) {
    return <p className="py-8 text-center text-stone-600">Загрузка данных завода и склада...</p>;
  }

  const factory = gameState.company.factory ?? {
    name: 'Главная мануфактура',
    level: 1,
    capacity: gameState.company.productionCapacity,
    monthlyOverhead: 40,
    upgradeCost: 4_000,
  };
  const premisesRent = calculatePremisesRent(gameState.date.year, factory.level);

  const currentCash = gameState.company.cash;
  const isAutoProcure = gameState.company.autoProcurement ?? false;
  const inventory = gameState.company.inventoryMaterials ?? {
    steel: 0,
    wood: 0,
    rubber: 0,
    leather: 0,
    aluminum: 0,
    plastic: 0,
  };

  const activeModels = gameState.vehicleModels.filter((m) => m.active);

  // Total planned production
  const totalPlannedUnits = Object.values(planDraft).reduce((sum, n) => sum + (Number(n) || 0), 0);
  const capacityPercent = Math.min(100, Math.round((totalPlannedUnits / factory.capacity) * 100));
  const isOverCapacity = totalPlannedUnits > factory.capacity;

  // Calculate material demand for the next quarter based on draft plan (capped to factory capacity)
  const effectiveScale = totalPlannedUnits > factory.capacity ? factory.capacity / totalPlannedUnits : 1.0;
  const materialDemand: Record<MaterialType, number> = {
    steel: 0,
    wood: 0,
    rubber: 0,
    leather: 0,
    aluminum: 0,
    plastic: 0,
  };

  for (const model of activeModels) {
    const planned = planDraft[model.id] ?? 0;
    if (planned <= 0) continue;
    const effectiveUnits = Math.round(planned * effectiveScale);
    const req = model.materialsRequired ?? {};
    for (const [mat, amount] of Object.entries(req)) {
      const m = mat as MaterialType;
      materialDemand[m] = (materialDemand[m] ?? 0) + (amount ?? 0) * effectiveUnits;
    }
  }

  // Check for any material shortage and calculate total procurement cost
  let totalProcureCost = 0;
  let hasShortage = false;
  for (const [mat, amount] of Object.entries(materialDemand)) {
    const item = marketMaterials.find((m) => m.id === mat);
    const inStock = inventory[mat as MaterialType] ?? 0;
    if ((amount ?? 0) > inStock) {
      hasShortage = true;
      if (item) {
        totalProcureCost += ((amount ?? 0) - inStock) * item.basePrice;
      }
    }
  }

  const handlePlanChange = (modelId: string, value: number) => {
    const currentVal = Number(planDraft[modelId]) || 0;
    const otherPlanned = Object.entries(planDraft).reduce((sum, [id, n]) => {
      return id === modelId ? sum : sum + (Number(n) || 0);
    }, 0);
    // If already over capacity, allow decreasing from currentVal, but ceiling is currentVal or remaining capacity
    const remainingFree = Math.max(0, factory.capacity - otherPlanned);
    const maxAllowed = Math.max(currentVal, remainingFree);
    const clamped = Math.max(0, Math.min(maxAllowed, value));

    setPlanDraft((prev) => ({
      ...prev,
      [modelId]: clamped,
    }));
  };

  // Helper: Distribute available capacity equally across all active models
  const handleDistributeEqually = () => {
    if (activeModels.length === 0) return;
    const count = activeModels.length;
    const baseQuota = Math.floor(factory.capacity / count);
    const remainder = factory.capacity % count;
    const newPlan: Record<string, number> = {};
    activeModels.forEach((m, idx) => {
      newPlan[m.id] = baseQuota + (idx < remainder ? 1 : 0);
    });
    setPlanDraft(newPlan);
  };

  // Helper: Proportionally scale existing plan to exactly fit factory capacity
  const handleBalancePlan = () => {
    if (totalPlannedUnits <= 0 || activeModels.length === 0) {
      handleDistributeEqually();
      return;
    }
    const plannedModels = activeModels.filter((m) => (planDraft[m.id] ?? 0) > 0);
    if (plannedModels.length === 0) {
      handleDistributeEqually();
      return;
    }
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
    setActionPending(true);
    setStatusMsg(null);
    try {
      await updateProductionPlan(planDraft);
      setStatusMsg(t.production.planSaved);
    } catch (err) {
      setStatusMsg(`Ошибка: ${String(err)}`);
    } finally {
      setActionPending(false);
    }
  };

  const handleBuyMaterial = async (materialId: MaterialType, amount: number) => {
    const item = marketMaterials.find((m) => m.id === materialId);
    if (!item) return;

    const totalCost = item.basePrice * amount;
    if (currentCash < totalCost) {
      setStatusMsg(`${t.production.insufficientFundsBatch} ($${totalCost.toLocaleString()})`);
      return;
    }

    setActionPending(true);
    setStatusMsg(null);
    try {
      await buyMaterial(materialId, amount);
      setStatusMsg(t.production.materialBought);
    } catch (err) {
      setStatusMsg(`Ошибка: ${String(err)}`);
    } finally {
      setActionPending(false);
    }
  };

  const handleToggleAutoProcure = async () => {
    setActionPending(true);
    setStatusMsg(null);
    try {
      await setAutoProcurement(!isAutoProcure);
      setStatusMsg(t.production.autoProcurementUpdated);
    } catch (err) {
      setStatusMsg(`Ошибка: ${String(err)}`);
    } finally {
      setActionPending(false);
    }
  };

  const handleExpandFactory = async () => {
    if (currentCash < factory.upgradeCost) {
      setStatusMsg(t.production.insufficientFunds);
      return;
    }

    setActionPending(true);
    setStatusMsg(null);
    try {
      await expandFactory();
      setStatusMsg(t.production.plantExpanded);
    } catch (err) {
      setStatusMsg(`Ошибка: ${String(err)}`);
    } finally {
      setActionPending(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="border-b border-[var(--border-subtle)] pb-4">
        <h1 className="text-2xl font-bold text-[var(--ink-heading)] era-heading flex items-center gap-2">
          <span>🏭</span> {t.production.title}
        </h1>
        <p className="text-xs text-[var(--ink-secondary)] font-sans mt-1">
          {t.production.subtitle}
        </p>
      </div>

      {statusMsg && (
        <div className="rounded-lg border border-[var(--border-brass)] bg-[var(--surface-nested)] px-4 py-2.5 text-xs text-[var(--ink)] font-semibold shadow-xs flex justify-between items-center">
          <span>{statusMsg}</span>
          <button onClick={() => setStatusMsg(null)} className="text-[var(--ink-secondary)] hover:text-[var(--ink)] font-bold ml-4">✕</button>
        </div>
      )}

      {/* SHORTAGE ALERT */}
      {hasShortage && !isAutoProcure && (
        <div className="rounded-lg border border-rose-500/60 bg-rose-950/20 p-4 text-rose-300 text-xs shadow-xs">
          <div className="flex items-center gap-2 font-bold mb-1 text-rose-200">
            <span className="text-base">⚠️</span> {t.production.shortageAlert}
          </div>
          <p className="text-[11px] text-rose-300/90">
            {t.production.shortageHint}
          </p>
        </div>
      )}

      {/* AUTO-PROCUREMENT CASH DEFICIT ALERT */}
      {hasShortage && isAutoProcure && currentCash < totalProcureCost && (
        <div className="rounded-lg border border-amber-500/60 bg-amber-950/20 p-4 text-amber-200 text-xs shadow-xs">
          <div className="flex items-center gap-2 font-bold mb-1 text-amber-100">
            <span className="text-base">⚠️</span> Внимание: для автозакупки недостающего сырья требуется ${totalProcureCost.toLocaleString()}, а в кассе только ${currentCash.toLocaleString()}!
          </div>
          <p className="text-[11px] text-amber-200/90">
            Из-за дефицита оборотных средств цех сможет закупить материалы лишь частично. Чтобы избежать простоя сборки, пополните баланс кредитом в Банке или оптимизируйте квоты выпуска под доступный бюджет.
          </p>
        </div>
      )}

      {/* OVER CAPACITY ALERT */}
      {isOverCapacity && (
        <div className="rounded-lg border border-amber-500/60 bg-amber-950/20 p-3.5 text-amber-200 text-xs shadow-xs flex items-center gap-2">
          <span className="text-base">⚠️</span>
          <span>
            {t.production.overCapacityWarning} ({totalPlannedUnits} / {factory.capacity} {t.topbar.unitsQuarter})
          </span>
        </div>
      )}

      {/* BANK / LIQUIDITY BANNER */}
      {(currentCash < 4000 || (gameState.company.loans?.length ?? 0) > 0) && (
        <div className="rounded-lg border border-[var(--border-brass)] bg-[var(--surface-nested)] p-3.5 text-xs shadow-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[var(--ink)]">
            <span className="text-base">🏦</span>
            <span>
              {(gameState.company.loans?.length ?? 0) > 0
                ? `У компании открыто банковских кредитов: ${gameState.company.loans?.length}. Платежи списываются ежеквартально.`
                : 'Остаток капитала снижен. При необходимости пополните оборотные средства в Коммерческом банке.'}
            </span>
          </div>
          <a
            href="/bank"
            className="rounded-lg btn-brass px-3 py-1 font-bold text-xs transition shadow-xs"
          >
            Банк и кредиты →
          </a>
        </div>
      )}

      {/* FACTORY CARD */}
      <div className="era-card p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-[var(--ink-heading)] era-heading">{factory.name}</h2>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded era-badge-accent">
                {t.production.level} {factory.level}
              </span>
            </div>
            <p className="text-xs text-[var(--ink-secondary)] font-sans mt-0.5">
              {t.production.historicalPlantSubtitle}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] text-[var(--ink-secondary)] uppercase block font-semibold">{t.production.overheadMonthly}</span>
              <span className="text-xs font-bold text-[var(--ink)]">${(factory.monthlyOverhead * 12).toLocaleString()} / {lang === 'en' ? 'yr' : lang === 'uk' ? 'рік' : lang === 'de' ? 'Jahr' : 'год'}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-[var(--ink-secondary)] uppercase block font-semibold">{t?.production?.premisesRent ?? 'Аренда производственных площадей'}</span>
              <span className="text-xs font-bold text-[var(--ink-value)]">${premisesRent.toLocaleString()} / {lang === 'en' ? 'yr' : lang === 'uk' ? 'рік' : lang === 'de' ? 'Jahr' : 'год'}</span>
            </div>
            <button
              onClick={handleExpandFactory}
              disabled={actionPending || currentCash < factory.upgradeCost}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition shadow-xs cursor-pointer ${
                currentCash >= factory.upgradeCost
                  ? 'btn-brass text-white'
                  : 'bg-[var(--surface-nested)] text-[var(--ink-secondary)] opacity-50 cursor-not-allowed'
              }`}
            >
              🏗️ {t.production.expandBtn} (${factory.upgradeCost.toLocaleString()})
            </button>
          </div>
        </div>

        {/* CAPACITY BAR & AVAILABLE CAPACITY BADGE */}
        <div className="mt-4 space-y-2">
          <div className="flex flex-wrap justify-between items-center text-xs font-semibold text-[var(--ink)] gap-2">
            <span className="flex items-center gap-2 flex-wrap">
              <span>{t.production.capacityUsed}</span>
              {totalPlannedUnits < factory.capacity ? (
                <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/40 border border-emerald-300 px-2 py-0.5 rounded-md">
                  {lang === 'en' ? `Available: ${factory.capacity - totalPlannedUnits} cars/yr` : lang === 'uk' ? `Вільно: ${factory.capacity - totalPlannedUnits} авто/рік` : lang === 'de' ? `Verfügbar: ${factory.capacity - totalPlannedUnits} Fz./Jahr` : `Свободно: ${factory.capacity - totalPlannedUnits} авто/год`}
                </span>
              ) : totalPlannedUnits === factory.capacity ? (
                <span className="text-[11px] font-bold text-blue-800 dark:text-blue-300 bg-blue-100 dark:bg-blue-950/40 border border-blue-300 px-2 py-0.5 rounded-md">
                  {lang === 'en' ? '100% Utilized' : lang === 'uk' ? '100% Завантаження' : lang === 'de' ? '100% ausgelastet' : '100% Загрузка'}
                </span>
              ) : (
                <span className="text-[11px] font-bold text-rose-800 dark:text-rose-300 bg-rose-100 dark:bg-rose-950/40 border border-rose-300 px-2 py-0.5 rounded-md animate-pulse">
                  {lang === 'en' ? `Overcapacity by ${totalPlannedUnits - factory.capacity} cars/yr!` : lang === 'uk' ? `Перевантаження на ${totalPlannedUnits - factory.capacity} авто/рік!` : lang === 'de' ? `Überlastung um ${totalPlannedUnits - factory.capacity} Fz./Jahr!` : `Перегруз на ${totalPlannedUnits - factory.capacity} авто/год!`}
                </span>
              )}
            </span>
            <span className="font-mono">
              {totalPlannedUnits} / {factory.capacity} {lang === 'en' ? 'cars/yr' : lang === 'uk' ? 'авто/рік' : lang === 'de' ? 'Fz./Jahr' : 'авто/год'} ({capacityPercent}%)
            </span>
          </div>
          <div className="w-full h-3.5 bg-[var(--surface-nested)] rounded-full overflow-hidden border border-[var(--border-subtle)]">
            <div
              className={`h-full transition-all duration-300 ${
                isOverCapacity
                  ? 'bg-rose-600'
                  : capacityPercent > 85
                  ? 'bg-amber-600'
                  : 'bg-emerald-600'
              }`}
              style={{ width: `${Math.min(100, (totalPlannedUnits / factory.capacity) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* PRODUCTION LINES & QUOTAS */}
      <div className="era-card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-3 mb-4">
          <div>
            <h2 className="text-base font-bold text-[var(--ink-heading)] era-heading flex items-center gap-2">
              <span>🚗</span> {t.production.linesTitle}
            </h2>
            <p className="text-xs text-[var(--ink-secondary)] font-sans">
              {t.production.planSubtitle}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {isOverCapacity && (
              <button
                type="button"
                onClick={handleBalancePlan}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500/20 text-amber-950 dark:text-amber-300 border border-amber-500/60 hover:bg-amber-500/30 transition shadow-xs cursor-pointer flex items-center gap-1 animate-pulse"
                title={lang === 'en' ? 'Proportionally scale down quotas to fit factory capacity' : 'Автоматически урезать квоты моделей, чтобы они ровно вписались в лимит цеха'}
              >
                <span>⚖️</span>
                <span>{lang === 'en' ? 'Fit to Capacity' : lang === 'uk' ? 'Вписати в ліміт' : lang === 'de' ? 'An Kapazität anpassen' : 'Вписать в лимит цеха'} ({factory.capacity})</span>
              </button>
            )}
            <button
              type="button"
              onClick={handleDistributeEqually}
              className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-[var(--paper)] text-[var(--ink)] border border-[var(--border-subtle)] hover:bg-[var(--surface-nested)] transition shadow-xs cursor-pointer flex items-center gap-1"
              title={lang === 'en' ? 'Divide factory capacity equally among all models' : 'Разделить всю мощность цеха поровну между всеми моделями'}
            >
              <span>⚖️</span>
              <span>{lang === 'en' ? 'Equal Share' : lang === 'uk' ? 'Порівну' : lang === 'de' ? 'Gleichmäßig' : 'Поровну'}</span>
            </button>
            <button
              onClick={handleSavePlan}
              disabled={actionPending}
              className="btn-brass px-4 py-1.5 rounded-lg text-xs font-bold transition shadow-xs cursor-pointer"
            >
              💾 {t.production.savePlanBtn}
            </button>
          </div>
        </div>

        {activeModels.length === 0 ? (
          <p className="py-6 text-center text-xs text-[var(--ink-secondary)] italic">
            {t.production.noModels}
          </p>
        ) : (
          <div className="space-y-4">
            {activeModels.map((model) => {
              const planned = planDraft[model.id] ?? 0;
              const otherPlanned = totalPlannedUnits - planned;
              const maxForThisModel = Math.max(planned, factory.capacity - otherPlanned);
              const unitCost = model.productionCost;
              const totalCost = unitCost * planned;
              const req = model.materialsRequired ?? {};
              const modelYear = model.designYear ?? 1900;
              const currentYear = gameState?.date.year ?? 1900;
              const age = Math.max(0, currentYear - modelYear);
              const isObsolete = age >= 20;
              const isAging = age >= 9 && age < 20;
              const unitProfit = model.salePrice - unitCost;
              const marginPct = Math.round((unitProfit / (model.salePrice || 1)) * 100);
              const recPrice = calculateRecommendedSalePrice(model.targetSegment, unitCost);
              const priceEval = evaluateVehiclePrice(model.salePrice, unitCost, recPrice, lang);

              return (
                <div
                  key={model.id}
                  className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-nested)] p-4 transition hover:border-[var(--border-brass)]"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-[var(--ink-heading)] era-heading">{model.name}</span>
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded era-badge-accent">
                          {t.design.segments[model.targetSegment]?.name ?? model.targetSegment}
                        </span>
                        <span className="text-[11px] text-[var(--ink-secondary)] font-mono">
                          {modelYear} ({age} {lang === 'en' ? 'yrs' : lang === 'uk' ? 'р.' : lang === 'de' ? 'J.' : 'лет'})
                        </span>
                        {isObsolete ? (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-950/40 text-rose-300 border border-rose-600/50">
                            🛑 {lang === 'en' ? 'Obsolete (0 demand)' : lang === 'uk' ? 'Застаріла (0 попит)' : lang === 'de' ? 'Veraltet (0 Nachfr.)' : 'Устарела (спрос 0)'}
                          </span>
                        ) : isAging ? (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-950/40 text-amber-300 border border-amber-600/50">
                            ⚠️ {lang === 'en' ? 'Aging' : lang === 'uk' ? 'Застаріває' : lang === 'de' ? 'Alternd' : 'Устаревает'}
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-950/40 text-emerald-300 border border-emerald-600/50">
                            ✨ {lang === 'en' ? 'Fresh' : lang === 'uk' ? 'Актуальна' : lang === 'de' ? 'Aktuell' : 'Актуальная'}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-xs text-[var(--ink-secondary)] font-sans flex-wrap">
                        <span>{t.production.costPerUnit}: <strong className="text-[var(--ink)]">${unitCost.toLocaleString()}</strong></span>
                        <span>•</span>
                        <span className="flex items-center gap-1.5">
                          <span>{t.design.salePrice}: <strong className="text-[var(--ink-value)]">${model.salePrice.toLocaleString()}</strong></span>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${priceEval.badgeClass}`}>
                            {priceEval.shortLabel}
                          </span>
                          <span className="text-[10px] opacity-75 font-mono">
                            (💡 Рек.: ${recPrice.toLocaleString()})
                          </span>
                        </span>
                        <span>•</span>
                        <span>
                          {lang === 'en' ? 'Margin' : lang === 'uk' ? 'Маржа' : lang === 'de' ? 'Marge' : 'Маржа'}:{' '}
                          <strong className={unitProfit >= 0 ? 'text-emerald-400 font-mono' : 'text-rose-400 font-mono'}>
                            {unitProfit >= 0 ? `+$${unitProfit.toLocaleString()}` : `-$${Math.abs(unitProfit).toLocaleString()}`} ({marginPct}%)
                          </strong>
                        </span>
                        <span>•</span>
                        <span>{t.production.totalCost}: <strong className="text-[var(--ink)]">${totalCost.toLocaleString()}</strong> / {lang === 'en' ? 'yr' : lang === 'uk' ? 'рік' : lang === 'de' ? 'Jahr' : 'год'}</span>
                      </div>
                      {isObsolete ? (
                        <div className="text-[11px] text-rose-300 font-semibold mt-1">
                          ⚠️ {lang === 'en' ? 'Model is obsolete (>20 yrs). Market demand for new cars has dropped to 0! Recommended to discontinue.' : lang === 'uk' ? 'Модель застаріла (>20 р.). Попит на нові авто впав до 0! Рекомендовано зняти з виробництва.' : lang === 'de' ? 'Modell veraltet (>20 J.). Nachfrage ist auf 0 gefallen!' : 'Модель морально устарела (>20 лет). Спрос на новые авто упал до 0! Рекомендуется снять с производства.'}
                        </div>
                      ) : null}

                      {/* WAREHOUSE STOCK & SALES FOR LAST YEAR */}
                      {(() => {
                        const modelSales = gameState?.reportHistory?.[0]?.salesByModel?.[model.id];
                        return (
                          <div className="mt-2 p-2 rounded-md bg-[var(--paper)]/70 border border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-2 text-xs">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-[var(--ink-heading)] flex items-center gap-1">
                                <span>📦</span>
                                <span>{lang === 'en' ? 'Last Year:' : lang === 'uk' ? 'Минулий рік:' : 'Итоги прошлого года:'}</span>
                              </span>
                              {modelSales ? (
                                <>
                                  <span className="text-[var(--ink-secondary)]">
                                    {lang === 'en' ? 'Produced' : lang === 'uk' ? 'Випущено' : 'Выпущено'}: <strong className="text-[var(--ink)] font-mono">{modelSales.produced}</strong>
                                  </span>
                                  <span>•</span>
                                  <span className="text-emerald-400">
                                    {lang === 'en' ? 'Sold' : lang === 'uk' ? 'Продано' : 'Продано'}: <strong className="font-mono">{modelSales.sold}</strong>
                                  </span>
                                  <span>•</span>
                                  <span className={modelSales.unsold > 0 ? 'text-amber-400 font-bold' : 'text-[var(--ink-secondary)]'}>
                                    {lang === 'en' ? 'In Stock (Unsold)' : lang === 'uk' ? 'Залишок на складі' : 'Осталось на складе'}: <strong className="font-mono">{modelSales.unsold}</strong>
                                  </span>
                                </>
                              ) : (
                                <span className="text-[11px] text-[var(--ink-secondary)] italic">
                                  {lang === 'en' ? 'No sales data yet' : lang === 'uk' ? 'Немає даних за минулий рік' : 'Нет данных за прошлый год (новая модель)'}
                                </span>
                              )}
                            </div>

                            {modelSales && modelSales.unsold > 0 ? (
                              <span className="text-[11px] px-2 py-0.5 rounded bg-amber-950/40 text-amber-300 border border-amber-600/40 font-semibold">
                                ⚠️ {lang === 'en' ? `${modelSales.unsold} cars unsold in warehouse` : lang === 'uk' ? `${modelSales.unsold} авто не продано (на складі)` : `${modelSales.unsold} авто не продано (лежат на складе)`}
                              </span>
                            ) : modelSales && modelSales.produced > 0 ? (
                              <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-300 border border-emerald-600/40 font-semibold">
                                ✨ {lang === 'en' ? '100% Sold Out' : lang === 'uk' ? '100% Розпродано' : '100% Распродано'}
                              </span>
                            ) : null}
                          </div>
                        );
                      })()}
                    </div>

                    {/* QUOTA INPUT & QUICK BUTTONS */}
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <label htmlFor={`quota-${model.id}`} className="block text-[10px] text-[var(--ink-secondary)] uppercase font-semibold">
                          {t.production.plannedUnits}{' '}
                          <span className="opacity-70 font-mono">
                            ({lang === 'en' ? 'max' : lang === 'uk' ? 'макс' : lang === 'de' ? 'max' : 'макс'}: {maxForThisModel})
                          </span>
                        </label>
                        <div className="flex items-center gap-1 mt-0.5">
                          <button
                            type="button"
                            onClick={() => handlePlanChange(model.id, planned - 1)}
                            disabled={planned <= 0}
                            className="h-7 w-7 rounded bg-[var(--paper)] hover:bg-[var(--surface-nested)] disabled:opacity-30 font-bold era-heading text-xs flex items-center justify-center border border-[var(--border-subtle)] cursor-pointer shadow-2xs transition"
                            title="-1"
                          >
                            -
                          </button>
                          <input
                            id={`quota-${model.id}`}
                            type="number"
                            min="0"
                            max={maxForThisModel}
                            step="1"
                            value={planned}
                            onChange={(e) => handlePlanChange(model.id, Number(e.target.value))}
                            className="w-16 rounded-lg era-input px-2 py-1 text-center text-xs font-bold font-mono text-[var(--ink)] shadow-inner"
                          />
                          <button
                            type="button"
                            onClick={() => handlePlanChange(model.id, planned + 1)}
                            disabled={planned >= maxForThisModel}
                            className="h-7 w-7 rounded bg-[var(--paper)] hover:bg-[var(--surface-nested)] disabled:opacity-30 font-bold era-heading text-xs flex items-center justify-center border border-[var(--border-subtle)] cursor-pointer shadow-2xs transition"
                            title="+1"
                          >
                            +
                          </button>
                          <button
                            type="button"
                            onClick={() => handlePlanChange(model.id, maxForThisModel)}
                            disabled={planned >= maxForThisModel}
                            className="px-2 py-1 rounded bg-[var(--paper)] hover:bg-[var(--surface-nested)] disabled:opacity-30 border border-[var(--border-subtle)] text-[10px] font-bold era-label cursor-pointer shadow-2xs transition"
                            title={lang === 'en' ? 'Take all remaining factory capacity' : lang === 'uk' ? 'Зайняти всю вільну потужність' : lang === 'de' ? 'Restkapazität belegen' : 'Занять весь свободный резерв цеха'}
                          >
                            {lang === 'en' ? 'Max' : lang === 'uk' ? 'Макс' : lang === 'de' ? 'Max' : 'Макс'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handlePlanChange(model.id, 0)}
                            disabled={planned <= 0}
                            className="px-1.5 py-1 rounded bg-[var(--paper)] hover:bg-rose-950/20 text-stone-500 hover:text-rose-600 disabled:opacity-30 border border-[var(--border-subtle)] text-[10px] font-bold cursor-pointer shadow-2xs transition"
                            title={lang === 'en' ? 'Reset to 0' : 'Обнулить'}
                          >
                            0
                          </button>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            await decommissionVehicleModel(model.id);
                            setStatusMsg(
                              lang === 'en'
                                ? `Model "${model.name}" has been removed from production line`
                                : lang === 'uk'
                                ? `Модель «${model.name}» знята з виробничої лінії`
                                : lang === 'de'
                                ? `Modell „${model.name}“ von der Linie genommen`
                                : `Модель «${model.name}» снята со сборочной линии`
                            );
                          } catch (err) {
                            setStatusMsg(`Ошибка: ${String(err)}`);
                          }
                        }}
                        className="self-end mb-0.5 py-1.5 px-2.5 rounded-lg border border-amber-600/40 bg-[var(--paper)] hover:bg-amber-950/20 text-amber-950 dark:text-amber-200 text-xs font-bold transition flex items-center gap-1 cursor-pointer shadow-xs"
                        title={lang === 'en' ? 'Discontinue from production' : lang === 'uk' ? 'Зняти з виробництва' : lang === 'de' ? 'Produktion einstellen' : 'Снять с производства'}
                      >
                        <span>🛑</span>
                        <span className="hidden sm:inline">{lang === 'en' ? 'Discontinue' : lang === 'uk' ? 'Зняти' : lang === 'de' ? 'Einstellen' : 'Снять'}</span>
                      </button>
                    </div>
                  </div>

                  {/* MATERIAL REQUIREMENTS PER UNIT */}
                  <div className="mt-3 pt-2.5 border-t border-[var(--border-subtle)]">
                    <span className="text-[10px] text-[var(--ink-secondary)] uppercase block font-semibold mb-1.5">
                      {t.production.materialsRequiredPerUnit}:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(req).map(([matKey, amount]) => {
                        if (!amount || amount <= 0) return null;
                        const m = matKey as MaterialType;
                        const icon = MATERIAL_ICONS[m] ?? '📦';
                        const name = t.materials[m] ?? m;
                        const unit = t.materials.units[m] ?? 'ед.';

                        return (
                          <span
                            key={matKey}
                            className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] bg-[var(--paper)] border border-[var(--border-subtle)] text-[var(--ink)] shadow-2xs font-sans"
                          >
                            <span>{icon}</span>
                            <span>{name}:</span>
                            <strong className="text-[var(--ink-value)]">{amount} {unit}</strong>
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MATERIALS WAREHOUSE & COMMODITY MARKET */}
      <div className="era-card p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[var(--border-subtle)] pb-3 mb-4 gap-3">
          <div>
            <h2 className="text-base font-bold text-[var(--ink-heading)] era-heading flex items-center gap-2">
              <span>🪵</span> {t.production.warehouseTitle}
            </h2>
            <p className="text-xs text-[var(--ink-secondary)] font-sans">
              {t.production.warehouseSubtitle}
            </p>
          </div>

          {/* AUTO-PROCUREMENT TOGGLE */}
          <div className="flex items-center gap-3 bg-[var(--surface-nested)] border border-[var(--border-subtle)] px-3 py-2 rounded-lg">
            <input
              type="checkbox"
              id="autoProcure"
              checked={isAutoProcure}
              onChange={handleToggleAutoProcure}
              disabled={actionPending}
              className="h-4 w-4 rounded border-[var(--border-subtle)] text-[var(--accent)] focus:ring-[var(--accent-gold)] cursor-pointer"
            />
            <label htmlFor="autoProcure" className="cursor-pointer text-xs font-bold text-[var(--ink)] select-none">
              {t.production.autoProcurement}
            </label>
          </div>
        </div>

        <p className="text-[11px] text-[var(--ink-secondary)] italic mb-4">
          {t.production.autoProcurementHint}
        </p>

        {/* MATERIAL CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {marketMaterials.map((item) => {
            const inStock = inventory[item.id] ?? 0;
            const demand = materialDemand[item.id] ?? 0;
            const isShort = demand > inStock;
            const icon = MATERIAL_ICONS[item.id] ?? '📦';
            const name = t.materials[item.id] ?? item.name;
            const unit = t.materials.units[item.id] ?? item.unit;

            return (
              <div
                key={item.id}
                className={`rounded-lg border p-4 flex flex-col justify-between transition ${
                  isShort
                    ? inStock === 0
                      ? 'border-rose-500/60 bg-rose-950/20'
                      : 'border-amber-500/50 bg-amber-950/15'
                    : 'border-[var(--border-subtle)] bg-[var(--surface-nested)] hover:border-[var(--border-brass)]'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{icon}</span>
                      <div>
                        <h3 className="font-bold text-sm text-[var(--ink-heading)] leading-tight">{name}</h3>
                        <span className="text-[10px] text-[var(--ink-secondary)] font-sans">
                          {t.production.yearAvailable}: {item.yearAvailable} г.
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-bold px-2 py-0.5 rounded era-badge-accent">
                      ${item.basePrice} / {unit}
                    </span>
                  </div>

                  <p className="text-[11px] text-[var(--ink-secondary)] font-sans mt-2 line-clamp-2">
                    {item.description}
                  </p>

                  <div className="mt-3 pt-2.5 border-t border-[var(--border-subtle)] space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-[var(--ink-secondary)] font-sans">{t.production.inStock}:</span>
                      <span className={`font-bold ${isShort ? 'text-rose-400' : 'text-[var(--ink)]'}`}>
                        {inStock.toLocaleString()} {unit}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-[var(--ink-secondary)] font-sans">{t.production.needNextMonth}:</span>
                      <span className="font-bold text-[var(--ink-value)]">
                        {demand.toLocaleString()} {unit}
                      </span>
                    </div>
                  </div>
                </div>

                {/* PURCHASE BATCH BUTTONS */}
                <div className="mt-4 pt-3 border-t border-[var(--border-subtle)]">
                  <span className="block text-[10px] text-[var(--ink-secondary)] uppercase font-semibold mb-1.5">
                    {t.production.buyBatchBtn}:
                  </span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[50, 200, 500].map((batch) => {
                      const cost = batch * item.basePrice;
                      const canAfford = currentCash >= cost;

                      return (
                        <button
                          key={batch}
                          onClick={() => handleBuyMaterial(item.id, batch)}
                          disabled={actionPending || !canAfford}
                          className={`px-1.5 py-1 rounded text-[10px] font-bold transition flex flex-col items-center cursor-pointer ${
                            canAfford
                              ? 'bg-[var(--paper)] text-[var(--ink)] border border-[var(--border-subtle)] hover:border-[var(--border-brass)] hover:text-[var(--accent-gold)]'
                              : 'bg-transparent text-[var(--ink-secondary)] opacity-40 border border-[var(--border-subtle)] cursor-not-allowed'
                          }`}
                        >
                          <span>+{batch} {unit}</span>
                          <span className="text-[9px] opacity-80 font-normal">${cost.toLocaleString()}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
