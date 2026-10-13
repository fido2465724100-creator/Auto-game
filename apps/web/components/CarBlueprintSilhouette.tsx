'use client';

import React, { useState } from 'react';
import type { VehicleSegment } from '@ait/shared-types';
import { useLanguage } from '../lib/i18n';
import { getDecadeIndex } from './CarVisualThumbnail';

interface Props {
  segment: VehicleSegment;
  powertrain?: 'steam' | 'electric' | 'ice';
  className?: string;
  accentColor?: string;
  year?: number;
}

export function CarBlueprintSilhouette({
  segment,
  powertrain = 'ice',
  className = '',
  year = 1900,
}: Props): React.JSX.Element {
  const { lang, t } = useLanguage();
  const [imgError, setImgError] = useState(false);

  const decade = getDecadeIndex(year);
  const isGhPages = typeof window !== 'undefined' && window.location.pathname.startsWith('/Auto-game');
  const base = isGhPages ? '/Auto-game' : '';
  const photoUrl = `${base}/cars/${segment}-d${decade}.jpg`;
  const fallbackUrl = `${base}/cars/d${decade}.jpg`;

  // View mode: 'combined' (CAD Grid + Realistic Render), 'render_only' (Just realistic car), 'draft_only' (Pure wireframe blueprint)
  const [viewMode, setViewMode] = useState<'combined' | 'render_only' | 'draft_only'>('combined');

  // Blueprint paper theme: 'blueprint' (Cyan Engineer Drafting) or 'patent' (Antique Sepia Parchment)
  const [theme, setTheme] = useState<'blueprint' | 'patent'>('blueprint');

  const isBlueprint = theme === 'blueprint';
  const showDraft = viewMode === 'combined' || viewMode === 'draft_only';
  const showRender = viewMode === 'combined' || viewMode === 'render_only';

  // Determine historical design aesthetic era based on vehicle design year
  const era: 'pioneer' | 'art_deco' | 'classic_fins' | 'aero_wedge' | 'modern' =
    year < 1919
      ? 'pioneer'
      : year < 1945
      ? 'art_deco'
      : year < 1975
      ? 'classic_fins'
      : year < 2005
      ? 'aero_wedge'
      : 'modern';

  // Dimension figures by era and segment (in millimeters)
  const dimensionsByEra = {
    pioneer: {
      economy: { length: 3150, wheelbase: 2150, height: 1540, clearance: 220 },
      family: { length: 3850, wheelbase: 2650, height: 1620, clearance: 205 },
      luxury: { length: 4420, wheelbase: 3100, height: 1780, clearance: 210 },
      utility: { length: 3720, wheelbase: 2550, height: 1950, clearance: 230 },
    },
    art_deco: {
      economy: { length: 4100, wheelbase: 2750, height: 1580, clearance: 195 },
      family: { length: 4650, wheelbase: 2950, height: 1620, clearance: 190 },
      luxury: { length: 5350, wheelbase: 3450, height: 1700, clearance: 190 },
      utility: { length: 4500, wheelbase: 2900, height: 1950, clearance: 210 },
    },
    classic_fins: {
      economy: { length: 4050, wheelbase: 2400, height: 1500, clearance: 170 },
      family: { length: 5200, wheelbase: 3050, height: 1480, clearance: 160 },
      luxury: { length: 5750, wheelbase: 3350, height: 1460, clearance: 155 },
      utility: { length: 4950, wheelbase: 2950, height: 1850, clearance: 200 },
    },
    aero_wedge: {
      economy: { length: 3950, wheelbase: 2420, height: 1380, clearance: 150 },
      family: { length: 4520, wheelbase: 2660, height: 1400, clearance: 145 },
      luxury: { length: 5050, wheelbase: 2920, height: 1420, clearance: 140 },
      utility: { length: 4800, wheelbase: 2900, height: 1950, clearance: 190 },
    },
    modern: {
      economy: { length: 4180, wheelbase: 2580, height: 1490, clearance: 145 },
      family: { length: 4720, wheelbase: 2820, height: 1470, clearance: 140 },
      luxury: { length: 5240, wheelbase: 3120, height: 1480, clearance: 135 },
      utility: { length: 5100, wheelbase: 3150, height: 2100, clearance: 195 },
    },
  };
  const dimensions = dimensionsByEra[era][segment];

  // Localized segment title
  const segmentName = t.design.segments[segment]?.name ?? (
    segment === 'economy' ? 'Эконом' :
    segment === 'family' ? 'Семейный' :
    segment === 'luxury' ? 'Люкс' : 'Грузовой'
  );

  // Localized powertrain description
  const powertrainName = {
    ice: lang === 'en' ? 'ICE • Petrol' : lang === 'uk' ? 'ДВЗ • Бензин' : lang === 'de' ? 'Verbrenner • Benzin' : 'ДВС • Бензин',
    steam: lang === 'en' ? 'Steam • Boiler' : lang === 'uk' ? 'Пар • Котел' : lang === 'de' ? 'Dampf • Kessel' : 'Пар • Котёл',
    electric: lang === 'en' ? 'Electric • Lead-Acid' : lang === 'uk' ? 'Електро • АКБ' : lang === 'de' ? 'Elektro • Akku' : 'Электро • АКБ',
  }[powertrain];

  // Theme-based drafting colors
  const draftColors = isBlueprint
    ? {
        bg: '#0a192f',
        fineGrid: '#132845',
        boldGrid: '#1e3f6f',
        axis: '#38bdf8',
        dimension: '#93c5fd',
        dimText: '#bae6fd',
        titleBorder: '#0284c7',
        titleBg: 'rgba(10, 25, 47, 0.9)',
        wireframe: '#38bdf8',
        wireframeGhost: 'rgba(56, 189, 248, 0.12)',
        hudBorder: 'border-cyan-800/60',
        hudBg: 'bg-[#0a192f]',
        hudText: 'text-cyan-200',
        activeBtn: 'bg-cyan-500/25 text-cyan-200 border-cyan-400',
      }
    : {
        bg: '#fbf8ee',
        fineGrid: '#f0e8d5',
        boldGrid: '#e2d3b7',
        axis: '#8c5324',
        dimension: '#78350f',
        dimText: '#542308',
        titleBorder: '#b45309',
        titleBg: 'rgba(251, 248, 238, 0.92)',
        wireframe: '#78350f',
        wireframeGhost: 'rgba(120, 53, 15, 0.08)',
        hudBorder: 'border-amber-900/30',
        hudBg: 'bg-[#fbf8ee]',
        hudText: 'text-stone-800',
        activeBtn: 'bg-amber-900/20 text-amber-950 border-amber-700',
      };

  const uid = `bp-${segment}-${era}-${powertrain}-${theme}`;

  return (
    <div
      className={`relative flex flex-col items-center justify-center overflow-hidden rounded-xl border-2 transition-colors duration-300 select-none ${draftColors.hudBorder} ${draftColors.hudBg} ${draftColors.hudText} shadow-md ${className}`}
      style={{ minHeight: '160px' }}
    >
      {/* ================= TOP CONTROL STRIP ================= */}
      <div className="w-full flex flex-wrap items-center justify-between gap-1.5 px-3 py-1.5 border-b border-inherit text-[10px] font-mono opacity-90 z-10 bg-inherit/90 backdrop-blur-xs">
        {/* Specification pill */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="font-bold tracking-wider uppercase font-serif text-[11px]">
            📐 {segmentName}
          </span>
          <span className="opacity-40">•</span>
          <span className="px-1.5 py-0.2 rounded bg-black/10 dark:bg-white/10 text-[10px]">
            {powertrainName}
          </span>
          <span className="opacity-40">•</span>
          <span className="font-bold text-[10px] text-amber-500/90 dark:text-amber-400">
            {year}
          </span>
        </div>

        {/* View Mode & Theme Switchers */}
        <div className="flex items-center gap-1">
          {/* 3-mode selector */}
          <div className="flex rounded-md border border-inherit/40 overflow-hidden text-[9px] font-sans">
            <button
              type="button"
              onClick={() => setViewMode('combined')}
              className={`px-2 py-0.5 transition cursor-pointer font-bold ${
                viewMode === 'combined' ? draftColors.activeBtn : 'opacity-60 hover:opacity-100'
              }`}
              title={lang === 'en' ? 'Blueprint & Vehicle' : lang === 'uk' ? 'Креслення та авто' : lang === 'de' ? 'CAD & Modell' : 'Чертеж и авто'}
            >
              📐+🎨
            </button>
            <button
              type="button"
              onClick={() => setViewMode('render_only')}
              className={`px-2 py-0.5 border-l border-inherit/40 transition cursor-pointer font-bold ${
                viewMode === 'render_only' ? draftColors.activeBtn : 'opacity-60 hover:opacity-100'
              }`}
              title={lang === 'en' ? 'Vehicle model only' : lang === 'uk' ? 'Тільки авто' : lang === 'de' ? 'Nur Modell' : 'Только модель'}
            >
              🎨 {lang === 'en' ? 'Model' : lang === 'uk' ? 'Авто' : lang === 'de' ? 'Modell' : 'Авто'}
            </button>
            <button
              type="button"
              onClick={() => setViewMode('draft_only')}
              className={`px-2 py-0.5 border-l border-inherit/40 transition cursor-pointer font-bold ${
                viewMode === 'draft_only' ? draftColors.activeBtn : 'opacity-60 hover:opacity-100'
              }`}
              title={lang === 'en' ? 'CAD blueprint only' : lang === 'uk' ? 'Тільки креслення' : lang === 'de' ? 'Nur CAD-Zeichnung' : 'Только чертеж'}
            >
              📐 {lang === 'en' ? 'CAD' : lang === 'uk' ? 'Креслення' : lang === 'de' ? 'CAD' : 'Чертеж'}
            </button>
          </div>

          {/* Theme switch: Blueprint Cyan vs Patent Parchment */}
          {showDraft && (
            <button
              type="button"
              onClick={() => setTheme((t) => (t === 'blueprint' ? 'patent' : 'blueprint'))}
              className="ml-1 px-1.5 py-0.5 rounded border border-inherit/50 text-[9px] hover:bg-black/10 transition cursor-pointer font-serif"
              title={
                lang === 'en'
                  ? 'Switch blueprint color style (Blueprint / Patent)'
                  : lang === 'uk'
                  ? 'Змінити стиль креслення (Синька / Патент)'
                  : lang === 'de'
                  ? 'Plan-Stil wechseln (Cyanotypie / Patent)'
                  : 'Сменить стиль чертежа (Синька / Патент)'
              }
            >
              {isBlueprint
                ? (lang === 'en' ? '📜 Patent' : lang === 'uk' ? '📜 Патент' : lang === 'de' ? '📜 Patent' : '📜 Патент')
                : (lang === 'en' ? '📐 Cyan' : lang === 'uk' ? '📐 Синька' : lang === 'de' ? '📐 Cyan' : '📐 Синька')}
            </button>
          )}
        </div>
      </div>

      {/* ================= MAIN INTERACTIVE SVG SCHEMATIC ================= */}
      <svg
        viewBox="0 0 420 185"
        className="w-full h-auto max-h-52 p-0.5 transition-all duration-300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* CAD Pattern Fine Grid (10x10) */}
          <pattern id={`cadGridFine-${uid}`} width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke={draftColors.fineGrid} strokeWidth="0.5" />
          </pattern>
          {/* CAD Pattern Bold Grid (50x50) */}
          <pattern id={`cadGridBold-${uid}`} width="50" height="50" patternUnits="userSpaceOnUse">
            <rect width="50" height="50" fill={`url(#cadGridFine-${uid})`} />
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke={draftColors.boldGrid} strokeWidth="1" />
          </pattern>

          {/* Metallic Body Gradients */}
          {segment === 'economy' && (
            <linearGradient id={`bodyGrad-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#991b1b" />
              <stop offset="35%" stopColor="#b91c1c" />
              <stop offset="70%" stopColor="#7f1d1d" />
              <stop offset="100%" stopColor="#450a0a" />
            </linearGradient>
          )}

          {segment === 'family' && (
            <linearGradient id={`bodyGrad-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1e3a8a" />
              <stop offset="35%" stopColor="#2563eb" />
              <stop offset="70%" stopColor="#1d4ed8" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
          )}

          {segment === 'luxury' && (
            <linearGradient id={`bodyGrad-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#312e81" />
              <stop offset="30%" stopColor="#4338ca" />
              <stop offset="65%" stopColor="#1e1b4b" />
              <stop offset="100%" stopColor="#09090b" />
            </linearGradient>
          )}

          {segment === 'utility' && (
            <linearGradient id={`bodyGrad-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#78350f" />
              <stop offset="40%" stopColor="#92400e" />
              <stop offset="75%" stopColor="#451a03" />
              <stop offset="100%" stopColor="#291104" />
            </linearGradient>
          )}

          {/* Chrome & Brass Gradients */}
          <linearGradient id={`brassChrome-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="25%" stopColor="#facc15" />
            <stop offset="60%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#78350f" />
          </linearGradient>

          <linearGradient id={`silverChrome-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="40%" stopColor="#e2e8f0" />
            <stop offset="75%" stopColor="#94a3b8" />
            <stop offset="100%" stopColor="#475569" />
          </linearGradient>

          {/* Glass Horizon Reflection */}
          <linearGradient id={`glassSky-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#e0f2fe" stopOpacity="0.85" />
            <stop offset="45%" stopColor="#bae6fd" stopOpacity="0.5" />
            <stop offset="50%" stopColor="#f8fafc" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#64748b" stopOpacity="0.35" />
          </linearGradient>

          {/* Tire Radial Gradient */}
          <radialGradient id={`tireGrad-${uid}`} cx="50%" cy="50%" r="50%">
            <stop offset="60%" stopColor="#18181b" />
            <stop offset="85%" stopColor="#27272a" />
            <stop offset="95%" stopColor="#09090b" />
            <stop offset="100%" stopColor="#000000" />
          </radialGradient>

          {/* Headlamp Projector Beam */}
          <radialGradient id={`lampBeam-${uid}`} cx="0%" cy="50%" r="100%">
            <stop offset="0%" stopColor="#fef08a" stopOpacity="0.8" />
            <stop offset="40%" stopColor="#fde047" stopOpacity="0.4" />
            <stop offset="75%" stopColor="#f59e0b" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#d97706" stopOpacity="0" />
          </radialGradient>

          {/* Dimension Arrow Markers */}
          <marker id={`arrStart-${uid}`} viewBox="0 0 6 6" refX="1" refY="3" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
            <path d="M 5 0 L 0 3 L 5 6 Z" fill={draftColors.dimension} />
          </marker>
          <marker id={`arrEnd-${uid}`} viewBox="0 0 6 6" refX="5" refY="3" markerWidth="4" markerHeight="4" orient="auto">
            <path d="M 0 0 L 5 3 L 0 6 Z" fill={draftColors.dimension} />
          </marker>
        </defs>

        {/* ================= LAYER 1: CAD GRID & AXES ================= */}
        {showDraft && (
          <g id="draftingGrid">
            <rect x="0" y="0" width="420" height="185" fill={draftColors.bg} />
            <rect x="0" y="0" width="420" height="185" fill={`url(#cadGridBold-${uid})`} opacity={isBlueprint ? 0.75 : 0.85} />

            {/* Coordinate Ruler Ticks */}
            <g fontSize="6" fontFamily="monospace" fill={draftColors.dimText} opacity="0.6">
              <text x="10" y="8">0</text>
              <text x="110" y="8">1000</text>
              <text x="210" y="8">2000</text>
              <text x="310" y="8">3000</text>
              <text x="410" y="8">4000</text>
            </g>

            {/* Ground Baseline / Datum Reference (Y = 150) */}
            <line x1="5" y1="150" x2="415" y2="150" stroke={draftColors.axis} strokeWidth="1.2" />
            {/* Ground hatching marks */}
            {Array.from({ length: 27 }).map((_, i) => (
              <line
                key={i}
                x1={10 + i * 15}
                y1="150"
                x2={5 + i * 15}
                y2="155"
                stroke={draftColors.axis}
                strokeWidth="0.8"
                opacity="0.4"
              />
            ))}

            {/* Axle Centerlines Construction Lines */}
            {/* Rear Axle (X = 110) */}
            <line x1="110" y1="18" x2="110" y2="155" stroke={draftColors.axis} strokeWidth="0.8" strokeDasharray="6 2 1 2" opacity="0.6" />
            <circle cx="110" cy="132" r="3" stroke={draftColors.axis} strokeWidth="0.7" fill="none" opacity="0.7" />

            {/* Front Axle (X = 295) */}
            <line x1="295" y1="18" x2="295" y2="155" stroke={draftColors.axis} strokeWidth="0.8" strokeDasharray="6 2 1 2" opacity="0.6" />
            <circle cx="295" cy="132" r="3" stroke={draftColors.axis} strokeWidth="0.7" fill="none" opacity="0.7" />
          </g>
        )}

        {!showDraft && (
          <rect x="0" y="0" width="420" height="185" fill={isBlueprint ? '#071224' : '#faf7ef'} />
        )}

        {/* ================= LAYER 2: REALISTIC VEHICLE MODEL ================= */}
        {showRender && (
          <g id="realisticModelLayer">
            {/* Ground Shadow */}
            <ellipse cx="210" cy="148" rx="145" ry="6" fill="black" fillOpacity="0.55" />

            {/* HIGH-RES 3D STUDIO PHOTOREALISTIC RENDER */}
            <image
              href={imgError ? fallbackUrl : photoUrl}
              x="50"
              y="22"
              width="320"
              height="128"
              preserveAspectRatio="xMidYMid meet"
              onError={() => setImgError(true)}
              style={{
                filter:
                  isBlueprint && viewMode === 'combined'
                    ? 'contrast(1.08) drop-shadow(0 4px 12px rgba(0,0,0,0.6))'
                    : 'drop-shadow(0 4px 12px rgba(0,0,0,0.6))',
              }}
            />
          </g>
        )}

        {/* ================= LAYER 3: PURE CAD WIREFRAME BLUEPRINT (Matches Exact Era) ================= */}
        {viewMode === 'draft_only' && (
          <g id="pureWireframeLayer" stroke={draftColors.wireframe} strokeWidth="1.5" fill={draftColors.wireframeGhost}>
            {/* ERA 1 PIONEER WIREFRAME */}
            {era === 'pioneer' && (
              segment === 'utility' ? (
                <>
                  <rect x="75" y="55" width="165" height="75" rx="3" />
                  <line x1="75" y1="80" x2="240" y2="80" strokeWidth="1" />
                  <line x1="75" y1="105" x2="240" y2="105" strokeWidth="1" />
                  <path d="M 240 55 L 280 70 L 280 130 L 240 130 Z" />
                  <rect x="245" y="70" width="30" height="34" />
                  <path d="M 280 98 L 340 98 L 340 130 L 280 130 Z" />
                  <rect x="338" y="88" width="10" height="42" rx="2" />
                </>
              ) : (
                <>
                  <path d="M 85 125 Q 98 86 160 86 L 250 86 Q 275 86 288 104 L 345 106 L 345 128 L 85 128 Z" />
                  <rect x="160" y="70" width="58" height="26" rx="4" />
                  <line x1="245" y1="80" x2="230" y2="105" strokeWidth="2" />
                  <path d="M 68 126 Q 88 94 132 102 Q 158 112 176 128" fill="none" />
                  <path d="M 255 128 Q 275 102 320 102 Q 345 108 358 128" fill="none" />
                </>
              )
            )}

            {/* ERA 2 ART DECO WIREFRAME */}
            {era === 'art_deco' && (
              segment === 'utility' ? (
                <>
                  <rect x="62" y="90" width="150" height="32" rx="2" />
                  <line x1="62" y1="100" x2="212" y2="100" strokeWidth="1" />
                  <line x1="62" y1="110" x2="212" y2="110" strokeWidth="1" />
                  <line x1="68" y1="80" x2="206" y2="80" strokeWidth="1" />
                  <path d="M 212 126 L 212 60 Q 220 56 248 56 Q 275 56 285 75 L 302 96 L 358 100 Q 366 108 360 126 L 212 126 Z" />
                  <path d="M 220 64 L 268 64 L 282 92 L 220 92 Z" />
                  <path d="M 85 125 Q 95 95 120 95 Q 145 95 155 125" fill="none" />
                  <path d="M 252 126 Q 278 88 330 92 Q 360 102 368 126" fill="none" />
                </>
              ) : (
                <>
                  <path d="M 68 124 Q 76 82 138 62 Q 220 50 268 68 L 292 92 L 358 98 Q 366 108 360 124 L 68 124 Z" />
                  <path d="M 145 68 L 198 64 L 198 92 L 138 92 Z" />
                  <path d="M 206 64 L 262 70 L 280 92 L 206 92 Z" />
                  <line x1="78" y1="94" x2="352" y2="96" strokeWidth="1" />
                  <path d="M 60 126 Q 72 84 125 92 Q 156 102 176 126" fill="none" />
                  <path d="M 252 126 Q 278 88 330 92 Q 360 102 368 126" fill="none" />
                </>
              )
            )}

            {/* ERA 3 CLASSIC FINS WIREFRAME */}
            {era === 'classic_fins' && (
              segment === 'utility' ? (
                <>
                  <rect x="62" y="92" width="150" height="34" rx="2.5" />
                  <path d="M 212 126 L 212 68 Q 220 62 258 62 Q 280 62 292 80 L 312 96 L 368 98 Q 372 108 368 126 L 212 126 Z" />
                  <path d="M 220 70 L 262 68 L 290 92 L 220 92 Z" />
                  <path d="M 85 126 Q 92 94 118 94 Q 144 94 152 126" fill="none" />
                  <path d="M 252 126 Q 278 88 330 90 Q 362 100 370 126" fill="none" />
                </>
              ) : (
                <>
                  <path d="M 58 88 Q 72 100 80 126 L 368 126 Q 372 112 368 102 L 318 98 L 280 68 L 165 68 L 125 94 L 58 88 Z" />
                  <polygon points="132,94 168,72 278,72 310,94" />
                  <polygon points="58,88 74,96 64,104" />
                  <line x1="68" y1="108" x2="364" y2="112" strokeWidth="1" />
                </>
              )
            )}

            {/* ERA 4 AERO WEDGE WIREFRAME */}
            {era === 'aero_wedge' && (
              segment === 'utility' ? (
                <>
                  <rect x="62" y="90" width="158" height="34" rx="2" />
                  <path d="M 220 124 L 220 64 L 285 64 L 310 92 L 375 98 L 375 124 L 220 124 Z" />
                  <polygon points="228,88 228,68 280,68 304,88" />
                  <rect x="58" y="116" width="12" height="10" rx="1.5" />
                  <rect x="368" y="116" width="10" height="10" rx="1.5" />
                </>
              ) : (
                <>
                  <path d="M 65 124 L 65 100 L 138 98 L 190 70 L 285 70 L 342 98 L 375 108 L 375 124 Z" />
                  <polygon points="144,96 192,72 282,72 334,96" />
                  <line x1="72" y1="115" x2="368" y2="115" strokeWidth="2" />
                </>
              )
            )}

            {/* ERA 5 MODERN WIREFRAME */}
            {era === 'modern' && (
              segment === 'utility' ? (
                <>
                  <path d="M 62 120 L 62 84 L 218 84 L 218 120 Z" />
                  <path d="M 218 120 L 218 62 Q 224 58 280 58 L 332 84 L 375 90 L 375 120 L 218 120 Z" />
                  <polygon points="226,86 226,64 276,64 322,86" />
                  <line x1="165" y1="122" x2="295" y2="122" strokeWidth="2" />
                </>
              ) : (
                <>
                  <path d="M 62 122 Q 68 94 122 84 Q 200 56 278 72 L 345 94 Q 370 104 374 120 L 62 122 Z" />
                  <path d="M 134 84 Q 205 62 272 74 L 324 94 L 128 94 Z" />
                  <line x1="160" y1="122" x2="275" y2="122" strokeWidth="2" />
                </>
              )
            )}

            {/* Wireframe Wheels */}
            <circle cx="110" cy="132" r="18" fill="none" strokeWidth="2" />
            <circle cx="110" cy="132" r="7" fill="none" strokeWidth="1" />
            <circle cx="295" cy="132" r="18" fill="none" strokeWidth="2" />
            <circle cx="295" cy="132" r="7" fill="none" strokeWidth="1" />
          </g>
        )}

        {/* ================= LAYER 4: TECHNICAL DIMENSIONS & CAD TITLE BLOCK ================= */}
        {showDraft && (
          <g id="dimensionCallouts">
            {/* 1. WHEELBASE (WB): Between Axles (110 -> 295 = 185 mm) */}
            <g stroke={draftColors.dimension} strokeWidth="1">
              <line x1="110" y1="158" x2="110" y2="172" strokeWidth="0.7" />
              <line x1="295" y1="158" x2="295" y2="172" strokeWidth="0.7" />
              <line x1="110" y1="166" x2="295" y2="166" markerStart={`url(#arrStart-${uid})`} markerEnd={`url(#arrEnd-${uid})`} />
            </g>
            <text
              x="202"
              y="164"
              fill={draftColors.dimText}
              fontSize="7"
              fontFamily="monospace"
              fontWeight="bold"
              textAnchor="middle"
            >
              WB: {dimensions.wheelbase.toLocaleString()} mm
            </text>

            {/* 2. OVERALL LENGTH (L): Top Dimension */}
            <g stroke={draftColors.dimension} strokeWidth="0.8">
              <line x1="60" y1="20" x2="60" y2="35" strokeWidth="0.6" strokeDasharray="2 2" />
              <line x1="365" y1="20" x2="365" y2="35" strokeWidth="0.6" strokeDasharray="2 2" />
              <line x1="60" y1="24" x2="365" y2="24" markerStart={`url(#arrStart-${uid})`} markerEnd={`url(#arrEnd-${uid})`} />
            </g>
            <text
              x="170"
              y="21"
              fill={draftColors.dimText}
              fontSize="7.5"
              fontFamily="monospace"
              fontWeight="bold"
              textAnchor="middle"
            >
              L: {dimensions.length.toLocaleString()} mm
            </text>

            {/* 3. OVERALL HEIGHT (H): Left Vertical Dimension */}
            <g stroke={draftColors.dimension} strokeWidth="0.8">
              <line x1="28" y1="52" x2="42" y2="52" strokeWidth="0.6" strokeDasharray="2 2" />
              <line x1="28" y1="150" x2="42" y2="150" strokeWidth="0.6" />
              <line x1="34" y1="52" x2="34" y2="150" markerStart={`url(#arrStart-${uid})`} markerEnd={`url(#arrEnd-${uid})`} />
            </g>
            <text
              x="30"
              y="102"
              fill={draftColors.dimText}
              fontSize="7"
              fontFamily="monospace"
              fontWeight="bold"
              textAnchor="middle"
              transform="rotate(-90 30 102)"
            >
              H: {dimensions.height.toLocaleString()} mm
            </text>

            {/* 4. GROUND CLEARANCE (GC) */}
            <g stroke={draftColors.dimension} strokeWidth="0.7">
              <line x1="185" y1="126" x2="185" y2="150" markerStart={`url(#arrStart-${uid})`} markerEnd={`url(#arrEnd-${uid})`} />
            </g>
            <text
              x="190"
              y="140"
              fill={draftColors.dimText}
              fontSize="6"
              fontFamily="monospace"
            >
              GC: {dimensions.clearance}
            </text>

            {/* 5. AUTHENTIC CAD TITLE BLOCK (Штамп чертежа - Top Right to avoid covering car) */}
            <g transform="translate(285, 20)" opacity="0.95">
              <rect
                x="0"
                y="0"
                width="125"
                height="44"
                fill={draftColors.titleBg}
                stroke={draftColors.titleBorder}
                strokeWidth="1"
                rx="2"
              />
              <line x1="0" y1="14" x2="125" y2="14" stroke={draftColors.titleBorder} strokeWidth="0.7" />
              <line x1="62" y1="14" x2="62" y2="44" stroke={draftColors.titleBorder} strokeWidth="0.7" />

              <text x="5" y="10" fill={draftColors.dimText} fontSize="5.5" fontFamily="serif" fontWeight="bold">
                {lang === 'en' ? 'AUTOMOTIVE CAD BUREAU' : lang === 'uk' ? 'КОНСТРУКТОРСЬКЕ БЮРО' : lang === 'de' ? 'KONSTRUKTIONSBÜRO' : 'КОНСТРУКТОРСКОЕ БЮРО'}
              </text>

              <text x="5" y="24" fill={draftColors.dimText} fontSize="5" fontFamily="monospace">
                DWG: <tspan fontWeight="bold" fill={draftColors.axis}>AG-{year}-M{segment[0]?.toUpperCase() ?? 'X'}</tspan>
              </text>

              <text x="5" y="36" fill={draftColors.dimText} fontSize="5" fontFamily="monospace">
                {lang === 'en' ? 'SCALE' : lang === 'uk' ? 'МАСШТАБ' : lang === 'de' ? 'MASSSTAB' : 'МАСШТАБ'}: <tspan fontWeight="bold">1:20</tspan>
              </text>

              <text x="66" y="24" fill={draftColors.dimText} fontSize="5" fontFamily="monospace">
                {lang === 'en' ? 'STATUS' : lang === 'uk' ? 'СТАТУС' : lang === 'de' ? 'STATUS' : 'СТАТУС'}:
              </text>
              <text x="66" y="36" fill={draftColors.axis} fontSize="5" fontFamily="monospace" fontWeight="bold">
                {lang === 'en' ? 'APPROVED ✓' : lang === 'uk' ? 'СХВАЛЕНО ✓' : lang === 'de' ? 'GEPRÜFT ✓' : 'УТВЕРЖДЕНО ✓'}
              </text>
            </g>
          </g>
        )}
      </svg>
    </div>
  );
}
