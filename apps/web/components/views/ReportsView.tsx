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
      <header className="border-b border-[var(--border-subtle)] pb-3">
        <h2 className="text-2xl font-bold tracking-tight text-[var(--ink-heading)] era-heading">{t.reports.title}</h2>
        <p className="text-sm text-[var(--ink-secondary)]">{t.reports.subtitle}</p>
      </header>

      {reports.length === 0 ? (
        <div className="era-card p-8 text-center text-[var(--ink-secondary)] text-sm">
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
              className="era-card p-5 shadow-sm space-y-3"
            >
              <div className="flex justify-between items-center border-b border-[var(--border-subtle)] pb-2">
                <h3 className="font-bold text-[var(--ink-heading)] era-heading text-base">
                  {quarterName} {report.date.year} г.
                </h3>
                <span
                  className={`font-bold text-sm px-2.5 py-0.5 rounded font-mono ${
                    report.profit >= 0
                      ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-600/50'
                      : 'bg-rose-950/40 text-rose-300 border border-rose-600/50'
                  }`}
                >
                  {report.profit >= 0 ? '+' : ''}${report.profit.toLocaleString()}
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-4 text-xs font-sans">
                <div>
                  <span className="text-[var(--ink-secondary)] block">{t.reports.revenue}:</span>
                  <span className="font-bold text-emerald-400 font-mono text-sm">+${report.revenue.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-[var(--ink-secondary)] block">{t.reports.expenses}:</span>
                  <span className="font-semibold text-[var(--ink)] font-mono text-sm">${report.expenses.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-[var(--ink-secondary)] block">{t.reports.produced}:</span>
                  <span className="font-semibold text-[var(--ink)]">{report.unitsProduced} {t.markets.units}</span>
                </div>
                <div>
                  <span className="text-[var(--ink-secondary)] block">{t.reports.sold}:</span>
                  <span className="font-bold text-[var(--ink-value)]">{report.unitsSold} {t.markets.units}</span>
                </div>
              </div>

              {/* Detailed Cost Breakdown */}
              <div className="rounded-lg bg-[var(--surface-nested)] p-3 border border-[var(--border-subtle)] text-[11px] space-y-1.5 font-sans">
                <div className="font-bold text-[var(--ink-heading)] flex justify-between border-b border-[var(--border-subtle)] pb-1.5">
                  <span>Статьи расходов и выручка:</span>
                  <span className={report.profit >= 0 ? 'text-emerald-400 font-mono font-bold' : 'text-rose-400 font-mono font-bold'}>
                    {report.profit >= 0 ? '+' : ''}${report.profit.toLocaleString()}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1 text-[var(--ink)]">
                  <div>• Выручка: <strong className="text-emerald-400 font-mono">+${report.revenue.toLocaleString()}</strong></div>
                  <div>• Сборка (детали): <strong className="text-rose-400 font-mono">-${(report.productionCost ?? 0).toLocaleString()}</strong></div>
                  <div>• Содержание цеха: <strong className="font-mono">-${(report.overheadCost ?? 0).toLocaleString()}</strong></div>
                  <div>• Аренда площадей: <strong className="text-[var(--ink-value)] font-mono">-${(report.rentCost ?? 100).toLocaleString()}</strong></div>
                  <div>• Лаборатория: <strong className="font-mono">-${(report.researchCost ?? 0).toLocaleString()}</strong></div>
                </div>
              </div>

              {/* Event Notes & Bank Overdraft alerts */}
              {report.eventNotes && report.eventNotes.length > 0 ? (
                <div className="text-[12px] bg-[var(--surface-nested)] border border-[var(--border-subtle)] rounded-lg p-2.5 text-[var(--ink)] space-y-1 font-sans">
                  {report.eventNotes.map((note, i) => (
                    <div key={i} className="flex items-start gap-1.5">
                      <span className="font-bold text-[var(--accent-gold)]">📜</span>
                      <span>{note}</span>
                    </div>
                  ))}
                </div>
              ) : null}

              {/* Competitor News */}
              {report.competitorNews && report.competitorNews.length > 0 ? (
                <div className="text-[12px] bg-[var(--surface-nested)] border border-[var(--border-subtle)] rounded-lg p-2.5 text-[var(--ink)] space-y-1 font-sans">
                  <div className="text-[11px] font-bold text-[var(--ink-secondary)] uppercase tracking-wide">
                    {t.reports.competitorNews}
                  </div>
                  {report.competitorNews.map((news, i) => (
                    <div key={i} className="flex items-start gap-1.5">
                      <span className="text-[var(--accent)] font-bold">🏭</span>
                      <span>{news}</span>
                    </div>
                  ))}
                </div>
              ) : null}

              {/* Extra info: Loans paid */}
              {report.loanPayments && report.loanPayments > 0 ? (
                <div className="text-[11px] text-[var(--ink-secondary)] border-t border-[var(--border-subtle)] pt-2 font-sans">
                  <span>{t.reports.loansPaid}: </span>
                  <strong className="text-[var(--ink)] font-mono">${report.loanPayments.toLocaleString()}</strong>
                </div>
              ) : null}

              {/* Sales by Region */}
              {report.salesByRegion ? (
                <div className="text-[11px] text-[var(--ink-secondary)] border-t border-[var(--border-subtle)] pt-2 flex flex-wrap gap-4 font-sans">
                  <span>{t.reports.salesByRegion}</span>
                  {Object.entries(report.salesByRegion).map(([reg, units]) => (
                    <span key={reg}>
                      {t.regions[reg as keyof typeof t.regions] ?? reg.replace('-', ' ')}: <strong className="text-[var(--ink)] font-mono">{units} {t.production.unitsShort}</strong>
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
