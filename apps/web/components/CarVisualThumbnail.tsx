'use client';

import React from "react";
import type { VehicleSegment } from "@ait/shared-types";
import { CarVisualDefs } from "./car-visual/defs";
import { CarWheel } from "./car-visual/wheelRenderer";
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
    "1900s • Horseless Buggy",
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
      className={`relative w-full rounded-lg overflow-hidden bg-gradient-to-b from-stone-900 via-stone-950 to-black border border-stone-800 shadow-inner flex items-center justify-center select-none ${className}`}
      style={{ minHeight: "84px" }}
    >
      {/* Studio Showroom Vignette & Spotlight */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-stone-950 via-stone-900/40 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-radial from-amber-500/10 via-transparent to-black/75 pointer-events-none" />

      {/* ERA & SEGMENT WATERMARK */}
      {!hideWatermark && (
        <div className="absolute top-1.5 left-2.5 text-[9px] font-mono font-bold tracking-wider text-stone-400 uppercase flex items-center gap-1.5 z-10 bg-black/50 px-2 py-0.5 rounded backdrop-blur-xs border border-white/10 shadow-xs">
          <span className="text-amber-400">{designYear}</span>
          <span>•</span>
          <span className="text-stone-300">{segment}</span>
          <span>•</span>
          <span className="text-stone-400 hidden sm:inline">{getDecadeName(decade)}</span>
        </div>
      )}

      {badge && (
        <div className="absolute top-1.5 right-2.5 text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 z-10 shadow-xs">
          {badge}
        </div>
      )}

      {/* SVG CAR RENDER */}
      <svg
        viewBox="0 0 320 120"
        className="w-full h-full max-h-[88%] object-contain drop-shadow-xl relative z-0"
      >
        {/* Shaders, Gradients & Filters */}
        <CarVisualDefs uid={uid} segment={segment} decade={decade} />

        {/* 1. GROUND CONTACT SHADOW & FLOOR SHEEN */}
        <ellipse cx="160" cy="108" rx="135" ry="7" fill={`url(#groundShadow-${uid})`} />
        <ellipse cx="160" cy="106" rx="115" ry="3.5" fill={`url(#floorSheen-${uid})`} opacity="0.6" />

        {/* 2. ERA-SPECIFIC CAR BODY (52 UNIQUE SILHOUETTES) */}
        <CarBody segment={segment} decade={decade} uid={uid} />

        {/* 3. 3D SOFTBOX OVERHEAD SPECULAR HIGHLIGHT STREAK */}
        <path d="M 60 70 Q 150 36 270 65" stroke={`url(#softboxSheen-${uid})`} strokeWidth="3" fill="none" opacity="0.7" />

        {/* 4. WHEELS (HISTORICAL TIRE EVOLUTION & DETAILED RIMS) */}
        <g id="wheelRear">
          <CarWheel cx={92} cy={96} radius={18} decade={decade} uid={uid} />
        </g>
        <g id="wheelFront">
          <CarWheel cx={242} cy={96} radius={18} decade={decade} uid={uid} />
        </g>
      </svg>
    </div>
  );
}
