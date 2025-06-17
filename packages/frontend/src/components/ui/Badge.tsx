import { cn } from '@/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
}

export const Badge = ({
  className,
  variant = 'info',
  size = 'md',
  children,
  ...props
}: BadgeProps) => {
  const variantClasses = {
    success: 'badge-success',
    warning: 'badge-warning',
    error: 'badge-error',
    info: 'badge-info',
    neutral: 'bg-neutral-100 text-neutral-800',
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-xs',
    lg: 'px-4 py-1.5 text-sm',
  };

  return (
    <span className={cn('badge', variantClasses[variant], sizeClasses[size], className)} {...props}>
      {children}
    </span>
  );
};
