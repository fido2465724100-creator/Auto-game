'use client';

import React from 'react';
import type { VehicleSegment } from '@ait/shared-types';

interface Props {
  segment: VehicleSegment;
  designYear?: number;
  className?: string;
  badge?: string;
}

export function CarVisualThumbnail({
  segment,
  designYear = 1900,
  className = '',
  badge,
}: Props): React.JSX.Element {
  // Determine historical design aesthetic era based on vehicle design year
  const era: 'pioneer' | 'art_deco' | 'classic_fins' | 'aero_wedge' | 'modern' =
    designYear < 1919
      ? 'pioneer'
      : designYear < 1945
      ? 'art_deco'
      : designYear < 1975
      ? 'classic_fins'
      : designYear < 2005
      ? 'aero_wedge'
      : 'modern';

  const uid = `${segment}-${era}`;

  return (
    <div
      className={`relative w-full rounded-lg overflow-hidden bg-gradient-to-b from-stone-900 via-stone-950 to-black border border-stone-800 shadow-inner flex items-center justify-center select-none ${className}`}
      style={{ minHeight: '84px' }}
    >
      {/* Vignette & Ambient Glow */}
      <div className="absolute inset-0 bg-radial from-amber-500/5 via-transparent to-black/60 pointer-events-none" />

      {/* ERA & SEGMENT WATERMARK */}
      <div className="absolute top-1 left-2 text-[9px] font-mono font-bold tracking-wider text-stone-500 uppercase flex items-center gap-1 z-10">
        <span>{designYear}</span>
        <span>•</span>
        <span>{segment}</span>
      </div>

      {badge && (
        <div className="absolute top-1 right-2 text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 z-10">
          {badge}
        </div>
      )}

      {/* SVG CAR RENDER */}
      <svg
        viewBox="0 0 320 120"
        className="w-full h-full max-h-28 object-contain drop-shadow-md relative z-0"
      >
        <defs>
          {/* Ground Shadow */}
          <radialGradient id={`groundShadow-${uid}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#000000" stopOpacity="0.8" />
            <stop offset="70%" stopColor="#000000" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>

          {/* Metal Chrome Gradient */}
          <linearGradient id={`chrome-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="30%" stopColor="#cbd5e1" />
            <stop offset="50%" stopColor="#94a3b8" />
            <stop offset="75%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#64748b" />
          </linearGradient>

          {/* Vintage Brass Gradient */}
          <linearGradient id={`brass-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="40%" stopColor="#ca8a04" />
            <stop offset="80%" stopColor="#854d0e" />
            <stop offset="100%" stopColor="#fef08a" />
          </linearGradient>

          {/* Window Sky Horizon Gradient */}
          <linearGradient id={`glass-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.85" />
            <stop offset="45%" stopColor="#0284c7" stopOpacity="0.75" />
            <stop offset="55%" stopColor="#0c4a6e" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#082f49" stopOpacity="0.95" />
          </linearGradient>

          {/* Body Colors by Segment */}
          {segment === 'luxury' && (
            <linearGradient id={`body-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e1b4b" />
              <stop offset="30%" stopColor="#312e81" />
              <stop offset="70%" stopColor="#1e1b4b" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
          )}

          {segment === 'family' && (
            <linearGradient id={`body-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#064e3b" />
              <stop offset="30%" stopColor="#047857" />
              <stop offset="70%" stopColor="#065f46" />
              <stop offset="100%" stopColor="#022c22" />
            </linearGradient>
          )}

          {segment === 'economy' && (
            <linearGradient id={`body-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#881337" />
              <stop offset="30%" stopColor="#be123c" />
              <stop offset="70%" stopColor="#9f1239" />
              <stop offset="100%" stopColor="#4c0519" />
            </linearGradient>
          )}

          {segment === 'utility' && (
            <linearGradient id={`body-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#451a03" />
              <stop offset="30%" stopColor="#78350f" />
              <stop offset="70%" stopColor="#542308" />
              <stop offset="100%" stopColor="#291104" />
            </linearGradient>
          )}

          {/* Rubber Tire Gradient */}
          <linearGradient id={`tire-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#27272a" />
            <stop offset="50%" stopColor="#18181b" />
            <stop offset="100%" stopColor="#09090b" />
          </linearGradient>
        </defs>

        {/* 1. GROUND SHADOW */}
        <ellipse cx="160" cy="108" rx="135" ry="7" fill={`url(#groundShadow-${uid})`} />

        {/* ======================================================== */}
        {/* 2. ERA-SPECIFIC CAR BODIES */}
        {/* ======================================================== */}

        {/* --- ERA 1: PIONEER (1900-1918) --- */}
        {era === 'pioneer' && (
          <g id="pioneerBody">
            {segment === 'utility' ? (
              // Pioneer Delivery Wagon
              <>
                <rect x="50" y="32" width="130" height="58" rx="3" fill={`url(#body-${uid})`} stroke="#1c1917" strokeWidth="2" />
                <line x1="50" y1="50" x2="180" y2="50" stroke="#000" strokeWidth="1.5" opacity="0.4" />
                <line x1="50" y1="68" x2="180" y2="68" stroke="#000" strokeWidth="1.5" opacity="0.4" />
                {/* Cab */}
                <path d="M 180 32 L 210 44 L 210 90 L 180 90 Z" fill={`url(#body-${uid})`} stroke="#1c1917" strokeWidth="2" />
                <rect x="184" y="44" width="22" height="26" fill={`url(#glass-${uid})`} stroke="#000" strokeWidth="1" />
                {/* Flat Hood & Radiator */}
                <path d="M 210 65 L 260 65 L 260 90 L 210 90 Z" fill={`url(#body-${uid})`} stroke="#1c1917" strokeWidth="1.8" />
                <rect x="258" y="58" width="8" height="32" rx="2" fill={`url(#brass-${uid})`} stroke="#78350f" strokeWidth="1.2" />
                {/* Brass Headlight */}
                <circle cx="264" cy="62" r="5" fill="#fef08a" stroke={`url(#brass-${uid})`} strokeWidth="1.5" />
              </>
            ) : segment === 'luxury' ? (
              // Pioneer Imperial Tonneau / Limousine
              <>
                <path d="M 50 88 L 60 48 Q 70 30 110 30 L 195 30 Q 205 30 205 52 L 205 88 Z" fill={`url(#body-${uid})`} stroke={`url(#brass-${uid})`} strokeWidth="1.8" />
                {/* Beveled Passenger Windows */}
                <rect x="80" y="38" width="40" height="28" rx="2" fill={`url(#glass-${uid})`} stroke={`url(#brass-${uid})`} strokeWidth="1" />
                <rect x="130" y="38" width="45" height="28" rx="2" fill={`url(#glass-${uid})`} stroke={`url(#brass-${uid})`} strokeWidth="1" />
                {/* Chauffeur Cockpit */}
                <path d="M 205 52 L 230 52 L 230 88 L 205 88 Z" fill={`url(#body-${uid})`} stroke="#1c1917" strokeWidth="1.5" />
                {/* Long Torpedo Hood & Grand Radiator */}
                <path d="M 230 62 L 275 66 L 275 88 L 230 88 Z" fill={`url(#body-${uid})`} stroke="#1c1917" strokeWidth="1.5" />
                <rect x="273" y="52" width="9" height="36" rx="2" fill={`url(#brass-${uid})`} stroke="#78350f" strokeWidth="1.2" />
                <circle cx="280" cy="58" r="6" fill="#fef08a" stroke={`url(#brass-${uid})`} strokeWidth="1.5" />
              </>
            ) : (
              // Pioneer High-Wheel Runabout / Tourer (Economy & Family)
              <>
                {/* Curved Horseless Carriage Tub */}
                <path
                  d="M 60 86 Q 70 56 120 56 L 190 56 Q 210 56 220 70 L 265 72 L 265 88 L 60 88 Z"
                  fill={`url(#body-${uid})`}
                  stroke={`url(#brass-${uid})`}
                  strokeWidth="1.5"
                />
                {/* Tufted Leather Bench Seat */}
                <rect x="120" y="44" width="45" height="20" rx="4" fill="#3f2e22" stroke="#1c1917" strokeWidth="1.5" />
                <rect x="110" y="40" width="12" height="24" rx="2" fill="#29180d" stroke="#1c1917" strokeWidth="1" />
                {/* Wooden Steering Column */}
                <line x1="185" y1="52" x2="175" y2="70" stroke={`url(#brass-${uid})`} strokeWidth="3" />
                <ellipse cx="187" cy="50" rx="9" ry="3" fill="#1c1917" stroke={`url(#brass-${uid})`} strokeWidth="1" />
                {/* Front Radiator & Brass Lantern */}
                <rect x="263" y="62" width="7" height="26" rx="2" fill={`url(#brass-${uid})`} stroke="#78350f" strokeWidth="1.2" />
                <circle cx="268" cy="66" r="5" fill="#fef08a" stroke={`url(#brass-${uid})`} strokeWidth="1.5" />
                {/* Swept Fenders */}
                <path d="M 45 86 Q 60 62 95 68 Q 115 76 130 88" stroke="#1c1917" strokeWidth="3" fill="none" />
                <path d="M 195 88 Q 210 68 245 68 Q 265 72 275 88" stroke="#1c1917" strokeWidth="3" fill="none" />
              </>
            )}
          </g>
        )}

        {/* --- ERA 2: ART DECO & 1930s (STREAMLINE) --- */}
        {era === 'art_deco' && (
          <g id="artDecoBody">
            {/* Aerodynamic Teardrop Roofline */}
            <path
              d="M 52 86 Q 58 55 105 40 Q 170 32 205 46 L 225 64 L 278 68 Q 284 76 280 88 L 52 88 Z"
              fill={`url(#body-${uid})`}
              stroke={`url(#chrome-${uid})`}
              strokeWidth="1.5"
            />
            {/* Streamline Split Windows */}
            <path d="M 112 45 L 152 42 L 152 64 L 105 64 Z" fill={`url(#glass-${uid})`} stroke={`url(#chrome-${uid})`} strokeWidth="1" />
            <path d="M 158 42 L 202 46 L 216 64 L 158 64 Z" fill={`url(#glass-${uid})`} stroke={`url(#chrome-${uid})`} strokeWidth="1" />
            {/* Massive Waterfall Chrome Grille */}
            <path d="M 276 66 Q 285 75 282 90 L 273 90 Z" fill={`url(#chrome-${uid})`} stroke="#334155" strokeWidth="1.5" />
            <line x1="277" y1="70" x2="277" y2="88" stroke="#1e293b" strokeWidth="1" />
            <line x1="280" y1="72" x2="280" y2="88" stroke="#1e293b" strokeWidth="1" />
            {/* Streamlined Bullet Headlight */}
            <ellipse cx="270" cy="65" rx="6" ry="4" fill="#fef08a" stroke={`url(#chrome-${uid})`} strokeWidth="1.5" />
            {/* Chrome Beltline Waist Trim */}
            <line x1="60" y1="65" x2="273" y2="67" stroke={`url(#chrome-${uid})`} strokeWidth="1.5" />
            {/* Heavy Bulbous Pontoon Fenders */}
            <path d="M 46 88 Q 55 58 95 64 Q 120 72 135 90" stroke="#09090b" strokeWidth="4" fill="none" />
            <path d="M 195 90 Q 215 62 255 64 Q 280 72 286 90" stroke="#09090b" strokeWidth="4" fill="none" />
          </g>
        )}

        {/* --- ERA 3: CLASSIC FINS & CHROME (1945-1974) --- */}
        {era === 'classic_fins' && (
          <g id="classicFinsBody">
            {/* Low-slung Cruiser with Prominent Tailfin */}
            <path
              d="M 45 60 Q 55 68 62 88 L 285 88 Q 288 78 285 70 L 245 68 L 215 46 L 125 46 L 95 64 L 45 60 Z"
              fill={`url(#body-${uid})`}
              stroke={`url(#chrome-${uid})`}
              strokeWidth="1.6"
            />
            {/* Panoramic Wrap-around Windshield */}
            <polygon points="100,64 128,48 212,48 238,64 100,64" fill={`url(#glass-${uid})`} stroke={`url(#chrome-${uid})`} strokeWidth="1" />
            {/* Rocket Tailfin Chrome Tip */}
            <polygon points="45,60 56,66 48,72" fill={`url(#chrome-${uid})`} />
            <circle cx="46" cy="62" r="2.5" fill="#ef4444" />
            {/* Dazzling Chrome Grille & Double Headlights */}
            <rect x="280" y="70" width="8" height="18" rx="2" fill={`url(#chrome-${uid})`} stroke="#475569" strokeWidth="1" />
            <circle cx="282" cy="74" r="3" fill="#fef08a" stroke="#fff" strokeWidth="1" />
            <circle cx="282" cy="82" r="3" fill="#fef08a" stroke="#fff" strokeWidth="1" />
            {/* Side Chrome Spear Moulding */}
            <path d="M 52 74 L 140 74 L 200 78 L 282 78" stroke={`url(#chrome-${uid})`} strokeWidth="2" fill="none" />
          </g>
        )}

        {/* --- ERA 4: AERO WEDGE & INNOVATION (1975-2004) --- */}
        {era === 'aero_wedge' && (
          <g id="aeroWedgeBody">
            {/* Geometric Sharp Wedge Silhouette */}
            <path
              d="M 50 86 L 50 68 L 105 66 L 145 46 L 220 46 L 265 68 L 290 76 L 290 88 Z"
              fill={`url(#body-${uid})`}
              stroke="#334155"
              strokeWidth="1.5"
            />
            {/* Aerodynamic Green-Tinted Glasshouse */}
            <polygon points="110,65 147,48 217,48 258,65" fill={`url(#glass-${uid})`} stroke="#0f172a" strokeWidth="1.2" />
            {/* Pop-up Headlight Covers or Rectangular Composite Lenses */}
            <polygon points="268,69 285,73 285,78 268,76" fill="#f8fafc" stroke="#64748b" strokeWidth="1" />
            {/* Matte Black Impact Bumper & Side Trim Strip */}
            <rect x="46" y="80" width="10" height="8" rx="1.5" fill="#09090b" />
            <rect x="284" y="80" width="8" height="8" rx="1.5" fill="#09090b" />
            <line x1="56" y1="80" x2="284" y2="80" stroke="#09090b" strokeWidth="2.5" />
          </g>
        )}

        {/* --- ERA 5: MODERN & ELECTRIC (2005-2026+) --- */}
        {era === 'modern' && (
          <g id="modernBody">
            {/* Fastback Coupe/Sedan Fluid Aerodynamics */}
            <path
              d="M 48 84 Q 52 64 95 56 Q 155 36 215 48 L 268 64 Q 288 72 290 84 L 48 84 Z"
              fill={`url(#body-${uid})`}
              stroke={`url(#chrome-${uid})`}
              strokeWidth="1.2"
            />
            {/* Panoramic Canopy */}
            <path d="M 105 56 Q 160 40 212 50 L 252 65 L 100 65 Z" fill={`url(#glass-${uid})`} stroke="#0f172a" strokeWidth="1" />
            {/* Modern LED Matrix Projector Lightbar */}
            <path d="M 265 66 Q 285 72 288 74 L 284 78 Z" fill="#38bdf8" stroke="#e0f2fe" strokeWidth="1" />
            {/* Rear LED Halo Strip */}
            <path d="M 50 68 Q 48 74 52 78" stroke="#ef4444" strokeWidth="2" fill="none" />
            {/* Sculpted Bottom Aero Skirt */}
            <line x1="125" y1="84" x2="215" y2="84" stroke="#09090b" strokeWidth="3" />
          </g>
        )}

        {/* ======================================================== */}
        {/* 3. WHEELS & SUSPENSION (Era-styled) */}
        {/* ======================================================== */}

        {/* REAR WHEEL (cx=92, cy=96) */}
        <g id="wheelRear">
          <circle cx="92" cy="96" r="18" fill={`url(#tire-${uid})`} stroke="#000" strokeWidth="1.8" />
          {era === 'pioneer' ? (
            // Spoke Wheel
            <>
              <circle cx="92" cy="96" r="15" fill="none" stroke={`url(#brass-${uid})`} strokeWidth="1" />
              <circle cx="92" cy="96" r="6" fill={`url(#brass-${uid})`} />
              {Array.from({ length: 8 }).map((_, i) => (
                <line
                  key={i}
                  x1="92"
                  y1="96"
                  x2={92 + Math.cos((i * 45 * Math.PI) / 180) * 15}
                  y2={96 + Math.sin((i * 45 * Math.PI) / 180) * 15}
                  stroke={`url(#brass-${uid})`}
                  strokeWidth="1"
                />
              ))}
            </>
          ) : era === 'art_deco' || era === 'classic_fins' ? (
            // Chrome Dish Cap with Whitewall
            <>
              <circle cx="92" cy="96" r="15" fill="#f8fafc" stroke="#000" strokeWidth="0.8" />
              <circle cx="92" cy="96" r="10" fill={`url(#chrome-${uid})`} stroke="#475569" strokeWidth="1" />
              <circle cx="92" cy="96" r="4" fill="#09090b" />
            </>
          ) : (
            // Modern Alloy Spoke Rim
            <>
              <circle cx="92" cy="96" r="13" fill="#1e293b" stroke={`url(#chrome-${uid})`} strokeWidth="1.2" />
              <circle cx="92" cy="96" r="4" fill={`url(#chrome-${uid})`} />
              {Array.from({ length: 5 }).map((_, i) => (
                <line
                  key={i}
                  x1="92"
                  y1="96"
                  x2={92 + Math.cos((i * 72 * Math.PI) / 180) * 13}
                  y2={96 + Math.sin((i * 72 * Math.PI) / 180) * 13}
                  stroke={`url(#chrome-${uid})`}
                  strokeWidth="2"
                />
              ))}
            </>
          )}
        </g>

        {/* FRONT WHEEL (cx=242, cy=96) */}
        <g id="wheelFront">
          <circle cx="242" cy="96" r="18" fill={`url(#tire-${uid})`} stroke="#000" strokeWidth="1.8" />
          {era === 'pioneer' ? (
            // Spoke Wheel
            <>
              <circle cx="242" cy="96" r="15" fill="none" stroke={`url(#brass-${uid})`} strokeWidth="1" />
              <circle cx="242" cy="96" r="6" fill={`url(#brass-${uid})`} />
              {Array.from({ length: 8 }).map((_, i) => (
                <line
                  key={i}
                  x1="242"
                  y1="96"
                  x2={242 + Math.cos((i * 45 * Math.PI) / 180) * 15}
                  y2={96 + Math.sin((i * 45 * Math.PI) / 180) * 15}
                  stroke={`url(#brass-${uid})`}
                  strokeWidth="1"
                />
              ))}
            </>
          ) : era === 'art_deco' || era === 'classic_fins' ? (
            // Chrome Dish Cap with Whitewall
            <>
              <circle cx="242" cy="96" r="15" fill="#f8fafc" stroke="#000" strokeWidth="0.8" />
              <circle cx="242" cy="96" r="10" fill={`url(#chrome-${uid})`} stroke="#475569" strokeWidth="1" />
              <circle cx="242" cy="96" r="4" fill="#09090b" />
            </>
          ) : (
            // Modern Alloy Spoke Rim
            <>
              <circle cx="242" cy="96" r="13" fill="#1e293b" stroke={`url(#chrome-${uid})`} strokeWidth="1.2" />
              <circle cx="242" cy="96" r="4" fill={`url(#chrome-${uid})`} />
              {Array.from({ length: 5 }).map((_, i) => (
                <line
                  key={i}
                  x1="242"
                  y1="96"
                  x2={242 + Math.cos((i * 72 * Math.PI) / 180) * 13}
                  y2={96 + Math.sin((i * 72 * Math.PI) / 180) * 13}
                  stroke={`url(#chrome-${uid})`}
                  strokeWidth="2"
                />
              ))}
            </>
          )}
        </g>
      </svg>
    </div>
  );
}
