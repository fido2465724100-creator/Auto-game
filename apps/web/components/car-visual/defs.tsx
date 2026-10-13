import React from "react";
import type { VehicleSegment } from "@ait/shared-types";

interface DefsProps {
  uid: string;
  segment: VehicleSegment;
  decade: number;
}

export function CarVisualDefs({ uid, segment, decade }: DefsProps): React.JSX.Element {
  const isEarlyEra = decade <= 1;
  const isVintageEra = decade === 2;

  return (
    <defs>
      {/* ================= 1. SHOWROOM ARCHITECTURE & MARBLE FLOOR ================= */}
      {/* Light Gallery Showroom Wall (Cream-White Architectural Backdrop) */}
      <linearGradient id={`showroomWall-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#f8fafc" />
        <stop offset="40%" stopColor="#f1f5f9" />
        <stop offset="75%" stopColor="#e2e8f0" />
        <stop offset="100%" stopColor="#cbd5e1" />
      </linearGradient>

      {/* Ceiling Softbox Overhead Glow */}
      <radialGradient id={`ceilingGlow-${uid}`} cx="50%" cy="10%" r="65%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
        <stop offset="40%" stopColor="#ffffff" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
      </radialGradient>

      {/* Polished White Carrara Marble Floor */}
      <linearGradient id={`marbleFloor-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#e2e8f0" />
        <stop offset="25%" stopColor="#f8fafc" />
        <stop offset="60%" stopColor="#f1f5f9" />
        <stop offset="100%" stopColor="#e2e8f0" />
      </linearGradient>

      {/* Floor Mirror Turntable Reflection Gradient */}
      <linearGradient id={`marbleReflection-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
        <stop offset="35%" stopColor="#cbd5e1" stopOpacity="0.12" />
        <stop offset="70%" stopColor="#94a3b8" stopOpacity="0.04" />
        <stop offset="100%" stopColor="#000000" stopOpacity="0" />
      </linearGradient>

      {/* ================= 2. PRESENTATION DISPLAY PEDESTAL ================= */}
      {/* Marble Pedestal Top Surface */}
      <radialGradient id={`pedestalTop-${uid}`} cx="50%" cy="45%" r="55%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="65%" stopColor="#f8fafc" />
        <stop offset="90%" stopColor="#e2e8f0" />
        <stop offset="100%" stopColor="#cbd5e1" />
      </radialGradient>

      {/* Pedestal Metal Edge Rim (Polished Brass in early era, Mirror Chrome in mid/late) */}
      <linearGradient id={`pedestalRim-${uid}`} x1="0%" y1="0%" x2="100%" y2="0%">
        {isEarlyEra ? (
          <>
            <stop offset="0%" stopColor="#854d0e" />
            <stop offset="20%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#ca8a04" />
            <stop offset="80%" stopColor="#fef9c3" />
            <stop offset="100%" stopColor="#713f12" />
          </>
        ) : isVintageEra ? (
          <>
            <stop offset="0%" stopColor="#64748b" />
            <stop offset="25%" stopColor="#f1f5f9" />
            <stop offset="50%" stopColor="#94a3b8" />
            <stop offset="75%" stopColor="#f8fafc" />
            <stop offset="100%" stopColor="#475569" />
          </>
        ) : (
          <>
            <stop offset="0%" stopColor="#475569" />
            <stop offset="15%" stopColor="#ffffff" />
            <stop offset="35%" stopColor="#94a3b8" />
            <stop offset="55%" stopColor="#ffffff" />
            <stop offset="75%" stopColor="#64748b" />
            <stop offset="90%" stopColor="#f8fafc" />
            <stop offset="100%" stopColor="#334155" />
          </>
        )}
      </linearGradient>

      {/* Pedestal Cast Shadow onto Floor */}
      <radialGradient id={`pedestalShadow-${uid}`} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#0f172a" stopOpacity="0.45" />
        <stop offset="55%" stopColor="#334155" stopOpacity="0.25" />
        <stop offset="85%" stopColor="#64748b" stopOpacity="0.08" />
        <stop offset="100%" stopColor="#000000" stopOpacity="0" />
      </radialGradient>

      {/* Car Contact Shadow onto Pedestal */}
      <radialGradient id={`carPedestalShadow-${uid}`} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#020617" stopOpacity="0.75" />
        <stop offset="50%" stopColor="#0f172a" stopOpacity="0.45" />
        <stop offset="80%" stopColor="#1e293b" stopOpacity="0.15" />
        <stop offset="100%" stopColor="#000000" stopOpacity="0" />
      </radialGradient>

      {/* ================= 3. 3D LIGHTING & SHADERS ================= */}
      {/* Softbox Highlight Streak across Hood & Roof */}
      <linearGradient id={`softboxSheen-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.75" />
        <stop offset="40%" stopColor="#ffffff" stopOpacity="0.25" />
        <stop offset="85%" stopColor="#ffffff" stopOpacity="0" />
      </linearGradient>

      {/* Mirror Chrome */}
      <linearGradient id={`chrome-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="20%" stopColor="#f1f5f9" />
        <stop offset="48%" stopColor="#64748b" />
        <stop offset="52%" stopColor="#1e293b" />
        <stop offset="78%" stopColor="#e2e8f0" />
        <stop offset="100%" stopColor="#ffffff" />
      </linearGradient>

      {/* Polished Brass */}
      <linearGradient id={`brass-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#fef9c3" />
        <stop offset="25%" stopColor="#facc15" />
        <stop offset="50%" stopColor="#854d0e" />
        <stop offset="75%" stopColor="#ca8a04" />
        <stop offset="100%" stopColor="#fef08a" />
      </linearGradient>

      {/* Nickel */}
      <linearGradient id={`nickel-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="30%" stopColor="#e2e8f0" />
        <stop offset="55%" stopColor="#94a3b8" />
        <stop offset="80%" stopColor="#cbd5e1" />
        <stop offset="100%" stopColor="#64748b" />
      </linearGradient>

      {/* 3D Glass with Sky-Horizon Reflection & Interior Depth */}
      <linearGradient id={`glass-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#bae6fd" stopOpacity="0.85" />
        <stop offset="35%" stopColor="#38bdf8" stopOpacity="0.7" />
        <stop offset="55%" stopColor="#0284c7" stopOpacity="0.85" />
        <stop offset="80%" stopColor="#0f172a" stopOpacity="0.95" />
        <stop offset="100%" stopColor="#020617" stopOpacity="0.98" />
      </linearGradient>

      {/* Glass Specular Glare Slash */}
      <linearGradient id={`glassGlare-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.65" />
        <stop offset="45%" stopColor="#ffffff" stopOpacity="0.2" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
      </linearGradient>

      {/* ================= 4. METALLIC BODY PAINT GRADIENTS ================= */}
      {/* LUXURY: Royal Sapphire / Midnight Indigo Metallic */}
      <linearGradient id={`body-luxury-${uid}`} x1="20%" y1="0%" x2="80%" y2="100%">
        <stop offset="0%" stopColor="#6366f1" />
        <stop offset="25%" stopColor="#4338ca" />
        <stop offset="55%" stopColor="#312e81" />
        <stop offset="80%" stopColor="#1e1b4b" />
        <stop offset="100%" stopColor="#0f172a" />
      </linearGradient>

      {/* FAMILY: Deep British Racing / Forest Emerald Metallic */}
      <linearGradient id={`body-family-${uid}`} x1="20%" y1="0%" x2="80%" y2="100%">
        <stop offset="0%" stopColor="#10b981" />
        <stop offset="25%" stopColor="#059669" />
        <stop offset="55%" stopColor="#047857" />
        <stop offset="80%" stopColor="#064e3b" />
        <stop offset="100%" stopColor="#022c22" />
      </linearGradient>

      {/* ECONOMY: Rich Carmine / Bordeaux Red Metallic */}
      <linearGradient id={`body-economy-${uid}`} x1="20%" y1="0%" x2="80%" y2="100%">
        <stop offset="0%" stopColor="#ef4444" />
        <stop offset="25%" stopColor="#dc2626" />
        <stop offset="55%" stopColor="#b91c1c" />
        <stop offset="80%" stopColor="#881337" />
        <stop offset="100%" stopColor="#4c0519" />
      </linearGradient>

      {/* UTILITY: Deep Terracotta / Bronze Saddle Metallic */}
      <linearGradient id={`body-utility-${uid}`} x1="20%" y1="0%" x2="80%" y2="100%">
        <stop offset="0%" stopColor="#d97706" />
        <stop offset="25%" stopColor="#b45309" />
        <stop offset="55%" stopColor="#92400e" />
        <stop offset="80%" stopColor="#78350f" />
        <stop offset="100%" stopColor="#451a03" />
      </linearGradient>

      {/* Hood Top Reflected Light (Foreshortened Horizontal Sheen) */}
      <linearGradient id={`hoodSheen-${uid}`} x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
        <stop offset="35%" stopColor="#ffffff" stopOpacity="0.4" />
        <stop offset="70%" stopColor="#ffffff" stopOpacity="0.15" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
      </linearGradient>

      {/* Two-Tone Contrast Roof / Spear Color */}
      <linearGradient id={`twoToneRoof-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="40%" stopColor="#f8fafc" />
        <stop offset="75%" stopColor="#e2e8f0" />
        <stop offset="100%" stopColor="#cbd5e1" />
      </linearGradient>

      {/* ================= 5. TIRE GRADIENTS ================= */}
      {/* 1900s: 100% Pure White Natural Latex Rubber */}
      <radialGradient id={`tireWhite-${uid}`} cx="45%" cy="45%" r="55%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="65%" stopColor="#f8fafc" />
        <stop offset="88%" stopColor="#e2e8f0" />
        <stop offset="100%" stopColor="#cbd5e1" />
      </radialGradient>

      {/* 1910s: Greyish/White Zinc-Oxide Rubber */}
      <radialGradient id={`tireGrey-${uid}`} cx="45%" cy="45%" r="55%">
        <stop offset="0%" stopColor="#f1f5f9" />
        <stop offset="65%" stopColor="#e2e8f0" />
        <stop offset="88%" stopColor="#cbd5e1" />
        <stop offset="100%" stopColor="#94a3b8" />
      </radialGradient>

      {/* 1920+: Deep Black Radial Rubber */}
      <radialGradient id={`tireBlack-${uid}`} cx="45%" cy="45%" r="55%">
        <stop offset="0%" stopColor="#27272a" />
        <stop offset="65%" stopColor="#18181b" />
        <stop offset="90%" stopColor="#09090b" />
        <stop offset="100%" stopColor="#000000" />
      </radialGradient>

      {/* 2010+: Ultra-Low Profile Modern Performance Compound */}
      <radialGradient id={`tireModern-${uid}`} cx="45%" cy="45%" r="55%">
        <stop offset="0%" stopColor="#3f3f46" />
        <stop offset="70%" stopColor="#18181b" />
        <stop offset="95%" stopColor="#09090b" />
        <stop offset="100%" stopColor="#000000" />
      </radialGradient>

      {/* ================= 6. WHEEL RIMS & BRAKES ================= */}
      <linearGradient id={`alloyRim-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="35%" stopColor="#e2e8f0" />
        <stop offset="70%" stopColor="#94a3b8" />
        <stop offset="100%" stopColor="#64748b" />
      </linearGradient>

      <radialGradient id={`rimPocket-${uid}`} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#0f172a" />
        <stop offset="85%" stopColor="#020617" />
        <stop offset="100%" stopColor="#000000" />
      </radialGradient>

      <radialGradient id={`brakeDisc-${uid}`} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#cbd5e1" />
        <stop offset="70%" stopColor="#94a3b8" />
        <stop offset="100%" stopColor="#64748b" />
      </radialGradient>
    </defs>
  );
}
