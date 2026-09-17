'use client';

import React from 'react';
import GameGuideView from './views/GameGuideView';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function GameGuideModal({ isOpen, onClose }: Props): React.JSX.Element | null {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-950/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative flex flex-col w-full max-w-5xl h-[88vh] max-h-[88vh] rounded-2xl border-2 border-amber-900/40 bg-[var(--bg)] shadow-2xl overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* MODAL HEADER (PINNED AT TOP) */}
        <div className="shrink-0 flex items-center justify-between border-b border-stone-300 bg-[var(--paper)] px-5 py-3 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">📖</span>
            <div>
              <h3 className="font-serif font-bold text-base text-amber-950 leading-tight">
                Руководство промышленника • Автомобильная империя (1900–2026)
              </h3>
              <p className="text-[11px] text-stone-500 font-serif">
                Полный свод правил, формул и механик игры • 504 хода (126 лет)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-stone-500 hover:bg-stone-200 hover:text-stone-900 transition cursor-pointer text-base font-bold leading-none"
            title="Закрыть (Esc)"
          >
            ✕
          </button>
        </div>

        {/* MODAL BODY (SCROLLABLE WITH MIN-H-0) */}
        <div className="flex-1 min-h-0 overflow-y-auto p-3 sm:p-5">
          <GameGuideView isModal={true} />
        </div>

        {/* MODAL FOOTER (PINNED AT BOTTOM) */}
        <div className="shrink-0 border-t border-stone-300 bg-[var(--paper)] px-5 py-2.5 flex items-center justify-between">
          <span className="text-xs text-stone-500 font-serif hidden sm:inline">
            Нажмите ✕ или кнопку справа для возврата в кабинет
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-amber-900 px-5 py-2 text-xs font-serif font-bold text-white shadow-xs hover:bg-amber-950 transition cursor-pointer ml-auto"
          >
            Вернуться за рабочий стол
          </button>
        </div>
      </div>
    </div>
  );
}
