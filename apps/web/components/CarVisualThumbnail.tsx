'use client';

import React, { useState } from "react";
import type { VehicleSegment } from "@ait/shared-types";

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
  const [useFallback, setUseFallback] = useState(false);

  // Determine base path for GitHub Pages or local development
  const base =
    process.env.NEXT_PUBLIC_BASE_PATH ||
    (process.env.GITHUB_PAGES === 'true' ? '/Auto-game' : '') ||
    (typeof window !== 'undefined' && window.location.pathname.startsWith('/Auto-game') ? '/Auto-game' : '');

  // Specific 52-model hero image url
  const primaryUrl = `${base}/cars/${segment}-d${decade}.jpg`;
  const fallbackUrl = `${base}/cars/d${decade}.jpg`;
  const photoUrl = useFallback ? fallbackUrl : primaryUrl;

  return (
    <div
      className={`relative w-full rounded-lg overflow-hidden bg-gradient-to-b from-stone-900 via-stone-950 to-black border border-stone-800 shadow-xl flex items-center justify-center select-none ${className}`}
      style={{ minHeight: "88px" }}
    >
      {/* Studio Showroom Vignette & Spotlight */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black via-stone-950/60 to-transparent pointer-events-none z-1" />
      <div className="absolute inset-0 bg-radial from-amber-500/5 via-transparent to-black/75 pointer-events-none z-1" />

      {/* ERA & SEGMENT WATERMARK */}
      {!hideWatermark && (
        <div className="absolute top-2 left-2 text-[10px] font-mono font-bold tracking-wider text-stone-200 uppercase flex items-center gap-1.5 z-10 bg-black/70 px-2.5 py-1 rounded-md backdrop-blur-md border border-white/20 shadow-md">
          <span className="text-amber-400 font-extrabold">{designYear}</span>
          <span className="text-stone-500">•</span>
          <span className="text-stone-200">{segment}</span>
          <span className="text-stone-500 hidden sm:inline">•</span>
          <span className="text-stone-400 hidden sm:inline">{getDecadeName(decade)}</span>
        </div>
      )}

      {badge && (
        <div className="absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/25 text-amber-300 border border-amber-500/50 z-10 shadow-md backdrop-blur-md">
          {badge}
        </div>
      )}

      {/* PHOTOREALISTIC 3D STUDIO RENDER */}
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
        <img
          src={photoUrl}
          alt={`${designYear} ${segment}`}
          className="w-full h-full object-cover sm:object-contain object-center drop-shadow-2xl transition-transform duration-700 hover:scale-105"
          onError={() => {
            if (!useFallback) {
              setUseFallback(true);
            }
          }}
          loading="lazy"
        />
        {/* Subtle Ambient Vignette */}
        <div className="absolute inset-0 bg-radial from-transparent via-transparent to-black/35 pointer-events-none" />
      </div>
    </div>
  );
}
