'use client';

import { useState } from 'react';
import type { CountryId, FounderPerk } from '@ait/shared-types';
import { useGame } from '../context/GameContext';
import { useLanguage } from '../lib/i18n';

const BADGE_SHAPES = [
  { id: 'circle', label: 'Круг / Circle', class: 'rounded-full' },
  { id: 'shield', label: 'Щит / Shield', class: 'rounded-b-3xl rounded-t-lg' },
  { id: 'diamond', label: 'Ромб / Diamond', class: 'rotate-45 rounded-lg' },
  { id: 'hexagon', label: 'Октагон / Octagon', class: 'rounded-2xl' },
];

const BADGE_COLORS = [
  { id: '#b45309', label: 'Янтарь', hex: '#b45309' },
  { id: '#831843', label: 'Бордо', hex: '#831843' },
  { id: '#1e3a8a', label: 'Кобальт', hex: '#1e3a8a' },
  { id: '#14532d', label: 'Малахит', hex: '#14532d' },
  { id: '#475569', label: 'Сталь', hex: '#475569' },
  { id: '#18181b', label: 'Воронение', hex: '#18181b' },
];

const BADGE_ICONS = [
  { id: '⚙️', label: 'Шестерня' },
  { id: '🦅', label: 'Орел' },
  { id: '🦁', label: 'Лев' },
  { id: '🛞', label: 'Колесо' },
  { id: '⭐', label: 'Звезда' },
  { id: '⚡', label: 'Молния' },
  { id: '👑', label: 'Корона' },
  { id: '🛡️', label: 'Герб' },
];

