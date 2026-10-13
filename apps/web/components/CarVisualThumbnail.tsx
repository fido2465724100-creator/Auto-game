'use client';

import React from "react";
import type { VehicleSegment } from "@ait/shared-types";
import { CarVisualDefs } from "./car-visual/defs";
import { PerspectiveCarWheel } from "./car-visual/wheelRenderer";
import { CarBody } from "./car-visual/carBodies";

interface Props {
  segment: VehicleSegment;
  designYear?: number;
  className?: string;
  badge?: string;
  hideWatermark?: boolean;
}

export function getDecadeIndex(year: number): number {
  if (year < 1910) return 0;   // 1900s
  if (year < 1920) return 1;   // 1910s
  if (year < 1930) return 2;   // 1920s
  if (year < 1940) return 3;   // 1930s
  if (year < 1950) return 4;   // 1940s
  if (year < 1960) return 5;   // 1950s
  if (year < 1970) return 6;   // 1960s
  if (year < 1980) return 7;   // 1970s
  if (year < 1990) return 8;   // 1980s
  if (year < 2000) return 9;   // 1990s
  if (year < 2010) return 10;  // 2000s
  if (year < 2020) return 11;  // 2010s
  return 12;                   // 2020s+
}

export function getDecadeName(decade: number): string {
  const names = [
    "1900s • Horseless Carriage",
    "1910s • Brass Torpedo",
    "1920s • Roaring Twenties",
    "1930s • Art Deco Streamline",
    "1940s • Post-War Ponton",
    "1950s • Jet-Age Tailfins",
    "1960s • Muscle & Coke-Bottle",
    "1970s • Malaise & Impact Bumpers",
    "1980s • Wedge & Turbo Origami",
    "1990s • Biodesign Fluidity",
    "2000s • New Edge & Clear Optics",
    "2010s • Kinetic Sculpting & LED",
    "2020s • Electric Cyber Horizon",
  ];
  return names[decade] ?? "Modern Era";
}

export function CarVisualThumbnail({
  segment,
  designYear = 1900,
  className = "",
  badge,
  hideWatermark = false,
}: Props): React.JSX.Element {
  const decade = getDecadeIndex(designYear);
  const uid = `${segment}-d${decade}`;

  return (
    <div
      className={`relative w-full rounded-lg overflow-hidden bg-slate-100 border border-slate-300 shadow-md flex items-center justify-center select-none ${className}`}
      style={{ minHeight: "88px" }}
    >
      {/* ERA & SEGMENT WATERMARK */}
      {!hideWatermark && (
        <div className="absolute top-2 left-2 text-[10px] font-mono font-bold tracking-wider text-slate-800 uppercase flex items-center gap-1.5 z-10 bg-white/85 px-2.5 py-1 rounded-md backdrop-blur-md border border-slate-200/80 shadow-sm">
          <span className="text-amber-600 font-extrabold">{designYear}</span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-800">{segment}</span>
          <span className="text-slate-400 hidden sm:inline">•</span>
          <span className="text-slate-600 hidden sm:inline">{getDecadeName(decade)}</span>
        </div>
      )}

      {badge && (
        <div className="absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-800 border border-amber-500/40 z-10 shadow-sm backdrop-blur-md">
          {badge}
        </div>
      )}

      {/* 3/4 ANGLE 52 BESPOKE VEHICLES IN UNIFIED MARBLE SHOWROOM */}
      <svg
        viewBox="0 0 400 220"
        className="w-full h-full object-contain relative z-0 transition-transform duration-500 hover:scale-[1.02]"
      >
        <CarVisualDefs uid={uid} segment={segment} decade={decade} />

        {/* 1. Showroom Gallery Architectural Wall */}
        <rect x="0" y="0" width="400" height="150" fill={`url(#showroomWall-${uid})`} />
        <line x1="80" y1="0" x2="80" y2="150" stroke="#cbd5e1" strokeWidth="1" opacity="0.4" />
        <line x1="200" y1="0" x2="200" y2="150" stroke="#cbd5e1" strokeWidth="1" opacity="0.4" />
        <line x1="320" y1="0" x2="320" y2="150" stroke="#cbd5e1" strokeWidth="1" opacity="0.4" />

        {/* 2. Softbox Overhead Ceiling Light */}
        <ellipse cx="200" cy="10" rx="180" ry="35" fill={`url(#ceilingGlow-${uid})`} opacity="0.85" />

        {/* 3. Polished Carrara Marble Floor */}
        <rect x="0" y="140" width="400" height="80" fill={`url(#marbleFloor-${uid})`} />
        <rect x="0" y="140" width="400" height="80" fill={`url(#marbleReflection-${uid})`} opacity="0.35" />

        {/* 4. Display Turntable Pedestal */}
        {/* Pedestal Cast Floor Shadow */}
        <ellipse cx="200" cy="177" rx="166" ry="24" fill={`url(#pedestalShadow-${uid})`} />

        {/* Pedestal Rim (Cylindrical metallic edge bevel) */}
        <path
          d="M 36 158 A 164 25 0 0 0 364 158 v 12 A 164 25 0 0 1 36 170 Z"
          fill={`url(#pedestalRim-${uid})`}
          stroke="#475569"
          strokeWidth="0.5"
        />

        {/* Pedestal Top Polished Surface */}
        <ellipse
          cx="200"
          cy="158"
          rx="164"
          ry="25"
          fill={`url(#pedestalTop-${uid})`}
          stroke={`url(#pedestalRim-${uid})`}
          strokeWidth="1"
        />

        {/* Pedestal Top Reflection Sheen */}
        <ellipse cx="200" cy="157" rx="150" ry="21" fill={`url(#marbleReflection-${uid})`} opacity="0.5" />

        {/* 5. Car Contact Cast Shadow onto Pedestal */}
        <ellipse cx="210" cy="164" rx="136" ry="16" fill={`url(#carPedestalShadow-${uid})`} />

        {/* 6. Far Front Perspective Wheel (Tucked Behind Front Clip) */}
        <g id="wheelFarFront">
          <PerspectiveCarWheel cx={262} cy={147} rx={13} ry={17} decade={decade} uid={uid} isFront={true} />
        </g>

        {/* 7. Bespoke Copyright-Safe 3/4 Perspective Car Body */}
        <CarBody segment={segment} decade={decade} uid={uid} />

        {/* 8. Near Perspective Wheels with Historic Tire & Rim Compounds */}
        <g id="wheelNearRear">
          <PerspectiveCarWheel cx={124} cy={158} rx={17} ry={22} decade={decade} uid={uid} isFront={false} />
        </g>
        <g id="wheelNearFront">
          <PerspectiveCarWheel cx={298} cy={162} rx={17} ry={22} decade={decade} uid={uid} isFront={true} />
        </g>

        {/* 9. Softbox Specular Highlight Slash across Hood & Roof */}
        <path
          d="M 75 118 Q 200 78 340 125"
          stroke={`url(#softboxSheen-${uid})`}
          strokeWidth="2.5"
          fill="none"
          opacity="0.45"
        />
      </svg>
    </div>
  );
}
