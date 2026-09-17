'use client';

import React, { useState } from 'react';
import type { VehicleSegment } from '@ait/shared-types';
import { useLanguage } from '../lib/i18n';

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

  // View mode: 'combined' (CAD Grid + Realistic Render), 'render_only' (Just realistic car), 'draft_only' (Pure wireframe blueprint)
  const [viewMode, setViewMode] = useState<'combined' | 'render_only' | 'draft_only'>('combined');

  // Blueprint paper theme: 'blueprint' (Cyan Engineer Drafting) or 'patent' (Antique Sepia Parchment)
  const [theme, setTheme] = useState<'blueprint' | 'patent'>('blueprint');

  const isBlueprint = theme === 'blueprint';
  const showDraft = viewMode === 'combined' || viewMode === 'draft_only';
  const showRender = viewMode === 'combined' || viewMode === 'render_only';

  // Dimension figures by segment (in millimeters)
  const dimensions = {
    economy: { length: 3150, wheelbase: 2150, height: 1540, clearance: 220, foh: 480, roh: 520 },
    family: { length: 3850, wheelbase: 2650, height: 1620, clearance: 205, foh: 560, roh: 640 },
    luxury: { length: 4420, wheelbase: 3100, height: 1780, clearance: 210, foh: 620, roh: 700 },
    utility: { length: 3720, wheelbase: 2550, height: 1950, clearance: 230, foh: 520, roh: 650 },
  }[segment];

  // Localized segment title
  const segmentName = t.design.segments[segment]?.name ?? (
    segment === 'economy' ? 'Эконом (Ранэбаут)' :
    segment === 'family' ? 'Семейный (Турер)' :
    segment === 'luxury' ? 'Люкс (Лимузин)' : 'Грузовой (Фургон)'
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
        titleBg: 'rgba(10, 25, 47, 0.85)',
        wireframe: '#38bdf8',
        wireframeGhost: 'rgba(56, 189, 248, 0.15)',
        hudBorder: 'border-cyan-800/60',
        hudBg: 'bg-[#0a192f]',
        hudText: 'text-cyan-200',
        activeBtn: 'bg-cyan-500/20 text-cyan-200 border-cyan-400',
      }
    : {
        bg: '#fbf8ee',
        fineGrid: '#f0e8d5',
        boldGrid: '#e2d3b7',
        axis: '#8c5324',
        dimension: '#78350f',
        dimText: '#542308',
        titleBorder: '#b45309',
        titleBg: 'rgba(251, 248, 238, 0.9)',
        wireframe: '#78350f',
        wireframeGhost: 'rgba(120, 53, 15, 0.1)',
        hudBorder: 'border-amber-900/30',
        hudBg: 'bg-[#fbf8ee]',
        hudText: 'text-stone-800',
        activeBtn: 'bg-amber-900/15 text-amber-950 border-amber-700',
      };

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
          <span className="opacity-80 text-[10px]">
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
              title={lang === 'en' ? 'Blueprint & Realistic Render' : lang === 'uk' ? 'Креслення та рендер' : lang === 'de' ? 'Plan & Rendering' : 'Чертеж и рендер'}
            >
              📐+🎨
            </button>
            <button
              type="button"
              onClick={() => setViewMode('render_only')}
              className={`px-2 py-0.5 border-l border-inherit/40 transition cursor-pointer font-bold ${
                viewMode === 'render_only' ? draftColors.activeBtn : 'opacity-60 hover:opacity-100'
              }`}
              title={lang === 'en' ? 'Realistic Vehicle Render only' : lang === 'uk' ? 'Тільки реалістичний рендер' : lang === 'de' ? 'Nur Fahrzeug-Rendering' : 'Только модель авто'}
            >
              🎨 {lang === 'en' ? 'Auto' : lang === 'uk' ? 'Авто' : lang === 'de' ? 'Fahrzeug' : 'Авто'}
            </button>
            <button
              type="button"
              onClick={() => setViewMode('draft_only')}
              className={`px-2 py-0.5 border-l border-inherit/40 transition cursor-pointer font-bold ${
                viewMode === 'draft_only' ? draftColors.activeBtn : 'opacity-60 hover:opacity-100'
              }`}
              title={lang === 'en' ? 'Engineering CAD blueprint only' : lang === 'uk' ? 'Тільки креслення' : lang === 'de' ? 'Nur CAD-Bauplan' : 'Только чертеж'}
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
              title={lang === 'en' ? 'Switch blueprint color style' : 'Сменить стиль чертежа (Синька / Патент)'}
            >
              {isBlueprint ? '📜 Патент' : '📐 Синька'}
            </button>
          )}
        </div>
      </div>

      {/* ================= MAIN INTERACTIVE SVG SCHEMATIC ================= */}
      <svg
        viewBox="0 0 420 185"
        className="w-full h-auto max-h-48 p-0.5 transition-all duration-300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Engineering CAD Pattern Fine Grid (10x10) */}
          <pattern id="cadGridFine" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke={draftColors.fineGrid} strokeWidth="0.5" />
          </pattern>
          {/* Engineering CAD Pattern Bold Grid (50x50) */}
          <pattern id="cadGridBold" width="50" height="50" patternUnits="userSpaceOnUse">
            <rect width="50" height="50" fill="url(#cadGridFine)" />
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke={draftColors.boldGrid} strokeWidth="1" />
          </pattern>

          {/* Headlamp Warm Radiant Projector Beam */}
          <radialGradient id="lampBeam" cx="0%" cy="50%" r="100%">
            <stop offset="0%" stopColor="#fef08a" stopOpacity="0.85" />
            <stop offset="35%" stopColor="#fde047" stopOpacity="0.45" />
            <stop offset="70%" stopColor="#f59e0b" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#d97706" stopOpacity="0" />
          </radialGradient>

          {/* Metallic Body Gradients */}
          {/* Economy: Rich Carriage Crimson Enamel */}
          <linearGradient id="bodyGradEconomy" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#991b1b" />
            <stop offset="35%" stopColor="#b91c1c" />
            <stop offset="70%" stopColor="#7f1d1d" />
            <stop offset="100%" stopColor="#450a0a" />
          </linearGradient>

          {/* Family: Imperial Sapphire Coach Enamel */}
          <linearGradient id="bodyGradFamily" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1e3a8a" />
            <stop offset="35%" stopColor="#2563eb" />
            <stop offset="70%" stopColor="#1d4ed8" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>

          {/* Luxury: Regal Obsidian & Ruby Two-Tone */}
          <linearGradient id="bodyGradLuxury" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#312e81" />
            <stop offset="30%" stopColor="#4338ca" />
            <stop offset="65%" stopColor="#1e1b4b" />
            <stop offset="100%" stopColor="#09090b" />
          </linearGradient>

          {/* Utility: Hardwood Timber & Dark Steel */}
          <linearGradient id="bodyGradUtility" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#78350f" />
            <stop offset="40%" stopColor="#92400e" />
            <stop offset="75%" stopColor="#451a03" />
            <stop offset="100%" stopColor="#291104" />
          </linearGradient>

          {/* Polished Chrome & Brass Gradients */}
          <linearGradient id="brassChrome" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="25%" stopColor="#facc15" />
            <stop offset="60%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#78350f" />
          </linearGradient>

          <linearGradient id="silverChrome" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="40%" stopColor="#e2e8f0" />
            <stop offset="75%" stopColor="#94a3b8" />
            <stop offset="100%" stopColor="#475569" />
          </linearGradient>

          {/* Windshield Reflection with Sky Horizon */}
          <linearGradient id="glassSkyHorizon" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#e0f2fe" stopOpacity="0.8" />
            <stop offset="45%" stopColor="#bae6fd" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#f8fafc" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#64748b" stopOpacity="0.3" />
          </linearGradient>

          {/* Real 3D Rubber Tire Gradient */}
          <radialGradient id="tireGrad" cx="50%" cy="50%" r="50%">
            <stop offset="60%" stopColor="#18181b" />
            <stop offset="85%" stopColor="#27272a" />
            <stop offset="95%" stopColor="#09090b" />
            <stop offset="100%" stopColor="#000000" />
          </radialGradient>

          {/* Dimension Arrow Markers */}
          <marker id="arrStart" viewBox="0 0 6 6" refX="1" refY="3" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
            <path d="M 5 0 L 0 3 L 5 6 Z" fill={draftColors.dimension} />
          </marker>
          <marker id="arrEnd" viewBox="0 0 6 6" refX="5" refY="3" markerWidth="4" markerHeight="4" orient="auto">
            <path d="M 0 0 L 5 3 L 0 6 Z" fill={draftColors.dimension} />
          </marker>
        </defs>

        {/* ================= LAYER 1: CAD GRID & AXIS ================= */}
        {showDraft && (
          <g id="draftingGrid">
            {/* Coordinate Background Grid */}
            <rect x="0" y="0" width="420" height="185" fill={draftColors.bg} />
            <rect x="0" y="0" width="420" height="185" fill="url(#cadGridBold)" opacity={isBlueprint ? 0.75 : 0.85} />

            {/* Coordinate Tick Marks & Ruler Numbers */}
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

            {/* Axle Centerline Construction Lines (— · — · —) */}
            {/* Rear Axle (X = 110) */}
            <line x1="110" y1="20" x2="110" y2="160" stroke={draftColors.axis} strokeWidth="0.8" strokeDasharray="6 2 1 2" opacity="0.6" />
            <circle cx="110" cy="142" r="3" stroke={draftColors.axis} strokeWidth="0.7" fill="none" opacity="0.7" />

            {/* Front Axle (X = 300) */}
            <line x1="300" y1="20" x2="300" y2="160" stroke={draftColors.axis} strokeWidth="0.8" strokeDasharray="6 2 1 2" opacity="0.6" />
            <circle cx="300" cy="142" r="3" stroke={draftColors.axis} strokeWidth="0.7" fill="none" opacity="0.7" />
          </g>
        )}

        {/* Clean background when draft is disabled */}
        {!showDraft && (
          <rect x="0" y="0" width="420" height="185" fill={isBlueprint ? '#071224' : '#faf7ef'} />
        )}

        {/* ================= LAYER 2: REALISTIC VEHICLE MODEL OVERLAY ================= */}
        {showRender && (
          <g id="realisticModelLayer">
            {/* Ground Shadow underneath the vehicle */}
            <ellipse cx="205" cy="150" rx="145" ry="5.5" fill="black" fillOpacity="0.45" />

            {/* 1. ECONOMY: Runabout Carriage Buggy */}
            {segment === 'economy' && (
              <g id="renderEconomy">
                {/* Carriage Underframe / Wooden Perch */}
                <rect x="75" y="130" width="235" height="5" rx="1.5" fill="#291104" stroke="#451a03" strokeWidth="1" />
                {/* Curved Dash Wooden Tub */}
                <path
                  d="M 230 130 L 290 130 Q 315 125 310 90 Q 295 86 280 92 L 255 92 L 230 110 Z"
                  fill="url(#bodyGradEconomy)"
                  stroke="#fbbf24"
                  strokeWidth="0.8"
                />
                {/* Rear Engine / Tool Box with Louvered Brass Trim */}
                <path
                  d="M 80 130 L 80 102 Q 80 96 92 96 L 155 96 L 155 130 Z"
                  fill="url(#bodyGradEconomy)"
                  stroke="#fbbf24"
                  strokeWidth="0.8"
                />
                {/* Louver cooling vents on rear hood */}
                <line x1="100" y1="105" x2="135" y2="105" stroke="#fde047" strokeWidth="1.2" strokeLinecap="round" />
                <line x1="100" y1="112" x2="135" y2="112" stroke="#fde047" strokeWidth="1.2" strokeLinecap="round" />
                <line x1="100" y1="119" x2="135" y2="119" stroke="#fde047" strokeWidth="1.2" strokeLinecap="round" />

                {/* Tufted Leather Bench Seat (Deep Ruby/Cognac) */}
                <path
                  d="M 150 130 L 155 88 Q 158 66 180 64 L 218 64 Q 228 66 228 88 L 228 130 Z"
                  fill="#78350f"
                  stroke="#451a03"
                  strokeWidth="1.2"
                />
                {/* Seat Cushion highlight */}
                <path d="M 175 88 L 228 88 L 225 106 L 175 106 Z" fill="#92400e" opacity="0.8" />
                {/* Diamond Tufting Stitches */}
                <line x1="170" y1="70" x2="170" y2="125" stroke="#fbbf24" strokeWidth="0.7" strokeDasharray="2 3" />
                <line x1="190" y1="70" x2="190" y2="125" stroke="#fbbf24" strokeWidth="0.7" strokeDasharray="2 3" />
                <line x1="210" y1="70" x2="210" y2="125" stroke="#fbbf24" strokeWidth="0.7" strokeDasharray="2 3" />
                <circle cx="170" cy="80" r="1" fill="#451a03" />
                <circle cx="190" cy="80" r="1" fill="#451a03" />
                <circle cx="210" cy="80" r="1" fill="#451a03" />

                {/* Steering Tiller with Rosewood Handle */}
                <line x1="250" y1="125" x2="225" y2="80" stroke="url(#silverChrome)" strokeWidth="3" strokeLinecap="round" />
                <line x1="225" y1="80" x2="195" y2="76" stroke="#451a03" strokeWidth="4.5" strokeLinecap="round" />
                <line x1="225" y1="80" x2="195" y2="76" stroke="#b45309" strokeWidth="2.5" strokeLinecap="round" />

                {/* Brass Side Carriage Lantern & Beam */}
                <rect x="298" y="78" width="10" height="18" rx="2" fill="url(#brassChrome)" stroke="#451a03" strokeWidth="1" />
                <circle cx="303" cy="87" r="3" fill="#fef08a" />
                <polygon points="308,82 375,60 375,114 308,92" fill="url(#lampBeam)" opacity="0.75" />

                {/* Elliptic Leaf Springs */}
                <path d="M 85 142 Q 110 132 135 142" stroke="url(#silverChrome)" strokeWidth="2.5" fill="none" />
                <path d="M 275 142 Q 300 132 325 142" stroke="url(#silverChrome)" strokeWidth="2.5" fill="none" />
              </g>
            )}

            {/* 2. FAMILY: Double Phaeton Touring Car */}
            {segment === 'family' && (
              <g id="renderFamily">
                {/* Heavy Cast Frame & Running Board */}
                <path d="M 65 130 L 335 130" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" />
                <rect x="145" y="133" width="115" height="4.5" rx="1.5" fill="url(#brassChrome)" stroke="#451a03" strokeWidth="0.8" />

                {/* Sweeping Blue Coachwork Body */}
                <path
                  d="M 80 130 L 85 100 Q 95 72 130 72 L 235 72 L 240 94 L 320 94 Q 332 94 335 130 Z"
                  fill="url(#bodyGradFamily)"
                  stroke="#93c5fd"
                  strokeWidth="0.8"
                />

                {/* Radiator Grille & Brass Cap */}
                <rect x="328" y="88" width="8" height="42" rx="2.5" fill="url(#brassChrome)" stroke="#451a03" strokeWidth="1.2" />
                <line x1="332" y1="94" x2="332" y2="126" stroke="#451a03" strokeWidth="1" strokeDasharray="1 1" />
                <circle cx="332" cy="87" r="2.5" fill="url(#brassChrome)" />

                {/* Raked Windscreen with Realistic Glass Reflection */}
                <polygon points="238,94 230,56 226,57 234,95" fill="url(#brassChrome)" stroke="#451a03" strokeWidth="0.8" />
                <polygon points="236,93 229,58 226,59 233,94" fill="url(#glassSkyHorizon)" />

                {/* Two-Row Leather Passenger Cockpit */}
                {/* Front driver seat */}
                <path d="M 180 130 L 185 86 Q 188 68 205 68 L 230 68 L 234 130 Z" fill="#451a03" stroke="#291104" strokeWidth="1" />
                <path d="M 195 86 L 230 86 L 228 102 L 195 102 Z" fill="#78350f" />
                {/* Rear passenger seat */}
                <path d="M 120 130 L 125 86 Q 128 66 145 66 L 170 66 L 174 130 Z" fill="#451a03" stroke="#291104" strokeWidth="1" />
                <path d="M 135 86 L 170 86 L 168 102 L 135 102 Z" fill="#78350f" />

                {/* Folded Accordion Convertible Top at Rear */}
                <path d="M 82 130 L 88 95 Q 80 72 110 75 Q 118 80 124 92 Z" fill="#291104" stroke="#451a03" strokeWidth="1.5" />
                <path d="M 90 92 Q 105 80 118 88" stroke="#facc15" strokeWidth="1.5" fill="none" />

                {/* Slanted Brass Steering Column & Wood Wheel */}
                <line x1="228" y1="120" x2="210" y2="76" stroke="url(#brassChrome)" strokeWidth="3" />
                <ellipse cx="208" cy="74" rx="9" ry="3.5" transform="rotate(-25 208 74)" stroke="#78350f" strokeWidth="2.5" fill="none" />

                {/* Full Curved Fenders (Mudguards) */}
                <path d="M 68 130 Q 75 96 115 108 Q 140 116 148 132" stroke="url(#silverChrome)" strokeWidth="3" fill="none" />
                <path d="M 252 132 Q 268 108 302 108 Q 330 108 342 130" stroke="url(#silverChrome)" strokeWidth="3" fill="none" />

                {/* Acetylene Headlamp with Projector Cone */}
                <path d="M 336 88 L 350 82 L 350 106 L 336 100 Z" fill="url(#brassChrome)" stroke="#451a03" strokeWidth="1.2" />
                <circle cx="347" cy="94" r="5" fill="#fef08a" />
                <polygon points="350,84 415,62 415,126 350,104" fill="url(#lampBeam)" opacity="0.8" />
              </g>
            )}

            {/* 3. LUXURY: Imperial Enclosed Limousine / Brougham */}
            {segment === 'luxury' && (
              <g id="renderLuxury">
                {/* Heavy Rigid Frame */}
                <path d="M 55 130 L 345 130" stroke="#0f172a" strokeWidth="4.5" strokeLinecap="round" />
                <rect x="145" y="133" width="125" height="5" rx="1.5" fill="url(#brassChrome)" stroke="#451a03" strokeWidth="1" />

                {/* Enclosed Royal Cabin with Arched Roof */}
                <path
                  d="M 85 130 L 85 58 Q 92 38 130 38 L 225 38 Q 242 38 248 60 L 248 130 Z"
                  fill="url(#bodyGradLuxury)"
                  stroke="#fbbf24"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />

                {/* Gilded Roof Trim & Gutter */}
                <path d="M 85 46 Q 160 34 248 46" stroke="url(#brassChrome)" strokeWidth="2.5" fill="none" />

                {/* Crystal Bevelled Glass Windows with Velvet Drapery */}
                <rect x="98" y="52" width="55" height="42" rx="3" fill="url(#glassSkyHorizon)" stroke="url(#brassChrome)" strokeWidth="1.5" />
                {/* Velvet interior curtain */}
                <path d="M 99 53 Q 115 54 115 72 Q 105 72 99 90 Z" fill="#991b1b" opacity="0.85" />

                <rect x="165" y="52" width="68" height="42" rx="3" fill="url(#glassSkyHorizon)" stroke="url(#brassChrome)" strokeWidth="1.5" />
                <path d="M 232 53 Q 216 54 216 72 Q 226 72 232 90 Z" fill="#991b1b" opacity="0.85" />

                {/* Gilded Door Handle & Pillar */}
                <line x1="160" y1="46" x2="160" y2="130" stroke="#fbbf24" strokeWidth="2" />
                <rect x="157" y="86" width="6" height="10" rx="1.5" fill="url(#brassChrome)" stroke="#451a03" strokeWidth="0.8" />

                {/* Open Chauffeur Front Cockpit */}
                <line x1="254" y1="130" x2="254" y2="66" stroke="#4338ca" strokeWidth="3" />
                <line x1="254" y1="66" x2="280" y2="66" stroke="#4338ca" strokeWidth="2.5" />
                {/* Chauffeur Windshield */}
                <line x1="280" y1="94" x2="274" y2="64" stroke="url(#brassChrome)" strokeWidth="2.5" />
                <polygon points="280,94 274,64 270,65 276,95" fill="url(#glassSkyHorizon)" />

                {/* Chauffeur Steering Wheel */}
                <line x1="264" y1="120" x2="258" y2="82" stroke="url(#silverChrome)" strokeWidth="3" />
                <ellipse cx="256" cy="80" rx="9" ry="3.5" transform="rotate(-20 256 80)" stroke="url(#brassChrome)" strokeWidth="2.5" fill="none" />

                {/* Long Regal Bonnet & Radiator */}
                <path d="M 280 94 L 342 94 L 342 130 L 254 130 Z" fill="url(#bodyGradLuxury)" stroke="#fbbf24" strokeWidth="1" />
                {/* Bonnet Louvers */}
                <line x1="295" y1="102" x2="330" y2="102" stroke="#fde047" strokeWidth="1.2" />
                <line x1="295" y1="110" x2="330" y2="110" stroke="#fde047" strokeWidth="1.2" />
                <line x1="295" y1="118" x2="330" y2="118" stroke="#fde047" strokeWidth="1.2" />

                {/* Monumental Radiator Shell & Winged Mascot */}
                <rect x="342" y="68" width="10" height="62" rx="3" fill="url(#brassChrome)" stroke="#451a03" strokeWidth="1.8" />
                <line x1="347" y1="74" x2="347" y2="124" stroke="#fef08a" strokeWidth="1.5" strokeDasharray="1 1" />
                {/* Winged Goddess Radiator Cap */}
                <path d="M 347 68 Q 338 56 358 58 Q 350 64 347 68" fill="#fde047" stroke="#b45309" strokeWidth="1" />

                {/* Ornate Coach Carriage Lanterns on C-pillar */}
                <rect x="76" y="66" width="9" height="22" rx="2" fill="url(#brassChrome)" stroke="#451a03" strokeWidth="1" />
                <path d="M 80.5" y1="66" x2="80.5" y2="58" stroke="url(#brassChrome)" strokeWidth="1.5" />
                <circle cx="80.5" cy="56" r="2" fill="#fbbf24" />

                {/* Flowing Full-Coverage Wings / Fenders */}
                <path d="M 58 130 Q 64 88 110 98 Q 138 106 148 132" stroke="url(#brassChrome)" strokeWidth="3.5" fill="none" />
                <path d="M 262 132 Q 278 98 320 98 Q 348 98 358 130" stroke="url(#brassChrome)" strokeWidth="3.5" fill="none" />

                {/* Dual Projector Headlamps */}
                <path d="M 350 90 L 364 82 L 364 110 L 350 102 Z" fill="url(#brassChrome)" stroke="#451a03" strokeWidth="1.5" />
                <circle cx="361" cy="96" r="6" fill="#fef08a" />
                <polygon points="364,84 420,60 420,132 364,108" fill="url(#lampBeam)" opacity="0.9" />
              </g>
            )}

            {/* 4. UTILITY: Express Commercial Delivery Van */}
            {segment === 'utility' && (
              <g id="renderUtility">
                {/* Heavy Commercial Channel Frame */}
                <path d="M 60 130 L 340 130" stroke="#1c1917" strokeWidth="5" strokeLinecap="round" />

                {/* Large Wooden Cargo Body (Plank Texture) */}
                <path
                  d="M 75 130 L 75 48 Q 80 32 110 32 L 235 32 Q 248 32 248 46 L 248 130 Z"
                  fill="url(#bodyGradUtility)"
                  stroke="#451a03"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                {/* Horizontal Wood Plank Seams */}
                <line x1="80" y1="52" x2="242" y2="52" stroke="#291104" strokeWidth="1.5" />
                <line x1="80" y1="72" x2="242" y2="72" stroke="#291104" strokeWidth="1.5" />
                <line x1="80" y1="92" x2="242" y2="92" stroke="#291104" strokeWidth="1.5" />
                <line x1="80" y1="112" x2="242" y2="112" stroke="#291104" strokeWidth="1.5" />

                {/* Heavy Forged Iron Cargo Door Hinges */}
                <rect x="71" y="55" width="10" height="7" rx="1.5" fill="#09090b" stroke="#71717a" strokeWidth="1" />
                <rect x="71" y="105" width="10" height="7" rx="1.5" fill="#09090b" stroke="#71717a" strokeWidth="1" />

                {/* Driver Cab with Forward Sun Visor Awning */}
                <path d="M 246 32 L 288 44 L 282 86 L 248 86" stroke="#451a03" strokeWidth="2" fill="none" />
                <polygon points="248,48 280,53 277,86 248,86" fill="url(#glassSkyHorizon)" stroke="#291104" strokeWidth="1" />

                {/* Short Flat Commercial Hood & Heavy Iron Radiator */}
                <path d="M 282 86 L 338 86 L 338 130 L 248 130 Z" fill="url(#bodyGradUtility)" stroke="#291104" strokeWidth="1.5" />
                <rect x="336" y="80" width="10" height="50" rx="3" fill="#334155" stroke="#0f172a" strokeWidth="2" />
                <line x1="341" y1="86" x2="341" y2="124" stroke="#64748b" strokeWidth="1.5" strokeDasharray="2 2" />

                {/* Rugged Steel Fenders */}
                <path d="M 62 130 Q 70 94 108 102 Q 134 112 144 132" stroke="#1c1917" strokeWidth="4" fill="none" />
                <path d="M 255 132 Q 270 98 310 98 Q 340 98 350 130" stroke="#1c1917" strokeWidth="4" fill="none" />

                {/* Rugged Utility Lantern */}
                <rect x="340" y="78" width="9" height="18" rx="2" fill="url(#brassChrome)" stroke="#451a03" strokeWidth="1.2" />
                <polygon points="349,82 405,64 405,110 349,94" fill="url(#lampBeam)" opacity="0.65" />
              </g>
            )}

            {/* Powertrain specific mechanical overlays */}
            {powertrain === 'steam' && (
              <g id="steamOverlay">
                {/* Copper Steam Boiler Dome & Piping */}
                <rect x="282" y="98" width="34" height="20" rx="5" fill="#b45309" stroke="#f59e0b" strokeWidth="1.5" />
                <path d="M 292 98 Q 292 80 270 80 L 190 80" stroke="#d97706" strokeWidth="3" fill="none" strokeLinecap="round" />
                {/* Steam Vapor Plume */}
                <path
                  d="M 65 125 Q 52 120 48 112 Q 44 102 56 98 Q 66 96 72 106 Q 78 118 65 125"
                  fill="#e2e8f0"
                  fillOpacity="0.7"
                  stroke="#94a3b8"
                  strokeWidth="1"
                />
              </g>
            )}

            {powertrain === 'electric' && (
              <g id="electricOverlay">
                {/* Heavy Battery Crates with Brass Terminal Straps */}
                <rect x="155" y="122" width="75" height="14" rx="2" fill="#09090b" stroke="#eab308" strokeWidth="1.8" />
                <line x1="170" y1="122" x2="170" y2="136" stroke="#facc15" strokeWidth="1.5" />
                <line x1="192" y1="122" x2="192" y2="136" stroke="#facc15" strokeWidth="1.5" />
                <line x1="214" y1="122" x2="214" y2="136" stroke="#facc15" strokeWidth="1.5" />
                {/* Electric Lightning Bolt Insignia */}
                <polygon points="196,104 187,116 195,116 189,128 205,113 197,113" fill="#facc15" stroke="#78350f" strokeWidth="1" />
              </g>
            )}

            {powertrain === 'ice' && (
              <g id="iceOverlay">
                {/* Front Hand Starting Crank */}
                <path d="M 346 128 L 362 128 L 362 140 L 368 140" stroke="url(#brassChrome)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                {/* Exhaust Pipe & Subtle Smoke */}
                <path d="M 72 134 L 48 134" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
                <circle cx="42" cy="134" r="3.5" fill="#64748b" fillOpacity="0.5" />
                <circle cx="32" cy="132" r="5" fill="#64748b" fillOpacity="0.3" />
              </g>
            )}

            {/* REALISTIC 3D WHEELS (Rear at X=110, Front at X=300, Y=142) */}
            {/* REAR WHEEL */}
            <g id="rearRealisticWheel">
              <ellipse cx="110" cy="151" rx="25" ry="4.5" fill="black" fillOpacity="0.5" />
              {/* Heavy Pneumatic Tire */}
              <circle cx="110" cy="142" r="26" fill="url(#tireGrad)" stroke="#09090b" strokeWidth="3" />
              {/* Brass Rim Bead */}
              <circle cx="110" cy="142" r="22.5" stroke="url(#brassChrome)" strokeWidth="1.5" fill="none" />
              {/* Iron Brake Drum */}
              <circle cx="110" cy="142" r="13" fill="#27272a" stroke="#52525b" strokeWidth="1.2" />
              {/* 12 Heavy Artillery Wooden / Wire Spokes */}
              {Array.from({ length: 12 }).map((_, idx) => {
                const angle = (idx * 30 * Math.PI) / 180;
                const x2 = 110 + Math.cos(angle) * 22;
                const y2 = 142 + Math.sin(angle) * 22;
                return (
                  <line
                    key={idx}
                    x1="110"
                    y1="142"
                    x2={x2}
                    y2={y2}
                    stroke="url(#brassChrome)"
                    strokeWidth={idx % 2 === 0 ? '1.5' : '1'}
                  />
                );
              })}
              {/* Gleaming Polished Brass Hubcap with Specular Flare */}
              <circle cx="110" cy="142" r="6" fill="url(#brassChrome)" stroke="#451a03" strokeWidth="1.2" />
              <circle cx="108" cy="140" r="1.8" fill="#ffffff" />
            </g>

            {/* FRONT WHEEL */}
            <g id="frontRealisticWheel">
              <ellipse cx="300" cy="151" rx="25" ry="4.5" fill="black" fillOpacity="0.5" />
              {/* Heavy Pneumatic Tire */}
              <circle cx="300" cy="142" r="26" fill="url(#tireGrad)" stroke="#09090b" strokeWidth="3" />
              {/* Brass Rim Bead */}
              <circle cx="300" cy="142" r="22.5" stroke="url(#brassChrome)" strokeWidth="1.5" fill="none" />
              {/* Iron Brake Drum */}
              <circle cx="300" cy="142" r="13" fill="#27272a" stroke="#52525b" strokeWidth="1.2" />
              {/* 12 Heavy Artillery Wooden / Wire Spokes */}
              {Array.from({ length: 12 }).map((_, idx) => {
                const angle = (idx * 30 * Math.PI) / 180;
                const x2 = 300 + Math.cos(angle) * 22;
                const y2 = 142 + Math.sin(angle) * 22;
                return (
                  <line
                    key={idx}
                    x1="300"
                    y1="142"
                    x2={x2}
                    y2={y2}
                    stroke="url(#brassChrome)"
                    strokeWidth={idx % 2 === 0 ? '1.5' : '1'}
                  />
                );
              })}
              {/* Gleaming Polished Brass Hubcap with Specular Flare */}
              <circle cx="300" cy="142" r="6" fill="url(#brassChrome)" stroke="#451a03" strokeWidth="1.2" />
              <circle cx="298" cy="140" r="1.8" fill="#ffffff" />
            </g>
          </g>
        )}

        {/* ================= LAYER 3: PURE WIREFRAME CAD OVERLAY (When Draft Mode is Active) ================= */}
        {viewMode === 'draft_only' && (
          <g id="pureWireframeLayer" stroke={draftColors.wireframe} strokeWidth="1.5" fill={draftColors.wireframeGhost}>
            {/* Economy Wireframe */}
            {segment === 'economy' && (
              <>
                <path d="M 75 130 L 290 130 Q 315 125 310 90 Q 295 86 280 92 L 255 92 L 230 110 L 150 110 L 150 88 Q 158 66 180 64 L 218 64 L 228 88 L 228 130 Z" />
                <path d="M 80 130 L 80 96 L 150 96 L 150 130 Z" />
                <line x1="250" y1="125" x2="195" y2="76" strokeWidth="2" />
              </>
            )}
            {/* Family Wireframe */}
            {segment === 'family' && (
              <>
                <path d="M 65 130 L 335 130" strokeWidth="2.5" />
                <path d="M 80 130 L 85 100 Q 95 72 130 72 L 235 72 L 240 94 L 320 94 Q 332 94 335 130 Z" />
                <line x1="238" y1="94" x2="230" y2="56" strokeWidth="2" />
                <path d="M 180 130 L 185 86 Q 188 68 205 68 L 230 68" />
                <path d="M 120 130 L 125 86 Q 128 66 145 66 L 170 66" />
              </>
            )}
            {/* Luxury Wireframe */}
            {segment === 'luxury' && (
              <>
                <path d="M 55 130 L 345 130" strokeWidth="2.5" />
                <path d="M 85 130 L 85 58 Q 92 38 130 38 L 225 38 Q 242 38 248 60 L 248 130 Z" />
                <rect x="98" y="52" width="55" height="42" rx="3" fill="none" />
                <rect x="165" y="52" width="68" height="42" rx="3" fill="none" />
                <path d="M 280 94 L 342 94 L 342 130 L 254 130 Z" />
              </>
            )}
            {/* Utility Wireframe */}
            {segment === 'utility' && (
              <>
                <path d="M 60 130 L 340 130" strokeWidth="3" />
                <path d="M 75 130 L 75 48 Q 80 32 110 32 L 235 32 Q 248 32 248 46 L 248 130 Z" />
                <polygon points="248,48 280,53 277,86 248,86" fill="none" />
                <path d="M 282 86 L 338 86 L 338 130 L 248 130 Z" />
              </>
            )}

            {/* Wireframe Wheels */}
            <circle cx="110" cy="142" r="26" fill="none" strokeWidth="2" />
            <circle cx="110" cy="142" r="6" fill="none" strokeWidth="1" />
            <circle cx="300" cy="142" r="26" fill="none" strokeWidth="2" />
            <circle cx="300" cy="142" r="6" fill="none" strokeWidth="1" />
          </g>
        )}

        {/* ================= LAYER 4: TECHNICAL DIMENSION CALLOUTS ================= */}
        {showDraft && (
          <g id="dimensionCallouts">
            {/* 1. WHEELBASE (WB) Dimension: Between Axles (110 -> 300 = 190 units) */}
            <g stroke={draftColors.dimension} strokeWidth="1">
              {/* Dimension extension lines */}
              <line x1="110" y1="158" x2="110" y2="172" strokeWidth="0.7" />
              <line x1="300" y1="158" x2="300" y2="172" strokeWidth="0.7" />
              {/* Arrow line */}
              <line x1="110" y1="166" x2="300" y2="166" markerStart="url(#arrStart)" markerEnd="url(#arrEnd)" />
            </g>
            <text
              x="205"
              y="164"
              fill={draftColors.dimText}
              fontSize="7"
              fontFamily="monospace"
              fontWeight="bold"
              textAnchor="middle"
            >
              WB: {dimensions.wheelbase.toLocaleString()} mm
            </text>

            {/* 2. OVERALL LENGTH (L) Dimension: Top Dimension Callout */}
            <g stroke={draftColors.dimension} strokeWidth="0.8">
              <line x1="55" y1="22" x2="55" y2="35" strokeWidth="0.6" strokeDasharray="2 2" />
              <line x1="355" y1="22" x2="355" y2="35" strokeWidth="0.6" strokeDasharray="2 2" />
              <line x1="55" y1="26" x2="355" y2="26" markerStart="url(#arrStart)" markerEnd="url(#arrEnd)" />
            </g>
            <text
              x="205"
              y="23"
              fill={draftColors.dimText}
              fontSize="7.5"
              fontFamily="monospace"
              fontWeight="bold"
              textAnchor="middle"
            >
              L: {dimensions.length.toLocaleString()} mm
            </text>

            {/* 3. OVERALL HEIGHT (H) Dimension: Left Vertical Callout */}
            <g stroke={draftColors.dimension} strokeWidth="0.8">
              <line x1="28" y1="40" x2="42" y2="40" strokeWidth="0.6" strokeDasharray="2 2" />
              <line x1="28" y1="150" x2="42" y2="150" strokeWidth="0.6" />
              <line x1="34" y1="40" x2="34" y2="150" markerStart="url(#arrStart)" markerEnd="url(#arrEnd)" />
            </g>
            <text
              x="30"
              y="98"
              fill={draftColors.dimText}
              fontSize="7"
              fontFamily="monospace"
              fontWeight="bold"
              textAnchor="middle"
              transform="rotate(-90 30 98)"
            >
              H: {dimensions.height.toLocaleString()} mm
            </text>

            {/* 4. GROUND CLEARANCE (GC) Indicator */}
            <g stroke={draftColors.dimension} strokeWidth="0.7">
              <line x1="185" y1="130" x2="185" y2="150" markerStart="url(#arrStart)" markerEnd="url(#arrEnd)" />
            </g>
            <text
              x="190"
              y="142"
              fill={draftColors.dimText}
              fontSize="6"
              fontFamily="monospace"
            >
              GC: {dimensions.clearance}
            </text>

            {/* 5. AUTHENTIC CAD TITLE BLOCK (Штамп чертежа) */}
            <g transform="translate(290, 110)" opacity="0.95">
              {/* Outer Border */}
              <rect
                x="0"
                y="0"
                width="125"
                height="65"
                fill={draftColors.titleBg}
                stroke={draftColors.titleBorder}
                strokeWidth="1.2"
                rx="2"
              />
              {/* Table Dividers */}
              <line x1="0" y1="18" x2="125" y2="18" stroke={draftColors.titleBorder} strokeWidth="0.8" />
              <line x1="0" y1="36" x2="125" y2="36" stroke={draftColors.titleBorder} strokeWidth="0.8" />
              <line x1="60" y1="36" x2="60" y2="65" stroke={draftColors.titleBorder} strokeWidth="0.8" />

              {/* Title Block Text */}
              <text x="5" y="12" fill={draftColors.dimText} fontSize="6" fontFamily="serif" fontWeight="bold">
                {lang === 'en' ? 'BUREAU D\'ÉTUDES AUTOMOBILE' : lang === 'uk' ? 'КОНСТРУКТОРСЬКЕ БЮРО' : lang === 'de' ? 'KONSTRUKTIONSBÜRO' : 'КОНСТРУКТОРСКОЕ БЮРО'}
              </text>

              <text x="5" y="27" fill={draftColors.dimText} fontSize="5.5" fontFamily="monospace">
                DWG NO: <tspan fontWeight="bold" fill={draftColors.axis}>AG-{year}-M{segment[0]?.toUpperCase() ?? 'X'}</tspan>
              </text>

              <text x="5" y="47" fill={draftColors.dimText} fontSize="5" fontFamily="monospace">
                {lang === 'en' ? 'SCALE' : lang === 'uk' ? 'МАСШТАБ' : lang === 'de' ? 'MASSSTAB' : 'МАСШТАБ'}: <tspan fontWeight="bold">1 : 20</tspan>
              </text>
              <text x="5" y="58" fill={draftColors.dimText} fontSize="5" fontFamily="monospace">
                {lang === 'en' ? 'TOL' : lang === 'uk' ? 'ДОПУСК' : lang === 'de' ? 'TOL.' : 'ДОПУСК'}: ±0.05 mm
              </text>

              <text x="65" y="47" fill={draftColors.dimText} fontSize="5" fontFamily="monospace">
                {lang === 'en' ? 'STATUS' : lang === 'uk' ? 'СТАТУС' : lang === 'de' ? 'STATUS' : 'СТАТУС'}:
              </text>
              <text x="65" y="58" fill={draftColors.axis} fontSize="5.5" fontFamily="monospace" fontWeight="bold">
                {lang === 'en' ? 'APPROVED ✓' : lang === 'uk' ? 'СХВАЛЕНО ✓' : lang === 'de' ? 'GEPRÜFT ✓' : 'УТВЕРЖДЕНО ✓'}
              </text>
            </g>
          </g>
        )}
      </svg>
    </div>
  );
}