export function CompanySetupModal(): React.JSX.Element | null {
  const { gameState, isSetupModalOpen, setSetupModalOpen, setupCompany, resetGame } = useGame();
  const { t } = useLanguage();

  const [name, setName] = useState(gameState?.company.name ?? 'Pioneer Motor Works');
  const [country, setCountry] = useState<CountryId>(gameState?.company.country ?? 'usa');
  const [perk, setPerk] = useState<FounderPerk>(gameState?.company.founderPerk ?? 'mechanic');
  const [badgeShape, setBadgeShape] = useState(gameState?.company.badge?.shape ?? 'circle');
  const [badgeColor, setBadgeColor] = useState(gameState?.company.badge?.color ?? '#b45309');
  const [badgeIcon, setBadgeIcon] = useState(gameState?.company.badge?.icon ?? '⚙️');
  const [saving, setSaving] = useState(false);

  if (!isSetupModalOpen) {
    return null;
  }

  const handleSaveOnly = async () => {
    setSaving(true);
    try {
      await setupCompany({
        name: name.trim() || 'Pioneer Motor Works',
        country,
        founderPerk: perk,
        badge: {
          icon: badgeIcon,
          color: badgeColor,
          shape: badgeShape,
        },
      });
      setSetupModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleStartFresh = async () => {
    if (!window.confirm('Начать новую кампанию с 1900 Q1 с выбранными настройками? Текущий прогресс будет перезапущен.')) {
      return;
    }
    setSaving(true);
    try {
      await resetGame({
        name: name.trim() || 'Pioneer Motor Works',
        country,
        founderPerk: perk,
        badge: {
          icon: badgeIcon,
          color: badgeColor,
          shape: badgeShape,
        },
      });
      setSetupModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const countryKeys: CountryId[] = ['usa', 'germany', 'france', 'uk'];
  const perkKeys: FounderPerk[] = ['mechanic', 'merchant', 'coachbuilder'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-zinc-900 border border-amber-900/60 rounded-xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="border-b border-amber-900/40 bg-gradient-to-r from-amber-950/40 via-zinc-900 to-amber-950/20 px-6 py-5 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">📜</span>
              <h2 className="text-xl font-serif font-bold text-amber-200 tracking-wide">
                {t.companySetup.title}
              </h2>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              {t.companySetup.subtitle}
            </p>
          </div>
          <button
            onClick={() => setSetupModalOpen(false)}
            className="text-zinc-400 hover:text-white text-lg p-1.5 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Company Name & Badge Live Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-zinc-950/60 border border-zinc-800 p-5 rounded-lg">
            <div className="md:col-span-2 space-y-3">
              <label className="block text-xs font-medium text-amber-300 uppercase tracking-wider">
                {t.companySetup.nameLabel}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.companySetup.namePlaceholder}
                className="w-full bg-zinc-900 border border-amber-900/50 rounded-lg px-4 py-2.5 text-base font-serif text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
              />
              <p className="text-xs text-zinc-400">
                Кустарная мануфактура 1900 года. Стартовая квота: 2–4 автомобиля в квартал (10–15 авто в год).
              </p>
            </div>

            {/* Badge Preview */}
            <div className="flex flex-col items-center justify-center p-3 border border-amber-900/30 bg-zinc-900/50 rounded-lg">
              <div className="text-xs text-zinc-400 mb-2 font-medium">Шильдик марки:</div>
              <div
                className={`w-16 h-16 flex items-center justify-center shadow-lg border-2 border-amber-300/40 transition-all ${
                  BADGE_SHAPES.find((s) => s.id === badgeShape)?.class ?? 'rounded-full'
                }`}
                style={{ backgroundColor: badgeColor }}
              >
                <span className={`text-2xl select-none ${badgeShape === 'diamond' ? '-rotate-45' : ''}`}>
                  {badgeIcon}
                </span>
              </div>
              <div className="mt-2 text-xs font-serif font-bold text-amber-200 text-center truncate max-w-[150px]">
                {name || 'Pioneer Motor'}
              </div>
            </div>
          </div>

          {/* Badge Designer Controls */}
          <div className="bg-zinc-950/40 border border-zinc-800 p-4 rounded-lg space-y-4">
            <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
              <span>🛡️</span> {t.companySetup.badgeLabel}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Shape */}
              <div>
                <label className="text-xs text-zinc-400 block mb-1.5">{t.companySetup.badgeShape}:</label>
                <div className="grid grid-cols-2 gap-2">
                  {BADGE_SHAPES.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setBadgeShape(s.id)}
                      className={`text-xs py-1.5 px-2 rounded border text-left truncate transition-colors ${
                        badgeShape === s.id
                          ? 'border-amber-500 bg-amber-500/20 text-amber-200 font-medium'
                          : 'border-zinc-700 bg-zinc-900 text-zinc-300 hover:border-zinc-600'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color */}
              <div>
                <label className="text-xs text-zinc-400 block mb-1.5">{t.companySetup.badgeColor}:</label>
                <div className="flex flex-wrap gap-2">
                  {BADGE_COLORS.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setBadgeColor(c.hex)}
                      className={`w-7 h-7 rounded-full border-2 transition-transform ${
                        badgeColor === c.hex ? 'border-amber-300 scale-110 shadow' : 'border-zinc-700 hover:scale-105'
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.label}
                    />
                  ))}
                </div>
              </div>

              {/* Icon */}
              <div>
                <label className="text-xs text-zinc-400 block mb-1.5">{t.companySetup.badgeIcon}:</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {BADGE_ICONS.map((ic) => (
                    <button
                      key={ic.id}
                      type="button"
                      onClick={() => setBadgeIcon(ic.id)}
                      className={`text-base p-1.5 rounded border text-center transition-colors ${
                        badgeIcon === ic.id
                          ? 'border-amber-500 bg-amber-500/20'
                          : 'border-zinc-800 bg-zinc-900 hover:border-zinc-700'
                      }`}
                    >
                      {ic.id}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Founding Country */}
          <div>
            <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider mb-2">
              {t.companySetup.countryLabel}
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {countryKeys.map((cid) => {
                const cinfo = t.countries[cid];
                const isSelected = country === cid;
                return (
                  <button
                    key={cid}
                    type="button"
                    onClick={() => setCountry(cid)}
                    className={`p-3.5 rounded-lg border text-left transition-all ${
                      isSelected
                        ? 'border-amber-500 bg-amber-950/30 shadow-md ring-1 ring-amber-500/50'
                        : 'border-zinc-800 bg-zinc-950/60 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{cinfo.flag}</span>
                      <span className="font-medium text-sm text-zinc-100">{cinfo.name}</span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                      {cinfo.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Founder Perk */}
          <div>
            <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider mb-2">
              {t.companySetup.perkLabel}
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {perkKeys.map((pid) => {
                const pinfo = t.founderPerks[pid];
                const isSelected = perk === pid;
                return (
                  <button
                    key={pid}
                    type="button"
                    onClick={() => setPerk(pid)}
                    className={`p-3.5 rounded-lg border text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-amber-500 bg-amber-950/30 shadow-md ring-1 ring-amber-500/50'
                        : 'border-zinc-800 bg-zinc-950/60 hover:border-zinc-700'
                    }`}
                  >
                    <div>
                      <span className="inline-block text-xs px-2 py-0.5 rounded bg-amber-900/40 text-amber-300 font-medium mb-1.5">
                        {pinfo.badge}
                      </span>
                      <div className="font-medium text-sm text-zinc-100">{pinfo.name}</div>
                      <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                        {pinfo.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-zinc-800 bg-zinc-950 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            disabled={saving}
            onClick={handleStartFresh}
            className="w-full sm:w-auto text-xs px-4 py-2 rounded-lg border border-red-900/60 text-red-300 hover:bg-red-950/40 transition-colors"
          >
            🔄 Начать новую игру с 1900 Q1
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={() => setSetupModalOpen(false)}
              className="text-xs px-4 py-2 rounded-lg border border-zinc-700 text-zinc-300 hover:bg-zinc-800 transition-colors"
            >
              Отмена
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={handleSaveOnly}
              className="text-xs font-medium px-5 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-zinc-950 font-bold transition-colors shadow-lg shadow-amber-900/30"
            >
              {saving ? 'Сохранение...' : 'Применить настройки марки'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
