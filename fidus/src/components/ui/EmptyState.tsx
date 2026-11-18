import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  actionIcon?: LucideIcon;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionText,
  onAction,
  actionIcon: ActionIcon
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 bg-surface/40 border border-dashed border-border/80 rounded-2xl text-center max-w-xl mx-auto my-6 backdrop-blur-sm">
      <div className="w-16 h-16 rounded-2xl bg-trust-blue/10 border border-trust-blue/20 flex items-center justify-center text-trust-blue mb-4 shadow-[0_0_20px_rgba(59,130,246,0.15)]">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-heading font-bold text-white mb-2">{title}</h3>
      <p className="text-text-secondary text-sm max-w-md mb-6 leading-relaxed">
        {description}
      </p>
      {actionText && onAction && (
        <Button variant="primary" onClick={onAction} className="shadow-lg shadow-trust-blue/20">
          {ActionIcon && <ActionIcon className="w-4 h-4 mr-2" />}
          {actionText}
        </Button>
      )}
    </div>
  );
};
