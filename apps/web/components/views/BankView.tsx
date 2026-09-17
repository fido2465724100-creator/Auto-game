'use client';

import { useEffect, useState } from 'react';
import type { LoanTemplate } from '@ait/shared-types';
import { useGame } from '../../context/GameContext';
import { useLanguage } from '../../lib/i18n';
import { api } from '../../lib/api';

export default function BankPage(): React.JSX.Element {
  const { gameState, takeLoan, repayLoan } = useGame();
  const { t } = useLanguage();
  const [templates, setTemplates] = useState<LoanTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [actionPending, setActionPending] = useState(false);

  useEffect(() => {
    api.getLoanTemplates()
      .then(setTemplates)
      .catch(() => setTemplates([]))
      .finally(() => setLoading(false));
  }, []);

  const activeLoans = gameState?.company.loans ?? [];
  const currentCash = gameState?.company.cash ?? 0;

  const handleTakeLoan = async (templateId: string): Promise<void> => {
    setActionPending(true);
    setStatusMsg(null);
    try {
      await takeLoan(templateId);
      setStatusMsg(t.bank.loanTaken);
    } catch (err) {
      setStatusMsg(`Ошибка: ${String(err)}`);
    } finally {
      setActionPending(false);
    }
  };

  const handleRepay = async (loanId: string, remainingPrincipal: number): Promise<void> => {
    if (currentCash < remainingPrincipal) {
      setStatusMsg(t.bank.insufficientFunds);
      return;
    }

    setActionPending(true);
    setStatusMsg(null);
    try {
      await repayLoan(loanId);
      setStatusMsg(t.bank.loanRepaid);
    } catch (err) {
      setStatusMsg(`Ошибка: ${String(err)}`);
    } finally {
      setActionPending(false);
    }
  };

  if (loading) {
    return <p className="py-8 text-center text-stone-600">Загрузка банковских программ...</p>;
  }

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <header className="border-b border-[var(--border-subtle)] pb-3">
        <h2 className="text-2xl font-bold tracking-tight text-[var(--ink-heading)] era-heading">{t.bank.title}</h2>
        <p className="text-sm text-[var(--ink-secondary)]">{t.bank.subtitle}</p>
      </header>

      {statusMsg ? (
        <div
          className={`rounded-lg border p-3 text-xs font-medium ${
            statusMsg.includes('Ошибка') || statusMsg.includes('Недостаточно') || statusMsg.includes('Insufficient')
              ? 'border-rose-500/60 bg-rose-950/20 text-rose-300'
              : 'border-emerald-500/60 bg-emerald-950/20 text-emerald-300'
          }`}
        >
          {statusMsg}
        </div>
      ) : null}

      {/* NOTICE */}
      <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-nested)] p-3 text-xs text-[var(--ink)] flex items-start gap-2">
        <span className="text-base">ℹ️</span>
        <p>{t.bank.warning}</p>
      </div>

      {/* 1. CURRENT LOANS */}
      <section className="space-y-3">
        <h3 className="text-lg font-bold text-[var(--ink-heading)] era-heading flex items-center gap-2">
          <span>📋</span> {t.bank.activeTitle} ({activeLoans.length})
        </h3>

        {activeLoans.length === 0 ? (
          <div className="era-card p-6 text-center text-xs text-[var(--ink-secondary)]">
            {t.bank.noLoans}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {activeLoans.map((loan) => (
              <article key={loan.id} className="era-card p-4 shadow-xs space-y-3">
                <div className="flex justify-between items-start border-b border-[var(--border-subtle)] pb-2">
                  <h4 className="font-bold text-[var(--ink-heading)] text-sm">{loan.name}</h4>
                  <span className="text-[10px] font-semibold era-badge-accent px-1.5 py-0.5 rounded">
                    {Math.round(loan.interestRate * 100 * 10) / 10}% / мес.
                  </span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[var(--ink-secondary)]">{t.bank.remaining}:</span>
                    <span className="font-bold text-rose-500">${loan.remainingPrincipal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--ink-secondary)]">{t.bank.monthlyPayment}:</span>
                    <span className="font-semibold text-[var(--ink)]">${loan.monthlyPayment.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--ink-secondary)]">{t.bank.remainingMonths}:</span>
                    <span className="font-semibold text-[var(--ink)]">
                      {loan.remainingMonths} / {loan.totalMonths} {t.bank.months}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={actionPending || currentCash < loan.remainingPrincipal}
                  onClick={() => void handleRepay(loan.id, loan.remainingPrincipal)}
                  className="w-full mt-2 rounded-lg border border-emerald-600 bg-emerald-600/20 px-3 py-1.5 text-xs font-bold text-emerald-300 hover:bg-emerald-600/30 transition disabled:opacity-40 cursor-pointer"
                >
                  {t.bank.repayLoan} (${loan.remainingPrincipal.toLocaleString()})
                </button>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* 2. AVAILABLE OFFERS */}
      <section className="space-y-3">
        <h3 className="text-lg font-bold text-[var(--ink-heading)] era-heading flex items-center gap-2">
          <span>💼</span> {t.bank.offersTitle}
        </h3>

        <div className="grid gap-4 md:grid-cols-3">
          {templates.map((tpl) => (
            <article key={tpl.id} className="era-card p-5 shadow-sm flex flex-col justify-between space-y-4">
              <div>
                <h4 className="font-bold text-[var(--ink-heading)] era-heading text-base">
                  {t.loans[tpl.id]?.name ?? tpl.name}
                </h4>
                <p className="text-xs text-[var(--ink-secondary)] mt-1 min-h-[36px]">
                  {t.loans[tpl.id]?.description ?? tpl.description}
                </p>
                <div className="my-3 border-t border-[var(--border-subtle)] pt-3 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[var(--ink-secondary)]">{t.bank.amount}:</span>
                    <span className="font-bold text-emerald-400 text-sm font-mono">+${tpl.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--ink-secondary)]">{t.bank.term}:</span>
                    <span className="font-semibold text-[var(--ink)]">{tpl.durationMonths} {t.bank.months}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--ink-secondary)]">{t.bank.monthlyRate}:</span>
                    <span className="font-semibold text-[var(--ink)]">{Math.round(tpl.interestRate * 100 * 10) / 10}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--ink-secondary)]">{t.bank.monthlyPayment}:</span>
                    <span className="font-bold text-[var(--ink-value)]">${tpl.monthlyPayment.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                disabled={actionPending}
                onClick={() => void handleTakeLoan(tpl.id)}
                className="w-full rounded-lg btn-brass py-2 text-xs font-bold text-white shadow transition disabled:opacity-50 cursor-pointer"
              >
                {t.bank.takeLoan}
              </button>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
