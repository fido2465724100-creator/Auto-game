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
      <header className="border-b border-stone-300 pb-3">
        <h2 className="text-2xl font-bold tracking-tight text-amber-950">{t.bank.title}</h2>
        <p className="text-sm text-stone-600">{t.bank.subtitle}</p>
      </header>

      {statusMsg ? (
        <div
          className={`rounded border p-3 text-xs font-medium ${
            statusMsg.includes('Ошибка') || statusMsg.includes('Недостаточно') || statusMsg.includes('Insufficient')
              ? 'border-red-300 bg-red-50 text-red-700'
              : 'border-emerald-300 bg-emerald-50 text-emerald-800'
          }`}
        >
          {statusMsg}
        </div>
      ) : null}

      {/* NOTICE */}
      <div className="rounded border border-amber-300 bg-amber-50/70 p-3 text-xs text-amber-900 flex items-start gap-2">
        <span className="text-base">ℹ️</span>
        <p>{t.bank.warning}</p>
      </div>

      {/* 1. CURRENT LOANS */}
      <section className="space-y-3">
        <h3 className="text-lg font-bold text-amber-950 flex items-center gap-2">
          <span>📋</span> {t.bank.activeTitle} ({activeLoans.length})
        </h3>

        {activeLoans.length === 0 ? (
          <div className="rounded border border-stone-300 bg-[var(--paper)] p-6 text-center text-xs text-stone-600">
            {t.bank.noLoans}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {activeLoans.map((loan) => (
              <article key={loan.id} className="rounded border border-stone-300 bg-white p-4 shadow-xs space-y-3">
                <div className="flex justify-between items-start border-b border-stone-100 pb-2">
                  <h4 className="font-bold text-stone-900 text-sm">{loan.name}</h4>
                  <span className="text-[10px] font-semibold bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded">
                    {Math.round(loan.interestRate * 100 * 10) / 10}% / мес.
                  </span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-stone-500">{t.bank.remaining}:</span>
                    <span className="font-bold text-red-800">${loan.remainingPrincipal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">{t.bank.monthlyPayment}:</span>
                    <span className="font-semibold text-stone-800">${loan.monthlyPayment.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">{t.bank.remainingMonths}:</span>
                    <span className="font-semibold text-stone-800">
                      {loan.remainingMonths} / {loan.totalMonths} {t.bank.months}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={actionPending || currentCash < loan.remainingPrincipal}
                  onClick={() => void handleRepay(loan.id, loan.remainingPrincipal)}
                  className="w-full mt-2 rounded border border-emerald-700 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition disabled:opacity-50 cursor-pointer"
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
        <h3 className="text-lg font-bold text-amber-950 flex items-center gap-2">
          <span>💼</span> {t.bank.offersTitle}
        </h3>

        <div className="grid gap-4 md:grid-cols-3">
          {templates.map((tpl) => (
            <article key={tpl.id} className="rounded border border-stone-300 bg-[var(--paper)] p-5 shadow-sm flex flex-col justify-between space-y-4">
              <div>
                <h4 className="font-bold text-amber-950 text-base">
                  {t.loans[tpl.id]?.name ?? tpl.name}
                </h4>
                <p className="text-xs text-stone-600 mt-1 min-h-[36px]">
                  {t.loans[tpl.id]?.description ?? tpl.description}
                </p>
                <div className="my-3 border-t border-stone-200 pt-3 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-stone-500">{t.bank.amount}:</span>
                    <span className="font-bold text-emerald-800 text-sm">+${tpl.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">{t.bank.term}:</span>
                    <span className="font-semibold text-stone-800">{tpl.durationMonths} {t.bank.months}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">{t.bank.monthlyRate}:</span>
                    <span className="font-semibold text-stone-800">{Math.round(tpl.interestRate * 100 * 10) / 10}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">{t.bank.monthlyPayment}:</span>
                    <span className="font-bold text-amber-900">${tpl.monthlyPayment.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                disabled={actionPending}
                onClick={() => void handleTakeLoan(tpl.id)}
                className="w-full rounded bg-[var(--accent)] py-2 text-xs font-bold text-white shadow hover:bg-amber-900 transition disabled:opacity-60 cursor-pointer"
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
