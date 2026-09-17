'use client';

import { useEffect, useState } from 'react';
import type { Region, Competitor, CompetitorMilestone } from '@ait/shared-types';
import { useGame } from '../../context/GameContext';
import { useLanguage } from '../../lib/i18n';
import { api } from '../../lib/api';

const REGION_FLAGS: Record<string, { flag: string; ru: string; en: string }> = {
  'north-america': { flag: '🇺🇸', ru: 'Северная Америка', en: 'North America' },
  europe: { flag: '🇪🇺', ru: 'Европа', en: 'Europe' },
  'middle-east': { flag: '🌍', ru: 'Ближний Восток', en: 'Middle East' },
};

const COUNTRY_FLAGS: Record<string, string> = {
  usa: '🇺🇸',
  germany: '🇩🇪',
  france: '🇫🇷',
  uk: '🇬🇧',
};

export default function MarketsPage(): React.JSX.Element {
  const { gameState } = useGame();
  const { t, lang } = useLanguage();
  const [regions, setRegions] = useState<Region[]>([]);
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [milestones, setMilestones] = useState<CompetitorMilestone[]>([]);

  useEffect(() => {
    api.getRegions().then(setRegions).catch(() => setRegions([]));
    api.getCompetitors().then((res) => {
      setCompetitors(res.competitors ?? []);
      setMilestones(res.milestones ?? []);
    }).catch(() => {});
  }, []);

  const presence = gameState?.company.marketPresence ?? {
    'north-america': 0,
    europe: 0,
    'middle-east': 0,
  };

  const currentYear = gameState?.date.year ?? 1900;
  const currentQuarter = gameState?.date.quarter ?? 1;

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <header className="border-b border-stone-300 pb-3">
        <h2 className="text-2xl font-bold tracking-tight text-amber-950">{t.markets.title}</h2>
        <p className="text-sm text-stone-600">{t.markets.subtitle}</p>
      </header>

      {/* REGIONAL MARKETS */}
      <div className="grid gap-6 md:grid-cols-3">
        {regions.map((region) => {
          const meta = REGION_FLAGS[region.id] ?? { flag: '🌐', ru: region.name, en: region.name };
          const regionName = lang === 'ru' ? meta.ru : meta.en;
          const share = Math.round((presence[region.id] ?? 0) * 100);

          return (
            <article
              key={region.id}
              className="rounded border border-stone-300 bg-[var(--paper)] p-5 shadow-sm space-y-4"
            >
              <div className="flex justify-between items-start border-b border-stone-200 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{meta.flag}</span>
                  <h3 className="font-bold text-amber-950 text-base">{regionName}</h3>
                </div>
                <span className="rounded bg-amber-100 text-amber-900 px-2 py-0.5 text-xs font-bold">
                  {t.markets.marketShare}: {share}%
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-stone-500">{t.markets.size}:</span>
                  <span className="font-bold text-stone-900">
                    {region.marketSize.toLocaleString()} {t.markets.units}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">{t.markets.priceSensitivity}:</span>
                  <span className="font-semibold text-stone-800">
                    {Math.round(region.priceSensitivity * 100)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">{t.markets.prestigeSensitivity}:</span>
                  <span className="font-semibold text-stone-800">
                    {Math.round(region.prestigeSensitivity * 100)}%
                  </span>
                </div>
              </div>

              {/* Preferences breakdown */}
              <div className="border-t border-stone-200 pt-3 space-y-1.5 text-[11px]">
                <span className="font-semibold text-stone-600 block mb-1">
                  {t.markets.preferencesTitle}
                </span>
                <div className="space-y-1 text-stone-700">
                  <div className="flex justify-between">
                    <span>{t.design.stats.comfort}:</span>
                    <span className="font-semibold">{Math.round(region.preferenceWeights.comfort * 100)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t.design.stats.efficiency}:</span>
                    <span className="font-semibold">{Math.round(region.preferenceWeights.efficiency * 100)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t.design.stats.performance}:</span>
                    <span className="font-semibold">{Math.round(region.preferenceWeights.performance * 100)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t.design.stats.prestige}:</span>
                    <span className="font-semibold">{Math.round(region.preferenceWeights.prestige * 100)}%</span>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* COMPETITORS & BENCHMARKS */}
      <section className="space-y-4 pt-2">
        <div className="border-b border-stone-300 pb-2">
          <h3 className="text-xl font-bold text-amber-950 flex items-center gap-2">
            <span>🏆</span> {t.competitors.title}
          </h3>
          <p className="text-xs text-stone-600">
            {t.competitors.subtitle}
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {competitors.map((comp) => {
            const flag = COUNTRY_FLAGS[comp.country] ?? '🌐';
            return (
              <div
                key={comp.id}
                className="rounded-lg border border-stone-300 bg-[var(--paper)] p-4 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-stone-200 pb-2.5 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{flag}</span>
                      <h4 className="font-serif font-bold text-amber-950 text-sm">{comp.name}</h4>
                    </div>
                    <span className="text-xs font-mono font-bold bg-amber-900/10 text-amber-900 px-2 py-0.5 rounded">
                      ★ Репутация {comp.reputation}
                    </span>
                  </div>

                  <p className="text-xs text-stone-600 mb-3 leading-relaxed">
                    {comp.description}
                  </p>

                  {/* Market Shares */}
                  <div className="mb-3 bg-stone-50 rounded p-2.5 border border-stone-200/80 text-[11px] space-y-1">
                    <div className="font-semibold text-stone-700 mb-1">{t.competitors.marketShare}:</div>
                    <div className="grid grid-cols-3 gap-2 text-stone-600">
                      <div>🇺🇸 США: <strong>{Math.round((comp.marketShares['north-america'] ?? 0) * 100)}%</strong></div>
                      <div>🇪🇺 Европа: <strong>{Math.round((comp.marketShares['europe'] ?? 0) * 100)}%</strong></div>
                      <div>🌍 Восток: <strong>{Math.round((comp.marketShares['middle-east'] ?? 0) * 100)}%</strong></div>
                    </div>
                  </div>

                  {/* Active Models */}
                  <div className="text-[11px] space-y-1.5">
                    <div className="font-semibold text-stone-700">{t.competitors.activeModels}:</div>
                    {comp.activeModels.map((m) => {
                      const isReleased = currentYear > m.releaseYear || (currentYear === m.releaseYear && currentQuarter >= m.releaseQuarter);
                      return (
                        <div
                          key={m.name}
                          className={`flex items-center justify-between px-2.5 py-1.5 rounded border ${
                            isReleased
                              ? 'border-amber-700/30 bg-white text-stone-900'
                              : 'border-stone-200 bg-stone-100/70 text-stone-400 italic'
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            <span>{isReleased ? '🚗' : '⏳'}</span>
                            <span className="font-semibold">{m.name}</span>
                            <span className="text-[10px] uppercase font-mono px-1 rounded bg-stone-100 text-stone-600">
                              {t.design.segments[m.segment]?.name.split(' ')[0] ?? m.segment}
                            </span>
                          </div>
                          <div className="font-mono text-xs font-bold text-amber-900">
                            ${m.price.toLocaleString()} {isReleased ? '' : `(${m.releaseYear} Q${m.releaseQuarter})`}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* HISTORICAL MILESTONES */}
      <section className="rounded-lg border border-amber-900/30 bg-gradient-to-br from-amber-50/50 via-white to-amber-50/30 p-5 shadow-sm space-y-3">
        <h4 className="font-bold text-sm text-amber-950 flex items-center gap-2">
          <span>📜</span> {t.competitors.milestonesTitle}
        </h4>
        <div className="space-y-2.5 text-xs">
          {milestones.map((ms) => {
            const hasPassed = currentYear > ms.year || (currentYear === ms.year && currentQuarter >= ms.quarter);
            return (
              <div
                key={`${ms.year}-${ms.quarter}-${ms.title}`}
                className={`p-3 rounded-lg border transition-all ${
                  hasPassed
                    ? 'border-amber-800/40 bg-amber-50/80 text-amber-950'
                    : 'border-stone-200 bg-stone-50/60 text-stone-500 opacity-75'
                }`}
              >
                <div className="flex items-center justify-between font-bold mb-1">
                  <span className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded bg-amber-900 text-white font-mono">
                      {ms.year} Q{ms.quarter}
                    </span>
                    <span>{ms.title}</span>
                  </span>
                  <span className="text-[11px] font-medium font-sans">
                    {hasPassed ? '✅ Свершилось' : '⏳ Ожидается'}
                  </span>
                </div>
                <p className="text-[11px] text-stone-700 leading-relaxed font-sans pl-1">
                  {ms.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
