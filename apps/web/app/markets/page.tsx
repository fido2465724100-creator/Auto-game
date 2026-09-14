'use client';

import { useEffect, useState } from 'react';
import type { Region } from '@ait/shared-types';
import { useGame } from '../../context/GameContext';
import { useLanguage } from '../../lib/i18n';
import { api } from '../../lib/api';

const REGION_FLAGS: Record<string, { flag: string; ru: string; en: string }> = {
  'north-america': { flag: '🇺🇸', ru: 'Северная Америка', en: 'North America' },
  europe: { flag: '🇪🇺', ru: 'Европа', en: 'Europe' },
  'middle-east': { flag: '🌍', ru: 'Ближний Восток', en: 'Middle East' },
};

export default function MarketsPage(): React.JSX.Element {
  const { gameState } = useGame();
  const { t, lang } = useLanguage();
  const [regions, setRegions] = useState<Region[]>([]);

  useEffect(() => {
    api.getRegions().then(setRegions).catch(() => setRegions([]));
  }, []);

  const presence = gameState?.company.marketPresence ?? {
    'north-america': 0,
    europe: 0,
    'middle-east': 0,
  };

  return (
    <div className="space-y-6">
      <header className="border-b border-stone-300 pb-3">
        <h2 className="text-2xl font-bold tracking-tight text-amber-950">{t.markets.title}</h2>
        <p className="text-sm text-stone-600">{t.markets.subtitle}</p>
      </header>

      <div className="grid gap-6 md:grid-cols-3">
        {regions.map((region) => {
          const meta = REGION_FLAGS[region.id] ?? { flag: '🌐', ru: region.name, en: region.name };
          const regionName = lang === 'ru' ? meta.ru : meta.en;
          const share = Math.round((presence[region.id] ?? 0) * 100);

          return (
            <article
              key={region.id}
              className="rounded border border-stone-300 bg-[var(--paper)] p-5 shadow-sm space-y-4"
            >
              <div className="flex justify-between items-start border-b border-stone-200 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{meta.flag}</span>
                  <h3 className="font-bold text-amber-950 text-base">{regionName}</h3>
                </div>
                <span className="rounded bg-amber-100 text-amber-900 px-2 py-0.5 text-xs font-bold">
                  Доля: {share}%
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-stone-500">{t.markets.size}:</span>
                  <span className="font-bold text-stone-900">
                    {region.marketSize.toLocaleString()} {t.markets.units}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">{t.markets.priceSensitivity}:</span>
                  <span className="font-semibold text-stone-800">
                    {Math.round(region.priceSensitivity * 100)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">{t.markets.prestigeSensitivity}:</span>
                  <span className="font-semibold text-stone-800">
                    {Math.round(region.prestigeSensitivity * 100)}%
                  </span>
                </div>
              </div>

              {/* Preferences breakdown */}
              <div className="border-t border-stone-200 pt-3 space-y-1.5 text-[11px]">
                <span className="font-semibold text-stone-600 block mb-1">
                  Предпочтения покупателей региона:
                </span>
                <div className="space-y-1 text-stone-700">
                  <div className="flex justify-between">
                    <span>Комфорт:</span>
                    <span className="font-semibold">{Math.round(region.preferenceWeights.comfort * 100)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Экономичность:</span>
                    <span className="font-semibold">{Math.round(region.preferenceWeights.efficiency * 100)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Скорость / Мощность:</span>
                    <span className="font-semibold">{Math.round(region.preferenceWeights.performance * 100)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Престиж:</span>
                    <span className="font-semibold">{Math.round(region.preferenceWeights.prestige * 100)}%</span>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
