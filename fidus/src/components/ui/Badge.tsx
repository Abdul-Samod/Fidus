import React from 'react';

export type BadgeVariant = 
  | 'open' 
  | 'assigned' 
  | 'completed' 
  | 'pending' 
  | 'funded' 
  | 'released' 
  | 'disputed' 
  | 'accepted' 
  | 'counter_offered' 
  | 'rejected' 
  | 'verified' 
  | 'unverified';

export interface BadgeProps {
  variant: BadgeVariant;
  className?: string;
  showDot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({ variant, className = '', showDot = true }) => {
  const variantMap: Record<BadgeVariant, { bg: string; text: string; border: string; dot: string; label: string }> = {
    open: { 
      bg: 'bg-blue-500/10', 
      text: 'text-blue-400', 
      border: 'border-blue-500/20', 
      dot: 'bg-blue-400', 
      label: 'Open' 
    },
    assigned: { 
      bg: 'bg-amber-500/10', 
      text: 'text-amber-400', 
      border: 'border-amber-500/20', 
      dot: 'bg-amber-400', 
      label: 'Assigned' 
    },
    completed: { 
      bg: 'bg-emerald-500/10', 
      text: 'text-emerald-400', 
      border: 'border-emerald-500/20', 
      dot: 'bg-emerald-400', 
      label: 'Completed' 
    },
    pending: { 
      bg: 'bg-amber-500/10', 
      text: 'text-amber-400', 
      border: 'border-amber-500/20', 
      dot: 'bg-amber-400 animate-pulse', 
      label: 'Pending' 
    },
    funded: { 
      bg: 'bg-emerald-500/10', 
      text: 'text-emerald-400', 
      border: 'border-emerald-500/20', 
      dot: 'bg-emerald-400', 
      label: 'Escrow Funded' 
    },
    released: { 
      bg: 'bg-emerald-500/10', 
      text: 'text-emerald-400', 
      border: 'border-emerald-500/20', 
      dot: 'bg-emerald-400', 
      label: 'Released' 
    },
    disputed: { 
      bg: 'bg-rose-500/10', 
      text: 'text-rose-400', 
      border: 'border-rose-500/20', 
      dot: 'bg-rose-400', 
      label: 'Disputed' 
    },
    accepted: { 
      bg: 'bg-emerald-500/10', 
      text: 'text-emerald-400', 
      border: 'border-emerald-500/20', 
      dot: 'bg-emerald-400', 
      label: 'Accepted' 
    },
    counter_offered: { 
      bg: 'bg-purple-500/10', 
      text: 'text-purple-400', 
      border: 'border-purple-500/20', 
      dot: 'bg-purple-400', 
      label: 'Counter Offered' 
    },
    rejected: { 
      bg: 'bg-rose-500/10', 
      text: 'text-rose-400', 
      border: 'border-rose-500/20', 
      dot: 'bg-rose-400', 
      label: 'Rejected' 
    },
    verified: { 
      bg: 'bg-emerald-500/15', 
      text: 'text-emerald-300', 
      border: 'border-emerald-500/30', 
      dot: 'bg-emerald-400', 
      label: 'Verified Artisan' 
    },
    unverified: { 
      bg: 'bg-slate-500/15', 
      text: 'text-slate-400', 
      border: 'border-slate-500/30', 
      dot: 'bg-slate-400', 
      label: 'Unverified' 
    },
  };

  const current = variantMap[variant] || variantMap.open;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold font-body border ${current.bg} ${current.text} ${current.border} shadow-sm backdrop-blur-xs ${className}`}>
      {showDot && <span className={`w-1.5 h-1.5 rounded-full ${current.dot}`} />}
      {current.label}
    </span>
  );
};
