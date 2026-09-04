import React from 'react';

export type BadgeVariant = 'open' | 'assigned' | 'completed' | 'pending' | 'funded' | 'released' | 'disputed' | 'accepted' | 'counter_offered' | 'rejected' | 'verified' | 'unverified';

export interface BadgeProps {
  variant: BadgeVariant;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ variant, className = '' }) => {
  const variantMap: Record<BadgeVariant, { bg: string; text: string; label: string }> = {
    open: { bg: 'bg-trust-blue/10', text: 'text-trust-blue', label: 'Open' },
    assigned: { bg: 'bg-amber/10', text: 'text-amber', label: 'Assigned' },
    completed: { bg: 'bg-emerald/10', text: 'text-emerald', label: 'Completed' },
    pending: { bg: 'bg-amber/10', text: 'text-amber', label: 'Pending' },
    funded: { bg: 'bg-emerald/10', text: 'text-emerald', label: 'Funded' },
    released: { bg: 'bg-emerald/10', text: 'text-emerald', label: 'Released' },
    disputed: { bg: 'bg-rose/10', text: 'text-rose', label: 'Disputed' },
    accepted: { bg: 'bg-emerald/10', text: 'text-emerald', label: 'Accepted' },
    counter_offered: { bg: 'bg-amber/10', text: 'text-amber', label: 'Counter Offered' },
    rejected: { bg: 'bg-rose/10', text: 'text-rose', label: 'Rejected' },
    verified: { bg: 'bg-emerald/10', text: 'text-emerald', label: 'Verified' },
    unverified: { bg: 'bg-amber/10', text: 'text-amber', label: 'Unverified' },
  };

  const { bg, text, label } = variantMap[variant];

  return (
    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold font-body ${bg} ${text} ${className}`}>
      {label}
    </span>
  );
};
