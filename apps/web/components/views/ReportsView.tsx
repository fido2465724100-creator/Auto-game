'use client';

import { useGame } from '../../context/GameContext';
import { useLanguage } from '../../lib/i18n';

export default function ReportsPage(): React.JSX.Element {
  const { gameState, loading } = useGame();
  const { t } = useLanguage();

  if (loading) return <p className="py-8 text-center text-stone-600">Загрузка архива отчетов...</p>;

  const reports = gameState?.reportHistory ?? [];

  return (
    <div className="space-y-6">
      <header className="border-b border-stone-300 pb-3">
        <h2 className="text-2xl font-bold tracking-tight text-amber-950">{t.reports.title}</h2>
        <p className="text-sm text-stone-600">{t.reports.subtitle}</p>
      </header>

      {reports.length === 0 ? (
        <div className="rounded border border-stone-300 bg-[var(--paper)] p-8 text-center text-stone-600 text-sm">
          {t.reports.noReports}
        </div>
      ) : null}

      <div className="space-y-4">
        {reports.map((report) => {
          const qIndex = report.date.quarter
            ? report.date.quarter - 1
            : report.date.month
            ? Math.floor((report.date.month - 1) / 3)
            : 0;
          const quarterName = t.topbar.quarters[qIndex] ?? `Q${report.date.quarter ?? 1}`;

          return (
            <article
              key={report.id}
              className="rounded border border-stone-300 bg-[var(--paper)] p-5 shadow-sm space-y-3"
            >
              <div className="flex justify-between items-center border-b border-stone-200 pb-2">
                <h3 className="font-bold text-amber-950 text-base">
                  {quarterName} {report.date.year} г.
                </h3>
                <span
                  className={`font-bold text-sm px-2 py-0.5 rounded ${
                    report.profit >= 0
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {report.profit >= 0 ? '+' : ''}${report.profit.toLocaleString()}
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-4 text-xs">
                <div>
                  <span className="text-stone-500 block">{t.reports.revenue}:</span>
                  <span className="font-bold text-stone-900">${report.revenue.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-stone-500 block">{t.reports.expenses}:</span>
                  <span className="font-semibold text-stone-800">${report.expenses.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-stone-500 block">{t.reports.produced}:</span>
                  <span className="font-semibold text-stone-800">{report.unitsProduced} {t.markets.units}</span>
                </div>
                <div>
                  <span className="text-stone-500 block">{t.reports.sold}:</span>
                  <span className="font-bold text-amber-950">{report.unitsSold} {t.markets.units}</span>
                </div>
              </div>

              {/* Detailed Cost Breakdown */}
              <div className="rounded bg-amber-50/60 p-2.5 border border-amber-200/80 text-[11px] space-y-1">
                <div className="font-bold text-amber-950 flex justify-between border-b border-amber-200/60 pb-1">
                  <span>Статьи расходов и выручка:</span>
                  <span className={report.profit >= 0 ? 'text-emerald-700 font-mono font-bold' : 'text-rose-700 font-mono font-bold'}>
                    {report.profit >= 0 ? '+' : ''}${report.profit.toLocaleString()}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1 text-stone-700">
                  <div>• Выручка: <strong className="text-emerald-750 font-mono font-bold">+${report.revenue.toLocaleString()}</strong></div>
                  <div>• Сборка (детали): <strong className="text-rose-750 font-mono font-bold">-${(report.productionCost ?? 0).toLocaleString()}</strong></div>
                  <div>• Содержание цеха: <strong className="text-stone-800 font-mono font-bold">-${(report.overheadCost ?? 0).toLocaleString()}</strong></div>
                  <div>• Аренда площадей: <strong className="text-amber-950 font-mono font-bold">-${(report.rentCost ?? 100).toLocaleString()}</strong></div>
                  <div>• Лаборатория: <strong className="text-stone-800 font-mono font-bold">-${(report.researchCost ?? 0).toLocaleString()}</strong></div>
                </div>
              </div>

              {/* Event Notes & Bank Overdraft alerts */}
              {report.eventNotes && report.eventNotes.length > 0 ? (
                <div className="text-[12px] bg-amber-50 border border-amber-200 rounded p-2.5 text-amber-900 space-y-1">
                  {report.eventNotes.map((note, i) => (
                    <div key={i} className="flex items-start gap-1.5">
                      <span className="font-bold text-amber-700">📜</span>
                      <span>{note}</span>
                    </div>
                  ))}
                </div>
              ) : null}

              {/* Competitor News */}
              {report.competitorNews && report.competitorNews.length > 0 ? (
                <div className="text-[12px] bg-stone-100 border border-stone-200 rounded p-2.5 text-stone-800 space-y-1">
                  <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wide">
                    {t.reports.competitorNews}
                  </div>
                  {report.competitorNews.map((news, i) => (
                    <div key={i} className="flex items-start gap-1.5">
                      <span className="text-amber-800 font-bold">🏭</span>
                      <span>{news}</span>
                    </div>
                  ))}
                </div>
              ) : null}

              {/* Extra info: Loans paid */}
              {report.loanPayments && report.loanPayments > 0 ? (
                <div className="text-[11px] text-stone-500 border-t border-stone-100 pt-2">
                  <span>{t.reports.loansPaid}: </span>
                  <strong className="text-stone-700">${report.loanPayments.toLocaleString()}</strong>
                </div>
              ) : null}

              {/* Sales by Region */}
              {report.salesByRegion ? (
                <div className="text-[11px] text-stone-500 border-t border-stone-100 pt-2 flex flex-wrap gap-4">
                  <span>{t.reports.salesByRegion}</span>
                  {Object.entries(report.salesByRegion).map(([reg, units]) => (
                    <span key={reg}>
                      {t.regions[reg as keyof typeof t.regions] ?? reg.replace('-', ' ')}: <strong className="text-stone-800">{units} {t.production.unitsShort}</strong>
                    </span>
                  ))}
                </div>
              ) : null}
            </article>
          );
        })}
      </div>
    </div>
  );
}
