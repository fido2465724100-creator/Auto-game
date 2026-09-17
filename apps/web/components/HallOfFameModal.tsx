'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useGame } from '../context/GameContext';
import { useLanguage } from '../lib/i18n';
import type { Achievement } from '@ait/shared-types';

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
      setImportMessage(lang === 'en' ? 'Game save successfully restored!' : 'Сохранение успешно загружено!');
      setTimeout(() => setImportMessage(null), 4000);
    } catch (err) {
      console.error(err);
      setImportMessage(lang === 'en' ? 'Error: Invalid save file' : 'Ошибка: Неверный формат файла сохранения');
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
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
        <div className="shrink-0 flex items-center justify-between border-b border-stone-300 bg-[var(--paper)] px-5 py-3.5 shadow-xs">
          <div className="flex items-center gap-3">
            <span className="text-2xl select-none">🏆</span>
            <div>
              <h3 className="font-serif font-bold text-base text-amber-950 leading-tight">
                {lang === 'en'
                  ? 'Hall of Fame & Dynasty Achievements'
                  : 'Зал Славы и Достижения автопромышленника'}
              </h3>
              <p className="text-[11px] text-stone-500 font-serif">
                {lang === 'en'
                  ? 'Historical milestones, trophy showcase and game save management (1900–2026)'
                  : 'Хроника эпохи, витрина наград и управление файлами сохранений'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setHallOfFameOpen(false)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-stone-500 hover:text-stone-900 hover:bg-stone-200 transition cursor-pointer text-lg font-bold leading-none"
            title="Закрыть (Esc)"
          >
            ✕
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* DYNASTY 2026 VICTORY BANNER (IF REACHED) */}
          {isDynastyComplete && (
            <div className="rounded-xl border-2 border-amber-600/60 bg-gradient-to-r from-amber-100 via-amber-50 to-amber-100 p-5 shadow-md">
              <div className="flex items-center gap-4">
                <span className="text-4xl">👑</span>
                <div className="space-y-1">
                  <h4 className="font-serif font-bold text-lg text-amber-950">
                    {lang === 'en'
                      ? 'Century Triumph: 126 Years Completed!'
                      : 'Великий Триумф: 126 лет истории пройдены!'}
                  </h4>
                  <p className="text-xs text-stone-700 leading-relaxed font-serif">
                    {lang === 'en'
                      ? `Your company ${gameState?.company.name} successfully traversed 504 quarters from a modest 1900 workshop to the modern era of 2026.`
                      : `Ваш автомобильный концерн «${gameState?.company.name}» успешно прошел все 504 хода сквозь войны, Великую депрессию, нефтяной шок и встретил 2026 год великой индустриальной империей!`}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* QUICK DYNASTY METRICS */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl border border-stone-300 bg-[var(--paper)] p-3 shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-stone-500 block">
                {lang === 'en' ? 'Liquid Capital' : 'Свободный капитал'}
              </span>
              <span className="text-base font-mono font-bold text-emerald-800">
                ${(gameState?.company.cash ?? 0).toLocaleString()}
              </span>
            </div>
            <div className="rounded-xl border border-stone-300 bg-[var(--paper)] p-3 shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-stone-500 block">
                {lang === 'en' ? 'Brand Reputation' : 'Репутация марки'}
              </span>
              <span className="text-base font-serif font-bold text-amber-900">
                ★ {gameState?.company.reputation ?? 0}
              </span>
            </div>
            <div className="rounded-xl border border-stone-300 bg-[var(--paper)] p-3 shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-stone-500 block">
                {lang === 'en' ? 'Current Era' : 'Эпоха / Год'}
              </span>
              <span className="text-base font-serif font-bold text-stone-800">
                {year} г. (Q{quarter})
              </span>
            </div>
            <div className="rounded-xl border border-stone-300 bg-[var(--paper)] p-3 shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-stone-500 block">
                {lang === 'en' ? 'Achievements' : 'Трофеи открыты'}
              </span>
              <span className="text-base font-mono font-bold text-amber-950">
                {unlockedCount} / {totalCount} ({progressPercent}%)
              </span>
            </div>
          </div>

          {/* PROGRESS BAR */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-serif font-bold text-stone-700">
              <span>{lang === 'en' ? 'Dynasty Progression' : 'Индустриальный прогресс наград'}</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="h-2 w-full bg-stone-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-600 via-amber-700 to-amber-900 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* ACHIEVEMENTS GRID */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-amber-950 flex items-center gap-2 border-b border-stone-300 pb-1.5">
              <span>🎖️</span>
              <span>{lang === 'en' ? 'Historical Trophies' : 'Ордена и Достижения'}</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {achievements.map((ach) => (
                <div
                  key={ach.id}
                  className={`rounded-xl border p-3.5 transition-all flex items-start gap-3 ${
                    ach.unlocked
                      ? 'border-amber-700/40 bg-amber-50/80 shadow-xs'
                      : 'border-stone-300 bg-stone-100/60 opacity-65'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 shadow-2xs ${
                      ach.unlocked
                        ? 'bg-gradient-to-br from-amber-200 to-amber-400 border border-amber-500'
                        : 'bg-stone-200 text-stone-400 border border-stone-300'
                    }`}
                  >
                    {ach.icon}
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-serif font-bold text-xs text-amber-950 truncate">
                        {lang === 'en' ? ach.titleEn : ach.titleRu}
                      </span>
                      {ach.unlocked ? (
                        <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100/70 border border-emerald-300 px-1.5 py-0.5 rounded">
                          {ach.unlockedAtYear ? `${ach.unlockedAtYear} Q${ach.unlockedAtQuarter ?? 1}` : '✓'}
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-stone-500">🔒</span>
                      )}
                    </div>
                    <p className="text-[11px] text-stone-600 leading-snug">
                      {lang === 'en' ? ach.descriptionEn : ach.descriptionRu}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SAVE & LOAD SECTION */}
          <div className="rounded-xl border border-stone-300 bg-[var(--paper)] p-4 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">💾</span>
              <div>
                <h4 className="font-serif font-bold text-sm text-amber-950">
                  {lang === 'en' ? 'Game Save Management' : 'Экспорт и Загрузка файла сохранения'}
                </h4>
                <p className="text-[11px] text-stone-500 font-serif">
                  {lang === 'en'
                    ? 'Download your progress as a JSON file or restore a previous game at any time.'
                    : 'Сохраните текущую кампанию в файл на диск или загрузите ранее сохраненную игру.'}
                </p>
              </div>
            </div>

            {importMessage && (
              <div className="p-2.5 rounded-lg text-xs font-serif font-bold border border-amber-300 bg-amber-50 text-amber-950">
                {importMessage}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={handleExport}
                className="flex items-center gap-2 rounded-lg bg-amber-900 hover:bg-amber-950 text-white px-4 py-2 text-xs font-serif font-bold transition shadow-xs cursor-pointer"
              >
                <span>💾</span>
                <span>{lang === 'en' ? 'Export Save File (.json)' : 'Скачать сохранение (.json)'}</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isImporting}
                className="flex items-center gap-2 rounded-lg border border-amber-900/40 bg-white hover:bg-amber-50 text-amber-950 px-4 py-2 text-xs font-serif font-bold transition shadow-xs cursor-pointer disabled:opacity-50"
              >
                <span>📂</span>
                <span>{isImporting ? 'Загрузка...' : lang === 'en' ? 'Load Save File' : 'Загрузить файл сохранения'}</span>
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
        <div className="shrink-0 border-t border-stone-300 bg-[var(--paper)] px-5 py-3 flex items-center justify-between">
          <span className="text-xs text-stone-500 font-serif hidden sm:inline">
            {lang === 'en'
              ? 'Trophies are awarded automatically upon completing achievements.'
              : 'Достижения фиксируются автоматически в конце каждого квартала.'}
          </span>
          <button
            type="button"
            onClick={() => setHallOfFameOpen(false)}
            className="rounded-lg bg-amber-900 px-5 py-2 text-xs font-serif font-bold text-white shadow-xs hover:bg-amber-950 transition cursor-pointer ml-auto"
          >
            {lang === 'en' ? 'Close' : 'Закрыть'}
          </button>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : null;
}
