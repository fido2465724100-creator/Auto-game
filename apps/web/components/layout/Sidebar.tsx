'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useGame } from '../../context/GameContext';
import { useLanguage } from '../../lib/i18n';

export function Sidebar(): React.JSX.Element {
  const pathname = usePathname();
  const { gameState } = useGame();
  const { t } = useLanguage();

  const companyName = gameState?.company.name ?? 'Anton Motor Works';

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
    <aside className="w-full md:w-64 shrink-0 border-r border-stone-300 bg-[var(--paper)] flex flex-col justify-between shadow-sm">
      <div>
        {/* BRAND & COMPANY HEADER */}
        <div className="p-5 border-b border-stone-200">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">⚙️</span>
            <div>
              <h1 className="font-bold text-base tracking-tight text-amber-950 leading-tight">
                {t.brand}
              </h1>
              <p className="text-[10px] text-stone-500 uppercase tracking-wider font-sans">
                Tycoon Simulation
              </p>
            </div>
          </div>

          <div className="mt-4 rounded border border-amber-800/20 bg-amber-50/60 p-2.5">
            <span className="block text-[10px] uppercase font-semibold text-stone-500 font-sans">
              Ваша компания
            </span>
            <span className="font-bold text-xs text-amber-950 truncate block">
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
                className={`flex items-center gap-3 px-3 py-2.5 rounded text-xs font-semibold transition ${
                  isActive
                    ? 'bg-amber-800 text-white shadow-xs font-bold'
                    : 'text-stone-700 hover:bg-amber-100/60 hover:text-amber-950'
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
      <div className="p-4 border-t border-stone-200 text-[11px] text-stone-500 text-center">
        <p>Auto Industry Tycoon</p>
        <p className="text-[10px] text-stone-400">1900 — 1930 MVP</p>
      </div>
    </aside>
  );
}
