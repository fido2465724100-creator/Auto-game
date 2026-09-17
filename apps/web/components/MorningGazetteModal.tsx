'use client';

import React from 'react';
import type { MonthlyReport } from '@ait/shared-types';
import { useLanguage } from '../lib/i18n';
import { getEraTheme } from '../lib/eraTheme';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  report: MonthlyReport | null;
  companyName: string;
}

export function MorningGazetteModal({ isOpen, onClose, report, companyName }: Props): React.JSX.Element | null {
  const { t } = useLanguage();

  if (!isOpen || !report) return null;

  const year = report.date.year;
  const quarter = report.date.quarter ?? 1;
  const eraTheme = getEraTheme(year);

  const qName = t.topbar.quarters[quarter - 1] ?? `Q${quarter}`;
  const isProfit = report.profit >= 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-3 backdrop-blur-xs">
      <div className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-lg border-2 border-stone-800 bg-[#f7f2e7] p-6 shadow-2xl text-stone-900 font-serif">
        {/* Newspaper Masthead */}
        <div className="border-b-4 border-double border-stone-900 pb-3 text-center">
          <div className="flex justify-between items-center text-[10px] uppercase tracking-widest text-stone-600 border-b border-stone-400 pb-1 mb-2">
            <span>Издается с 1900 г.</span>
            <span>{qName} {year} года • Экстренный выпуск</span>
            <span>Цена: 2 цента</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-stone-950 font-serif">
            Промышленный Вестник
          </h1>
          <p className="text-[11px] italic text-stone-700 mt-0.5">
            Ежеквартальное обозрение мирового автомобилестроения, биржи и техники
          </p>
        </div>

        {/* Lead Headline */}
        <div className="my-4 border-b-2 border-stone-300 pb-3">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-900 uppercase tracking-wide">
            <span>⚡ Главная новость номера:</span>
            <span>{companyName}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-950 leading-tight mt-1">
            {isProfit
              ? `УСПЕХ НА СБОРОЧНЫХ ЛИНИЯХ: ПРИБЫЛЬ СОСТАВИЛА +$${report.profit.toLocaleString()}!`
              : `СЛОЖНЫЙ ПЕРИОД ДЛЯ МАНУФАКТУРЫ: КВАРТАЛЬНЫЙ УБЫТОК -$${Math.abs(report.profit).toLocaleString()}`}
          </h2>
          <p className="text-xs text-stone-700 mt-2 leading-relaxed">
            По официальным данным конторы заводы компании завершили {qName} {year} года со следующими результатами: выпущено{' '}
            <strong>{report.unitsProduced}</strong> самоходных экипажей, реализовано на рынках{' '}
            <strong>{report.unitsSold}</strong> единиц. Совокупная выручка достигла{' '}
            <strong>${report.revenue.toLocaleString()}</strong> при расходах{' '}
            <strong>${report.expenses.toLocaleString()}</strong>.
          </p>
        </div>

        {/* Financial Audit Ledger Strip */}
        <div className="my-3 rounded-lg border border-amber-900/20 bg-amber-50/70 p-3 text-xs">
          <div className="font-serif font-bold text-amber-950 flex flex-wrap items-center justify-between border-b border-amber-900/15 pb-1.5 mb-2 gap-2">
            <span className="flex items-center gap-1.5">
              <span>⚖️</span>
              <span>Бухгалтерский отчет за {qName} {year} г.</span>
            </span>
            <span
              className={`font-mono font-bold px-2 py-0.5 rounded text-xs ${
                isProfit
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  : 'bg-rose-100 text-rose-900 border border-rose-300'
              }`}
            >
              {isProfit ? 'ИТОГ: ЧИСТАЯ ПРИБЫЛЬ +' : 'ИТОГ: ЧИСТЫЙ УБЫТОК -'}${Math.abs(report.profit).toLocaleString()}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px]">
            <div className="bg-white/80 p-2 rounded border border-amber-900/10 shadow-2xs">
              <span className="text-stone-500 block">Выручка ({report.unitsSold} авто):</span>
              <strong className="text-emerald-800 font-mono text-xs">+${report.revenue.toLocaleString()}</strong>
            </div>
            <div className="bg-white/80 p-2 rounded border border-amber-900/10 shadow-2xs">
              <span className="text-stone-500 block">Себестоимость сборки:</span>
              <strong className="text-rose-850 font-mono text-xs">-${(report.productionCost ?? 0).toLocaleString()}</strong>
            </div>
            <div className="bg-white/80 p-2 rounded border border-amber-900/10 shadow-2xs">
              <span className="text-stone-500 block">Содержание цеха:</span>
              <strong className="text-stone-800 font-mono text-xs">-${(report.overheadCost ?? 0).toLocaleString()}</strong>
            </div>
            <div className="bg-white/80 p-2 rounded border border-amber-900/10 shadow-2xs">
              <span className="text-stone-500 block">Аренда площадей:</span>
              <strong className="text-amber-950 font-mono text-xs">-${(report.rentCost ?? 100).toLocaleString()}</strong>
            </div>
            <div className="bg-white/80 p-2 rounded border border-amber-900/10 shadow-2xs">
              <span className="text-stone-500 block">НИОКР (Лаборатория):</span>
              <strong className="text-stone-800 font-mono text-xs">-${(report.researchCost ?? 0).toLocaleString()}</strong>
            </div>
          </div>

          {!isProfit && (
            <div className="mt-2 text-[11px] bg-amber-100/70 p-2 rounded text-amber-950 flex items-start gap-2 border border-amber-300/80">
              <span className="text-sm">💡</span>
              <div>
                <strong>Совет казначея:</strong>{' '}
                {(report.productionCost ?? 0) >= report.revenue ? (
                  <span>
                    Цена продажи ваших авто близка к себестоимости деталей или ниже нее. Зайдите в <em>Конструктор</em> и увеличьте отпускную цену (здоровая наценка — 35–50% сверху себестоимости).
                  </span>
                ) : (report.rentCost ?? 0) > report.revenue * 0.4 ? (
                  <span>
                    Аренда производственных площадей (-${(report.rentCost ?? 0).toLocaleString()}) отнимает львиную долю выручки! Срочно расширяйте мощности на вкладке <em>Завод</em>, чтобы выпускать больше авто и окупать аренду.
                  </span>
                ) : (report.researchCost ?? 0) > report.revenue * 0.4 ? (
                  <span>
                    Лаборатория забирает значительную долю оборота (${report.researchCost ?? 0}). На старте выбирайте экономный бюджет исследований.
                  </span>
                ) : (
                  <span>
                    Рынку требуется больше машин. Увеличьте план выпуска на вкладке <em>Завод</em> до предела мастерской или спроектируйте новую актуальную модель в Конструкторе.
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 3 Columns Layout (Newspaper style) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b-2 border-stone-300 pb-4 text-xs">
          {/* Column 1: Sales & Markets */}
          <div className="space-y-2 border-r border-stone-300 pr-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-stone-900 border-b border-stone-300 pb-1">
              📍 География сбыта
            </h3>
            {report.salesByRegion && Object.keys(report.salesByRegion).length > 0 ? (
              <div className="space-y-1.5 text-[11px]">
                {Object.entries(report.salesByRegion).map(([reg, count]) => (
                  <div key={reg} className="flex justify-between border-b border-stone-200 pb-0.5">
                    <span>{t.regions[reg as keyof typeof t.regions] ?? reg}:</span>
                    <strong className="text-stone-900">{count} шт.</strong>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-stone-500 italic">Продаж в отчетном квартале не зафиксировано.</p>
            )}

            {report.shortageOccurred && (
              <div className="bg-rose-100 border border-rose-300 p-2 rounded text-[11px] text-rose-900 mt-2">
                <strong>⚠️ Дефицит сырья:</strong> Нехватка материалов на складе привела к частичному простою цехов.
              </div>
            )}
          </div>

          {/* Column 2: Competitor News */}
          <div className="space-y-2 border-r border-stone-300 pr-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-stone-900 border-b border-stone-300 pb-1">
              🏭 Сводки конкурентов
            </h3>
            {report.competitorNews && report.competitorNews.length > 0 ? (
              <div className="space-y-2 text-[11px] text-stone-800">
                {report.competitorNews.map((news, i) => (
                  <div key={i} className="flex items-start gap-1.5 leading-snug">
                    <span>•</span>
                    <span>{news}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-stone-600 leading-snug italic">
                Концерны Fort и Mercer-Benz ведут плановую модернизацию без громких объявлений в этом квартале.
              </p>
            )}
          </div>

          {/* Column 3: Financial Notes & Telegraph */}
          <div className="space-y-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-stone-900 border-b border-stone-300 pb-1">
              📜 Депеши и Казначейство
            </h3>
            {report.eventNotes && report.eventNotes.length > 0 ? (
              <div className="space-y-1.5 text-[11px]">
                {report.eventNotes.map((note, i) => (
                  <div key={i} className="bg-amber-100/70 border border-amber-300/80 p-1.5 rounded text-amber-950">
                    {note}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-stone-600">Квартал прошел в штатном режиме без чрезвычайных финансовых происшествий.</p>
            )}

            {report.loanPayments && report.loanPayments > 0 ? (
              <div className="text-[11px] text-stone-600 border-t border-stone-200 pt-1">
                Выплаты по банковским займам: <strong className="text-stone-900">${report.loanPayments}</strong>
              </div>
            ) : null}
          </div>
        </div>

        {/* Footer actions with vintage seal */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{eraTheme.icon}</span>
            <div className="text-[10px] text-stone-600 font-sans">
              <div>{eraTheme.nameRu}</div>
              <div>Материалы эпохи: <strong>{eraTheme.materialRu}</strong></div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded bg-stone-900 px-6 py-2 text-xs font-bold text-stone-100 hover:bg-black font-sans uppercase tracking-wider shadow transition"
          >
            Принять к сведению и продолжить →
          </button>
        </div>
      </div>
    </div>
  );
}
