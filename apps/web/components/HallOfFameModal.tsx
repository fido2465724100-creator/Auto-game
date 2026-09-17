'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useGame } from '../context/GameContext';
import { useLanguage } from '../lib/i18n';
import type { Achievement, GameState, GlobalManufacturerRanking, RegionId } from '@ait/shared-types';

const DEFAULT_REGIONS: Array<{ id: RegionId; marketSize: number }> = [
  { id: 'north-america', marketSize: 400 },
  { id: 'europe', marketSize: 350 },
  { id: 'middle-east', marketSize: 100 },
];

function getCountryDisplay(codeOrName: string, lang: string): { flag: string; name: string } {
  const c = (codeOrName || '').toLowerCase();
  if (c.includes('usa') || c.includes('us') || c.includes('сша') || c.includes('америк')) {
    return { flag: '🇺🇸', name: lang === 'en' ? 'USA' : lang === 'uk' ? 'США' : lang === 'de' ? 'USA' : 'США' };
  }
  if (c.includes('germany') || c.includes('de') || c.includes('герм') || c.includes('нім')) {
    return { flag: '🇩🇪', name: lang === 'en' ? 'Germany' : lang === 'uk' ? 'Німеччина' : lang === 'de' ? 'Deutschland' : 'Германия' };
  }
  if (c.includes('france') || c.includes('fr') || c.includes('фран')) {
    return { flag: '🇫🇷', name: lang === 'en' ? 'France' : lang === 'uk' ? 'Франція' : lang === 'de' ? 'Frankreich' : 'Франция' };
  }
  if (c.includes('uk') || c.includes('gb') || c.includes('brit') || c.includes('великоб') || c.includes('брит')) {
    return { flag: '🇬🇧', name: lang === 'en' ? 'Great Britain' : lang === 'uk' ? 'Велика Британія' : lang === 'de' ? 'Großbritannien' : 'Великобритания' };
  }
  if (c.includes('ital') || c.includes('it') || c.includes('итал') || c.includes('італ')) {
    return { flag: '🇮🇹', name: lang === 'en' ? 'Italy' : lang === 'uk' ? 'Італія' : lang === 'de' ? 'Italien' : 'Италия' };
  }
  if (c.includes('japan') || c.includes('jp') || c.includes('япон')) {
    return { flag: '🇯🇵', name: lang === 'en' ? 'Japan' : lang === 'uk' ? 'Японія' : lang === 'de' ? 'Japan' : 'Япония' };
  }
  if (c.includes('ua') || c.includes('ukr') || c.includes('укра')) {
    return { flag: '🇺🇦', name: lang === 'en' ? 'Ukraine' : lang === 'uk' ? 'Україна' : lang === 'de' ? 'Ukraine' : 'Украина' };
  }
  return { flag: '🌐', name: codeOrName || 'Global' };
}

function getGlobalRankings(gameState: GameState | null): GlobalManufacturerRanking[] {
  if (!gameState) return [];
  if (gameState.reportHistory?.length > 0 && gameState.reportHistory[0]?.globalRankings?.length) {
    return gameState.reportHistory[0].globalRankings;
  }
  // Initial starting rankings estimate before turn 1 completes
  const competitorsList = gameState.competitors ?? [];
  const compRankings: GlobalManufacturerRanking[] = competitorsList.map((comp) => {
    let units = 0;
    for (const r of DEFAULT_REGIONS) {
      const share = comp.marketShares?.[r.id] ?? 0.05;
      units += Math.round(r.marketSize * share);
    }
    const topModel = comp.activeModels?.[0];
    const revenue = units * (topModel ? topModel.price : 1000);
    return {
      rank: 0,
      companyId: comp.id,
      companyName: comp.name,
      country: comp.country,
      isPlayer: false,
      annualUnitsSold: units,
      annualRevenue: revenue,
      globalMarketShare: 0,
      topModelName: topModel?.name ?? 'Standard Runabout',
    };
  });
  const playerRank: GlobalManufacturerRanking = {
    rank: 0,
    companyId: gameState.company.id,
    companyName: gameState.company.name,
    country: gameState.company.country,
    isPlayer: true,
    annualUnitsSold: 0,
    annualRevenue: 0,
    globalMarketShare: 0,
    topModelName: gameState.vehicleModels?.[0]?.name ?? 'Model A Runabout',
  };
  const all = [...compRankings, playerRank];
  const total = all.reduce((acc, c) => acc + c.annualUnitsSold, 0);
  all.sort((a, b) => b.annualUnitsSold - a.annualUnitsSold || b.annualRevenue - a.annualRevenue);
  all.forEach((item, idx) => {
    item.rank = idx + 1;
    item.globalMarketShare = total > 0 ? Math.round((item.annualUnitsSold / total) * 1000) / 1000 : 0;
  });
  return all;
}

