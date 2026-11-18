import React from 'react';
import { MapPin, Clock, ArrowRight } from 'lucide-react';
import { Badge, type BadgeVariant } from './ui/Badge';

export interface JobCardProps {
  job: {
    RequestID: string;
    Title?: string;
    Description: string;
    LocationCoordinates: string;
    PriceRange: string;
    Status: string;
    CreatedAt: string;
    ClientCompleted?: boolean;
    ArtisanCompleted?: boolean;
    Bids?: any[];
  };
  onClick?: () => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onClick }) => {
  const statusToVariant = (status: string): BadgeVariant => {
    const s = status.toLowerCase();
    const validVariants: BadgeVariant[] = [
      'open', 'assigned', 'completed', 'pending', 
      'funded', 'released', 'disputed', 'accepted', 
      'counter_offered', 'rejected'
    ];
    return validVariants.includes(s as BadgeVariant) ? (s as BadgeVariant) : 'open';
  };

  const dateStr = new Date(job.CreatedAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric'
  });

  return (
    <div
      onClick={onClick}
      className={`group relative bg-surface/70 hover:bg-surface border border-border/80 hover:border-trust-blue/50 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between shadow-sm hover:shadow-[0_10px_30px_rgba(59,130,246,0.1)] ${
        onClick ? 'cursor-pointer hover:-translate-y-1' : ''
      }`}
    >
      <div>
        <div className="flex justify-between items-center mb-4">
          <Badge variant={statusToVariant(job.Status)} />
          <div className="flex items-center text-text-muted text-xs font-body">
            <Clock className="w-3.5 h-3.5 mr-1" />
            {dateStr}
          </div>
        </div>

        <h3 className="text-white font-heading font-bold text-lg mb-2 group-hover:text-trust-blue transition-colors line-clamp-1">
          {job.Title || 'Service Request'}
        </h3>

        <p className="text-text-secondary font-body text-sm line-clamp-2 mb-6 leading-relaxed">
          {job.Description}
        </p>
      </div>

      <div className="pt-4 border-t border-border/60 flex items-center justify-between mt-auto">
        <div className="flex items-center text-text-muted text-xs font-body max-w-[55%]">
          <MapPin className="w-3.5 h-3.5 mr-1.5 text-trust-blue shrink-0" />
          <span className="truncate">{job.LocationCoordinates || 'Lagos, Nigeria'}</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right">
            <span className="text-[10px] uppercase tracking-wider text-text-muted block">Budget</span>
            <div className="text-emerald font-heading font-bold text-base flex items-center">
              <span>₦{job.PriceRange}</span>
            </div>
          </div>
          {onClick && (
            <div className="w-7 h-7 rounded-lg bg-surface border border-border flex items-center justify-center text-text-secondary group-hover:text-white group-hover:border-trust-blue/40 group-hover:bg-trust-blue/10 transition-colors">
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
