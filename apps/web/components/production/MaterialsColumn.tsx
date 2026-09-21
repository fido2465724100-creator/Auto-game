'use client';

import React, { useState } from 'react';
import type { MaterialMarketItem, MaterialType } from '@ait/shared-types';
import { getMaterialDisplayName, getMaterialDescription } from '../../lib/materialLocalizer';

const MATERIAL_ICONS: Record<MaterialType, string> = {
  wood: '🪵',
  steel: '⚙️',
  rubber: '🛞',
  leather: '🛋️',
  aluminum: '✈️',
  plastic: '🧪',
};

interface Props {
  marketMaterials: MaterialMarketItem[];
  inventory: Record<MaterialType, number>;
  materialDemand: Record<MaterialType, number>;
  hasShortage: boolean;
  totalProcureCost: number;
  currentCash: number;
  isAutoProcure: boolean;
  actionPending: boolean;
  onBuyMaterial: (material: MaterialType, amount: number) => Promise<void>;
  onToggleAutoProcure: () => Promise<void>;
  onBuyAllShortages: () => Promise<void>;
  lang: string;
  t: any;
  year?: number;
}

export function MaterialsColumn({
  marketMaterials,
  inventory,
  materialDemand,
  hasShortage,
  totalProcureCost,
  currentCash,
  isAutoProcure,
  actionPending,
  onBuyMaterial,
  onToggleAutoProcure,
  onBuyAllShortages,
  lang,
  t,
  year = 1900,
}: Props): React.JSX.Element {
  const [buyingMat, setBuyingMat] = useState<string | null>(null);

  const handleBuy = async (mat: MaterialType, amount: number) => {
    setBuyingMat(mat);
    try {
      await onBuyMaterial(mat, amount);
    } finally {
      setBuyingMat(null);
    }
  };

  return (
    <div className="era-card p-4 space-y-4 flex flex-col h-full">
      {/* HEADER */}
      <div className="border-b border-[var(--border-subtle)] pb-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--ink-heading)] era-heading flex items-center gap-1.5">
            <span>🪵</span>
            <span>{lang === 'en' ? 'Raw Materials' : lang === 'uk' ? 'Склад сировини' : lang === 'de' ? 'Rohstofflager' : 'Сырьё и склад'}</span>
          </h2>
          {hasShortage && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-950/60 text-rose-300 border border-rose-600/60 animate-pulse">
              ⚠️ {lang === 'en' ? 'Shortage' : lang === 'uk' ? 'Дефіцит' : lang === 'de' ? 'Mangel' : 'Дефицит'}
            </span>
          )}
        </div>
        <p className="text-[11px] text-[var(--ink-secondary)] font-sans mt-0.5">
          {lang === 'en' ? 'Procurement & factory supplies' : lang === 'uk' ? 'Забезпечення цехів матеріалами' : lang === 'de' ? 'Materialbeschaffung & Werksversorgung' : 'Обеспечение цеха материалами'}
        </p>
      </div>

      {/* AUTO-PROCUREMENT STRIP */}
      <div className="rounded-lg p-2.5 bg-[var(--surface-nested)] border border-[var(--border-subtle)] space-y-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="autoProcureToggle" className="cursor-pointer text-xs font-bold text-[var(--ink)] flex items-center gap-2 select-none">
            <input
              type="checkbox"
              id="autoProcureToggle"
              checked={isAutoProcure}
              onChange={onToggleAutoProcure}
              disabled={actionPending}
              className="h-4 w-4 rounded border-[var(--border-subtle)] text-[var(--accent)] cursor-pointer"
            />
            <span>{t.production.autoProcurement}</span>
          </label>
          <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${isAutoProcure ? 'bg-emerald-950/50 text-emerald-300 border border-emerald-600/40' : 'bg-stone-800 text-stone-400'}`}>
            {isAutoProcure ? (lang === 'en' ? 'ON' : lang === 'de' ? 'EIN' : 'ВКЛ') : (lang === 'en' ? 'OFF' : lang === 'de' ? 'AUS' : 'ВЫКЛ')}
          </span>
        </div>
        <p className="text-[10px] text-[var(--ink-secondary)] leading-tight">
          {lang === 'en'
            ? 'Auto-buys required parts at end of year if funds allow.'
            : lang === 'uk'
            ? 'Автоматично закуповує сировину в кінці року.'
            : lang === 'de'
            ? 'Kauft bei Jahresende automatisch Fehlbestände, falls Budget reicht.'
            : 'Автоматически докупает сырье в конце года при наличии средств.'}
        </p>
      </div>

      {/* QUICK BUY SHORTAGES BUTTON */}
      {hasShortage && (
        <button
          type="button"
          onClick={onBuyAllShortages}
          disabled={actionPending || currentCash < totalProcureCost}
          className="w-full py-1.5 px-2.5 rounded-lg text-xs font-bold bg-amber-500/20 hover:bg-amber-500/30 text-amber-950 dark:text-amber-200 border border-amber-500/60 transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-40"
        >
          <span>🛒</span>
          <span>
            {lang === 'en'
              ? `Buy Missing ($${totalProcureCost.toLocaleString()})`
              : lang === 'uk'
              ? `Докупити дефіцит ($${totalProcureCost.toLocaleString()})`
              : lang === 'de'
              ? `Fehlendes kaufen ($${totalProcureCost.toLocaleString()})`
              : `Докупить нехватку ($${totalProcureCost.toLocaleString()})`}
          </span>
        </button>
      )}

      {/* MATERIALS LIST */}
      <div className="space-y-2.5 overflow-y-auto flex-1 pr-0.5">
        {marketMaterials.map((item) => {
          const inStock = inventory[item.id] ?? 0;
          const demand = materialDemand[item.id] ?? 0;
          const isShort = demand > inStock;
          const deficit = isShort ? demand - inStock : 0;
          const icon = MATERIAL_ICONS[item.id] ?? '📦';
          const name = getMaterialDisplayName(item.id, year, t);
          const description = getMaterialDescription(item.id, year, t, item.description);
          const unit = t.materials.units[item.id] ?? 'ед.';
          const isBuying = buyingMat === item.id;

          return (
            <div
              key={item.id}
              className={`rounded-lg p-2.5 border transition ${
                isShort
                  ? 'border-rose-500/60 bg-rose-950/20 shadow-xs'
                  : 'border-[var(--border-subtle)] bg-[var(--surface-nested)]'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <span
                  className="font-bold text-[var(--ink-heading)] flex items-center gap-1 cursor-help"
                  title={description}
                >
                  <span>{icon}</span>
                  <span>{name}</span>
                </span>
                <span className="font-mono text-[11px] text-[var(--ink-secondary)]">
                  ${item.basePrice}/{unit}
                </span>
              </div>

              {/* IN STOCK vs DEMAND */}
              <div className="flex items-center justify-between text-[11px] font-sans">
                <span className="text-[var(--ink-secondary)]">
                  {lang === 'en' ? 'Stock:' : lang === 'uk' ? 'Склад:' : lang === 'de' ? 'Bestand:' : 'Склад:'}{' '}
                  <strong className="text-[var(--ink)] font-mono">{inStock}</strong>
                </span>
                <span className={isShort ? 'text-rose-300 font-bold' : 'text-[var(--ink-secondary)]'}>
                  {lang === 'en' ? 'Need:' : lang === 'uk' ? 'Потрібно:' : lang === 'de' ? 'Bedarf:' : 'Нужно:'}{' '}
                  <strong className="font-mono">{demand}</strong> {unit}
                </span>
              </div>

              {/* DEFICIT BADGE */}
              {isShort && (
                <div className="mt-1 text-[10px] text-rose-300 font-semibold flex items-center justify-between">
                  <span>⚠️ -{deficit} {unit}</span>
                  <span className="font-mono">(${(deficit * item.basePrice).toLocaleString()})</span>
                </div>
              )}

              {/* QUICK BUY BUTTONS */}
              <div className="mt-2 pt-1.5 border-t border-[var(--border-subtle)] flex items-center gap-1 justify-end">
                {isShort && (
                  <button
                    type="button"
                    onClick={() => handleBuy(item.id, deficit)}
                    disabled={actionPending || isBuying || currentCash < deficit * item.basePrice}
                    className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/50 cursor-pointer disabled:opacity-30 transition"
                    title={lang === 'en' ? `Buy missing ${deficit} units` : lang === 'uk' ? `Докупити нестачу ${deficit} ${unit}` : lang === 'de' ? `Fehlende ${deficit} ${unit} kaufen` : `Докупить нехватку ${deficit} ${unit}`}
                  >
                    +{deficit}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleBuy(item.id, 10)}
                  disabled={actionPending || isBuying || currentCash < 10 * item.basePrice}
                  className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[var(--paper)] hover:bg-[var(--surface-nested)] text-[var(--ink)] border border-[var(--border-subtle)] cursor-pointer disabled:opacity-30 transition font-mono"
                  title="+10"
                >
                  +10
                </button>
                <button
                  type="button"
                  onClick={() => handleBuy(item.id, 50)}
                  disabled={actionPending || isBuying || currentCash < 50 * item.basePrice}
                  className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[var(--paper)] hover:bg-[var(--surface-nested)] text-[var(--ink)] border border-[var(--border-subtle)] cursor-pointer disabled:opacity-30 transition font-mono"
                  title="+50"
                >
                  +50
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
