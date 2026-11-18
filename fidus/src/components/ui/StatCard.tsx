import React from 'react';
import type { LucideIcon } from 'lucide-react';

export interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  subtext?: string;
  variant?: 'blue' | 'emerald' | 'amber' | 'purple';
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon: Icon,
  subtext,
  variant = 'blue'
}) => {
  const variantStyles = {
    blue: {
      border: 'border-trust-blue/20 hover:border-trust-blue/40',
      iconBg: 'bg-trust-blue/10 text-trust-blue border-trust-blue/20',
      glow: 'group-hover:shadow-[0_0_25px_rgba(59,130,246,0.15)]'
    },
    emerald: {
      border: 'border-emerald/20 hover:border-emerald/40',
      iconBg: 'bg-emerald/10 text-emerald border-emerald/20',
      glow: 'group-hover:shadow-[0_0_25px_rgba(52,211,153,0.15)]'
    },
    amber: {
      border: 'border-amber/20 hover:border-amber/40',
      iconBg: 'bg-amber/10 text-amber border-amber/20',
      glow: 'group-hover:shadow-[0_0_25px_rgba(245,158,11,0.15)]'
    },
    purple: {
      border: 'border-purple-500/20 hover:border-purple-500/40',
      iconBg: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      glow: 'group-hover:shadow-[0_0_25px_rgba(168,85,247,0.15)]'
    }
  };

  const style = variantStyles[variant];

  return (
    <div className={`group bg-surface/70 backdrop-blur-md border ${style.border} rounded-2xl p-5 transition-all duration-300 ${style.glow}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-text-secondary">{label}</span>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${style.iconBg} transition-transform group-hover:scale-110`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="text-2xl sm:text-3xl font-heading font-extrabold text-white tracking-tight mb-1">
        {value}
      </div>
      {subtext && (
        <p className="text-xs text-text-muted font-body">
          {subtext}
        </p>
      )}
    </div>
  );
};
