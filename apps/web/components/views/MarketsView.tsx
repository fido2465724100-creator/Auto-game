'use client';

import { useEffect, useState } from 'react';
import type { Region, Competitor, CompetitorMilestone } from '@ait/shared-types';
import { useGame } from '../../context/GameContext';
import { useLanguage } from '../../lib/i18n';
import { api } from '../../lib/api';

const REGION_FLAGS: Record<string, { flag: string; ru: string; en: string; uk: string; de: string }> = {
  'north-america': { flag: '🇺🇸', ru: 'Северная Америка', en: 'North America', uk: 'Північна Америка', de: 'Nordamerika' },
  europe: { flag: '🇪🇺', ru: 'Европа', en: 'Europe', uk: 'Європа', de: 'Europa' },
  'middle-east': { flag: '🌍', ru: 'Ближний Восток', en: 'Middle East', uk: 'Близький Схід', de: 'Mittlerer Osten' },
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
    <div className="space-y-6">
      {/* HEADER */}
      <header className="border-b border-[var(--border-subtle)] pb-3">
        <h2 className="text-2xl font-bold tracking-tight era-heading">{t.markets.title}</h2>
        <p className="text-xs era-label mt-0.5">{t.markets.subtitle}</p>
      </header>

      {/* REGIONAL MARKETS */}
      <div className="grid gap-5 md:grid-cols-3">
        {regions.map((region) => {
          const meta = REGION_FLAGS[region.id] ?? { flag: '🌐', ru: region.name, en: region.name, uk: region.name, de: region.name };
          const regionName = t.regions?.[region.id as keyof typeof t.regions]
            ?? (lang === 'en' ? meta.en : lang === 'uk' ? meta.uk : lang === 'de' ? meta.de : meta.ru);
          const share = Math.round((presence[region.id] ?? 0) * 100);

          return (
            <article
              key={region.id}
              className="era-card p-5 space-y-4"
            >
              <div className="flex justify-between items-start border-b border-[var(--border-subtle)] pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{meta.flag}</span>
                  <h3 className="font-bold era-heading text-base">{regionName}</h3>
                </div>
                <span className="rounded px-2.5 py-0.5 text-xs font-bold font-mono bg-[var(--tag-bg)] text-[var(--tag-text)] border border-[var(--border-brass)]/40 shadow-2xs">
                  {t.markets.marketShare}: {share}%
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="era-label">{t.markets.size}:</span>
                  <span className="font-bold era-value">
                    {region.marketSize.toLocaleString()} {t.markets.units}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="era-label">{t.markets.priceSensitivity}:</span>
                  <span className="font-semibold era-value">
                    {Math.round(region.priceSensitivity * 100)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="era-label">{t.markets.prestigeSensitivity}:</span>
                  <span className="font-semibold era-value">
                    {Math.round(region.prestigeSensitivity * 100)}%
                  </span>
                </div>
              </div>

              {/* Preferences breakdown */}
              <div className="border-t border-[var(--border-subtle)] pt-3 space-y-2 text-xs">
                <span className="font-semibold era-heading block mb-1">
                  {t.markets.preferencesTitle}
                </span>
                <div className="era-stat-box p-3 space-y-1.5 text-[11px]">
                  <div className="flex justify-between">
                    <span className="era-label">{t.design.stats.comfort}:</span>
                    <span className="font-semibold era-value">{Math.round(region.preferenceWeights.comfort * 100)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="era-label">{t.design.stats.efficiency}:</span>
                    <span className="font-semibold era-value">{Math.round(region.preferenceWeights.efficiency * 100)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="era-label">{t.design.stats.performance}:</span>
                    <span className="font-semibold era-value">{Math.round(region.preferenceWeights.performance * 100)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="era-label">{t.design.stats.prestige}:</span>
                    <span className="font-semibold era-value">{Math.round(region.preferenceWeights.prestige * 100)}%</span>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* COMPETITORS & BENCHMARKS */}
      <section className="space-y-4 pt-2">
        <div className="border-b border-[var(--border-subtle)] pb-2">
          <h3 className="text-xl font-bold era-heading flex items-center gap-2">
            <span>🏆</span> {t.competitors.title}
          </h3>
          <p className="text-xs era-label mt-0.5">
            {t.competitors.subtitle}
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {competitors.map((comp) => {
            const flag = COUNTRY_FLAGS[comp.country] ?? '🌐';
            return (
              <div
                key={comp.id}
                className="era-card p-4.5 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2.5 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{flag}</span>
                      <h4 className="font-serif font-bold era-heading text-sm">{comp.name}</h4>
                    </div>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[var(--tag-bg)] text-[var(--tag-text)] border border-[var(--border-brass)]/40 shadow-2xs">
                      ★ Репутация {comp.reputation}
                    </span>
                  </div>

                  <p className="text-xs era-label mb-3 leading-relaxed">
                    {comp.description}
                  </p>

                  {/* Market Shares */}
                  <div className="era-stat-box p-3 mb-3 text-[11px] space-y-1.5">
                    <div className="font-semibold era-heading">{t.competitors.marketShare}:</div>
                    <div className="grid grid-cols-3 gap-2 era-label">
                      <div>🇺🇸 США: <strong className="era-value">{Math.round((comp.marketShares['north-america'] ?? 0) * 100)}%</strong></div>
                      <div>🇪🇺 Европа: <strong className="era-value">{Math.round((comp.marketShares['europe'] ?? 0) * 100)}%</strong></div>
                      <div>🌍 Восток: <strong className="era-value">{Math.round((comp.marketShares['middle-east'] ?? 0) * 100)}%</strong></div>
                    </div>
                  </div>

                  {/* Active Models */}
                  <div className="text-[11px] space-y-1.5">
                    <div className="font-semibold era-heading">{t.competitors.activeModels}:</div>
                    {comp.activeModels.map((m) => {
                      const isReleased = currentYear > m.releaseYear || (currentYear === m.releaseYear && currentQuarter >= m.releaseQuarter);
                      return (
                        <div
                          key={m.name}
                          className={`flex items-center justify-between px-3 py-2 rounded-lg border transition-all ${
                            isReleased
                              ? 'border-[var(--border-subtle)] bg-[var(--surface-nested)]'
                              : 'border-[var(--border-subtle)]/40 opacity-60 italic'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span>{isReleased ? '🚗' : '⏳'}</span>
                            <span className="font-semibold era-heading text-xs">{m.name}</span>
                            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-[var(--tag-bg)] text-[var(--tag-text)]">
                              {t.design.segments[m.segment]?.name.split(' ')[0] ?? m.segment}
                            </span>
                          </div>
                          <div className="font-mono text-xs font-bold era-value">
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
      <section className="era-card p-5 space-y-3">
        <h4 className="font-bold text-sm era-heading flex items-center gap-2 border-b border-[var(--border-subtle)] pb-2">
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
                    ? 'border-[var(--border-brass)]/50 bg-[var(--surface-nested)]'
                    : 'border-[var(--border-subtle)]/40 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between font-bold mb-1">
                  <span className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded font-mono bg-[var(--tag-bg)] text-[var(--tag-text)] border border-[var(--border-brass)]/40">
                      {ms.year} Q{ms.quarter}
                    </span>
                    <span className="era-heading">{ms.title}</span>
                  </span>
                  <span className="text-[11px] font-medium era-label">
                    {hasPassed ? '✅ Свершилось' : '⏳ Ожидается'}
                  </span>
                </div>
                <p className="text-[11px] era-label leading-relaxed pl-1">
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
