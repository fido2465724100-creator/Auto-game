'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import GameGuideView from './views/GameGuideView';
import { useGame } from '../context/GameContext';

interface Props {
  isOpen?: boolean;
  onClose?: () => void;
}

export function GameGuideModal({ isOpen: propIsOpen, onClose: propOnClose }: Props = {}): React.JSX.Element | null {
  const { isGuideModalOpen, setGuideModalOpen } = useGame();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isOpen = propIsOpen !== undefined ? propIsOpen : isGuideModalOpen;
  const handleClose = propOnClose ?? (() => setGuideModalOpen(false));

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleClose]);

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      <div
        className="relative flex flex-col w-full max-w-5xl h-[88vh] max-h-[88vh] rounded-2xl border-2 border-[var(--border-brass)] bg-[var(--paper)] text-[var(--ink)] shadow-2xl overflow-hidden"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        {/* MODAL HEADER (PINNED AT TOP) */}
        <div className="shrink-0 flex items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--paper-card)] px-5 py-3.5 shadow-xs">
          <div className="flex items-center gap-3">
            <span className="text-2xl select-none">📖</span>
            <div>
              <h3 className="font-bold text-base text-[var(--ink-heading)] era-heading leading-tight">
                Руководство промышленника • Автомобильная империя (1900–2026)
              </h3>
              <p className="text-[11px] text-[var(--ink-secondary)]">
                Полный свод правил, формул и механик игры • 504 хода (126 лет)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--ink-secondary)] hover:text-[var(--ink)] hover:bg-[var(--surface-nested)] transition cursor-pointer text-lg font-bold leading-none"
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
        <div className="shrink-0 border-t border-[var(--border-subtle)] bg-[var(--paper-card)] px-5 py-3 flex items-center justify-between">
          <span className="text-xs text-[var(--ink-secondary)] hidden sm:inline">
            Нажмите ✕ или кнопку справа для возврата в кабинет
          </span>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg btn-brass px-5 py-2 text-xs font-bold text-white shadow-xs transition cursor-pointer ml-auto"
          >
            Вернуться за рабочий стол
          </button>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : null;
}
