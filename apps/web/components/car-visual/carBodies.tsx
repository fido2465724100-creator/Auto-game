import React from "react";
import type { VehicleSegment } from "@ait/shared-types";

interface BodyProps {
  segment: VehicleSegment;
  decade: number;
  uid: string;
}

export function CarBody({ segment, decade, uid }: BodyProps): React.JSX.Element {
  const bodyFill = `url(#body-${segment}-${uid})`;
  const chromeStroke = `url(#chrome-${uid})`;
  const brassStroke = `url(#brass-${uid})`;
  const nickelStroke = `url(#nickel-${uid})`;
  const glassFill = `url(#glass-${uid})`;
  const softbox = `url(#softboxSheen-${uid})`;

  // =========================================================================
  // DECADE 0: 1900-1909 (BRASS HORSELESS CARRIAGE ERA)
  // =========================================================================
  if (decade === 0) {
    if (segment === "utility") {
      // 1900s Depot Delivery Wagon (Open-cab, wooden cargo slats, brass lanterns)
      return (
        <g id="body-d0-utility">
          <rect x="52" y="36" width="126" height="52" rx="3" fill="#3f2e22" stroke="#1c1917" strokeWidth="2" />
          <line x1="52" y1="52" x2="178" y2="52" stroke="#78350f" strokeWidth="1.8" />
          <line x1="52" y1="68" x2="178" y2="68" stroke="#78350f" strokeWidth="1.8" />
          <path d="M 178 36 L 212 48 L 212 88 L 178 88 Z" fill={bodyFill} stroke="#1c1917" strokeWidth="2" />
          <rect x="182" y="48" width="24" height="24" fill={glassFill} stroke="#1c1917" strokeWidth="1" />
          <path d="M 212 66 L 262 66 L 262 88 L 212 88 Z" fill={bodyFill} stroke="#1c1917" strokeWidth="1.8" />
          <rect x="260" y="58" width="9" height="30" rx="2" fill={brassStroke} stroke="#78350f" strokeWidth="1.2" />
          <circle cx="266" cy="62" r="5.5" fill="#fef08a" stroke={brassStroke} strokeWidth="1.5" />
          <path d="M 45 88 Q 58 64 92 68 Q 115 76 130 88" stroke="#1c1917" strokeWidth="3" fill="none" />
          <path d="M 195 88 Q 212 66 245 68 Q 265 74 274 88" stroke="#1c1917" strokeWidth="3" fill="none" />
        </g>
      );
    }
    if (segment === "luxury") {
      // 1900s Grand Imperial Tonneau (High coach-built body, twin brass lanterns, grand radiator)
      return (
        <g id="body-d0-luxury">
          <path d="M 52 86 L 62 44 Q 72 28 112 28 L 196 28 Q 206 28 206 50 L 206 86 Z" fill={bodyFill} stroke={brassStroke} strokeWidth="2" />
          <rect x="82" y="36" width="38" height="28" rx="2" fill={glassFill} stroke={brassStroke} strokeWidth="1.2" />
          <rect x="130" y="36" width="46" height="28" rx="2" fill={glassFill} stroke={brassStroke} strokeWidth="1.2" />
          <path d="M 206 50 L 232 50 L 232 86 L 206 86 Z" fill={bodyFill} stroke="#1c1917" strokeWidth="1.6" />
          <path d="M 232 60 L 276 64 L 276 86 L 232 86 Z" fill={bodyFill} stroke="#1c1917" strokeWidth="1.6" />
          <rect x="274" y="50" width="10" height="38" rx="2" fill={brassStroke} stroke="#78350f" strokeWidth="1.5" />
          <circle cx="282" cy="56" r="6.5" fill="#fef08a" stroke={brassStroke} strokeWidth="1.5" />
          <path d="M 45 86 Q 60 58 96 64 Q 120 74 135 88" stroke="#1c1917" strokeWidth="3.5" fill="none" />
          <path d="M 195 88 Q 215 62 255 64 Q 280 72 286 88" stroke="#1c1917" strokeWidth="3.5" fill="none" />
          <path d="M 64 30 L 194 30" stroke={softbox} strokeWidth="2" fill="none" />
        </g>
      );
    }
    if (segment === "family") {
      // 1900s Surrey with Fringe (Two rows of tufted seats, folding fabric canopy top, brass stanchions)
      return (
        <g id="body-d0-family">
          <path d="M 56 86 Q 66 52 110 52 L 205 52 Q 220 52 228 66 L 266 70 L 266 88 L 56 88 Z" fill={bodyFill} stroke={brassStroke} strokeWidth="1.6" />
          {/* Canopy Top */}
          <rect x="70" y="24" width="145" height="6" rx="2" fill="#fef3c7" stroke="#92400e" strokeWidth="1.2" />
          <line x1="85" y1="30" x2="85" y2="52" stroke={brassStroke} strokeWidth="2" />
          <line x1="145" y1="30" x2="145" y2="52" stroke={brassStroke} strokeWidth="2" />
          <line x1="205" y1="30" x2="205" y2="52" stroke={brassStroke} strokeWidth="2" />
          {/* Dual Bench Seats */}
          <rect x="95" y="40" width="40" height="22" rx="3" fill="#451a03" stroke="#1c1917" strokeWidth="1.2" />
          <rect x="155" y="40" width="40" height="22" rx="3" fill="#451a03" stroke="#1c1917" strokeWidth="1.2" />
          <rect x="264" y="60" width="8" height="28" rx="2" fill={brassStroke} stroke="#78350f" strokeWidth="1.2" />
          <circle cx="270" cy="65" r="5" fill="#fef08a" stroke={brassStroke} strokeWidth="1.2" />
          <path d="M 46 86 Q 60 60 96 66 Q 118 74 132 88" stroke="#1c1917" strokeWidth="3" fill="none" />
          <path d="M 195 88 Q 212 64 248 66 Q 268 72 276 88" stroke="#1c1917" strokeWidth="3" fill="none" />
        </g>
      );
    }
    // 1900s Economy: Curved-Dash Runabout Buggy
    return (
      <g id="body-d0-economy">
        <path d="M 64 86 Q 74 58 118 58 L 186 58 Q 204 58 214 70 L 255 72 Q 268 74 266 84 L 260 88 L 64 88 Z" fill={bodyFill} stroke={brassStroke} strokeWidth="1.5" />
        {/* Tufted Leather Seat */}
        <rect x="120" y="44" width="48" height="22" rx="4" fill="#3f2e22" stroke="#1c1917" strokeWidth="1.5" />
        {/* Curved Dash Front Tiller */}
        <path d="M 252 72 Q 268 70 264 60" stroke={brassStroke} strokeWidth="3" fill="none" />
        <rect x="254" y="64" width="6" height="22" rx="2" fill={brassStroke} stroke="#78350f" strokeWidth="1.2" />
        <circle cx="258" cy="68" r="4.5" fill="#fef08a" stroke={brassStroke} strokeWidth="1.2" />
        <path d="M 50 86 Q 64 62 98 66 Q 118 74 130 88" stroke="#1c1917" strokeWidth="3" fill="none" />
        <path d="M 195 88 Q 212 66 242 66 Q 260 72 268 88" stroke="#1c1917" strokeWidth="3" fill="none" />
      </g>
    );
  }

  // =========================================================================
  // DECADE 1: 1910-1919 (BRASS & TORPEDO TOURING ERA)
  // =========================================================================
  if (decade === 1) {
    if (segment === "utility") {
      // 1910s Enclosed Panel Delivery Van
      return (
        <g id="body-d1-utility">
          <path d="M 50 86 L 50 40 Q 55 36 172 36 L 172 86 Z" fill={bodyFill} stroke="#1c1917" strokeWidth="1.8" />
          <line x1="50" y1="48" x2="172" y2="48" stroke="#94a3b8" strokeWidth="1.2" opacity="0.6" />
          <path d="M 172 36 L 210 44 L 210 86 L 172 86 Z" fill={bodyFill} stroke="#1c1917" strokeWidth="1.8" />
          <rect x="176" y="44" width="26" height="26" fill={glassFill} stroke="#000" strokeWidth="1" />
          <path d="M 210 60 L 268 64 L 268 86 L 210 86 Z" fill={bodyFill} stroke="#1c1917" strokeWidth="1.6" />
          <rect x="266" y="56" width="9" height="32" rx="2" fill={brassStroke} stroke="#78350f" strokeWidth="1.2" />
          <circle cx="272" cy="62" r="5.5" fill="#fef08a" stroke={brassStroke} strokeWidth="1.5" />
          <line x1="120" y1="88" x2="200" y2="88" stroke="#000" strokeWidth="3" />
        </g>
      );
    }
    if (segment === "luxury") {
      // 1910s Town Car / Chauffeur Limousine (Formal bevel-glass cabin + open driver)
      return (
        <g id="body-d1-luxury">
          <path d="M 48 86 L 54 38 Q 62 30 110 30 L 190 30 L 190 86 Z" fill={bodyFill} stroke={brassStroke} strokeWidth="1.8" />
          <rect x="76" y="38" width="46" height="28" rx="3" fill={glassFill} stroke={brassStroke} strokeWidth="1.2" />
          <rect x="132" y="38" width="48" height="28" rx="3" fill={glassFill} stroke={brassStroke} strokeWidth="1.2" />
          {/* Driver Cockpit */}
          <path d="M 190 52 L 222 52 L 222 86 L 190 86 Z" fill={bodyFill} stroke="#1c1917" strokeWidth="1.5" />
          <path d="M 222 58 L 275 62 L 275 86 L 222 86 Z" fill={bodyFill} stroke="#1c1917" strokeWidth="1.5" />
          <rect x="273" y="50" width="10" height="38" rx="2" fill={brassStroke} stroke="#78350f" strokeWidth="1.2" />
          <circle cx="280" cy="56" r="6" fill="#fef08a" stroke={brassStroke} strokeWidth="1.5" />
          <line x1="120" y1="88" x2="200" y2="88" stroke="#1c1917" strokeWidth="3.5" />
        </g>
      );
    }
    if (segment === "family") {
      // 1910s 5-Passenger Torpedo Tourer
      return (
        <g id="body-d1-family">
          <path d="M 52 86 Q 60 52 110 52 L 210 52 L 225 60 L 274 64 L 274 86 L 52 86 Z" fill={bodyFill} stroke={brassStroke} strokeWidth="1.6" />
          {/* Folded Canvas Soft Top */}
          <path d="M 52 56 Q 60 48 82 52 Q 65 65 52 65 Z" fill="#78350f" stroke="#451a03" strokeWidth="1" />
          {/* Windshield Glass */}
          <line x1="210" y1="52" x2="205" y2="38" stroke={brassStroke} strokeWidth="2" />
          <rect x="198" y="38" width="10" height="14" fill={glassFill} stroke={brassStroke} strokeWidth="1" opacity="0.85" />
          <rect x="272" y="56" width="8" height="32" rx="2" fill={brassStroke} stroke="#78350f" strokeWidth="1.2" />
          <circle cx="278" cy="62" r="5.5" fill="#fef08a" stroke={brassStroke} strokeWidth="1.5" />
          <line x1="120" y1="88" x2="200" y2="88" stroke="#1c1917" strokeWidth="3.5" />
        </g>
      );
    }
    // 1910s Economy: Model-T Tin Lizzie Roadster
    return (
      <g id="body-d1-economy">
        <path d="M 58 86 Q 68 56 122 56 L 198 56 L 212 64 L 268 66 L 268 86 L 58 86 Z" fill={bodyFill} stroke={brassStroke} strokeWidth="1.5" />
        {/* Roadster Buggy Top */}
        <path d="M 120 56 Q 130 38 165 38 L 196 38 L 198 56 Z" fill="#451a03" stroke="#1c1917" strokeWidth="1.2" />
        <rect x="198" y="44" width="12" height="18" fill={glassFill} stroke={brassStroke} strokeWidth="1" />
        <rect x="266" y="58" width="8" height="30" rx="2" fill={brassStroke} stroke="#78350f" strokeWidth="1.2" />
        <circle cx="272" cy="64" r="5" fill="#fef08a" stroke={brassStroke} strokeWidth="1.5" />
        <line x1="120" y1="88" x2="200" y2="88" stroke="#1c1917" strokeWidth="3.5" />
      </g>
    );
  }

  // =========================================================================
  // DECADE 2: 1920-1929 (ROARING TWENTIES VINTAGE ERA)
  // =========================================================================
  if (decade === 2) {
    if (segment === "utility") {
      // 1920s Express Stake-Bed Truck
      return (
        <g id="body-d2-utility">
          <rect x="48" y="58" width="112" height="28" rx="2" fill="#451a03" stroke="#1c1917" strokeWidth="1.5" />
          <line x1="48" y1="67" x2="160" y2="67" stroke="#78350f" strokeWidth="2" />
          <line x1="48" y1="76" x2="160" y2="76" stroke="#78350f" strokeWidth="2" />
          <path d="M 160 86 L 160 42 Q 166 40 188 40 L 210 40 L 216 54 L 228 66 L 276 68 L 276 86 L 160 86 Z" fill={bodyFill} stroke={nickelStroke} strokeWidth="1.5" />
          <rect x="166" y="45" width="38" height="20" fill={glassFill} stroke={nickelStroke} strokeWidth="1" />
          <rect x="274" y="56" width="9" height="32" rx="2" fill={nickelStroke} stroke="#475569" strokeWidth="1.2" />
          <circle cx="280" cy="64" r="5.5" fill="#fef08a" stroke={nickelStroke} strokeWidth="1.5" />
          <line x1="120" y1="88" x2="198" y2="88" stroke="#000" strokeWidth="3.5" />
        </g>
      );
    }
    if (segment === "luxury") {
      // 1920s Gatsby Dual-Cowl Phaeton / Boattail Speedster (Monumental hood, twin horns)
      return (
        <g id="body-d2-luxury">
          <path d="M 46 86 Q 52 56 100 52 L 180 50 L 195 60 L 282 62 L 282 86 L 46 86 Z" fill={bodyFill} stroke={nickelStroke} strokeWidth="1.8" />
          {/* Folded Top & Dual Windshields */}
          <path d="M 48 56 Q 55 46 76 48 Z" fill="#29180d" />
          <line x1="130" y1="52" x2="126" y2="40" stroke={nickelStroke} strokeWidth="1.8" />
          <line x1="195" y1="60" x2="190" y2="45" stroke={nickelStroke} strokeWidth="2" />
          <rect x="184" y="44" width="10" height="16" fill={glassFill} stroke={nickelStroke} strokeWidth="1" opacity="0.9" />
          {/* Side Mounted Spare Wheel */}
          <circle cx="160" cy="72" r="14" fill="#09090b" stroke={nickelStroke} strokeWidth="1.2" />
          <circle cx="160" cy="72" r="10" fill="#ffffff" />
          <circle cx="160" cy="72" r="6" fill={nickelStroke} />
          {/* Monumental Radiator & Twin Trumpet Horns */}
          <rect x="280" y="52" width="10" height="36" rx="2" fill={nickelStroke} stroke="#334155" strokeWidth="1.5" />
          <circle cx="286" cy="58" r="6.5" fill="#fef08a" stroke={nickelStroke} strokeWidth="1.5" />
          <line x1="265" y1="74" x2="280" y2="74" stroke={nickelStroke} strokeWidth="3" />
          <line x1="120" y1="88" x2="200" y2="88" stroke="#1c1917" strokeWidth="4" />
        </g>
      );
    }
    if (segment === "family") {
      // 1920s Tudor 4-Door Box Sedan
      return (
        <g id="body-d2-family">
          <path d="M 52 86 L 56 42 Q 62 36 105 36 L 205 36 L 218 52 L 226 64 L 278 66 L 278 86 L 52 86 Z" fill={bodyFill} stroke={nickelStroke} strokeWidth="1.6" />
          {/* Sunvisor */}
          <line x1="202" y1="36" x2="220" y2="44" stroke="#000" strokeWidth="2" />
          {/* 3 Windows */}
          <rect x="75" y="42" width="34" height="22" rx="2" fill={glassFill} stroke={nickelStroke} strokeWidth="1" />
          <rect x="117" y="42" width="38" height="22" rx="2" fill={glassFill} stroke={nickelStroke} strokeWidth="1" />
          <rect x="163" y="42" width="38" height="22" rx="2" fill={glassFill} stroke={nickelStroke} strokeWidth="1" />
          {/* External Rear Trunk Rack */}
          <rect x="42" y="66" width="10" height="18" rx="2" fill="#29180d" stroke="#000" strokeWidth="1" />
          <rect x="276" y="56" width="9" height="32" rx="2" fill={nickelStroke} stroke="#334155" strokeWidth="1.2" />
          <circle cx="282" cy="62" r="5.5" fill="#fef08a" stroke={nickelStroke} strokeWidth="1.5" />
          <line x1="120" y1="88" x2="200" y2="88" stroke="#000" strokeWidth="3.5" />
        </g>
      );
    }
    // 1920s Economy: Doctor’s Coupe (Tall cab, visor, rumble trunk)
    return (
      <g id="body-d2-economy">
        <path d="M 54 86 Q 60 70 85 68 L 135 68 L 140 40 L 195 40 L 208 54 L 216 66 L 274 68 L 274 86 L 54 86 Z" fill={bodyFill} stroke={nickelStroke} strokeWidth="1.5" />
        <line x1="192" y1="40" x2="210" y2="48" stroke="#000" strokeWidth="2" />
        <rect x="146" y="45" width="46" height="20" fill={glassFill} stroke={nickelStroke} strokeWidth="1" />
        <rect x="272" y="58" width="8" height="30" rx="2" fill={nickelStroke} stroke="#334155" strokeWidth="1.2" />
        <circle cx="278" cy="64" r="5" fill="#fef08a" stroke={nickelStroke} strokeWidth="1.5" />
        <line x1="120" y1="88" x2="200" y2="88" stroke="#000" strokeWidth="3.5" />
      </g>
    );
  }

  // =========================================================================
  // DECADE 3: 1930-1939 (ART DECO & STREAMLINE MODERNE)
  // =========================================================================
  if (decade === 3) {
    if (segment === "utility") {
      // 1930s Sculpted Art Deco Stepside Pickup
      return (
        <g id="body-d3-utility">
          <rect x="48" y="62" width="112" height="24" rx="2" fill={bodyFill} stroke={chromeStroke} strokeWidth="1.4" />
          <path d="M 66 86 Q 72 68 92 68 Q 112 68 118 86" stroke="#09090b" strokeWidth="4.5" fill="none" />
          <path d="M 160 86 L 160 44 Q 166 40 192 40 Q 212 40 220 54 L 234 68 L 280 70 Q 284 76 280 88 L 160 88 Z" fill={bodyFill} stroke={chromeStroke} strokeWidth="1.5" />
          <path d="M 166 48 L 204 48 L 216 66 L 166 66 Z" fill={glassFill} stroke={chromeStroke} strokeWidth="1" />
          <path d="M 276 66 Q 285 76 280 90 L 270 90 Z" fill={chromeStroke} stroke="#334155" strokeWidth="1.2" />
          <circle cx="276" cy="68" r="4.5" fill="#fef08a" stroke={chromeStroke} strokeWidth="1.2" />
          <path d="M 195 88 Q 215 64 255 64 Q 280 72 286 88" stroke="#09090b" strokeWidth="4.5" fill="none" />
        </g>
      );
    }
    if (segment === "luxury") {
      // 1930s V12/V16 Streamline Grand Coupe (Fender skirts, chrome spears, sweeping teardrop)
      return (
        <g id="body-d3-luxury">
          <path d="M 45 86 Q 52 50 100 36 Q 165 28 208 42 L 230 62 L 284 66 Q 290 74 286 86 L 45 86 Z" fill={bodyFill} stroke={chromeStroke} strokeWidth="1.8" />
          <path d="M 108 42 L 152 38 L 152 62 L 100 62 Z" fill={glassFill} stroke={chromeStroke} strokeWidth="1" />
          <path d="M 158 38 L 204 42 L 218 62 L 158 62 Z" fill={glassFill} stroke={chromeStroke} strokeWidth="1" />
          {/* Chrome Spear along entire flank */}
          <line x1="50" y1="62" x2="280" y2="64" stroke={chromeStroke} strokeWidth="2" />
          {/* Covered Rear Fender Skirt */}
          <path d="M 70 86 Q 72 68 92 68 Q 112 68 114 86 Z" fill={bodyFill} stroke={chromeStroke} strokeWidth="1.2" />
          {/* Teardrop Waterfall Grille */}
          <path d="M 280 64 Q 290 74 284 88 L 274 88 Z" fill={chromeStroke} stroke="#334155" strokeWidth="1.5" />
          <circle cx="276" cy="62" r="5" fill="#fef08a" stroke={chromeStroke} strokeWidth="1.2" />
          <path d="M 195 88 Q 215 60 255 62 Q 282 70 288 88" stroke="#09090b" strokeWidth="4.5" fill="none" />
        </g>
      );
    }
    if (segment === "family") {
      // 1930s Art Deco Aerodyne Sedan (Split windshield, bustle trunk, pontoon fenders)
      return (
        <g id="body-d3-family">
          <path d="M 50 86 Q 56 54 105 38 Q 170 32 205 46 L 225 64 L 278 68 Q 284 76 280 88 L 50 88 Z" fill={bodyFill} stroke={chromeStroke} strokeWidth="1.6" />
          <path d="M 112 44 L 152 40 L 152 64 L 105 64 Z" fill={glassFill} stroke={chromeStroke} strokeWidth="1" />
          <path d="M 158 40 L 202 44 L 216 64 L 158 64 Z" fill={glassFill} stroke={chromeStroke} strokeWidth="1" />
          <line x1="56" y1="65" x2="274" y2="67" stroke={chromeStroke} strokeWidth="1.5" />
          <path d="M 276 66 Q 285 75 282 90 L 273 90 Z" fill={chromeStroke} stroke="#334155" strokeWidth="1.5" />
          <circle cx="274" cy="64" r="4.5" fill="#fef08a" stroke={chromeStroke} strokeWidth="1.2" />
          <path d="M 46 88 Q 55 58 95 64 Q 120 72 135 90" stroke="#09090b" strokeWidth="4" fill="none" />
          <path d="M 195 90 Q 215 62 255 64 Q 280 72 286 90" stroke="#09090b" strokeWidth="4" fill="none" />
        </g>
      );
    }
    // 1930s Economy: Streamline Sloping Fastback Beetle/Coupe
    return (
      <g id="body-d3-economy">
        <path d="M 50 86 Q 58 48 115 36 Q 165 30 196 46 L 220 64 L 268 68 Q 274 76 270 88 L 50 88 Z" fill={bodyFill} stroke={chromeStroke} strokeWidth="1.5" />
        <path d="M 116 42 Q 155 38 185 48 L 195 64 L 110 64 Z" fill={glassFill} stroke={chromeStroke} strokeWidth="1" />
        <path d="M 268 66 Q 276 74 272 88 L 264 88 Z" fill={chromeStroke} stroke="#334155" strokeWidth="1.2" />
        <circle cx="266" cy="65" r="4.5" fill="#fef08a" stroke={chromeStroke} strokeWidth="1.2" />
        <path d="M 46 88 Q 55 58 95 64 Q 120 72 132 90" stroke="#09090b" strokeWidth="4" fill="none" />
        <path d="M 195 90 Q 215 62 250 64 Q 272 72 278 90" stroke="#09090b" strokeWidth="4" fill="none" />
      </g>
    );
  }

  // =========================================================================
  // DECADE 4: 1940-1949 (POST-WAR PONTON ERA)
  // =========================================================================
  if (decade === 4) {
    if (segment === "utility") {
      // 1940s Heavy-Duty Workhorse Truck
      return (
        <g id="body-d4-utility">
          <rect x="46" y="60" width="116" height="26" rx="2" fill={bodyFill} stroke={chromeStroke} strokeWidth="1.5" />
          <path d="M 68 86 Q 72 68 92 68 Q 112 68 116 86" stroke="#09090b" strokeWidth="5" fill="none" />
          <path d="M 160 86 L 160 44 Q 166 40 195 40 Q 216 40 224 56 L 236 68 L 284 70 L 284 88 L 160 88 Z" fill={bodyFill} stroke={chromeStroke} strokeWidth="1.5" />
          <path d="M 166 46 L 202 46 L 216 66 L 166 66 Z" fill={glassFill} stroke={chromeStroke} strokeWidth="1" />
          {/* Horizontal Bar Heavy Grille */}
          <rect x="278" y="70" width="8" height="18" rx="2" fill={chromeStroke} stroke="#334155" strokeWidth="1" />
          <line x1="278" y1="74" x2="286" y2="74" stroke="#0f172a" strokeWidth="1" />
          <line x1="278" y1="78" x2="286" y2="78" stroke="#0f172a" strokeWidth="1" />
          <line x1="278" y1="82" x2="286" y2="82" stroke="#0f172a" strokeWidth="1" />
          <circle cx="276" cy="66" r="4.5" fill="#fef08a" stroke={chromeStroke} strokeWidth="1.2" />
        </g>
      );
    }
    if (segment === "luxury") {
      // 1940s Continental Club Coupe / Post-War Limousine (Low roofline, thick rocker chrome)
      return (
        <g id="body-d4-luxury">
          <path d="M 44 86 Q 50 60 92 50 Q 155 36 210 46 L 235 64 L 286 66 L 286 86 L 44 86 Z" fill={bodyFill} stroke={chromeStroke} strokeWidth="1.8" />
          <path d="M 102 52 Q 155 42 202 50 L 218 64 L 98 64 Z" fill={glassFill} stroke={chromeStroke} strokeWidth="1" />
          {/* Thick Lower Rocker Chrome */}
          <line x1="46" y1="84" x2="284" y2="84" stroke={chromeStroke} strokeWidth="2.5" />
          {/* Rear Wheel Skirt with Crest */}
          <path d="M 70 86 Q 72 68 92 68 Q 112 68 114 86 Z" fill={bodyFill} stroke={chromeStroke} strokeWidth="1.2" />
          <circle cx="92" cy="74" r="2" fill="#ef4444" />
          <rect x="282" y="68" width="8" height="18" rx="2" fill={chromeStroke} stroke="#334155" strokeWidth="1" />
          <circle cx="282" cy="72" r="4" fill="#fef08a" stroke={chromeStroke} strokeWidth="1" />
        </g>
      );
    }
    if (segment === "family") {
      // 1940s 4-Door Post-War Cruiser
      return (
        <g id="body-d4-family">
          <path d="M 46 86 Q 52 56 100 46 Q 160 38 208 48 L 228 64 L 282 66 L 282 86 L 46 86 Z" fill={bodyFill} stroke={chromeStroke} strokeWidth="1.6" />
          <path d="M 104 48 L 150 44 L 150 64 L 98 64 Z" fill={glassFill} stroke={chromeStroke} strokeWidth="1" />
          <path d="M 156 44 L 198 48 L 212 64 L 156 64 Z" fill={glassFill} stroke={chromeStroke} strokeWidth="1" />
          <rect x="278" y="70" width="8" height="16" rx="2" fill={chromeStroke} stroke="#334155" strokeWidth="1" />
          <circle cx="278" cy="72" r="4" fill="#fef08a" stroke={chromeStroke} strokeWidth="1" />
          <line x1="50" y1="82" x2="280" y2="82" stroke={chromeStroke} strokeWidth="1.5" />
        </g>
      );
    }
    // 1940s Economy: Compact Ponton Coupe
    return (
      <g id="body-d4-economy">
        <path d="M 48 86 Q 54 52 105 44 Q 155 38 198 50 L 218 64 L 272 66 L 272 86 L 48 86 Z" fill={bodyFill} stroke={chromeStroke} strokeWidth="1.5" />
        <path d="M 108 46 Q 150 40 190 50 L 204 64 L 102 64 Z" fill={glassFill} stroke={chromeStroke} strokeWidth="1" />
        <rect x="268" y="70" width="8" height="16" rx="2" fill={chromeStroke} stroke="#334155" strokeWidth="1" />
        <circle cx="268" cy="72" r="4" fill="#fef08a" stroke={chromeStroke} strokeWidth="1" />
      </g>
    );
  }

  // =========================================================================
  // DECADE 5: 1950-1959 (GOLDEN JET-AGE CHROME & TAILFINS)
  // =========================================================================
  if (decade === 5) {
    if (segment === "utility") {
      // 1950s Classic Stepside Pickup (Chevy 3100 / Ford F-100 style)
      return (
        <g id="body-d5-utility">
          <rect x="46" y="64" width="116" height="24" rx="2" fill={bodyFill} stroke={chromeStroke} strokeWidth="1.5" />
          <path d="M 68 88 Q 72 68 92 68 Q 112 68 116 88" stroke="#09090b" strokeWidth="5" fill="none" />
          <path d="M 160 88 L 160 48 Q 166 44 196 44 Q 214 44 224 58 L 238 68 L 285 70 Q 288 78 285 88 L 160 88 Z" fill={bodyFill} stroke={chromeStroke} strokeWidth="1.6" />
          <path d="M 166 50 L 198 48 L 220 66 L 166 66 Z" fill={glassFill} stroke={chromeStroke} strokeWidth="1" />
          <rect x="280" y="72" width="8" height="16" rx="2" fill={chromeStroke} stroke="#475569" strokeWidth="1" />
          <circle cx="282" cy="76" r="3.5" fill="#fef08a" stroke="#fff" strokeWidth="1" />
          <line x1="240" y1="78" x2="284" y2="78" stroke={chromeStroke} strokeWidth="2" />
        </g>
      );
    }
    if (segment === "luxury") {
      // 1950s Eldorado/Fleetwood Grand Fin Cruiser (Towering fins, dual bullet taillights, Dagmar bumpers)
      return (
        <g id="body-d5-luxury">
          {/* Rocket Tailfin */}
          <path d="M 40 52 Q 52 64 62 88 L 288 88 Q 292 78 288 68 L 246 66 L 216 44 L 120 44 L 88 62 L 40 52 Z" fill={bodyFill} stroke={chromeStroke} strokeWidth="1.8" />
          {/* Wraparound Glass */}
          <polygon points="94,62 122,46 214,46 240,62 94,62" fill={glassFill} stroke={chromeStroke} strokeWidth="1.2" />
          {/* Dual Red Rocket Bullet Taillights */}
          <circle cx="41" cy="54" r="3" fill="#ef4444" stroke="#fff" strokeWidth="0.8" />
          <circle cx="43" cy="62" r="3" fill="#ef4444" stroke="#fff" strokeWidth="0.8" />
          {/* Grand Chrome Dagmar Bumper Bullets */}
          <rect x="284" y="68" width="9" height="20" rx="2" fill={chromeStroke} stroke="#334155" strokeWidth="1.2" />
          <circle cx="286" cy="72" r="3.5" fill="#fef08a" stroke="#fff" strokeWidth="1" />
          <circle cx="286" cy="82" r="3.5" fill="#fef08a" stroke="#fff" strokeWidth="1" />
          {/* Stainless Side Spear */}
          <path d="M 48 70 L 140 70 L 210 76 L 285 76" stroke={chromeStroke} strokeWidth="2.5" fill="none" />
        </g>
      );
    }
    if (segment === "family") {
      // 1950s 4-Door Hardtop Cruiser (Two-tone roof, prominent rocket fins)
      return (
        <g id="body-d5-family">
          <path d="M 45 60 Q 55 68 62 88 L 285 88 Q 288 78 285 70 L 245 68 L 215 46 L 125 46 L 95 64 L 45 60 Z" fill={bodyFill} stroke={chromeStroke} strokeWidth="1.6" />
          {/* Two-Tone Roof */}
          <path d="M 95 64 L 125 46 L 215 46 L 245 68 Z" fill="url(#bodyTwoTone)" opacity="0.35" />
          <polygon points="100,64 128,48 212,48 238,64 100,64" fill={glassFill} stroke={chromeStroke} strokeWidth="1" />
          <circle cx="46" cy="62" r="2.5" fill="#ef4444" />
          <rect x="280" y="70" width="8" height="18" rx="2" fill={chromeStroke} stroke="#475569" strokeWidth="1" />
          <circle cx="282" cy="74" r="3" fill="#fef08a" stroke="#fff" strokeWidth="1" />
          <circle cx="282" cy="82" r="3" fill="#fef08a" stroke="#fff" strokeWidth="1" />
          <line x1="52" y1="74" x2="282" y2="76" stroke={chromeStroke} strokeWidth="2" />
        </g>
      );
    }
    // 1950s Economy: Tri-Five 2-Door Post Coupe
    return (
      <g id="body-d5-economy">
        <path d="M 48 64 Q 56 70 62 88 L 278 88 Q 282 78 278 70 L 238 68 L 208 48 L 128 48 L 102 64 L 48 64 Z" fill={bodyFill} stroke={chromeStroke} strokeWidth="1.5" />
        <polygon points="106,64 130,50 204,50 232,64 106,64" fill={glassFill} stroke={chromeStroke} strokeWidth="1" />
        <circle cx="49" cy="66" r="2.5" fill="#ef4444" />
        <rect x="274" y="70" width="8" height="18" rx="2" fill={chromeStroke} stroke="#475569" strokeWidth="1" />
        <circle cx="276" cy="74" r="3" fill="#fef08a" stroke="#fff" strokeWidth="1" />
        <line x1="54" y1="76" x2="276" y2="76" stroke={chromeStroke} strokeWidth="1.8" />
      </g>
    );
  }

  // =========================================================================
  // DECADE 6: 1960-1969 (SPACE-AGE, MUSCLE & COKE-BOTTLE)
  // =========================================================================
  if (decade === 6) {
    if (segment === "utility") {
      // 1960s Fleetside Smooth-Sided Pickup (Continuous steel bed, flat hood with power ridges)
      return (
        <g id="body-d6-utility">
          <rect x="46" y="66" width="120" height="22" rx="1.5" fill={bodyFill} stroke={chromeStroke} strokeWidth="1.5" />
          <line x1="46" y1="74" x2="166" y2="74" stroke={chromeStroke} strokeWidth="1.5" />
          <path d="M 166 88 L 166 48 L 216 48 L 232 64 L 286 68 L 286 88 L 166 88 Z" fill={bodyFill} stroke={chromeStroke} strokeWidth="1.5" />
          <polygon points="172,64 172,50 212,50 228,64" fill={glassFill} stroke={chromeStroke} strokeWidth="1" />
          <rect x="282" y="70" width="8" height="16" rx="1.5" fill={chromeStroke} stroke="#334155" strokeWidth="1" />
          <circle cx="284" cy="74" r="3" fill="#fef08a" />
          <circle cx="284" cy="82" r="3" fill="#fef08a" />
        </g>
      );
    }
    if (segment === "luxury") {
      // 1960s Slab-Sided Continental/Riviera Style Coupe (Razor fender blades, concealed headlights)
      return (
        <g id="body-d6-luxury">
          <path d="M 44 86 L 44 64 L 98 62 L 135 46 L 215 46 L 255 64 L 290 66 L 290 86 L 44 86 Z" fill={bodyFill} stroke={chromeStroke} strokeWidth="1.8" />
          <polygon points="102,62 138,48 212,48 248,62" fill={glassFill} stroke={chromeStroke} strokeWidth="1.2" />
          {/* Razor Blade Fender Chrome Line */}
          <line x1="44" y1="64" x2="290" y2="66" stroke={chromeStroke} strokeWidth="2" />
          {/* Concealed Headlight Grille */}
          <rect x="284" y="68" width="8" height="16" rx="1" fill="#0f172a" stroke={chromeStroke} strokeWidth="1.2" />
          <line x1="284" y1="72" x2="292" y2="72" stroke={chromeStroke} strokeWidth="1" />
          <line x1="284" y1="76" x2="292" y2="76" stroke={chromeStroke} strokeWidth="1" />
          <line x1="284" y1="80" x2="292" y2="80" stroke={chromeStroke} strokeWidth="1" />
          <rect x="42" y="68" width="4" height="12" fill="#ef4444" />
        </g>
      );
    }
    if (segment === "family") {
      // 1960s Full-Size Hardtop Sedan (Coke-bottle hip, quad horizontal headlights)
      return (
        <g id="body-d6-family">
          <path d="M 46 86 L 46 66 Q 72 64 96 64 L 132 48 L 218 48 L 252 64 L 288 66 L 288 86 L 46 86 Z" fill={bodyFill} stroke={chromeStroke} strokeWidth="1.6" />
          <polygon points="100,63 134,50 214,50 246,63" fill={glassFill} stroke={chromeStroke} strokeWidth="1" />
          <line x1="46" y1="70" x2="288" y2="70" stroke={chromeStroke} strokeWidth="1.5" />
          <rect x="282" y="70" width="8" height="16" rx="1.5" fill={chromeStroke} stroke="#334155" strokeWidth="1" />
          <circle cx="284" cy="74" r="2.8" fill="#fef08a" />
          <circle cx="284" cy="82" r="2.8" fill="#fef08a" />
          <circle cx="47" cy="72" r="2" fill="#ef4444" />
        </g>
      );
    }
    // 1960s Economy: Compact Sedan (Crisp horizontal brow, clean decklid)
    return (
      <g id="body-d6-economy">
        <path d="M 48 86 L 48 68 L 102 66 L 136 50 L 210 50 L 244 66 L 280 68 L 280 86 L 48 86 Z" fill={bodyFill} stroke={chromeStroke} strokeWidth="1.5" />
        <polygon points="106,65 138,52 206,52 238,65" fill={glassFill} stroke={chromeStroke} strokeWidth="1" />
        <rect x="274" y="70" width="8" height="16" rx="1.5" fill={chromeStroke} stroke="#334155" strokeWidth="1" />
        <circle cx="276" cy="75" r="3" fill="#fef08a" />
      </g>
    );
  }

  // =========================================================================
  // DECADE 7: 1970-1979 (MALAISE, ANGULAR & IMPACT BUMPERS)
  // =========================================================================
  if (decade === 7) {
    if (segment === "utility") {
      // 1970s Heavy-Duty Squarebody Pickup (Chisel-edged, dual tanks)
      return (
        <g id="body-d7-utility">
          <rect x="46" y="64" width="122" height="24" rx="1" fill={bodyFill} stroke="#334155" strokeWidth="1.5" />
          <line x1="46" y1="72" x2="168" y2="72" stroke="#0f172a" strokeWidth="1.5" />
          <path d="M 166 88 L 166 46 L 214 46 L 232 66 L 288 68 L 288 88 L 166 88 Z" fill={bodyFill} stroke="#334155" strokeWidth="1.5" />
          <polygon points="172,64 172,48 210,48 226,64" fill={glassFill} stroke="#0f172a" strokeWidth="1" />
          {/* Heavy 5-mph Impact Bumper */}
          <rect x="44" y="82" width="10" height="7" rx="1" fill="#09090b" stroke="#475569" strokeWidth="1" />
          <rect x="282" y="80" width="10" height="8" rx="1" fill="#09090b" stroke="#475569" strokeWidth="1" />
          <rect x="282" y="70" width="8" height="12" fill={chromeStroke} />
          <rect x="284" y="72" width="5" height="4" fill="#f8fafc" />
        </g>
      );
    }
    if (segment === "luxury") {
      // 1970s Personal Luxury Coupe (Mark IV style: Stand-up ornament, vinyl roof with opera window)
      return (
        <g id="body-d7-luxury">
          <path d="M 46 86 L 46 66 L 105 66 L 140 48 L 215 48 L 255 66 L 292 68 L 292 88 L 46 88 Z" fill={bodyFill} stroke="#334155" strokeWidth="1.6" />
          {/* Padded Vinyl Landau Roof */}
          <path d="M 105 66 L 140 48 L 175 48 L 175 66 Z" fill="#18181b" />
          <ellipse cx="125" cy="56" rx="4" ry="6" fill={glassFill} stroke={chromeStroke} strokeWidth="1" />
          <polygon points="178,65 178,50 212,50 248,65" fill={glassFill} stroke="#0f172a" strokeWidth="1" />
          {/* Stand-up Hood Ornament & Massive Grille */}
          <rect x="286" y="68" width="8" height="18" rx="1" fill={chromeStroke} stroke="#334155" strokeWidth="1" />
          <line x1="284" y1="68" x2="284" y2="62" stroke={chromeStroke} strokeWidth="1.5" />
          <circle cx="284" cy="61" r="1.5" fill={chromeStroke} />
          <rect x="284" y="82" width="10" height="7" rx="1" fill="#09090b" />
        </g>
      );
    }
    if (segment === "family") {
      // 1970s Malaise 4-Door Sedan (5-mph aluminum bumpers, opera windows)
      return (
        <g id="body-d7-family">
          <path d="M 46 86 L 46 68 L 108 66 L 142 50 L 218 50 L 256 66 L 290 68 L 290 88 L 46 88 Z" fill={bodyFill} stroke="#334155" strokeWidth="1.5" />
          <polygon points="112,65 144,52 214,52 250,65" fill={glassFill} stroke="#0f172a" strokeWidth="1" />
          <line x1="178" y1="52" x2="178" y2="65" stroke="#334155" strokeWidth="2" />
          <rect x="42" y="80" width="10" height="7" rx="1" fill="#94a3b8" stroke="#09090b" strokeWidth="1" />
          <rect x="284" y="80" width="10" height="7" rx="1" fill="#94a3b8" stroke="#09090b" strokeWidth="1" />
          <rect x="284" y="70" width="8" height="12" fill="#cbd5e1" />
        </g>
      );
    }
    // 1970s Economy: Hatchback / Subcompact
    return (
      <g id="body-d7-economy">
        <path d="M 52 86 L 52 64 L 110 64 L 146 50 L 210 50 L 250 66 L 282 72 L 282 88 L 52 88 Z" fill={bodyFill} stroke="#334155" strokeWidth="1.5" />
        <polygon points="114,63 148,52 206,52 242,65" fill={glassFill} stroke="#0f172a" strokeWidth="1" />
        <rect x="48" y="80" width="8" height="7" rx="1" fill="#09090b" />
        <rect x="278" y="80" width="8" height="7" rx="1" fill="#09090b" />
      </g>
    );
  }

  // =========================================================================
  // DECADE 8: 1980-1989 (WEDGE, TURBO & ORIGAMI AERODYNAMICS)
  // =========================================================================
  if (decade === 8) {
    if (segment === "utility") {
      // 1980s Turbodiesel Work Truck (Squarebody with utility roll-bar)
      return (
        <g id="body-d8-utility">
          <rect x="48" y="64" width="120" height="24" rx="1.5" fill={bodyFill} stroke="#334155" strokeWidth="1.5" />
          <line x1="110" y1="64" x2="110" y2="48" stroke="#09090b" strokeWidth="2.5" />
          <line x1="110" y1="48" x2="166" y2="64" stroke="#09090b" strokeWidth="2" />
          <path d="M 166 88 L 166 46 L 215 46 L 235 66 L 290 70 L 290 88 L 166 88 Z" fill={bodyFill} stroke="#334155" strokeWidth="1.5" />
          <polygon points="172,64 172,48 212,48 230,64" fill={glassFill} stroke="#0f172a" strokeWidth="1.2" />
          <rect x="282" y="70" width="8" height="14" rx="1" fill={chromeStroke} stroke="#334155" strokeWidth="1" />
          <rect x="284" y="72" width="5" height="4" fill="#f8fafc" />
          <rect x="284" y="78" width="5" height="4" fill="#f8fafc" />
          <rect x="46" y="82" width="10" height="6" rx="1" fill="#09090b" />
          <rect x="284" y="82" width="8" height="6" rx="1" fill="#09090b" />
        </g>
      );
    }
    if (segment === "luxury") {
      // 1980s Autobahn Executive Cruiser (W126 style: aerodynamic fluted lights, lower cladding)
      return (
        <g id="body-d8-luxury">
          <path d="M 48 86 L 48 68 L 102 66 L 140 46 L 222 46 L 265 66 L 292 72 L 292 88 L 48 88 Z" fill={bodyFill} stroke="#334155" strokeWidth="1.6" />
          <polygon points="108,65 142,48 218,48 258,65" fill={glassFill} stroke="#0f172a" strokeWidth="1.2" />
          {/* Sacco Board Lower Two-Tone Cladding */}
          <line x1="48" y1="80" x2="292" y2="80" stroke="#09090b" strokeWidth="4" />
          <rect x="285" y="70" width="8" height="10" rx="1" fill="#f8fafc" stroke="#64748b" strokeWidth="1" />
          <rect x="46" y="72" width="4" height="12" fill="#ef4444" />
        </g>
      );
    }
    if (segment === "family") {
      // 1980s Aerodynamic Breakthrough Wedge Sedan (Audi 100 / Taurus style)
      return (
        <g id="body-d8-family">
          <path d="M 48 86 L 48 68 L 102 66 L 142 46 L 220 46 L 264 66 L 290 74 L 290 88 L 48 88 Z" fill={bodyFill} stroke="#334155" strokeWidth="1.5" />
          <polygon points="108,65 144,48 216,48 258,65" fill={glassFill} stroke="#0f172a" strokeWidth="1.2" />
          <line x1="52" y1="78" x2="288" y2="78" stroke="#09090b" strokeWidth="2.5" />
          <polygon points="266,68 286,72 286,78 266,76" fill="#f8fafc" stroke="#64748b" strokeWidth="1" />
        </g>
      );
    }
    // 1980s Economy: Boxy 3-Door Hot Hatch
    return (
      <g id="body-d8-economy">
        <path d="M 52 86 L 52 64 L 110 64 L 148 46 L 216 46 L 260 68 L 286 76 L 286 88 L 52 88 Z" fill={bodyFill} stroke="#334155" strokeWidth="1.5" />
        <polygon points="115,63 150,48 212,48 252,65" fill={glassFill} stroke="#0f172a" strokeWidth="1.2" />
        {/* Integrated Rear Roof Spoiler */}
        <line x1="140" y1="46" x2="148" y2="46" stroke="#000" strokeWidth="2.5" />
        <rect x="48" y="78" width="10" height="8" rx="1.5" fill="#09090b" />
        <rect x="280" y="78" width="8" height="8" rx="1.5" fill="#09090b" />
        <line x1="56" y1="78" x2="280" y2="78" stroke="#09090b" strokeWidth="2.5" />
      </g>
    );
  }

  // =========================================================================
  // DECADE 9: 1990-1999 (ORGANIC BIODESIGN & AERO FLUIDITY)
  // =========================================================================
  if (decade === 9) {
    if (segment === "utility") {
      // 1990s Rounded Fleetside Pickup
      return (
        <g id="body-d9-utility">
          <rect x="48" y="62" width="118" height="24" rx="2" fill={bodyFill} stroke="#334155" strokeWidth="1.4" />
          <path d="M 166 86 L 166 44 Q 170 42 210 42 L 250 62 L 288 66 L 288 86 L 166 86 Z" fill={bodyFill} stroke="#334155" strokeWidth="1.4" />
          <polygon points="172,62 172,46 208,46 242,62" fill={glassFill} stroke="#0f172a" strokeWidth="1" />
          <rect x="280" y="66" width="8" height="12" rx="1" fill="#f8fafc" stroke="#64748b" strokeWidth="1" />
        </g>
      );
    }
    if (segment === "luxury") {
      // 1990s Flagship Executive Sedan (LS400/W140 style: rock solid proportions)
      return (
        <g id="body-d9-luxury">
          <path d="M 48 86 Q 50 68 98 64 Q 155 42 220 46 L 268 64 L 292 72 L 292 88 L 48 88 Z" fill={bodyFill} stroke={chromeStroke} strokeWidth="1.4" />
          <path d="M 104 63 Q 155 46 215 48 L 260 64 L 100 64 Z" fill={glassFill} stroke="#0f172a" strokeWidth="1.2" />
          <line x1="50" y1="80" x2="290" y2="80" stroke={chromeStroke} strokeWidth="1.5" />
          <rect x="284" y="68" width="8" height="10" rx="1" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1" />
        </g>
      );
    }
    if (segment === "family") {
      // 1990s Sleek Biodesign Sedan (Oval greenhouse, integrated door handles)
      return (
        <g id="body-d9-family">
          <path d="M 48 86 Q 52 66 98 60 Q 155 40 216 48 L 265 64 Q 288 72 290 86 L 48 86 Z" fill={bodyFill} stroke="#334155" strokeWidth="1.4" />
          <path d="M 104 59 Q 158 43 212 50 L 254 64 L 100 64 Z" fill={glassFill} stroke="#0f172a" strokeWidth="1" />
          <polygon points="266,66 286,72 284,78 266,76" fill="#f8fafc" stroke="#64748b" strokeWidth="1" />
        </g>
      );
    }
    // 1990s Economy: Rounded Aerodynamic Bubble Hatch
    return (
      <g id="body-d9-economy">
        <path d="M 50 86 Q 52 64 100 58 Q 150 42 208 46 L 255 66 Q 280 74 282 86 L 50 86 Z" fill={bodyFill} stroke="#334155" strokeWidth="1.4" />
        <path d="M 105 57 Q 152 45 204 48 L 246 66 L 100 66 Z" fill={glassFill} stroke="#0f172a" strokeWidth="1" />
        <ellipse cx="274" cy="72" rx="6" ry="4" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1" />
      </g>
    );
  }

  // =========================================================================
  // DECADE 10: 2000-2009 (NEW EDGE & HIGH BELTLINE)
  // =========================================================================
  if (decade === 10) {
    if (segment === "utility") {
      // 2000s Full-Size Crew Cab Pickup (Towering chrome grille, flared squared arches)
      return (
        <g id="body-d10-utility">
          <path d="M 48 86 L 48 60 L 165 60 L 165 86 Z" fill={bodyFill} stroke={chromeStroke} strokeWidth="1.2" />
          <path d="M 165 86 L 165 44 Q 170 42 215 42 L 255 60 L 290 64 L 290 86 L 165 86 Z" fill={bodyFill} stroke={chromeStroke} strokeWidth="1.4" />
          <polygon points="172,62 172,46 212,46 246,62" fill={glassFill} stroke="#0f172a" strokeWidth="1" />
          <rect x="282" y="64" width="8" height="14" rx="1" fill="#f8fafc" stroke="#334155" strokeWidth="1" />
        </g>
      );
    }
    if (segment === "luxury") {
      // 2000s Executive Sports Sedan (Halo rings, wide stance, dual exhausts)
      return (
        <g id="body-d10-luxury">
          <path d="M 46 84 Q 50 64 96 56 Q 155 38 218 46 L 268 64 Q 288 72 292 84 L 46 84 Z" fill={bodyFill} stroke={chromeStroke} strokeWidth="1.4" />
          <path d="M 104 56 Q 158 40 214 48 L 256 64 L 100 64 Z" fill={glassFill} stroke="#0f172a" strokeWidth="1" />
          <polygon points="268,66 288,72 284,76 266,74" fill="#67e8f9" stroke="#0891b2" strokeWidth="1" />
          <line x1="48" y1="84" x2="54" y2="84" stroke={chromeStroke} strokeWidth="3" />
        </g>
      );
    }
    if (segment === "family") {
      // 2000s Midsize Family Sedan (High trunk deck, clear projectors)
      return (
        <g id="body-d10-family">
          <path d="M 48 84 Q 52 64 96 58 Q 155 40 215 48 L 266 64 Q 288 72 290 84 L 48 84 Z" fill={bodyFill} stroke="#334155" strokeWidth="1.4" />
          <path d="M 104 58 Q 158 42 212 50 L 254 64 L 100 64 Z" fill={glassFill} stroke="#0f172a" strokeWidth="1" />
          <polygon points="266,66 286,72 284,76 266,74" fill="#f8fafc" stroke="#64748b" strokeWidth="1" />
        </g>
      );
    }
    // 2000s Economy: New Edge Euro Compact (Triangular headlights, high roofline)
    return (
      <g id="body-d10-economy">
        <path d="M 50 84 Q 52 62 100 54 Q 150 42 210 46 L 258 66 Q 284 74 286 84 L 50 84 Z" fill={bodyFill} stroke="#334155" strokeWidth="1.4" />
        <path d="M 105 54 Q 152 44 206 48 L 248 66 L 100 66 Z" fill={glassFill} stroke="#0f172a" strokeWidth="1" />
        <polygon points="258,66 282,72 280,78 258,74" fill="#f8fafc" stroke="#64748b" strokeWidth="1" />
      </g>
    );
  }

  // =========================================================================
  // DECADE 11: 2010-2019 (KINETIC SCULPTING & LED ERA)
  // =========================================================================
  if (decade === 11) {
    if (segment === "utility") {
      // 2010s Modern Heavy-Duty Commercial Truck (C-clamp LED headlights, massive grille)
      return (
        <g id="body-d11-utility">
          <path d="M 48 84 L 48 58 L 165 58 L 165 84 Z" fill={bodyFill} stroke={chromeStroke} strokeWidth="1.2" />
          <path d="M 165 84 L 165 42 Q 170 40 215 40 L 255 58 L 292 62 L 292 84 L 165 84 Z" fill={bodyFill} stroke={chromeStroke} strokeWidth="1.2" />
          <polygon points="172,60 172,44 212,44 246,60" fill={glassFill} stroke="#0f172a" strokeWidth="1" />
          {/* C-Clamp Signature LED Headlight */}
          <path d="M 284 62 L 290 62 L 290 78 L 284 78 Z" fill="#38bdf8" stroke="#e0f2fe" strokeWidth="1" />
          <rect x="282" y="66" width="6" height="8" rx="1" fill="#0f172a" />
        </g>
      );
    }
    if (segment === "luxury") {
      // 2010s Grand Coupe / Flagship Luxury Sedan (Matrix LED blades, panoramic glass)
      return (
        <g id="body-d11-luxury">
          <path d="M 46 84 Q 50 62 94 54 Q 155 34 216 46 L 270 62 Q 290 70 294 84 L 46 84 Z" fill={bodyFill} stroke={chromeStroke} strokeWidth="1.4" />
          <path d="M 102 54 Q 158 38 212 48 L 258 63 L 98 63 Z" fill={glassFill} stroke="#0f172a" strokeWidth="1" />
          {/* Matrix LED Blade */}
          <path d="M 270 63 Q 290 70 292 72 L 286 76 Z" fill="#38bdf8" stroke="#e0f2fe" strokeWidth="1.2" />
          <path d="M 48 66 Q 46 72 50 76" stroke="#ef4444" strokeWidth="2.5" fill="none" />
        </g>
      );
    }
    if (segment === "family") {
      // 2010s Fastback Crossover / Sedan (Cascading hexagonal grille, dual crease waistline)
      return (
        <g id="body-d11-family">
          <path d="M 48 84 Q 52 64 96 56 Q 155 38 216 48 L 268 64 Q 288 72 290 84 L 48 84 Z" fill={bodyFill} stroke="#334155" strokeWidth="1.2" />
          <path d="M 105 56 Q 160 40 212 50 L 252 65 L 100 65 Z" fill={glassFill} stroke="#0f172a" strokeWidth="1" />
          <path d="M 265 66 Q 285 72 288 74 L 284 78 Z" fill="#38bdf8" stroke="#e0f2fe" strokeWidth="1" />
          <path d="M 50 68 Q 48 74 52 78" stroke="#ef4444" strokeWidth="2" fill="none" />
        </g>
      );
    }
    // 2010s Economy: Dynamic Kinetic Hatchback (Floating roof, sharp swage lines)
    return (
      <g id="body-d11-economy">
        <path d="M 50 84 Q 52 62 98 54 Q 150 40 210 46 L 260 64 Q 284 72 286 84 L 50 84 Z" fill={bodyFill} stroke="#334155" strokeWidth="1.2" />
        <path d="M 104 54 Q 152 42 206 48 L 248 64 L 100 64 Z" fill={glassFill} stroke="#0f172a" strokeWidth="1" />
        <path d="M 260 65 Q 280 72 282 74 L 278 78 Z" fill="#38bdf8" stroke="#e0f2fe" strokeWidth="1" />
      </g>
    );
  }

  // =========================================================================
  // DECADE 12: 2020-2026+ (ELECTRIC CYBER & NEO-AERO ERA)
  // =========================================================================
  // segment: utility (Next-Gen Electric Cyber-Truck)
  if (segment === "utility") {
    return (
      <g id="body-d12-utility">
        <polygon points="46,84 46,58 160,56 220,38 260,56 295,62 295,84" fill={bodyFill} stroke="#38bdf8" strokeWidth="1.2" />
        <polygon points="166,58 216,42 254,58" fill={glassFill} stroke="#0f172a" strokeWidth="1" />
        {/* Full-Width Horizon Cyber LED Lightbar */}
        <line x1="284" y1="64" x2="295" y2="64" stroke="#38bdf8" strokeWidth="3" />
        <line x1="46" y1="60" x2="52" y2="60" stroke="#ef4444" strokeWidth="3" />
      </g>
    );
  }
  // segment: luxury (Ultra-Luxury Electric Grand Tourer)
  if (segment === "luxury") {
    return (
      <g id="body-d12-luxury">
        <path d="M 44 84 Q 48 60 92 52 Q 155 30 218 42 L 274 60 Q 295 68 296 84 L 44 84 Z" fill={bodyFill} stroke="#38bdf8" strokeWidth="1.4" />
        <path d="M 100 52 Q 158 34 214 44 L 262 60 L 96 60 Z" fill={glassFill} stroke="#0f172a" strokeWidth="1" />
        {/* Interactive Matrix Micro-LED Lightbar & Illuminated Logo */}
        <path d="M 274 60 Q 295 68 296 72" stroke="#38bdf8" strokeWidth="3" fill="none" />
        <circle cx="294" cy="74" r="2.5" fill="#38bdf8" />
        <path d="M 45 64 Q 44 70 48 76" stroke="#ef4444" strokeWidth="3" fill="none" />
      </g>
    );
  }
  // segment: family (Aerodynamic Electric Crossover / Shooting Brake)
  if (segment === "family") {
    return (
      <g id="body-d12-family">
        <path d="M 46 84 Q 50 62 94 54 Q 155 34 218 44 L 270 62 Q 292 70 294 84 L 46 84 Z" fill={bodyFill} stroke="#38bdf8" strokeWidth="1.2" />
        <path d="M 102 54 Q 158 36 214 46 L 258 62 L 98 62 Z" fill={glassFill} stroke="#0f172a" strokeWidth="1" />
        <line x1="274" y1="64" x2="294" y2="66" stroke="#38bdf8" strokeWidth="2.5" />
        <line x1="46" y1="66" x2="52" y2="66" stroke="#ef4444" strokeWidth="2.5" />
      </g>
    );
  }
  // segment: economy (Urban EV Aerodynamic Hatchback)
  return (
    <g id="body-d12-economy">
      <path d="M 48 84 Q 50 60 96 52 Q 150 36 212 44 L 264 62 Q 288 70 290 84 L 48 84 Z" fill={bodyFill} stroke="#38bdf8" strokeWidth="1.2" />
      <path d="M 102 52 Q 152 38 208 46 L 252 62 L 98 62 Z" fill={glassFill} stroke="#0f172a" strokeWidth="1" />
      <line x1="268" y1="64" x2="288" y2="66" stroke="#38bdf8" strokeWidth="2.5" />
      <line x1="48" y1="66" x2="54" y2="66" stroke="#ef4444" strokeWidth="2.5" />
    </g>
  );
}
