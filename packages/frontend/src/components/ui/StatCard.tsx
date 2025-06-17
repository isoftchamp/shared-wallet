import { cn } from '@/utils';

export interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'gradient';
  color?: 'blue' | 'green' | 'purple' | 'amber';
}

export const StatCard = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  className,
  variant = 'default',
  color = 'blue',
  ...props
}: StatCardProps) => {
  const colorClasses = {
    blue: {
      gradient: 'bg-gradient-to-br from-primary-500 to-primary-600',
      icon: 'bg-primary-100 text-primary-600',
      text: 'text-primary-600',
    },
    green: {
      gradient: 'bg-gradient-to-br from-secondary-500 to-secondary-600',
      icon: 'bg-secondary-100 text-secondary-600',
      text: 'text-secondary-600',
    },
    purple: {
      gradient: 'bg-gradient-to-br from-purple-500 to-purple-600',
      icon: 'bg-purple-100 text-purple-600',
      text: 'text-purple-600',
    },
    amber: {
      gradient: 'bg-gradient-to-br from-accent-500 to-accent-600',
      icon: 'bg-accent-100 text-accent-600',
      text: 'text-accent-600',
    },
  };

  if (variant === 'gradient') {
    return (
      <div
        className={cn(
          'relative overflow-hidden rounded-2xl p-6 text-white shadow-large',
          colorClasses[color].gradient,
          className,
        )}
        {...props}
      >
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium opacity-90">{title}</h3>
            {icon && (
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                {icon}
              </div>
            )}
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-bold">{value}</div>
            {subtitle && <p className="text-sm opacity-80">{subtitle}</p>}
            {trend && (
              <div className="flex items-center space-x-1 text-sm">
                <span className={trend.isPositive ? 'text-green-200' : 'text-red-200'}>
                  {trend.isPositive ? '↗' : '↘'} {Math.abs(trend.value)}%
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
      </div>
    );
  }

  return (
    <div className={cn('card-premium', className)} {...props}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-neutral-600 uppercase tracking-wide">{title}</h3>
        {icon && (
          <div
            className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center',
              colorClasses[color].icon,
            )}
          >
            {icon}
          </div>
        )}
      </div>
      <div className="space-y-1">
        <div className="text-3xl font-bold text-neutral-900">{value}</div>
        {subtitle && <p className="text-sm text-neutral-500">{subtitle}</p>}
        {trend && (
          <div className="flex items-center space-x-1 text-sm">
            <span className={trend.isPositive ? 'text-green-600' : 'text-red-600'}>
              {trend.isPositive ? '↗' : '↘'} {Math.abs(trend.value)}%
            </span>
            <span className="text-neutral-400">vs last month</span>
          </div>
        )}
      </div>
    </div>
  );
};
