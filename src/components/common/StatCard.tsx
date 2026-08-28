import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
  trendGood?: boolean;
  icon?: LucideIcon;
  badge?: string;
  badgeColor?: string;
  onClick?: () => void;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  trendDirection,
  trendGood,
  icon: Icon,
  badge,
  badgeColor = 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300',
  onClick,
  className = ''
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 transition-all shadow-2xs ${
        onClick ? 'cursor-pointer hover:border-slate-300 dark:hover:border-slate-700' : 'hover:border-slate-200 dark:hover:border-slate-700'
      } ${className}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
            {title}
          </span>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white tracking-tight font-mono">
            {value}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {badge && (
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${badgeColor}`}>
              {badge}
            </span>
          )}
          {Icon && (
            <div className="w-8 h-8 rounded-md bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400">
              <Icon className="w-4 h-4" />
            </div>
          )}
        </div>
      </div>

      {(subtitle || trend) && (
        <div className="mt-3.5 flex items-center gap-2 text-xs">
          {trend && (
            <span
              className={`font-semibold flex items-center gap-0.5 ${
                trendGood
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : trendGood === false
                  ? 'text-rose-600 dark:text-rose-400'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {trendDirection === 'up' ? '↑' : trendDirection === 'down' ? '↓' : '•'} {trend}
            </span>
          )}
          {subtitle && <span className="text-slate-400 dark:text-slate-500 leading-normal">{subtitle}</span>}
        </div>
      )}
    </div>
  );
};
