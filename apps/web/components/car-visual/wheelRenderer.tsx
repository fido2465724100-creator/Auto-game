import React from "react";

interface PerspectiveWheelProps {
  cx: number;
  cy: number;
  rx?: number;
  ry?: number;
  decade: number;
  uid: string;
  isFront?: boolean;
}

export function PerspectiveCarWheel({
  cx,
  cy,
  rx = 16,
  ry = 21,
  decade,
  uid,
}: PerspectiveWheelProps): React.JSX.Element {
  // DECADE 0: 1900-1909 (100% Pure White Natural Rubber + Wooden Carriage Spokes)
  if (decade === 0) {
    return (
      <g>
        {/* Tread Depth */}
        <ellipse cx={cx - 3} cy={cy} rx={rx} ry={ry} fill="#cbd5e1" />
        {/* Pure White Natural Rubber Sidewall */}
        <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={`url(#tireWhite-${uid})`} stroke="#cbd5e1" strokeWidth="1.2" />
        <ellipse cx={cx} cy={cy} rx={rx - 3} ry={ry - 3.5} fill="none" stroke="#e2e8f0" strokeWidth="0.8" opacity="0.7" />
        {/* Brass Rim Hoop */}
        <ellipse cx={cx} cy={cy} rx={rx - 4} ry={ry - 4.5} fill="#271b11" stroke={`url(#brass-${uid})`} strokeWidth="1.2" />
        {/* 12 Wooden Carriage Spokes */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 30 * Math.PI) / 180;
          return (
            <line
              key={i}
              x1={cx}
              y1={cy}
              x2={cx + Math.cos(angle) * (rx - 4.5)}
              y2={cy + Math.sin(angle) * (ry - 5)}
              stroke="#b45309"
              strokeWidth="1.4"
            />
          );
        })}
        {/* Polished Brass Hub */}
        <ellipse cx={cx} cy={cy} rx={5} ry={6} fill={`url(#brass-${uid})`} stroke="#78350f" strokeWidth="1" />
        <ellipse cx={cx} cy={cy} rx={2} ry={2.5} fill="#451a03" />
      </g>
    );
  }

  // DECADE 1: 1910-1919 (Light Grey/Zinc-Oxide Rubber + Artillery Wooden Wheels)
  if (decade === 1) {
    return (
      <g>
        <ellipse cx={cx - 3} cy={cy} rx={rx} ry={ry} fill="#94a3b8" />
        <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={`url(#tireGrey-${uid})`} stroke="#94a3b8" strokeWidth="1.2" />
        <ellipse cx={cx} cy={cy} rx={rx - 4} ry={ry - 4.5} fill="#1c1917" stroke={`url(#brass-${uid})`} strokeWidth="1.2" />
        {/* 10 Artillery Wooden Spokes */}
        {Array.from({ length: 10 }).map((_, i) => {
          const angle = (i * 36 * Math.PI) / 180;
          return (
            <line
              key={i}
              x1={cx}
              y1={cy}
              x2={cx + Math.cos(angle) * (rx - 4.5)}
              y2={cy + Math.sin(angle) * (ry - 5)}
              stroke="#78350f"
              strokeWidth="2"
            />
          );
        })}
        <ellipse cx={cx} cy={cy} rx={5.5} ry={6.5} fill="#09090b" stroke={`url(#brass-${uid})`} strokeWidth="1" />
        <ellipse cx={cx} cy={cy} rx={2.5} ry={3} fill={`url(#brass-${uid})`} />
      </g>
    );
  }

  // DECADE 2: 1920-1929 (Black Tire with Wide Whitewall + Fine Wire Spokes)
  if (decade === 2) {
    return (
      <g>
        <ellipse cx={cx - 3} cy={cy} rx={rx} ry={ry} fill="#000000" />
        <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={`url(#tireBlack-${uid})`} stroke="#000" strokeWidth="1.5" />
        {/* Wide White Sidewall Ring */}
        <ellipse cx={cx} cy={cy} rx={rx - 3} ry={ry - 3.5} fill="#ffffff" stroke="#e2e8f0" strokeWidth="0.8" />
        {/* Wire Wheel Rim Bed */}
        <ellipse cx={cx} cy={cy} rx={rx - 6} ry={ry - 7} fill="#0f172a" stroke={`url(#nickel-${uid})`} strokeWidth="1" />
        {/* 16 Wire Spokes */}
        {Array.from({ length: 16 }).map((_, i) => {
          const angle = (i * 22.5 * Math.PI) / 180;
          return (
            <line
              key={i}
              x1={cx}
              y1={cy}
              x2={cx + Math.cos(angle) * (rx - 6.5)}
              y2={cy + Math.sin(angle) * (ry - 7.5)}
              stroke={`url(#nickel-${uid})`}
              strokeWidth="0.9"
            />
          );
        })}
        {/* Nickel Spinner Nut */}
        <ellipse cx={cx} cy={cy} rx={4.5} ry={5.5} fill={`url(#nickel-${uid})`} stroke="#475569" strokeWidth="0.8" />
        <path d={`M ${cx - 3.5} ${cy} L ${cx + 3.5} ${cy} M ${cx} ${cy - 4} L ${cx} ${cy + 4}`} stroke="#0f172a" strokeWidth="1.2" />
      </g>
    );
  }

  // DECADE 3: 1930-1939 (Wide Whitewall + Chrome "Dog-Dish" Hubcap on Steel Wheel)
  if (decade === 3) {
    return (
      <g>
        <ellipse cx={cx - 3} cy={cy} rx={rx} ry={ry} fill="#000000" />
        <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={`url(#tireBlack-${uid})`} stroke="#000" strokeWidth="1.5" />
        <ellipse cx={cx} cy={cy} rx={rx - 3} ry={ry - 3.5} fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.8" />
        <ellipse cx={cx} cy={cy} rx={rx - 6.5} ry={ry - 7.5} fill="#1e293b" stroke={`url(#chrome-${uid})`} strokeWidth="1.2" />
        <ellipse cx={cx} cy={cy} rx={7} ry={8.5} fill={`url(#chrome-${uid})`} stroke="#334155" strokeWidth="1" />
        <ellipse cx={cx} cy={cy} rx={2.5} ry={3} fill="#09090b" opacity="0.4" />
      </g>
    );
  }

  // DECADE 4: 1940-1949 (Wide Whitewall + Full-Face Ribbed Chrome Wheel Cover)
  if (decade === 4) {
    return (
      <g>
        <ellipse cx={cx - 3} cy={cy} rx={rx} ry={ry} fill="#000000" />
        <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={`url(#tireBlack-${uid})`} stroke="#000" strokeWidth="1.5" />
        <ellipse cx={cx} cy={cy} rx={rx - 3} ry={ry - 3.5} fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.8" />
        <ellipse cx={cx} cy={cy} rx={rx - 6} ry={ry - 7} fill={`url(#chrome-${uid})`} stroke="#334155" strokeWidth="1.2" />
        <ellipse cx={cx} cy={cy} rx={7.5} ry={9} fill="none" stroke="#64748b" strokeWidth="0.8" />
        <ellipse cx={cx} cy={cy} rx={4.5} ry={5.5} fill="none" stroke="#334155" strokeWidth="0.8" />
        <ellipse cx={cx} cy={cy} rx={2.2} ry={2.8} fill="#b91c1c" stroke={`url(#chrome-${uid})`} strokeWidth="0.6" />
      </g>
    );
  }

  // DECADE 5: 1950-1959 (Golden Jet-Age: Wide Whitewall + Chrome Turbine Crossbar Cap)
  if (decade === 5) {
    return (
      <g>
        <ellipse cx={cx - 3} cy={cy} rx={rx} ry={ry} fill="#000000" />
        <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={`url(#tireBlack-${uid})`} stroke="#000" strokeWidth="1.5" />
        <ellipse cx={cx} cy={cy} rx={rx - 3} ry={ry - 3.5} fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.8" />
        <ellipse cx={cx} cy={cy} rx={rx - 6} ry={ry - 7} fill={`url(#chrome-${uid})`} stroke="#1e293b" strokeWidth="1.2" />
        <line x1={cx - 7} y1={cy} x2={cx + 7} y2={cy} stroke="#334155" strokeWidth="1.5" />
        <line x1={cx} y1={cy - 8} x2={cx} y2={cy + 8} stroke="#334155" strokeWidth="1.5" />
        <ellipse cx={cx} cy={cy} rx={3.5} ry={4.2} fill={`url(#chrome-${uid})`} stroke="#000" strokeWidth="0.8" />
      </g>
    );
  }

  // DECADE 6: 1960-1969 (Muscle & Coke-Bottle: Narrow Redline + 5-Spoke Mag Wheels)
  if (decade === 6) {
    return (
      <g>
        <ellipse cx={cx - 3} cy={cy} rx={rx} ry={ry} fill="#000000" />
        <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={`url(#tireBlack-${uid})`} stroke="#000" strokeWidth="1.5" />
        <ellipse cx={cx} cy={cy} rx={rx - 3.5} ry={ry - 4} fill="none" stroke="#ef4444" strokeWidth="1" />
        <ellipse cx={cx} cy={cy} rx={rx - 5.5} ry={ry - 6.5} fill="#0f172a" stroke={`url(#chrome-${uid})`} strokeWidth="1.4" />
        {/* 5 Classic Torq-Thrust Mag Spokes */}
        {Array.from({ length: 5 }).map((_, i) => {
          const angle = (i * 72 * Math.PI) / 180;
          return (
            <line
              key={i}
              x1={cx}
              y1={cy}
              x2={cx + Math.cos(angle) * (rx - 6.5)}
              y2={cy + Math.sin(angle) * (ry - 7.5)}
              stroke={`url(#chrome-${uid})`}
              strokeWidth="2.8"
            />
          );
        })}
        <ellipse cx={cx} cy={cy} rx={3.2} ry={3.8} fill={`url(#chrome-${uid})`} stroke="#1e293b" strokeWidth="0.8" />
      </g>
    );
  }

  // DECADE 7: 1970-1979 (Solid Black Radial Tire + Slotted Rallye Mag Dish)
  if (decade === 7) {
    return (
      <g>
        <ellipse cx={cx - 3} cy={cy} rx={rx} ry={ry} fill="#000000" />
        <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={`url(#tireBlack-${uid})`} stroke="#000" strokeWidth="1.8" />
        <ellipse cx={cx} cy={cy} rx={rx - 5} ry={ry - 6} fill={`url(#alloyRim-${uid})`} stroke="#1e293b" strokeWidth="1.2" />
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i * 45 * Math.PI) / 180;
          const sx = cx + Math.cos(angle) * 7;
          const sy = cy + Math.sin(angle) * 8;
          return <ellipse key={i} cx={sx} cy={sy} rx={1.4} ry={1.6} fill="#09090b" />;
        })}
        <ellipse cx={cx} cy={cy} rx={4} ry={4.8} fill={`url(#chrome-${uid})`} stroke="#334155" strokeWidth="0.8" />
      </g>
    );
  }

  // DECADE 8: 1980-1989 (Low-Profile Radial + Directional Aero Turbine Fin Alloy)
  if (decade === 8) {
    return (
      <g>
        <ellipse cx={cx - 3} cy={cy} rx={rx} ry={ry} fill="#000000" />
        <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={`url(#tireBlack-${uid})`} stroke="#000" strokeWidth="1.6" />
        <ellipse cx={cx} cy={cy} rx={rx - 4.5} ry={ry - 5.5} fill="#0f172a" stroke={`url(#alloyRim-${uid})`} strokeWidth="1.2" />
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 30 * Math.PI) / 180;
          const x1 = cx + Math.cos(angle) * 3.5;
          const y1 = cy + Math.sin(angle) * 4;
          const x2 = cx + Math.cos(angle + 0.3) * (rx - 5);
          const y2 = cy + Math.sin(angle + 0.3) * (ry - 6);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={`url(#alloyRim-${uid})`} strokeWidth="1.5" />;
        })}
        <ellipse cx={cx} cy={cy} rx={3.5} ry={4.2} fill="#09090b" stroke={`url(#alloyRim-${uid})`} strokeWidth="1" />
      </g>
    );
  }

  // DECADE 9: 1990-1999 (Black Radial + Sleek Silver 5-Spoke Star Cast Alloy)
  if (decade === 9) {
    return (
      <g>
        <ellipse cx={cx - 3} cy={cy} rx={rx} ry={ry} fill="#000000" />
        <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={`url(#tireBlack-${uid})`} stroke="#000" strokeWidth="1.6" />
        <ellipse cx={cx} cy={cy} rx={rx - 4.5} ry={ry - 5.5} fill="#09090b" stroke={`url(#alloyRim-${uid})`} strokeWidth="1.2" />
        {Array.from({ length: 5 }).map((_, i) => {
          const angle = (i * 72 * Math.PI) / 180;
          return (
            <line
              key={i}
              x1={cx}
              y1={cy}
              x2={cx + Math.cos(angle) * (rx - 5)}
              y2={cy + Math.sin(angle) * (ry - 6)}
              stroke={`url(#alloyRim-${uid})`}
              strokeWidth="3.2"
            />
          );
        })}
        <ellipse cx={cx} cy={cy} rx={4} ry={4.8} fill={`url(#alloyRim-${uid})`} stroke="#475569" strokeWidth="0.8" />
      </g>
    );
  }

  // DECADE 10: 2000-2009 (17-inch Split 5-Spoke with Visible Brake Disc Rotor & Caliper)
  if (decade === 10) {
    return (
      <g>
        <ellipse cx={cx - 3} cy={cy} rx={rx} ry={ry} fill="#000000" />
        <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={`url(#tireModern-${uid})`} stroke="#000" strokeWidth="1.5" />
        <ellipse cx={cx} cy={cy} rx={rx - 3.5} ry={ry - 4.5} fill={`url(#brakeDisc-${uid})`} stroke={`url(#alloyRim-${uid})`} strokeWidth="1.2" />
        <rect x={cx + 5} y={cy - 6} width={3} height={7} rx={1} fill="#e2e8f0" stroke="#475569" strokeWidth="0.8" />
        {Array.from({ length: 5 }).map((_, i) => {
          const a1 = ((i * 72 - 6) * Math.PI) / 180;
          const a2 = ((i * 72 + 6) * Math.PI) / 180;
          return (
            <React.Fragment key={i}>
              <line x1={cx} y1={cy} x2={cx + Math.cos(a1) * (rx - 4)} y2={cy + Math.sin(a1) * (ry - 5)} stroke={`url(#alloyRim-${uid})`} strokeWidth="1.5" />
              <line x1={cx} y1={cy} x2={cx + Math.cos(a2) * (rx - 4)} y2={cy + Math.sin(a2) * (ry - 5)} stroke={`url(#alloyRim-${uid})`} strokeWidth="1.5" />
            </React.Fragment>
          );
        })}
        <ellipse cx={cx} cy={cy} rx={3.5} ry={4.2} fill={`url(#alloyRim-${uid})`} stroke="#334155" strokeWidth="0.8" />
      </g>
    );
  }

  // DECADE 11: 2010-2019 (Ultra-Low Profile + Diamond-Cut Bi-Color Alloy Wheels)
  if (decade === 11) {
    return (
      <g>
        <ellipse cx={cx - 2.5} cy={cy} rx={rx} ry={ry} fill="#000000" />
        <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={`url(#tireModern-${uid})`} stroke="#000" strokeWidth="1.4" />
        <ellipse cx={cx} cy={cy} rx={rx - 2.8} ry={ry - 3.8} fill={`url(#rimPocket-${uid})`} stroke={`url(#alloyRim-${uid})`} strokeWidth="1" />
        <rect x={cx + 6} y={cy - 7} width={2.5} height={8} rx={1} fill="#ef4444" stroke="#991b1b" strokeWidth="0.6" />
        {Array.from({ length: 5 }).map((_, i) => {
          const a = (i * 72 * Math.PI) / 180;
          const aNext = ((i * 72 + 25) * Math.PI) / 180;
          return (
            <polygon
              key={i}
              points={`${cx},${cy} ${cx + Math.cos(a) * (rx - 3.2)},${cy + Math.sin(a) * (ry - 4.2)} ${cx + Math.cos(aNext) * (rx - 3.2)},${cy + Math.sin(aNext) * (ry - 4.2)}`}
              fill={`url(#alloyRim-${uid})`}
              stroke="#0f172a"
              strokeWidth="0.6"
            />
          );
        })}
        <ellipse cx={cx} cy={cy} rx={3.2} ry={3.8} fill="#09090b" stroke={`url(#alloyRim-${uid})`} strokeWidth="0.8" />
      </g>
    );
  }

  // DECADE 12: 2020-2026+ (EV Aero-Disc Turbine Cover with Brushed Aero Blades)
  return (
    <g>
      <ellipse cx={cx - 2.5} cy={cy} rx={rx} ry={ry} fill="#000000" />
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={`url(#tireModern-${uid})`} stroke="#000" strokeWidth="1.4" />
      <ellipse cx={cx} cy={cy} rx={rx - 2.5} ry={ry - 3.5} fill="#020617" stroke={`url(#alloyRim-${uid})`} strokeWidth="1" />
      {Array.from({ length: 5 }).map((_, i) => {
        const a1 = (i * 72 * Math.PI) / 180;
        const a2 = ((i * 72 + 40) * Math.PI) / 180;
        const x1 = cx + Math.cos(a1) * 4.5;
        const y1 = cy + Math.sin(a1) * 5;
        const x2 = cx + Math.cos(a2) * (rx - 3.2);
        const y2 = cy + Math.sin(a2) * (ry - 4.2);
        return (
          <path
            key={i}
            d={`M ${x1} ${y1} Q ${cx + Math.cos(a1 + 0.3) * 9} ${cy + Math.sin(a1 + 0.3) * 11} ${x2} ${y2}`}
            stroke={`url(#alloyRim-${uid})`}
            strokeWidth="3"
            fill="none"
          />
        );
      })}
      <ellipse cx={cx} cy={cy} rx={3.8} ry={4.5} fill="#0f172a" stroke="#38bdf8" strokeWidth="1" />
      <ellipse cx={cx} cy={cy} rx={1.8} ry={2.2} fill="#38bdf8" />
    </g>
  );
}
