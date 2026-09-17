'use client';

import { useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { useLanguage } from '../../lib/i18n';
import { getEraTheme } from '../../lib/eraTheme';

export function TopTimelineBar(): React.JSX.Element {
  const { gameState, endTurn, pendingEndTurn, setSetupModalOpen, setGuideModalOpen } = useGame();
  const { lang, setLang, t } = useLanguage();

  const year = gameState?.date.year ?? 1900;
  const quarter = (gameState?.date.quarter ?? (gameState?.date.month ? Math.ceil(gameState.date.month / 3) : 1)) as 1 | 2 | 3 | 4;
  const cash = gameState?.company.cash ?? 0;
  const reputation = gameState?.company.reputation ?? 0;
  const latestReport = gameState?.reportHistory[0];

  const eraTheme = getEraTheme(year);

  // Dynamically apply the current decade's visual era theme to document
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-era', eraTheme.id);
    }
  }, [eraTheme.id]);

  // Full timeline from 1900 to 2026 = 504 quarters
  const minYear = 1900;
  const maxYear = 2026;
  const totalQuarters = (maxYear - minYear) * 4;
  const currentQuarterIndex = (year - minYear) * 4 + (quarter - 1);
  const progressPercent = Math.min(100, Math.max(0, ((currentQuarterIndex + 1) / totalQuarters) * 100));

  const quarterLabel = t.topbar.quarters[quarter - 1] ?? `Q${quarter}`;
  const companyBadge = gameState?.company.badge;
  const founderPerk = gameState?.company.founderPerk;

  return (
    <header className="sticky top-0 z-30 border-b border-stone-300 bg-[var(--paper)]/95 shadow-sm backdrop-blur-sm">
      {/* 1. TOP STATS BAR */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2 border-b border-stone-200 text-xs">
        {/* Left: Company Crest, Name & Financial Status */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Company Crest and Settings Button */}
          <button
            type="button"
            onClick={() => setSetupModalOpen(true)}
            className="flex items-center gap-2 rounded-lg border border-amber-900/30 bg-amber-50/70 hover:bg-amber-100/80 px-2.5 py-1 transition-colors group cursor-pointer"
            title={t.topbar.setupCompanyBtn}
          >
            <div
              className="w-5 h-5 flex items-center justify-center rounded-full text-xs shadow-xs border border-amber-800/30 text-white"
              style={{ backgroundColor: companyBadge?.color ?? '#b45309' }}
            >
              <span className="text-[10px] leading-none">{companyBadge?.icon ?? '⚙️'}</span>
            </div>
            <span className="font-serif font-bold text-amber-950 text-xs truncate max-w-[130px]">
              {gameState?.company.name ?? 'Pioneer Motor'}
            </span>
            {founderPerk ? (
              <span className="text-[10px] bg-amber-900/10 text-amber-900 px-1 rounded font-mono hidden sm:inline">
                {founderPerk === 'mechanic' ? '🔧' : founderPerk === 'merchant' ? '💰' : '👑'}
              </span>
            ) : null}
            <span className="text-[10px] text-amber-800/60 group-hover:text-amber-900">✏️</span>
          </button>

          {/* Cash */}
          <div className="flex items-center gap-1.5 pl-1">
            <span className="text-stone-500">{t.topbar.cash}:</span>
            <span className="font-bold text-emerald-800 text-sm">
              ${cash.toLocaleString()}
            </span>
          </div>

          {/* Quarterly Profit */}
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

          {/* Reputation */}
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

          {/* Guide / Manual button */}
          <button
            type="button"
            onClick={() => setGuideModalOpen(true)}
            className="flex items-center gap-1 rounded border border-amber-900/30 bg-amber-50 px-2.5 py-1 text-xs font-serif font-bold text-amber-950 hover:bg-amber-100 shadow-2xs transition cursor-pointer"
            title="Руководство по игре и правила"
          >
            <span>📖</span>
            <span className="hidden sm:inline">{lang === 'en' ? 'Guide' : 'Справка'}</span>
          </button>

          {/* Big End Quarter Button */}
          <button
            type="button"
            onClick={() => void endTurn()}
            disabled={pendingEndTurn}
            className="flex items-center gap-2 rounded bg-[var(--accent)] px-4 py-1.5 text-xs font-bold text-white shadow transition hover:bg-amber-900 active:scale-98 disabled:opacity-60 cursor-pointer"
          >
            <span>{pendingEndTurn ? '⏳' : '📅'}</span>
            <span>
              {pendingEndTurn ? t.topbar.simulating : `${t.topbar.endTurn} (${quarterLabel})`}
            </span>
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
              {quarterLabel} ({t.topbar.quarter} {quarter}/4)
            </span>
          </div>

          {/* Era Title & Turn Counter */}
          <div className="text-[11px] font-medium text-stone-600 hidden md:flex items-center gap-2">
            <span
              className="flex items-center gap-1 font-serif text-amber-950 font-bold bg-amber-100/70 border border-amber-900/10 px-2 py-0.5 rounded cursor-help"
              title={`Стиль и материалы эпохи: ${eraTheme.materialRu}`}
            >
              <span>{eraTheme.icon}</span>
              <span>{eraTheme.nameRu}</span>
            </span>
            <span className="text-[10px] bg-stone-200/80 text-stone-700 px-2 py-0.5 rounded font-mono">
              {t.topbar.turnProgress.replace('{turn}', String(currentQuarterIndex + 1))}
            </span>
          </div>

          {/* Quarter Step Indicators (1..4) */}
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4].map((q) => (
              <div
                key={q}
                className={`h-2.5 w-2.5 rounded-full transition-all ${
                  q === quarter
                    ? 'bg-amber-700 scale-125 ring-2 ring-amber-400'
                    : q < quarter
                    ? 'bg-amber-900/60'
                    : 'bg-stone-300'
                }`}
                title={`${t.topbar.quarter} ${q}`}
              />
            ))}
          </div>
        </div>

        {/* Horizontal Visual Timeline Bar */}
        <div className="relative mt-1">
          {/* Background Track */}
          <div className="h-1.5 w-full rounded-full bg-stone-300 overflow-hidden">
            {/* Progress fill */}
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-700 via-amber-800 to-amber-950 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Milestone Marks across 1900 - 2026 */}
          <div className="mt-1 flex justify-between text-[10px] text-stone-500 font-mono">
            <span>1900</span>
            <span className="hidden sm:inline">1914</span>
            <span>1930</span>
            <span className="hidden sm:inline">1950</span>
            <span>1980</span>
            <span className="hidden sm:inline">2000</span>
            <span>2026</span>
          </div>
        </div>
      </div>
    </header>
  );
}
