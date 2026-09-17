'use client';

import { useEffect, useState } from 'react';
import type { MaterialMarketItem, MaterialType } from '@ait/shared-types';
import { calculatePremisesRent } from '@ait/game-engine';
import { useGame } from '../../context/GameContext';
import { useLanguage } from '../../lib/i18n';
import { api } from '../../lib/api';

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
    setPlanDraft((prev) => ({
      ...prev,
      [modelId]: Math.max(0, value),
    }));
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

        {/* CAPACITY BAR */}
        <div className="mt-4">
          <div className="flex justify-between text-xs font-semibold text-[var(--ink)] mb-1.5">
            <span>{t.production.capacityUsed}</span>
            <span>
              {totalPlannedUnits} / {factory.capacity} {t.topbar.unitsQuarter} ({capacityPercent}%)
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
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3 mb-4">
          <div>
            <h2 className="text-base font-bold text-[var(--ink-heading)] era-heading flex items-center gap-2">
              <span>🚗</span> {t.production.linesTitle}
            </h2>
            <p className="text-xs text-[var(--ink-secondary)] font-sans">
              {t.production.planSubtitle}
            </p>
          </div>

          <button
            onClick={handleSavePlan}
            disabled={actionPending}
            className="btn-brass px-4 py-2 rounded-lg text-xs font-bold transition shadow-xs cursor-pointer"
          >
            💾 {t.production.savePlanBtn}
          </button>
        </div>

        {activeModels.length === 0 ? (
          <p className="py-6 text-center text-xs text-[var(--ink-secondary)] italic">
            {t.production.noModels}
          </p>
        ) : (
          <div className="space-y-4">
            {activeModels.map((model) => {
              const planned = planDraft[model.id] ?? 0;
              const unitCost = model.productionCost;
              const totalCost = unitCost * planned;
              const req = model.materialsRequired ?? {};

              return (
                <div
                  key={model.id}
                  className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-nested)] p-4 transition hover:border-[var(--border-brass)]"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[var(--ink-heading)] era-heading">{model.name}</span>
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded era-badge-accent">
                          {t.design.segments[model.targetSegment]?.name ?? model.targetSegment}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-xs text-[var(--ink-secondary)] font-sans">
                        <span>{t.production.costPerUnit}: <strong className="text-[var(--ink)]">${unitCost.toLocaleString()}</strong></span>
                        <span>•</span>
                        <span>{t.design.salePrice}: <strong className="text-[var(--ink-value)]">${model.salePrice.toLocaleString()}</strong></span>
                        <span>•</span>
                        <span>{t.production.totalCost}: <strong className="text-[var(--ink)]">${totalCost.toLocaleString()}</strong> / {lang === 'en' ? 'yr' : lang === 'uk' ? 'рік' : lang === 'de' ? 'Jahr' : 'год'}</span>
                      </div>
                    </div>

                    {/* QUOTA INPUT & DECOMMISSION BUTTON */}
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <label htmlFor={`quota-${model.id}`} className="block text-[10px] text-[var(--ink-secondary)] uppercase font-semibold">
                          {t.production.plannedUnits}
                        </label>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <input
                            id={`quota-${model.id}`}
                            type="number"
                            min="0"
                            max={factory.capacity}
                            step="1"
                            value={planned}
                            onChange={(e) => handlePlanChange(model.id, Number(e.target.value))}
                            className="w-24 rounded-lg era-input px-2.5 py-1 text-right text-xs font-bold text-[var(--ink)]"
                          />
                          <span className="text-xs text-[var(--ink-secondary)]">{t.production.unitsShort}</span>
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
                        className="self-end mb-0.5 py-1 px-2 rounded-lg border border-amber-600/40 bg-[var(--paper)] hover:bg-amber-950/20 text-amber-200 text-xs font-bold transition flex items-center gap-1 cursor-pointer shadow-xs"
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
