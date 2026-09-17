'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useGame } from '../../context/GameContext';
import { useLanguage } from '../../lib/i18n';
import { EraEmblem } from '../EraEmblem';
import { getEraId } from '../../lib/eraTheme';

export function Sidebar(): React.JSX.Element {
  const pathname = usePathname();
  const { gameState } = useGame();
  const { t } = useLanguage();

  const companyName = gameState?.company.name ?? 'Anton Motor Works';
  const eraId = gameState?.date.year ? getEraId(gameState.date.year) : 'era-1900';

  const menuItems = [
    { href: '/dashboard', label: t.nav.dashboard, icon: '🏛️' },
    { href: '/vehicle-design', label: t.nav.vehicleDesign, icon: '🚗' },
    { href: '/production', label: t.nav.production, icon: '🏭' },
    { href: '/research', label: t.nav.research, icon: '🔬' },
    { href: '/markets', label: t.nav.markets, icon: '🌐' },
    { href: '/bank', label: t.nav.bank, icon: '🏦' },
    { href: '/reports', label: t.nav.reports, icon: '📜' },
  ] as const;

  return (
    <aside className="w-full md:w-64 shrink-0 border-r border-[var(--border-subtle)] bg-[var(--paper)] flex flex-col justify-between shadow-sm transition-colors">
      <div>
        {/* BRAND & COMPANY HEADER */}
        <div className="p-5 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-3 mb-1">
            <EraEmblem eraId={eraId} size={30} className="shrink-0 drop-shadow-xs" />
            <div>
              <h1 className="font-bold text-base tracking-tight text-[var(--ink-heading)] era-heading leading-tight">
                {t.brand}
              </h1>
              <p className="text-[10px] text-[var(--ink-secondary)] uppercase tracking-wider font-sans">
                Tycoon Simulation
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-nested)] p-2.5">
            <span className="block text-[10px] uppercase font-semibold text-[var(--ink-secondary)] font-sans">
              {t.brandCompany}
            </span>
            <span className="font-bold text-xs text-[var(--ink-heading)] truncate block">
              {companyName}
            </span>
          </div>
        </div>

        {/* NAVIGATION LINKS */}
        <nav className="p-3 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition ${
                  isActive
                    ? 'btn-brass text-white shadow-xs font-bold'
                    : 'text-[var(--ink)] hover:bg-[var(--surface-nested)] hover:text-[var(--accent-gold)]'
                }`}
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* FOOTER INFO */}
      <div className="p-4 border-t border-[var(--border-subtle)] text-[11px] text-[var(--ink-secondary)] text-center">
        <p className="font-semibold">Auto Industry Tycoon</p>
        <p className="text-[10px] opacity-70">1900 — 2025</p>
      </div>
    </aside>
  );
}
