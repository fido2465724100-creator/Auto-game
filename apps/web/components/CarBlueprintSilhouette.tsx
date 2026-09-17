import React from 'react';
import type { VehicleSegment } from '@ait/shared-types';

interface Props {
  segment: VehicleSegment;
  powertrain?: 'steam' | 'electric' | 'ice';
  className?: string;
  accentColor?: string;
}

export function CarBlueprintSilhouette({
  segment,
  powertrain = 'ice',
  className = '',
  accentColor = '#b45309',
}: Props): React.JSX.Element {
  return (
    <div className={`relative flex items-center justify-center overflow-hidden rounded-md border border-dashed border-stone-400/40 bg-stone-900/5 p-2 ${className}`}>
      <svg
        viewBox="0 0 200 90"
        className="w-full h-auto max-h-24 select-none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background Blueprint Grid lines */}
        <line x1="0" y1="45" x2="200" y2="45" stroke="currentColor" strokeOpacity="0.08" strokeDasharray="2 2" />
        <line x1="0" y1="75" x2="200" y2="75" stroke="currentColor" strokeOpacity="0.15" />
        <line x1="100" y1="0" x2="100" y2="90" stroke="currentColor" strokeOpacity="0.08" strokeDasharray="2 2" />

        {/* --- CAR BODY ACCORDING TO SEGMENT --- */}
        {segment === 'economy' && (
          /* RUNABOUT (Light 2-seater buggy) */
          <g stroke={accentColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            {/* Chassis & floorboard */}
            <path d="M 35 66 L 165 66" />
            <path d="M 45 66 L 55 52 L 145 52 L 155 66" fill="currentColor" fillOpacity="0.05" />
            {/* Curved Runabout dash / front apron */}
            <path d="M 145 52 Q 165 42 162 28" />
            {/* Single buggy bench seat */}
            <path d="M 85 52 L 85 30 Q 85 24 95 24 L 115 24 L 115 52" fill="currentColor" fillOpacity="0.1" />
            {/* Tiller / steering column */}
            <path d="M 125 52 L 115 32 L 105 30" />
            {/* Rear luggage deck */}
            <path d="M 55 52 L 55 42 L 85 42" />
            {/* Lantern */}
            <circle cx="163" cy="28" r="3" fill="#f59e0b" stroke="#78350f" strokeWidth="1" />
          </g>
        )}

        {segment === 'family' && (
          /* TOURER / PHAETON (4-seater with folded canopy) */
          <g stroke={accentColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            {/* Main Long Chassis */}
            <path d="M 30 66 L 170 66" />
            {/* Body tub */}
            <path d="M 40 66 L 50 48 L 150 48 L 165 66" fill="currentColor" fillOpacity="0.05" />
            {/* Hood cowl */}
            <path d="M 130 48 L 160 48 L 165 66" />
            {/* Front & Rear Bench Seats */}
            <path d="M 60 48 L 60 26 Q 60 22 70 22 L 85 22 L 88 48" fill="currentColor" fillOpacity="0.1" />
            <path d="M 100 48 L 100 26 Q 100 22 110 22 L 125 22 L 128 48" fill="currentColor" fillOpacity="0.1" />
            {/* Folded rear canvas top */}
            <path d="M 46 48 Q 42 32 58 35" stroke="#78350f" strokeWidth="2.5" />
            {/* Steering wheel */}
            <line x1="135" y1="48" x2="128" y2="30" />
            <ellipse cx="127" cy="28" rx="5" ry="2" transform="rotate(-20 127 28)" />
            {/* Big brass headlight */}
            <path d="M 166 45 L 174 42 L 174 54 L 166 51 Z" fill="#f59e0b" stroke="#78350f" strokeWidth="1" />
          </g>
        )}

        {segment === 'luxury' && (
          /* LIMOUSINE / BROUGHAM (Enclosed royal carriage cabin) */
          <g stroke={accentColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            {/* Heavy chassis */}
            <path d="M 28 66 L 172 66" strokeWidth="2.2" />
            {/* High curved roof enclosed cabin */}
            <path
              d="M 45 66 L 45 32 Q 45 16 70 16 L 125 16 Q 135 16 135 32 L 135 50 L 165 50 L 170 66"
              fill="currentColor"
              fillOpacity="0.08"
            />
            {/* Bevelled glass windows */}
            <rect x="52" y="22" width="28" height="22" rx="2" stroke="#38bdf8" strokeWidth="1.2" fill="#e0f2fe" fillOpacity="0.3" />
            <rect x="86" y="22" width="28" height="22" rx="2" stroke="#38bdf8" strokeWidth="1.2" fill="#e0f2fe" fillOpacity="0.3" />
            {/* Chauffeur partition / open driver area */}
            <line x1="118" y1="16" x2="118" y2="50" />
            {/* Driver bench */}
            <path d="M 125 50 L 125 34 L 138 34" />
            {/* Steering wheel */}
            <line x1="145" y1="50" x2="140" y2="34" />
            <ellipse cx="139" cy="32" rx="5" ry="2" transform="rotate(-15 139 32)" />
            {/* Polished radiator grille */}
            <line x1="168" y1="46" x2="168" y2="66" strokeWidth="3" stroke="#d97706" />
            {/* Carriage lantern */}
            <rect x="42" y="28" width="4" height="10" rx="1" fill="#f59e0b" stroke="#78350f" strokeWidth="1" />
          </g>
        )}

        {segment === 'utility' && (
          /* UTILITY TRUCK / VAN (Heavy wooden delivery flatbed) */
          <g stroke={accentColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            {/* Heavy-duty steel ladder chassis */}
            <path d="M 25 66 L 175 66" strokeWidth="2.5" />
            {/* Driver cab */}
            <path d="M 115 66 L 115 24 L 148 24 L 152 48 L 168 48 L 172 66" fill="currentColor" fillOpacity="0.06" />
            {/* Cab window */}
            <rect x="122" y="28" width="22" height="16" rx="1" stroke="#38bdf8" strokeWidth="1.2" fill="#e0f2fe" fillOpacity="0.2" />
            {/* Wooden cargo bed walls */}
            <path d="M 32 66 L 32 36 L 115 36 L 115 66" fill="#78350f" fillOpacity="0.1" stroke="#78350f" strokeWidth="1.8" />
            {/* Cargo slats */}
            <line x1="32" y1="46" x2="115" y2="46" stroke="#78350f" strokeWidth="1.2" />
            <line x1="32" y1="56" x2="115" y2="56" stroke="#78350f" strokeWidth="1.2" />
            <line x1="60" y1="36" x2="60" y2="66" stroke="#78350f" strokeWidth="1.2" />
            <line x1="88" y1="36" x2="88" y2="66" stroke="#78350f" strokeWidth="1.2" />
          </g>
        )}

        {/* --- POWERTRAIN BADGE & ACCESSORIES --- */}
        {powertrain === 'steam' && (
          <g>
            {/* Upright boiler cylinder & steam exhaust */}
            <rect x="146" y="32" width="14" height="22" rx="2" fill="#44403c" stroke="#78716c" strokeWidth="1" />
            <line x1="153" y1="32" x2="153" y2="18" stroke="#78716c" strokeWidth="2" />
            <path d="M 153 16 Q 150 10 156 8 Q 162 6 158 2" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="1 1" />
          </g>
        )}

        {powertrain === 'electric' && (
          <g>
            {/* Heavy Edison battery undercarriage tray */}
            <rect x="75" y="68" width="50" height="7" rx="1" fill="#0284c7" fillOpacity="0.6" stroke="#0369a1" strokeWidth="1" />
            <path d="M 98 70 L 102 70 L 99 74 L 103 74" stroke="#fde047" strokeWidth="1" />
          </g>
        )}

        {powertrain === 'ice' && (
          <g>
            {/* Hand-crank handle at the very front */}
            <path d="M 172 63 L 180 63 L 180 69 L 185 69" stroke="#78350f" strokeWidth="1.5" strokeLinecap="round" />
          </g>
        )}

        {/* --- WHEELS & LEAF SPRINGS --- */}
        {/* Leaf springs */}
        <path d="M 40 66 Q 52 61 64 66" stroke="#57534e" strokeWidth="2" fill="none" />
        <path d="M 136 66 Q 148 61 160 66" stroke="#57534e" strokeWidth="2" fill="none" />

        {/* Rear Wheel (Wire-spoked vintage wheel) */}
        <g transform="translate(52, 68)">
          <circle cx="0" cy="0" r="14" stroke="#292524" strokeWidth="2.5" fill="#1c1917" fillOpacity="0.2" />
          <circle cx="0" cy="0" r="11" stroke="#a8a29e" strokeWidth="0.8" />
          <circle cx="0" cy="0" r="3" fill="#d97706" stroke="#78350f" strokeWidth="1" />
          {/* 8 spokes */}
          <line x1="-11" y1="0" x2="11" y2="0" stroke="#78716c" strokeWidth="0.8" />
          <line x1="0" y1="-11" x2="0" y2="11" stroke="#78716c" strokeWidth="0.8" />
          <line x1="-8" y1="-8" x2="8" y2="8" stroke="#78716c" strokeWidth="0.8" />
          <line x1="-8" y1="8" x2="8" y2="-8" stroke="#78716c" strokeWidth="0.8" />
        </g>

        {/* Front Wheel (Wire-spoked vintage wheel) */}
        <g transform="translate(148, 68)">
          <circle cx="0" cy="0" r="14" stroke="#292524" strokeWidth="2.5" fill="#1c1917" fillOpacity="0.2" />
          <circle cx="0" cy="0" r="11" stroke="#a8a29e" strokeWidth="0.8" />
          <circle cx="0" cy="0" r="3" fill="#d97706" stroke="#78350f" strokeWidth="1" />
          {/* 8 spokes */}
          <line x1="-11" y1="0" x2="11" y2="0" stroke="#78716c" strokeWidth="0.8" />
          <line x1="0" y1="-11" x2="0" y2="11" stroke="#78716c" strokeWidth="0.8" />
          <line x1="-8" y1="-8" x2="8" y2="8" stroke="#78716c" strokeWidth="0.8" />
          <line x1="-8" y1="8" x2="8" y2="-8" stroke="#78716c" strokeWidth="0.8" />
        </g>
      </svg>

      {/* Segment & Powertrain label watermark */}
      <div className="absolute top-1.5 left-2 flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-wider text-stone-500/80">
        <span>{segment}</span>
        <span>•</span>
        <span>{powertrain}</span>
      </div>
    </div>
  );
}
