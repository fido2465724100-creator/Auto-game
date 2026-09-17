'use client';

import { useEffect, useMemo, useState } from 'react';
import type {
  VehicleModel,
  VehicleSegment,
  VehicleComponents,
  VehicleComponentWithStatus,
  ComponentCategory,
  MaterialType,
} from '@ait/shared-types';
import { calculateVehicleSpecs, SEGMENT_PROFILES } from '@ait/game-engine';
import { useGame } from '../../context/GameContext';
import { useLanguage } from '../../lib/i18n';
import { api } from '../../lib/api';
import { CarBlueprintSilhouette } from '../CarBlueprintSilhouette';

const MATERIAL_ICONS: Record<MaterialType, string> = {
  wood: '🪵',
  steel: '⚙️',
  rubber: '🛞',
  leather: '🛋️',
  aluminum: '✈️',
  plastic: '🧪',
};

const STAT_COLORS: Record<string, string> = {
  reliability: 'bg-emerald-600',
  comfort: 'bg-amber-600',
  performance: 'bg-red-600',
  efficiency: 'bg-blue-600',
  prestige: 'bg-purple-600',
  complexity: 'bg-stone-600',
};

export default function VehicleDesignPage(): React.JSX.Element {
  const { gameState, saveVehicleModel, updateProductionPlan } = useGame();
  const { t, lang } = useLanguage();

  const [availableComponents, setAvailableComponents] = useState<VehicleComponentWithStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Form State
  const [name, setName] = useState('Model 1900-B');
  const [segment, setSegment] = useState<VehicleSegment>('economy');
  const [quarterlyQuota, setQuarterlyQuota] = useState<number>(3);
  const [powertrainFilter, setPowertrainFilter] = useState<'all' | 'ice' | 'steam' | 'electric'>('all');
  const [selectedComponents, setSelectedComponents] = useState<VehicleComponents>({
    chassis: 'ladder-frame',
    engine: 'single-cylinder',
    brakes: 'band-brakes',
    comfort: 'open-runabout',
    package: 'package-none',
  });
  const [salePrice, setSalePrice] = useState<number>(SEGMENT_PROFILES.economy.baseSalePrice);

  const factoryCapacity = gameState?.company.factory?.capacity ?? gameState?.company.productionCapacity ?? 4;

  useEffect(() => {
    api.getVehicleComponents()
      .then(setAvailableComponents)
      .catch(() => setAvailableComponents([]))
      .finally(() => setLoading(false));
  }, []);

  const handleSegmentChange = (newSegment: VehicleSegment): void => {
    setSegment(newSegment);
    const profile = SEGMENT_PROFILES[newSegment];
    setSalePrice(profile.baseSalePrice);
    if (name.startsWith('Model ')) {
      const year = gameState?.date.year ?? 1900;
      setName(`Model ${year}-${newSegment.slice(0, 1).toUpperCase()}`);
    }
  };

  const componentsByCategory = useMemo(() => {
    const grouped: Record<ComponentCategory, VehicleComponentWithStatus[]> = {
      chassis: [],
      engine: [],
      brakes: [],
      comfort: [],
      package: [],
    };
    for (const comp of availableComponents) {
      grouped[comp.category]?.push(comp);
    }
    return grouped;
  }, [availableComponents]);

  const calculatedSpecs = useMemo(() => {
    return calculateVehicleSpecs(
      segment,
      selectedComponents,
      availableComponents,
      gameState?.date.year ?? 1900,
      gameState?.company.founderPerk
    );
  }, [segment, selectedComponents, availableComponents, gameState?.date.year, gameState?.company.founderPerk]);

  const selectedEngine = availableComponents.find((c) => c.id === selectedComponents.engine);
  const isCrankPenaltyActive =
    (selectedEngine?.powertrainType === 'ice' ||
      selectedComponents.engine === 'single-cylinder' ||
      selectedComponents.engine === 'inline-four') &&
    (gameState?.date.year ?? 1900) < 1912 &&
    selectedComponents.engine !== 'v4-electric';

  const profitPerUnit = salePrice - calculatedSpecs.productionCost;
  const marginPercent = Math.round((profitPerUnit / (salePrice || 1)) * 100);

  const handleSaveModel = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!name.trim()) return;

    setSaving(true);
    setStatusMessage(null);

    const modelId = `model-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString().slice(-4)}`;
    const newModel: VehicleModel = {
      id: modelId,
      name: name.trim(),
      targetSegment: segment,
      regionSuitability: calculatedSpecs.regionSuitability,
      components: selectedComponents,
      stats: calculatedSpecs.stats,
      productionCost: calculatedSpecs.productionCost,
      salePrice,
      active: true,
      designYear: gameState?.date.year ?? 1900,
      materialsRequired: calculatedSpecs.materialsRequired,
    };

    try {
      await saveVehicleModel(newModel);
      if (quarterlyQuota > 0) {
        const currentPlan = gameState?.productionPlan ?? {};
        await updateProductionPlan({
          ...currentPlan,
          [newModel.id]: quarterlyQuota,
        });
      }
      setStatusMessage(`${t.design.successMsg} (${newModel.name}, квота: ${quarterlyQuota} ${t.topbar.unitsQuarter})`);
      setName(`Model ${gameState?.date.year ?? 1900}-${String.fromCharCode(66 + (gameState?.vehicleModels.length ?? 0))}`);
    } catch (err) {
      setStatusMessage(`Ошибка: ${String(err)}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="py-8 text-center text-stone-600">Загрузка конструкторского бюро...</p>;
  }

  const existingModels = gameState?.vehicleModels ?? [];
  const categoriesList: ComponentCategory[] = ['chassis', 'engine', 'brakes', 'comfort', 'package'];

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <header className="border-b-2 border-amber-900/25 pb-4">
        <h2 className="text-2xl font-bold font-serif tracking-wide text-amber-950 flex items-center gap-2">
          <span>📐</span>
          <span>{t.design.title}</span>
        </h2>
        <p className="text-xs text-stone-600 font-serif italic mt-0.5">{t.design.subtitle}</p>
      </header>

      {statusMessage ? (
        <div
          className={`rounded-xl border p-3.5 text-xs font-semibold shadow-2xs ${
            statusMessage.includes('Ошибка') || statusMessage.includes('Error')
              ? 'border-red-300 bg-red-50 text-red-800'
              : 'border-emerald-300 bg-emerald-50 text-emerald-900'
          }`}
        >
          {statusMessage}
        </div>
      ) : null}

      {/* TWO COLUMNS: BUILDER & PREVIEW */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* LEFT / CENTER: BUILDER FORM (7 cols) */}
        <form onSubmit={handleSaveModel} className="space-y-6 lg:col-span-7">
          {/* 1. MODEL NAME & SEGMENT */}
          <div className="card-lux p-5 space-y-4">
            <h3 className="text-base font-serif font-bold text-amber-950 flex items-center gap-2">
              <span className="text-amber-800">1.</span>
              <span>{t.design.step1}</span>
            </h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="model-name" className="block text-xs font-serif font-bold uppercase tracking-wider text-stone-700">
                  {t.design.modelName}
                </label>
                <input
                  id="model-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-amber-900/30 bg-white px-3.5 py-2 text-stone-900 font-serif font-bold text-sm shadow-inner focus:border-amber-700 focus:outline-none"
                  placeholder={t.design.modelNamePlaceholder}
                  required
                />
              </div>

              <div>
                <span className="block text-xs font-serif font-bold uppercase tracking-wider text-stone-700">
                  {t.design.segment}
                </span>
                <div className="mt-2 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                  {(Object.keys(SEGMENT_PROFILES) as VehicleSegment[]).map((segKey) => {
                    const profile = SEGMENT_PROFILES[segKey];
                    const isSelected = segment === segKey;
                    const segInfo = t.design.segments[segKey];
                    return (
                      <button
                        type="button"
                        key={segKey}
                        onClick={() => handleSegmentChange(segKey)}
                        className={`rounded-xl border-2 p-3 text-left transition cursor-pointer ${
                          isSelected
                            ? 'border-amber-800 bg-amber-100/90 font-semibold text-amber-950 shadow-md ring-1 ring-amber-800/50'
                            : 'border-stone-200 bg-white/70 text-stone-700 hover:bg-amber-50/50 hover:border-amber-900/30'
                        }`}
                      >
                        <div className="text-sm font-serif font-bold text-amber-950">{segInfo?.name ?? profile.name}</div>
                        <div className="text-[11px] text-stone-600 font-mono mt-0.5">{segInfo?.tag} • ${profile.baseSalePrice}</div>
                      </button>
                    );
                  })}
                </div>
                <p className="mt-2 text-xs italic text-stone-600 font-serif">
                  {t.design.segments[segment]?.description ?? SEGMENT_PROFILES[segment].description}
                </p>
              </div>
            </div>
          </div>

          {/* 2. COMPONENT SELECTION */}
          <div className="card-lux p-5 space-y-4">
            <h3 className="text-base font-serif font-bold text-amber-950 flex items-center gap-2">
              <span className="text-amber-800">2.</span>
              <span>{t.design.step2}</span>
            </h3>
            <div className="space-y-5">
              {categoriesList.map((cat) => {
                const rawOptions = componentsByCategory[cat] ?? [];
                const selectedId = selectedComponents[cat];
                const catLabel = t.design.categories[cat] ?? cat;

                const options =
                  cat === 'engine' && powertrainFilter !== 'all'
                    ? rawOptions.filter((o) => o.powertrainType === powertrainFilter)
                    : rawOptions;

                return (
                  <div key={cat} className="border-b border-stone-200 pb-4 last:border-b-0 last:pb-0">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <span className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                        {catLabel}
                      </span>

                      {/* Powertrain Filter Tabs for Engine */}
                      {cat === 'engine' ? (
                        <div className="flex flex-wrap gap-1 text-[11px]">
                          {(['all', 'ice', 'steam', 'electric'] as const).map((pf) => (
                            <button
                              key={pf}
                              type="button"
                              onClick={() => setPowertrainFilter(pf)}
                              className={`px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                                powertrainFilter === pf
                                  ? 'border-amber-800 bg-amber-800 text-white font-bold'
                                  : 'border-stone-300 bg-white/70 text-stone-700 hover:bg-stone-100'
                              }`}
                            >
                              {pf === 'all'
                                ? t.powertrains.all
                                : pf === 'ice'
                                ? '⛽ ДВС'
                                : pf === 'steam'
                                ? '💨 Пар'
                                : '⚡ Электро'}
                            </button>
                          ))}
                        </div>
                      ) : null}
                    </div>

                    {cat === 'engine' && isCrankPenaltyActive ? (
                      <div className="mb-3 p-2.5 rounded-lg border border-amber-800/40 bg-amber-950/10 text-xs text-amber-950 flex items-start gap-2">
                        <span className="text-sm">⚠️</span>
                        <div>
                          <div className="font-bold text-amber-900">{t.crankWarning}</div>
                          <div className="text-[11px] text-stone-600 mt-0.5">
                            До 1912 года ранний ДВС заводится опасной ручной рукояткой. Паровые и электрические тяговые установки не имеют этого штрафа!
                          </div>
                        </div>
                      </div>
                    ) : null}

                    <div className="grid gap-2.5 sm:grid-cols-2">
                      {options.map((opt) => {
                        const isSelected = selectedId === opt.id;
                        const isUnlocked = opt.isUnlocked;

                        return (
                          <label
                            key={opt.id}
                            className={`relative flex cursor-pointer flex-col justify-between rounded-xl border-2 p-3 text-xs transition ${
                              !isUnlocked
                                ? 'cursor-not-allowed border-stone-200 bg-stone-100/70 opacity-60'
                                : isSelected
                                ? 'border-amber-800 bg-amber-50/90 ring-1 ring-amber-700/50 shadow-sm'
                                : 'border-stone-200 bg-white/90 hover:border-amber-800/40 hover:bg-amber-50/20'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <input
                                  type="radio"
                                  name={`category-${cat}`}
                                  value={opt.id}
                                  disabled={!isUnlocked}
                                  checked={isSelected}
                                  onChange={() =>
                                    setSelectedComponents((prev) => ({
                                      ...prev,
                                      [cat]: opt.id,
                                    }))
                                  }
                                  className="text-amber-800 focus:ring-amber-700"
                                />
                                <span className="font-serif font-bold text-stone-900">
                                  {t.components[opt.id] ?? opt.name}
                                </span>
                              </div>
                              <span className="shrink-0 font-mono font-bold text-amber-950">
                                {opt.costModifier > 0 ? `+$${opt.costModifier}` : '$0'}
                              </span>
                            </div>

                            {/* Badges for Powertrain & Fuel */}
                            {opt.powertrainType ? (
                              <div className="mt-1.5 flex flex-wrap gap-1">
                                <span className="px-2 py-0.5 rounded text-[10px] font-serif font-semibold bg-amber-100/80 text-amber-950 border border-amber-800/20 shadow-2xs">
                                  {opt.powertrainType === 'steam'
                                    ? '💨 Паровая тяга'
                                    : opt.powertrainType === 'electric'
                                    ? '⚡ Электропривод'
                                    : '⛽ ДВС'}
                                </span>
                                {opt.fuelType ? (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-serif font-semibold bg-stone-100 text-stone-700 border border-stone-200 shadow-2xs">
                                    {opt.fuelType === 'ethanol_blend'
                                      ? '🌾 Спирт / Этанол'
                                      : opt.fuelType === 'gasoline'
                                      ? '🛢️ Бензин'
                                      : opt.fuelType === 'steam_fuel'
                                      ? '🪵 Уголь/Вода'
                                      : '🔋 АКБ'}
                                  </span>
                                ) : null}
                              </div>
                            ) : null}

                            {/* Stat Modifiers */}
                            <div className="mt-2 flex flex-wrap gap-1 font-mono text-[10px]">
                              {Object.entries(opt.statModifiers).map(([statKey, val]) => {
                                if (val === undefined || val === 0) return null;
                                const statName = t.design.stats[statKey as keyof typeof t.design.stats] ?? statKey;
                                return (
                                  <span
                                    key={statKey}
                                    className={`rounded px-1.5 py-0.5 font-bold ${
                                      val > 0 ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'bg-red-50 text-red-900 border border-red-200'
                                    }`}
                                  >
                                    {val > 0 ? `+${val}` : val} {statName.split(' ')[0]}
                                  </span>
                                );
                              })}
                            </div>

                            {!isUnlocked && opt.requiredTechnologyId ? (
                              <div className="mt-2 text-[10px] font-serif font-semibold text-amber-950 bg-amber-100/70 border border-amber-300/50 rounded px-2 py-0.5">
                                🔒 {t.design.requiresTech}: {t.technologies[opt.requiredTechnologyId]?.name ?? opt.requiredTechnologyId}
                              </div>
                            ) : null}
                          </label>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. PRODUCTION QUOTA & LAUNCH */}
          <div className="card-lux p-5 space-y-3">
            <h3 className="text-base font-serif font-bold text-amber-950 flex items-center gap-2">
              <span>🏭</span> <span>{t.design.step3}</span>
            </h3>
            <div>
              <label htmlFor="quarterly-quota" className="block text-xs font-serif font-bold uppercase tracking-wider text-stone-700">
                {t.design.initialQuotaLabel} ({t.topbar.unitsQuarter})
              </label>
              <p className="text-[11px] text-stone-600 font-serif mt-0.5">
                {t.design.initialQuotaHint}
              </p>
              <div className="mt-3 flex items-center gap-3">
                <input
                  id="quarterly-quota"
                  type="number"
                  min={0}
                  max={factoryCapacity}
                  step={1}
                  value={quarterlyQuota}
                  onChange={(e) => setQuarterlyQuota(Math.max(0, Number(e.target.value)))}
                  className="w-24 rounded-lg border border-amber-900/30 bg-white px-3 py-2 text-stone-900 font-mono font-bold text-sm shadow-inner focus:border-amber-700 focus:outline-none"
                />
                <span className="text-xs text-stone-700 font-serif">
                  {t.topbar.unitsQuarter} ({t.design.factoryCapacityHint}: <strong className="font-mono text-amber-950">{factoryCapacity} {t.topbar.unitsQuarter}</strong>)
                </span>
              </div>
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={saving}
            className="btn-brass w-full py-3.5 font-bold text-white shadow-lg cursor-pointer text-sm tracking-wide"
          >
            {saving ? t.design.savingBtn : `⚡ ${t.design.submitBtn}`}
          </button>
        </form>

        {/* RIGHT: SPECS & FINANCIAL PREVIEW (5 cols) */}
        <div className="space-y-6 lg:col-span-5">
          {/* 2D RETRO BLUEPRINT SCHEMATIC */}
          <CarBlueprintSilhouette
            segment={segment}
            powertrain={selectedEngine?.powertrainType ?? 'ice'}
            className="shadow-md w-full"
          />

          {/* SPECS PANEL */}
          <div className="card-lux p-5 space-y-3">
            <h3 className="text-base font-serif font-bold text-amber-950 flex items-center gap-2">
              <span>📊</span>
              <span>{t.design.specsTitle}</span>
            </h3>
            <div className="space-y-3 pt-1">
              {Object.entries(calculatedSpecs.stats).map(([statKey, value]) => {
                const label = t.design.stats[statKey as keyof typeof t.design.stats] ?? statKey;
                const color = STAT_COLORS[statKey] ?? 'bg-amber-700';
                return (
                  <div key={statKey}>
                    <div className="flex justify-between text-xs font-serif font-bold text-stone-700">
                      <span>{label}</span>
                      <span className="font-mono text-stone-900">{value} / 100</span>
                    </div>
                    <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-stone-200 border border-stone-300/40">
                      <div
                        className={`h-full rounded-full ${color} transition-all duration-300 shadow-2xs`}
                        style={{ width: `${Math.min(100, Math.max(5, value))}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* FINANCIAL & PRICING PANEL */}
          <div className="card-lux p-5 space-y-3">
            <h3 className="text-base font-serif font-bold text-amber-950 flex items-center gap-2">
              <span>💰</span>
              <span>{t.design.financeTitle}</span>
            </h3>
            <div className="space-y-3 text-sm pt-1">
              <div className="flex justify-between border-b border-amber-900/15 pb-2">
                <span className="text-stone-700 font-serif">{t.design.productionCost}:</span>
                <span className="font-mono font-bold text-stone-900">
                  ${calculatedSpecs.productionCost.toLocaleString()}
                </span>
              </div>

              <div>
                <label htmlFor="sale-price" className="block text-xs font-serif font-bold uppercase tracking-wider text-stone-700">
                  {t.design.salePrice}
                </label>
                <input
                  id="sale-price"
                  type="number"
                  min={100}
                  step={50}
                  value={salePrice}
                  onChange={(e) => setSalePrice(Number(e.target.value))}
                  className="mt-1 w-full rounded-lg border border-amber-900/30 bg-white px-3 py-2 text-stone-900 font-mono font-bold text-base shadow-inner focus:border-amber-700 focus:outline-none"
                  required
                />
              </div>

              <div className="flex justify-between border-t border-amber-900/15 pt-2">
                <span className="text-stone-700 font-serif">{t.design.unitProfit}:</span>
                <span
                  className={`font-mono font-bold text-sm ${
                    profitPerUnit >= 0 ? 'text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300' : 'text-red-900 bg-red-50 px-2 py-0.5 rounded border border-red-300'
                  }`}
                >
                  {profitPerUnit >= 0 ? `+$${profitPerUnit.toLocaleString()}` : `-$${Math.abs(profitPerUnit).toLocaleString()}`}{' '}
                  ({marginPercent}%)
                </span>
              </div>
            </div>
          </div>

          {/* MATERIAL CONSUMPTION PREVIEW */}
          <div className="card-lux p-5 space-y-2.5">
            <h3 className="text-base font-serif font-bold text-amber-950 flex items-center gap-2">
              <span>🪵</span>
              <span>{t.production.materialsRequiredPerUnit}</span>
            </h3>
            <p className="text-[11px] text-stone-600 font-serif">
              {t.design.materialConsumptionHint}
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              {Object.entries(calculatedSpecs.materialsRequired).map(([matKey, amount]) => {
                if (!amount || amount <= 0) return null;
                const m = matKey as MaterialType;
                const icon = MATERIAL_ICONS[m] ?? '📦';
                const name = t.materials[m] ?? m;
                const unit = t.materials.units[m] ?? 'ед.';
                return (
                  <div key={matKey} className="flex items-center justify-between p-2 rounded-lg bg-white/80 border border-stone-200 shadow-2xs">
                    <span className="flex items-center gap-1.5 font-medium text-stone-700 text-[11px]">
                      <span>{icon}</span> <span>{name}:</span>
                    </span>
                    <strong className="text-amber-950 text-xs font-mono">{amount} {unit}</strong>
                  </div>
                );
              })}
            </div>
          </div>

          {/* REGIONAL SUITABILITY */}
          <div className="card-lux p-5 space-y-2.5">
            <h3 className="text-base font-serif font-bold text-amber-950 flex items-center gap-2">
              <span>🌍</span>
              <span>{t.design.marketAppeal}</span>
            </h3>
            <p className="text-xs text-stone-600 font-serif">{t.design.marketAppealHint}</p>
            <div className="space-y-2 text-xs pt-1">
              {Object.entries(calculatedSpecs.regionSuitability).map(([reg, val]) => (
                <div key={reg} className="flex items-center justify-between">
                  <span className="text-stone-800 font-serif font-semibold">
                    {t.regions[reg as keyof typeof t.regions] ?? reg.replace('-', ' ')}
                  </span>
                  <span className="font-mono font-bold text-amber-950 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
                    {Math.round(val * 100)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* EXISTING MODELS SECTION */}
      <section className="card-lux p-5 space-y-4">
        <h3 className="text-base font-serif font-bold text-amber-950 flex items-center gap-2">
          <span>🚗</span>
          <span>{t.design.existingModels} ({existingModels.length})</span>
        </h3>
        {existingModels.length === 0 ? (
          <p className="text-sm text-stone-600 font-serif">{t.design.noModels}</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {existingModels.map((m) => (
              <article key={m.id} className="rounded-xl border border-amber-900/20 bg-white/90 p-4 shadow-sm space-y-2.5 hover:border-amber-700/40 transition">
                <div className="flex items-start justify-between">
                  <h4 className="font-serif font-bold text-amber-950 text-sm">{m.name}</h4>
                  <span className="rounded-md bg-amber-100/90 border border-amber-900/20 px-2 py-0.5 text-xs font-serif font-bold text-amber-950">
                    {t.design.segments[m.targetSegment]?.name ?? m.targetSegment}
                  </span>
                </div>

                <div className="my-2 grid grid-cols-3 gap-1 rounded-lg bg-amber-50/40 p-2 text-center text-xs border border-amber-900/10 font-mono">
                  <div>
                    <span className="block text-stone-500 text-[10px]">{t.design.stats.reliability.slice(0, 7)}.</span>
                    <span className="font-bold text-stone-900">{m.stats.reliability}</span>
                  </div>
                  <div>
                    <span className="block text-stone-500 text-[10px]">{t.design.stats.comfort.slice(0, 7)}</span>
                    <span className="font-bold text-stone-900">{m.stats.comfort}</span>
                  </div>
                  <div>
                    <span className="block text-stone-500 text-[10px]">{t.design.stats.performance.slice(0, 7)}</span>
                    <span className="font-bold text-stone-900">{m.stats.performance}</span>
                  </div>
                </div>

                <div className="space-y-1 text-xs text-stone-700 font-serif">
                  <div className="flex justify-between">
                    <span>{t.design.productionCost}:</span>
                    <span className="font-mono font-bold text-stone-900">${m.productionCost}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t.design.salePrice}:</span>
                    <span className="font-mono font-bold text-amber-950">${m.salePrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t.production.plannedUnits}:</span>
                    <span className="font-mono font-bold text-stone-900">
                      {gameState?.productionPlan?.[m.id] ?? 0} {t.design.unitsMonth}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-amber-900/15 pt-1.5 font-bold">
                    <span>{t.design.unitProfit}:</span>
                    <span className="font-mono text-emerald-900">
                      +${m.salePrice - m.productionCost} ({Math.round(((m.salePrice - m.productionCost) / (m.salePrice || 1)) * 100)}%)
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
