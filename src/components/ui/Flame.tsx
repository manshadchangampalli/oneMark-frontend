interface FlameProps {
  size?: number;
  color?: string;
  muted?: boolean;
}

export function Flame({ size = 22, color = '#E8580C', muted = false }: FlameProps) {
  const c = muted ? 'currentColor' : color;
  return (
    <svg width={size} height={size} viewBox="0 0 24 28" fill="none" aria-hidden="true">
      <path
        d="M12.4 1.6c.6 2.2-.6 3.7-1.9 5.1-1.7 1.9-3.6 3.7-4.6 6.1-1.6 3.9.1 8.5 4 10.7 3.9 2.2 8.7 1 10.9-2.6 2.4-3.8 1.5-7.7-1.5-10.6-1-1-2.2-1.7-2.6-3.1-.3-1.1-.4-2.3-.5-3.5-.7.6-1.3 1.5-1.7 2.5-.6-.4-1.4-2.1-2.1-4.6Z"
        fill={c}
        opacity={muted ? 0.15 : 1}
      />
      <path
        d="M12.6 10.4c.3 1.4-.4 2.4-1.3 3.4-1 1.1-1.9 2.4-2.1 3.9-.3 2.4 1.5 4.4 4.1 4.5 2.6.1 4.6-1.8 4.6-4.2 0-1.6-.9-2.7-1.9-3.7-.9-.9-1.6-1.8-1.7-3-.6.6-1.1 1.6-1.7 2.4-.2-.6-.4-1.7 0-3.3Z"
        fill={muted ? c : '#FFB070'}
        opacity={muted ? 0.25 : 0.85}
      />
    </svg>
  );
}
