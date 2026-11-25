import React from 'react';

/**
 * Bundled inline SVG hero illustration for the Home page (#/home).
 * Matches the navy-to-teal architectural aesthetic of the Central Library card
 * with zero external image dependencies, instant first-paint rendering, and no layout shift.
 */
export const HomeHeroIllustration: React.FC = () => {
  return (
    <div
      role="img"
      aria-label="Illustrated view of campus academic buildings, library wing, and landscaped walkways"
      className="w-full h-full relative bg-gradient-to-br from-[#0B1D3A] via-[#153463] to-[#0F6472] flex items-center justify-center overflow-hidden select-none"
    >
      <svg
        viewBox="0 0 460 320"
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full block"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="homeHeroSkyGlow" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.26" />
            <stop offset="100%" stopColor="#2DD4BF" stopOpacity="0.06" />
          </linearGradient>
          <linearGradient id="homeHeroSunGlow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FDE68A" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="homeHeroLawn" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#0D4F5C" stopOpacity="0.7" />
            <stop offset="50%" stopColor="#0F766E" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#0B3B4E" stopOpacity="0.7" />
          </linearGradient>
        </defs>

        {/* Soft ambient sky glows */}
        <circle cx="380" cy="64" r="96" fill="url(#homeHeroSkyGlow)" />
        <circle cx="110" cy="54" r="72" fill="url(#homeHeroSunGlow)" />

        {/* Subtle geometric sky rings */}
        <circle cx="380" cy="64" r="54" fill="none" stroke="#7DD3FC" strokeOpacity="0.16" strokeWidth="1.25" />
        <circle cx="380" cy="64" r="32" fill="none" stroke="#5EEAD4" strokeOpacity="0.2" strokeWidth="1.25" strokeDasharray="4 4" />

        {/* Distant horizon hills / skyline contour */}
        <path
          d="M 0 218 Q 115 196 230 212 T 460 206 V 320 H 0 Z"
          fill="#091A33"
          fillOpacity="0.55"
        />

        {/* Left wing — Library & Reading Hall */}
        <g>
          <rect x="28" y="138" width="114" height="84" rx="6" fill="#0B1F3A" stroke="#7DD3FC" strokeOpacity="0.5" strokeWidth="1.6" />
          <rect x="24" y="132" width="122" height="8" rx="3" fill="#13335C" stroke="#38BDF8" strokeOpacity="0.45" strokeWidth="1.2" />
          {/* Tall reading room windows */}
          {[0, 1, 2, 3].map((col) => (
            <React.Fragment key={`lib-win-${col}`}>
              <rect
                x={42 + col * 24}
                y="150"
                width="14"
                height="24"
                rx="2.5"
                fill={col === 1 ? '#FDE047' : '#38BDF8'}
                fillOpacity={col === 1 ? '0.82' : '0.45'}
              />
              <rect
                x={42 + col * 24}
                y="184"
                width="14"
                height="24"
                rx="2.5"
                fill={col === 2 ? '#5EEAD4' : '#93C5FD'}
                fillOpacity={col === 2 ? '0.78' : '0.35'}
              />
            </React.Fragment>
          ))}
        </g>

        {/* Right wing — Residential & Student Hub Block */}
        <g>
          <rect x="318" y="126" width="116" height="96" rx="6" fill="#0B1F3A" stroke="#5EEAD4" strokeOpacity="0.5" strokeWidth="1.6" />
          <rect x="314" y="120" width="124" height="8" rx="3" fill="#13335C" stroke="#2DD4BF" strokeOpacity="0.5" strokeWidth="1.2" />
          {[0, 1, 2].map((row) =>
            [0, 1, 2].map((col) => (
              <rect
                key={`res-win-${row}-${col}`}
                x={334 + col * 32}
                y={138 + row * 24}
                width="20"
                height="13"
                rx="2.5"
                fill={
                  row === 0 && col === 2
                    ? '#FBBF24'
                    : (row + col) % 2 === 0
                    ? '#5EEAD4'
                    : '#7DD3FC'
                }
                fillOpacity={
                  row === 0 && col === 2
                    ? '0.85'
                    : (row + col) % 2 === 0
                    ? '0.68'
                    : '0.35'
                }
              />
            ))
          )}
        </g>

        {/* Center Main Academic Hall */}
        <g>
          {/* Upper cupola / clock tower */}
          <rect x="206" y="66" width="48" height="32" rx="4" fill="#0F294A" stroke="#7DD3FC" strokeOpacity="0.55" strokeWidth="1.5" />
          <path d="M 198 66 L 230 44 L 262 66 Z" fill="#13335C" stroke="#5EEAD4" strokeOpacity="0.65" strokeWidth="1.5" strokeLinejoin="round" />
          <circle cx="230" cy="82" r="9" fill="#0B192C" stroke="#FBBF24" strokeOpacity="0.85" strokeWidth="1.6" />
          <path d="M 230 77 V 82 L 234 84" fill="none" stroke="#FDE68A" strokeWidth="1.5" strokeLinecap="round" />

          {/* Main academic building body */}
          <rect x="148" y="98" width="164" height="124" rx="7" fill="#0F294A" stroke="#7DD3FC" strokeOpacity="0.6" strokeWidth="1.75" />
          <rect x="142" y="92" width="176" height="8" rx="3" fill="#183D6E" stroke="#38BDF8" strokeOpacity="0.55" strokeWidth="1.2" />

          {/* Second-floor arched windows */}
          {[0, 1, 2, 3, 4].map((col) => (
            <rect
              key={`main-top-${col}`}
              x={162 + col * 29}
              y="112"
              width="18"
              height="26"
              rx="4"
              fill={col === 2 ? '#FBBF24' : '#38BDF8'}
              fillOpacity={col === 2 ? '0.82' : '0.45'}
            />
          ))}

          {/* First-floor windows flanking central entrance */}
          <rect x="162" y="152" width="18" height="24" rx="3" fill="#5EEAD4" fillOpacity="0.65" />
          <rect x="191" y="152" width="18" height="24" rx="3" fill="#93C5FD" fillOpacity="0.4" />
          <rect x="251" y="152" width="18" height="24" rx="3" fill="#93C5FD" fillOpacity="0.4" />
          <rect x="280" y="152" width="18" height="24" rx="3" fill="#5EEAD4" fillOpacity="0.65" />

          {/* Central arched portico & entrance */}
          <path
            d="M 213 222 V 168 A 17 17 0 0 1 247 168 V 222 Z"
            fill="#071426"
            stroke="#5EEAD4"
            strokeOpacity="0.75"
            strokeWidth="1.8"
          />
          <path
            d="M 220 222 V 176 A 10 10 0 0 1 240 176 V 222 Z"
            fill="#38BDF8"
            fillOpacity="0.22"
          />
          {/* Portico steps */}
          <rect x="200" y="216" width="60" height="6" rx="2" fill="#38BDF8" fillOpacity="0.4" />
        </g>

        {/* Ground plane, campus lawn & central walkway */}
        <rect x="0" y="222" width="460" height="98" fill="url(#homeHeroLawn)" />
        <line x1="16" y1="222" x2="444" y2="222" stroke="#7DD3FC" strokeOpacity="0.45" strokeWidth="1.75" />

        {/* Perspective walkway leading from portico */}
        <path
          d="M 212 222 L 248 222 L 296 320 L 164 320 Z"
          fill="#0B1F3A"
          fillOpacity="0.62"
          stroke="#5EEAD4"
          strokeOpacity="0.3"
          strokeWidth="1.2"
        />
        <line x1="230" y1="230" x2="230" y2="306" stroke="#38BDF8" strokeOpacity="0.35" strokeWidth="2" strokeDasharray="6 6" />

        {/* Stylized campus trees */}
        <g>
          <rect x="76" y="218" width="4" height="14" rx="1.5" fill="#1E293B" />
          <circle cx="78" cy="208" r="14" fill="#14B8A6" fillOpacity="0.72" stroke="#99F6E4" strokeOpacity="0.45" strokeWidth="1.2" />
          <rect x="116" y="222" width="4" height="12" rx="1.5" fill="#1E293B" />
          <circle cx="118" cy="214" r="11" fill="#0D9488" fillOpacity="0.82" stroke="#5EEAD4" strokeOpacity="0.4" strokeWidth="1.2" />

          <rect x="342" y="220" width="4" height="14" rx="1.5" fill="#1E293B" />
          <circle cx="344" cy="211" r="12" fill="#0D9488" fillOpacity="0.8" stroke="#5EEAD4" strokeOpacity="0.45" strokeWidth="1.2" />
          <rect x="384" y="216" width="4" height="16" rx="1.5" fill="#1E293B" />
          <circle cx="386" cy="205" r="15" fill="#14B8A6" fillOpacity="0.72" stroke="#99F6E4" strokeOpacity="0.45" strokeWidth="1.2" />
        </g>

        {/* Floating hub indicator motifs (Book, Compass, Chat) */}
        <g transform="translate(52, 46)">
          <rect x="0" y="0" width="54" height="36" rx="8" fill="#0B1F3A" fillOpacity="0.88" stroke="#7DD3FC" strokeOpacity="0.55" strokeWidth="1.4" />
          <path d="M 13 24 Q 20 19 27 24 Q 34 19 41 24 V 13 Q 34 9 27 13 Q 20 9 13 13 Z" fill="#E0F2FE" fillOpacity="0.88" />
          <line x1="27" y1="13" x2="27" y2="24" stroke="#0F172A" strokeWidth="1.4" />
        </g>

        <g transform="translate(352, 46)">
          <rect x="0" y="0" width="54" height="36" rx="8" fill="#0B1F3A" fillOpacity="0.88" stroke="#5EEAD4" strokeOpacity="0.55" strokeWidth="1.4" />
          <circle cx="27" cy="18" r="10" fill="none" stroke="#5EEAD4" strokeWidth="1.6" />
          <polygon points="27,11 30,18 27,25 24,18" fill="#FBBF24" />
        </g>
      </svg>

      {/* Bottom caption scrim */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#081529]/90 via-[#081529]/45 to-transparent px-5 pb-4 pt-10 pointer-events-none">
        <div className="text-xs text-slate-200 leading-snug">
          <span className="font-semibold text-white block">Student Information Hub</span>
          <span className="text-teal-200/90">Designed for GLA University students</span>
        </div>
      </div>
    </div>
  );
};

/**
 * Bundled inline SVG hero illustration for the Student Activities & Interest Areas page (#/clubs).
 * Depicts generic student interest areas (coding, photography/media, music/arts, literary/books, sports)
 * in the same navy/teal visual system as the Central Library card.
 */
export const ActivitiesHeroIllustration: React.FC = () => {
  return (
    <div
      role="img"
      aria-label="Illustration representing student interest areas including coding, media, arts, reading, and sports"
      className="w-full h-full relative bg-gradient-to-br from-[#0B1D3A] via-[#153463] to-[#0F6472] flex items-center justify-center overflow-hidden select-none"
    >
      <svg
        viewBox="0 0 400 220"
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full block"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="actHeroGlow" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.26" />
            <stop offset="100%" stopColor="#2DD4BF" stopOpacity="0.08" />
          </linearGradient>
        </defs>

        {/* Ambient radial glow */}
        <circle cx="330" cy="40" r="76" fill="url(#actHeroGlow)" />
        <circle cx="72" cy="184" r="64" fill="url(#actHeroGlow)" />

        {/* Subtle connecting activity arcs */}
        <path
          d="M 102 82 Q 200 32 298 82"
          fill="none"
          stroke="#5EEAD4"
          strokeOpacity="0.32"
          strokeWidth="1.5"
          strokeDasharray="5 5"
        />
        <path
          d="M 118 148 Q 200 176 286 144"
          fill="none"
          stroke="#7DD3FC"
          strokeOpacity="0.28"
          strokeWidth="1.5"
          strokeDasharray="5 5"
        />

        {/* Card 1 (Top-Left): Technical & Coding Workstation */}
        <g transform="translate(34, 30)">
          <rect x="0" y="0" width="114" height="72" rx="10" fill="#0B1F3A" stroke="#7DD3FC" strokeOpacity="0.58" strokeWidth="1.7" />
          {/* Window chrome dots */}
          <circle cx="14" cy="12" r="2.5" fill="#FBBF24" />
          <circle cx="23" cy="12" r="2.5" fill="#2DD4BF" />
          <circle cx="32" cy="12" r="2.5" fill="#38BDF8" />
          <line x1="10" y1="21" x2="104" y2="21" stroke="#38BDF8" strokeOpacity="0.28" strokeWidth="1.2" />
          {/* Code brackets & lines */}
          <path d="M 24 35 L 16 43 L 24 51" fill="none" stroke="#5EEAD4" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 42 35 L 50 43 L 42 51" fill="none" stroke="#5EEAD4" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="35" y1="33" x2="31" y2="53" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" />
          <rect x="60" y="34" width="34" height="5" rx="2.5" fill="#38BDF8" fillOpacity="0.75" />
          <rect x="60" y="44" width="24" height="5" rx="2.5" fill="#93C5FD" fillOpacity="0.55" />
          <rect x="60" y="54" width="38" height="5" rx="2.5" fill="#2DD4BF" fillOpacity="0.65" />
        </g>

        {/* Card 2 (Center-Top): Media & Photography Camera */}
        <g transform="translate(162, 22)">
          <rect x="0" y="10" width="96" height="64" rx="10" fill="#0F294A" stroke="#5EEAD4" strokeOpacity="0.6" strokeWidth="1.7" />
          <path d="M 26 10 L 33 2 H 63 L 70 10 Z" fill="#13335C" stroke="#5EEAD4" strokeOpacity="0.55" strokeWidth="1.4" />
          <circle cx="48" cy="42" r="18" fill="#0B192C" stroke="#7DD3FC" strokeWidth="2" />
          <circle cx="48" cy="42" r="10" fill="#2DD4BF" fillOpacity="0.32" stroke="#5EEAD4" strokeWidth="1.6" />
          <circle cx="44" cy="38" r="3" fill="#E0F2FE" fillOpacity="0.85" />
          <circle cx="78" cy="23" r="3.5" fill="#FBBF24" />
        </g>

        {/* Card 3 (Top-Right): Music & Performing Arts */}
        <g transform="translate(274, 34)">
          <rect x="0" y="0" width="92" height="72" rx="10" fill="#0B1F3A" stroke="#7DD3FC" strokeOpacity="0.55" strokeWidth="1.7" />
          {/* Beamed eighth notes */}
          <path d="M 32 48 V 22 L 62 17 V 43" fill="none" stroke="#5EEAD4" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="32" y1="28" x2="62" y2="23" stroke="#38BDF8" strokeWidth="2" />
          <ellipse cx="26" cy="50" rx="7" ry="5" fill="#FBBF24" />
          <ellipse cx="56" cy="45" rx="7" ry="5" fill="#38BDF8" />
          {/* Subtle sound waves */}
          <path d="M 72 28 Q 78 35 72 42" fill="none" stroke="#93C5FD" strokeOpacity="0.65" strokeWidth="1.8" strokeLinecap="round" />
        </g>

        {/* Card 4 (Bottom-Left): Literary, Reading & Debate */}
        <g transform="translate(64, 118)">
          <rect x="0" y="0" width="124" height="62" rx="10" fill="#0F294A" stroke="#5EEAD4" strokeOpacity="0.52" strokeWidth="1.6" />
          {/* Open book */}
          <path
            d="M 18 44 Q 34 36 50 44 Q 66 36 82 44 V 20 Q 66 14 50 20 Q 34 14 18 20 Z"
            fill="#E0F2FE"
            fillOpacity="0.9"
          />
          <line x1="50" y1="20" x2="50" y2="44" stroke="#0F172A" strokeWidth="1.5" />
          {/* Speech bubble accent */}
          <rect x="90" y="18" width="22" height="16" rx="4" fill="#38BDF8" fillOpacity="0.35" stroke="#7DD3FC" strokeWidth="1.4" />
          <line x1="95" y1="24" x2="107" y2="24" stroke="#E0F2FE" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="95" y1="29" x2="103" y2="29" stroke="#5EEAD4" strokeWidth="1.5" strokeLinecap="round" />
        </g>

        {/* Card 5 (Bottom-Right): Sports & Fitness */}
        <g transform="translate(210, 118)">
          <rect x="0" y="0" width="132" height="62" rx="10" fill="#0B1F3A" stroke="#7DD3FC" strokeOpacity="0.52" strokeWidth="1.6" />
          {/* Mini court lines */}
          <rect x="14" y="13" width="66" height="36" rx="4" fill="#0A2E3F" stroke="#5EEAD4" strokeOpacity="0.55" strokeWidth="1.4" />
          <line x1="47" y1="13" x2="47" y2="49" stroke="#5EEAD4" strokeOpacity="0.55" strokeWidth="1.4" />
          <circle cx="47" cy="31" r="8" fill="none" stroke="#5EEAD4" strokeOpacity="0.65" strokeWidth="1.4" />
          {/* Warm amber ball */}
          <circle cx="104" cy="31" r="14" fill="#FBBF24" fillOpacity="0.9" />
          <path d="M 94 25 Q 104 31 114 25 M 94 37 Q 104 31 114 37" fill="none" stroke="#78350F" strokeWidth="1.4" />
        </g>

        {/* Ground rule */}
        <line x1="20" y1="196" x2="380" y2="196" stroke="#94A3B8" strokeOpacity="0.3" strokeWidth="1.8" />
      </svg>

      {/* Subtle bottom-left category badge matching Central Library card */}
      <span className="absolute bottom-2.5 left-3 px-2.5 py-0.5 rounded-md bg-slate-950/65 text-[11px] font-semibold text-teal-200 backdrop-blur-xs">
        Student Activities · Interest Areas
      </span>
    </div>
  );
};
