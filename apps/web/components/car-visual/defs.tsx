import React from "react";
import type { VehicleSegment } from "@ait/shared-types";

interface DefsProps {
  uid: string;
  segment: VehicleSegment;
  decade: number;
}

export function CarVisualDefs({ uid, segment, decade }: DefsProps): React.JSX.Element {
  return (
    <defs>
      {/* 1. Ground Contact Shadow with Ambient Occlusion */}
      <radialGradient id={`groundShadow-${uid}`} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#000000" stopOpacity="0.88" />
        <stop offset="45%" stopColor="#000000" stopOpacity="0.55" />
        <stop offset="75%" stopColor="#000000" stopOpacity="0.2" />
        <stop offset="100%" stopColor="#000000" stopOpacity="0" />
      </radialGradient>

      {/* 2. Softbox Overhead Light Reflection (Top Sheen) */}
      <linearGradient id={`softboxSheen-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
        <stop offset="35%" stopColor="#ffffff" stopOpacity="0.2" />
        <stop offset="70%" stopColor="#ffffff" stopOpacity="0" />
      </linearGradient>

      {/* 3. Showroom Mirror Floor Turntable Sheen */}
      <linearGradient id={`floorSheen-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.1" />
        <stop offset="30%" stopColor="#38bdf8" stopOpacity="0.05" />
        <stop offset="100%" stopColor="#000000" stopOpacity="0" />
      </linearGradient>

      {/* 4. Mirror Chrome Gradient (Photorealistic Liquid Metal) */}
      <linearGradient id={`chrome-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="22%" stopColor="#e2e8f0" />
        <stop offset="48%" stopColor="#64748b" />
        <stop offset="52%" stopColor="#334155" />
        <stop offset="75%" stopColor="#cbd5e1" />
        <stop offset="100%" stopColor="#f8fafc" />
      </linearGradient>

      {/* 5. Polished Vintage Brass Gradient (1900-1919) */}
      <linearGradient id={`brass-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="28%" stopColor="#eab308" />
        <stop offset="50%" stopColor="#854d0e" />
        <stop offset="72%" stopColor="#ca8a04" />
        <stop offset="100%" stopColor="#fef9c3" />
      </linearGradient>

      {/* 6. Nickel Plate Gradient (1920s) */}
      <linearGradient id={`nickel-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#f1f5f9" />
        <stop offset="30%" stopColor="#cbd5e1" />
        <stop offset="55%" stopColor="#94a3b8" />
        <stop offset="80%" stopColor="#e2e8f0" />
        <stop offset="100%" stopColor="#64748b" />
      </linearGradient>

      {/* 7. Windshield & Window 3D Sky-Horizon Glass */}
      <linearGradient id={`glass-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0.8" />
        <stop offset="32%" stopColor="#38bdf8" stopOpacity="0.65" />
        <stop offset="50%" stopColor="#0284c7" stopOpacity="0.85" />
        <stop offset="75%" stopColor="#0f172a" stopOpacity="0.95" />
        <stop offset="100%" stopColor="#020617" stopOpacity="0.98" />
      </linearGradient>

      {/* 8. Glass Specular Glare Slash */}
      <linearGradient id={`glassGlare-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
        <stop offset="50%" stopColor="#ffffff" stopOpacity="0.1" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
      </linearGradient>

      {/* 9. Segment Metallic Paint Shaders (Deep 3D Luster) */}
      {/* LUXURY: Royal Sapphire / Deep Midnight Indigo Metallic */}
      <linearGradient id={`body-luxury-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#4338ca" />
        <stop offset="18%" stopColor="#6366f1" />
        <stop offset="38%" stopColor="#312e81" />
        <stop offset="65%" stopColor="#1e1b4b" />
        <stop offset="85%" stopColor="#172554" />
        <stop offset="100%" stopColor="#030712" />
      </linearGradient>

      {/* FAMILY: British Racing / Forest Emerald Metallic */}
      <linearGradient id={`body-family-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#059669" />
        <stop offset="20%" stopColor="#10b981" />
        <stop offset="42%" stopColor="#047857" />
        <stop offset="68%" stopColor="#064e3b" />
        <stop offset="88%" stopColor="#022c22" />
        <stop offset="100%" stopColor="#02140e" />
      </linearGradient>

      {/* ECONOMY: Ruby Carmine / Bordeaux Metallic */}
      <linearGradient id={`body-economy-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#dc2626" />
        <stop offset="22%" stopColor="#ef4444" />
        <stop offset="44%" stopColor="#b91c1c" />
        <stop offset="70%" stopColor="#881337" />
        <stop offset="90%" stopColor="#4c0519" />
        <stop offset="100%" stopColor="#1c0209" />
      </linearGradient>

      {/* UTILITY: Rich Terracotta / Bronze Saddle Metallic */}
      <linearGradient id={`body-utility-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#b45309" />
        <stop offset="20%" stopColor="#d97706" />
        <stop offset="45%" stopColor="#92400e" />
        <stop offset="70%" stopColor="#78350f" />
        <stop offset="90%" stopColor="#451a03" />
        <stop offset="100%" stopColor="#1c0701" />
      </linearGradient>

      {/* Two-Tone Secondary (Roof / Spear Accent) */}
      <linearGradient id={`bodyTwoTone-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="35%" stopColor="#f8fafc" />
        <stop offset="70%" stopColor="#e2e8f0" />
        <stop offset="100%" stopColor="#cbd5e1" />
      </linearGradient>

      {/* 10. TIRE GRADIENTS */}
      {/* Pure White Natural Latex Rubber (1900-1909) */}
      <radialGradient id={`tireWhite-${uid}`} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#f8fafc" />
        <stop offset="70%" stopColor="#e2e8f0" />
        <stop offset="92%" stopColor="#cbd5e1" />
        <stop offset="100%" stopColor="#94a3b8" />
      </radialGradient>

      {/* Greyish Natural Rubber (1910-1919) */}
      <radialGradient id={`tireGrey-${uid}`} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#e2e8f0" />
        <stop offset="68%" stopColor="#cbd5e1" />
        <stop offset="90%" stopColor="#94a3b8" />
        <stop offset="100%" stopColor="#64748b" />
      </radialGradient>

      {/* Deep Vulcanized Black Rubber (1920+) */}
      <radialGradient id={`tireBlack-${uid}`} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#27272a" />
        <stop offset="65%" stopColor="#18181b" />
        <stop offset="92%" stopColor="#09090b" />
        <stop offset="100%" stopColor="#000000" />
      </radialGradient>

      {/* Modern Low-Profile Performance Compound (2010+) */}
      <radialGradient id={`tireModern-${uid}`} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#3f3f46" />
        <stop offset="70%" stopColor="#18181b" />
        <stop offset="95%" stopColor="#09090b" />
        <stop offset="100%" stopColor="#000000" />
      </radialGradient>

      {/* 11. RIM SHADERS */}
      {/* Alloy Metallic Wheel Rim */}
      <linearGradient id={`alloyRim-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f8fafc" />
        <stop offset="35%" stopColor="#cbd5e1" />
        <stop offset="70%" stopColor="#94a3b8" />
        <stop offset="100%" stopColor="#64748b" />
      </linearGradient>

      {/* Diamond Cut / Gloss Black Rim Pockets */}
      <radialGradient id={`rimPocket-${uid}`} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#0f172a" />
        <stop offset="85%" stopColor="#020617" />
        <stop offset="100%" stopColor="#000000" />
      </radialGradient>

      {/* Brake Disc Rotor */}
      <radialGradient id={`brakeDisc-${uid}`} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#94a3b8" />
        <stop offset="60%" stopColor="#cbd5e1" />
        <stop offset="85%" stopColor="#64748b" />
        <stop offset="100%" stopColor="#475569" />
      </radialGradient>
    </defs>
  );
}
