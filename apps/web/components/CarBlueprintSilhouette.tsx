'use client';

import React, { useState } from 'react';
import type { VehicleSegment } from '@ait/shared-types';

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
  accentColor = '#b45309',
  year = 1900,
}: Props): React.JSX.Element {
  // Theme toggle: 'blueprint' (Engineer Cyan Navy) or 'patent' (Antique Sepia Parchment)
  const [theme, setTheme] = useState<'blueprint' | 'patent'>('patent');

  const isBlueprint = theme === 'blueprint';
  const bgColor = isBlueprint ? '#0a192f' : '#fcf9f0';
  const gridLine = isBlueprint ? '#1e3a8a' : '#e5dac3';
  const mainStroke = isBlueprint ? '#38bdf8' : '#78350f';
  const fillBody = isBlueprint ? 'rgba(56, 189, 248, 0.12)' : 'rgba(180, 83, 9, 0.1)';
  const brassGold = isBlueprint ? '#fbbf24' : '#b45309';
  const glassColor = isBlueprint ? 'rgba(147, 197, 253, 0.3)' : 'rgba(219, 234, 254, 0.45)';
  const tireFill = isBlueprint ? '#1e293b' : '#332a22';
  const tireStroke = isBlueprint ? '#64748b' : '#1c1917';
  const dimColor = isBlueprint ? '#94a3b8' : '#8c7e6c';

  return (
    <div
      className={`relative flex flex-col items-center justify-center overflow-hidden rounded-xl border-2 transition-colors duration-300 select-none ${
        isBlueprint
          ? 'border-cyan-900/60 bg-[#0a192f] shadow-inner text-cyan-200'
          : 'border-amber-900/40 bg-[#fcf9f0] shadow-sm text-stone-800'
      } ${className}`}
      style={{ minHeight: '140px' }}
    >
      {/* Top Header Bar: Technical Classification & Theme Toggle */}
      <div className="w-full flex items-center justify-between px-3 py-1 border-b border-inherit text-[10px] font-mono opacity-80">
        <div className="flex items-center gap-2">
          <span className="font-bold tracking-wider uppercase">
            {segment === 'economy'
              ? '📐 Type I: Runabout (Эконом)'
              : segment === 'family'
              ? '📐 Type II: Tourer Phaeton (Семейный)'
              : segment === 'luxury'
              ? '📐 Type III: Imperial Brougham (Люкс)'
              : '📐 Type IV: Express Cargo Van (Грузовой)'}
          </span>
          <span>•</span>
          <span>
            {powertrain === 'steam'
              ? '💨 Steam (Пар)'
              : powertrain === 'electric'
              ? '⚡ Electric (АКБ)'
              : '⛽ ICE (ДВС)'}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setTheme((t) => (t === 'blueprint' ? 'patent' : 'blueprint'))}
          className="px-1.5 py-0.5 rounded border border-current text-[9px] hover:bg-black/10 transition cursor-pointer"
          title="Переключить вид: Инженерная синька / Старинный патент"
        >
          {isBlueprint ? '📜 Патент' : '📐 Синька'}
        </button>
      </div>

      {/* Main SVG Vector Schematic */}
      <svg
        viewBox="0 0 360 140"
        className="w-full h-auto max-h-36 p-1"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Subtle radial glow for headlights */}
          <radialGradient id="headlightGlow" cx="0%" cy="50%" r="100%">
            <stop offset="0%" stopColor="#fef08a" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#f59e0b" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
          </radialGradient>
          {/* Metallic gradient for wheels */}
          <linearGradient id="brassHub" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fde68a" />
            <stop offset="50%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#78350f" />
          </linearGradient>
          {/* Glass reflection */}
          <linearGradient id="glassReflection" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#93c5fd" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.4" />
          </linearGradient>
        </defs>

        {/* --- DRAFTING GRID --- */}
        <g stroke={gridLine} strokeWidth="0.5" strokeOpacity={isBlueprint ? 0.35 : 0.45}>
          {/* Horizontal lines */}
          <line x1="10" y1="20" x2="350" y2="20" strokeDasharray="3 3" />
          <line x1="10" y1="40" x2="350" y2="40" strokeDasharray="3 3" />
          <line x1="10" y1="60" x2="350" y2="60" strokeDasharray="3 3" />
          <line x1="10" y1="80" x2="350" y2="80" strokeDasharray="3 3" />
          <line x1="10" y1="100" x2="350" y2="100" strokeDasharray="3 3" />
          {/* Ground datum line */}
          <line x1="10" y1="120" x2="350" y2="120" strokeWidth="1" />
          {/* Vertical lines */}
          <line x1="60" y1="10" x2="60" y2="125" strokeDasharray="3 3" />
          <line x1="120" y1="10" x2="120" y2="125" strokeDasharray="3 3" />
          <line x1="180" y1="10" x2="180" y2="125" strokeDasharray="3 3" />
          <line x1="240" y1="10" x2="240" y2="125" strokeDasharray="3 3" />
          <line x1="300" y1="10" x2="300" y2="125" strokeDasharray="3 3" />
        </g>

        {/* Technical Coordinate Ticks */}
        <g stroke={dimColor} strokeWidth="0.8" strokeLinecap="round">
          <line x1="60" y1="122" x2="60" y2="126" />
          <line x1="180" y1="122" x2="180" y2="126" />
          <line x1="300" y1="122" x2="300" y2="126" />
        </g>

        {/* --- CAR BODYWORK BY SEGMENT --- */}

        {/* 1. ECONOMY: Curved-Dash Runabout Buggy */}
        {segment === 'economy' && (
          <g>
            {/* Elegant curved front apron & dash */}
            <path
              d="M 230 102 L 275 102 Q 300 98 296 68 Q 285 64 270 70 L 250 70 L 230 84 Z"
              fill={fillBody}
              stroke={mainStroke}
              strokeWidth="2"
              strokeLinejoin="round"
            />
            {/* Buggy main wood floor and side rail */}
            <path
              d="M 75 102 L 275 102"
              stroke={mainStroke}
              strokeWidth="3"
              strokeLinecap="round"
            />
            {/* Tufted Carriage Bench Seat */}
            <path
              d="M 140 102 L 145 68 Q 148 50 165 48 L 195 48 Q 205 50 205 68 L 205 102 Z"
              fill={fillBody}
              stroke={mainStroke}
              strokeWidth="2"
            />
            {/* Tufted Button Stitch Lines on Seat */}
            <line x1="155" y1="52" x2="155" y2="98" stroke={mainStroke} strokeWidth="1" strokeDasharray="2 2" />
            <line x1="175" y1="52" x2="175" y2="98" stroke={mainStroke} strokeWidth="1" strokeDasharray="2 2" />
            <line x1="195" y1="52" x2="195" y2="98" stroke={mainStroke} strokeWidth="1" strokeDasharray="2 2" />
            <path d="M 145 74 L 205 74" stroke={mainStroke} strokeWidth="1" strokeDasharray="3 2" />

            {/* Rear Engine / Luggage Compartment Deck */}
            <path
              d="M 80 102 L 80 82 Q 80 76 90 76 L 145 76 L 145 102"
              fill={fillBody}
              stroke={mainStroke}
              strokeWidth="1.8"
            />
            {/* Louver cooling vents on rear bonnet */}
            <line x1="95" y1="84" x2="125" y2="84" stroke={mainStroke} strokeWidth="1.2" />
            <line x1="95" y1="89" x2="125" y2="89" stroke={mainStroke} strokeWidth="1.2" />
            <line x1="95" y1="94" x2="125" y2="94" stroke={mainStroke} strokeWidth="1.2" />

            {/* Steering Tiller / Column with Rosewood Handle */}
            <line x1="225" y1="98" x2="205" y2="60" stroke={mainStroke} strokeWidth="2.5" />
            <line x1="205" y1="60" x2="185" y2="56" stroke="#b45309" strokeWidth="4" strokeLinecap="round" />

            {/* Brass Side Carriage Lantern with Golden Glow */}
            <rect x="286" y="58" width="8" height="15" rx="1.5" fill="#f59e0b" stroke="#78350f" strokeWidth="1.2" />
            <polygon points="294,62 335,46 335,84 294,68" fill="url(#headlightGlow)" opacity="0.45" />

            {/* Exposed Elliptic Leaf Springs */}
            <path d="M 80 115 Q 100 106 120 115" stroke={mainStroke} strokeWidth="2" fill="none" />
            <path d="M 240 115 Q 260 106 280 115" stroke={mainStroke} strokeWidth="2" fill="none" />
          </g>
        )}

        {/* 2. FAMILY: Double Phaeton / Touring Car with Folded Top */}
        {segment === 'family' && (
          <g>
            {/* Long sweeping tourer chassis */}
            <path d="M 60 102 L 300 102" stroke={mainStroke} strokeWidth="3" strokeLinecap="round" />

            {/* Streamlined Hood / Cowl */}
            <path
              d="M 215 102 L 215 72 L 285 72 Q 295 72 300 102 Z"
              fill={fillBody}
              stroke={mainStroke}
              strokeWidth="2"
            />
            {/* Radiator shell & honeycomb */}
            <rect x="294" y="68" width="6" height="34" rx="2" fill="#d97706" stroke={mainStroke} strokeWidth="1.5" />
            <line x1="297" y1="72" x2="297" y2="98" stroke="#78350f" strokeWidth="1" strokeDasharray="1 1" />

            {/* Split Brass Windscreen */}
            <line x1="216" y1="72" x2="210" y2="42" stroke={brassGold} strokeWidth="2.5" />
            <polygon points="216,72 210,42 206,43 212,73" fill="url(#glassReflection)" />
            {/* Brass Windscreen Stay Rod */}
            <line x1="210" y1="42" x2="245" y2="72" stroke={dimColor} strokeWidth="1" />

            {/* Driver Bench Seat */}
            <path
              d="M 160 102 L 165 68 Q 168 52 182 52 L 205 52 L 210 102"
              fill={fillBody}
              stroke={mainStroke}
              strokeWidth="2"
            />
            {/* Rear Passenger Bench Seat */}
            <path
              d="M 105 102 L 110 68 Q 112 50 128 50 L 150 50 L 155 102"
              fill={fillBody}
              stroke={mainStroke}
              strokeWidth="2"
            />

            {/* Folded Accordion Canvas Convertible Top */}
            <path
              d="M 75 102 L 80 75 Q 70 55 95 58 Q 102 62 108 72 Z"
              fill="#78350f"
              stroke={mainStroke}
              strokeWidth="2"
            />
            <path d="M 82 72 Q 95 62 104 68" stroke="#fef3c7" strokeWidth="1.5" fill="none" />

            {/* Steering Column & Slanted Wheel */}
            <line x1="205" y1="95" x2="190" y2="58" stroke={mainStroke} strokeWidth="2.5" />
            <ellipse cx="188" cy="56" rx="8" ry="2.5" transform="rotate(-25 188 56)" stroke={brassGold} strokeWidth="2" fill="none" />

            {/* Running Board with Step Plate */}
            <rect x="130" y="105" width="100" height="4" rx="1" fill={brassGold} stroke={mainStroke} strokeWidth="1" />

            {/* Swept Front and Rear Mudguards / Fenders */}
            <path d="M 60 102 Q 65 75 100 85 Q 125 92 135 105" stroke={mainStroke} strokeWidth="2.5" fill="none" />
            <path d="M 225 105 Q 240 85 270 85 Q 295 85 308 102" stroke={mainStroke} strokeWidth="2.5" fill="none" />

            {/* Acetylene Headlamp with Long Light Beam */}
            <path d="M 302 68 L 314 62 L 314 84 L 302 78 Z" fill="#f59e0b" stroke="#78350f" strokeWidth="1.5" />
            <polygon points="314,64 358,45 358,100 314,82" fill="url(#headlightGlow)" opacity="0.5" />
          </g>
        )}

        {/* 3. LUXURY: Royal Enclosed Brougham / Limousine */}
        {segment === 'luxury' && (
          <g>
            {/* Heavy Cast Steel Chassis Rail */}
            <path d="M 50 102 L 310 102" stroke={mainStroke} strokeWidth="3.5" strokeLinecap="round" />

            {/* Imposing Upright Radiator Grille with Winged Mascot */}
            <rect x="300" y="52" width="9" height="50" rx="3" fill="url(#brassHub)" stroke={mainStroke} strokeWidth="1.8" />
            <line x1="304" y1="56" x2="304" y2="98" stroke="#fef3c7" strokeWidth="1.5" strokeDasharray="1 1" />
            {/* Flying Wing Mascot on Radiator Cap */}
            <path d="M 304 52 Q 298 44 312 45 Q 306 49 304 52" fill="#fbbf24" stroke="#78350f" strokeWidth="1" />

            {/* Enclosed Passenger Salon (High Arched Roof) */}
            <path
              d="M 75 102 L 75 46 Q 80 30 115 30 L 195 30 Q 210 30 215 48 L 215 102 Z"
              fill={fillBody}
              stroke={mainStroke}
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            {/* Curved Moldings & Roofline */}
            <path d="M 75 36 Q 140 26 215 36" stroke={brassGold} strokeWidth="2" fill="none" />

            {/* Bevelled Crystal Glass Windows with Velvet Curtain Drape */}
            <rect x="85" y="40" width="45" height="34" rx="3" fill="url(#glassReflection)" stroke={mainStroke} strokeWidth="1.5" />
            <rect x="142" y="40" width="55" height="34" rx="3" fill="url(#glassReflection)" stroke={mainStroke} strokeWidth="1.5" />
            {/* Window Division Pillar & Door Handle */}
            <line x1="136" y1="36" x2="136" y2="102" stroke={mainStroke} strokeWidth="2" />
            <rect x="134" y="68" width="4" height="8" rx="1" fill={brassGold} stroke="#78350f" strokeWidth="0.8" />

            {/* Open Front Chauffeur Area & High Windshield */}
            <line x1="220" y1="102" x2="220" y2="52" stroke={mainStroke} strokeWidth="2.5" />
            <line x1="220" y1="52" x2="245" y2="52" stroke={mainStroke} strokeWidth="2" />
            {/* Chauffeur Windscreen */}
            <line x1="245" y1="74" x2="240" y2="50" stroke={brassGold} strokeWidth="2" />
            <line x1="230" y1="95" x2="225" y2="65" stroke={mainStroke} strokeWidth="2.5" />
            <ellipse cx="224" cy="63" rx="8" ry="3" transform="rotate(-20 224 63)" stroke={brassGold} strokeWidth="2" fill="none" />

            {/* Long Regal Engine Bonnet */}
            <path d="M 245 74 L 300 74 L 300 102 L 220 102" fill={fillBody} stroke={mainStroke} strokeWidth="2" />
            {/* Bonnet Louvers */}
            <line x1="258" y1="80" x2="288" y2="80" stroke={mainStroke} strokeWidth="1.2" />
            <line x1="258" y1="86" x2="288" y2="86" stroke={mainStroke} strokeWidth="1.2" />
            <line x1="258" y1="92" x2="288" y2="92" stroke={mainStroke} strokeWidth="1.2" />

            {/* Ornate Carriage Lanterns with Gold Finials */}
            <rect x="68" y="50" width="7" height="18" rx="1" fill="#f59e0b" stroke="#78350f" strokeWidth="1.2" />
            <path d="M 71 50 L 71 44 Q 71 40 75 42" stroke={brassGold} strokeWidth="1.5" fill="none" />

            {/* Sweeping Full-Coverage Fenders and Running Board */}
            <path d="M 50 102 Q 55 68 95 76 Q 120 84 130 104" stroke={mainStroke} strokeWidth="2.5" fill="none" />
            <rect x="130" y="104" width="100" height="5" rx="1" fill={brassGold} stroke={mainStroke} strokeWidth="1" />
            <path d="M 230 104 Q 245 75 285 75 Q 310 75 320 102" stroke={mainStroke} strokeWidth="2.5" fill="none" />

            {/* Dual Front Acetylene Projector Headlamps */}
            <path d="M 310 70 L 322 64 L 322 88 L 310 82 Z" fill="#f59e0b" stroke="#78350f" strokeWidth="1.8" />
            <polygon points="322,66 358,45 358,105 322,86" fill="url(#headlightGlow)" opacity="0.6" />
          </g>
        )}

        {/* 4. UTILITY: Commercial Express Panel Delivery Van */}
        {segment === 'utility' && (
          <g>
            {/* Heavy Reinforced Commercial Chassis */}
            <path d="M 55 102 L 305 102" stroke={mainStroke} strokeWidth="4" strokeLinecap="round" />

            {/* Large Arched Wooden Cargo Box */}
            <path
              d="M 68 102 L 68 40 Q 72 26 95 26 L 210 26 Q 220 26 220 38 L 220 102 Z"
              fill={fillBody}
              stroke={mainStroke}
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            {/* Wood Plank Grooves on Cargo Side */}
            <line x1="72" y1="42" x2="216" y2="42" stroke={mainStroke} strokeWidth="1" strokeDasharray="3 2" />
            <line x1="72" y1="56" x2="216" y2="56" stroke={mainStroke} strokeWidth="1" strokeDasharray="3 2" />
            <line x1="72" y1="70" x2="216" y2="70" stroke={mainStroke} strokeWidth="1" strokeDasharray="3 2" />
            <line x1="72" y1="84" x2="216" y2="84" stroke={mainStroke} strokeWidth="1" strokeDasharray="3 2" />

            {/* Heavy Iron Cargo Door Hinges */}
            <rect x="64" y="44" width="8" height="5" rx="1" fill="#1e293b" stroke={mainStroke} strokeWidth="1" />
            <rect x="64" y="86" width="8" height="5" rx="1" fill="#1e293b" stroke={mainStroke} strokeWidth="1" />

            {/* Driver Cab with Forward Sun Visor Awning */}
            <path d="M 218 26 L 255 36 L 250 72 L 220 72" stroke={mainStroke} strokeWidth="2" fill="none" />
            {/* Cab Windscreen */}
            <polygon points="220,40 248,44 246,72 220,72" fill="url(#glassReflection)" stroke={mainStroke} strokeWidth="1.2" />

            {/* Short Flat Commercial Hood */}
            <path d="M 250 72 L 298 72 L 298 102 L 220 102" fill={fillBody} stroke={mainStroke} strokeWidth="2" />
            {/* Heavy Iron Commercial Radiator */}
            <rect x="296" y="66" width="8" height="36" rx="2" fill="#475569" stroke={mainStroke} strokeWidth="1.8" />

            {/* Heavy Flared Fenders for Rugged Work */}
            <path d="M 55 102 Q 62 72 95 78 Q 120 86 128 104" stroke={mainStroke} strokeWidth="3" fill="none" />
            <path d="M 226 104 Q 240 76 275 76 Q 302 76 312 102" stroke={mainStroke} strokeWidth="3" fill="none" />

            {/* Sturdy Utility Lamp */}
            <rect x="300" y="64" width="8" height="14" rx="1.5" fill="#f59e0b" stroke="#78350f" strokeWidth="1.2" />
            <polygon points="308,66 345,52 345,92 308,76" fill="url(#headlightGlow)" opacity="0.4" />
          </g>
        )}

        {/* --- POWERTRAIN SPECIFIC INDICATORS --- */}

        {/* STEAM INDICATORS: Boiler, Valve & Steam Plumes */}
        {powertrain === 'steam' && (
          <g>
            {/* Under-hood Steam Boiler Cylinder */}
            <rect x="245" y="80" width="30" height="18" rx="4" fill="#b45309" stroke="#f59e0b" strokeWidth="1.2" />
            {/* Copper Steam Pipes */}
            <path d="M 255 80 Q 255 65 240 65 L 180 65" stroke="#d97706" strokeWidth="2" fill="none" />
            {/* Gentle Animated/Puffed Steam Exhaust Cloud */}
            <path
              d="M 60 98 Q 50 94 48 88 Q 44 80 54 78 Q 62 76 66 84 Q 72 94 60 98"
              fill={isBlueprint ? '#38bdf8' : '#e2e8f0'}
              fillOpacity="0.65"
              stroke={isBlueprint ? '#7dd3fc' : '#94a3b8'}
              strokeWidth="1"
            />
          </g>
        )}

        {/* ELECTRIC INDICATORS: Lead-Acid Battery Crate & High-Voltage Spark */}
        {powertrain === 'electric' && (
          <g>
            {/* Heavy Underfloor Battery Pack Crates */}
            <rect x="135" y="94" width="65" height="12" rx="2" fill="#1e293b" stroke="#eab308" strokeWidth="1.5" />
            <line x1="145" y1="94" x2="145" y2="106" stroke="#ca8a04" strokeWidth="1" />
            <line x1="165" y1="94" x2="165" y2="106" stroke="#ca8a04" strokeWidth="1" />
            <line x1="185" y1="94" x2="185" y2="106" stroke="#ca8a04" strokeWidth="1" />
            {/* Electric Spark / Lightning Bolt Insignia */}
            <polygon points="170,76 163,86 169,86 165,96 177,84 171,84" fill="#facc15" stroke="#854d0e" strokeWidth="0.8" />
          </g>
        )}

        {/* ICE INDICATORS: Starting Crank & Exhaust */}
        {powertrain === 'ice' && (
          <g>
            {/* Front Hand-Crank Handle */}
            <path d="M 308 100 L 320 100 L 320 110 L 324 110" stroke={brassGold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            {/* Rear Exhaust Tailpipe with Subtle Smoke */}
            <path d="M 68 106 L 50 106" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="44" cy="106" r="3" fill={dimColor} fillOpacity="0.4" />
            <circle cx="36" cy="104" r="4.5" fill={dimColor} fillOpacity="0.25" />
          </g>
        )}

        {/* --- HIGH-DETAIL WHEELS (FRONT & REAR) --- */}

        {/* REAR WHEEL (Centered at X = 100, Y = 115) */}
        <g id="rearWheel">
          {/* Shadow underneath */}
          <ellipse cx="100" cy="122" rx="22" ry="4" fill="black" fillOpacity="0.25" />
          {/* Rubber Tire */}
          <circle cx="100" cy="115" r="22" fill={tireFill} stroke={tireStroke} strokeWidth="3" />
          <circle cx="100" cy="115" r="19" stroke={brassGold} strokeWidth="1.2" fill="none" />
          {/* Heavy Brake Drum */}
          <circle cx="100" cy="115" r="11" fill={isBlueprint ? '#0f172a' : '#57534e'} stroke={dimColor} strokeWidth="1" />
          {/* Spokes (12 High-Density Wooden/Wire Spokes) */}
          <line x1="100" y1="96" x2="100" y2="134" stroke={brassGold} strokeWidth="1" />
          <line x1="81" y1="115" x2="119" y2="115" stroke={brassGold} strokeWidth="1" />
          <line x1="86.5" y1="101.5" x2="113.5" y2="128.5" stroke={brassGold} strokeWidth="1" />
          <line x1="86.5" y1="128.5" x2="113.5" y2="101.5" stroke={brassGold} strokeWidth="1" />
          <line x1="91" y1="98" x2="109" y2="132" stroke={brassGold} strokeWidth="0.8" />
          <line x1="83" y1="106" x2="117" y2="124" stroke={brassGold} strokeWidth="0.8" />
          {/* Polished Brass Hubcap */}
          <circle cx="100" cy="115" r="5" fill="url(#brassHub)" stroke="#78350f" strokeWidth="1" />
          <circle cx="98.5" cy="113.5" r="1.5" fill="#fef3c7" />
        </g>

        {/* FRONT WHEEL (Centered at X = 265, Y = 115) */}
        <g id="frontWheel">
          {/* Shadow underneath */}
          <ellipse cx="265" cy="122" rx="22" ry="4" fill="black" fillOpacity="0.25" />
          {/* Rubber Tire */}
          <circle cx="265" cy="115" r="22" fill={tireFill} stroke={tireStroke} strokeWidth="3" />
          <circle cx="265" cy="115" r="19" stroke={brassGold} strokeWidth="1.2" fill="none" />
          {/* Heavy Brake Drum */}
          <circle cx="265" cy="115" r="11" fill={isBlueprint ? '#0f172a' : '#57534e'} stroke={dimColor} strokeWidth="1" />
          {/* Spokes (12 High-Density Wooden/Wire Spokes) */}
          <line x1="265" y1="96" x2="265" y2="134" stroke={brassGold} strokeWidth="1" />
          <line x1="246" y1="115" x2="284" y2="115" stroke={brassGold} strokeWidth="1" />
          <line x1="251.5" y1="101.5" x2="278.5" y2="128.5" stroke={brassGold} strokeWidth="1" />
          <line x1="251.5" y1="128.5" x2="278.5" y2="101.5" stroke={brassGold} strokeWidth="1" />
          <line x1="256" y1="98" x2="274" y2="132" stroke={brassGold} strokeWidth="0.8" />
          <line x1="248" y1="106" x2="282" y2="124" stroke={brassGold} strokeWidth="0.8" />
          {/* Polished Brass Hubcap */}
          <circle cx="265" cy="115" r="5" fill="url(#brassHub)" stroke="#78350f" strokeWidth="1" />
          <circle cx="263.5" cy="113.5" r="1.5" fill="#fef3c7" />
        </g>

        {/* --- DIMENSIONAL TECHNICAL CALLOUTS --- */}
        <g stroke={dimColor} strokeWidth="0.8" strokeDasharray="2 1">
          {/* Wheelbase dimension line: 100 to 265 = 165px */}
          <line x1="100" y1="130" x2="265" y2="130" />
          <line x1="100" y1="127" x2="100" y2="133" strokeDasharray="none" />
          <line x1="265" y1="127" x2="265" y2="133" strokeDasharray="none" />
          <text
            x="182"
            y="135"
            fill={dimColor}
            fontSize="7"
            fontFamily="monospace"
            textAnchor="middle"
          >
            ← 2,650 mm →
          </text>
        </g>

        {/* Authentic Patent Seal in corner */}
        <g opacity={isBlueprint ? 0.6 : 0.75} transform="translate(14, 24)">
          <circle cx="12" cy="12" r="10" stroke={brassGold} strokeWidth="1" strokeDasharray="2 1" fill="none" />
          <text x="12" y="10" fill={brassGold} fontSize="5" fontFamily="serif" fontStyle="italic" textAnchor="middle">
            PATENT
          </text>
          <text x="12" y="16" fill={brassGold} fontSize="4" fontFamily="monospace" textAnchor="middle">
            No. 741,048
          </text>
        </g>
      </svg>
    </div>
  );
}
