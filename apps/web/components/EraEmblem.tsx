import React from 'react';
import type { EraId } from '../lib/eraTheme';

interface EraEmblemProps {
  eraId: EraId;
  className?: string;
  size?: number;
}

export function EraEmblem({ eraId, className = '', size = 44 }: EraEmblemProps): React.JSX.Element {
  switch (eraId) {
    case 'era-1900':
      // Victorian Bog Oak, Brass & Steam Piston Medallion
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`shrink-0 select-none ${className}`}
          aria-label="Pioneer Era Brass & Oak Medallion"
        >
          <defs>
            <radialGradient id="oakWood" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#3d2115" />
              <stop offset="70%" stopColor="#221109" />
              <stop offset="100%" stopColor="#140703" />
            </radialGradient>
            <linearGradient id="brassBezel" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="25%" stopColor="#d97706" />
              <stop offset="50%" stopColor="#92400e" />
              <stop offset="75%" stopColor="#fef3c7" />
              <stop offset="100%" stopColor="#78350f" />
            </linearGradient>
            <linearGradient id="copperRivet" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fed7aa" />
              <stop offset="100%" stopColor="#9a3412" />
            </linearGradient>
          </defs>

          {/* Outer Gear Teeth */}
          <path
            d="M32 2L35 6L40 4L42 9L47 8L48 13L53 14L53 19L58 21L57 26L61 29L59 34L62 38L59 42L61 47L56 50L56 55L51 56L49 61L44 60L41 64L37 62L32 64L28 61L24 63L21 59L16 59L15 54L10 53L10 48L5 46L6 41L2 38L5 33L2 29L7 26L6 21L11 19L11 14L16 13L17 8L22 9L24 4L29 6Z"
            fill="url(#brassBezel)"
          />

          {/* Dark Bog Oak Inset */}
          <circle cx="32" cy="32" r="23" fill="url(#oakWood)" stroke="#b45309" strokeWidth="2" />

          {/* Inner Brass Ring */}
          <circle cx="32" cy="32" r="18" fill="none" stroke="url(#brassBezel)" strokeWidth="1.5" strokeDasharray="3 2" />

          {/* Steam Locomotive Wheel Spokes / Cog */}
          <g stroke="url(#brassBezel)" strokeWidth="2" strokeLinecap="round">
            <line x1="32" y1="15" x2="32" y2="49" />
            <line x1="15" y1="32" x2="49" y2="32" />
            <line x1="20" y1="20" x2="44" y2="44" />
            <line x1="20" y1="44" x2="44" y2="20" />
          </g>

          {/* Center Brass Hub with Crown Nut */}
          <circle cx="32" cy="32" r="6" fill="url(#brassBezel)" stroke="#78350f" strokeWidth="1" />
          <circle cx="32" cy="32" r="2.5" fill="#451a03" />

          {/* 4 Corner Rivets */}
          <circle cx="21" cy="21" r="1.5" fill="url(#copperRivet)" />
          <circle cx="43" cy="21" r="1.5" fill="url(#copperRivet)" />
          <circle cx="21" cy="43" r="1.5" fill="url(#copperRivet)" />
          <circle cx="43" cy="43" r="1.5" fill="url(#copperRivet)" />
        </svg>
      );

    case 'era-1920':
      // Art Deco Chrome Wing & 24K Gold Sunburst Mascot (Packard / Duesenberg inspired)
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`shrink-0 select-none ${className}`}
          aria-label="Art Deco Chrome Wing Radiator Mascot"
        >
          <defs>
            <linearGradient id="chromeGloss" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="30%" stopColor="#cbd5e1" />
              <stop offset="50%" stopColor="#64748b" />
              <stop offset="70%" stopColor="#f1f5f9" />
              <stop offset="100%" stopColor="#334155" />
            </linearGradient>
            <linearGradient id="decoGold" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="40%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>
          </defs>

          {/* Art Deco Obsidian Shield */}
          <polygon
            points="32,4 58,18 48,54 32,62 16,54 6,18"
            fill="#060a12"
            stroke="url(#chromeGloss)"
            strokeWidth="2"
          />

          {/* Gold Sunburst Rays */}
          <g stroke="url(#decoGold)" strokeWidth="1.2" opacity="0.8">
            <line x1="32" y1="28" x2="32" y2="10" />
            <line x1="32" y1="28" x2="44" y2="14" />
            <line x1="32" y1="28" x2="20" y2="14" />
            <line x1="32" y1="28" x2="50" y2="24" />
            <line x1="32" y1="28" x2="14" y2="24" />
          </g>

          {/* Streamlined Polished Chrome Wings */}
          <path
            d="M32 20C24 16 12 20 8 28C14 26 22 28 32 36C42 28 50 26 56 28C52 20 40 16 32 20Z"
            fill="url(#chromeGloss)"
            stroke="#ffffff"
            strokeWidth="0.8"
          />
          <path
            d="M32 28C26 24 16 28 12 34C18 33 24 35 32 42C40 35 46 33 52 34C48 28 38 24 32 28Z"
            fill="url(#chromeGloss)"
            opacity="0.9"
          />

          {/* Central Gold Radiator Chevron */}
          <polygon points="32,24 37,34 32,48 27,34" fill="url(#decoGold)" stroke="#fef08a" strokeWidth="0.8" />
          <circle cx="32" cy="32" r="3" fill="#ffffff" />
          <polygon points="32,50 36,56 32,60 28,56" fill="url(#decoGold)" />
        </svg>
      );

    case 'era-1940':
      // Aeronautical Chrome Wing & Bakelite Engine Ring
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`shrink-0 select-none ${className}`}
        >
          <defs>
            <radialGradient id="bakeliteRing" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#6b1d24" />
              <stop offset="80%" stopColor="#3d0e12" />
              <stop offset="100%" stopColor="#200507" />
            </radialGradient>
            <linearGradient id="aeroChrome" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#94a3b8" />
              <stop offset="50%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#64748b" />
            </linearGradient>
          </defs>
          <circle cx="32" cy="32" r="28" fill="url(#bakeliteRing)" stroke="url(#aeroChrome)" strokeWidth="3" />
          {/* 3-Blade Radial Propeller */}
          <path d="M32 32L30 10C32 8 34 8 36 10L32 32Z" fill="url(#aeroChrome)" />
          <path d="M32 32L13 43C11 41 12 39 15 38L32 32Z" fill="url(#aeroChrome)" />
          <path d="M32 32L51 43C53 41 52 39 49 38L32 32Z" fill="url(#aeroChrome)" />
          <circle cx="32" cy="32" r="7" fill="url(#aeroChrome)" stroke="#cbd5e1" strokeWidth="1" />
          <circle cx="32" cy="32" r="3" fill="#be123c" />
        </svg>
      );

    case 'era-1960':
      // Muscle-Car Crossed Checkered Flags & Dual Chrome Exhaust
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`shrink-0 select-none ${className}`}
        >
          <defs>
            <linearGradient id="muscleOrange" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fb923c" />
              <stop offset="100%" stopColor="#c2410c" />
            </linearGradient>
          </defs>
          <rect x="8" y="8" width="48" height="48" rx="8" fill="#18181b" stroke="#f97316" strokeWidth="2.5" />
          {/* Racing Stripes */}
          <rect x="26" y="8" width="5" height="48" fill="#f97316" />
          <rect x="33" y="8" width="5" height="48" fill="#f97316" />
          {/* Tachometer / V8 Emblem */}
          <circle cx="32" cy="32" r="14" fill="#09090b" stroke="#e4e4e7" strokeWidth="2" />
          <path d="M24 38A10 10 0 1 1 40 38" stroke="url(#muscleOrange)" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="32" y1="32" x2="38" y2="24" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
          <circle cx="32" cy="32" r="2.5" fill="#e4e4e7" />
        </svg>
      );

    case 'era-1980':
      // 80s Turbo Digital VFD & Microchip Badge
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`shrink-0 select-none ${className}`}
        >
          <rect x="6" y="10" width="52" height="44" rx="4" fill="#040906" stroke="#10b981" strokeWidth="2" />
          {/* Matrix Grid */}
          <g stroke="#064e3b" strokeWidth="0.8">
            <line x1="6" y1="22" x2="58" y2="22" />
            <line x1="6" y1="34" x2="58" y2="34" />
            <line x1="6" y1="46" x2="58" y2="46" />
            <line x1="20" y1="10" x2="20" y2="54" />
            <line x1="34" y1="10" x2="34" y2="54" />
            <line x1="48" y1="10" x2="48" y2="54" />
          </g>
          {/* Glowing Digital Turbo Boost Gauge */}
          <path d="M16 42 L24 24 L32 20 L40 24 L48 42" stroke="#34d399" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="32" cy="34" r="4" fill="#10b981" />
          <text x="32" y="50" fill="#34d399" fontSize="8" fontFamily="monospace" fontWeight="bold" textAnchor="middle">TURBO</text>
        </svg>
      );

    case 'era-2000':
      // Satin Titanium Ellipse & Precision Airfoil
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`shrink-0 select-none ${className}`}
        >
          <defs>
            <linearGradient id="titaniumGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f8fafc" />
              <stop offset="50%" stopColor="#94a3b8" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>
          </defs>
          <ellipse cx="32" cy="32" rx="28" ry="20" fill="#0f172a" stroke="url(#titaniumGrad)" strokeWidth="2.5" />
          <ellipse cx="32" cy="32" rx="22" ry="14" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="6 3" />
          {/* Precision Aerospace Dynamic Ring */}
          <path d="M14 32C22 22 42 22 50 32C42 42 22 42 14 32Z" fill="url(#titaniumGrad)" />
          <circle cx="32" cy="32" r="5" fill="#0284c7" stroke="#ffffff" strokeWidth="1" />
        </svg>
      );

    case 'era-2020':
    default:
      // Woven Carbon-Fiber Hexagon & Electric Hypercar Splitter
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`shrink-0 select-none ${className}`}
        >
          <defs>
            <linearGradient id="cyanLaser" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a5f3fc" />
              <stop offset="50%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#0891b2" />
            </linearGradient>
          </defs>
          <polygon
            points="32,4 58,18 58,46 32,60 6,46 6,18"
            fill="#020617"
            stroke="url(#cyanLaser)"
            strokeWidth="2"
          />
          {/* Carbon Grid Substructure */}
          <polygon points="32,10 52,22 52,42 32,54 12,42 12,22" fill="#081020" stroke="#1e293b" strokeWidth="1" />
          {/* Cyber Splitter */}
          <path d="M18 36L32 24L46 36L32 30Z" fill="url(#cyanLaser)" />
          <circle cx="32" cy="40" r="3" fill="#22d3ee" />
        </svg>
      );
  }
}
