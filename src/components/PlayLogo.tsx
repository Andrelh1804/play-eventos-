import React from "react";

interface PlayLogoProps {
  className?: string;
  showReflection?: boolean;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}

export default function PlayLogo({ className = "", showReflection = false, size = "md" }: PlayLogoProps) {
  const dimensions = {
    xs: { width: 90, height: 30 },
    sm: { width: 130, height: 44 },
    md: { width: 190, height: 64 },
    lg: { width: 270, height: 90 },
    xl: { width: 370, height: 124 },
  };

  const { width, height } = dimensions[size];

  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      <svg
        width={width}
        height={height}
        viewBox="0 0 300 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="filter drop-shadow-[0_4px_16px_rgba(234,179,8,0.3)] transition-transform duration-300 hover:scale-[1.03]"
      >
        <defs>
          {/* Golden metallic gradient for letters */}
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF9C4" /> {/* light yellow */}
            <stop offset="25%" stopColor="#FACC15" /> {/* yellow-400 */}
            <stop offset="60%" stopColor="#CA8A04" /> {/* yellow-600 */}
            <stop offset="90%" stopColor="#A16207" /> {/* yellow-700 */}
            <stop offset="100%" stopColor="#713F12" /> {/* yellow-900 */}
          </linearGradient>

          {/* Border gold gradient */}
          <linearGradient id="borderGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#CA8A04" />
            <stop offset="35%" stopColor="#FEF08A" />
            <stop offset="70%" stopColor="#EAB308" />
            <stop offset="100%" stopColor="#854D0E" />
          </linearGradient>

          {/* Pill background gradient - black glossy */}
          <linearGradient id="pillBg" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#27272A" />
            <stop offset="40%" stopColor="#09090B" />
            <stop offset="100%" stopColor="#18181B" />
          </linearGradient>

          {/* Filter for metallic/glow effect */}
          <filter id="goldGlow" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 1. Main outer pill container */}
        <rect
          x="10"
          y="15"
          width="215"
          height="70"
          rx="18"
          fill="url(#pillBg)"
          stroke="url(#borderGrad)"
          strokeWidth="4"
          className="filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.9)]"
        />

        {/* 2. Overlapping inner glass highlight */}
        <path
          d="M 12 45 Q 12 17, 30 17 L 205 17 Q 223 17, 223 45 Q 117 38, 12 45 Z"
          fill="#FFFFFF"
          opacity="0.08"
        />

        {/* 3. Rounded block for '+' on the right */}
        <rect
          x="215"
          y="23"
          width="55"
          height="54"
          rx="14"
          fill="url(#pillBg)"
          stroke="url(#borderGrad)"
          strokeWidth="4"
          className="filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.9)]"
        />
        <path
          d="M 217 45 Q 217 25, 230 25 L 255 25 Q 268 25, 268 45 Q 242 40, 217 45 Z"
          fill="#FFFFFF"
          opacity="0.08"
        />

        {/* 4. Text "PLAY" with custom bold geometric paths */}
        <g filter="url(#goldGlow)">
          {/* Letter P */}
          <path
            d="M 30 35 L 56 35 C 64 35, 68 39, 68 47 C 68 54, 64 59, 56 59 L 43 59 L 43 75 H 30 Z M 43 45 V 50 H 54 C 57 50, 58 48, 58 47 C 58 46, 57 45, 54 45 Z"
            fill="url(#goldGrad)"
            stroke="#09090B"
            strokeWidth="1.2"
          />

          {/* Letter L */}
          <path
            d="M 73 35 H 85 V 65 H 103 V 75 H 73 Z"
            fill="url(#goldGrad)"
            stroke="#09090B"
            strokeWidth="1.2"
          />

          {/* Letter A */}
          <path
            d="M 119 35 L 136 75 H 123 L 120 65 H 109 L 106 75 H 93 Z M 115 47 L 111 56 H 118 Z"
            fill="url(#goldGrad)"
            stroke="#09090B"
            strokeWidth="1.2"
          />

          {/* Letter Y */}
          <path
            d="M 139 35 L 150 55 V 75 H 161 V 55 L 172 35 H 159 L 155 47 L 151 35 Z"
            fill="url(#goldGrad)"
            stroke="#09090B"
            strokeWidth="1.2"
          />

          {/* Plus sign (+) */}
          <path
            d="M 230 50 H 254 M 242 38 V 62"
            stroke="url(#goldGrad)"
            strokeWidth="8.5"
            strokeLinecap="round"
          />
        </g>
      </svg>

      {/* Mirror reflection */}
      {showReflection && (
        <div className="opacity-20 select-none scale-y-[-0.6] blur-[2px] translate-y-[-14px] pointer-events-none">
          <svg
            width={width}
            height={height}
            viewBox="0 0 300 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Same SVG code without heavy glowing filters for lightweight render */}
            <rect x="10" y="15" width="215" height="70" rx="18" fill="url(#pillBg)" stroke="url(#borderGrad)" strokeWidth="4" />
            <rect x="215" y="23" width="55" height="54" rx="14" fill="url(#pillBg)" stroke="url(#borderGrad)" strokeWidth="4" />
            <path d="M 30 35 L 56 35 C 64 35, 68 39, 68 47 C 68 54, 64 59, 56 59 L 43 59 L 43 75 H 30 Z M 43 45 V 50 H 54 C 57 50, 58 48, 58 47 C 58 46, 57 45, 54 45 Z" fill="url(#goldGrad)" />
            <path d="M 73 35 H 85 V 65 H 103 V 75 H 73 Z" fill="url(#goldGrad)" />
            <path d="M 119 35 L 136 75 H 123 L 120 65 H 109 L 106 75 H 93 Z M 115 47 L 111 56 H 118 Z" fill="url(#goldGrad)" />
            <path d="M 139 35 L 150 55 V 75 H 161 V 55 L 172 35 H 159 L 155 47 L 151 35 Z" fill="url(#goldGrad)" />
            <path d="M 230 50 H 254 M 242 38 V 62" stroke="url(#goldGrad)" strokeWidth="8.5" strokeLinecap="round" />
          </svg>
        </div>
      )}
    </div>
  );
}
