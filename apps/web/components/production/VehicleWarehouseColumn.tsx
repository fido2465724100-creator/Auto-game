'use client';

import React, { useState } from 'react';
import type { VehicleModel } from '@ait/shared-types';
import { calculateRecommendedSalePrice } from '@ait/game-engine';
import { evaluateVehiclePrice } from '../../lib/pricingHelper';
import { CarVisualThumbnail } from '../CarVisualThumbnail';

interface Props {
  models: VehicleModel[];
  inventoryVehicles: Record<string, number>;
  onUpdatePrice: (model: VehicleModel, newPrice: number) => Promise<void>;
  onScrapVehicles: (model: VehicleModel, count: number) => Promise<void>;
  lang: string;
  t: any;
}

export function VehicleWarehouseColumn({
  models,
  inventoryVehicles,
  onUpdatePrice,
  onScrapVehicles,
  lang,
  t,
}: Props): React.JSX.Element {
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [editingPriceVal, setEditingPriceVal] = useState<number>(0);
  const [busyModelId, setBusyModelId] = useState<string | null>(null);

  // Models that have stock in warehouse
  const modelsInStock = models.filter((m) => (inventoryVehicles[m.id] ?? 0) > 0);
  const totalVehiclesInStock = Object.values(inventoryVehicles).reduce((sum, n) => sum + (Number(n) || 0), 0);

  const handleApplyDiscount = async (model: VehicleModel, discountPercent: number) => {
    setBusyModelId(model.id);
    try {
      const rec = calculateRecommendedSalePrice(model.targetSegment, model.productionCost);
      const discounted = Math.max(100, Math.round((rec * (1 - discountPercent / 100)) / 10) * 10);
      await onUpdatePrice(model, discounted);
    } finally {
      setBusyModelId(null);
    }
  };

  const handleApplyCostPrice = async (model: VehicleModel) => {
    setBusyModelId(model.id);
    try {
      await onUpdatePrice(model, model.productionCost);
    } finally {
      setBusyModelId(null);
    }
  };

  const handleApplyRecPrice = async (model: VehicleModel) => {
    setBusyModelId(model.id);
    try {
      const rec = calculateRecommendedSalePrice(model.targetSegment, model.productionCost);
      await onUpdatePrice(model, rec);
    } finally {
      setBusyModelId(null);
    }
  };

  const handleSaveCustomPrice = async (model: VehicleModel) => {
    setBusyModelId(model.id);
    try {
      await onUpdatePrice(model, editingPriceVal);
      setEditingPriceId(null);
    } finally {
      setBusyModelId(null);
    }
  };

  const handleScrap = async (model: VehicleModel) => {
    const stock = inventoryVehicles[model.id] ?? 0;
    if (stock <= 0) return;

    const scrapValue = Math.max(25, Math.round(model.productionCost * 0.18));
    const totalCash = stock * scrapValue;

    const confirmed = window.confirm(
      lang === 'en'
        ? `Scrap ${stock} units of "${model.name}" for scrap metal? You will recover +$${totalCash.toLocaleString()} cash.`
        : lang === 'uk'
        ? `Списати ${stock} авто «${model.name}» на брухт? Підприємство отримає +$${totalCash.toLocaleString()} готівки.`
        : lang === 'de'
        ? `${stock} Einheiten von „${model.name}“ verschrotten? Sie erhalten +$${totalCash.toLocaleString()} Barvermögen.`
        : `Утилизировать ${stock} авто «${model.name}» на металлолом? Компания получит +$${totalCash.toLocaleString()} наличными.`
    );
    if (!confirmed) return;

    setBusyModelId(model.id);
    try {
      await onScrapVehicles(model, stock);
    } finally {
      setBusyModelId(null);
    }
  };

  return (
    <div className="era-card p-4 space-y-4 flex flex-col h-full">
      {/* HEADER */}
      <div className="border-b border-[var(--border-subtle)] pb-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--ink-heading)] era-heading flex items-center gap-1.5">
            <span>📦</span>
            <span>{lang === 'en' ? 'Vehicle Stock' : lang === 'uk' ? 'Склад готових авто' : lang === 'de' ? 'Fahrzeuglager' : 'Склад авто и сбыт'}</span>
          </h2>
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-mono ${
              totalVehiclesInStock > 0
                ? 'bg-amber-950/60 text-amber-300 border border-amber-600/50'
                : 'bg-emerald-950/50 text-emerald-300 border border-emerald-600/40'
            }`}
          >
            {totalVehiclesInStock} {lang === 'en' ? 'in stock' : lang === 'uk' ? 'на складі' : lang === 'de' ? 'auf Lager' : 'на складе'}
          </span>
        </div>
        <p className="text-[11px] text-[var(--ink-secondary)] font-sans mt-0.5">
          {lang === 'en' ? 'Unsold stock & clearance discounts' : lang === 'uk' ? 'Залишки авто та ціни розпродажу' : lang === 'de' ? 'Lagerbestände & Abverkaufsrabatte' : 'Управление остатками и скидками'}
        </p>
      </div>

      {/* STOCK INVENTORY LIST */}
      <div className="space-y-3 overflow-y-auto flex-1 pr-0.5">
        {modelsInStock.length === 0 ? (
          <div className="rounded-lg p-4 bg-[var(--surface-nested)] border border-[var(--border-subtle)] text-center space-y-2">
            <span className="text-2xl block">✨</span>
            <div className="text-xs font-bold text-emerald-400">
              {lang === 'en' ? '100% Sold Out' : lang === 'uk' ? 'Склад чистий' : lang === 'de' ? 'Lager geräumt' : 'Склад чист!'}
            </div>
            <p className="text-[11px] text-[var(--ink-secondary)] leading-relaxed">
              {lang === 'en'
                ? 'All manufactured cars were successfully sold on the market. Zero capital frozen!'
                : lang === 'uk'
                ? 'Усі випущені автомобілі розпродано. Замороженого капіталу на складі немає!'
                : lang === 'de'
                ? 'Alle hergestellten Fahrzeuge wurden erfolgreich verkauft. Kein gebundenes Kapital!'
                : 'Все выпущенные авто распроданы покупателям. Замороженного капитала на складе нет!'}
            </p>
          </div>
        ) : (
          modelsInStock.map((model) => {
            const stock = inventoryVehicles[model.id] ?? 0;
            const recPrice = calculateRecommendedSalePrice(model.targetSegment, model.productionCost);
            const priceEval = evaluateVehiclePrice(model.salePrice, model.productionCost, recPrice, lang);
            const unitProfit = model.salePrice - model.productionCost;
            const isLoss = model.salePrice < model.productionCost;
            const isBusy = busyModelId === model.id;
            const isEditing = editingPriceId === model.id;
            const scrapValue = Math.max(25, Math.round(model.productionCost * 0.18));

            return (
              <div
                key={model.id}
                className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-nested)] p-2.5 space-y-2 transition hover:border-[var(--border-brass)]"
              >
                {/* CAR VISUAL THUMBNAIL */}
                <CarVisualThumbnail
                  segment={model.targetSegment}
                  designYear={model.designYear ?? 1900}
                  className="h-20"
                  badge={`${stock} ${lang === 'en' ? 'cars' : lang === 'de' ? 'Fz.' : 'шт.'}`}
                />

                {/* TITLE & BADGE */}
                <div className="flex items-center justify-between gap-1">
                  <span className="font-bold text-xs text-[var(--ink-heading)] truncate">{model.name}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-950/60 text-amber-300 font-mono font-bold border border-amber-600/40 shrink-0">
                    {stock} {lang === 'en' ? 'left' : lang === 'de' ? 'übrig' : 'шт.'}
                  </span>
                </div>

                {/* COSTS & CURRENT PRICE */}
                <div className="text-[11px] space-y-0.5 border-t border-[var(--border-subtle)] pt-1.5 font-sans">
                  <div className="flex justify-between text-[var(--ink-secondary)]">
                    <span>{lang === 'en' ? 'Cost:' : lang === 'uk' ? 'Собівартість:' : lang === 'de' ? 'Selbstkosten:' : 'Себестоимость:'}</span>
                    <span className="font-mono text-[var(--ink)]">${model.productionCost.toLocaleString()}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>{lang === 'en' ? 'Price:' : lang === 'uk' ? 'Ціна:' : lang === 'de' ? 'Verkaufspreis:' : 'Отпускная цена:'}</span>
                    {isEditing ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          value={editingPriceVal}
                          onChange={(e) => setEditingPriceVal(Number(e.target.value))}
                          step={50}
                          min={50}
                          className="w-16 rounded era-input px-1 py-0.5 text-xs font-mono font-bold text-[var(--ink)] shadow-inner text-right"
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveCustomPrice(model)}
                          disabled={isBusy}
                          className="px-1.5 py-0.5 rounded bg-emerald-700 hover:bg-emerald-600 text-white text-[10px] font-bold cursor-pointer"
                        >
                          ✓
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingPriceId(null)}
                          className="px-1 py-0.5 rounded bg-stone-700 text-white text-[10px] cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <strong className="font-mono text-[var(--ink-value)]">${model.salePrice.toLocaleString()}</strong>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingPriceId(model.id);
                            setEditingPriceVal(model.salePrice);
                          }}
                          className="text-[10px] px-1 py-0.5 rounded border border-[var(--border-subtle)] bg-[var(--paper)] text-[var(--ink-secondary)] hover:text-[var(--ink)] cursor-pointer"
                          title={lang === 'en' ? 'Edit price manually' : lang === 'uk' ? 'Змінити ціну вручну' : lang === 'de' ? 'Preis manuell ändern' : 'Изменить цену вручную'}
                        >
                          ✏️
                        </button>
                      </div>
                    )}
                  </div>

                  {/* PROFIT PER CAR */}
                  <div className="flex justify-between">
                    <span>{lang === 'en' ? 'Margin:' : lang === 'uk' ? 'Маржа:' : lang === 'de' ? 'Marge:' : 'Прибыль с авто:'}</span>
                    <strong className={`font-mono ${unitProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {unitProfit >= 0 ? `+$${unitProfit.toLocaleString()}` : `-$${Math.abs(unitProfit).toLocaleString()}`}
                    </strong>
                  </div>
                </div>

                {/* MARKET RADAR BADGE */}
                <div className={`text-[10px] px-1.5 py-0.5 rounded flex items-center justify-between ${priceEval.badgeClass}`}>
                  <span>{priceEval.shortLabel}</span>
                  <span className="opacity-75 font-mono text-[9px]">(💡 {lang === 'en' ? 'Rec:' : lang === 'uk' ? 'Рек.:' : lang === 'de' ? 'Empf.:' : 'Рек.:'} ${recPrice.toLocaleString()})</span>
                </div>

                {/* CLEARANCE DISCOUNT BUTTONS */}
                <div className="pt-1.5 border-t border-[var(--border-subtle)] space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--ink-secondary)] block">
                    {lang === 'en' ? 'Clearance sale:' : lang === 'uk' ? 'Знижки для розпродажу:' : lang === 'de' ? 'Abverkauf:' : 'Распродажа склада:'}
                  </span>
                  <div className="grid grid-cols-4 gap-1">
                    <button
                      type="button"
                      onClick={() => handleApplyDiscount(model, 15)}
                      disabled={isBusy}
                      className="py-1 px-1 rounded bg-[var(--paper)] hover:bg-[var(--surface-nested)] border border-[var(--border-subtle)] text-[10px] font-bold text-[var(--ink)] cursor-pointer shadow-2xs transition"
                      title={lang === 'en' ? 'Apply 15% discount' : lang === 'uk' ? 'Знижка 15%' : lang === 'de' ? '15% Rabatt anwenden' : 'Скидка 15%'}
                    >
                      -15%
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyDiscount(model, 30)}
                      disabled={isBusy}
                      className="py-1 px-1 rounded bg-[var(--paper)] hover:bg-[var(--surface-nested)] border border-[var(--border-subtle)] text-[10px] font-bold text-amber-300 border-amber-600/40 cursor-pointer shadow-2xs transition"
                      title={lang === 'en' ? 'Apply 30% clearance discount' : lang === 'uk' ? 'Знижка 30% (швидкий розпродаж)' : lang === 'de' ? '30% Abverkaufsrabatt' : 'Скидка 30% (быстрая распродажа)'}
                    >
                      -30%
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyCostPrice(model)}
                      disabled={isBusy}
                      className="py-1 px-1 rounded bg-[var(--paper)] hover:bg-[var(--surface-nested)] border border-[var(--border-subtle)] text-[10px] font-bold text-stone-400 cursor-pointer shadow-2xs transition"
                      title={lang === 'en' ? 'Sell at break-even (cost price)' : lang === 'uk' ? 'Продати в нуль за собівартістю' : lang === 'de' ? 'Zu Selbstkosten verkaufen' : 'Продать в ноль по себестоимости'}
                    >
                      {lang === 'en' ? 'Cost' : lang === 'uk' ? 'В нуль' : lang === 'de' ? 'Selbstk.' : 'В ноль'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyRecPrice(model)}
                      disabled={isBusy}
                      className="py-1 px-1 rounded bg-[var(--paper)] hover:bg-[var(--surface-nested)] border border-[var(--border-subtle)] text-[10px] font-bold text-[var(--accent-gold)] cursor-pointer shadow-2xs transition"
                      title={lang === 'en' ? 'Reset to recommended price' : lang === 'uk' ? 'Повернути рекомендовану ціну' : lang === 'de' ? 'Empfohlenen Preis wiederherstellen' : 'Вернуть рекомендованную цену'}
                    >
                      {lang === 'en' ? 'Rec' : lang === 'uk' ? 'Рек.' : lang === 'de' ? 'Empf.' : 'Рек.'}
                    </button>
                  </div>

                  {/* SCRAP OLD INVENTORY BUTTON */}
                  <button
                    type="button"
                    onClick={() => handleScrap(model)}
                    disabled={isBusy}
                    className="w-full mt-1.5 py-1 px-2 rounded bg-stone-800 hover:bg-rose-950/30 text-stone-400 hover:text-rose-300 border border-stone-700 hover:border-rose-700/50 text-[10px] font-bold flex items-center justify-center gap-1 cursor-pointer transition"
                    title={lang === 'en' ? 'Scrap all unsold units for metal cash' : lang === 'uk' ? 'Здати всі непродані авто на металобрухт' : lang === 'de' ? 'Alle unverkauften Fahrzeuge als Altmetall verwerten' : 'Сдать все непроданные авто на металлолом'}
                  >
                    <span>♻️</span>
                    <span>
                      {lang === 'en'
                        ? `Scrap for +$${(stock * scrapValue).toLocaleString()}`
                        : lang === 'uk'
                        ? `На брухт (+$${(stock * scrapValue).toLocaleString()})`
                        : lang === 'de'
                        ? `Verschrotten (+$${(stock * scrapValue).toLocaleString()})`
                        : `В металлолом (+$${(stock * scrapValue).toLocaleString()})`}
                    </span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
