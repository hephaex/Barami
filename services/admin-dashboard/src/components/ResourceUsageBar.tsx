import clsx from 'clsx';

interface ResourceUsageBarProps {
  label: string;
  used: number;
  total: number;
  unit: string;
  percentage: number;
  icon?: React.ReactNode;
}

export const ResourceUsageBar = ({
  label,
  used,
  total,
  unit,
  percentage,
  icon,
}: ResourceUsageBarProps) => {
  const getColorClass = (percent: number) => {
    if (percent >= 90) return 'bg-red-500';
    if (percent >= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="bg-dark-surface border border-dark-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {icon && <div className="text-primary-500">{icon}</div>}
          <h3 className="text-white font-medium">{label}</h3>
        </div>
        <span className="text-sm text-gray-400">
          {used.toFixed(1)} / {total.toFixed(1)} {unit}
        </span>
      </div>

      <div className="relative">
        <div className="w-full bg-dark-bg rounded-full h-3 overflow-hidden">
          <div
            className={clsx(
              'h-full transition-all duration-300 rounded-full',
              getColorClass(percentage)
            )}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
        <span
          className={clsx(
            'absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold',
            percentage >= 90 ? 'text-red-500' : 'text-white'
          )}
        >
          {percentage.toFixed(1)}%
        </span>
      </div>
    </div>
  );
};
