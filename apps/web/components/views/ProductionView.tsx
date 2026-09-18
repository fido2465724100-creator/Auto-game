'use client';

import { useEffect, useState, useRef } from 'react';
import type { MaterialMarketItem, MaterialType, VehicleModel, Region, RegionId } from '@ait/shared-types';
import { calculatePremisesRent, calculateRecommendedSalePrice, estimateVehicleAnnualDemand } from '@ait/game-engine';
import { useGame } from '../../context/GameContext';
import { useLanguage } from '../../lib/i18n';
import { api } from '../../lib/api';
import { evaluateVehiclePrice } from '../../lib/pricingHelper';
import { MaterialsColumn } from '../production/MaterialsColumn';
import { VehicleWarehouseColumn } from '../production/VehicleWarehouseColumn';
import { CarVisualThumbnail } from '../CarVisualThumbnail';

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
    scrapVehicles,
    decommissionVehicleModel,
    saveVehicleModel,
  } = useGame();
  const { t, lang } = useLanguage();

  const [marketMaterials, setMarketMaterials] = useState<MaterialMarketItem[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(true);
  const [planDraft, setPlanDraft] = useState<Record<string, number>>({});
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [actionPending, setActionPending] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'dirty'>('saved');
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    api.getMaterialsMarket()
      .then((items) => {
        setMarketMaterials(items);
      })
      .catch(() => setMarketMaterials([]))
      .finally(() => setLoading(false));
  }, [gameState?.date.year]);

  useEffect(() => {
    api.getRegions()
      .then((regs) => setRegions(regs))
      .catch(() => setRegions([]));
  }, []);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (gameState?.productionPlan) {
      setPlanDraft(gameState.productionPlan);
    }
  }, [gameState?.productionPlan]);

  if (loading || !gameState) {
    return (
      <p className="py-8 text-center text-stone-600">
        {lang === 'en'
          ? 'Loading factory and warehouse data...'
          : lang === 'uk'
          ? 'Завантаження даних заводу та складу...'
          : lang === 'de'
          ? 'Lade Fabrik- und Lagerdaten...'
          : 'Загрузка данных завода и склада...'}
      </p>
    );
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
  const inventoryVehicles = gameState.company.inventoryVehicles ?? {};

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

  // Auto-sync helper: debounces network/engine updates while updating local draft immediately
  const persistPlan = (newPlan: Record<string, number>, immediate: boolean = false) => {
    setPlanDraft(newPlan);
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    if (immediate) {
      setSaveStatus('saving');
      updateProductionPlan(newPlan)
        .then(() => setSaveStatus('saved'))
        .catch(() => setSaveStatus('dirty'));
    } else {
      setSaveStatus('dirty');
      debounceTimerRef.current = setTimeout(() => {
        setSaveStatus('saving');
        updateProductionPlan(newPlan)
          .then(() => setSaveStatus('saved'))
          .catch(() => setSaveStatus('dirty'));
      }, 350);
    }
  };

  const handlePlanChange = (modelId: string, value: number, immediate: boolean = false) => {
    const currentVal = Number(planDraft[modelId]) || 0;
    const otherPlanned = Object.entries(planDraft).reduce((sum, [id, n]) => {
      return id === modelId ? sum : sum + (Number(n) || 0);
    }, 0);
    // If already over capacity, allow decreasing from currentVal, but ceiling is currentVal or remaining capacity
    const remainingFree = Math.max(0, factory.capacity - otherPlanned);
    const maxAllowed = Math.max(currentVal, remainingFree);
    const clamped = Math.max(0, Math.min(maxAllowed, value));

    const updated = {
      ...planDraft,
      [modelId]: clamped,
    };
    persistPlan(updated, immediate);
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
    persistPlan(newPlan, true);
  };

  // Helper: Distribute factory capacity proportionally to market demand
  const handleDistributeByDemand = () => {
    if (activeModels.length === 0) return;

    // Calculate annual demand for each active model
    const modelDemands: Record<string, number> = {};
    let totalDemand = 0;
    for (const model of activeModels) {
      const demandEst = regions.length > 0 && gameState
        ? estimateVehicleAnnualDemand(model, gameState, regions)
        : { totalDemand: 35, demandByRegion: {} as Record<RegionId, number> };
      const d = Math.max(0, demandEst.totalDemand);
      modelDemands[model.id] = d;
      totalDemand += d;
    }

    if (totalDemand <= 0) {
      handleDistributeEqually();
      return;
    }

    const newPlan: Record<string, number> = {};
    if (totalDemand <= factory.capacity) {
      // Demand is within factory capacity: produce strictly what the market demands
      for (const model of activeModels) {
        newPlan[model.id] = modelDemands[model.id] ?? 0;
      }
    } else {
      // Demand exceeds capacity: distribute factory capacity proportionally using Largest Remainder Method
      let allocated = 0;
      const remainders: { id: string; remainder: number }[] = [];
      for (const model of activeModels) {
        const exactShare = (factory.capacity * (modelDemands[model.id] ?? 0)) / totalDemand;
        const floorShare = Math.floor(exactShare);
        newPlan[model.id] = floorShare;
        allocated += floorShare;
        remainders.push({ id: model.id, remainder: exactShare - floorShare });
      }
      remainders.sort((a, b) => b.remainder - a.remainder);
      let extra = factory.capacity - allocated;
      for (const item of remainders) {
        if (extra <= 0) break;
        newPlan[item.id] = (newPlan[item.id] ?? 0) + 1;
        extra--;
      }
    }
    persistPlan(newPlan, true);
    setStatusMsg(t.production.planDistributedByDemand);
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
    persistPlan(newPlan, true);
  };

  const handleSavePlan = async () => {
    setActionPending(true);
    setStatusMsg(null);
    setSaveStatus('saving');
    try {
      await updateProductionPlan(planDraft);
      setSaveStatus('saved');
      setStatusMsg(t.production.planSaved);
    } catch (err) {
      setSaveStatus('dirty');
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

  const handleBuyAllShortages = async () => {
    setActionPending(true);
    setStatusMsg(null);
    try {
      for (const [matKey, reqAmount] of Object.entries(materialDemand)) {
        const mat = matKey as MaterialType;
        const inStock = inventory[mat] ?? 0;
        const diff = (reqAmount ?? 0) - inStock;
        if (diff > 0) {
          await buyMaterial(mat, diff);
        }
      }
      setStatusMsg(
        lang === 'en'
          ? 'All shortage materials purchased successfully'
          : lang === 'uk'
          ? 'Всі дефіцитні матеріали успішно закуплено'
          : 'Все недостающие материалы успешно закуплены'
      );
    } catch (err) {
      setStatusMsg(`Ошибка: ${String(err)}`);
    } finally {
      setActionPending(false);
    }
  };

  const handleUpdateModelPrice = async (model: VehicleModel, newPrice: number) => {
    try {
      await saveVehicleModel({ ...model, salePrice: newPrice });
      setStatusMsg(
        lang === 'en'
          ? `Price for "${model.name}" updated to $${newPrice.toLocaleString()}`
          : lang === 'uk'
          ? `Ціну для «${model.name}» оновлено до $${newPrice.toLocaleString()}`
          : `Цена для «${model.name}» обновлена до $${newPrice.toLocaleString()}`
      );
    } catch (err) {
      setStatusMsg(`Ошибка: ${String(err)}`);
    }
  };

  const handleScrapVehicles = async (model: VehicleModel, count: number) => {
    try {
      await scrapVehicles(model.id, count);
      setStatusMsg(
        lang === 'en'
          ? `Scrapped ${count} units of "${model.name}" for salvage metal`
          : lang === 'uk'
          ? `Утилізовано ${count} шт. «${model.name}» на металобрухт`
          : `Утилизировано ${count} шт. «${model.name}» на металлолом`
      );
    } catch (err) {
      setStatusMsg(`Ошибка: ${String(err)}`);
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
            <span className="text-base">⚠️</span>{' '}
            {lang === 'en'
              ? `Warning: Auto-procurement requires $${totalProcureCost.toLocaleString()}, but company treasury has only $${currentCash.toLocaleString()}!`
              : lang === 'uk'
              ? `Увага: для автозакупівлі бракує коштів! Потрібно $${totalProcureCost.toLocaleString()}, а в касі лише $${currentCash.toLocaleString()}!`
              : lang === 'de'
              ? `Achtung: Automatische Beschaffung erfordert $${totalProcureCost.toLocaleString()}, Kassenbestand beträgt nur $${currentCash.toLocaleString()}!`
              : `Внимание: для автозакупки недостающего сырья требуется $${totalProcureCost.toLocaleString()}, а в кассе только $${currentCash.toLocaleString()}!`}
          </div>
          <p className="text-[11px] text-amber-200/90">
            {lang === 'en'
              ? 'Due to cash shortage, the factory will only partially purchase materials. To prevent plant downtime, take a credit line from the Bank or optimize your production quotas.'
              : lang === 'uk'
              ? 'Через дефіцит обігових коштів цех зможе закупити сировину лише частково. Щоб уникнути простою ліній, візьміть кредит у Банку або оптимізуйте квоти.'
              : lang === 'de'
              ? 'Aufgrund des Liquiditätsengpasses können Materialien nur teilweise erworben werden. Nehmen Sie einen Bankkredit auf oder optimieren Sie die Quoten.'
              : 'Из-за дефицита оборотных средств цех сможет закупить материалы лишь частично. Чтобы избежать простоя сборки, пополните баланс кредитом в Банке или оптимизируйте квоты выпуска под доступный бюджет.'}
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
                ? lang === 'en'
                  ? `Active bank loans: ${gameState.company.loans?.length}. Payments are deducted annually.`
                  : lang === 'uk'
                  ? `У компанії відкрито банківських кредитів: ${gameState.company.loans?.length}. Платежі списуються щорічно.`
                  : lang === 'de'
                  ? `Laufende Bankkredite: ${gameState.company.loans?.length}. Raten werden jährlich abgebucht.`
                  : `У компании открыто банковских кредитов: ${gameState.company.loans?.length}. Платежи списываются ежегодно.`
                : lang === 'en'
                ? 'Working capital is running low. Secure credit facilities at the Commercial Bank if needed.'
                : lang === 'uk'
                ? 'Залишок капіталу знижений. За потреби поповніть обігові кошти в Комерційному банку.'
                : lang === 'de'
                ? 'Betriebskapital ist knapp. Nutzen Sie bei Bedarf Kreditlinien der Geschäftsbank.'
                : 'Остаток капитала снижен. При необходимости пополните оборотные средства в Коммерческом банке.'}
            </span>
          </div>
          <a
            href="/bank"
            className="rounded-lg btn-brass px-3 py-1 font-bold text-xs transition shadow-xs"
          >
            {lang === 'en' ? 'Bank & Credits →' : lang === 'uk' ? 'Банк та кредити →' : lang === 'de' ? 'Bank & Kredite →' : 'Банк и кредиты →'}
          </a>
        </div>
      )}

      {/* 3-COLUMN INDUSTRIAL COCKPIT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* LEFT COLUMN (3/12): RAW MATERIALS & PROCUREMENT */}
        <div className="lg:col-span-3">
          <MaterialsColumn
            marketMaterials={marketMaterials}
            inventory={inventory}
            materialDemand={materialDemand}
            hasShortage={hasShortage}
            totalProcureCost={totalProcureCost}
            currentCash={currentCash}
            isAutoProcure={isAutoProcure}
            actionPending={actionPending}
            onBuyMaterial={handleBuyMaterial}
            onToggleAutoProcure={handleToggleAutoProcure}
            onBuyAllShortages={handleBuyAllShortages}
            lang={lang}
            t={t}
          />
        </div>

        {/* CENTER COLUMN (6/12): WORKSHOP & ASSEMBLY LINES */}
        <div className="lg:col-span-6 space-y-5">
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
              onClick={handleDistributeByDemand}
              className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-[var(--paper)] text-[var(--ink)] border border-[var(--border-subtle)] hover:bg-[var(--surface-nested)] transition shadow-xs cursor-pointer flex items-center gap-1.5"
              title={t.production.distributeByDemandHint}
            >
              <span>📊</span>
              <span>{t.production.distributeByDemand}</span>
            </button>
            {saveStatus === 'saving' ? (
              <span className="text-[11px] font-mono text-amber-500 flex items-center gap-1 animate-pulse px-2 py-1 bg-amber-500/10 rounded-md border border-amber-500/20">
                ⏳ {lang === 'en' ? 'Syncing...' : lang === 'uk' ? 'Синхронізація...' : 'Синхронизация...'}
              </span>
            ) : saveStatus === 'saved' ? (
              <span className="text-[11px] font-mono text-emerald-500 flex items-center gap-1 px-2 py-1 bg-emerald-500/10 rounded-md border border-emerald-500/20">
                ✓ {lang === 'en' ? 'Auto-saved' : lang === 'uk' ? 'Автозбережено' : 'Автосохранено'}
              </span>
            ) : (
              <span className="text-[11px] font-mono text-stone-400 flex items-center gap-1 px-2 py-1">
                • {lang === 'en' ? 'Editing' : lang === 'uk' ? 'Редагується' : 'Редактируется'}
              </span>
            )}
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
          <div className="space-y-5">
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

              // Demand & Overproduction estimation
              const demandEst = regions.length > 0 && gameState
                ? estimateVehicleAnnualDemand(model, gameState, regions)
                : { totalDemand: 35, demandByRegion: {} as Record<RegionId, number> };
              const annualDemand = demandEst.totalDemand;
              const isOverproducing = planned > annualDemand && annualDemand > 0;
              const excessUnits = Math.max(0, planned - annualDemand);
              const frozenCapital = excessUnits * unitCost;

              // Last year sales record from reports
              const lastReport = gameState.reportHistory?.[0];
              const modelSales = lastReport?.salesByModel?.[model.id];
              const warehouseStock = gameState.company.inventoryVehicles?.[model.id] ?? 0;

              return (
                <div
                  key={model.id}
                  className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-nested)] overflow-hidden shadow-sm hover:border-[var(--border-brass)] transition flex flex-col"
                >
                  {/* 1. HERO BANNER: FULL WIDTH CAR SHOWCASE */}
                  <div className="relative w-full h-40 sm:h-48 md:h-52 bg-gradient-to-b from-stone-900 via-stone-950 to-black overflow-hidden flex items-center justify-center border-b border-[var(--border-subtle)] select-none">
                    {/* Full width studio car render */}
                    <CarVisualThumbnail
                      segment={model.targetSegment}
                      designYear={modelYear}
                      className="w-full h-full border-0 rounded-none bg-transparent"
                      hideWatermark
                    />

                    {/* Top-Left Floating Info Tags */}
                    <div className="absolute top-2.5 left-3 z-10 flex flex-wrap items-center gap-1.5 backdrop-blur-md bg-black/60 px-2.5 py-1.5 rounded-lg border border-white/10 shadow-md">
                      <span className="font-bold text-sm sm:text-base text-stone-100 era-heading tracking-wide">
                        {model.name}
                      </span>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded era-badge-accent shadow-xs">
                        {t.design.segments[model.targetSegment]?.name ?? model.targetSegment}
                      </span>
                      <span className="text-[11px] text-stone-300 font-mono">
                        {modelYear} ({age} {lang === 'en' ? 'yrs' : lang === 'uk' ? 'р.' : lang === 'de' ? 'J.' : 'лет'})
                      </span>
                      {isObsolete ? (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-950/80 text-rose-300 border border-rose-500/60 shadow-xs">
                          🛑 {lang === 'en' ? 'Obsolete (0 demand)' : lang === 'uk' ? 'Застаріла (попит 0)' : lang === 'de' ? 'Veraltet (0 Nachfrage)' : 'Устарела (спрос 0)'}
                        </span>
                      ) : isAging ? (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-950/80 text-amber-300 border border-amber-500/60 shadow-xs">
                          ⚠️ {lang === 'en' ? 'Aging' : lang === 'uk' ? 'Застаріває' : lang === 'de' ? 'Alternd' : 'Устаревает'}
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-500/60 shadow-xs">
                          ✨ {lang === 'en' ? 'Fresh' : lang === 'uk' ? 'Актуальна' : lang === 'de' ? 'Aktuell' : 'Актуальная'}
                        </span>
                      )}
                    </div>

                    {/* Top-Right Floating Decommission Action */}
                    <div className="absolute top-2.5 right-3 z-10">
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            await decommissionVehicleModel(model.id);
                            setStatusMsg(
                              lang === 'en'
                                ? `Model "${model.name}" has been decommissioned`
                                : lang === 'uk'
                                ? `Модель «${model.name}» знята з виробництва`
                                : lang === 'de'
                                ? `Modell „${model.name}“ wurde stillgelegt`
                                : `Модель «${model.name}» снята с производства`
                            );
                          } catch (err) {
                            setStatusMsg(`Ошибка: ${String(err)}`);
                          }
                        }}
                        className="backdrop-blur-md bg-black/60 hover:bg-rose-950/80 text-stone-300 hover:text-rose-200 border border-white/15 hover:border-rose-500/60 text-xs font-semibold px-2.5 py-1 rounded-lg transition flex items-center gap-1.5 cursor-pointer shadow-md"
                        title={lang === 'en' ? 'Discontinue from production' : lang === 'uk' ? 'Зняти з виробництва' : lang === 'de' ? 'Aus Produktion nehmen' : 'Снять с производства'}
                      >
                        <span>🛑</span>
                        <span className="text-[11px]">{lang === 'en' ? 'Discontinue' : lang === 'uk' ? 'Зняти' : lang === 'de' ? 'Einstellen' : 'Снять'}</span>
                      </button>
                    </div>
                  </div>

                  {/* 2. COMPACT METRICS DASHBOARD (3 COLUMNS) */}
                  <div className="p-3.5 space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                      {/* TILE 1: PRICE & MARGIN */}
                      <div className="p-2.5 rounded-lg bg-[var(--paper)] border border-[var(--border-subtle)] flex flex-col justify-between space-y-1.5 text-xs shadow-2xs">
                        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-1">
                          <span className="font-bold text-[var(--ink-heading)] flex items-center gap-1">
                            <span>🏷️</span>
                            <span>{lang === 'en' ? 'Price & Profit' : lang === 'uk' ? 'Ціна та маржа' : lang === 'de' ? 'Preis & Marge' : 'Цена и маржа'}</span>
                          </span>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${priceEval.badgeClass}`}>
                            {priceEval.shortLabel}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between items-baseline">
                            <span className="text-[var(--ink-secondary)]">{t.design.salePrice}:</span>
                            <strong className="text-sm font-mono text-[var(--ink-value)]">${model.salePrice.toLocaleString()}</strong>
                          </div>
                          <div className="flex justify-between items-baseline text-[11px]">
                            <span className="text-[var(--ink-secondary)]">{t.production.costPerUnit}:</span>
                            <span className="font-mono text-[var(--ink)]">${unitCost.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-baseline pt-0.5 border-t border-[var(--border-subtle)]">
                            <span className="text-[var(--ink-secondary)]">{lang === 'en' ? 'Margin' : lang === 'uk' ? 'Маржа' : lang === 'de' ? 'Marge' : 'Маржа'}:</span>
                            <strong className={`font-mono text-xs ${unitProfit >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                              {unitProfit >= 0 ? `+$${unitProfit.toLocaleString()}` : `-$${Math.abs(unitProfit).toLocaleString()}`} ({marginPct}%)
                            </strong>
                          </div>
                        </div>
                        {model.salePrice < unitCost ? (
                          <button
                            type="button"
                            onClick={async () => {
                              try {
                                await saveVehicleModel({ ...model, salePrice: recPrice });
                                setStatusMsg(
                                  lang === 'en'
                                    ? `Price updated to $${recPrice}`
                                    : lang === 'uk'
                                    ? `Ціну оновлено на $${recPrice}`
                                    : lang === 'de'
                                    ? `Preis auf $${recPrice} aktualisiert`
                                    : `Цена обновлена на $${recPrice}`
                                );
                              } catch (err) {
                                setStatusMsg(String(err));
                              }
                            }}
                            className="w-full mt-1 py-1 px-2 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-950 dark:text-amber-200 border border-amber-500/50 text-[10px] font-bold text-center animate-pulse cursor-pointer"
                          >
                            💡 {lang === 'en' ? `Fix Price ($${recPrice.toLocaleString()})` : lang === 'uk' ? `Виправити ціну ($${recPrice.toLocaleString()})` : lang === 'de' ? `Preis anpassen ($${recPrice.toLocaleString()})` : `Исправить цену ($${recPrice.toLocaleString()})`}
                          </button>
                        ) : (
                          <span className="text-[10px] text-[var(--ink-secondary)] opacity-70 block text-right font-mono">
                            💡 {lang === 'en' ? 'Rec:' : lang === 'uk' ? 'Рек:' : lang === 'de' ? 'Empf:' : 'Рек:'} ${recPrice.toLocaleString()}
                          </span>
                        )}
                      </div>

                      {/* TILE 2: MARKET DEMAND & OVERPRODUCTION WARNING */}
                      <div className="p-2.5 rounded-lg bg-[var(--paper)] border border-[var(--border-subtle)] flex flex-col justify-between space-y-1.5 text-xs shadow-2xs">
                        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-1">
                          <span className="font-bold text-[var(--ink-heading)] flex items-center gap-1">
                            <span>📊</span>
                            <span>{lang === 'en' ? 'Market Capacity' : lang === 'uk' ? 'Попит ринку' : lang === 'de' ? 'Marktkapazität' : 'Емкость рынка'}</span>
                          </span>
                          <span className="font-mono text-xs font-bold text-[var(--ink-value)]">
                            ~{annualDemand} {lang === 'en' ? 'cars/yr' : lang === 'uk' ? 'авто/рік' : lang === 'de' ? 'Fz./Jahr' : 'авто/год'}
                          </span>
                        </div>

                        <div className="space-y-1">
                          {isOverproducing ? (
                            <div className="p-1.5 rounded bg-rose-500/15 border border-rose-500/40 text-rose-800 dark:text-rose-300 text-[11px] leading-tight">
                              <div className="font-bold flex items-center gap-1">
                                <span>⚠️</span>
                                <span>{lang === 'en' ? 'Overproduction Risk!' : lang === 'uk' ? 'Ризик перевиробництва!' : lang === 'de' ? 'Überproduktionsrisiko!' : 'Риск перепроизводства!'}</span>
                              </div>
                              <div className="mt-0.5 opacity-90">
                                +{excessUnits} {lang === 'en' ? 'cars will stall in warehouse' : lang === 'uk' ? 'авто ляжуть на склад' : lang === 'de' ? 'Fz. bleiben im Lager liegen' : 'авто лягут на склад'}
                                {frozenCapital > 0 ? ` (-$${frozenCapital.toLocaleString()})` : ''}
                              </div>
                            </div>
                          ) : planned > 0 ? (
                            <div className="p-1.5 rounded bg-emerald-500/15 border border-emerald-500/40 text-emerald-800 dark:text-emerald-300 text-[11px] leading-tight flex items-center gap-1.5">
                              <span>✅</span>
                              <div>
                                <strong className="block">{lang === 'en' ? 'Healthy Demand' : lang === 'uk' ? '100% Збут' : lang === 'de' ? 'Gesunde Nachfrage' : '100% Сбыт'}</strong>
                                <span className="text-[10px] opacity-80">{lang === 'en' ? 'Quota fits market appetite' : lang === 'uk' ? 'План повністю покривається ринком' : lang === 'de' ? 'Quote deckt Marktnachfrage' : 'Квота в пределах спроса'}</span>
                              </div>
                            </div>
                          ) : (
                            <p className="text-[11px] text-[var(--ink-secondary)] italic py-1">
                              {lang === 'en' ? 'Line is paused (0 units planned)' : lang === 'uk' ? 'Виробництво зупинено (квота 0)' : lang === 'de' ? 'Linie pausiert (0 Fz. geplant)' : 'Линия на паузе (квота 0)'}
                            </p>
                          )}
                        </div>

                        {/* Demand Saturation Bar */}
                        <div className="space-y-0.5">
                          <div className="flex justify-between text-[10px] text-[var(--ink-secondary)] font-mono">
                            <span>{lang === 'en' ? 'Market load:' : lang === 'uk' ? 'Навантаження:' : lang === 'de' ? 'Auslastung:' : 'Нагрузка:'}</span>
                            <span className={isOverproducing ? 'text-rose-500 font-bold' : 'text-[var(--ink)]'}>
                              {annualDemand > 0 ? Math.round((planned / annualDemand) * 100) : 0}%
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-[var(--surface-nested)] rounded-full overflow-hidden border border-[var(--border-subtle)]">
                            <div
                              className={`h-full transition-all duration-300 ${
                                isOverproducing ? 'bg-rose-500' : planned > annualDemand * 0.8 ? 'bg-amber-500' : 'bg-emerald-500'
                              }`}
                              style={{ width: `${Math.min(100, annualDemand > 0 ? (planned / annualDemand) * 100 : 0)}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* TILE 3: WAREHOUSE STOCK & PREVIOUS YEAR */}
                      <div className="p-2.5 rounded-lg bg-[var(--paper)] border border-[var(--border-subtle)] flex flex-col justify-between space-y-1.5 text-xs shadow-2xs">
                        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-1">
                          <span className="font-bold text-[var(--ink-heading)] flex items-center gap-1">
                            <span>📦</span>
                            <span>{lang === 'en' ? 'Warehouse & History' : lang === 'uk' ? 'Склад і історія' : lang === 'de' ? 'Lager & Historie' : 'Склад и история'}</span>
                          </span>
                          <span className="text-[10px] text-[var(--ink-secondary)]">
                            {warehouseStock} {lang === 'en' ? 'in stock' : lang === 'uk' ? 'на складі' : lang === 'de' ? 'auf Lager' : 'на складе'}
                          </span>
                        </div>

                        <div className="space-y-1 text-[11px]">
                          {modelSales ? (
                            <div className="space-y-1">
                              <div className="flex justify-between">
                                <span className="text-[var(--ink-secondary)]">{lang === 'en' ? 'Last year built:' : lang === 'uk' ? 'Випущено торік:' : lang === 'de' ? 'Vorjahr gebaut:' : 'Выпуск в прошлом году:'}</span>
                                <strong className="font-mono text-[var(--ink)]">{modelSales.produced}</strong>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-[var(--ink-secondary)]">{lang === 'en' ? 'Last year sold:' : lang === 'uk' ? 'Продано торік:' : lang === 'de' ? 'Vorjahr verkauft:' : 'Продано в прошлом году:'}</span>
                                <strong className="font-mono text-emerald-500">{modelSales.sold}</strong>
                              </div>
                              <div className="flex justify-between border-t border-[var(--border-subtle)] pt-0.5">
                                <span className="text-[var(--ink-secondary)]">{lang === 'en' ? 'Left in stock:' : lang === 'uk' ? 'Залишок на складі:' : lang === 'de' ? 'Lagerbestand:' : 'Остаток склада:'}</span>
                                <strong className={`font-mono ${modelSales.unsold > 0 ? 'text-amber-500' : 'text-[var(--ink-secondary)]'}`}>
                                  {modelSales.unsold} {modelSales.unsold > 0 ? '⚠️' : '✓'}
                                </strong>
                              </div>
                            </div>
                          ) : (
                            <p className="text-[11px] text-[var(--ink-secondary)] italic py-2">
                              {lang === 'en' ? 'New model — no prior year history' : lang === 'uk' ? 'Нова модель — немає історії продажів' : lang === 'de' ? 'Neues Modell — keine Vorjahreshistorie' : 'Новая модель — нет истории'}
                            </p>
                          )}
                        </div>

                        <div className="text-[10px] text-[var(--ink-secondary)] opacity-80 pt-1 border-t border-[var(--border-subtle)]">
                          {lang === 'en' ? 'Warehouse cars sell alongside new ones.' : lang === 'uk' ? 'Авто зі складу продаються першими.' : lang === 'de' ? 'Lagerfahrzeuge werden parallel verkauft.' : 'Авто со склада продаются первыми.'}
                        </div>
                      </div>
                    </div>

                    {/* 3. INTEGRATED BOTTOM CONTROL BAR: MATERIALS & QUOTA INPUT */}
                    <div className="pt-2.5 border-t border-[var(--border-subtle)] flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                      {/* Materials required badges */}
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] text-[var(--ink-secondary)] uppercase font-semibold mr-1">
                          {lang === 'en' ? 'Per unit:' : lang === 'uk' ? 'На 1 авто:' : lang === 'de' ? 'Pro Fz.:' : 'На 1 авто:'}
                        </span>
                        {Object.entries(req).map(([matKey, amount]) => {
                          if (!amount || amount <= 0) return null;
                          const m = matKey as MaterialType;
                          const icon = MATERIAL_ICONS[m] ?? '📦';
                          const name = t.materials[m] ?? m;
                          const unit = t.materials.units[m] ?? 'ед.';

                          return (
                            <span
                              key={matKey}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] bg-[var(--paper)] border border-[var(--border-subtle)] text-[var(--ink)] shadow-2xs font-sans"
                            >
                              <span>{icon}</span>
                              <span>{name}:</span>
                              <strong className="text-[var(--ink-value)]">{amount} {unit}</strong>
                            </span>
                          );
                        })}
                      </div>

                      {/* Quota Input Controls & Cost */}
                      <div className="flex items-center gap-3 self-end lg:self-auto flex-wrap">
                        <div className="text-right">
                          <span className="text-[10px] text-[var(--ink-secondary)] font-mono block">
                            {lang === 'en' ? 'Annual cost:' : lang === 'uk' ? 'Витрати на випуск:' : lang === 'de' ? 'Jahreskosten:' : 'Затраты:'}{' '}
                            <strong className="text-[var(--ink)] font-bold">${totalCost.toLocaleString()}</strong>
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handlePlanChange(model.id, planned - 1, true)}
                            disabled={planned <= 0}
                            className="h-7 w-7 rounded-md bg-[var(--paper)] hover:bg-[var(--surface-nested)] disabled:opacity-30 font-bold era-heading text-xs flex items-center justify-center border border-[var(--border-subtle)] cursor-pointer shadow-2xs transition"
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
                            onChange={(e) => handlePlanChange(model.id, Number(e.target.value), false)}
                            className="w-16 rounded-md era-input px-1.5 py-1 text-center text-xs font-bold font-mono text-[var(--ink)] shadow-inner"
                          />
                          <button
                            type="button"
                            onClick={() => handlePlanChange(model.id, planned + 1, true)}
                            disabled={planned >= maxForThisModel}
                            className="h-7 w-7 rounded-md bg-[var(--paper)] hover:bg-[var(--surface-nested)] disabled:opacity-30 font-bold era-heading text-xs flex items-center justify-center border border-[var(--border-subtle)] cursor-pointer shadow-2xs transition"
                            title="+1"
                          >
                            +
                          </button>
                          <button
                            type="button"
                            onClick={() => handlePlanChange(model.id, Math.floor(factory.capacity / 2), true)}
                            disabled={factory.capacity <= 0}
                            className="px-2 py-1 rounded-md bg-[var(--paper)] hover:bg-[var(--surface-nested)] disabled:opacity-30 border border-[var(--border-subtle)] text-[10px] font-bold era-label cursor-pointer shadow-2xs transition"
                            title="50%"
                          >
                            50%
                          </button>
                          <button
                            type="button"
                            onClick={() => handlePlanChange(model.id, maxForThisModel, true)}
                            disabled={planned >= maxForThisModel}
                            className="px-2 py-1 rounded-md bg-[var(--paper)] hover:bg-[var(--surface-nested)] disabled:opacity-30 border border-[var(--border-subtle)] text-[10px] font-bold era-label cursor-pointer shadow-2xs transition"
                            title={lang === 'en' ? 'Take all remaining factory capacity' : lang === 'uk' ? 'Зайняти всю вільну потужність' : lang === 'de' ? 'Gesamte freie Kapazität belegen' : 'Занять весь резерв'}
                          >
                            {lang === 'en' ? 'Max' : lang === 'uk' ? 'Макс' : lang === 'de' ? 'Max' : 'Макс'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handlePlanChange(model.id, 0, true)}
                            disabled={planned <= 0}
                            className="px-1.5 py-1 rounded-md bg-[var(--paper)] hover:bg-rose-950/20 text-stone-500 hover:text-rose-600 disabled:opacity-30 border border-[var(--border-subtle)] text-[10px] font-bold cursor-pointer shadow-2xs transition"
                            title="0"
                          >
                            0
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

        </div>

        {/* RIGHT COLUMN (3/12): VEHICLE WAREHOUSE STORAGE & CLEARANCE */}
        <div className="lg:col-span-3">
          <VehicleWarehouseColumn
            models={gameState.vehicleModels}
            inventoryVehicles={inventoryVehicles}
            onUpdatePrice={handleUpdateModelPrice}
            onScrapVehicles={handleScrapVehicles}
            lang={lang}
            t={t}
          />
        </div>
      </div>
    </div>
  );
}
