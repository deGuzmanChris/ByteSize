"use client";

// Bitten cookie icon — r=10 circle, bite circle at (8,0) r=6, intersects at (8,±6)
export function CookieIcon({ size = 26 }) {
  return (
    <svg width={size} height={size} viewBox="-11 -11 27 22" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M 8 -6 A 10 10 0 1 0 8 6 A 6 6 0 0 1 8 -6 Z"
        fill="#D4A05C"
        stroke="#A0722A"
        strokeWidth="1"
        strokeLinejoin="round"
      />
      <circle cx="-3" cy="-3" r="1.2" fill="#5C3317" />
      <circle cx="0"  cy="3"  r="1.1" fill="#5C3317" />
      <circle cx="-6" cy="2"  r="1.1" fill="#5C3317" />
      <circle cx="-1" cy="7"  r="1"   fill="#5C3317" />
      <circle cx="3"  cy="5"  r="1"   fill="#5C3317" />
      <circle cx="-6" cy="-7" r="1.1" fill="#5C3317" />
    </svg>
  );
}

// Full-screen tiled cookie background with diagonal gradient.
// id prop keeps SVG defs unique if ever used across contexts.
export function CookieBackground({ darkMode, id = "default" }) {
  const cookieFill   = darkMode ? "rgba(74,92,56,0.14)"  : "rgba(137,152,109,0.11)";
  const cookieStroke = darkMode ? "rgba(74,92,56,0.22)"  : "rgba(100,120,70,0.16)";
  const chipFill     = darkMode ? "rgba(50,70,35,0.18)"  : "rgba(80,100,50,0.13)";
  const gradFrom     = darkMode ? "#1e1e1e"               : "#F6F0D7";
  const gradTo       = darkMode ? "#232820"               : "#dbd2ae";

  const gradId    = `bgGrad-${id}`;
  const patternId = `cp-${id}`;

  return (
    <svg
      className="absolute inset-0 w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
      style={{ pointerEvents: "none" }}
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"   stopColor={gradFrom} />
          <stop offset="100%" stopColor={gradTo}   />
        </linearGradient>
        {/* 80×80 tile: one cookie at +45°, one at -45° */}
        <pattern id={patternId} x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
          <g transform="translate(20,20) rotate(45)">
            <path d="M 8 -6 A 10 10 0 1 0 8 6 A 6 6 0 0 1 8 -6 Z"
              fill={cookieFill} stroke={cookieStroke} strokeWidth="0.7" />
            <circle cx="-3" cy="-2" r="1"   fill={chipFill} />
            <circle cx="0"  cy="3"  r="0.9" fill={chipFill} />
            <circle cx="-6" cy="2"  r="0.9" fill={chipFill} />
            <circle cx="-1" cy="6"  r="0.8" fill={chipFill} />
          </g>
          <g transform="translate(60,60) rotate(-45)">
            <path d="M 8 -6 A 10 10 0 1 0 8 6 A 6 6 0 0 1 8 -6 Z"
              fill={cookieFill} stroke={cookieStroke} strokeWidth="0.7" />
            <circle cx="-3" cy="-2" r="1"   fill={chipFill} />
            <circle cx="0"  cy="3"  r="0.9" fill={chipFill} />
            <circle cx="-6" cy="2"  r="0.9" fill={chipFill} />
            <circle cx="-1" cy="6"  r="0.8" fill={chipFill} />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${gradId})`} />
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
}
