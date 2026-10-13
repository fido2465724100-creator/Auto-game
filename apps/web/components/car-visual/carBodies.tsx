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
  const hoodSheen = `url(#hoodSheen-${uid})`;
  const twoTone = `url(#twoToneRoof-${uid})`;

  // =========================================================================
  // DECADE 0: 1900-1909 (HORSELESS CARRIAGE & BRASS ERA)
  // White natural rubber tires, wooden carriage framing, brass lanterns
  // =========================================================================
  if (decade === 0) {
    if (segment === "utility") {
      // Depot Delivery Hack / Express Wagon (open cab, wood cargo slats, canvas curtain, brass lantern)
      return (
        <g id="body-d0-utility">
          {/* Wooden slatted cargo bed box */}
          <polygon points="72,148 72,92 188,88 188,154 144,158 124,136 104,155" fill="#5c3a21" stroke="#29180c" strokeWidth="2" />
          <line x1="72" y1="108" x2="188" y2="104" stroke="#854d0e" strokeWidth="2" />
          <line x1="72" y1="124" x2="188" y2="120" stroke="#854d0e" strokeWidth="2" />
          <line x1="72" y1="138" x2="188" y2="134" stroke="#854d0e" strokeWidth="2" />
          {/* Rolled canvas side drop curtains */}
          <rect x="76" y="92" width="104" height="10" rx="3" fill="#fef3c7" stroke="#b45309" strokeWidth="1" />
          {/* Cab front partition & footboard */}
          <polygon points="188,88 232,84 252,126 270,140 270,160 188,154" fill={bodyFill} stroke="#1c1917" strokeWidth="1.8" />
          {/* Driver bench seat */}
          <polygon points="196,122 232,118 238,136 196,138" fill="#3f2e22" stroke="#1c1917" strokeWidth="1.5" />
          {/* Brass cowl lantern */}
          <rect x="238" y="112" width="12" height="18" rx="2" fill={brassStroke} stroke="#78350f" strokeWidth="1.2" />
          <circle cx="244" cy="120" r="4.5" fill="#fef08a" />
          {/* Engine box front cowl with brass louvers */}
          <polygon points="252,126 295,124 322,142 270,140" fill={bodyFill} stroke="#1c1917" strokeWidth="1.5" />
          {/* Brass radiator nose plane */}
          <polygon points="295,124 322,142 322,162 295,148" fill={brassStroke} stroke="#78350f" strokeWidth="1.8" />
          {/* Far brass lantern */}
          <rect x="290" y="116" width="9" height="14" rx="2" fill={brassStroke} stroke="#78350f" strokeWidth="1" />
          <circle cx="294" cy="122" r="3.5" fill="#fef08a" />
          {/* Front heavy timber bumper */}
          <line x1="285" y1="152" x2="330" y2="166" stroke="#451a03" strokeWidth="4.5" />
        </g>
      );
    }
    if (segment === "luxury") {
      // Grand Imperial Tonneau (Coach-built rear tonneau with beveled glass, high roof, twin brass lanterns)
      return (
        <g id="body-d0-luxury">
          {/* Coach-built high passenger compartment */}
          <path d="M 74,148 L 74,78 Q 80,60 115,58 L 198,56 Q 212,56 216,74 L 216,154 Q 180,156 144,158 Q 124,134 104,155 Z" fill={bodyFill} stroke={brassStroke} strokeWidth="2" />
          {/* Beveled glass passenger windows with brass framing */}
          <polygon points="90,74 135,72 135,110 90,112" fill={glassFill} stroke={brassStroke} strokeWidth="1.5" />
          <polygon points="145,72 195,70 195,110 145,110" fill={glassFill} stroke={brassStroke} strokeWidth="1.5" />
          {/* Front open chauffeur station */}
          <polygon points="216,74 245,92 250,132 280,140 280,160 216,154" fill={bodyFill} stroke="#1c1917" strokeWidth="1.8" />
          {/* Tufted leather chauffeur seat */}
          <polygon points="220,110 248,110 250,132 220,132" fill="#3f2e22" stroke="#1c1917" strokeWidth="1.5" />
          {/* Long high hood with brass hinge crease */}
          <polygon points="250,132 296,126 328,142 280,140" fill={bodyFill} stroke="#1c1917" strokeWidth="1.8" />
          <line x1="250" y1="132" x2="328" y2="142" stroke={brassStroke} strokeWidth="2" />
          {/* Monumental square brass radiator front face */}
          <polygon points="296,126 328,142 328,164 296,148" fill={brassStroke} stroke="#78350f" strokeWidth="2.5" />
          <polygon points="300,132 324,144 324,160 300,148" fill="#1c1917" stroke="#78350f" strokeWidth="1" />
          {/* Giant brass acetylene headlamps with mounting fork */}
          <circle cx="334" cy="144" r="9" fill={brassStroke} stroke="#78350f" strokeWidth="1.5" />
          <circle cx="334" cy="144" r="6" fill="#fef08a" />
          <circle cx="292" cy="130" r="7.5" fill={brassStroke} stroke="#78350f" strokeWidth="1.5" />
          <circle cx="292" cy="130" r="5" fill="#fef08a" />
          {/* Arched carriage fenders */}
          <path d="M 68,148 Q 95,115 146,148" stroke="#1c1917" strokeWidth="4" fill="none" />
          <path d="M 270,158 Q 298,124 336,155" stroke="#1c1917" strokeWidth="4" fill="none" />
        </g>
      );
    }
    if (segment === "family") {
      // Surrey with Fringe on Top (dual rows of tufted seats, canopy on 4 brass stanchions, brass grab rails)
      return (
        <g id="body-d0-family">
          {/* Carriage lower tub */}
          <path d="M 78,148 Q 84,116 118,116 L 235,116 Q 248,116 256,132 L 295,134 L 324,148 L 278,162 Q 220,160 144,158 Q 124,136 104,155 Z" fill={bodyFill} stroke={brassStroke} strokeWidth="1.8" />
          {/* Canopy roof on brass stanchions */}
          <polygon points="85,62 230,56 242,70 95,74" fill="#fef3c7" stroke="#b45309" strokeWidth="1.5" />
          {/* Fringe scallops hanging below canopy */}
          <line x1="85" y1="74" x2="242" y2="70" stroke="#d97706" strokeWidth="3" strokeDasharray="3,2" />
          {/* 4 Brass vertical canopy poles */}
          <line x1="98" y1="74" x2="98" y2="120" stroke={brassStroke} strokeWidth="2.5" />
          <line x1="150" y1="72" x2="150" y2="118" stroke={brassStroke} strokeWidth="2.5" />
          <line x1="190" y1="71" x2="190" y2="118" stroke={brassStroke} strokeWidth="2.5" />
          <line x1="230" y1="69" x2="230" y2="120" stroke={brassStroke} strokeWidth="2.5" />
          {/* Dual tufted leather bench seats */}
          <polygon points="105,100 142,98 144,124 105,124" fill="#3f2e22" stroke="#1c1917" strokeWidth="1.5" />
          <polygon points="165,98 205,96 208,124 165,124" fill="#3f2e22" stroke="#1c1917" strokeWidth="1.5" />
          {/* Front curved footboard & brass tiller */}
          <path d="M 245,120 Q 262,118 258,102" stroke={brassStroke} strokeWidth="3" fill="none" />
          {/* Front brass carriage lantern */}
          <rect x="268" y="120" width="10" height="15" rx="2" fill={brassStroke} stroke="#78350f" strokeWidth="1.2" />
          <circle cx="273" cy="127" r="4" fill="#fef08a" />
          {/* Flowing carriage mudguards */}
          <path d="M 74,148 Q 98,118 146,148" stroke="#1c1917" strokeWidth="3.5" fill="none" />
          <path d="M 270,160 Q 296,128 332,156" stroke="#1c1917" strokeWidth="3.5" fill="none" />
        </g>
      );
    }
    // Economy: Curved-Dash Runabout Buggy (high curved wooden dash, single seat, steering tiller)
    return (
      <g id="body-d0-economy">
        {/* Curved front dash platform */}
        <path d="M 88,148 Q 96,122 135,122 L 225,122 Q 242,122 250,136 L 285,138 Q 306,142 305,125 L 312,125 Q 315,148 290,152 L 276,162 Q 210,160 144,158 Q 124,136 104,155 Z" fill={bodyFill} stroke={brassStroke} strokeWidth="1.8" />
        {/* Tufted black leather bench seat */}
        <polygon points="145,100 195,98 200,126 145,126" fill="#29180c" stroke="#1c1917" strokeWidth="1.8" />
        {/* Brass steering tiller bar */}
        <path d="M 225,124 Q 240,110 236,92" stroke={brassStroke} strokeWidth="3" fill="none" />
        {/* Side carriage kerosene lantern */}
        <rect x="235" y="118" width="9" height="14" rx="2" fill={brassStroke} stroke="#78350f" strokeWidth="1.2" />
        <circle cx="239" cy="125" r="3.5" fill="#fef08a" />
        {/* Wooden carriage curved fenders */}
        <path d="M 84,148 Q 102,125 142,150" stroke="#1c1917" strokeWidth="3" fill="none" />
        <path d="M 268,160 Q 292,132 322,155" stroke="#1c1917" strokeWidth="3" fill="none" />
      </g>
    );
  }

  // =========================================================================
  // DECADE 1: 1910-1919 (BRASS TORPEDO & TOURING ERA)
  // Grey natural rubber tires, rounded torpedo hood, brass/nickel radiator
  // =========================================================================
  if (decade === 1) {
    if (segment === "utility") {
      // Enclosed Panel Delivery Van (solid sides, curved wood roof, split windshield, brass radiator)
      return (
        <g id="body-d1-utility">
          {/* Van enclosed cargo body with rounded roof */}
          <path d="M 70,146 L 70,72 Q 78,58 135,56 L 210,54 L 210,154 Q 180,156 144,158 Q 124,136 104,155 Z" fill={bodyFill} stroke="#1c1917" strokeWidth="2" />
          {/* Side panel decorative grooved molding */}
          <rect x="85" y="70" width="112" height="65" rx="3" fill="none" stroke="#ca8a04" strokeWidth="1.5" />
          {/* Driver cab & split windshield */}
          <polygon points="210,54 235,66 238,105 210,105" fill={glassFill} stroke="#1c1917" strokeWidth="1.5" />
          <polygon points="210,105 240,105 242,156 210,154" fill={bodyFill} stroke="#1c1917" strokeWidth="1.8" />
          {/* Long rounded commercial hood */}
          <polygon points="240,105 288,110 324,134 272,130" fill={bodyFill} stroke="#1c1917" strokeWidth="1.8" />
          {/* Brass rounded radiator shell */}
          <path d="M 288,110 Q 308,106 324,134 L 324,162 L 288,148 Z" fill={brassStroke} stroke="#78350f" strokeWidth="2" />
          {/* Heavy steel bumper bar */}
          <line x1="280" y1="152" x2="334" y2="166" stroke="#475569" strokeWidth="4.5" />
          {/* Twin brass headlights */}
          <circle cx="330" cy="138" r="7.5" fill={brassStroke} stroke="#78350f" strokeWidth="1.2" />
          <circle cx="330" cy="138" r="5" fill="#fef08a" />
          <circle cx="288" cy="124" r="6" fill={brassStroke} stroke="#78350f" strokeWidth="1.2" />
          <circle cx="288" cy="124" r="4" fill="#fef08a" />
        </g>
      );
    }
    if (segment === "luxury") {
      // Chauffeur Limousine (enclosed rear passenger salon, open chauffeur seat, tall nickel radiator)
      return (
        <g id="body-d1-luxury">
          {/* Formal enclosed rear passenger salon */}
          <path d="M 72,146 L 72,68 Q 80,54 125,52 L 205,50 Q 212,50 215,65 L 215,154 Q 180,156 144,158 Q 124,136 104,155 Z" fill={bodyFill} stroke={nickelStroke} strokeWidth="2" />
          {/* Opera side windows with beveled glass */}
          <polygon points="86,66 136,64 136,104 86,106" fill={glassFill} stroke={nickelStroke} strokeWidth="1.5" />
          <polygon points="146,64 198,62 198,104 146,104" fill={glassFill} stroke={nickelStroke} strokeWidth="1.5" />
          {/* Chauffeur compartment with leather half-canopy */}
          <polygon points="205,50 240,64 242,106 215,106" fill={glassFill} stroke="#1c1917" strokeWidth="1.5" />
          <polygon points="215,106 248,106 250,156 215,154" fill={bodyFill} stroke="#1c1917" strokeWidth="1.8" />
          {/* Long torpedo hood with cooling louvers */}
          <polygon points="248,106 295,108 330,132 278,130" fill={bodyFill} stroke="#1c1917" strokeWidth="1.8" />
          <line x1="255" y1="120" x2="280" y2="120" stroke="#1c1917" strokeWidth="1.5" />
          <line x1="255" y1="124" x2="280" y2="124" stroke="#1c1917" strokeWidth="1.5" />
          {/* Tall nickel radiator shell */}
          <polygon points="295,108 330,132 330,164 295,148" fill={nickelStroke} stroke="#475569" strokeWidth="2.5" />
          {/* Dual large nickel headlamps */}
          <circle cx="336" cy="136" r="8.5" fill={nickelStroke} stroke="#475569" strokeWidth="1.5" />
          <circle cx="336" cy="136" r="6" fill="#fef08a" />
          <circle cx="294" cy="122" r="7" fill={nickelStroke} stroke="#475569" strokeWidth="1.5" />
          <circle cx="294" cy="122" r="4.5" fill="#fef08a" />
          {/* Long continuous running boards */}
          <line x1="144" y1="158" x2="276" y2="162" stroke="#1c1917" strokeWidth="5" />
        </g>
      );
    }
    if (segment === "family") {
      // Torpedo Tourer (flush-sided 4-door open body, folding canvas roof boot, running boards)
      return (
        <g id="body-d1-family">
          {/* Folded canvas top boot resting over rear deck */}
          <polygon points="70,126 102,112 110,124 74,136" fill="#d97706" stroke="#78350f" strokeWidth="1.5" />
          {/* Flush torpedo 4-door side tub */}
          <path d="M 76,146 Q 84,118 120,118 L 240,114 Q 252,114 260,124 L 298,126 L 328,142 L 278,162 Q 220,160 144,158 Q 124,136 104,155 Z" fill={bodyFill} stroke={brassStroke} strokeWidth="1.8" />
          {/* Split brass-framed windscreen */}
          <polygon points="234,80 252,80 258,114 240,114" fill={glassFill} stroke={brassStroke} strokeWidth="2" />
          {/* Rounded torpedo hood & brass radiator */}
          <polygon points="252,114 295,116 328,138 278,134" fill={bodyFill} stroke="#1c1917" strokeWidth="1.8" />
          <path d="M 295,116 Q 312,112 328,138 L 328,162 L 295,148 Z" fill={brassStroke} stroke="#78350f" strokeWidth="2" />
          {/* Twin brass headlights */}
          <circle cx="334" cy="140" r="8" fill={brassStroke} stroke="#78350f" strokeWidth="1.5" />
          <circle cx="334" cy="140" r="5.5" fill="#fef08a" />
          <circle cx="292" cy="126" r="6.5" fill={brassStroke} stroke="#78350f" strokeWidth="1.5" />
          <circle cx="292" cy="126" r="4.5" fill="#fef08a" />
          {/* Continuous running board */}
          <line x1="144" y1="158" x2="276" y2="162" stroke="#1c1917" strokeWidth="4.5" />
        </g>
      );
    }
    // Economy: Brass Roadster / Spider (minimalist 2-seat runabout, folded top envelope, brass radiator)
    return (
      <g id="body-d1-economy">
        {/* Folded top canvas boot */}
        <polygon points="76,130 102,118 108,128 80,138" fill="#d97706" stroke="#78350f" strokeWidth="1.5" />
        {/* 2-Seat lightweight body */}
        <path d="M 82,146 Q 90,122 130,122 L 235,118 Q 248,118 255,128 L 292,128 L 322,142 L 276,162 Q 220,160 144,158 Q 124,136 104,155 Z" fill={bodyFill} stroke={brassStroke} strokeWidth="1.8" />
        {/* Monocle / brass split windshield */}
        <polygon points="230,86 248,86 252,118 235,118" fill={glassFill} stroke={brassStroke} strokeWidth="1.8" />
        {/* Rounded torpedo hood */}
        <polygon points="248,118 290,120 322,140 276,136" fill={bodyFill} stroke="#1c1917" strokeWidth="1.8" />
        {/* Brass round radiator shell */}
        <path d="M 290,120 Q 306,116 322,140 L 322,162 L 290,148 Z" fill={brassStroke} stroke="#78350f" strokeWidth="2" />
        {/* Brass headlamps */}
        <circle cx="328" cy="142" r="7.5" fill={brassStroke} stroke="#78350f" strokeWidth="1.2" />
        <circle cx="328" cy="142" r="5" fill="#fef08a" />
        <circle cx="288" cy="128" r="6" fill={brassStroke} stroke="#78350f" strokeWidth="1.2" />
        <circle cx="288" cy="128" r="4" fill="#fef08a" />
      </g>
    );
  }

  // =========================================================================
  // DECADE 2: 1920-1929 (ROARING TWENTIES & GATSBY ERA)
  // Wide whitewall tires, nickel/chrome plating, wire wheels, external trunks
  // =========================================================================
  if (decade === 2) {
    if (segment === "utility") {
      // Heavy Express Stake Truck (enclosed steel cab with visor, wooden stake flatbed with rails)
      return (
        <g id="body-d2-utility">
          {/* Heavy wooden flatbed with vertical stake rails */}
          <polygon points="68,148 68,102 185,98 185,154 144,158 124,136 104,155" fill="#78350f" stroke="#29180c" strokeWidth="2" />
          <line x1="68" y1="116" x2="185" y2="112" stroke="#b45309" strokeWidth="2.5" />
          <line x1="68" y1="130" x2="185" y2="126" stroke="#b45309" strokeWidth="2.5" />
          {/* Vertical stake uprights */}
          <line x1="88" y1="102" x2="88" y2="148" stroke="#451a03" strokeWidth="3" />
          <line x1="125" y1="100" x2="125" y2="136" stroke="#451a03" strokeWidth="3" />
          <line x1="160" y1="99" x2="160" y2="150" stroke="#451a03" strokeWidth="3" />
          {/* Enclosed cab with windshield sunvisor */}
          <polygon points="185,65 230,62 238,102 185,102" fill={glassFill} stroke="#1c1917" strokeWidth="1.8" />
          <polygon points="228,60 248,72 242,75 228,65" fill="#1c1917" stroke="#475569" strokeWidth="1" />
          <polygon points="185,102 240,102 242,156 185,154" fill={bodyFill} stroke="#1c1917" strokeWidth="2" />
          {/* Long commercial hood with louvers */}
          <polygon points="240,102 288,106 324,130 274,126" fill={bodyFill} stroke="#1c1917" strokeWidth="1.8" />
          {/* Heavy nickel radiator with steel guard bar */}
          <polygon points="288,106 324,130 324,162 288,148" fill={nickelStroke} stroke="#334155" strokeWidth="2.5" />
          {/* Heavy channel steel bumper */}
          <line x1="280" y1="152" x2="335" y2="166" stroke="#334155" strokeWidth="5" />
        </g>
      );
    }
    if (segment === "luxury") {
      // Gatsby Dual-Cowl Phaeton (elongated hood, dual cockpits, external chrome flex exhaust pipes)
      return (
        <g id="body-d2-luxury">
          {/* Swept rear speedster / dual cockpit tub */}
          <path d="M 72,146 Q 80,112 120,112 L 235,108 Q 248,108 254,120 L 298,122 L 332,138 L 278,162 Q 220,160 144,158 Q 124,136 104,155 Z" fill={bodyFill} stroke={chromeStroke} strokeWidth="2" />
          {/* Secondary rear cockpit cowl and small windscreen */}
          <polygon points="160,94 178,94 182,110 162,110" fill={glassFill} stroke={chromeStroke} strokeWidth="1.5" />
          {/* Primary windshield with chrome stanchions */}
          <polygon points="230,76 250,76 256,110 236,110" fill={glassFill} stroke={chromeStroke} strokeWidth="2" />
          {/* Ultra-long hood with twin rows of louvers */}
          <polygon points="250,110 298,112 334,134 278,128" fill={bodyFill} stroke="#1c1917" strokeWidth="1.8" />
          {/* 3 External chrome flexible exhaust pipes exiting hood */}
          <path d="M 265,116 Q 275,130 278,148" stroke={chromeStroke} strokeWidth="3" fill="none" />
          <path d="M 272,117 Q 282,131 285,148" stroke={chromeStroke} strokeWidth="3" fill="none" />
          <path d="M 279,118 Q 289,132 292,148" stroke={chromeStroke} strokeWidth="3" fill="none" />
          {/* Massive chrome drum headlights & crossbar */}
          <circle cx="340" cy="136" r="9.5" fill={chromeStroke} stroke="#334155" strokeWidth="1.5" />
          <circle cx="340" cy="136" r="7" fill="#fef08a" />
          <circle cx="295" cy="120" r="8" fill={chromeStroke} stroke="#334155" strokeWidth="1.5" />
          <circle cx="295" cy="120" r="5.5" fill="#fef08a" />
          <line x1="295" y1="120" x2="340" y2="136" stroke={chromeStroke} strokeWidth="2.5" />
          {/* Full-width curved chrome bumper */}
          <path d="M 285,152 Q 312,160 342,166" stroke={chromeStroke} strokeWidth="4" fill="none" />
        </g>
      );
    }
    if (segment === "family") {
      // Six-Light Town Sedan (upright formal 4-door, sun visor, rear luggage trunk strapped on rack)
      return (
        <g id="body-d2-family">
          {/* Strapped leather rear luggage trunk */}
          <polygon points="68,144 68,106 102,104 102,146" fill="#3f2e22" stroke="#1c1917" strokeWidth="1.8" />
          <line x1="72" y1="106" x2="72" y2="144" stroke="#ca8a04" strokeWidth="1.5" />
          <line x1="96" y1="105" x2="96" y2="144" stroke="#ca8a04" strokeWidth="1.5" />
          {/* Formal upright sedan greenhouse with sunvisor */}
          <polygon points="98,64 212,60 216,106 98,106" fill={glassFill} stroke="#1c1917" strokeWidth="1.8" />
          {/* Windshield visor */}
          <polygon points="210,58 228,68 222,72 210,64" fill="#1c1917" stroke="#475569" strokeWidth="1" />
          {/* Sedan body flank */}
          <polygon points="98,106 226,104 230,156 144,158 124,136 104,155 98,146" fill={bodyFill} stroke="#1c1917" strokeWidth="2" />
          {/* Hood & tall nickel radiator */}
          <polygon points="226,104 286,108 322,132 272,128" fill={bodyFill} stroke="#1c1917" strokeWidth="1.8" />
          <polygon points="286,108 322,132 322,162 286,148" fill={nickelStroke} stroke="#334155" strokeWidth="2" />
          {/* Twin nickel drum headlights */}
          <circle cx="330" cy="136" r="8" fill={nickelStroke} stroke="#334155" strokeWidth="1.5" />
          <circle cx="330" cy="136" r="5.5" fill="#fef08a" />
          <circle cx="288" cy="122" r="6.5" fill={nickelStroke} stroke="#334155" strokeWidth="1.5" />
          <circle cx="288" cy="122" r="4.5" fill="#fef08a" />
        </g>
      );
    }
    // Economy: Doctor's Coupe (upright 2-door coupe, sunvisor, turtle-deck rear trunk, motometer)
    return (
      <g id="body-d2-economy">
        {/* Rounded turtle-deck rear trunk */}
        <path d="M 76,146 Q 84,124 125,122 L 152,120 L 152,154 Q 144,158 124,136 104,155 Z" fill={bodyFill} stroke="#1c1917" strokeWidth="1.8" />
        {/* Upright coupe greenhouse with sunvisor */}
        <polygon points="148,68 214,64 218,108 148,108" fill={glassFill} stroke="#1c1917" strokeWidth="1.8" />
        <polygon points="212,62 230,72 224,76 212,68" fill="#1c1917" stroke="#475569" strokeWidth="1" />
        {/* Lower cabin door */}
        <polygon points="148,108 226,106 228,156 148,154" fill={bodyFill} stroke="#1c1917" strokeWidth="2" />
        {/* Hood & nickel radiator with motometer */}
        <polygon points="226,106 282,110 318,134 270,130" fill={bodyFill} stroke="#1c1917" strokeWidth="1.8" />
        <polygon points="282,110 318,134 318,162 282,148" fill={nickelStroke} stroke="#334155" strokeWidth="2" />
        {/* Nickel motometer temperature gauge on radiator cap */}
        <circle cx="300" cy="118" r="3.5" fill={nickelStroke} stroke="#334155" strokeWidth="1" />
        {/* Twin headlights */}
        <circle cx="324" cy="138" r="7.5" fill={nickelStroke} stroke="#334155" strokeWidth="1.2" />
        <circle cx="324" cy="138" r="5" fill="#fef08a" />
        <circle cx="282" cy="124" r="6" fill={nickelStroke} stroke="#334155" strokeWidth="1.2" />
        <circle cx="282" cy="124" r="4" fill="#fef08a" />
      </g>
    );
  }

  // =========================================================================
  // DECADE 3: 1930-1939 (ART DECO & STREAMLINE MODERNE)
  // Teardrop aerodynamic silhouettes, waterfall grilles, bullet headlamps
  // =========================================================================
  if (decade === 3) {
    if (segment === "utility") {
      // Art Deco Curvaceous Pickup (bulbous front fenders, waterfall truck grille, stepside bed)
      return (
        <g id="body-d3-utility">
          {/* Stepside steel pickup bed */}
          <polygon points="70,146 70,112 188,108 188,154 144,158 124,136 104,155" fill={bodyFill} stroke="#1c1917" strokeWidth="1.8" />
          {/* High rounded Art Deco cab & split vee-windshield */}
          <path d="M 188,108 L 195,68 Q 205,58 240,62 L 255,108 Z" fill={glassFill} stroke="#1c1917" strokeWidth="1.8" />
          <polygon points="188,108 255,108 258,156 188,154" fill={bodyFill} stroke="#1c1917" strokeWidth="2" />
          {/* Curvaceous hood & waterfall grille prow */}
          <polygon points="255,108 296,112 330,136 274,130" fill={bodyFill} stroke="#1c1917" strokeWidth="1.8" />
          {/* Art Deco waterfall grille with fine chrome vertical bars */}
          <path d="M 296,112 Q 316,110 330,136 L 330,162 L 296,148 Z" fill="#0f172a" stroke={chromeStroke} strokeWidth="2" />
          <line x1="305" y1="120" x2="305" y2="152" stroke={chromeStroke} strokeWidth="1.5" />
          <line x1="314" y1="125" x2="314" y2="156" stroke={chromeStroke} strokeWidth="1.5" />
          <line x1="322" y1="130" x2="322" y2="160" stroke={chromeStroke} strokeWidth="1.5" />
          {/* Teardrop bullet headlights molded into fender crowns */}
          <path d="M 334,134 Q 342,138 334,142 Z" fill={chromeStroke} />
          <circle cx="334" cy="138" r="6" fill="#fef08a" stroke={chromeStroke} strokeWidth="1" />
          <circle cx="292" cy="125" r="5" fill="#fef08a" stroke={chromeStroke} strokeWidth="1" />
        </g>
      );
    }
    if (segment === "luxury") {
      // Grand V12 Aero Speedster (ultra-long dramatic hood, enclosed rear wheels with chrome chevron spats)
      return (
        <g id="body-d3-luxury">
          {/* Swept teardrop aerodynamic body */}
          <path d="M 68,144 Q 85,100 135,100 L 235,96 Q 248,96 256,110 L 302,114 L 338,134 L 280,162 Q 220,160 144,158 Q 124,136 104,155 Z" fill={bodyFill} stroke="#1c1917" strokeWidth="1.8" />
          {/* Enclosed rear wheel spat with Art Deco chrome chevrons */}
          <ellipse cx="124" cy="158" rx="20" ry="18" fill={bodyFill} stroke={chromeStroke} strokeWidth="1.5" />
          <path d="M 115,152 L 124,158 L 133,152 M 115,158 L 124,164 L 133,158" stroke={chromeStroke} strokeWidth="2" fill="none" />
          {/* Chopped raked split windshield */}
          <polygon points="225,72 250,72 258,110 232,110" fill={glassFill} stroke={chromeStroke} strokeWidth="1.8" />
          {/* Massive raked chrome prow grille */}
          <path d="M 302,114 Q 324,110 338,134 L 338,164 L 302,148 Z" fill="#0f172a" stroke={chromeStroke} strokeWidth="2.5" />
          <line x1="312" y1="120" x2="312" y2="152" stroke={chromeStroke} strokeWidth="1.5" />
          <line x1="322" y1="124" x2="322" y2="156" stroke={chromeStroke} strokeWidth="1.5" />
          <line x1="330" y1="128" x2="330" y2="160" stroke={chromeStroke} strokeWidth="1.5" />
          {/* Streamlined bullet headlights */}
          <ellipse cx="342" cy="136" rx="6" ry="8" fill="#fef08a" stroke={chromeStroke} strokeWidth="1.5" />
          <ellipse cx="298" cy="122" rx="5" ry="6.5" fill="#fef08a" stroke={chromeStroke} strokeWidth="1.5" />
        </g>
      );
    }
    if (segment === "family") {
      // Aerodyne 4-Door Sedan (swept ponton fenders, Art Deco prow grille, split vee-windshield, rear bustle)
      return (
        <g id="body-d3-family">
          {/* Streamlined fastback sedan roofline */}
          <path d="M 72,144 Q 85,92 135,90 L 222,86 Q 236,86 244,106 L 244,156 Q 180,158 144,158 Q 124,136 104,155 Z" fill={bodyFill} stroke="#1c1917" strokeWidth="2" />
          {/* Curved side windows with chrome divider */}
          <polygon points="120,92 216,88 222,110 120,112" fill={glassFill} stroke={chromeStroke} strokeWidth="1.2" />
          {/* Hood & rounded prow grille */}
          <polygon points="244,106 294,110 328,134 274,130" fill={bodyFill} stroke="#1c1917" strokeWidth="1.8" />
          <path d="M 294,110 Q 315,108 328,134 L 328,162 L 294,148 Z" fill="#0f172a" stroke={chromeStroke} strokeWidth="2" />
          <line x1="305" y1="120" x2="305" y2="152" stroke={chromeStroke} strokeWidth="1.5" />
          <line x1="316" y1="124" x2="316" y2="156" stroke={chromeStroke} strokeWidth="1.5" />
          {/* Bullet headlights */}
          <circle cx="332" cy="136" r="7.5" fill="#fef08a" stroke={chromeStroke} strokeWidth="1.5" />
          <circle cx="290" cy="122" r="6" fill="#fef08a" stroke={chromeStroke} strokeWidth="1.5" />
        </g>
      );
    }
    // Economy: Streamline Fastback Coupe (swept teardrop rear, waterfall grille, teardrop bullet lights)
    return (
      <g id="body-d3-economy">
        <path d="M 74,144 Q 92,106 142,104 L 226,102 Q 238,102 246,114 L 288,116 L 322,136 L 274,162 Q 220,160 144,158 Q 124,136 104,155 Z" fill={bodyFill} stroke="#1c1917" strokeWidth="1.8" />
        <polygon points="152,104 220,102 226,118 152,118" fill={glassFill} stroke="#1c1917" strokeWidth="1.2" />
        <polygon points="246,114 288,116 322,136 270,132" fill={bodyFill} stroke="#1c1917" strokeWidth="1.8" />
        <path d="M 288,116 Q 308,114 322,136 L 322,162 L 288,148 Z" fill="#0f172a" stroke={chromeStroke} strokeWidth="2" />
        <circle cx="326" cy="138" r="7" fill="#fef08a" stroke={chromeStroke} strokeWidth="1.2" />
        <circle cx="284" cy="125" r="5.5" fill="#fef08a" stroke={chromeStroke} strokeWidth="1.2" />
      </g>
    );
  }

  // =========================================================================
  // DECADE 4: 1940-1949 (POST-WAR PONTON & HEAVY CHROME)
  // Fully integrated fenders, horizontal die-cast grilles, massive bumpers
  // =========================================================================
  if (decade === 4) {
    if (segment === "utility") {
      // Heavy-Duty Commercial Work Truck (massive bulbous alligator hood, 5-bar horizontal grille)
      return (
        <g id="body-d4-utility">
          {/* Deep steel commercial bed */}
          <polygon points="68,146 68,112 188,108 188,154 144,158 124,136 104,155" fill={bodyFill} stroke="#1c1917" strokeWidth="2" />
          {/* High-visibility curved cab with quarter windows */}
          <path d="M 188,108 L 196,65 Q 206,56 244,58 L 260,106 Z" fill={glassFill} stroke="#1c1917" strokeWidth="2" />
          <polygon points="188,106 260,106 264,156 188,154" fill={bodyFill} stroke="#1c1917" strokeWidth="2" />
          {/* Massive alligator-mouth bulbous hood */}
          <polygon points="260,106 304,110 338,136 276,132" fill={bodyFill} stroke="#1c1917" strokeWidth="2" />
          {/* 5-bar stamped chrome horizontal truck grille */}
          <polygon points="304,110 338,136 338,162 304,148" fill="#0f172a" stroke={chromeStroke} strokeWidth="2.5" />
          <line x1="305" y1="120" x2="337" y2="142" stroke={chromeStroke} strokeWidth="2.5" />
          <line x1="305" y1="128" x2="337" y2="148" stroke={chromeStroke} strokeWidth="2.5" />
          <line x1="305" y1="136" x2="337" y2="154" stroke={chromeStroke} strokeWidth="2.5" />
          {/* Round headlamps recessed into fender crowns */}
          <circle cx="342" cy="136" r="7.5" fill="#fef08a" stroke={chromeStroke} strokeWidth="1.5" />
          <circle cx="298" cy="122" r="6" fill="#fef08a" stroke={chromeStroke} strokeWidth="1.5" />
          {/* Heavy stamped bumper bar */}
          <line x1="285" y1="152" x2="344" y2="166" stroke={chromeStroke} strokeWidth="6" />
        </g>
      );
    }
    if (segment === "luxury") {
      // Continental Club Coupe (long hood, square chrome eggcrate grille, continental spare tire)
      return (
        <g id="body-d4-luxury">
          {/* Continental spare tire housing mounted on rear bumper */}
          <ellipse cx="68" cy="134" rx="12" ry="18" fill="#1c1917" stroke={chromeStroke} strokeWidth="2" />
          {/* Long elegant ponton body */}
          <path d="M 76,146 Q 90,88 140,86 L 235,84 Q 248,84 256,102 L 305,106 L 342,130 L 282,162 Q 220,160 144,158 Q 124,136 104,155 Z" fill={bodyFill} stroke="#1c1917" strokeWidth="2" />
          {/* Low profile coupe greenhouse */}
          <polygon points="135,86 226,84 234,106 135,108" fill={glassFill} stroke={chromeStroke} strokeWidth="1.5" />
          {/* Broad hood & square die-cast chrome eggcrate grille */}
          <polygon points="256,102 305,106 342,130 280,126" fill={bodyFill} stroke="#1c1917" strokeWidth="2" />
          <polygon points="305,106 342,130 342,162 305,148" fill="#0f172a" stroke={chromeStroke} strokeWidth="2.5" />
          {/* Eggcrate mesh */}
          <line x1="306" y1="120" x2="341" y2="140" stroke={chromeStroke} strokeWidth="2" />
          <line x1="306" y1="132" x2="341" y2="148" stroke={chromeStroke} strokeWidth="2" />
          <line x1="318" y1="112" x2="318" y2="152" stroke={chromeStroke} strokeWidth="1.5" />
          <line x1="330" y1="120" x2="330" y2="156" stroke={chromeStroke} strokeWidth="1.5" />
          {/* Chrome headlights */}
          <circle cx="346" cy="132" r="8" fill="#fef08a" stroke={chromeStroke} strokeWidth="1.5" />
          <circle cx="300" cy="118" r="6.5" fill="#fef08a" stroke={chromeStroke} strokeWidth="1.5" />
          {/* Wide lower body chrome rocker molding */}
          <line x1="144" y1="158" x2="276" y2="162" stroke={chromeStroke} strokeWidth="3" />
        </g>
      );
    }
    if (segment === "family") {
      // Post-War Torpedo Cruiser Sedan (broad rounded hood, wide chrome grille with heavy bumper guards)
      return (
        <g id="body-d4-family">
          <path d="M 72,146 Q 86,88 136,86 L 230,84 Q 242,84 250,104 L 300,108 L 336,132 L 278,162 Q 220,160 144,158 Q 124,136 104,155 Z" fill={bodyFill} stroke="#1c1917" strokeWidth="2" />
          <polygon points="125,86 220,84 228,108 125,110" fill={glassFill} stroke={chromeStroke} strokeWidth="1.5" />
          <polygon points="250,104 300,108 336,132 276,128" fill={bodyFill} stroke="#1c1917" strokeWidth="2" />
          <polygon points="300,108 336,132 336,162 300,148" fill="#0f172a" stroke={chromeStroke} strokeWidth="2.5" />
          <line x1="301" y1="122" x2="335" y2="142" stroke={chromeStroke} strokeWidth="2.5" />
          <line x1="301" y1="134" x2="335" y2="150" stroke={chromeStroke} strokeWidth="2.5" />
          {/* Twin vertical bumper guards ("overriders") */}
          <rect x="312" y="146" width="5" height="18" rx="2" fill={chromeStroke} stroke="#334155" strokeWidth="1" />
          <rect x="330" y="152" width="5" height="18" rx="2" fill={chromeStroke} stroke="#334155" strokeWidth="1" />
          <circle cx="340" cy="134" r="7.5" fill="#fef08a" stroke={chromeStroke} strokeWidth="1.5" />
          <circle cx="296" cy="120" r="6" fill="#fef08a" stroke={chromeStroke} strokeWidth="1.5" />
        </g>
      );
    }
    // Economy: Ponton Fastback 2-Door (smooth ponton styling, horizontal die-cast grille slats)
    return (
      <g id="body-d4-economy">
        <path d="M 74,146 Q 90,98 140,96 L 225,94 Q 236,94 245,108 L 292,112 L 326,134 L 274,162 Q 220,160 144,158 Q 124,136 104,155 Z" fill={bodyFill} stroke="#1c1917" strokeWidth="1.8" />
        <polygon points="142,96 215,94 222,112 142,114" fill={glassFill} stroke="#1c1917" strokeWidth="1.2" />
        <polygon points="245,108 292,112 326,134 272,130" fill={bodyFill} stroke="#1c1917" strokeWidth="1.8" />
        <polygon points="292,112 326,134 326,162 292,148" fill="#0f172a" stroke={chromeStroke} strokeWidth="2" />
        <line x1="293" y1="126" x2="325" y2="144" stroke={chromeStroke} strokeWidth="2" />
        <line x1="293" y1="136" x2="325" y2="152" stroke={chromeStroke} strokeWidth="2" />
        <circle cx="330" cy="136" r="7" fill="#fef08a" stroke={chromeStroke} strokeWidth="1.2" />
        <circle cx="288" cy="122" r="5.5" fill="#fef08a" stroke={chromeStroke} strokeWidth="1.2" />
      </g>
    );
  }

  // =========================================================================
  // DECADE 5: 1950-1959 (JET-AGE & TAILFIN EXTRAVAGANZA)
  // Panoramic wraparound glass, soaring tailfins, Dagmar bumper bullets
  // =========================================================================
  if (decade === 5) {
    if (segment === "utility") {
      // Stepside Custom Pickup (domed hood with chrome windsplits, smiling chrome grille, stepside bed)
      return (
        <g id="body-d5-utility">
          {/* Stepside bed with white roof cab */}
          <polygon points="68,146 68,110 188,106 188,154 144,158 124,136 104,155" fill={bodyFill} stroke="#1c1917" strokeWidth="2" />
          {/* Panoramic wraparound cab roof in two-tone white */}
          <path d="M 188,106 L 195,62 Q 206,52 245,54 L 260,102 Z" fill={twoTone} stroke={chromeStroke} strokeWidth="1.8" />
          <polygon points="194,66 238,62 255,102 194,104" fill={glassFill} stroke="#1c1917" strokeWidth="1.5" />
          <polygon points="188,104 260,102 264,156 188,154" fill={bodyFill} stroke="#1c1917" strokeWidth="2" />
          {/* High domed hood with twin chrome windsplit spears */}
          <polygon points="260,102 305,106 340,132 276,128" fill={bodyFill} stroke="#1c1917" strokeWidth="2" />
          <line x1="270" y1="108" x2="315" y2="120" stroke={chromeStroke} strokeWidth="2" />
          <line x1="285" y1="106" x2="330" y2="122" stroke={chromeStroke} strokeWidth="2" />
          {/* Smiling wide chrome truck grille */}
          <polygon points="305,106 340,132 340,162 305,148" fill="#0f172a" stroke={chromeStroke} strokeWidth="2.5" />
          <path d="M 306,126 Q 324,136 339,142" stroke={chromeStroke} strokeWidth="4" fill="none" />
          <circle cx="344" cy="132" r="7.5" fill="#fef08a" stroke={chromeStroke} strokeWidth="1.5" />
          <circle cx="300" cy="118" r="6" fill="#fef08a" stroke={chromeStroke} strokeWidth="1.5" />
        </g>
      );
    }
    if (segment === "luxury") {
      // Grand Fin Imperial Coupe (soaring shark tailfins, dual Dagmar bumper bullets, quad headlamps)
      return (
        <g id="body-d5-luxury">
          {/* Soaring shark tailfin rising high over rear quarter */}
          <path d="M 64,88 L 92,106 L 90,146 L 64,142 Z" fill={bodyFill} stroke={chromeStroke} strokeWidth="2" />
          <line x1="64" y1="88" x2="90" y2="146" stroke={chromeStroke} strokeWidth="2.5" />
          {/* Ruby red bullet tail light lens */}
          <ellipse cx="64" cy="94" rx="3.5" ry="5" fill="#ef4444" stroke={chromeStroke} strokeWidth="1" />
          {/* Pillarless hardtop greenhouse with wraparound dogleg windshield */}
          <path d="M 90,106 L 120,70 L 228,66 L 255,98 L 90,106 Z" fill={twoTone} stroke={chromeStroke} strokeWidth="2" />
          <polygon points="125,74 220,70 248,98 125,104" fill={glassFill} stroke={chromeStroke} strokeWidth="1.5" />
          {/* Lower fuselage body with two-tone sweep spear */}
          <polygon points="90,106 255,98 260,156 144,158 124,136 104,155 90,146" fill={bodyFill} stroke="#1c1917" strokeWidth="2" />
          <path d="M 90,126 Q 180,128 260,136" stroke={chromeStroke} strokeWidth="3" fill="none" />
          {/* Massive front clip with eggcrate grille */}
          <polygon points="255,98 308,102 344,128 280,124" fill={bodyFill} stroke="#1c1917" strokeWidth="2" />
          <polygon points="308,102 344,128 344,162 308,148" fill="#0f172a" stroke={chromeStroke} strokeWidth="2.5" />
          {/* Dual front Dagmar chrome bumper bullets */}
          <ellipse cx="320" cy="148" rx="6" ry="8" fill={chromeStroke} stroke="#334155" strokeWidth="1.5" />
          <ellipse cx="344" cy="154" rx="6" ry="8" fill={chromeStroke} stroke="#334155" strokeWidth="1.5" />
          {/* Quad chrome headlamps */}
          <circle cx="346" cy="126" r="5" fill="#fef08a" stroke={chromeStroke} strokeWidth="1" />
          <circle cx="340" cy="132" r="5" fill="#fef08a" stroke={chromeStroke} strokeWidth="1" />
          <circle cx="304" cy="114" r="4.5" fill="#fef08a" stroke={chromeStroke} strokeWidth="1" />
          <circle cx="298" cy="120" r="4.5" fill="#fef08a" stroke={chromeStroke} strokeWidth="1" />
        </g>
      );
    }
    if (segment === "family") {
      // Hardtop Cruiser Sedan (pillarless hardtop, swept rocket tailfins with ruby lenses, sweep spear)
      return (
        <g id="body-d5-family">
          {/* Swept rocket tailfin */}
          <path d="M 68,102 L 95,116 L 92,146 L 68,142 Z" fill={bodyFill} stroke={chromeStroke} strokeWidth="1.8" />
          <ellipse cx="68" cy="106" rx="3" ry="4.5" fill="#ef4444" stroke={chromeStroke} strokeWidth="1" />
          {/* Two-tone hardtop roof */}
          <path d="M 95,116 L 125,76 L 225,72 L 250,102 L 95,116 Z" fill={twoTone} stroke={chromeStroke} strokeWidth="1.8" />
          <polygon points="130,80 218,76 244,102 130,108" fill={glassFill} stroke={chromeStroke} strokeWidth="1.5" />
          <polygon points="95,116 250,102 255,156 144,158 124,136 104,155 92,146" fill={bodyFill} stroke="#1c1917" strokeWidth="2" />
          {/* Side chrome sweep spear */}
          <path d="M 95,130 Q 180,132 254,138" stroke={chromeStroke} strokeWidth="2.5" fill="none" />
          <polygon points="250,102 302,106 338,130 276,126" fill={bodyFill} stroke="#1c1917" strokeWidth="2" />
          <polygon points="302,106 338,130 338,162 302,148" fill="#0f172a" stroke={chromeStroke} strokeWidth="2.5" />
          <circle cx="342" cy="128" r="7" fill="#fef08a" stroke={chromeStroke} strokeWidth="1.2" />
          <circle cx="298" cy="116" r="5.5" fill="#fef08a" stroke={chromeStroke} strokeWidth="1.2" />
        </g>
      );
    }
    // Economy: 2-Door Post Sedan (compact two-tone, chrome side spear, small tasteful fin tips)
    return (
      <g id="body-d5-economy">
        <path d="M 72,120 L 92,126 L 90,146 L 72,142 Z" fill={bodyFill} stroke={chromeStroke} strokeWidth="1.5" />
        <path d="M 92,126 L 130,86 L 220,82 L 244,106 L 92,126 Z" fill={twoTone} stroke={chromeStroke} strokeWidth="1.5" />
        <polygon points="134,90 214,86 238,106 134,112" fill={glassFill} stroke="#1c1917" strokeWidth="1.2" />
        <polygon points="92,126 244,106 248,156 144,158 124,136 104,155 90,146" fill={bodyFill} stroke="#1c1917" strokeWidth="1.8" />
        <line x1="92" y1="134" x2="246" y2="138" stroke={chromeStroke} strokeWidth="2" />
        <polygon points="244,106 294,110 328,132 272,128" fill={bodyFill} stroke="#1c1917" strokeWidth="1.8" />
        <polygon points="294,110 328,132 328,162 294,148" fill="#0f172a" stroke={chromeStroke} strokeWidth="2" />
        <circle cx="332" cy="130" r="6.5" fill="#fef08a" stroke={chromeStroke} strokeWidth="1.2" />
        <circle cx="290" cy="118" r="5" fill="#fef08a" stroke={chromeStroke} strokeWidth="1.2" />
      </g>
    );
  }

  // =========================================================================
  // DECADE 6: 1960-1969 (MUSCLE, COKE-BOTTLE & CRISP LINEAR)
  // Narrow redline tires, Torq-Thrust mags, knife-edge fenders, hidden headlights
  // =========================================================================
  if (decade === 6) {
    if (segment === "utility") {
      // Fleetside Smooth-Bed Pickup (broad flat hood with power bulge, full-width fleetside bed)
      return (
        <g id="body-d6-utility">
          {/* Smooth full-width steel fleetside bed */}
          <polygon points="68,146 68,110 190,106 190,154 144,158 124,136 104,155" fill={bodyFill} stroke="#1c1917" strokeWidth="2" />
          {/* Clean linear cab with thin drip moldings */}
          <polygon points="190,66 238,64 255,104 190,106" fill={glassFill} stroke="#1c1917" strokeWidth="1.8" />
          <polygon points="190,106 255,104 258,156 190,154" fill={bodyFill} stroke="#1c1917" strokeWidth="2" />
          {/* Wide hood with center power bulge */}
          <polygon points="255,104 305,106 342,130 276,128" fill={bodyFill} stroke="#1c1917" strokeWidth="2" />
          <line x1="270" y1="112" x2="325" y2="124" stroke="#1c1917" strokeWidth="2" />
          {/* Stamped aluminum wide truck grille */}
          <polygon points="305,106 342,130 342,162 305,148" fill="#0f172a" stroke={chromeStroke} strokeWidth="2" />
          <circle cx="344" cy="130" r="7" fill="#fef08a" stroke={chromeStroke} strokeWidth="1.5" />
          <circle cx="302" cy="118" r="5.5" fill="#fef08a" stroke={chromeStroke} strokeWidth="1.5" />
        </g>
      );
    }
    if (segment === "luxury") {
      // Slab-Sided Formal Executive Coupe (knife-blade razor fender peaks, hidden headlamp doors, formal C-pillar)
      return (
        <g id="body-d6-luxury">
          {/* Formal notchback roof with broad formal C-pillar */}
          <polygon points="102,112 135,74 218,72 245,104 102,112" fill={bodyFill} stroke="#1c1917" strokeWidth="2" />
          <polygon points="140,78 212,76 238,104 140,106" fill={glassFill} stroke={chromeStroke} strokeWidth="1.2" />
          {/* Knife-blade razor-edge fender peaks running full length of body */}
          <path d="M 68,144 L 68,118 L 344,126 L 344,162 L 280,162 Q 220,160 144,158 Q 124,136 104,155 Z" fill={bodyFill} stroke="#1c1917" strokeWidth="2" />
          <line x1="68" y1="118" x2="344" y2="126" stroke={chromeStroke} strokeWidth="2.5" />
          {/* Long hood & wide black mesh grille with hidden headlights */}
          <polygon points="245,104 306,106 344,126 278,124" fill={bodyFill} stroke="#1c1917" strokeWidth="2" />
          <polygon points="306,106 344,126 344,158 306,146" fill="#020617" stroke={chromeStroke} strokeWidth="2" />
          {/* Hidden headlamp vacuum door louvers */}
          <line x1="312" y1="116" x2="312" y2="148" stroke="#334155" strokeWidth="2" />
          <line x1="334" y1="126" x2="334" y2="154" stroke="#334155" strokeWidth="2" />
          {/* Heavy chrome bumper */}
          <line x1="285" y1="150" x2="346" y2="162" stroke={chromeStroke} strokeWidth="5" />
        </g>
      );
    }
    if (segment === "family") {
      // Full-Size Coke-Bottle Hardtop Sedan (seductive Coke-bottle hip wave over rear wheel, quad headlamps)
      return (
        <g id="body-d6-family">
          {/* Semi-fastback roofline */}
          <polygon points="98,114 135,76 225,74 250,104 98,114" fill={bodyFill} stroke="#1c1917" strokeWidth="2" />
          <polygon points="140,80 218,78 244,104 140,108" fill={glassFill} stroke={chromeStroke} strokeWidth="1.2" />
          {/* Seductive Coke-bottle hip wave rising over rear wheel */}
          <path d="M 70,144 L 70,118 Q 105,116 124,110 Q 155,116 250,104 L 304,106 L 340,128 L 278,162 Q 220,160 144,158 Q 124,136 104,155 Z" fill={bodyFill} stroke="#1c1917" strokeWidth="2" />
          <polygon points="250,104 304,106 340,128 276,126" fill={bodyFill} stroke="#1c1917" strokeWidth="2" />
          <polygon points="304,106 340,128 340,158 304,146" fill="#0f172a" stroke={chromeStroke} strokeWidth="2" />
          {/* Quad horizontal headlamps */}
          <circle cx="344" cy="126" r="4.5" fill="#fef08a" stroke={chromeStroke} strokeWidth="1" />
          <circle cx="335" cy="130" r="4.5" fill="#fef08a" stroke={chromeStroke} strokeWidth="1" />
          <circle cx="304" cy="114" r="4" fill="#fef08a" stroke={chromeStroke} strokeWidth="1" />
          <circle cx="296" cy="118" r="4" fill="#fef08a" stroke={chromeStroke} strokeWidth="1" />
        </g>
      );
    }
    // Economy: Notchback Compact 2-Door (clean crisp horizontal lines, thin roof pillars, dual round headlights)
    return (
      <g id="body-d6-economy">
        <polygon points="105,116 138,82 216,80 240,106 105,116" fill={bodyFill} stroke="#1c1917" strokeWidth="1.8" />
        <polygon points="142,86 210,84 234,106 142,110" fill={glassFill} stroke="#1c1917" strokeWidth="1.2" />
        <path d="M 74,144 L 74,120 L 328,126 L 328,160 L 274,162 Q 220,160 144,158 Q 124,136 104,155 Z" fill={bodyFill} stroke="#1c1917" strokeWidth="1.8" />
        <polygon points="240,106 294,108 328,126 272,126" fill={bodyFill} stroke="#1c1917" strokeWidth="1.8" />
        <polygon points="294,108 328,126 328,156 294,146" fill="#0f172a" stroke={chromeStroke} strokeWidth="1.8" />
        <circle cx="330" cy="126" r="6" fill="#fef08a" stroke={chromeStroke} strokeWidth="1" />
        <circle cx="292" cy="114" r="5" fill="#fef08a" stroke={chromeStroke} strokeWidth="1" />
      </g>
    );
  }

  // =========================================================================
  // DECADE 7: 1970-1979 (MALAISE ERA, WEDGE & IMPACT BUMPERS)
  // Black radial tires, rallye mag dishes, 5-mph impact bumpers, opera windows
  // =========================================================================
  if (decade === 7) {
    if (segment === "utility") {
      // Squarebody Heavy Pickup Truck (chiselled boxy lines, double-stacked rectangular headlamps)
      return (
        <g id="body-d7-utility">
          {/* Chiselled squarebody cargo bed */}
          <polygon points="68,146 68,108 190,106 190,154 144,158 124,136 104,155" fill={bodyFill} stroke="#1c1917" strokeWidth="2" />
          <polygon points="190,66 238,64 256,104 190,106" fill={glassFill} stroke="#1c1917" strokeWidth="1.8" />
          <polygon points="190,106 256,104 258,156 190,154" fill={bodyFill} stroke="#1c1917" strokeWidth="2" />
          {/* Flat chiselled hood with horizontal character line */}
          <polygon points="256,104 306,106 342,128 276,126" fill={bodyFill} stroke="#1c1917" strokeWidth="2" />
          {/* Eggcrate grille with double-stacked rectangular headlamps */}
          <polygon points="306,106 342,128 342,160 306,148" fill="#0f172a" stroke={chromeStroke} strokeWidth="2" />
          {/* Stacked rectangular headlamps */}
          <rect x="338" y="122" width="7" height="5" fill="#fef08a" stroke="#475569" strokeWidth="0.8" />
          <rect x="338" y="129" width="7" height="5" fill="#fef08a" stroke="#475569" strokeWidth="0.8" />
          <rect x="300" y="112" width="6" height="4.5" fill="#fef08a" stroke="#475569" strokeWidth="0.8" />
          <rect x="300" y="118" width="6" height="4.5" fill="#fef08a" stroke="#475569" strokeWidth="0.8" />
          {/* Massive heavy steel bumper with black rubber impact strip */}
          <line x1="282" y1="152" x2="346" y2="164" stroke="#1c1917" strokeWidth="6" />
          <line x1="282" y1="152" x2="346" y2="164" stroke={chromeStroke} strokeWidth="4" />
        </g>
      );
    }
    if (segment === "luxury") {
      // Personal Luxury Coupe (stand-up vertical die-cast grille, opera window, vinyl half-roof)
      return (
        <g id="body-d7-luxury">
          {/* Padded vinyl landau half-roof with oval opera window */}
          <polygon points="98,114 135,76 218,74 246,106 98,114" fill="#09090b" stroke="#1c1917" strokeWidth="2" />
          {/* Opera window */}
          <ellipse cx="125" cy="94" rx="4" ry="7" fill={glassFill} stroke={chromeStroke} strokeWidth="1" />
          <polygon points="145,80 210,78 238,106 145,108" fill={glassFill} stroke={chromeStroke} strokeWidth="1.2" />
          {/* Long hood / short deck proportions */}
          <path d="M 68,144 L 68,118 L 344,126 L 344,162 L 280,162 Q 220,160 144,158 Q 124,136 104,155 Z" fill={bodyFill} stroke="#1c1917" strokeWidth="2" />
          <polygon points="246,106 306,108 344,128 278,126" fill={bodyFill} stroke="#1c1917" strokeWidth="2" />
          {/* Stand-up tall neoclassical vertical die-cast grille */}
          <polygon points="314,102 338,118 338,154 314,144" fill="#0f172a" stroke={chromeStroke} strokeWidth="2.5" />
          <line x1="322" y1="108" x2="322" y2="148" stroke={chromeStroke} strokeWidth="1.5" />
          <line x1="330" y1="114" x2="330" y2="152" stroke={chromeStroke} strokeWidth="1.5" />
          {/* Stacked rectangular headlights */}
          <rect x="340" y="124" width="6" height="5" fill="#fef08a" stroke="#475569" strokeWidth="0.8" />
          <rect x="340" y="131" width="6" height="5" fill="#fef08a" stroke="#475569" strokeWidth="0.8" />
          {/* 5-mph heavy impact bumper with rubber bumper guards */}
          <line x1="285" y1="152" x2="348" y2="164" stroke={chromeStroke} strokeWidth="5.5" />
          <rect x="336" y="146" width="4" height="14" rx="1" fill="#09090b" />
        </g>
      );
    }
    if (segment === "family") {
      // Malaise Formal Sedan (vinyl landau roof, opera window, 5-mph extruded chrome bumpers)
      return (
        <g id="body-d7-family">
          <polygon points="96,114 132,76 222,74 248,106 96,114" fill="#1c1917" stroke="#334155" strokeWidth="2" />
          <rect x="118" y="90" width="7" height="11" rx="1" fill={glassFill} stroke={chromeStroke} strokeWidth="1" />
          <polygon points="138,80 214,78 240,106 138,108" fill={glassFill} stroke={chromeStroke} strokeWidth="1.2" />
          <path d="M 68,144 L 68,118 L 338,126 L 338,162 L 278,162 Q 220,160 144,158 Q 124,136 104,155 Z" fill={bodyFill} stroke="#1c1917" strokeWidth="2" />
          <polygon points="248,106 304,108 338,128 276,126" fill={bodyFill} stroke="#1c1917" strokeWidth="2" />
          <polygon points="304,108 338,128 338,158 304,146" fill="#0f172a" stroke={chromeStroke} strokeWidth="2" />
          <rect x="340" y="124" width="7" height="6" fill="#fef08a" stroke="#475569" strokeWidth="0.8" />
          <rect x="298" y="112" width="6" height="5" fill="#fef08a" stroke="#475569" strokeWidth="0.8" />
          <line x1="282" y1="152" x2="344" y2="164" stroke={chromeStroke} strokeWidth="5" />
        </g>
      );
    }
    // Economy: 3-Door Liftback Hatchback (crisp wedge front, polyurethane impact bumpers, louvered glass)
    return (
      <g id="body-d7-economy">
        <polygon points="98,118 138,84 218,82 245,108 98,118" fill={bodyFill} stroke="#1c1917" strokeWidth="1.8" />
        <polygon points="144,88 210,86 238,108 144,112" fill={glassFill} stroke="#1c1917" strokeWidth="1.2" />
        {/* Sloping wedge nose */}
        <polygon points="245,108 296,112 330,132 272,128" fill={bodyFill} stroke="#1c1917" strokeWidth="1.8" />
        <path d="M 74,144 L 74,122 L 330,132 L 330,160 L 274,162 Q 220,160 144,158 Q 124,136 104,155 Z" fill={bodyFill} stroke="#1c1917" strokeWidth="1.8" />
        {/* Black polyurethane 5-mph front & rear bumpers */}
        <line x1="68" y1="140" x2="80" y2="142" stroke="#1c1917" strokeWidth="5.5" />
        <line x1="285" y1="150" x2="336" y2="162" stroke="#1c1917" strokeWidth="5.5" />
        <rect x="330" y="128" width="7" height="6" fill="#fef08a" stroke="#1c1917" strokeWidth="1" />
        <rect x="290" y="116" width="6" height="5" fill="#fef08a" stroke="#1c1917" strokeWidth="1" />
      </g>
    );
  }

  // =========================================================================
  // DECADE 8: 1980-1989 (ORIGAMI, WEDGE & TURBO ERA)
  // Sharp angular origami lines, turbofan aero rims, Sacco boards, redline accents
  // =========================================================================
  if (decade === 8) {
    if (segment === "utility") {
      // Turbodiesel Dually Heavy Truck (wide flared dually fenders, cab clearance lights, tubular bed rack)
      return (
        <g id="body-d8-utility">
          {/* Flared dually rear fender box */}
          <polygon points="66,146 66,108 190,106 190,154 144,158 124,136 104,155" fill={bodyFill} stroke="#1c1917" strokeWidth="2" />
          {/* Tubular steel roll bar / bed rack */}
          <line x1="182" y1="72" x2="182" y2="106" stroke="#475569" strokeWidth="3" />
          <line x1="182" y1="72" x2="145" y2="106" stroke="#475569" strokeWidth="3" />
          {/* Square cab with amber roof clearance lights */}
          <polygon points="190,66 238,64 256,104 190,106" fill={glassFill} stroke="#1c1917" strokeWidth="1.8" />
          <circle cx="210" cy="62" r="1.5" fill="#f59e0b" />
          <circle cx="225" cy="61" r="1.5" fill="#f59e0b" />
          <circle cx="240" cy="60" r="1.5" fill="#f59e0b" />
          <polygon points="190,106 256,104 258,156 190,154" fill={bodyFill} stroke="#1c1917" strokeWidth="2" />
          {/* Angular aerodynamic hood */}
          <polygon points="256,104 306,108 344,128 276,126" fill={bodyFill} stroke="#1c1917" strokeWidth="2" />
          {/* Chrome truck grille & twin halogen beams */}
          <polygon points="306,108 344,128 344,160 306,148" fill="#0f172a" stroke={chromeStroke} strokeWidth="2" />
          <rect x="338" y="124" width="8" height="6" fill="#fef08a" stroke="#475569" strokeWidth="0.8" />
          <rect x="300" y="114" width="7" height="5" fill="#fef08a" stroke="#475569" strokeWidth="0.8" />
          <line x1="282" y1="152" x2="346" y2="164" stroke={chromeStroke} strokeWidth="5.5" />
        </g>
      );
    }
    if (segment === "luxury") {
      // Autobahn Executive Flagship Sedan (fluted ribbed lower cladding "Sacco boards", flush headlights)
      return (
        <g id="body-d8-luxury">
          {/* Aerodynamic formal sedan glasshouse */}
          <polygon points="102,112 138,76 226,74 252,104 102,112" fill={bodyFill} stroke="#1c1917" strokeWidth="2" />
          <polygon points="144,80 220,78 244,104 144,108" fill={glassFill} stroke="#0f172a" strokeWidth="1.5" />
          {/* Main body flank */}
          <path d="M 68,144 L 68,116 L 344,124 L 344,160 L 280,162 Q 220,160 144,158 Q 124,136 104,155 Z" fill={bodyFill} stroke="#1c1917" strokeWidth="2" />
          {/* Contrasting grey ribbed lower-body cladding ("Sacco boards") */}
          <polygon points="144,142 276,144 276,160 144,158" fill="#475569" stroke="#1e293b" strokeWidth="1" />
          <line x1="144" y1="148" x2="276" y2="150" stroke="#334155" strokeWidth="1" />
          <line x1="144" y1="154" x2="276" y2="156" stroke="#334155" strokeWidth="1" />
          {/* Sloped aerodynamic hood & flush glass composite headlights */}
          <polygon points="252,104 306,106 344,124 278,124" fill={bodyFill} stroke="#1c1917" strokeWidth="2" />
          <polygon points="306,106 344,124 344,154 306,144" fill="#0f172a" stroke={chromeStroke} strokeWidth="1.8" />
          <polygon points="336,120 348,126 346,136 334,130" fill="#fef08a" stroke="#64748b" strokeWidth="1" />
          <polygon points="298,110 308,114 306,122 296,118" fill="#fef08a" stroke="#64748b" strokeWidth="1" />
          {/* Integrated aerodynamic front bumper */}
          <line x1="282" y1="150" x2="346" y2="160" stroke="#334155" strokeWidth="5.5" />
        </g>
      );
    }
    if (segment === "family") {
      // Aero Wedge 4-Door Sedan (flush aerodynamic headlamps, color-keyed bumpers, trunk lip spoiler)
      return (
        <g id="body-d8-family">
          <polygon points="98,114 135,76 226,74 252,104 98,114" fill={bodyFill} stroke="#1c1917" strokeWidth="2" />
          <polygon points="140,80 220,78 244,104 140,108" fill={glassFill} stroke="#0f172a" strokeWidth="1.5" />
          <path d="M 68,144 L 68,118 L 340,126 L 340,160 L 278,162 Q 220,160 144,158 Q 124,136 104,155 Z" fill={bodyFill} stroke="#1c1917" strokeWidth="2" />
          <polygon points="252,104 304,106 340,126 276,124" fill={bodyFill} stroke="#1c1917" strokeWidth="2" />
          <rect x="334" y="122" width="9" height="7" fill="#fef08a" stroke="#475569" strokeWidth="1" />
          <rect x="296" y="112" width="8" height="6" fill="#fef08a" stroke="#475569" strokeWidth="1" />
          <line x1="280" y1="150" x2="342" y2="162" stroke="#334155" strokeWidth="5" />
        </g>
      );
    }
    // Economy: Origami Hot-Hatch (angular boxy body, red accent grille stripe, chin spoiler, hatch spoiler)
    return (
      <g id="body-d8-economy">
        <polygon points="95,116 132,80 222,78 248,104 95,116" fill={bodyFill} stroke="#1c1917" strokeWidth="1.8" />
        <polygon points="138,84 214,82 240,104 138,108" fill={glassFill} stroke="#0f172a" strokeWidth="1.2" />
        {/* Rear hatch roof spoiler */}
        <line x1="90" y1="112" x2="105" y2="114" stroke="#1c1917" strokeWidth="3" />
        <path d="M 72,144 L 72,120 L 332,128 L 332,160 L 274,162 Q 220,160 144,158 Q 124,136 104,155 Z" fill={bodyFill} stroke="#1c1917" strokeWidth="1.8" />
        <polygon points="248,104 298,108 332,128 272,126" fill={bodyFill} stroke="#1c1917" strokeWidth="1.8" />
        {/* Hot-Hatch Red Accent Grille Stripe */}
        <line x1="298" y1="126" x2="332" y2="136" stroke="#ef4444" strokeWidth="2" />
        <rect x="326" y="124" width="8" height="6" fill="#fef08a" stroke="#1c1917" strokeWidth="1" />
        <rect x="290" y="114" width="7" height="5" fill="#fef08a" stroke="#1c1917" strokeWidth="1" />
        {/* Lower chin airdam spoiler */}
        <line x1="274" y1="156" x2="336" y2="164" stroke="#09090b" strokeWidth="4" />
      </g>
    );
  }

  // =========================================================================
  // DECADE 9: 1990-1999 (BIODESIGN, ORGANIC CURVES & FLUIDITY)
  // Silver monoblock alloy wheels, smooth organic surfaces, projector HID optics
  // =========================================================================
  if (decade === 9) {
    if (segment === "utility") {
      // Rounded Fleetside Sport Truck (aerodynamic contours, color-matched smooth bumper with fog lamps)
      return (
        <g id="body-d9-utility">
          {/* Rounded aerodynamic cargo box */}
          <path d="M 68,146 Q 68,108 100,108 L 190,106 L 190,154 Q 165,156 144,158 Q 124,136 104,155 Z" fill={bodyFill} stroke="#1c1917" strokeWidth="2" />
          <polygon points="190,66 238,64 256,104 190,106" fill={glassFill} stroke="#0f172a" strokeWidth="1.8" />
          <polygon points="190,106 256,104 258,156 190,154" fill={bodyFill} stroke="#1c1917" strokeWidth="2" />
          {/* Rounded contour hood */}
          <polygon points="256,104 306,106 342,128 276,126" fill={bodyFill} stroke="#1c1917" strokeWidth="2" />
          {/* Smooth oval aerodynamic grille */}
          <polygon points="306,106 342,128 342,158 306,146" fill="#0f172a" stroke="#475569" strokeWidth="1.5" />
          {/* Aerodynamic wrap headlamps */}
          <path d="M 334,122 Q 346,128 344,136 L 332,130 Z" fill="#e0f2fe" stroke="#64748b" strokeWidth="1" />
          <path d="M 298,112 Q 308,116 306,122 L 296,118 Z" fill="#e0f2fe" stroke="#64748b" strokeWidth="1" />
          {/* Integrated color-matched bumper with round fog lamps */}
          <line x1="282" y1="150" x2="346" y2="162" stroke={bodyFill} strokeWidth="6" />
          <circle cx="336" cy="158" r="2.5" fill="#fef08a" />
          <circle cx="296" cy="148" r="2" fill="#fef08a" />
        </g>
      );
    }
    if (segment === "luxury") {
      // Flagship Executive Sedan (crystal clear lenses, multi-layer pearl paint, whisper-quiet greenhouse)
      return (
        <g id="body-d9-luxury">
          {/* Organic aerodynamic greenhouse */}
          <path d="M 104,112 Q 135,74 175,72 L 226,72 Q 242,72 254,104 L 104,112 Z" fill={bodyFill} stroke="#1c1917" strokeWidth="2" />
          <polygon points="144,78 222,76 246,104 144,108" fill={glassFill} stroke="#0f172a" strokeWidth="1.5" />
          {/* Monolithic fluid body side */}
          <path d="M 68,144 Q 68,114 100,114 L 315,116 Q 345,120 345,158 L 280,162 Q 220,160 144,158 Q 124,136 104,155 Z" fill={bodyFill} stroke="#1c1917" strokeWidth="2" />
          <polygon points="254,104 308,106 345,124 278,124" fill={bodyFill} stroke="#1c1917" strokeWidth="2" />
          {/* Crystal clear projector headlamp assemblies */}
          <polygon points="334,120 348,124 346,134 332,128" fill="#e0f2fe" stroke="#38bdf8" strokeWidth="1" />
          <circle cx="340" cy="126" r="2" fill="#38bdf8" />
          <polygon points="296,110 308,112 306,120 294,116" fill="#e0f2fe" stroke="#38bdf8" strokeWidth="1" />
          <circle cx="302" cy="114" r="1.5" fill="#38bdf8" />
          {/* Integrated smooth bumper */}
          <line x1="282" y1="150" x2="348" y2="160" stroke={bodyFill} strokeWidth="6" />
        </g>
      );
    }
    if (segment === "family") {
      // Sleek Aerodynamic Family Sedan (cab-forward design, slim projector lamps, full-width taillight bar)
      return (
        <g id="body-d9-family">
          <path d="M 100,114 Q 130,74 175,72 L 226,72 Q 245,72 254,104 L 100,114 Z" fill={bodyFill} stroke="#1c1917" strokeWidth="2" />
          <polygon points="140,78 220,76 246,104 140,108" fill={glassFill} stroke="#0f172a" strokeWidth="1.5" />
          <path d="M 68,144 Q 68,116 100,116 L 315,118 Q 342,122 342,158 L 278,162 Q 220,160 144,158 Q 124,136 104,155 Z" fill={bodyFill} stroke="#1c1917" strokeWidth="2" />
          <polygon points="254,104 306,106 342,126 276,124" fill={bodyFill} stroke="#1c1917" strokeWidth="2" />
          <polygon points="332,122 344,126 342,134 330,128" fill="#e0f2fe" stroke="#64748b" strokeWidth="1" />
          <polygon points="296,112 306,114 304,120 294,116" fill="#e0f2fe" stroke="#64748b" strokeWidth="1" />
          <line x1="280" y1="150" x2="344" y2="160" stroke={bodyFill} strokeWidth="5.5" />
        </g>
      );
    }
    // Economy: Biodesign Bubble Hatchback (smooth oval jellybean body, integrated bumpers, cat-eye lamps)
    return (
      <g id="body-d9-economy">
        <path d="M 98,116 Q 130,76 170,76 L 222,76 Q 240,76 250,104 L 98,116 Z" fill={bodyFill} stroke="#1c1917" strokeWidth="1.8" />
        <polygon points="138,82 216,80 242,104 138,108" fill={glassFill} stroke="#0f172a" strokeWidth="1.2" />
        <path d="M 72,144 Q 72,120 98,120 L 310,120 Q 334,124 334,158 L 274,162 Q 220,160 144,158 Q 124,136 104,155 Z" fill={bodyFill} stroke="#1c1917" strokeWidth="1.8" />
        <polygon points="250,104 300,108 334,128 272,126" fill={bodyFill} stroke="#1c1917" strokeWidth="1.8" />
        {/* Cat-eye smooth headlights */}
        <ellipse cx="328" cy="128" rx="6" ry="4" fill="#e0f2fe" stroke="#64748b" strokeWidth="1" />
        <ellipse cx="292" cy="116" rx="5" ry="3.5" fill="#e0f2fe" stroke="#64748b" strokeWidth="1" />
      </g>
    );
  }

  // =========================================================================
  // DECADE 10: 2000-2009 (NEW EDGE & HIGH-TECH OPTICS)
  // Sharp intersecting creases, clear multi-reflector optics, twin-spoke alloys
  // =========================================================================
  if (decade === 10) {
    if (segment === "utility") {
      // Super-Duty Crew Cab Truck (massive multi-beam composite headlights, honeycombed grille, 4 doors)
      return (
        <g id="body-d10-utility">
          <polygon points="68,146 68,106 180,104 180,154 144,158 124,136 104,155" fill={bodyFill} stroke="#1c1917" strokeWidth="2" />
          {/* 4-door crew cab */}
          <polygon points="180,64 238,62 258,104 180,106" fill={glassFill} stroke="#0f172a" strokeWidth="1.8" />
          <line x1="210" y1="64" x2="210" y2="154" stroke="#1c1917" strokeWidth="2" />
          <polygon points="180,106 258,104 260,156 180,154" fill={bodyFill} stroke="#1c1917" strokeWidth="2" />
          {/* Imposing tall hood */}
          <polygon points="258,104 308,106 345,128 276,126" fill={bodyFill} stroke="#1c1917" strokeWidth="2" />
          {/* Honeycomb heavy-duty grille with chrome surround */}
          <polygon points="308,106 345,128 345,160 308,148" fill="#0f172a" stroke={chromeStroke} strokeWidth="2" />
          {/* Multi-beam composite headlights */}
          <rect x="338" y="122" width="9" height="12" fill="#e0f2fe" stroke="#64748b" strokeWidth="1" />
          <rect x="300" y="112" width="7" height="10" fill="#e0f2fe" stroke="#64748b" strokeWidth="1" />
          <line x1="282" y1="152" x2="348" y2="164" stroke={chromeStroke} strokeWidth="6" />
        </g>
      );
    }
    if (segment === "luxury") {
      // High-Performance Executive Sedan (bi-xenon headlights, triple lower air intakes, flared arches)
      return (
        <g id="body-d10-luxury">
          <path d="M 104,112 Q 135,72 178,70 L 228,70 Q 244,70 256,104 L 104,112 Z" fill={bodyFill} stroke="#1c1917" strokeWidth="2" />
          <polygon points="144,76 222,74 248,104 144,108" fill={glassFill} stroke="#0f172a" strokeWidth="1.5" />
          <path d="M 68,144 Q 68,114 100,114 L 315,116 Q 346,120 346,158 L 280,162 Q 220,160 144,158 Q 124,136 104,155 Z" fill={bodyFill} stroke="#1c1917" strokeWidth="2" />
          <polygon points="256,104 308,106 346,124 278,124" fill={bodyFill} stroke="#1c1917" strokeWidth="2" />
          {/* Clear multi-reflector bi-xenon headlights */}
          <polygon points="334,120 350,124 348,136 332,130" fill="#bae6fd" stroke="#0284c7" strokeWidth="1.2" />
          <circle cx="342" cy="128" r="2.5" fill="#38bdf8" />
          <polygon points="296,110 308,112 306,122 294,118" fill="#bae6fd" stroke="#0284c7" strokeWidth="1.2" />
          <circle cx="302" cy="116" r="2" fill="#38bdf8" />
          {/* Triple aggressive lower air intakes */}
          <rect x="332" y="148" width="12" height="6" rx="1" fill="#020617" />
          <rect x="312" y="144" width="14" height="6" rx="1" fill="#020617" />
        </g>
      );
    }
    if (segment === "family") {
      // Midsize Sports Sedan (high-waisted muscular stance, swept jewel headlights, clear taillights)
      return (
        <g id="body-d10-family">
          <path d="M 100,114 Q 130,72 175,70 L 226,70 Q 245,70 255,104 L 100,114 Z" fill={bodyFill} stroke="#1c1917" strokeWidth="2" />
          <polygon points="140,76 220,74 246,104 140,108" fill={glassFill} stroke="#0f172a" strokeWidth="1.5" />
          <path d="M 68,144 Q 68,114 100,114 L 315,116 Q 342,120 342,158 L 278,162 Q 220,160 144,158 Q 124,136 104,155 Z" fill={bodyFill} stroke="#1c1917" strokeWidth="2" />
          <polygon points="255,104 306,106 342,126 276,124" fill={bodyFill} stroke="#1c1917" strokeWidth="2" />
          <polygon points="332,122 346,126 344,136 330,130" fill="#bae6fd" stroke="#0284c7" strokeWidth="1" />
          <polygon points="296,112 306,114 304,122 294,118" fill="#bae6fd" stroke="#0284c7" strokeWidth="1" />
          <line x1="280" y1="150" x2="344" y2="160" stroke={bodyFill} strokeWidth="5.5" />
        </g>
      );
    }
    // Economy: New Edge Sport Compact (intersecting sharp creases & tense curves, triangular headlights)
    return (
      <g id="body-d10-economy">
        <polygon points="98,116 132,74 222,72 250,104 98,116" fill={bodyFill} stroke="#1c1917" strokeWidth="1.8" />
        <polygon points="138,78 216,76 242,104 138,108" fill={glassFill} stroke="#0f172a" strokeWidth="1.2" />
        <path d="M 72,144 L 72,118 L 334,124 L 334,158 L 274,162 Q 220,160 144,158 Q 124,136 104,155 Z" fill={bodyFill} stroke="#1c1917" strokeWidth="1.8" />
        <polygon points="250,104 300,106 334,126 272,124" fill={bodyFill} stroke="#1c1917" strokeWidth="1.8" />
        {/* Sharp triangular New Edge headlights */}
        <polygon points="326,122 338,126 334,136 324,130" fill="#bae6fd" stroke="#0284c7" strokeWidth="1" />
        <polygon points="290,112 300,114 298,122 288,118" fill="#bae6fd" stroke="#0284c7" strokeWidth="1" />
      </g>
    );
  }

  // =========================================================================
  // DECADE 11: 2010-2019 (KINETIC SCULPTING, LED & SPINDLE/HEX GRILLES)
  // Low-profile tires, diamond-cut bi-color alloys, signature LED DRL blades
  // =========================================================================
  if (decade === 11) {
    if (segment === "utility") {
      // Modern Heavy Duty Trail Boss (massive vertical front presence, dual-tier C-shaped LED lighting)
      return (
        <g id="body-d11-utility">
          <polygon points="68,146 68,104 180,102 180,154 144,158 124,136 104,155" fill={bodyFill} stroke="#1c1917" strokeWidth="2" />
          <polygon points="180,62 238,60 258,102 180,104" fill={glassFill} stroke="#0f172a" strokeWidth="1.8" />
          <polygon points="180,104 258,102 260,156 180,154" fill={bodyFill} stroke="#1c1917" strokeWidth="2" />
          <polygon points="258,102 310,104 348,126 276,124" fill={bodyFill} stroke="#1c1917" strokeWidth="2" />
          <polygon points="310,104 348,126 348,160 310,148" fill="#0f172a" stroke="#475569" strokeWidth="2" />
          {/* C-shaped signature LED daytime running light bracket */}
          <path d="M 346,120 L 340,120 L 340,138 L 346,138" stroke="#38bdf8" strokeWidth="2.5" fill="none" />
          <path d="M 308,110 L 304,110 L 304,124 L 308,124" stroke="#38bdf8" strokeWidth="2" fill="none" />
          <line x1="282" y1="152" x2="350" y2="164" stroke="#1e293b" strokeWidth="6" />
        </g>
      );
    }
    if (segment === "luxury") {
      // Flagship Grand Coupe (adaptive matrix full-LED headlights, side air breather vents, panoramic roof)
      return (
        <g id="body-d11-luxury">
          {/* Flowing four-door grand coupe silhouette */}
          <path d="M 104,112 Q 135,70 180,68 L 230,68 Q 246,68 258,102 L 104,112 Z" fill={bodyFill} stroke="#1c1917" strokeWidth="2" />
          <polygon points="144,74 224,72 250,102 144,106" fill={glassFill} stroke="#0f172a" strokeWidth="1.5" />
          <path d="M 68,144 Q 68,112 100,112 L 315,114 Q 348,118 348,158 L 280,162 Q 220,160 144,158 Q 124,136 104,155 Z" fill={bodyFill} stroke="#1c1917" strokeWidth="2" />
          {/* Front fender air breather vent */}
          <path d="M 276,140 L 272,148 L 276,148" stroke="#38bdf8" strokeWidth="2" fill="none" />
          <polygon points="258,102 310,104 348,122 278,122" fill={bodyFill} stroke="#1c1917" strokeWidth="2" />
          {/* Razor-sharp adaptive matrix LED blade headlights */}
          <polygon points="334,118 350,122 346,132 332,126" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" />
          <line x1="335" y1="120" x2="350" y2="124" stroke="#ffffff" strokeWidth="2" />
          <polygon points="296,108 308,110 304,118 294,114" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" />
          <line x1="297" y1="110" x2="308" y2="112" stroke="#ffffff" strokeWidth="1.5" />
        </g>
      );
    }
    if (segment === "family") {
      // Fastback Crossover / Coupe SUV (hexagonal 3D mesh grille, slim LED eyebrow lights, skidplate)
      return (
        <g id="body-d11-family">
          <path d="M 100,114 Q 130,70 175,68 L 226,68 Q 245,68 256,102 L 100,114 Z" fill={bodyFill} stroke="#1c1917" strokeWidth="2" />
          <polygon points="140,74 220,72 248,102 140,106" fill={glassFill} stroke="#0f172a" strokeWidth="1.5" />
          <path d="M 68,144 Q 68,112 100,112 L 315,114 Q 344,118 344,158 L 278,162 Q 220,160 144,158 Q 124,136 104,155 Z" fill={bodyFill} stroke="#1c1917" strokeWidth="2" />
          <polygon points="256,102 308,104 344,124 276,122" fill={bodyFill} stroke="#1c1917" strokeWidth="2" />
          <polygon points="308,104 344,124 344,156 308,146" fill="#0f172a" stroke="#475569" strokeWidth="1.5" />
          <line x1="334" y1="120" x2="348" y2="124" stroke="#38bdf8" strokeWidth="2.5" />
          <line x1="296" y1="110" x2="308" y2="112" stroke="#38bdf8" strokeWidth="2" />
        </g>
      );
    }
    // Economy: Kinetic Sculpted Hatchback (faceted bumper, LED DRL fangs, floating roof C-pillar)
    return (
      <g id="body-d11-economy">
        <polygon points="98,116 132,72 222,70 250,102 98,116" fill={bodyFill} stroke="#1c1917" strokeWidth="1.8" />
        <polygon points="138,76 216,74 242,102 138,106" fill={glassFill} stroke="#0f172a" strokeWidth="1.2" />
        {/* Blackened floating C-pillar */}
        <polygon points="125,76 135,74 130,110 120,112" fill="#09090b" />
        <path d="M 72,144 L 72,116 L 334,122 L 334,158 L 274,162 Q 220,160 144,158 Q 124,136 104,155 Z" fill={bodyFill} stroke="#1c1917" strokeWidth="1.8" />
        <polygon points="250,102 300,104 334,124 272,122" fill={bodyFill} stroke="#1c1917" strokeWidth="1.8" />
        {/* Kinetic LED DRL Fang */}
        <path d="M 340,122 L 330,124 L 332,136" stroke="#38bdf8" strokeWidth="2" fill="none" />
      </g>
    );
  }

  // =========================================================================
  // DECADE 12: 2020s+ (ELECTRIC CYBER, HORIZON LIGHTBARS & MINIMALIST CLEAN)
  // Low-profile aero-blade EV rims, full-width horizon LED lightbars, digital masks
  // =========================================================================
  if (segment === "utility") {
    // Cyber EV Tactical Pickup (monolithic planar faceted bodywork, full-width white LED lightbar)
    return (
      <g id="body-d12-utility">
        {/* Planar faceted angular bodywork */}
        <polygon points="68,146 68,96 175,94 235,60 285,96 348,116 348,160 276,162 255,140 235,162 144,158 124,136 104,155" fill={bodyFill} stroke="#38bdf8" strokeWidth="1.5" />
        <polygon points="182,94 232,64 278,94" fill={glassFill} stroke="#0f172a" strokeWidth="1.5" />
        {/* Full-width front horizon cyber LED light bar */}
        <line x1="285" y1="96" x2="348" y2="116" stroke="#ffffff" strokeWidth="3" />
        <line x1="285" y1="96" x2="348" y2="116" stroke="#38bdf8" strokeWidth="5" opacity="0.4" />
        {/* Cyber rear red taillight blade */}
        <line x1="68" y1="96" x2="72" y2="96" stroke="#ef4444" strokeWidth="3" />
      </g>
    );
  }
  if (segment === "luxury") {
    // Ultra-Luxury Electric Grand Tourer (interactive illuminated digital mask, active splitters, smart roof)
    return (
      <g id="body-d12-luxury">
        <path d="M 104,112 Q 135,66 182,64 L 232,64 Q 248,64 260,98 L 104,112 Z" fill={bodyFill} stroke="#38bdf8" strokeWidth="1.8" />
        <polygon points="144,70 226,68 252,98 144,102" fill={glassFill} stroke="#0f172a" strokeWidth="1.5" />
        <path d="M 68,144 Q 68,110 100,110 L 315,110 Q 350,114 350,158 L 280,162 Q 220,160 144,158 Q 124,136 104,155 Z" fill={bodyFill} stroke="#38bdf8" strokeWidth="1.8" />
        <polygon points="260,98 312,100 350,118 280,118" fill={bodyFill} stroke="#38bdf8" strokeWidth="1.8" />
        {/* Interactive full-width horizon LED light blade */}
        <path d="M 306,104 Q 330,108 350,118" stroke="#ffffff" strokeWidth="2.5" fill="none" />
        <path d="M 306,104 Q 330,108 350,118" stroke="#38bdf8" strokeWidth="4.5" fill="none" opacity="0.5" />
        <circle cx="348" cy="118" r="3" fill="#38bdf8" />
      </g>
    );
  }
  if (segment === "family") {
    // Aero Electric Shooting Brake / Crossover (panoramic glass canopy, illuminated light strip)
    return (
      <g id="body-d12-family">
        <path d="M 100,114 Q 130,66 175,64 L 228,64 Q 246,64 258,98 L 100,114 Z" fill={bodyFill} stroke="#38bdf8" strokeWidth="1.5" />
        <polygon points="140,70 222,68 250,98 140,102" fill={glassFill} stroke="#0f172a" strokeWidth="1.5" />
        <path d="M 68,144 Q 68,110 100,110 L 315,112 Q 346,116 346,158 L 278,162 Q 220,160 144,158 Q 124,136 104,155 Z" fill={bodyFill} stroke="#38bdf8" strokeWidth="1.5" />
        <polygon points="258,98 310,100 346,120 276,118" fill={bodyFill} stroke="#38bdf8" strokeWidth="1.5" />
        <line x1="308" y1="104" x2="346" y2="120" stroke="#38bdf8" strokeWidth="2.5" />
      </g>
    );
  }
  // Economy: Urban EV Aero Hatchback (closed smooth aerodynamic shield, horizon lightbar)
  return (
    <g id="body-d12-economy">
      <polygon points="98,116 132,68 222,66 252,98 98,116" fill={bodyFill} stroke="#38bdf8" strokeWidth="1.5" />
      <polygon points="138,72 216,70 244,98 138,102" fill={glassFill} stroke="#0f172a" strokeWidth="1.2" />
      <path d="M 72,144 L 72,112 L 336,118 L 336,158 L 274,162 Q 220,160 144,158 Q 124,136 104,155 Z" fill={bodyFill} stroke="#38bdf8" strokeWidth="1.5" />
      <polygon points="252,98 302,100 336,120 272,118" fill={bodyFill} stroke="#38bdf8" strokeWidth="1.5" />
      <line x1="300" y1="104" x2="336" y2="120" stroke="#38bdf8" strokeWidth="2.5" />
    </g>
  );
}
