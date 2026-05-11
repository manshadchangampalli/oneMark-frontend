interface MascotProps {
  size?: number;
}

export function Mascot({ size = 56 }: MascotProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <defs>
        <linearGradient id="mg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#D4541A" />
          <stop offset="1" stopColor="#E8580C" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="34" r="22" fill="#FFFFFF" className="dark:fill-[#221F18]" />
      <circle cx="32" cy="34" r="22" stroke="#EAE5DA" className="dark:stroke-[#2A2720]" strokeWidth="1" fill="none" />
      <path d="M14 38a18 18 0 0 1 36 0" stroke="url(#mg)" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M22 44 L32 24 L42 44 Z" fill="#1A1815" className="dark:fill-[#F2EEE6]" />
      <rect x="26" y="40" width="12" height="2.5" fill="#FAF7F2" className="dark:fill-[#15140F]" />
      <circle cx="32" cy="14" r="2.4" fill="#D4541A" />
    </svg>
  );
}
