'use client';

import React from 'react';
import type { MonthlyReport } from '@ait/shared-types';
import { useGame } from '../context/GameContext';
import { useLanguage } from '../lib/i18n';
import { getEraTheme } from '../lib/eraTheme';

interface Props {
  isOpen?: boolean;
  onClose?: () => void;
  report?: MonthlyReport | null;
  companyName?: string;
}

export function MorningGazetteModal(props: Props = {}): React.JSX.Element | null {
  const { isGazetteModalOpen, setGazetteModalOpen, gameState } = useGame();
  const { lang, t } = useLanguage();

  const isOpen = props.isOpen ?? isGazetteModalOpen;
  const onClose = props.onClose ?? (() => setGazetteModalOpen(false));
  const report = props.report ?? gameState?.reportHistory[0] ?? null;
  const companyName = props.companyName ?? gameState?.company.name ?? 'Pioneer Motor Works';

  if (!isOpen || !report) return null;

  const year = report.date.year;
  const eraTheme = getEraTheme(year);
  const isProfit = report.profit >= 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-3 backdrop-blur-xs">
      <div className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-lg border-2 border-stone-800 bg-[#f7f2e7] p-6 shadow-2xl text-stone-900 font-serif">
        {/* Newspaper Masthead */}
        <div className="border-b-4 border-double border-stone-900 pb-3 text-center">
          <div className="flex justify-between items-center text-[10px] uppercase tracking-widest text-stone-600 border-b border-stone-400 pb-1 mb-2">
            <span>{lang === 'en' ? 'Published since 1900' : lang === 'uk' ? 'Видається з 1900 р.' : lang === 'de' ? 'Herausgegeben seit 1900' : 'Издается с 1900 г.'}</span>
            <span>{year} {lang === 'en' ? 'Annual Edition' : lang === 'uk' ? 'року • Щорічний випуск' : lang === 'de' ? '• Jahresausgabe' : 'года • Ежегодный выпуск'}</span>
            <span>{lang === 'en' ? 'Price: 2 cents' : lang === 'uk' ? 'Ціна: 2 центи' : lang === 'de' ? 'Preis: 2 Cents' : 'Цена: 2 цента'}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-stone-950 font-serif">
            {lang === 'en' ? 'The Industrial Gazette' : lang === 'uk' ? 'Промисловий Вісник' : lang === 'de' ? 'Industrie-Zeitung' : 'Промышленный Вестник'}
          </h1>
          <p className="text-[11px] italic text-stone-700 mt-0.5">
            {lang === 'en' ? 'Annual review of world automobile industry, commodity exchange and engineering' : lang === 'uk' ? 'Щорічний огляд світового автомобілебудування, біржі та техніки' : lang === 'de' ? 'Jahresrückblick auf die weltweite Automobilindustrie, Rohstoffbörse und Technik' : 'Ежегодное обозрение мирового автомобилестроения, биржи и техники'}
          </p>
        </div>

        {/* Lead Headline */}
        <div className="my-4 border-b-2 border-stone-300 pb-3">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-900 uppercase tracking-wide">
            <span>
              {lang === 'en'
                ? '⚡ Breaking Industry News:'
                : lang === 'uk'
                ? '⚡ Головна новина номера:'
                : lang === 'de'
                ? '⚡ Eilmeldung:'
                : '⚡ Главная новость номера:'}
            </span>
            <span>{companyName}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-950 leading-tight mt-1">
            {isProfit
              ? lang === 'en'
                ? `ASSEMBLY LINES TRIUMPH: ANNUAL PROFIT REACHES +$${report.profit.toLocaleString()}!`
                : lang === 'uk'
                ? `ТРІУМФ НА СКЛАДАЛЬНИХ ЛІНІЯХ: РІЧНИЙ ПРИБУТОК СКЛАВ +$${report.profit.toLocaleString()}!`
                : lang === 'de'
                ? `ERFOLG AN DEN MONTAGELINIEN: JAHRESGEWINN ERREICHT +$${report.profit.toLocaleString()}!`
                : `УСПЕХ НА СБОРОЧНЫХ ЛИНИЯХ: ГОДОВАЯ ПРИБЫЛЬ СОСТАВИЛА +$${report.profit.toLocaleString()}!`
              : lang === 'en'
              ? `CHALLENGING YEAR FOR MANUFACTURE: ANNUAL DEFICIT -$${Math.abs(report.profit).toLocaleString()}`
              : lang === 'uk'
              ? `СКЛАДНИЙ РІК ДЛЯ МАНУФАКТУРИ: РІЧНИЙ ЗБИТОК -$${Math.abs(report.profit).toLocaleString()}`
              : lang === 'de'
              ? `SCHWIERIGES JAHR FÜR DIE MANUFAKTUR: JAHRESFEHLBETRAG -$${Math.abs(report.profit).toLocaleString()}`
              : `СЛОЖНЫЙ ГОД ДЛЯ МАНУФАКТУРЫ: ГОДОВОЙ УБЫТОК -$${Math.abs(report.profit).toLocaleString()}`}
          </h2>
          <p className="text-xs text-stone-700 mt-2 leading-relaxed">
            {lang === 'en'
              ? `According to official plant ledgers, the company concluded the year ${year} with the following figures: produced ${report.unitsProduced} motor carriages, delivered ${report.unitsSold} units to consumer markets. Total revenue reached $${report.revenue.toLocaleString()} with total operational expenses of $${report.expenses.toLocaleString()}.`
              : lang === 'uk'
              ? `За офіційними даними контори, заводи компанії завершили ${year} рік з наступними результатами: випущено ${report.unitsProduced} самохідних екіпажів, реалізовано на ринках ${report.unitsSold} одиниць. Сукупна виручка сягнула $${report.revenue.toLocaleString()} при витратах $${report.expenses.toLocaleString()}.`
              : lang === 'de'
              ? `Laut offiziellen Büchern schloss das Unternehmen das Jahr ${year} mit folgenden Ergebnissen ab: ${report.unitsProduced} Motorfahrzeuge hergestellt, ${report.unitsSold} Einheiten auf den Märkten abgesetzt. Der Gesamtumsatz belief sich auf $${report.revenue.toLocaleString()} bei Gesamtausgaben von $${report.expenses.toLocaleString()}.`
              : `По официальным данным конторы заводы компании завершили ${year} год со следующими результатами: выпущено ${report.unitsProduced} самоходных экипажей, реализовано на рынках ${report.unitsSold} единиц. Совокупная выручка достигла $${report.revenue.toLocaleString()} при расходах $${report.expenses.toLocaleString()}.`}
          </p>
        </div>

        {/* Financial Audit Ledger Strip */}
        <div className="my-3 rounded-lg border border-amber-900/20 bg-amber-50/70 p-3 text-xs">
          <div className="font-serif font-bold text-amber-950 flex flex-wrap items-center justify-between border-b border-amber-900/15 pb-1.5 mb-2 gap-2">
            <span className="flex items-center gap-1.5">
              <span>⚖️</span>
              <span>
                {lang === 'en'
                  ? `Annual Financial Audit for ${year}`
                  : lang === 'uk'
                  ? `Бухгалтерський звіт за ${year} рік`
                  : lang === 'de'
                  ? `Jahres-Auditbericht für ${year}`
                  : `Бухгалтерский отчет за ${year} г.`}
              </span>
            </span>
            <span
              className={`font-mono font-bold px-2 py-0.5 rounded text-xs ${
                isProfit
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  : 'bg-rose-100 text-rose-900 border border-rose-300'
              }`}
            >
              {isProfit
                ? (lang === 'en' ? 'RESULT: NET PROFIT +' : lang === 'uk' ? 'ПІДСУМОК: ЧИСТИЙ ПРИБУТОК +' : lang === 'de' ? 'ERGEBNIS: JAHRESÜBERSCHUSS +' : 'ИТОГ: ЧИСТАЯ ПРИБЫЛЬ +')
                : (lang === 'en' ? 'RESULT: NET DEFICIT -' : lang === 'uk' ? 'ПІДСУМОК: ЧИСТИЙ ЗБИТОК -' : lang === 'de' ? 'ERGEBNIS: JAHRESFEHLBETRAG -' : 'ИТОГ: ЧИСТЫЙ УБЫТОК -')}
              ${Math.abs(report.profit).toLocaleString()}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px]">
            <div className="bg-white/80 p-2 rounded border border-amber-900/10 shadow-2xs">
              <span className="text-stone-500 block">
                {lang === 'en' ? `Revenue (${report.unitsSold} cars):` : lang === 'uk' ? `Виручка (${report.unitsSold} авто):` : lang === 'de' ? `Umsatz (${report.unitsSold} Fz.):` : `Выручка (${report.unitsSold} авто):`}
              </span>
              <strong className="text-emerald-800 font-mono text-xs">+${report.revenue.toLocaleString()}</strong>
            </div>
            <div className="bg-white/80 p-2 rounded border border-amber-900/10 shadow-2xs">
              <span className="text-stone-500 block">
                {lang === 'en' ? 'Assembly Cost:' : lang === 'uk' ? 'Собівартість складання:' : lang === 'de' ? 'Montage-Kosten:' : 'Себестоимость сборки:'}
              </span>
              <strong className="text-rose-850 font-mono text-xs">-${(report.productionCost ?? 0).toLocaleString()}</strong>
            </div>
            <div className="bg-white/80 p-2 rounded border border-amber-900/10 shadow-2xs">
              <span className="text-stone-500 block">
                {lang === 'en' ? 'Plant Overhead:' : lang === 'uk' ? 'Утримання цехів:' : lang === 'de' ? 'Werksunterhalt:' : 'Содержание цеха:'}
              </span>
              <strong className="text-stone-800 font-mono text-xs">-${(report.overheadCost ?? 0).toLocaleString()}</strong>
            </div>
            <div className="bg-white/80 p-2 rounded border border-amber-900/10 shadow-2xs">
              <span className="text-stone-500 block">
                {lang === 'en' ? 'Premises Rent:' : lang === 'uk' ? 'Оренда площ:' : lang === 'de' ? 'Flächenmiete:' : 'Аренда площадей:'}
              </span>
              <strong className="text-amber-950 font-mono text-xs">-${(report.rentCost ?? 100).toLocaleString()}</strong>
            </div>
            <div className="bg-white/80 p-2 rounded border border-amber-900/10 shadow-2xs">
              <span className="text-stone-500 block">
                {lang === 'en' ? 'R&D Laboratory:' : lang === 'uk' ? 'НДДКР (Лабораторія):' : lang === 'de' ? 'F&E-Labor:' : 'НИОКР (Лаборатория):'}
              </span>
              <strong className="text-stone-800 font-mono text-xs">-${(report.researchCost ?? 0).toLocaleString()}</strong>
            </div>
          </div>

          {!isProfit && (
            <div className="mt-2 text-[11px] bg-amber-100/70 p-2 rounded text-amber-950 flex items-start gap-2 border border-amber-300/80">
              <span className="text-sm">💡</span>
              <div>
                <strong>
                  {lang === 'en' ? 'Treasurer Advisory:' : lang === 'uk' ? 'Порада скарбника:' : lang === 'de' ? 'Rat des Schatzmeisters:' : 'Совет казначея:'}
                </strong>{' '}
                {(report.productionCost ?? 0) >= report.revenue ? (
                  <span>
                    {lang === 'en'
                      ? 'Your vehicle sale price is too close to parts cost. Open the Vehicle Design view and raise the price (recommended margin: 35–50% above cost).'
                      : lang === 'uk'
                      ? 'Ціна продажу ваших авто близька до собівартості деталей або нижча за неї. Відкрийте Конструктор і збільшіть ціну продажу (здорова націнка: 35–50%).'
                      : lang === 'de'
                      ? 'Ihr Verkaufspreis liegt zu nahe an den Bauteilkosten. Öffnen Sie die Fahrzeugentwicklung und erhöhen Sie den Preis (gesunde Marge: 35–50%).'
                      : 'Цена продажи ваших авто близка к себестоимости деталей или ниже нее. Зайдите в Конструктор и увеличьте отпускную цену (здоровая наценка — 35–50% сверху себестоимости).'}
                  </span>
                ) : (report.rentCost ?? 0) > report.revenue * 0.4 ? (
                  <span>
                    {lang === 'en'
                      ? `Premises rent (-$${(report.rentCost ?? 0).toLocaleString()}) consumes a large share of revenue! Expand factory capacity on the Factory tab to produce more cars and cover rent.`
                      : lang === 'uk'
                      ? `Оренда виробничих площ (-$${(report.rentCost ?? 0).toLocaleString()}) забирає левову частку виручки! Розширюйте потужності у вкладці «Завод», щоб випускати більше авто.`
                      : lang === 'de'
                      ? `Flächenmiete (-$${(report.rentCost ?? 0).toLocaleString()}) zehrt den Großteil des Umsatzes auf! Erweitern Sie die Kapazität im Tab „Fabrik“.`
                      : `Аренда производственных площадей (-$${(report.rentCost ?? 0).toLocaleString()}) отнимает львиную долю выручки! Срочно расширяйте мощности на вкладке Завод, чтобы выпускать больше авто.`}
                  </span>
                ) : (report.researchCost ?? 0) > report.revenue * 0.4 ? (
                  <span>
                    {lang === 'en'
                      ? `R&D expenditure ($${report.researchCost ?? 0}) is high for your current scale. Balance your laboratory budget.`
                      : lang === 'uk'
                      ? `Витрати на НДДКР ($${report.researchCost ?? 0}) завеликі для поточного масштабу. Оптимізуйте бюджет досліджень.`
                      : lang === 'de'
                      ? `F&E-Ausgaben ($${report.researchCost ?? 0}) sind zu hoch für Ihren derzeitigen Umsatz. Passen Sie das Laborbudget an.`
                      : `Лаборатория забирает значительную долю оборота ($${report.researchCost ?? 0}). На старте выбирайте экономный бюджет исследований.`}
                  </span>
                ) : (
                  <span>
                    {lang === 'en'
                      ? 'The market demands more cars. Increase your annual production plan on the Factory tab or design a fresh model in the Design Studio.'
                      : lang === 'uk'
                      ? 'Ринок потребує більше машин. Збільшіть річний план випуску на вкладці «Завод» або спроєктуйте нову модель у Конструкторі.'
                      : lang === 'de'
                      ? 'Der Markt verlangt mehr Fahrzeuge. Erhöhen Sie den Jahresproduktionsplan oder entwerfen Sie ein neues Modell.'
                      : 'Рынку требуется больше машин. Увеличьте план выпуска на вкладке Завод до предела мастерской или спроектируйте новую актуальную модель в Конструкторе.'}
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
              {lang === 'en' ? '📍 Sales Geography' : lang === 'uk' ? '📍 Географія збуту' : lang === 'de' ? '📍 Absatzgebiete' : '📍 География сбыта'}
            </h3>
            {report.salesByRegion && Object.keys(report.salesByRegion).length > 0 ? (
              <div className="space-y-1.5 text-[11px]">
                {Object.entries(report.salesByRegion).map(([reg, count]) => (
                  <div key={reg} className="flex justify-between border-b border-stone-200 pb-0.5">
                    <span>{t.regions[reg as keyof typeof t.regions] ?? reg}:</span>
                    <strong className="text-stone-900">
                      {count} {lang === 'en' ? 'cars' : lang === 'uk' ? 'авто' : lang === 'de' ? 'Fz.' : 'шт.'}
                    </strong>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-stone-500 italic">
                {lang === 'en'
                  ? 'No vehicle sales recorded in this annual period.'
                  : lang === 'uk'
                  ? 'Продажів у звітному році не зафіксовано.'
                  : lang === 'de'
                  ? 'Keine Fahrzeugverkäufe im Berichtsjahr erfasst.'
                  : 'Продаж в отчетном году не зафиксировано.'}
              </p>
            )}

            {/* Model Sales & Warehouse Inventory */}
            {report.salesByModel && Object.keys(report.salesByModel).length > 0 && (
              <div className="space-y-1.5 pt-2 border-t border-stone-300">
                <h4 className="font-bold text-[11px] uppercase tracking-wider text-stone-900 flex items-center justify-between">
                  <span>{lang === 'en' ? '📦 Models & Inventory' : lang === 'uk' ? '📦 Моделі та склад' : lang === 'de' ? '📦 Modelle & Lager' : '📦 Модели и склад'}</span>
                </h4>
                <div className="space-y-1 text-[11px]">
                  {Object.values(report.salesByModel).map((sm) => (
                    <div key={sm.modelId} className="bg-white/80 p-1.5 rounded border border-stone-200">
                      <div className="flex justify-between font-semibold text-stone-900">
                        <span>{sm.modelName}</span>
                        <span className="font-mono text-emerald-800">${sm.revenue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-stone-600 text-[10px] mt-0.5">
                        <span>
                          {lang === 'en' ? 'Sold' : lang === 'uk' ? 'Продано' : 'Продано'}: <strong className="text-emerald-700">{sm.sold}</strong> / {sm.produced}
                        </span>
                        <span>
                          {lang === 'en' ? 'Stock' : lang === 'uk' ? 'Склад' : 'Склад'}:{' '}
                          <strong className={sm.unsold > 0 ? 'text-amber-800 font-bold' : 'text-stone-500'}>
                            {sm.unsold} {lang === 'en' ? 'unsold' : lang === 'uk' ? 'залишок' : 'не продано'}
                          </strong>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {report.shortageOccurred && (
              <div className="bg-rose-100 border border-rose-300 p-2 rounded text-[11px] text-rose-900 mt-2">
                <strong>
                  {lang === 'en' ? '⚠️ Material Shortage:' : lang === 'uk' ? '⚠️ Дефіцит сировини:' : lang === 'de' ? '⚠️ Rohstoffmangel:' : '⚠️ Дефицит сырья:'}
                </strong>{' '}
                {lang === 'en'
                  ? 'Lack of warehouse stock caused partial factory downtime.'
                  : lang === 'uk'
                  ? 'Брак сировини на складі призвів до часткового простою цехів.'
                  : lang === 'de'
                  ? 'Mangel an Lagerbeständen führte zu teilweisem Stillstand.'
                  : 'Нехватка материалов на складе привела к частичному простою цехов.'}
              </div>
            )}
          </div>

          {/* Column 2: Competitor News */}
          <div className="space-y-2 border-r border-stone-300 pr-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-stone-900 border-b border-stone-300 pb-1">
              {lang === 'en' ? '🏭 Competitor Intelligence' : lang === 'uk' ? '🏭 Зведення конкурентів' : lang === 'de' ? '🏭 Konkurrenzberichte' : '🏭 Сводки конкурентов'}
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
                {lang === 'en'
                  ? 'Major competitors Fort and Mercer-Benz are modernizing their facilities without major announcements.'
                  : lang === 'uk'
                  ? 'Концерни Fort та Mercer-Benz ведуть планову модернізацію без гучних заяв цього року.'
                  : lang === 'de'
                  ? 'Die Konzerne Fort und Mercer-Benz modernisieren planmäßig ohne größere Ankündigungen.'
                  : 'Концерны Fort и Mercer-Benz ведут плановую модернизацию без громких объявлений в этом году.'}
              </p>
            )}
          </div>

          {/* Column 3: Financial Notes & Telegraph */}
          <div className="space-y-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-stone-900 border-b border-stone-300 pb-1">
              {lang === 'en' ? '📜 Dispatches & Treasury' : lang === 'uk' ? '📜 Депеші та Скарбниця' : lang === 'de' ? '📜 Depeschen & Finanzen' : '📜 Депеши и Казначейство'}
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
              <p className="text-[11px] text-stone-600">
                {lang === 'en'
                  ? 'The year concluded in orderly operations without emergency disruptions.'
                  : lang === 'uk'
                  ? 'Рік завершився в штатному режимі без надзвичайних фінансових пригод.'
                  : lang === 'de'
                  ? 'Das Jahr verlief planmäßig ohne finanzielle Notstände.'
                  : 'Год прошел в штатном режиме без чрезвычайных происшествий.'}
              </p>
            )}

            {report.loanPayments && report.loanPayments > 0 ? (
              <div className="text-[11px] text-stone-600 border-t border-stone-200 pt-1">
                {lang === 'en' ? 'Bank loan amortization:' : lang === 'uk' ? 'Виплати за банківськими позиками:' : lang === 'de' ? 'Kredittilgungen:' : 'Выплаты по банковским займам:'}{' '}
                <strong className="text-stone-900">${report.loanPayments.toLocaleString()}</strong>
              </div>
            ) : null}
          </div>
        </div>

        {/* Footer actions with vintage seal */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{eraTheme.icon}</span>
            <div className="text-[10px] text-stone-600 font-sans">
              <div className="font-bold font-serif text-xs text-stone-900">
                {lang === 'en' ? eraTheme.nameEn : lang === 'uk' ? eraTheme.nameUk : lang === 'de' ? eraTheme.nameDe : eraTheme.nameRu}
              </div>
              <div>({eraTheme.yearStart}–{eraTheme.yearEnd})</div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded bg-stone-900 px-6 py-2 text-xs font-bold text-stone-100 hover:bg-black font-sans uppercase tracking-wider shadow transition cursor-pointer"
          >
            {lang === 'en'
              ? 'Acknowledge and Continue →'
              : lang === 'uk'
              ? 'Взяти до відома та продовжити →'
              : lang === 'de'
              ? 'Zur Kenntnis nehmen und fortfahren →'
              : 'Принять к сведению и продолжить →'}
          </button>
        </div>
      </div>
    </div>
  );
}
