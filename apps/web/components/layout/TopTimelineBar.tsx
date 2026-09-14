'use client';

import { useGame } from '../../context/GameContext';
import { useLanguage } from '../../lib/i18n';

export function TopTimelineBar(): React.JSX.Element {
  const { gameState, endTurn, pendingEndTurn } = useGame();
  const { lang, setLang, t } = useLanguage();

  const year = gameState?.date.year ?? 1900;
  const month = gameState?.date.month ?? 1;
  const cash = gameState?.company.cash ?? 0;
  const reputation = gameState?.company.reputation ?? 0;
  const latestReport = gameState?.reportHistory[0];

  // Timeline position calculation (1900 to 1930)
  const minYear = 1900;
  const maxYear = 1930;
  const totalMonths = (maxYear - minYear) * 12;
  const currentMonths = (year - minYear) * 12 + (month - 1);
  const progressPercent = Math.min(100, Math.max(0, (currentMonths / totalMonths) * 100));

  const monthName = t.topbar.months[month - 1] ?? `M${month}`;

  return (
    <header className="sticky top-0 z-30 border-b border-stone-300 bg-[var(--paper)]/95 shadow-sm backdrop-blur-sm">
      {/* 1. TOP STATS BAR */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2 border-b border-stone-200 text-xs">
        {/* Left: Financial & Company Status */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="text-stone-500">{t.topbar.cash}:</span>
            <span className="font-bold text-emerald-800 text-sm">
              ${cash.toLocaleString()}
            </span>
          </div>

          {latestReport ? (
            <div className="hidden sm:flex items-center gap-1.5">
              <span className="text-stone-500">{t.topbar.lastProfit}:</span>
              <span
                className={`font-semibold ${
                  latestReport.profit >= 0 ? 'text-emerald-700' : 'text-red-700'
                }`}
              >
                {latestReport.profit >= 0 ? '+' : ''}${latestReport.profit.toLocaleString()}
              </span>
            </div>
          ) : null}

          <div className="flex items-center gap-1.5">
            <span className="text-stone-500">{t.topbar.reputation}:</span>
            <span className="font-bold text-amber-800">
              ★ {reputation}
            </span>
          </div>
        </div>

        {/* Right: Language Switcher & End Turn Button */}
        <div className="flex items-center gap-3">
          {/* Language Toggle */}
          <div className="flex rounded border border-stone-300 bg-white/70 p-0.5 text-[11px] font-semibold">
            <button
              type="button"
              onClick={() => setLang('ru')}
              className={`rounded px-2 py-0.5 transition ${
                lang === 'ru'
                  ? 'bg-amber-800 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              RU
            </button>
            <button
              type="button"
              onClick={() => setLang('en')}
              className={`rounded px-2 py-0.5 transition ${
                lang === 'en'
                  ? 'bg-amber-800 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              EN
            </button>
          </div>

          {/* Big End Turn Button */}
          <button
            type="button"
            onClick={() => void endTurn()}
            disabled={pendingEndTurn}
            className="flex items-center gap-2 rounded bg-[var(--accent)] px-4 py-1.5 text-xs font-bold text-white shadow transition hover:bg-amber-900 active:scale-98 disabled:opacity-60 cursor-pointer"
          >
            <span>{pendingEndTurn ? '⏳' : '📅'}</span>
            <span>{pendingEndTurn ? t.topbar.simulating : t.topbar.endTurn}</span>
          </button>
        </div>
      </div>

      {/* 2. TIMELINE STRIP */}
      <div className="px-4 py-2 bg-gradient-to-r from-amber-50/50 via-stone-50 to-amber-50/50">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          {/* Current Date Badge */}
          <div className="flex items-center gap-2">
            <span className="rounded bg-amber-900 px-2 py-0.5 text-xs font-bold text-white shadow-xs">
              {year} {t.topbar.year}
            </span>
            <span className="font-semibold text-amber-950 text-xs">
              {monthName} ({month} / 12)
            </span>
          </div>

          {/* Era Title */}
          <div className="text-[11px] font-medium text-stone-500 italic hidden md:block">
            {year < 1915 ? t.topbar.eraPioneers : t.topbar.eraMassProduction}
          </div>

          {/* Month Step Indicators (1..12) */}
          <div className="flex gap-1">
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <div
                key={m}
                className={`h-2 w-2 rounded-full transition ${
                  m === month
                    ? 'bg-amber-700 scale-125 ring-2 ring-amber-400'
                    : m < month
                    ? 'bg-amber-900/60'
                    : 'bg-stone-300'
                }`}
                title={`${t.topbar.month} ${m}`}
              />
            ))}
          </div>
        </div>

        {/* Horizontal Visual Timeline Bar */}
        <div className="relative mt-1">
          {/* Background Track */}
          <div className="h-1.5 w-full rounded-full bg-stone-300">
            {/* Progress fill */}
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-700 to-amber-900 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Year Milestone Marks */}
          <div className="mt-1 flex justify-between text-[10px] text-stone-400 font-mono">
            <span>1900</span>
            <span>1905</span>
            <span>1910</span>
            <span>1915</span>
            <span>1920</span>
            <span>1925</span>
            <span>1930</span>
          </div>
        </div>
      </div>
    </header>
  );
}
