'use client';

import { useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { useLanguage } from '../../lib/i18n';
import { getEraTheme } from '../../lib/eraTheme';
import { EraEmblem } from '../EraEmblem';

export function TopTimelineBar(): React.JSX.Element {
  const {
    gameState,
    endTurn,
    pendingEndTurn,
    setSetupModalOpen,
    setGuideModalOpen,
    resetGame,
    setHallOfFameOpen,
  } = useGame();
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
    <header className="sticky top-0 z-30 border-b border-[var(--border-subtle)] bg-[var(--paper)]/95 shadow-sm backdrop-blur-sm">
      {/* 1. TOP STATS BAR */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2 border-b border-[var(--border-subtle)]/70 text-xs">
        {/* Left: Company Crest, Name & Financial Status */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Company Crest and Settings Button */}
          <button
            type="button"
            onClick={() => setSetupModalOpen(true)}
            className="flex items-center gap-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-nested)] hover:border-[var(--border-brass)] px-2.5 py-1 transition-colors group cursor-pointer"
            title={t.topbar.setupCompanyBtn}
          >
            <div
              className="w-5 h-5 flex items-center justify-center rounded-full text-xs shadow-xs border border-[var(--border-brass)]/40 text-white"
              style={{ backgroundColor: companyBadge?.color ?? '#b45309' }}
            >
              <span className="text-[10px] leading-none">{companyBadge?.icon ?? '⚙️'}</span>
            </div>
            <span className="font-serif font-bold era-heading text-xs truncate max-w-[130px]">
              {gameState?.company.name ?? 'Pioneer Motor'}
            </span>
            {founderPerk ? (
              <span className="text-[10px] bg-[var(--surface-nested)] era-value px-1.5 py-0.5 rounded font-mono hidden sm:inline border border-[var(--border-subtle)]">
                {founderPerk === 'mechanic' ? '🔧' : founderPerk === 'merchant' ? '💰' : '👑'}
              </span>
            ) : null}
            <span className="text-[10px] era-label opacity-70 group-hover:opacity-100">✏️</span>
          </button>

          {/* Cash */}
          <div className="flex items-center gap-1.5 pl-1">
            <span className="text-[11px] font-serif uppercase tracking-wider era-label">{t.topbar.cash}:</span>
            <span className="font-mono font-bold text-sm tracking-tight text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-md shadow-2xs">
              ${cash.toLocaleString()}
            </span>
          </div>

          {/* Quarterly Profit */}
          {latestReport ? (
            <div className="hidden sm:flex items-center gap-1.5">
              <span className="text-[11px] font-serif uppercase tracking-wider era-label">{t.topbar.lastProfit}:</span>
              <span
                className={`font-mono font-bold text-xs px-2 py-0.5 rounded-md shadow-2xs border ${
                  latestReport.profit >= 0
                    ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
                    : 'text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/30'
                }`}
              >
                {latestReport.profit >= 0 ? '+' : ''}${latestReport.profit.toLocaleString()}
              </span>
            </div>
          ) : null}

          {/* Reputation */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-serif uppercase tracking-wider era-label">{t.topbar.reputation}:</span>
            <span className="font-serif font-bold text-xs era-value bg-[var(--tag-bg)] text-[var(--tag-text)] border border-[var(--border-brass)]/40 px-2.5 py-0.5 rounded-md shadow-2xs">
              ★ {reputation}
            </span>
          </div>
        </div>

        {/* Right: Language Switcher & End Turn Button */}
        <div className="flex items-center gap-3">
          {/* Language Toggle (RU, UA, DE, EN) */}
          <div className="flex rounded border border-stone-300 bg-white/70 p-0.5 text-[11px] font-semibold gap-0.5">
            {[
              { code: 'ru', label: 'RU' },
              { code: 'uk', label: 'UA' },
              { code: 'de', label: 'DE' },
              { code: 'en', label: 'EN' },
            ].map(({ code, label }) => (
              <button
                key={code}
                type="button"
                onClick={() => setLang(code as any)}
                className={`rounded px-1.5 py-0.5 transition cursor-pointer font-sans text-[10px] font-bold ${
                  lang === code
                    ? 'bg-amber-800 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Hall of Fame / Achievements button */}
          <button
            type="button"
            onClick={() => setHallOfFameOpen(true)}
            className="flex items-center gap-1 rounded border border-amber-900/30 bg-amber-50 px-2.5 py-1 text-xs font-serif font-bold text-amber-950 hover:bg-amber-100 shadow-2xs transition cursor-pointer"
            title={
              lang === 'en'
                ? 'Hall of Fame, Trophies & Save/Load'
                : lang === 'uk'
                ? 'Зал Слави, Трофеї та Збереження'
                : lang === 'de'
                ? 'Ruhmeshalle, Trophäen & Spielstand'
                : 'Зал Славы, Трофеи и Сохранения'
            }
          >
            <span>🏆</span>
            <span className="hidden sm:inline">
              {lang === 'en' ? 'Trophies' : lang === 'uk' ? 'Зал слави' : lang === 'de' ? 'Ruhmeshalle' : 'Зал славы'}
            </span>
          </button>

          {/* Guide / Manual button */}
          <button
            type="button"
            onClick={() => setGuideModalOpen(true)}
            className="flex items-center gap-1 rounded border border-amber-900/30 bg-amber-50 px-2.5 py-1 text-xs font-serif font-bold text-amber-950 hover:bg-amber-100 shadow-2xs transition cursor-pointer"
            title={
              lang === 'en'
                ? 'Handbook & Rules'
                : lang === 'uk'
                ? 'Довідник з гри та правила'
                : lang === 'de'
                ? 'Spielanleitung & Regeln'
                : 'Руководство по игре и правила'
            }
          >
            <span>📖</span>
            <span className="hidden sm:inline">
              {lang === 'en' ? 'Guide' : lang === 'uk' ? 'Довідка' : lang === 'de' ? 'Handbuch' : 'Справка'}
            </span>
          </button>

          {/* Reset / New Game button */}
          <button
            type="button"
            onClick={async () => {
              const msg =
                lang === 'en'
                  ? 'Start a new game from 1900 Q1? All current progress will be reset.'
                  : lang === 'uk'
                  ? 'Почати нову кампанію заново з 1900 року (I кв.)? Весь поточний прогрес буде скинуто.'
                  : lang === 'de'
                  ? 'Neues Spiel ab 1900 (1. Quartal) starten? Der aktuelle Spielstand wird zurückgesetzt.'
                  : 'Начать новую кампанию заново с 1900 года (I кв.)? Весь текущий прогресс будет сброшен.';
              if (window.confirm(msg)) {
                await resetGame();
              }
            }}
            className="flex items-center gap-1 rounded border border-stone-300 bg-white/70 hover:bg-red-50 hover:border-red-300 hover:text-red-800 px-2 py-1 text-xs font-serif text-stone-600 shadow-2xs transition cursor-pointer"
            title={
              lang === 'en'
                ? 'Restart game from 1900'
                : lang === 'uk'
                ? 'Перезапустити гру заново з 1900 року'
                : lang === 'de'
                ? 'Spiel ab 1900 neu starten'
                : 'Перезапустить игру заново с 1900 года'
            }
          >
            <span>🔄</span>
            <span className="hidden md:inline">
              {lang === 'en' ? 'Restart' : lang === 'uk' ? 'Нова гра' : lang === 'de' ? 'Neustart' : 'Новая игра'}
            </span>
          </button>

          {/* Big End Quarter Button */}
          <button
            type="button"
            onClick={() => void endTurn()}
            disabled={pendingEndTurn}
            className="btn-brass flex items-center gap-2 rounded-lg px-4 py-1.5 text-xs font-bold text-white shadow-md active:scale-98 disabled:opacity-60 cursor-pointer"
          >
            <span>{pendingEndTurn ? '⏳' : '📅'}</span>
            <span>
              {pendingEndTurn ? t.topbar.simulating : `${t.topbar.endTurn} (${quarterLabel})`}
            </span>
          </button>
        </div>
      </div>

      {/* 2. TIMELINE STRIP */}
      <div className="px-4 py-2 bg-[var(--paper-card)] border-t border-[var(--border-subtle)]/40">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          {/* Current Date Badge */}
          <div className="flex items-center gap-2">
            <span className="rounded bg-amber-900 px-2 py-0.5 text-xs font-bold text-white shadow-xs font-mono">
              {year} {t.topbar.year}
            </span>
            <span className="font-semibold era-heading text-xs">
              {quarterLabel} ({t.topbar.quarter} {quarter}/4)
            </span>
          </div>

          {/* Era Title & Turn Counter */}
          <div className="text-[11px] font-medium era-label hidden md:flex items-center gap-2">
            <span
              className="flex items-center gap-1.5 font-serif era-heading font-bold bg-[var(--surface-nested)] border border-[var(--border-subtle)] px-2.5 py-0.5 rounded-lg cursor-help shadow-2xs"
              title={`Стиль и материалы эпохи: ${eraTheme.materialRu}`}
            >
              <EraEmblem eraId={eraTheme.id} size={20} />
              <span>{eraTheme.nameRu}</span>
            </span>
            <span className="text-[10px] bg-[var(--surface-nested)] era-label border border-[var(--border-subtle)] px-2 py-0.5 rounded font-mono">
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
                    ? 'bg-amber-600 scale-125 ring-2 ring-amber-400'
                    : q < quarter
                    ? 'bg-amber-900/70'
                    : 'bg-[var(--border-subtle)]'
                }`}
                title={`${t.topbar.quarter} ${q}`}
              />
            ))}
          </div>
        </div>

        {/* Horizontal Visual Timeline Bar */}
        <div className="relative mt-1">
          {/* Background Track */}
          <div className="h-2 w-full rounded-full bg-[var(--surface-nested)] shadow-inner overflow-hidden border border-[var(--border-subtle)]">
            {/* Progress fill */}
            <div
              className="h-full rounded-full bg-linear-to-r from-amber-600 via-amber-700 to-amber-900 shadow-xs transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Milestone Marks across 1900 - 2026 */}
          <div className="mt-1 flex justify-between text-[10px] era-label font-mono">
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
