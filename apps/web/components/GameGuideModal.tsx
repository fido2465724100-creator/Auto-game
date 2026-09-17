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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative flex flex-col w-full max-w-5xl max-h-[92vh] rounded-2xl border-2 border-amber-900/30 bg-[var(--bg)] shadow-2xl overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* MODAL HEADER */}
        <div className="flex items-center justify-between border-b border-stone-300 bg-[var(--paper)] px-6 py-3.5">
          <div className="flex items-center gap-2">
            <span className="text-xl">📖</span>
            <h3 className="font-serif font-bold text-base text-amber-950">
              Руководство промышленника • Автомобильная империя (1900–2026)
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-stone-500 hover:bg-stone-200 hover:text-stone-800 transition cursor-pointer text-sm font-bold"
            title="Закрыть (Esc)"
          >
            ✕
          </button>
        </div>

        {/* MODAL BODY (SCROLLABLE) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <GameGuideView />
        </div>

        {/* MODAL FOOTER */}
        <div className="border-t border-stone-300 bg-[var(--paper)] px-6 py-3 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-amber-900 px-5 py-2 text-xs font-serif font-bold text-white shadow-xs hover:bg-amber-950 transition cursor-pointer"
          >
            Вернуться за рабочий стол
          </button>
        </div>
      </div>
    </div>
  );
}
