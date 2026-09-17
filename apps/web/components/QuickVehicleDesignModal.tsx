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

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      api.getVehicleComponents()
        .then(setAvailableComponents)
        .catch(() => setAvailableComponents([]))
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

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
      <div className="relative max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-lg border border-amber-900/30 bg-[var(--paper)] p-5 shadow-2xl text-stone-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-300 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📐</span>
            <div>
              <h2 className="font-bold text-lg text-amber-950 font-serif">Чертежное бюро: Проектирование автомобиля</h2>
              <p className="text-xs text-stone-500">Создание новой модели экипажа с интеграцией в план выпуска</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded p-1 text-stone-400 hover:bg-stone-200 hover:text-stone-700 text-lg font-bold"
          >
            ✕
          </button>
        </div>

        {loading ? (
          <div className="py-12 text-center text-sm text-stone-500">Загрузка патентных чертежей и компонентов...</div>
        ) : (
          <div className="mt-4 space-y-4">
            {errorMsg && (
              <div className="rounded bg-rose-50 border border-rose-300 p-2.5 text-xs text-rose-800 font-bold">
                {errorMsg}
              </div>
            )}

            {/* Top Grid: Blueprint Visualizer + Segment & Name Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left: 2D Blueprint */}
              <div className="rounded border border-stone-300 bg-white p-3 space-y-2">
                <div className="flex justify-between items-center text-xs text-stone-500">
                  <span className="font-bold font-serif uppercase tracking-wider text-amber-950">Чертеж прототипа</span>
                  <span>Масштаб 1:20</span>
                </div>
                <CarBlueprintSilhouette
                  segment={segment}
                  powertrain={detectedPowertrain}
                  className="h-28"
                />
                <div className="grid grid-cols-3 gap-1 pt-1 text-[11px] text-stone-600 border-t border-stone-100">
                  <div>Надежность: <strong className="text-emerald-800">{calculatedSpecs.stats.reliability}%</strong></div>
                  <div>Комфорт: <strong className="text-amber-800">{calculatedSpecs.stats.comfort}</strong></div>
                  <div>Мощность: <strong className="text-stone-900">{calculatedSpecs.stats.performance}</strong></div>
                </div>
              </div>

              {/* Right: Model Name & Class */}
              <div className="rounded border border-stone-300 bg-stone-50/70 p-3 space-y-3 text-xs">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Название модели:</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded border border-stone-300 bg-white px-2.5 py-1.5 font-serif font-bold text-stone-900 focus:outline-none focus:border-amber-700"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Целевой сегмент рынка:</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {(['economy', 'family', 'luxury', 'utility'] as VehicleSegment[]).map((seg) => (
                      <button
                        key={seg}
                        type="button"
                        onClick={() => handleSegmentChange(seg)}
                        className={`rounded border px-2 py-1.5 text-left transition ${
                          segment === seg
                            ? 'border-amber-800 bg-amber-100/70 font-bold text-amber-950'
                            : 'border-stone-200 bg-white text-stone-600 hover:border-stone-400'
                        }`}
                      >
                        <div className="font-bold leading-tight">{t.design.segments[seg]?.name ?? seg}</div>
                        <div className="text-[10px] text-stone-500 line-clamp-1">{t.design.segments[seg]?.description ?? ''}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Powertrain Filter Tabs */}
            <div className="flex items-center gap-2 border-b border-stone-200 pb-2 text-xs">
              <span className="font-bold text-stone-600">Силовая установка:</span>
              <div className="flex gap-1">
                {(['all', 'ice', 'steam', 'electric'] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPowertrainFilter(p)}
                    className={`rounded px-2.5 py-1 text-xs font-bold transition ${
                      powertrainFilter === p
                        ? 'bg-amber-900 text-white'
                        : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                    }`}
                  >
                    {p === 'all' && 'Все типы'}
                    {p === 'ice' && '⛽ ДВС (Бензин)'}
                    {p === 'steam' && '💨 Паровые котлы'}
                    {p === 'electric' && '⚡ Электромоторы'}
                  </button>
                ))}
              </div>
            </div>

            {/* Component Pickers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {/* Engine */}
              <div>
                <label className="font-bold text-stone-700 block mb-1">1. Двигатель / Силовая часть:</label>
                <select
                  value={selectedComponents.engine}
                  onChange={(e) => setSelectedComponents((prev) => ({ ...prev, engine: e.target.value }))}
                  className="w-full rounded border border-stone-300 bg-white p-1.5 font-sans"
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
                <label className="font-bold text-stone-700 block mb-1">2. Рама и шасси:</label>
                <select
                  value={selectedComponents.chassis}
                  onChange={(e) => setSelectedComponents((prev) => ({ ...prev, chassis: e.target.value }))}
                  className="w-full rounded border border-stone-300 bg-white p-1.5 font-sans"
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
                <label className="font-bold text-stone-700 block mb-1">3. Тормозная система:</label>
                <select
                  value={selectedComponents.brakes}
                  onChange={(e) => setSelectedComponents((prev) => ({ ...prev, brakes: e.target.value }))}
                  className="w-full rounded border border-stone-300 bg-white p-1.5 font-sans"
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
                <label className="font-bold text-stone-700 block mb-1">4. Кузов и кабина:</label>
                <select
                  value={selectedComponents.comfort}
                  onChange={(e) => setSelectedComponents((prev) => ({ ...prev, comfort: e.target.value }))}
                  className="w-full rounded border border-stone-300 bg-white p-1.5 font-sans"
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
            <div className="rounded border border-stone-200 bg-stone-50 p-2.5 text-xs">
              <span className="font-bold text-stone-700 block mb-1">Расход сырья на 1 автомобиль:</span>
              <div className="flex flex-wrap gap-3">
                {Object.entries(calculatedSpecs.materialsRequired).map(([mat, amount]) => (
                  <span key={mat} className="flex items-center gap-1 font-mono text-stone-800">
                    <span>{MATERIAL_ICONS[mat as MaterialType] ?? '📦'}</span>
                    <span>{(t.materials[mat as MaterialType] as string | undefined) ?? mat}:</span>
                    <strong>{amount}</strong>
                  </span>
                ))}
              </div>
            </div>

            {/* Pricing and Quota */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 border-t border-stone-200 pt-3 text-xs">
              <div>
                <label className="font-bold text-stone-600 block">Себестоимость сборки:</label>
                <div className="text-base font-bold text-stone-900 mt-0.5">${calculatedSpecs.productionCost}</div>
              </div>
              <div>
                <label className="font-bold text-stone-600 block">Отпускная цена продажи ($):</label>
                <input
                  type="number"
                  min={calculatedSpecs.productionCost}
                  step={50}
                  value={salePrice}
                  onChange={(e) => setSalePrice(Number(e.target.value))}
                  className="mt-0.5 w-full rounded border border-stone-300 bg-white px-2 py-1 font-bold text-amber-950"
                />
                <span className="text-[10px] text-stone-500">
                  Маржа: +${salePrice - calculatedSpecs.productionCost} / авто
                </span>
              </div>
              <div>
                <label className="font-bold text-stone-600 block">
                  Квота выпуска ({t.topbar.unitsQuarter}):
                </label>
                <input
                  type="number"
                  min={0}
                  max={factoryCapacity}
                  value={quarterlyQuota}
                  onChange={(e) => setQuarterlyQuota(Number(e.target.value))}
                  className="mt-0.5 w-full rounded border border-stone-300 bg-white px-2 py-1 font-bold text-amber-950"
                />
                <span className="text-[10px] text-stone-500">
                  Лимит фабрики: {factoryCapacity} {t.topbar.unitsQuarter}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 border-t border-stone-300 pt-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded border border-stone-300 bg-stone-100 px-4 py-2 text-xs font-bold text-stone-700 hover:bg-stone-200"
              >
                Отмена
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={handleCreate}
                className="rounded bg-amber-900 px-5 py-2 text-xs font-bold text-white shadow hover:bg-amber-950 disabled:opacity-50"
              >
                {saving ? 'Сохранение...' : 'Утвердить и запустить модель'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
