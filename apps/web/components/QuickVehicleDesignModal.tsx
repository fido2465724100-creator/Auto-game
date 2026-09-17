'use client';

import React, { useEffect, useMemo, useState } from 'react';
import type {
  VehicleModel,
  VehicleSegment,
  VehicleComponents,
  VehicleComponentWithStatus,
  ComponentCategory,
  MaterialType,
} from '@ait/shared-types';
import { calculateVehicleSpecs, SEGMENT_PROFILES } from '@ait/game-engine';
import { useGame } from '../context/GameContext';
import { useLanguage } from '../lib/i18n';
import { api } from '../lib/api';
import { CarBlueprintSilhouette } from './CarBlueprintSilhouette';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

const MATERIAL_ICONS: Record<MaterialType, string> = {
  wood: '🪵',
  steel: '⚙️',
  rubber: '🛞',
  leather: '🛋️',
  aluminum: '✈️',
  plastic: '🧪',
};

export function QuickVehicleDesignModal({ isOpen, onClose, onCreated }: Props): React.JSX.Element | null {
  const { gameState, saveVehicleModel, updateProductionPlan } = useGame();
  const { t, lang } = useLanguage();

  const [availableComponents, setAvailableComponents] = useState<VehicleComponentWithStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State
  const currentYear = gameState?.date.year ?? 1900;
  const [name, setName] = useState(`Model ${currentYear}-N`);
  const [segment, setSegment] = useState<VehicleSegment>('economy');
  const [quarterlyQuota, setQuarterlyQuota] = useState<number>(2);
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
  const currentPlan = gameState?.productionPlan ?? {};
  const currentAllocated = Object.values(currentPlan).reduce((sum, n) => sum + (Number(n) || 0), 0);
  const remainingCapacity = Math.max(0, factoryCapacity - currentAllocated);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      setQuarterlyQuota(remainingCapacity > 0 ? Math.min(4, remainingCapacity) : 0);
      api.getVehicleComponents()
        .then(setAvailableComponents)
        .catch(() => setAvailableComponents([]))
        .finally(() => setLoading(false));
    }
  }, [isOpen, remainingCapacity]);

  const handleSegmentChange = (newSegment: VehicleSegment): void => {
    setSegment(newSegment);
    const profile = SEGMENT_PROFILES[newSegment];
    setSalePrice(profile.baseSalePrice);
    setName(`Model ${currentYear}-${newSegment.slice(0, 1).toUpperCase()}`);
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
      currentYear,
      gameState?.company.founderPerk
    );
  }, [segment, selectedComponents, availableComponents, currentYear, gameState?.company.founderPerk]);

  // Determine powertrain type for silhouette
  const detectedPowertrain = useMemo(() => {
    const eng = selectedComponents.engine;
    if (eng.includes('steam')) return 'steam';
    if (eng.includes('electric')) return 'electric';
    return 'ice';
  }, [selectedComponents.engine]);

  if (!isOpen) return null;

  const handleCreate = async () => {
    if (!name.trim()) {
      setErrorMsg('Укажите название модели');
      return;
    }
    setSaving(true);
    setErrorMsg(null);
    try {
      const modelId = `model-${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Math.random().toString().slice(2, 6)}`;
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
        designYear: currentYear,
        materialsRequired: calculatedSpecs.materialsRequired,
      };

      await saveVehicleModel(newModel);

      // Update production plan with quota
      if (quarterlyQuota > 0) {
        const currentPlan = gameState?.productionPlan ?? {};
        await updateProductionPlan({
          ...currentPlan,
          [newModel.id]: quarterlyQuota,
        });
      }

      onCreated?.();
      onClose();
    } catch (err) {
      setErrorMsg(`Ошибка при утверждении: ${String(err)}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 backdrop-blur-xs">
      <div className="era-card relative max-h-[92vh] w-full max-w-4xl overflow-y-auto p-6 shadow-2xl text-[var(--ink)]">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-[var(--border-subtle)] pb-3.5">
          <div className="flex items-center gap-2.5">
            <span className="text-3xl p-1.5 rounded-xl bg-[var(--surface-nested)] border border-[var(--border-subtle)] shadow-2xs select-none">📐</span>
            <div>
              <h2 className="font-bold text-lg text-[var(--ink-heading)] era-heading tracking-wide">
                {lang === 'en'
                  ? 'Design Bureau: Vehicle Blueprint & Engineering'
                  : lang === 'uk'
                  ? 'Конструкторське бюро: Проєктування автомобіля'
                  : lang === 'de'
                  ? 'Konstruktionsbüro: Fahrzeugentwurf & CAD'
                  : 'Чертежное бюро: Проектирование автомобиля'}
              </h2>
              <p className="text-xs text-[var(--ink-secondary)] italic">
                {lang === 'en'
                  ? 'Create a new vehicle chassis and configure initial factory production'
                  : lang === 'uk'
                  ? 'Створення нової моделі екіпажу з інтеграцією у виробничий план'
                  : lang === 'de'
                  ? 'Neues Fahrzeugmodell entwerfen und Produktionsquote festlegen'
                  : 'Создание новой модели экипажа с интеграцией в производственный план'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-[var(--ink-secondary)] hover:text-[var(--ink)] text-lg font-bold transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {loading ? (
          <div className="py-16 text-center text-sm text-[var(--ink-secondary)] font-serif">
            {lang === 'en'
              ? 'Loading drafting blueprints and component patents...'
              : lang === 'uk'
              ? 'Завантаження креслень та патентних компонентів...'
              : lang === 'de'
              ? 'Lade Baupläne und Komponentenpatente...'
              : 'Загрузка патентных чертежей и компонентов...'}
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            {errorMsg && (
              <div className="rounded-xl bg-rose-950/20 border border-rose-500/60 p-3 text-xs text-rose-300 font-bold shadow-2xs">
                {errorMsg}
              </div>
            )}

            {/* Top Grid: Blueprint Visualizer + Segment & Name Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left: 2D Blueprint */}
              <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-nested)] p-3 space-y-2 shadow-2xs">
                <div className="flex justify-between items-center text-xs text-[var(--ink-secondary)]">
                  <span className="font-bold uppercase tracking-wider text-[var(--ink-heading)] era-heading">
                    {lang === 'en' ? 'Prototype Blueprint' : lang === 'uk' ? 'Креслення прототипу' : lang === 'de' ? 'Prototyp-Bauplan' : 'Чертеж прототипа'}
                  </span>
                  <span className="font-mono text-[11px]">
                    {lang === 'en' ? 'Scale 1:20' : lang === 'uk' ? 'Масштаб 1:20' : lang === 'de' ? 'Maßstab 1:20' : 'Масштаб 1:20'}
                  </span>
                </div>
                <CarBlueprintSilhouette
                  segment={segment}
                  powertrain={detectedPowertrain}
                  className="w-full shadow-2xs"
                  year={currentYear}
                />
                <div className="grid grid-cols-3 gap-1 pt-1 text-[11px] text-[var(--ink-secondary)] border-t border-[var(--border-subtle)] font-mono">
                  <div>
                    {lang === 'en' ? 'Rel:' : lang === 'uk' ? 'Над:' : lang === 'de' ? 'Zuv:' : 'Надежность:'}{' '}
                    <strong className="text-emerald-400">{calculatedSpecs.stats.reliability}%</strong>
                  </div>
                  <div>
                    {lang === 'en' ? 'Comf:' : lang === 'uk' ? 'Комф:' : lang === 'de' ? 'Komf:' : 'Комфорт:'}{' '}
                    <strong className="text-[var(--ink-value)]">{calculatedSpecs.stats.comfort}</strong>
                  </div>
                  <div>
                    {lang === 'en' ? 'Power:' : lang === 'uk' ? 'Потуж:' : lang === 'de' ? 'Leist:' : 'Мощность:'}{' '}
                    <strong className="text-[var(--ink)]">{calculatedSpecs.stats.performance}</strong>
                  </div>
                </div>
              </div>

              {/* Right: Model Name & Class */}
              <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-nested)] p-3.5 space-y-3 text-xs shadow-2xs">
                <div>
                  <label className="font-bold text-[var(--ink-heading)] block mb-1">
                    {lang === 'en' ? 'Model Name:' : lang === 'uk' ? 'Назва моделі:' : lang === 'de' ? 'Modellname:' : 'Название модели:'}
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-lg era-input px-3 py-1.5 font-bold text-[var(--ink)] shadow-inner"
                  />
                </div>

                <div>
                  <label className="font-bold text-[var(--ink-heading)] block mb-1.5">
                    {lang === 'en' ? 'Target Market Segment:' : lang === 'uk' ? 'Цільовий сегмент ринку:' : lang === 'de' ? 'Zielmarktsegment:' : 'Целевой сегмент рынка:'}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['economy', 'family', 'luxury', 'utility'] as VehicleSegment[]).map((seg) => (
                      <button
                        key={seg}
                        type="button"
                        onClick={() => handleSegmentChange(seg)}
                        className={`rounded-xl border-2 px-2.5 py-2 text-left transition cursor-pointer ${
                          segment === seg
                            ? 'border-[var(--border-brass)] bg-[var(--surface-nested)] font-bold text-[var(--ink-heading)] shadow-xs ring-1 ring-[var(--border-brass)]'
                            : 'border-[var(--border-subtle)] bg-[var(--paper)] text-[var(--ink)] hover:border-[var(--border-brass)]'
                        }`}
                      >
                        <div className="font-bold text-[var(--ink-heading)] era-heading leading-tight">{t.design.segments[seg]?.name ?? seg}</div>
                        <div className="text-[10px] text-[var(--ink-secondary)] line-clamp-1 mt-0.5">{t.design.segments[seg]?.description ?? ''}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Powertrain Filter Tabs */}
            <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] pb-2 text-xs flex-wrap">
              <span className="font-bold text-[var(--ink-secondary)]">
                {lang === 'en' ? 'Powertrain:' : lang === 'uk' ? 'Силова установка:' : lang === 'de' ? 'Antriebsart:' : 'Силовая установка:'}
              </span>
              <div className="flex gap-1 flex-wrap">
                {(['all', 'ice', 'steam', 'electric'] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPowertrainFilter(p)}
                    className={`rounded-md px-2.5 py-1 text-xs font-bold transition cursor-pointer ${
                      powertrainFilter === p
                        ? 'btn-brass text-white'
                        : 'border border-[var(--border-subtle)] bg-[var(--paper)] text-[var(--ink)] hover:bg-[var(--surface-nested)]'
                    }`}
                  >
                    {p === 'all' && (lang === 'en' ? 'All Types' : lang === 'uk' ? 'Всі типи' : lang === 'de' ? 'Alle Typen' : 'Все типы')}
                    {p === 'ice' && (lang === 'en' ? '⛽ ICE (Petrol)' : lang === 'uk' ? '⛽ ДВЗ (Бензин)' : lang === 'de' ? '⛽ Verbrenner' : '⛽ ДВС (Бензин)')}
                    {p === 'steam' && (lang === 'en' ? '💨 Steam Boilers' : lang === 'uk' ? '💨 Парові котли' : lang === 'de' ? '💨 Dampfkessel' : '💨 Паровые котлы')}
                    {p === 'electric' && (lang === 'en' ? '⚡ Electric Motors' : lang === 'uk' ? '⚡ Електромотори' : lang === 'de' ? '⚡ Elektromotoren' : '⚡ Электромоторы')}
                  </button>
                ))}
              </div>
            </div>

            {/* Component Pickers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {/* Engine */}
              <div>
                <label className="font-bold text-[var(--ink-secondary)] block mb-1">
                  {lang === 'en' ? '1. Engine / Powertrain:' : lang === 'uk' ? '1. Двигун / Силова частина:' : lang === 'de' ? '1. Motor & Antrieb:' : '1. Двигатель / Силовая часть:'}
                </label>
                <select
                  value={selectedComponents.engine}
                  onChange={(e) => setSelectedComponents((prev) => ({ ...prev, engine: e.target.value }))}
                  className="w-full rounded-lg era-input p-1.5 font-sans"
                >
                  {componentsByCategory.engine
                    .filter((c) => {
                      if (powertrainFilter === 'all') return true;
                      if (powertrainFilter === 'steam') return c.id.includes('steam');
                      if (powertrainFilter === 'electric') return c.id.includes('electric');
                      return !c.id.includes('steam') && !c.id.includes('electric');
                    })
                    .map((c) => (
                      <option key={c.id} value={c.id} disabled={!c.isUnlocked}>
                        {c.isUnlocked ? '✓' : '🔒'} {t.components[c.id] ?? c.name} (${c.costModifier})
                      </option>
                    ))}
                </select>
              </div>

              {/* Chassis */}
              <div>
                <label className="font-bold text-[var(--ink-secondary)] block mb-1">
                  {lang === 'en' ? '2. Chassis & Frame:' : lang === 'uk' ? '2. Рама та шасі:' : lang === 'de' ? '2. Rahmen & Fahrgestell:' : '2. Рама и шасси:'}
                </label>
                <select
                  value={selectedComponents.chassis}
                  onChange={(e) => setSelectedComponents((prev) => ({ ...prev, chassis: e.target.value }))}
                  className="w-full rounded-lg era-input p-1.5 font-sans"
                >
                  {componentsByCategory.chassis.map((c) => (
                    <option key={c.id} value={c.id} disabled={!c.isUnlocked}>
                      {c.isUnlocked ? '✓' : '🔒'} {t.components[c.id] ?? c.name} (${c.costModifier})
                    </option>
                  ))}
                </select>
              </div>

              {/* Brakes */}
              <div>
                <label className="font-bold text-[var(--ink-secondary)] block mb-1">
                  {lang === 'en' ? '3. Braking System:' : lang === 'uk' ? '3. Гальмівна система:' : lang === 'de' ? '3. Bremssystem:' : '3. Тормозная система:'}
                </label>
                <select
                  value={selectedComponents.brakes}
                  onChange={(e) => setSelectedComponents((prev) => ({ ...prev, brakes: e.target.value }))}
                  className="w-full rounded-lg era-input p-1.5 font-sans"
                >
                  {componentsByCategory.brakes.map((c) => (
                    <option key={c.id} value={c.id} disabled={!c.isUnlocked}>
                      {c.isUnlocked ? '✓' : '🔒'} {t.components[c.id] ?? c.name} (${c.costModifier})
                    </option>
                  ))}
                </select>
              </div>

              {/* Comfort / Cabin */}
              <div>
                <label className="font-bold text-[var(--ink-secondary)] block mb-1">
                  {lang === 'en' ? '4. Body & Coachwork:' : lang === 'uk' ? '4. Кузов та кабіна:' : lang === 'de' ? '4. Karosserie & Aufbau:' : '4. Кузов и кабина:'}
                </label>
                <select
                  value={selectedComponents.comfort}
                  onChange={(e) => setSelectedComponents((prev) => ({ ...prev, comfort: e.target.value }))}
                  className="w-full rounded-lg era-input p-1.5 font-sans"
                >
                  {componentsByCategory.comfort.map((c) => (
                    <option key={c.id} value={c.id} disabled={!c.isUnlocked}>
                      {c.isUnlocked ? '✓' : '🔒'} {t.components[c.id] ?? c.name} (${c.costModifier})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Materials Required Preview */}
            <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-nested)] p-2.5 text-xs text-[var(--ink)]">
              <span className="font-bold text-[var(--ink-secondary)] block mb-1 font-serif">
                {lang === 'en' ? 'Materials required per vehicle:' : lang === 'uk' ? 'Витрати сировини на 1 автомобіль:' : lang === 'de' ? 'Materialbedarf pro Fahrzeug:' : 'Расход сырья на 1 автомобиль:'}
              </span>
              <div className="flex flex-wrap gap-3">
                {Object.entries(calculatedSpecs.materialsRequired).map(([mat, amount]) => (
                  <span key={mat} className="flex items-center gap-1 font-mono text-[var(--ink)]">
                    <span>{MATERIAL_ICONS[mat as MaterialType] ?? '📦'}</span>
                    <span>{(t.materials[mat as MaterialType] as string | undefined) ?? mat}:</span>
                    <strong className="text-[var(--ink-value)]">{amount}</strong>
                  </span>
                ))}
              </div>
            </div>

            {/* Pricing and Quota */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 border-t border-[var(--border-subtle)] pt-3 text-xs">
              <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-nested)] p-2.5 shadow-2xs">
                <label className="font-bold text-[var(--ink-secondary)] block font-serif">
                  {lang === 'en' ? 'Production Cost:' : lang === 'uk' ? 'Собівартість збірки:' : lang === 'de' ? 'Herstellkosten:' : 'Себестоимость сборки:'}
                </label>
                <div className="text-base font-mono font-bold text-[var(--ink)] mt-0.5">${calculatedSpecs.productionCost}</div>
              </div>
              <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-nested)] p-2.5 shadow-2xs">
                <label className="font-bold text-[var(--ink-secondary)] block font-serif">
                  {lang === 'en' ? 'Sale Price ($):' : lang === 'uk' ? 'Відпускна ціна ($):' : lang === 'de' ? 'Verkaufspreis ($):' : 'Отпускная цена продажи ($):'}
                </label>
                <input
                  type="number"
                  min={calculatedSpecs.productionCost}
                  step={50}
                  value={salePrice}
                  onChange={(e) => setSalePrice(Number(e.target.value))}
                  className="mt-1 w-full rounded-lg era-input px-2.5 py-1 font-mono font-bold text-[var(--ink-value)] shadow-inner"
                />
                <span className="text-[10px] text-[var(--ink-secondary)] font-mono mt-0.5 block">
                  {lang === 'en' ? 'Margin' : lang === 'uk' ? 'Маржа' : lang === 'de' ? 'Marge' : 'Маржа'}: +${salePrice - calculatedSpecs.productionCost} / {lang === 'en' ? 'car' : lang === 'uk' ? 'авто' : lang === 'de' ? 'Fz.' : 'авто'}
                </span>
              </div>
              <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-nested)] p-2.5 shadow-2xs">
                <label className="font-bold text-[var(--ink-secondary)] block font-serif">
                  {lang === 'en' ? 'Production Quota (cars/yr):' : lang === 'uk' ? 'Квота випуску (авто/рік):' : lang === 'de' ? 'Produktionsquote (Fz./Jahr):' : 'Квота выпуска (авто/год):'}
                </label>
                <input
                  type="number"
                  min={0}
                  max={remainingCapacity}
                  value={quarterlyQuota}
                  onChange={(e) => setQuarterlyQuota(Math.max(0, Math.min(remainingCapacity, Number(e.target.value))))}
                  className="mt-1 w-full rounded-lg era-input px-2.5 py-1 font-mono font-bold text-[var(--ink)] shadow-inner"
                />
                <span className="text-[10px] text-[var(--ink-secondary)] font-mono mt-0.5 block">
                  {lang === 'en' ? 'Available Capacity' : lang === 'uk' ? 'Вільна потужність' : lang === 'de' ? 'Freie Kapazität' : 'Свободная мощность'}:{' '}
                  <strong className={remainingCapacity > 0 ? 'text-emerald-700 dark:text-emerald-300 font-bold' : 'text-amber-600 font-bold'}>
                    {remainingCapacity} / {factoryCapacity} {lang === 'en' ? 'cars/yr' : lang === 'uk' ? 'авто/рік' : lang === 'de' ? 'Fz./Jahr' : 'авто/год'}
                  </strong>
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 border-t border-[var(--border-subtle)] pt-4">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-[var(--border-subtle)] bg-[var(--paper)] px-4 py-2 text-xs font-bold text-[var(--ink)] hover:bg-[var(--surface-nested)] transition cursor-pointer shadow-2xs font-serif"
              >
                {lang === 'en' ? 'Cancel' : lang === 'uk' ? 'Скасувати' : lang === 'de' ? 'Abbrechen' : 'Отмена'}
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={handleCreate}
                className="btn-brass px-6 py-2 text-xs font-bold text-white shadow-lg disabled:opacity-50 cursor-pointer inline-flex items-center gap-1.5 font-serif"
              >
                <span>⚡</span>
                <span>
                  {saving
                    ? (lang === 'en' ? 'Commissioning...' : lang === 'uk' ? 'Запуск...' : lang === 'de' ? 'Freigabe...' : 'Сохранение...')
                    : (lang === 'en' ? 'Approve & Launch Production' : lang === 'uk' ? 'Затвердити та запустити у виробництво' : lang === 'de' ? 'Modell freigeben & starten' : 'Утвердить и запустить модель')}
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