export function HallOfFameModal(): React.JSX.Element | null {
  const { gameState, isHallOfFameOpen, setHallOfFameOpen, exportSave, importSave } = useGame();
  const { lang } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [importMessage, setImportMessage] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isHallOfFameOpen) {
        setHallOfFameOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isHallOfFameOpen, setHallOfFameOpen]);

  if (!isHallOfFameOpen || !mounted) return null;

  const year = gameState?.date.year ?? 1900;
  const quarter = gameState?.date.quarter ?? 1;
  const isDynastyComplete = year >= 2026;
  const achievements: Achievement[] = gameState?.achievements ?? [];
  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalCount = achievements.length || 10;
  const progressPercent = Math.round((unlockedCount / totalCount) * 100);

  // Handle Save Export (Download JSON)
  const handleExport = async () => {
    try {
      const json = await exportSave();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const companyName = (gameState?.company.name ?? 'Pioneer').replace(/\s+/g, '_');
      a.href = url;
      a.download = `autogame_${companyName}_${year}_Q${quarter}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert('Ошибка экспорта сохранения');
    }
  };

  // Handle Save Import (Upload JSON)
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setImportMessage(null);

    try {
      const text = await file.text();
      await importSave(text);
      setImportMessage(
        lang === 'en'
          ? 'Game save successfully restored!'
          : lang === 'uk'
          ? 'Збереження гри успішно відновлено!'
          : lang === 'de'
          ? 'Spielstand erfolgreich wiederhergestellt!'
          : 'Сохранение успешно загружено!'
      );
      setTimeout(() => setImportMessage(null), 4000);
    } catch (err) {
      console.error(err);
      setImportMessage(
        lang === 'en'
          ? 'Error: Invalid save file'
          : lang === 'uk'
          ? 'Помилка: Невірний формат файлу збереження'
          : lang === 'de'
          ? 'Fehler: Ungültige Speicherdatei'
          : 'Ошибка: Неверный формат файла сохранения'
      );
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const getAchievementTitle = (ach: Achievement) => {
    if (lang === 'en') return ach.titleEn;
    if (lang === 'uk') return ach.titleUk ?? ach.titleEn;
    if (lang === 'de') return ach.titleDe ?? ach.titleEn;
    return ach.titleRu;
  };

  const getAchievementDesc = (ach: Achievement) => {
    if (lang === 'en') return ach.descriptionEn;
    if (lang === 'uk') return ach.descriptionUk ?? ach.descriptionEn;
    if (lang === 'de') return ach.descriptionDe ?? ach.descriptionEn;
    return ach.descriptionRu;
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setHallOfFameOpen(false);
        }
      }}
    >
      <div
        className="relative flex flex-col w-full max-w-4xl h-[90vh] max-h-[90vh] rounded-2xl border-2 border-amber-800/50 bg-[var(--bg)] shadow-2xl overflow-hidden"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="shrink-0 flex items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--paper-card)] px-5 py-3.5 shadow-xs">
          <div className="flex items-center gap-3">
            <span className="text-2xl select-none">🌐</span>
            <div>
              <h3 className="font-bold text-base text-[var(--ink-heading)] era-heading leading-tight">
                {lang === 'en'
                  ? 'World Automobile Sales Leaderboard'
                  : lang === 'uk'
                  ? 'Світовий рейтинг автовиробників року'
                  : lang === 'de'
                  ? 'Weltweite Automobil-Verkaufsrangliste'
                  : 'Мировой рейтинг автопроизводителей года'}
              </h3>
              <p className="text-[11px] text-[var(--ink-secondary)]">
                {lang === 'en'
                  ? `Annual sales volumes, global market share and revenue (${year})`
                  : lang === 'uk'
                  ? `Рейтинг продажів за ${year} рік, виручка та частка світового ринку`
                  : lang === 'de'
                  ? `Jahresabsatz, Umsatz und Weltmarktanteil (${year})`
                  : `Рейтинг продаж за ${year} год, выручка и доля мирового рынка`}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setHallOfFameOpen(false)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--ink-secondary)] hover:text-[var(--ink)] hover:bg-[var(--surface-nested)] transition cursor-pointer text-lg font-bold leading-none"
            title="Закрыть (Esc)"
          >
            ✕
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* DYNASTY 2026 VICTORY BANNER (IF REACHED) */}
          {isDynastyComplete && (
            <div className="rounded-xl border-2 border-[var(--border-brass)] bg-[var(--surface-nested)] p-5 shadow-md">
              <div className="flex items-center gap-4">
                <span className="text-4xl">👑</span>
                <div className="space-y-1">
                  <h4 className="font-bold text-lg text-[var(--ink-heading)] era-heading">
                    {lang === 'en'
                      ? 'Century Triumph: 126 Years Completed!'
                      : lang === 'uk'
                      ? 'Великий Тріумф: 126 років історії пройдено!'
                      : lang === 'de'
                      ? 'Jahrhundert-Triumph: 126 Jahre vollendet!'
                      : 'Великий Триумф: 126 лет истории пройдены!'}
                  </h4>
                  <p className="text-xs text-[var(--ink-secondary)] leading-relaxed">
                    {lang === 'en'
                      ? `Your company ${gameState?.company.name} successfully traversed 126 years from a modest 1900 workshop to the modern automotive era of 2026!`
                      : lang === 'uk'
                      ? `Ваш автомобільний концерн «${gameState?.company.name}» успішно пройшов усі 126 років крізь кризи та війни і зустрів 2026 рік світовим лідером автопрому!`
                      : lang === 'de'
                      ? `Ihr Unternehmen ${gameState?.company.name} hat alle 126 Jahre von einer bescheidenen Werkstatt im Jahr 1900 bis zur Moderne von 2026 gemeistert!`
                      : `Ваш автомобильный концерн «${gameState?.company.name}» успешно прошел все 126 лет сквозь войны, Великую депрессию, кризисы и встретил 2026 год глобальным автогигантом!`}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* PLAYER RANK STATUS CARD */}
          {(() => {
            const rankings = getGlobalRankings(gameState);
            const playerEntry = rankings.find((r) => r.isPlayer);
            const pRank = playerEntry?.rank ?? 5;
            const medal = pRank === 1 ? '🥇' : pRank === 2 ? '🥈' : pRank === 3 ? '🥉' : '🌐';

            return (
              <div className="rounded-xl border-2 border-[var(--border-brass)] bg-[var(--surface-nested)] p-4 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl select-none">{medal}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs uppercase font-bold tracking-wider text-[var(--accent-gold)]">
                          {lang === 'en'
                            ? 'Your Current Global Position'
                            : lang === 'uk'
                            ? 'Ваше поточне місце у світі'
                            : lang === 'de'
                            ? 'Ihre aktuelle globale Position'
                            : 'Ваша текущая позиция в мире'}
                        </span>
                        <span className="font-mono font-black text-sm px-2 py-0.5 rounded bg-[var(--paper)] border border-[var(--border-brass)] text-[var(--ink-heading)]">
                          #{pRank} {lang === 'en' ? 'of' : lang === 'uk' ? 'з' : lang === 'de' ? 'von' : 'из'} {rankings.length}
                        </span>
                      </div>
                      <h4 className="font-bold text-lg text-[var(--ink-heading)] era-heading mt-0.5">
                        {gameState?.company.name ?? 'Pioneer'}
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:gap-6 font-mono text-xs">
                    <div className="text-right">
                      <span className="text-[10px] uppercase block font-sans text-[var(--ink-secondary)] font-bold">
                        {lang === 'en' ? 'Annual Sales' : lang === 'uk' ? 'Продажі за рік' : lang === 'de' ? 'Jahresabsatz' : 'Продажи за год'}
                      </span>
                      <strong className="text-sm font-bold text-[var(--ink-value)]">
                        {(playerEntry?.annualUnitsSold ?? 0).toLocaleString()} {lang === 'en' ? 'cars' : lang === 'uk' ? 'авто' : lang === 'de' ? 'Fz.' : 'авто'}
                      </strong>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] uppercase block font-sans text-[var(--ink-secondary)] font-bold">
                        {lang === 'en' ? 'Market Share' : lang === 'uk' ? 'Частка ринку' : lang === 'de' ? 'Marktanteil' : 'Доля рынка'}
                      </span>
                      <strong className="text-sm font-bold text-[var(--accent-gold)]">
                        {((playerEntry?.globalMarketShare ?? 0) * 100).toFixed(1)}%
                      </strong>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] uppercase block font-sans text-[var(--ink-secondary)] font-bold">
                        {lang === 'en' ? 'Annual Revenue' : lang === 'uk' ? 'Річна виручка' : lang === 'de' ? 'Jahresumsatz' : 'Годовая выручка'}
                      </span>
                      <strong className="text-sm font-bold text-emerald-400">
                        ${(playerEntry?.annualRevenue ?? 0).toLocaleString()}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* LEADERBOARD TABLE */}
          <div className="era-card p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2.5">
              <h4 className="font-bold text-sm text-[var(--ink-heading)] era-heading flex items-center gap-2">
                <span>📊</span>
                <span>
                  {lang === 'en'
                    ? `World Automaker Rankings — ${year}`
                    : lang === 'uk'
                    ? `Рейтинг світових продавців авто — ${year} рік`
                    : lang === 'de'
                    ? `Rangliste der Weltautohersteller — ${year}`
                    : `Рейтинг продавцов года в мире — ${year} год`}
                </span>
              </h4>
              <span className="text-[11px] text-[var(--ink-secondary)] italic">
                {lang === 'en' ? 'Updated at the end of each year' : lang === 'uk' ? 'Оновлюється наприкінці кожного року' : lang === 'de' ? 'Wird zum Jahresende aktualisiert' : 'Обновляется по итогам каждого года'}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[var(--border-subtle)] text-[10px] uppercase tracking-wider text-[var(--ink-secondary)] font-bold">
                    <th className="py-2.5 px-3">{lang === 'en' ? 'Rank' : lang === 'uk' ? 'Місце' : lang === 'de' ? 'Platz' : 'Место'}</th>
                    <th className="py-2.5 px-3">{lang === 'en' ? 'Company' : lang === 'uk' ? 'Концерн' : lang === 'de' ? 'Konzern' : 'Компания'}</th>
                    <th className="py-2.5 px-3">{lang === 'en' ? 'Country' : lang === 'uk' ? 'Країна' : lang === 'de' ? 'Land' : 'Страна'}</th>
                    <th className="py-2.5 px-3 text-right">{lang === 'en' ? 'Sales / Year' : lang === 'uk' ? 'Продажі / рік' : lang === 'de' ? 'Absatz / Jahr' : 'Продажи / год'}</th>
                    <th className="py-2.5 px-3 text-right">{lang === 'en' ? 'World Share' : lang === 'uk' ? 'Частка ринку' : lang === 'de' ? 'Weltanteil' : 'Доля рынка'}</th>
                    <th className="py-2.5 px-3 text-right">{lang === 'en' ? 'Revenue' : lang === 'uk' ? 'Виручка' : lang === 'de' ? 'Umsatz' : 'Выручка'}</th>
                    <th className="py-2.5 px-3">{lang === 'en' ? 'Top Model' : lang === 'uk' ? 'Флагман' : lang === 'de' ? 'Spitzenmodell' : 'Флагман'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)]">
                  {getGlobalRankings(gameState).map((entry) => {
                    const countryDisplay = getCountryDisplay(entry.country ?? '', lang);
                    const rankMedal = entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : `#${entry.rank}`;
                    const sharePct = (entry.globalMarketShare * 100).toFixed(1);

                    return (
                      <tr
                        key={entry.companyId}
                        className={`transition-colors ${
                          entry.isPlayer
                            ? 'bg-[var(--surface-nested)] border-l-4 border-l-amber-500 font-bold shadow-2xs'
                            : 'hover:bg-[var(--surface-nested)]/50'
                        }`}
                      >
                        <td className="py-3 px-3 whitespace-nowrap">
                          <span className="font-mono font-bold text-sm flex items-center gap-1">
                            <span>{rankMedal}</span>
                          </span>
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[var(--ink-heading)]">
                              {entry.companyName}
                            </span>
                            {entry.isPlayer && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold era-badge-accent">
                                {lang === 'en' ? 'YOU' : lang === 'uk' ? 'ВИ' : lang === 'de' ? 'SIE' : 'ВЫ'}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap text-[var(--ink-secondary)]">
                          <span className="inline-flex items-center gap-1.5">
                            <span>{countryDisplay.flag}</span>
                            <span>{countryDisplay.name}</span>
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right whitespace-nowrap font-mono font-bold text-[var(--ink-value)]">
                          {entry.annualUnitsSold.toLocaleString()} {lang === 'en' ? 'cars' : lang === 'uk' ? 'авто' : lang === 'de' ? 'Fz.' : 'авто'}
                        </td>
                        <td className="py-3 px-3 text-right whitespace-nowrap font-mono">
                          <div className="inline-flex flex-col items-end">
                            <span className="font-bold text-[var(--ink-heading)]">{sharePct}%</span>
                            <div className="w-16 h-1 bg-[var(--surface-nested)] border border-[var(--border-subtle)] rounded-full overflow-hidden mt-0.5">
                              <div
                                className="h-full bg-amber-500"
                                style={{ width: `${Math.min(100, Math.max(4, Number(sharePct)))}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-right whitespace-nowrap font-mono font-bold text-emerald-400">
                          ${entry.annualRevenue.toLocaleString()}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap text-[var(--ink-secondary)]">
                          <span className="italic">
                            {entry.topModelName || '—'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* HISTORICAL TROPHIES & ACHIEVEMENTS SECTION */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-1.5">
              <h4 className="font-bold text-sm text-[var(--ink-heading)] era-heading flex items-center gap-2">
                <span>🎖️</span>
                <span>
                  {lang === 'en'
                    ? 'Historical Trophies & Industry Milestones'
                    : lang === 'uk'
                    ? 'Ордени та Досягнення промисловця'
                    : lang === 'de'
                    ? 'Historische Trophäen & Industrie-Erfolge'
                    : 'Ордена и Достижения автопромышленника'}
                </span>
              </h4>
              <span className="font-mono text-xs font-bold text-[var(--ink-secondary)]">
                {unlockedCount} / {totalCount} ({progressPercent}%)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {achievements.map((ach) => (
                <div
                  key={ach.id}
                  className={`rounded-xl border p-3.5 transition-all flex items-start gap-3 ${
                    ach.unlocked
                      ? 'border-[var(--border-brass)] bg-[var(--surface-nested)] shadow-xs'
                      : 'border-[var(--border-subtle)] bg-[var(--surface-nested)] opacity-40'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 shadow-2xs ${
                      ach.unlocked
                        ? 'bg-[var(--tag-bg)] border border-[var(--border-brass)] text-[var(--tag-text)]'
                        : 'bg-[var(--surface-nested)] text-[var(--ink-secondary)] border border-[var(--border-subtle)]'
                    }`}
                  >
                    {ach.icon}
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-bold text-xs text-[var(--ink-heading)] era-heading truncate">
                        {getAchievementTitle(ach)}
                      </span>
                      {ach.unlocked ? (
                        <span className="text-[10px] font-mono font-bold text-emerald-300 bg-emerald-950/40 border border-emerald-600/50 px-1.5 py-0.5 rounded">
                          {ach.unlockedAtYear ? `${ach.unlockedAtYear} г.` : '✓'}
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-[var(--ink-secondary)]">🔒</span>
                      )}
                    </div>
                    <p className="text-[11px] text-[var(--ink-secondary)] leading-snug">
                      {getAchievementDesc(ach)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SAVE & LOAD SECTION */}
          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-nested)] p-4 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">💾</span>
              <div>
                <h4 className="font-bold text-sm text-[var(--ink-heading)] era-heading">
                  {lang === 'en'
                    ? 'Game Save Management'
                    : lang === 'uk'
                    ? 'Експорт та Завантаження збереження'
                    : lang === 'de'
                    ? 'Spielstand-Verwaltung'
                    : 'Экспорт и Загрузка файла сохранения'}
                </h4>
                <p className="text-[11px] text-[var(--ink-secondary)]">
                  {lang === 'en'
                    ? 'Download your progress as a JSON file or restore a previous game at any time.'
                    : lang === 'uk'
                    ? 'Збережіть поточну кампанію у файл або завантажте раніше збережену гру в будь-який час.'
                    : lang === 'de'
                    ? 'Laden Sie Ihren Fortschritt als JSON-Datei herunter oder stellen Sie jederzeit ein früheres Spiel wieder her.'
                    : 'Сохраните текущую кампанию в файл на диск или загрузите ранее сохраненную игру.'}
                </p>
              </div>
            </div>

            {importMessage && (
              <div className="p-2.5 rounded-lg text-xs font-bold border border-[var(--border-brass)] bg-[var(--paper)] text-[var(--ink)]">
                {importMessage}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={handleExport}
                className="flex items-center gap-2 rounded-lg btn-brass text-white px-4 py-2 text-xs font-bold transition shadow-xs cursor-pointer"
              >
                <span>💾</span>
                <span>
                  {lang === 'en'
                    ? 'Export Save File (.json)'
                    : lang === 'uk'
                    ? 'Завантажити збереження (.json)'
                    : lang === 'de'
                    ? 'Spielstand exportieren (.json)'
                    : 'Скачать сохранение (.json)'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isImporting}
                className="flex items-center gap-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--paper)] hover:bg-[var(--surface-nested)] text-[var(--ink)] px-4 py-2 text-xs font-bold transition shadow-xs cursor-pointer disabled:opacity-50"
              >
                <span>📂</span>
                <span>
                  {isImporting
                    ? (lang === 'en' ? 'Loading...' : lang === 'uk' ? 'Завантаження...' : lang === 'de' ? 'Wird geladen...' : 'Загрузка...')
                    : (lang === 'en' ? 'Load Save File' : lang === 'uk' ? 'Завантажити файл гри' : lang === 'de' ? 'Spielstand importieren' : 'Загрузить файл сохранения')}
                </span>
              </button>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="shrink-0 border-t border-[var(--border-subtle)] bg-[var(--paper-card)] px-5 py-3 flex items-center justify-between">
          <span className="text-xs text-[var(--ink-secondary)] hidden sm:inline">
            {lang === 'en'
              ? 'Trophies are awarded automatically upon completing achievements.'
              : lang === 'uk'
              ? 'Досягнення фіксуються автоматично наприкінці кожного кварталу.'
              : lang === 'de'
              ? 'Trophäen werden automatisch bei Abschluss von Erfolgen vergeben.'
              : 'Достижения фиксируются автоматически в конце каждого квартала.'}
          </span>
          <button
            type="button"
            onClick={() => setHallOfFameOpen(false)}
            className="rounded-lg btn-brass px-5 py-2 text-xs font-bold text-white shadow-xs transition cursor-pointer ml-auto"
          >
            {lang === 'en' ? 'Close' : lang === 'uk' ? 'Закрити' : lang === 'de' ? 'Schließen' : 'Закрыть'}
          </button>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : null;
}
