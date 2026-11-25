import React from 'react';

interface FacilityVisualProps {
  facilityId: string;
  name: string;
  category: string;
}

/**
 * Crisp, cohesive bundled inline SVG visuals with clear category badges for every
 * campus facility card — guarantees zero blank frames or missing image assets.
 */
export const FacilityVisual: React.FC<FacilityVisualProps> = ({
  facilityId,
  name,
  category,
}) => {
  switch (facilityId) {
    case 'library':
      return (
        <div
          role="img"
          aria-label={`${name} — quiet reading desks, bookshelves, and study spaces`}
          className="w-full h-full relative bg-gradient-to-br from-[#0B1D3A] via-[#153463] to-[#0F6472] flex items-center justify-center overflow-hidden"
        >
          <svg viewBox="0 0 400 180" className="w-full h-full" aria-hidden="true">
            <defs>
              <linearGradient id="libGlow" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.24" />
                <stop offset="100%" stopColor="#2DD4BF" stopOpacity="0.08" />
              </linearGradient>
            </defs>
            <circle cx="336" cy="34" r="68" fill="url(#libGlow)" />
            {/* Bookshelf frame */}
            <rect x="46" y="28" width="166" height="114" rx="8" fill="#0B1F3A" stroke="#7DD3FC" strokeOpacity="0.5" strokeWidth="1.75" />
            <line x1="56" y1="66" x2="202" y2="66" stroke="#38BDF8" strokeOpacity="0.4" strokeWidth="2" />
            <line x1="56" y1="104" x2="202" y2="104" stroke="#38BDF8" strokeOpacity="0.4" strokeWidth="2" />
            {/* Book spines top shelf */}
            <rect x="64" y="38" width="12" height="26" rx="2" fill="#38BDF8" fillOpacity="0.85" />
            <rect x="80" y="42" width="10" height="22" rx="2" fill="#2DD4BF" fillOpacity="0.8" />
            <rect x="94" y="36" width="14" height="28" rx="2" fill="#93C5FD" fillOpacity="0.75" />
            <rect x="112" y="40" width="11" height="24" rx="2" fill="#FBBF24" fillOpacity="0.8" />
            <rect x="128" y="38" width="12" height="26" rx="2" fill="#5EEAD4" fillOpacity="0.7" />
            <rect x="148" y="42" width="14" height="22" rx="2" fill="#60A5FA" fillOpacity="0.75" />
            <rect x="166" y="36" width="12" height="28" rx="2" fill="#2DD4BF" fillOpacity="0.85" />
            {/* Book spines middle shelf */}
            <rect x="64" y="76" width="14" height="26" rx="2" fill="#5EEAD4" fillOpacity="0.8" />
            <rect x="82" y="80" width="12" height="22" rx="2" fill="#60A5FA" fillOpacity="0.75" />
            <rect x="98" y="74" width="11" height="28" rx="2" fill="#FDE047" fillOpacity="0.75" />
            <rect x="114" y="78" width="15" height="24" rx="2" fill="#38BDF8" fillOpacity="0.8" />
            <rect x="134" y="76" width="12" height="26" rx="2" fill="#93C5FD" fillOpacity="0.65" />
            <rect x="152" y="80" width="14" height="22" rx="2" fill="#2DD4BF" fillOpacity="0.85" />
            <rect x="170" y="76" width="12" height="26" rx="2" fill="#38BDF8" fillOpacity="0.7" />
            {/* Open book & reading desk on right */}
            <g transform="translate(236, 52)">
              <rect x="0" y="56" width="116" height="10" rx="4" fill="#334155" />
              <rect x="14" y="66" width="10" height="24" rx="2" fill="#1E293B" />
              <rect x="92" y="66" width="10" height="24" rx="2" fill="#1E293B" />
              <path d="M 18 48 Q 38 38 58 48 Q 78 38 98 48 V 56 H 18 Z" fill="#E0F2FE" fillOpacity="0.92" />
              <line x1="58" y1="48" x2="58" y2="56" stroke="#0F172A" strokeWidth="1.5" />
              {/* Warm reading lamp */}
              <path d="M 86 56 V 24 Q 86 12 72 12 H 58" fill="none" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 46 20 L 58 10 L 68 20 Z" fill="#FBBF24" />
              <ellipse cx="57" cy="36" rx="24" ry="8" fill="#FDE68A" fillOpacity="0.18" />
            </g>
            <line x1="20" y1="154" x2="380" y2="154" stroke="#94A3B8" strokeOpacity="0.35" strokeWidth="2" />
          </svg>
          <span className="absolute bottom-2.5 left-3 px-2.5 py-0.5 rounded-md bg-slate-950/65 text-[11px] font-semibold text-teal-200 backdrop-blur-xs">
            {category} · Reading &amp; Study Spaces
          </span>
        </div>
      );

    case 'sports':
      return (
        <div
          role="img"
          aria-label={`${name} — outdoor courts and athletic recreation spaces`}
          className="w-full h-full relative bg-gradient-to-br from-[#0B2239] via-[#0F4C5C] to-[#115E59] flex items-center justify-center overflow-hidden"
        >
          <svg viewBox="0 0 400 180" className="w-full h-full" aria-hidden="true">
            {/* Stylized court markings */}
            <rect x="44" y="30" width="312" height="114" rx="10" fill="#0A2E3F" stroke="#5EEAD4" strokeOpacity="0.55" strokeWidth="2" />
            <line x1="200" y1="30" x2="200" y2="144" stroke="#5EEAD4" strokeOpacity="0.55" strokeWidth="2" />
            <circle cx="200" cy="87" r="24" fill="none" stroke="#5EEAD4" strokeOpacity="0.65" strokeWidth="2" />
            <path d="M 44 54 H 96 A 33 33 0 0 1 96 120 H 44" fill="none" stroke="#38BDF8" strokeOpacity="0.5" strokeWidth="2" />
            <path d="M 356 54 H 304 A 33 33 0 0 0 304 120 H 356" fill="none" stroke="#38BDF8" strokeOpacity="0.5" strokeWidth="2" />
            <circle cx="200" cy="87" r="9" fill="#F59E0B" />
            <path d="M 193 83 Q 200 87 207 83 M 193 91 Q 200 87 207 91" fill="none" stroke="#78350F" strokeWidth="1.2" />
          </svg>
          <span className="absolute bottom-2.5 left-3 px-2.5 py-0.5 rounded-md bg-slate-950/65 text-[11px] font-semibold text-teal-200 backdrop-blur-xs">
            {category} · Courts &amp; Athletics
          </span>
        </div>
      );

    case 'hostel':
      return (
        <div
          role="img"
          aria-label={`${name} — residential student accommodation blocks`}
          className="w-full h-full relative bg-gradient-to-br from-[#0B1D3A] via-[#183868] to-[#0F5D6B] flex items-center justify-center overflow-hidden"
        >
          <svg viewBox="0 0 400 180" className="w-full h-full" aria-hidden="true">
            <defs>
              <linearGradient id="hostelGlow" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#2DD4BF" stopOpacity="0.08" />
              </linearGradient>
            </defs>
            <circle cx="340" cy="36" r="64" fill="url(#hostelGlow)" />
            <rect x="44" y="54" width="136" height="102" rx="6" fill="#0F294A" stroke="#38BDF8" strokeOpacity="0.45" strokeWidth="1.5" />
            <rect x="196" y="38" width="156" height="118" rx="6" fill="#13335C" stroke="#2DD4BF" strokeOpacity="0.55" strokeWidth="1.5" />
            {[0, 1, 2].map((row) =>
              [0, 1, 2].map((col) => (
                <rect
                  key={`l-${row}-${col}`}
                  x={60 + col * 38}
                  y={70 + row * 24}
                  width="24"
                  height="14"
                  rx="2"
                  fill={row === 0 && col === 1 ? '#FDE047' : '#7DD3FC'}
                  fillOpacity={row === 0 && col === 1 ? '0.85' : '0.35'}
                />
              ))
            )}
            {[0, 1, 2, 3].map((row) =>
              [0, 1, 2, 3].map((col) => (
                <rect
                  key={`r-${row}-${col}`}
                  x={212 + col * 32}
                  y={54 + row * 22}
                  width="20"
                  height="12"
                  rx="2"
                  fill={(row + col) % 3 === 0 ? '#5EEAD4' : '#93C5FD'}
                  fillOpacity={(row + col) % 3 === 0 ? '0.75' : '0.35'}
                />
              ))
            )}
            <line x1="20" y1="156" x2="380" y2="156" stroke="#94A3B8" strokeOpacity="0.4" strokeWidth="2" />
          </svg>
          <span className="absolute bottom-2.5 left-3 px-2.5 py-0.5 rounded-md bg-slate-950/65 text-[11px] font-semibold text-teal-200 backdrop-blur-xs">
            {category} · Double AC &amp; Non-AC
          </span>
        </div>
      );

    case 'travel':
      return (
        <div
          role="img"
          aria-label={`${name} — campus transport guidance`}
          className="w-full h-full relative bg-gradient-to-br from-[#0C223F] via-[#1B4275] to-[#0B6A7A] flex items-center justify-center overflow-hidden"
        >
          <svg viewBox="0 0 400 180" className="w-full h-full" aria-hidden="true">
            <path d="M 32 134 Q 140 128 220 134 T 372 134" fill="none" stroke="#38BDF8" strokeOpacity="0.35" strokeWidth="3" strokeDasharray="8 6" />
            <circle cx="56" cy="134" r="6" fill="#2DD4BF" />
            <circle cx="204" cy="134" r="6" fill="#38BDF8" />
            <circle cx="348" cy="134" r="6" fill="#FBBF24" />
            <g transform="translate(124, 48)">
              <rect x="0" y="0" width="152" height="62" rx="12" fill="#0F294A" stroke="#7DD3FC" strokeWidth="2" />
              <rect x="14" y="12" width="32" height="22" rx="4" fill="#38BDF8" fillOpacity="0.45" />
              <rect x="54" y="12" width="32" height="22" rx="4" fill="#38BDF8" fillOpacity="0.45" />
              <rect x="94" y="12" width="44" height="22" rx="4" fill="#5EEAD4" fillOpacity="0.55" />
              <rect x="0" y="42" width="152" height="6" fill="#2DD4BF" fillOpacity="0.7" />
              <circle cx="34" cy="62" r="11" fill="#0B192C" stroke="#E2E8F0" strokeWidth="3" />
              <circle cx="118" cy="62" r="11" fill="#0B192C" stroke="#E2E8F0" strokeWidth="3" />
            </g>
          </svg>
          <span className="absolute bottom-2.5 left-3 px-2.5 py-0.5 rounded-md bg-slate-950/65 text-[11px] font-semibold text-sky-200 backdrop-blur-xs">
            {category} · Commute Guidance
          </span>
        </div>
      );

    case 'meal-hours':
      return (
        <div
          role="img"
          aria-label={`${name} — student dining and mess support`}
          className="w-full h-full relative bg-gradient-to-br from-[#2B1D14] via-[#4A2E1B] to-[#0F4C5C] flex items-center justify-center overflow-hidden"
        >
          <svg viewBox="0 0 400 180" className="w-full h-full" aria-hidden="true">
            <circle cx="200" cy="88" r="52" fill="#FFFBEB" fillOpacity="0.1" stroke="#FBBF24" strokeOpacity="0.6" strokeWidth="2" />
            <circle cx="200" cy="88" r="34" fill="#FDE68A" fillOpacity="0.16" stroke="#F59E0B" strokeOpacity="0.7" strokeWidth="1.5" />
            <path d="M 118 46 V 126 M 110 46 V 76 M 126 46 V 76 M 110 76 H 126" stroke="#FDE68A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M 282 46 V 126 M 282 46 C 296 52 296 80 282 86" stroke="#5EEAD4" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M 186 78 C 194 68 206 68 214 78" stroke="#FDE68A" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <circle cx="192" cy="96" r="5" fill="#34D399" fillOpacity="0.85" />
            <circle cx="208" cy="94" r="6" fill="#FBBF24" fillOpacity="0.85" />
          </svg>
          <span className="absolute bottom-2.5 left-3 px-2.5 py-0.5 rounded-md bg-slate-950/65 text-[11px] font-semibold text-amber-200 backdrop-blur-xs">
            {category} · Optional Mess Plan
          </span>
        </div>
      );

    case 'health':
      return (
        <div
          role="img"
          aria-label={`${name} — campus medical first-aid assistance`}
          className="w-full h-full relative bg-gradient-to-br from-[#0A2538] via-[#0F4C5C] to-[#115E59] flex items-center justify-center overflow-hidden"
        >
          <svg viewBox="0 0 400 180" className="w-full h-full" aria-hidden="true">
            <rect x="132" y="34" width="136" height="106" rx="16" fill="#0B1F33" fillOpacity="0.7" stroke="#5EEAD4" strokeOpacity="0.5" strokeWidth="2" />
            <rect x="188" y="54" width="24" height="66" rx="4" fill="#2DD4BF" />
            <rect x="167" y="75" width="66" height="24" rx="4" fill="#2DD4BF" />
            <path d="M 36 92 H 96 L 108 70 L 122 112 L 132 92" fill="none" stroke="#99F6E4" strokeOpacity="0.65" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M 268 92 H 294 L 306 72 L 320 112 L 332 92 H 366" fill="none" stroke="#99F6E4" strokeOpacity="0.65" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="absolute bottom-2.5 left-3 px-2.5 py-0.5 rounded-md bg-slate-950/65 text-[11px] font-semibold text-teal-200 backdrop-blur-xs">
            {category} · First-Aid Support
          </span>
        </div>
      );

    case 'labs':
      return (
        <div
          role="img"
          aria-label={`${name} — computer workstations and coding practicals`}
          className="w-full h-full relative bg-gradient-to-br from-[#0B1633] via-[#1E3A8A] to-[#1D4ED8] flex items-center justify-center overflow-hidden"
        >
          <svg viewBox="0 0 400 180" className="w-full h-full" aria-hidden="true">
            <rect x="76" y="32" width="116" height="76" rx="8" fill="#0B192C" stroke="#60A5FA" strokeWidth="2" />
            <rect x="208" y="32" width="116" height="76" rx="8" fill="#0B192C" stroke="#2DD4BF" strokeWidth="2" />
            <path d="M 96 54 H 148 M 96 68 H 170 M 96 82 H 134" stroke="#93C5FD" strokeWidth="3" strokeLinecap="round" />
            <path d="M 228 54 H 284 M 228 68 H 302 M 228 82 H 264" stroke="#5EEAD4" strokeWidth="3" strokeLinecap="round" />
            <rect x="118" y="108" width="32" height="12" rx="2" fill="#475569" />
            <rect x="250" y="108" width="32" height="12" rx="2" fill="#475569" />
            <rect x="64" y="122" width="272" height="8" rx="4" fill="#334155" />
          </svg>
          <span className="absolute bottom-2.5 left-3 px-2.5 py-0.5 rounded-md bg-slate-950/65 text-[11px] font-semibold text-blue-200 backdrop-blur-xs">
            {category} · Computing Workstations
          </span>
        </div>
      );

    case 'services':
    default:
      return (
        <div
          role="img"
          aria-label={`${name} — student helpdesk, ID cards, and campus support`}
          className="w-full h-full relative bg-gradient-to-br from-[#131C3A] via-[#1E3A8A] to-[#0F766E] flex items-center justify-center overflow-hidden"
        >
          <svg viewBox="0 0 400 180" className="w-full h-full" aria-hidden="true">
            <rect x="70" y="42" width="152" height="92" rx="10" fill="#0B192C" stroke="#7DD3FC" strokeOpacity="0.65" strokeWidth="2" />
            <circle cx="106" cy="78" r="14" fill="#2DD4BF" fillOpacity="0.35" stroke="#5EEAD4" strokeWidth="2" />
            <rect x="132" y="66" width="72" height="8" rx="3" fill="#E2E8F0" fillOpacity="0.8" />
            <rect x="132" y="82" width="54" height="6" rx="3" fill="#93C5FD" fillOpacity="0.6" />
            <rect x="92" y="106" width="108" height="10" rx="4" fill="#38BDF8" fillOpacity="0.3" />
            <rect x="240" y="54" width="94" height="68" rx="10" fill="#0F294A" stroke="#5EEAD4" strokeWidth="2" />
            <path d="M 262 88 L 278 102 L 312 72" fill="none" stroke="#2DD4BF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="absolute bottom-2.5 left-3 px-2.5 py-0.5 rounded-md bg-slate-950/65 text-[11px] font-semibold text-teal-200 backdrop-blur-xs">
            {category} · Student Support Desk
          </span>
        </div>
      );
  }
};
