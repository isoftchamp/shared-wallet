import { cn } from '@/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'premium' | 'glass';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card = ({
  className,
  variant = 'default',
  padding = 'md',
  children,
  ...props
}: CardProps) => {
  const variantClasses = {
    default: 'card',
    premium: 'card-premium',
    glass: 'glass rounded-2xl',
  };

  const paddingClasses = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={cn(
        variantClasses[variant],
        variant === 'glass' && paddingClasses[padding],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};
