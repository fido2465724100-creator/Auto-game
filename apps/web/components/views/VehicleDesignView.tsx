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
  const {
    gameState,
    saveVehicleModel,
    updateProductionPlan,
    decommissionVehicleModel,
    activateVehicleModel,
    deleteVehicleModel,
  } = useGame();
  const { t, lang } = useLanguage();

  const [availableComponents, setAvailableComponents] = useState<VehicleComponentWithStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Form State
  const [name, setName] = useState('Model 1900-B');
  const [segment, setSegment] = useState<VehicleSegment>('economy');
  const [annualQuota, setAnnualQuota] = useState<number>(12);
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
      if (annualQuota > 0) {
        const currentPlan = gameState?.productionPlan ?? {};
        await updateProductionPlan({
          ...currentPlan,
          [newModel.id]: annualQuota,
        });
      }
      setStatusMessage(`${t.design.successMsg} (${newModel.name}, квота: ${annualQuota} ${t.topbar.unitsQuarter})`);
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
      <header className="border-b-2 border-[var(--border-subtle)] pb-4">
        <h2 className="text-2xl font-bold tracking-wide text-[var(--ink-heading)] era-heading flex items-center gap-2">
          <span>📐</span>
          <span>{t.design.title}</span>
        </h2>
        <p className="text-xs text-[var(--ink-secondary)] italic mt-0.5">{t.design.subtitle}</p>
      </header>

      {statusMessage ? (
        <div
          className={`rounded-xl border p-3.5 text-xs font-semibold shadow-2xs ${
            statusMessage.includes('Ошибка') || statusMessage.includes('Error')
              ? 'border-rose-500/60 bg-rose-950/20 text-rose-300'
              : 'border-emerald-500/60 bg-emerald-950/20 text-emerald-300'
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
          <div className="era-card p-5 space-y-4">
            <h3 className="text-base font-bold text-[var(--ink-heading)] era-heading flex items-center gap-2">
              <span className="text-[var(--accent-gold)]">1.</span>
              <span>{t.design.step1}</span>
            </h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="model-name" className="block text-xs font-bold uppercase tracking-wider text-[var(--ink-secondary)]">
                  {t.design.modelName}
                </label>
                <input
                  id="model-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1.5 w-full rounded-lg era-input px-3.5 py-2 text-[var(--ink)] font-bold text-sm shadow-inner"
                  placeholder={t.design.modelNamePlaceholder}
                  required
                />
              </div>

              <div>
                <span className="block text-xs font-bold uppercase tracking-wider text-[var(--ink-secondary)]">
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
                            ? 'border-[var(--border-brass)] bg-[var(--surface-nested)] font-semibold text-[var(--ink-heading)] shadow-md ring-1 ring-[var(--border-brass)]'
                            : 'border-[var(--border-subtle)] bg-[var(--paper)] text-[var(--ink)] hover:bg-[var(--surface-nested)] hover:border-[var(--border-brass)]'
                        }`}
                      >
                        <div className="text-sm font-bold text-[var(--ink-heading)] era-heading">{segInfo?.name ?? profile.name}</div>
                        <div className="text-[11px] text-[var(--ink-secondary)] font-mono mt-0.5">{segInfo?.tag} • ${profile.baseSalePrice}</div>
                      </button>
                    );
                  })}
                </div>
                <p className="mt-2 text-xs italic text-[var(--ink-secondary)]">
                  {t.design.segments[segment]?.description ?? SEGMENT_PROFILES[segment].description}
                </p>
              </div>
            </div>
          </div>

          {/* 2. COMPONENT SELECTION */}
          <div className="era-card p-5 space-y-4">
            <h3 className="text-base font-bold text-[var(--ink-heading)] era-heading flex items-center gap-2">
              <span className="text-[var(--accent-gold)]">2.</span>
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
                  <div key={cat} className="border-b border-[var(--border-subtle)] pb-4 last:border-b-0 last:pb-0">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <span className="block text-xs font-bold uppercase tracking-wider text-[var(--ink-secondary)]">
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
                              className={`px-2 py-0.5 rounded-md border transition-colors cursor-pointer ${
                                powertrainFilter === pf
                                  ? 'btn-brass text-white font-bold'
                                  : 'border-[var(--border-subtle)] bg-[var(--paper)] text-[var(--ink)] hover:bg-[var(--surface-nested)]'
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
                      <div className="mb-3 p-2.5 rounded-lg border border-amber-500/60 bg-amber-950/20 text-xs text-amber-200 flex items-start gap-2">
                        <span className="text-sm">⚠️</span>
                        <div>
                          <div className="font-bold text-amber-100">{t.crankWarning}</div>
                          <div className="text-[11px] text-amber-200/90 mt-0.5">
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
                                ? 'cursor-not-allowed border-[var(--border-subtle)] bg-[var(--surface-nested)] opacity-40'
                                : isSelected
                                ? 'border-[var(--border-brass)] bg-[var(--surface-nested)] ring-1 ring-[var(--border-brass)] shadow-sm'
                                : 'border-[var(--border-subtle)] bg-[var(--paper)] hover:border-[var(--border-brass)] hover:bg-[var(--surface-nested)]'
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
                                  className="accent-[var(--accent)]"
                                />
                                <span className="font-bold text-[var(--ink-heading)]">
                                  {t.components[opt.id] ?? opt.name}
                                </span>
                              </div>
                              <span className="shrink-0 font-mono font-bold text-[var(--ink-value)]">
                                {opt.costModifier > 0 ? `+$${opt.costModifier}` : '$0'}
                              </span>
                            </div>

                            {/* Badges for Powertrain & Fuel */}
                            {opt.powertrainType ? (
                              <div className="mt-1.5 flex flex-wrap gap-1">
                                <span className="px-2 py-0.5 rounded text-[10px] font-semibold era-badge-accent">
                                  {opt.powertrainType === 'steam'
                                    ? '💨 Паровая тяга'
                                    : opt.powertrainType === 'electric'
                                    ? '⚡ Электропривод'
                                    : '⛽ ДВС'}
                                </span>
                                {opt.fuelType ? (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[var(--surface-nested)] text-[var(--ink)] border border-[var(--border-subtle)] shadow-2xs">
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
                                      val > 0 ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-600/50' : 'bg-rose-950/40 text-rose-300 border border-rose-600/50'
                                    }`}
                                  >
                                    {val > 0 ? `+${val}` : val} {statName.split(' ')[0]}
                                  </span>
                                );
                              })}
                            </div>

                            {!isUnlocked && opt.requiredTechnologyId ? (
                              <div className="mt-2 text-[10px] font-semibold text-[var(--ink-secondary)] bg-[var(--surface-nested)] border border-[var(--border-subtle)] rounded px-2 py-0.5">
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
          <div className="era-card p-5 space-y-3">
            <h3 className="text-base font-bold text-[var(--ink-heading)] era-heading flex items-center gap-2">
              <span>🏭</span> <span>{t.design.step3}</span>
            </h3>
            <div>
              <label htmlFor="quarterly-quota" className="block text-xs font-bold uppercase tracking-wider text-[var(--ink-secondary)]">
                {t.design.initialQuotaLabel} ({t.topbar.unitsQuarter})
              </label>
              <p className="text-[11px] text-[var(--ink-secondary)] mt-0.5">
                {t.design.initialQuotaHint}
              </p>
              <div className="mt-3 flex items-center gap-3">
                <input
                  id="annual-quota"
                  type="number"
                  min={0}
                  max={factoryCapacity}
                  step={1}
                  value={annualQuota}
                  onChange={(e) => setAnnualQuota(Math.max(0, Number(e.target.value)))}
                  className="w-24 rounded-lg era-input px-3 py-2 text-[var(--ink)] font-mono font-bold text-sm shadow-inner"
                />
                <span className="text-xs text-[var(--ink-secondary)]">
                  {t.topbar.unitsQuarter} ({t.design.factoryCapacityHint}: <strong className="font-mono text-[var(--ink-heading)]">{factoryCapacity} {t.topbar.unitsQuarter}</strong>)
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
          <div className="era-card p-5 space-y-3">
            <h3 className="text-base font-bold text-[var(--ink-heading)] era-heading flex items-center gap-2">
              <span>📊</span>
              <span>{t.design.specsTitle}</span>
            </h3>
            <div className="space-y-3 pt-1">
              {Object.entries(calculatedSpecs.stats).map(([statKey, value]) => {
                const label = t.design.stats[statKey as keyof typeof t.design.stats] ?? statKey;
                const color = STAT_COLORS[statKey] ?? 'bg-amber-700';
                return (
                  <div key={statKey}>
                    <div className="flex justify-between text-xs font-bold text-[var(--ink-secondary)]">
                      <span>{label}</span>
                      <span className="font-mono text-[var(--ink)] font-bold">{value} / 100</span>
                    </div>
                    <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-[var(--surface-nested)] border border-[var(--border-subtle)]">
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
          <div className="era-card p-5 space-y-3">
            <h3 className="text-base font-bold text-[var(--ink-heading)] era-heading flex items-center gap-2">
              <span>💰</span>
              <span>{t.design.financeTitle}</span>
            </h3>
            <div className="space-y-3 text-sm pt-1">
              <div className="flex justify-between border-b border-[var(--border-subtle)] pb-2">
                <span className="text-[var(--ink-secondary)]">{t.design.productionCost}:</span>
                <span className="font-mono font-bold text-[var(--ink)]">
                  ${calculatedSpecs.productionCost.toLocaleString()}
                </span>
              </div>

              <div>
                <label htmlFor="sale-price" className="block text-xs font-bold uppercase tracking-wider text-[var(--ink-secondary)]">
                  {t.design.salePrice}
                </label>
                <input
                  id="sale-price"
                  type="number"
                  min={100}
                  step={50}
                  value={salePrice}
                  onChange={(e) => setSalePrice(Number(e.target.value))}
                  className="mt-1 w-full rounded-lg era-input px-3 py-2 text-[var(--ink)] font-mono font-bold text-base shadow-inner"
                  required
                />
              </div>

              <div className="flex justify-between border-t border-[var(--border-subtle)] pt-2">
                <span className="text-[var(--ink-secondary)]">{t.design.unitProfit}:</span>
                <span
                  className={`font-mono font-bold text-sm ${
                    profitPerUnit >= 0 ? 'text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-600/50' : 'text-rose-400 bg-rose-950/40 px-2 py-0.5 rounded border border-rose-600/50'
                  }`}
                >
                  {profitPerUnit >= 0 ? `+$${profitPerUnit.toLocaleString()}` : `-$${Math.abs(profitPerUnit).toLocaleString()}`}{' '}
                  ({marginPercent}%)
                </span>
              </div>
            </div>
          </div>

          {/* MATERIAL CONSUMPTION PREVIEW */}
          <div className="era-card p-5 space-y-2.5">
            <h3 className="text-base font-bold text-[var(--ink-heading)] era-heading flex items-center gap-2">
              <span>🪵</span>
              <span>{t.production.materialsRequiredPerUnit}</span>
            </h3>
            <p className="text-[11px] text-[var(--ink-secondary)]">
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
                  <div key={matKey} className="flex items-center justify-between p-2 rounded-lg bg-[var(--surface-nested)] border border-[var(--border-subtle)] shadow-2xs">
                    <span className="flex items-center gap-1.5 font-medium text-[var(--ink)] text-[11px]">
                      <span>{icon}</span> <span>{name}:</span>
                    </span>
                    <strong className="text-[var(--ink-value)] text-xs font-mono">{amount} {unit}</strong>
                  </div>
                );
              })}
            </div>
          </div>

          {/* REGIONAL SUITABILITY */}
          <div className="era-card p-5 space-y-2.5">
            <h3 className="text-base font-bold text-[var(--ink-heading)] era-heading flex items-center gap-2">
              <span>🌍</span>
              <span>{t.design.marketAppeal}</span>
            </h3>
            <p className="text-xs text-[var(--ink-secondary)]">{t.design.marketAppealHint}</p>
            <div className="space-y-2 text-xs pt-1">
              {Object.entries(calculatedSpecs.regionSuitability).map(([reg, val]) => (
                <div key={reg} className="flex items-center justify-between">
                  <span className="text-[var(--ink)] font-semibold">
                    {t.regions[reg as keyof typeof t.regions] ?? reg.replace('-', ' ')}
                  </span>
                  <span className="font-mono font-bold text-[var(--ink-value)] era-badge px-2 py-0.5 rounded border border-[var(--border-subtle)]">
                    {Math.round(val * 100)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ACTIVE PRODUCTION MODELS SECTION */}
      {(() => {
        const activeModelsList = existingModels.filter((m) => m.active !== false);
        const decommissionedModelsList = existingModels.filter((m) => m.active === false);

        return (
          <>
            <section className="era-card p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2.5">
                <h3 className="text-base font-bold text-[var(--ink-heading)] era-heading flex items-center gap-2">
                  <span>🚗</span>
                  <span>{t.design.existingModels} ({activeModelsList.length})</span>
                </h3>
                <span className="text-xs text-[var(--ink-secondary)]">
                  {lang === 'en' ? 'Active vehicles on production line' : lang === 'uk' ? 'Активні моделі у виробництві' : lang === 'de' ? 'Aktive Modelle in Produktion' : 'Активные модели на сборочной линии'}
                </span>
              </div>

              {activeModelsList.length === 0 ? (
                <p className="text-sm text-[var(--ink-secondary)] italic">{t.design.noModels}</p>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {activeModelsList.map((m) => (
                    <article key={m.id} className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-nested)] p-4 shadow-sm space-y-2.5 hover:border-[var(--border-brass)] transition">
                      <div className="flex items-start justify-between">
                        <h4 className="font-bold text-[var(--ink-heading)] era-heading text-sm">{m.name}</h4>
                        <span className="rounded-md era-badge-accent px-2 py-0.5 text-xs font-bold">
                          {t.design.segments[m.targetSegment]?.name ?? m.targetSegment}
                        </span>
                      </div>

                      <div className="my-2 grid grid-cols-3 gap-1 rounded-lg bg-[var(--paper)] p-2 text-center text-xs border border-[var(--border-subtle)] font-mono">
                        <div>
                          <span className="block text-[var(--ink-secondary)] text-[10px]">{t.design.stats.reliability.slice(0, 7)}.</span>
                          <span className="font-bold text-[var(--ink)]">{m.stats.reliability}</span>
                        </div>
                        <div>
                          <span className="block text-[var(--ink-secondary)] text-[10px]">{t.design.stats.comfort.slice(0, 7)}</span>
                          <span className="font-bold text-[var(--ink)]">{m.stats.comfort}</span>
                        </div>
                        <div>
                          <span className="block text-[var(--ink-secondary)] text-[10px]">{t.design.stats.performance.slice(0, 7)}</span>
                          <span className="font-bold text-[var(--ink)]">{m.stats.performance}</span>
                        </div>
                      </div>

                      <div className="space-y-1 text-xs text-[var(--ink-secondary)]">
                        <div className="flex justify-between">
                          <span>{t.design.productionCost}:</span>
                          <span className="font-mono font-bold text-[var(--ink)]">${m.productionCost}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>{t.design.salePrice}:</span>
                          <span className="font-mono font-bold text-[var(--ink-value)]">${m.salePrice}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>{t.production.plannedUnits}:</span>
                          <span className="font-mono font-bold text-[var(--ink)]">
                            {gameState?.productionPlan?.[m.id] ?? 0} {t.topbar.unitsQuarter}
                          </span>
                        </div>
                        <div className="flex justify-between border-t border-[var(--border-subtle)] pt-1.5 font-bold">
                          <span>{t.design.unitProfit}:</span>
                          <span className="font-mono text-emerald-400">
                            +${m.salePrice - m.productionCost} ({Math.round(((m.salePrice - m.productionCost) / (m.salePrice || 1)) * 100)}%)
                          </span>
                        </div>
                      </div>

                      {/* DECOMMISSION / DISCONTINUE BUTTON */}
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            await decommissionVehicleModel(m.id);
                            setStatusMessage(
                              lang === 'en'
                                ? `Model "${m.name}" has been decommissioned from production`
                                : lang === 'uk'
                                ? `Модель «${m.name}» знята з виробництва`
                                : lang === 'de'
                                ? `Modell „${m.name}“ wurde aus der Produktion genommen`
                                : `Модель «${m.name}» успешно снята с производства`
                            );
                          } catch (err) {
                            setStatusMessage(`Ошибка: ${String(err)}`);
                          }
                        }}
                        className="w-full mt-2.5 py-1.5 px-3 rounded-lg border border-amber-600/50 bg-[var(--paper)] hover:bg-amber-950/20 text-amber-200 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <span>🛑</span>
                        <span>
                          {lang === 'en'
                            ? 'Discontinue Production'
                            : lang === 'uk'
                            ? 'Зняти з виробництва'
                            : lang === 'de'
                            ? 'Produktion einstellen'
                            : 'Снять с производства'}
                        </span>
                      </button>
                    </article>
                  ))}
                </div>
              )}
            </section>

            {/* DISCONTINUED / ARCHIVED MODELS SECTION */}
            {decommissionedModelsList.length > 0 && (
              <section className="era-card p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2.5">
                  <h3 className="text-base font-bold text-[var(--ink-heading)] era-heading flex items-center gap-2">
                    <span>📦</span>
                    <span>
                      {lang === 'en'
                        ? `Discontinued Models (${decommissionedModelsList.length})`
                        : lang === 'uk'
                        ? `Сняті з виробництва моделі (${decommissionedModelsList.length})`
                        : lang === 'de'
                        ? `Eingestellte Modelle (${decommissionedModelsList.length})`
                        : `Снятые с производства модели (${decommissionedModelsList.length})`}
                    </span>
                  </h3>
                  <span className="text-xs text-[var(--ink-secondary)]">
                    {lang === 'en'
                      ? 'Archived blueprints can be resumed or deleted'
                      : lang === 'uk'
                      ? 'Архівні креслення можна відновити або видалити'
                      : lang === 'de'
                      ? 'Archivierte Baupläne können reaktiviert werden'
                      : 'Чертежи в архиве можно вернуть на линию или удалить'}
                  </span>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {decommissionedModelsList.map((m) => (
                    <article key={m.id} className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-nested)]/60 p-4 shadow-xs space-y-2.5 opacity-80 hover:opacity-100 transition">
                      <div className="flex items-start justify-between">
                        <h4 className="font-bold text-[var(--ink-heading)] era-heading text-sm line-through decoration-amber-500/60">
                          {m.name}
                        </h4>
                        <span className="rounded-md border border-[var(--border-subtle)] bg-[var(--paper)] text-[var(--ink-secondary)] px-2 py-0.5 text-[10px] font-bold">
                          {lang === 'en' ? 'Archived' : lang === 'uk' ? 'В архіві' : lang === 'de' ? 'Archiviert' : 'В архиве'}
                        </span>
                      </div>

                      <div className="space-y-1 text-xs text-[var(--ink-secondary)]">
                        <div className="flex justify-between">
                          <span>{t.design.productionCost}:</span>
                          <span className="font-mono text-[var(--ink)]">${m.productionCost}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>{t.design.salePrice}:</span>
                          <span className="font-mono text-[var(--ink-value)]">${m.salePrice}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-[var(--border-subtle)]">
                        <button
                          type="button"
                          onClick={async () => {
                            try {
                              await activateVehicleModel(m.id);
                              setStatusMessage(
                                lang === 'en'
                                  ? `Model "${m.name}" returned to production`
                                  : lang === 'uk'
                                  ? `Модель «${m.name}» повернуто до виробництва`
                                  : lang === 'de'
                                  ? `Modell „${m.name}“ reaktiviert`
                                  : `Модель «${m.name}» возвращена в производство`
                              );
                            } catch (err) {
                              setStatusMessage(`Ошибка: ${String(err)}`);
                            }
                          }}
                          className="flex-1 py-1 px-2.5 rounded-lg btn-brass text-white text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer shadow-xs"
                        >
                          <span>🔄</span>
                          <span>
                            {lang === 'en' ? 'Resume' : lang === 'uk' ? 'Відновити' : lang === 'de' ? 'Reaktivieren' : 'Возобновить'}
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={async () => {
                            const confirmed = confirm(
                              lang === 'en'
                                ? `Permanently delete blueprint "${m.name}"?`
                                : lang === 'uk'
                                ? `Остаточно видалити креслення «${m.name}»?`
                                : lang === 'de'
                                ? `Bauplan „${m.name}“ endgültig löschen?`
                                : `Безвозвратно удалить чертеж «${m.name}»?`
                            );
                            if (confirmed) {
                              try {
                                await deleteVehicleModel(m.id);
                                setStatusMessage(
                                  lang === 'en'
                                    ? `Blueprint "${m.name}" deleted`
                                    : lang === 'uk'
                                    ? `Креслення «${m.name}» видалено`
                                    : lang === 'de'
                                    ? `Bauplan „${m.name}“ gelöscht`
                                    : `Чертеж «${m.name}» удален`
                                );
                              } catch (err) {
                                setStatusMessage(`Ошибка: ${String(err)}`);
                              }
                            }
                          }}
                          className="py-1 px-2.5 rounded-lg border border-rose-600/40 bg-[var(--paper)] hover:bg-rose-950/20 text-rose-300 text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                          title={lang === 'en' ? 'Delete blueprint' : lang === 'uk' ? 'Видалити креслення' : lang === 'de' ? 'Bauplan löschen' : 'Удалить чертеж'}
                        >
                          <span>🗑️</span>
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}
          </>
        );
      })()}
    </div>
  );
}
