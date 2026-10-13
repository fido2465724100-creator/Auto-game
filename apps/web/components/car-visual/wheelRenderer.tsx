import React from "react";

interface WheelProps {
  cx: number;
  cy: number;
  radius?: number;
  decade: number;
  uid: string;
}

export function CarWheel({ cx, cy, radius = 18, decade, uid }: WheelProps): React.JSX.Element {
  // DECADE 0: 1900-1909 (100% Pure White Natural Rubber + Wooden Carriage Spokes)
  if (decade === 0) {
    return (
      <g>
        {/* Pure White Natural Rubber Tire */}
        <circle cx={cx} cy={cy} r={radius} fill={`url(#tireWhite-${uid})`} stroke="#cbd5e1" strokeWidth="1.2" />
        <circle cx={cx} cy={cy} r={radius - 3.5} fill="none" stroke="#e2e8f0" strokeWidth="0.8" opacity="0.6" />
        {/* Brass Rim Hoop */}
        <circle cx={cx} cy={cy} r={radius - 4} fill="#271b11" stroke={`url(#brass-${uid})`} strokeWidth="1.2" />
        {/* 12 Fine Wooden Carriage Spokes */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 30 * Math.PI) / 180;
          return (
            <line
              key={i}
              x1={cx}
              y1={cy}
              x2={cx + Math.cos(angle) * (radius - 4.5)}
              y2={cy + Math.sin(angle) * (radius - 4.5)}
              stroke="#b45309"
              strokeWidth="1.2"
            />
          );
        })}
        {/* Polished Brass Center Hub Cap */}
        <circle cx={cx} cy={cy} r={5.5} fill={`url(#brass-${uid})`} stroke="#78350f" strokeWidth="1" />
        <circle cx={cx} cy={cy} r={2.5} fill="#451a03" />
      </g>
    );
  }

  // DECADE 1: 1910-1919 (Light Grey/Zinc-Oxide Rubber + Artillery Wooden Wheels)
  if (decade === 1) {
    return (
      <g>
        {/* Greyish Natural Rubber Tire */}
        <circle cx={cx} cy={cy} r={radius} fill={`url(#tireGrey-${uid})`} stroke="#94a3b8" strokeWidth="1.2" />
        {/* Steel Outer Rim */}
        <circle cx={cx} cy={cy} r={radius - 4} fill="#1c1917" stroke={`url(#brass-${uid})`} strokeWidth="1.2" />
        {/* 10 Sturdy Artillery Wooden Spokes */}
        {Array.from({ length: 10 }).map((_, i) => {
          const angle = (i * 36 * Math.PI) / 180;
          return (
            <line
              key={i}
              x1={cx}
              y1={cy}
              x2={cx + Math.cos(angle) * (radius - 4.5)}
              y2={cy + Math.sin(angle) * (radius - 4.5)}
              stroke="#78350f"
              strokeWidth="1.8"
            />
          );
        })}
        {/* Dark Hub with Brass Center Cap & Rim Bolts */}
        <circle cx={cx} cy={cy} r={6} fill="#09090b" stroke={`url(#brass-${uid})`} strokeWidth="1" />
        <circle cx={cx} cy={cy} r={3} fill={`url(#brass-${uid})`} />
      </g>
    );
  }

  // DECADE 2: 1920-1929 (Black Tire with Wide Whitewall + Fine Wire Spokes)
  if (decade === 2) {
    return (
      <g>
        {/* Deep Black Rubber Tread */}
        <circle cx={cx} cy={cy} r={radius} fill={`url(#tireBlack-${uid})`} stroke="#000" strokeWidth="1.5" />
        {/* Wide White Sidewall Ring */}
        <circle cx={cx} cy={cy} r={radius - 3} fill="#ffffff" stroke="#e2e8f0" strokeWidth="0.8" />
        {/* Nickel Rim Bed */}
        <circle cx={cx} cy={cy} r={radius - 6} fill="#0f172a" stroke={`url(#nickel-${uid})`} strokeWidth="1" />
        {/* 16 Criss-Cross Fine Wire Spokes */}
        {Array.from({ length: 16 }).map((_, i) => {
          const angle = (i * 22.5 * Math.PI) / 180;
          return (
            <line
              key={i}
              x1={cx}
              y1={cy}
              x2={cx + Math.cos(angle) * (radius - 6.5)}
              y2={cy + Math.sin(angle) * (radius - 6.5)}
              stroke={`url(#nickel-${uid})`}
              strokeWidth="0.8"
            />
          );
        })}
        {/* Nickel Knock-Off Center Spinner Nut */}
        <circle cx={cx} cy={cy} r={5} fill={`url(#nickel-${uid})`} stroke="#475569" strokeWidth="0.8" />
        <path d={`M ${cx - 4} ${cy} L ${cx + 4} ${cy} M ${cx} ${cy - 4} L ${cx} ${cy + 4}`} stroke="#0f172a" strokeWidth="1.2" />
      </g>
    );
  }

  // DECADE 3: 1930-1939 (Wide Whitewall + Chrome "Dog-Dish" Hubcap on Steel Wheel)
  if (decade === 3) {
    return (
      <g>
        {/* Black Tire */}
        <circle cx={cx} cy={cy} r={radius} fill={`url(#tireBlack-${uid})`} stroke="#000" strokeWidth="1.5" />
        {/* Wide Bright Whitewall Ring */}
        <circle cx={cx} cy={cy} r={radius - 3} fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.8" />
        {/* Inner Steel Wheel Ring */}
        <circle cx={cx} cy={cy} r={radius - 6.5} fill="#1e293b" stroke={`url(#chrome-${uid})`} strokeWidth="1.2" />
        {/* Polished Chrome "Dog-Dish" Hubcap */}
        <circle cx={cx} cy={cy} r={7.5} fill={`url(#chrome-${uid})`} stroke="#334155" strokeWidth="1" />
        <circle cx={cx} cy={cy} r={3} fill="#09090b" opacity="0.4" />
      </g>
    );
  }

  // DECADE 4: 1940-1949 (Wide Whitewall + Full-Face Ribbed Chrome Wheel Cover)
  if (decade === 4) {
    return (
      <g>
        <circle cx={cx} cy={cy} r={radius} fill={`url(#tireBlack-${uid})`} stroke="#000" strokeWidth="1.5" />
        <circle cx={cx} cy={cy} r={radius - 3} fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.8" />
        {/* Full-Face Chrome Cover */}
        <circle cx={cx} cy={cy} r={radius - 6} fill={`url(#chrome-${uid})`} stroke="#334155" strokeWidth="1.2" />
        {/* Concentric Art Deco Stamped Ribs */}
        <circle cx={cx} cy={cy} r={8} fill="none" stroke="#64748b" strokeWidth="0.8" />
        <circle cx={cx} cy={cy} r={5} fill="none" stroke="#334155" strokeWidth="0.8" />
        <circle cx={cx} cy={cy} r={2.5} fill="#b91c1c" stroke={`url(#chrome-${uid})`} strokeWidth="0.6" />
      </g>
    );
  }

  // DECADE 5: 1950-1959 (Golden Jet-Age: Wide Whitewall + Chrome Turbine Crossbar Cap)
  if (decade === 5) {
    return (
      <g>
        <circle cx={cx} cy={cy} r={radius} fill={`url(#tireBlack-${uid})`} stroke="#000" strokeWidth="1.5" />
        <circle cx={cx} cy={cy} r={radius - 3} fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.8" />
        {/* Brilliant Chrome Deep Rim */}
        <circle cx={cx} cy={cy} r={radius - 6} fill={`url(#chrome-${uid})`} stroke="#1e293b" strokeWidth="1.2" />
        {/* Turbine Crossbars */}
        <line x1={cx - 8} y1={cy} x2={cx + 8} y2={cy} stroke="#334155" strokeWidth="1.5" />
        <line x1={cx} y1={cy - 8} x2={cx} y2={cy + 8} stroke="#334155" strokeWidth="1.5" />
        <line x1={cx - 6} y1={cy - 6} x2={cx + 6} y2={cy + 6} stroke="#334155" strokeWidth="1" />
        <line x1={cx - 6} y1={cy + 6} x2={cx + 6} y2={cy - 6} stroke="#334155" strokeWidth="1" />
        {/* Chrome Bullet Cone Center */}
        <circle cx={cx} cy={cy} r={3.8} fill={`url(#chrome-${uid})`} stroke="#000" strokeWidth="0.8" />
      </g>
    );
  }

  // DECADE 6: 1960-1969 (Muscle & Coke-Bottle: Narrow Stripe + 5-Spoke Mag Wheels)
  if (decade === 6) {
    return (
      <g>
        <circle cx={cx} cy={cy} r={radius} fill={`url(#tireBlack-${uid})`} stroke="#000" strokeWidth="1.5" />
        {/* Narrow White/Redline Ring */}
        <circle cx={cx} cy={cy} r={radius - 3.5} fill="none" stroke="#ef4444" strokeWidth="1" />
        {/* Polished Chrome Outer Lip */}
        <circle cx={cx} cy={cy} r={radius - 5.5} fill="#0f172a" stroke={`url(#chrome-${uid})`} strokeWidth="1.4" />
        {/* 5 Classic Torq-Thrust Mag Spokes */}
        {Array.from({ length: 5 }).map((_, i) => {
          const angle = (i * 72 * Math.PI) / 180;
          return (
            <line
              key={i}
              x1={cx}
              y1={cy}
              x2={cx + Math.cos(angle) * (radius - 6.5)}
              y2={cy + Math.sin(angle) * (radius - 6.5)}
              stroke={`url(#chrome-${uid})`}
              strokeWidth="2.8"
            />
          );
        })}
        {/* Center Bullet Cap */}
        <circle cx={cx} cy={cy} r={3.5} fill={`url(#chrome-${uid})`} stroke="#1e293b" strokeWidth="0.8" />
      </g>
    );
  }

  // DECADE 7: 1970-1979 (Solid Black Radial Tire + Slotted Rallye Mag Dish)
  if (decade === 7) {
    return (
      <g>
        {/* Solid Black Deep Radial Tire */}
        <circle cx={cx} cy={cy} r={radius} fill={`url(#tireBlack-${uid})`} stroke="#000" strokeWidth="1.8" />
        {/* Outer Silver Rim */}
        <circle cx={cx} cy={cy} r={radius - 5} fill={`url(#alloyRim-${uid})`} stroke="#1e293b" strokeWidth="1.2" />
        {/* 8 Oval Slots in Dish */}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i * 45 * Math.PI) / 180;
          const sx = cx + Math.cos(angle) * 7.5;
          const sy = cy + Math.sin(angle) * 7.5;
          return <circle key={i} cx={sx} cy={sy} r={1.5} fill="#09090b" />;
        })}
        {/* Derby Chrome Center Cap */}
        <circle cx={cx} cy={cy} r={4.5} fill={`url(#chrome-${uid})`} stroke="#334155" strokeWidth="0.8" />
      </g>
    );
  }

  // DECADE 8: 1980-1989 (Low-Profile Radial + Directional Aero Turbine Fin Alloy)
  if (decade === 8) {
    return (
      <g>
        <circle cx={cx} cy={cy} r={radius} fill={`url(#tireBlack-${uid})`} stroke="#000" strokeWidth="1.6" />
        {/* Alloy Wheel Rim */}
        <circle cx={cx} cy={cy} r={radius - 4.5} fill="#0f172a" stroke={`url(#alloyRim-${uid})`} strokeWidth="1.2" />
        {/* 12 Angled Turbine Cooling Fins */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 30 * Math.PI) / 180;
          const x1 = cx + Math.cos(angle) * 4;
          const y1 = cy + Math.sin(angle) * 4;
          const x2 = cx + Math.cos(angle + 0.3) * (radius - 5);
          const y2 = cy + Math.sin(angle + 0.3) * (radius - 5);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={`url(#alloyRim-${uid})`} strokeWidth="1.5" />;
        })}
        {/* Center Hex Nut Cap */}
        <circle cx={cx} cy={cy} r={3.8} fill="#09090b" stroke={`url(#alloyRim-${uid})`} strokeWidth="1" />
      </g>
    );
  }

  // DECADE 9: 1990-1999 (Black Radial + Sleek Silver 5-Spoke Star Cast Alloy)
  if (decade === 9) {
    return (
      <g>
        <circle cx={cx} cy={cy} r={radius} fill={`url(#tireBlack-${uid})`} stroke="#000" strokeWidth="1.6" />
        <circle cx={cx} cy={cy} r={radius - 4.5} fill="#09090b" stroke={`url(#alloyRim-${uid})`} strokeWidth="1.2" />
        {/* 5 Sleek Curved Star Spokes */}
        {Array.from({ length: 5 }).map((_, i) => {
          const angle = (i * 72 * Math.PI) / 180;
          return (
            <line
              key={i}
              x1={cx}
              y1={cy}
              x2={cx + Math.cos(angle) * (radius - 5)}
              y2={cy + Math.sin(angle) * (radius - 5)}
              stroke={`url(#alloyRim-${uid})`}
              strokeWidth="3.2"
            />
          );
        })}
        <circle cx={cx} cy={cy} r={4.5} fill={`url(#alloyRim-${uid})`} stroke="#475569" strokeWidth="0.8" />
        <circle cx={cx} cy={cy} r={2} fill="#0f172a" />
      </g>
    );
  }

  // DECADE 10: 2000-2009 (17-inch Split 5-Spoke with Visible Brake Disc Rotor & Caliper)
  if (decade === 10) {
    return (
      <g>
        <circle cx={cx} cy={cy} r={radius} fill={`url(#tireModern-${uid})`} stroke="#000" strokeWidth="1.5" />
        {/* Large Diameter Rim Face */}
        <circle cx={cx} cy={cy} r={radius - 3.8} fill={`url(#brakeDisc-${uid})`} stroke={`url(#alloyRim-${uid})`} strokeWidth="1.2" />
        {/* Disc Brake Caliper */}
        <rect x={cx + 6} y={cy - 7} width={3.5} height={8} rx={1} fill="#e2e8f0" stroke="#475569" strokeWidth="0.8" />
        {/* Split 5-Spoke (10 Spokes) */}
        {Array.from({ length: 5 }).map((_, i) => {
          const a1 = ((i * 72 - 6) * Math.PI) / 180;
          const a2 = ((i * 72 + 6) * Math.PI) / 180;
          return (
            <React.Fragment key={i}>
              <line x1={cx} y1={cy} x2={cx + Math.cos(a1) * (radius - 4.2)} y2={cy + Math.sin(a1) * (radius - 4.2)} stroke={`url(#alloyRim-${uid})`} strokeWidth="1.5" />
              <line x1={cx} y1={cy} x2={cx + Math.cos(a2) * (radius - 4.2)} y2={cy + Math.sin(a2) * (radius - 4.2)} stroke={`url(#alloyRim-${uid})`} strokeWidth="1.5" />
            </React.Fragment>
          );
        })}
        <circle cx={cx} cy={cy} r={4} fill={`url(#alloyRim-${uid})`} stroke="#334155" strokeWidth="0.8" />
      </g>
    );
  }

  // DECADE 11: 2010-2019 (Ultra-Low Profile + Diamond-Cut Bi-Color Alloy Wheels)
  if (decade === 11) {
    return (
      <g>
        {/* Very Thin Low-Profile Tire */}
        <circle cx={cx} cy={cy} r={radius} fill={`url(#tireModern-${uid})`} stroke="#000" strokeWidth="1.4" />
        {/* Huge 19-inch Rim with Gloss Black Pockets */}
        <circle cx={cx} cy={cy} r={radius - 3} fill={`url(#rimPocket-${uid})`} stroke={`url(#alloyRim-${uid})`} strokeWidth="1" />
        {/* Red Sport Brake Caliper */}
        <rect x={cx + 7} y={cy - 8} width={3} height={9} rx={1} fill="#ef4444" stroke="#991b1b" strokeWidth="0.6" />
        {/* Machined Diamond-Cut Silver Faces */}
        {Array.from({ length: 5 }).map((_, i) => {
          const a = (i * 72 * Math.PI) / 180;
          const aNext = ((i * 72 + 25) * Math.PI) / 180;
          return (
            <polygon
              key={i}
              points={`${cx},${cy} ${cx + Math.cos(a) * (radius - 3.5)},${cy + Math.sin(a) * (radius - 3.5)} ${cx + Math.cos(aNext) * (radius - 3.5)},${cy + Math.sin(aNext) * (radius - 3.5)}`}
              fill={`url(#alloyRim-${uid})`}
              stroke="#0f172a"
              strokeWidth="0.6"
            />
          );
        })}
        <circle cx={cx} cy={cy} r={3.8} fill="#09090b" stroke={`url(#alloyRim-${uid})`} strokeWidth="0.8" />
      </g>
    );
  }

  // DECADE 12: 2020-2026+ (EV Aero-Disc Turbine Cover with Brushed Aero Blades)
  return (
    <g>
      <circle cx={cx} cy={cy} r={radius} fill={`url(#tireModern-${uid})`} stroke="#000" strokeWidth="1.4" />
      {/* Flush Aero Disc Cover (Gloss Piano Black) */}
      <circle cx={cx} cy={cy} r={radius - 2.8} fill="#020617" stroke={`url(#alloyRim-${uid})`} strokeWidth="1" />
      {/* 5 Swept Directional Aero Turbine Blades */}
      {Array.from({ length: 5 }).map((_, i) => {
        const a1 = (i * 72 * Math.PI) / 180;
        const a2 = ((i * 72 + 40) * Math.PI) / 180;
        const x1 = cx + Math.cos(a1) * 5;
        const y1 = cy + Math.sin(a1) * 5;
        const x2 = cx + Math.cos(a2) * (radius - 3.5);
        const y2 = cy + Math.sin(a2) * (radius - 3.5);
        return (
          <path
            key={i}
            d={`M ${x1} ${y1} Q ${cx + Math.cos(a1 + 0.3) * 11} ${cy + Math.sin(a1 + 0.3) * 11} ${x2} ${y2}`}
            stroke={`url(#alloyRim-${uid})`}
            strokeWidth="3.2"
            fill="none"
          />
        );
      })}
      {/* Central Illuminated Aero Node */}
      <circle cx={cx} cy={cy} r={4.5} fill="#0f172a" stroke="#38bdf8" strokeWidth="1" />
      <circle cx={cx} cy={cy} r={2} fill="#38bdf8" />
    </g>
  );
}
