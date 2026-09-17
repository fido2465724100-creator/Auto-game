'use client';

import { useEffect, useState } from 'react';
import type { MaterialMarketItem, MaterialType } from '@ait/shared-types';
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
  const { gameState, updateProductionPlan, buyMaterial, setAutoProcurement, expandFactory } = useGame();
  const { t } = useLanguage();

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
      <div className="border-b border-amber-900/20 pb-4">
        <h1 className="text-2xl font-bold text-amber-950 flex items-center gap-2">
          <span>🏭</span> {t.production.title}
        </h1>
        <p className="text-xs text-stone-600 font-sans mt-1">
          {t.production.subtitle}
        </p>
      </div>

      {statusMsg && (
        <div className="rounded border border-amber-800/40 bg-amber-50 px-4 py-2.5 text-xs text-amber-950 font-semibold shadow-xs flex justify-between items-center">
          <span>{statusMsg}</span>
          <button onClick={() => setStatusMsg(null)} className="text-stone-400 hover:text-stone-700 font-bold ml-4">✕</button>
        </div>
      )}

      {/* SHORTAGE ALERT */}
      {hasShortage && !isAutoProcure && (
        <div className="rounded-md border border-rose-400 bg-rose-50 p-4 text-rose-900 text-xs shadow-xs">
          <div className="flex items-center gap-2 font-bold mb-1">
            <span className="text-base">⚠️</span> {t.production.shortageAlert}
          </div>
          <p className="text-[11px] text-rose-700">
            {t.production.shortageHint}
          </p>
        </div>
      )}

      {/* AUTO-PROCUREMENT CASH DEFICIT ALERT */}
      {hasShortage && isAutoProcure && currentCash < totalProcureCost && (
        <div className="rounded-md border border-amber-500 bg-amber-50 p-4 text-amber-950 text-xs shadow-xs">
          <div className="flex items-center gap-2 font-bold mb-1">
            <span className="text-base">⚠️</span> Внимание: для автозакупки недостающего сырья требуется ${totalProcureCost.toLocaleString()}, а в кассе только ${currentCash.toLocaleString()}!
          </div>
          <p className="text-[11px] text-amber-800">
            Из-за дефицита оборотных средств цех сможет закупить материалы лишь частично. Чтобы избежать простоя сборки, пополните баланс кредитом в Банке или оптимизируйте квоты выпуска под доступный бюджет.
          </p>
        </div>
      )}

      {/* OVER CAPACITY ALERT */}
      {isOverCapacity && (
        <div className="rounded-md border border-amber-400 bg-amber-50 p-3.5 text-amber-900 text-xs shadow-xs flex items-center gap-2">
          <span className="text-base">⚠️</span>
          <span>
            {t.production.overCapacityWarning} ({totalPlannedUnits} / {factory.capacity} {t.topbar.unitsQuarter})
          </span>
        </div>
      )}

      {/* BANK / LIQUIDITY BANNER */}
      {(currentCash < 4000 || (gameState.company.loans?.length ?? 0) > 0) && (
        <div className="rounded-md border border-amber-800/30 bg-gradient-to-r from-amber-50 to-stone-50 p-3.5 text-xs shadow-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-amber-950">
            <span className="text-base">🏦</span>
            <span>
              {(gameState.company.loans?.length ?? 0) > 0
                ? `У компании открыто банковских кредитов: ${gameState.company.loans?.length}. Платежи списываются ежеквартально.`
                : 'Остаток капитала снижен. При необходимости пополните оборотные средства в Коммерческом банке.'}
            </span>
          </div>
          <a
            href="/bank"
            className="rounded bg-amber-800 text-white px-3 py-1 font-bold text-xs hover:bg-amber-900 transition shadow-xs"
          >
            Банк и кредиты →
          </a>
        </div>
      )}

      {/* FACTORY CARD */}
      <div className="rounded-lg border border-amber-900/20 bg-amber-50/40 p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-amber-900/10 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-amber-950">{factory.name}</h2>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-800 text-white">
                {t.production.level} {factory.level}
              </span>
            </div>
            <p className="text-xs text-stone-500 font-sans mt-0.5">
              {t.production.historicalPlantSubtitle}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] text-stone-500 uppercase block font-semibold">{t.production.overheadMonthly}</span>
              <span className="text-xs font-bold text-stone-800">${(factory.monthlyOverhead * 3).toLocaleString()} / кв.</span>
            </div>
            <button
              onClick={handleExpandFactory}
              disabled={actionPending || currentCash < factory.upgradeCost}
              className={`px-4 py-2 rounded text-xs font-bold transition shadow-xs ${
                currentCash >= factory.upgradeCost
                  ? 'bg-amber-800 text-white hover:bg-amber-900'
                  : 'bg-stone-300 text-stone-500 cursor-not-allowed'
              }`}
            >
              🏗️ {t.production.expandBtn} (${factory.upgradeCost.toLocaleString()})
            </button>
          </div>
        </div>

        {/* CAPACITY BAR */}
        <div className="mt-4">
          <div className="flex justify-between text-xs font-semibold text-stone-700 mb-1.5">
            <span>{t.production.capacityUsed}</span>
            <span>
              {totalPlannedUnits} / {factory.capacity} {t.topbar.unitsQuarter} ({capacityPercent}%)
            </span>
          </div>
          <div className="w-full h-3.5 bg-stone-200 rounded-full overflow-hidden border border-stone-300/80">
            <div
              className={`h-full transition-all duration-300 ${
                isOverCapacity
                  ? 'bg-rose-600'
                  : capacityPercent > 85
                  ? 'bg-amber-600'
                  : 'bg-emerald-700'
              }`}
              style={{ width: `${Math.min(100, (totalPlannedUnits / factory.capacity) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* PRODUCTION LINES & QUOTAS */}
      <div className="rounded-lg border border-stone-300 bg-[var(--paper)] p-5 shadow-xs">
        <div className="flex items-center justify-between border-b border-stone-200 pb-3 mb-4">
          <div>
            <h2 className="text-base font-bold text-amber-950 flex items-center gap-2">
              <span>🚗</span> {t.production.linesTitle}
            </h2>
            <p className="text-xs text-stone-500 font-sans">
              {t.production.planSubtitle}
            </p>
          </div>

          <button
            onClick={handleSavePlan}
            disabled={actionPending}
            className="px-4 py-2 rounded bg-amber-800 text-white text-xs font-bold hover:bg-amber-900 transition shadow-xs"
          >
            💾 {t.production.savePlanBtn}
          </button>
        </div>

        {activeModels.length === 0 ? (
          <p className="py-6 text-center text-xs text-stone-500 italic">
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
                  className="rounded border border-stone-200 bg-stone-50/70 p-4 transition hover:border-amber-700/40"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-amber-950">{model.name}</span>
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                          {t.design.segments[model.targetSegment]?.name ?? model.targetSegment}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-xs text-stone-600 font-sans">
                        <span>{t.production.costPerUnit}: <strong>${unitCost.toLocaleString()}</strong></span>
                        <span>•</span>
                        <span>{t.design.salePrice}: <strong>${model.salePrice.toLocaleString()}</strong></span>
                        <span>•</span>
                        <span>{t.production.totalCost}: <strong>${totalCost.toLocaleString()}</strong> / кв.</span>
                      </div>
                    </div>

                    {/* QUOTA INPUT */}
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <label htmlFor={`quota-${model.id}`} className="block text-[10px] text-stone-500 uppercase font-semibold">
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
                            className="w-24 rounded border border-stone-300 bg-white px-2.5 py-1 text-right text-xs font-bold text-stone-900 focus:border-amber-800 focus:outline-none"
                          />
                          <span className="text-xs text-stone-500">{t.production.unitsShort}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* MATERIAL REQUIREMENTS PER UNIT */}
                  <div className="mt-3 pt-2.5 border-t border-stone-200/80">
                    <span className="text-[10px] text-stone-500 uppercase block font-semibold mb-1.5">
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
                            className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] bg-white border border-stone-200 text-stone-700 shadow-2xs font-sans"
                          >
                            <span>{icon}</span>
                            <span>{name}:</span>
                            <strong>{amount} {unit}</strong>
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
      <div className="rounded-lg border border-stone-300 bg-[var(--paper)] p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-stone-200 pb-3 mb-4 gap-3">
          <div>
            <h2 className="text-base font-bold text-amber-950 flex items-center gap-2">
              <span>🪵</span> {t.production.warehouseTitle}
            </h2>
            <p className="text-xs text-stone-500 font-sans">
              {t.production.warehouseSubtitle}
            </p>
          </div>

          {/* AUTO-PROCUREMENT TOGGLE */}
          <div className="flex items-center gap-3 bg-amber-50/80 border border-amber-800/20 px-3 py-2 rounded-md">
            <input
              type="checkbox"
              id="autoProcure"
              checked={isAutoProcure}
              onChange={handleToggleAutoProcure}
              disabled={actionPending}
              className="h-4 w-4 rounded border-stone-300 text-amber-800 focus:ring-amber-800 cursor-pointer"
            />
            <label htmlFor="autoProcure" className="cursor-pointer text-xs font-bold text-amber-950 select-none">
              {t.production.autoProcurement}
            </label>
          </div>
        </div>

        <p className="text-[11px] text-stone-500 italic mb-4">
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
                      ? 'border-rose-400 bg-rose-50/50'
                      : 'border-amber-300 bg-amber-50/30'
                    : 'border-stone-200 bg-stone-50/50 hover:border-amber-700/30'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{icon}</span>
                      <div>
                        <h3 className="font-bold text-sm text-stone-900 leading-tight">{name}</h3>
                        <span className="text-[10px] text-stone-500 font-sans">
                          {t.production.yearAvailable}: {item.yearAvailable} г.
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-950">
                      ${item.basePrice} / {unit}
                    </span>
                  </div>

                  <p className="text-[11px] text-stone-600 font-sans mt-2 line-clamp-2">
                    {item.description}
                  </p>

                  <div className="mt-3 pt-2.5 border-t border-stone-200/80 space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-stone-500 font-sans">{t.production.inStock}:</span>
                      <span className={`font-bold ${isShort ? 'text-rose-700' : 'text-stone-900'}`}>
                        {inStock.toLocaleString()} {unit}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-stone-500 font-sans">{t.production.needNextMonth}:</span>
                      <span className="font-bold text-stone-800">
                        {demand.toLocaleString()} {unit}
                      </span>
                    </div>
                  </div>
                </div>

                {/* PURCHASE BATCH BUTTONS */}
                <div className="mt-4 pt-3 border-t border-stone-200">
                  <span className="block text-[10px] text-stone-500 uppercase font-semibold mb-1.5">
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
                          className={`px-1.5 py-1 rounded text-[10px] font-bold transition flex flex-col items-center ${
                            canAfford
                              ? 'bg-amber-800/10 text-amber-950 border border-amber-800/30 hover:bg-amber-800 hover:text-white'
                              : 'bg-stone-100 text-stone-400 border border-stone-200 cursor-not-allowed'
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
