import { cn } from '@/utils/cn';
import type { LucideIcon } from 'lucide-react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: LucideIcon;
  iconRight?: LucideIcon;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

const sizes: Record<ButtonSize, string> = {
  sm: 'h-8  px-3 text-[13px]',
  md: 'h-11 px-4 text-[14px]',
  lg: 'h-14 px-5 text-[15px]',
};

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-accent text-white hover:bg-[#BF4715] disabled:bg-[#E0B19E] disabled:text-white/80 disabled:cursor-not-allowed',
  secondary:
    'bg-transparent border border-ink/85 text-ink hover:bg-ink/[0.04] dark:border-ink-dark/70 dark:text-ink-dark dark:hover:bg-ink-dark/[0.06]',
  ghost:
    'bg-transparent text-ink hover:bg-ink/[0.04] dark:text-ink-dark dark:hover:bg-ink-dark/[0.06]',
  danger:
    'bg-bad text-white hover:opacity-95',
};

export function Button({ children, variant = 'primary', size = 'md', icon: Icon, iconRight: IconRight, className, disabled, onClick, type = 'button' }: ButtonProps) {
  const iconSize = size === 'lg' ? 18 : 16;
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium select-none ghost-press transition-colors',
        sizes[size],
        variants[variant],
        className
      )}
    >
      {Icon && <Icon size={iconSize} />}
      <span>{children}</span>
      {IconRight && <IconRight size={iconSize} />}
    </button>
  );
}
