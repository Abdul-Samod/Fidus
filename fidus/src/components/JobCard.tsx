import React from 'react';
import { MapPin, Clock } from 'lucide-react';
import { Card } from './ui/Card';
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
  };
  onClick?: () => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onClick }) => {
  const statusToVariant = (status: string): BadgeVariant => {
    const s = status.toLowerCase();
    const validVariants: BadgeVariant[] = ['open', 'assigned', 'completed', 'pending', 'funded', 'released', 'disputed', 'accepted', 'counter_offered', 'rejected'];
    return validVariants.includes(s as BadgeVariant) ? (s as BadgeVariant) : 'open';
  };

  const dateStr = new Date(job.CreatedAt).toLocaleDateString();

  return (
    <Card hoverable={!!onClick} onClick={onClick} className="flex flex-col h-full justify-between">
      <div>
        <div className="flex justify-between items-start mb-3">
          <Badge variant={statusToVariant(job.Status)} />
          <div className="flex items-center text-muted text-xs font-body">
            <Clock className="w-3.5 h-3.5 mr-1" />
            {dateStr}
          </div>
        </div>
        {job.Title && (
          <h3 className="text-white font-heading font-bold text-base mb-2">{job.Title}</h3>
        )}
        <p className="text-primary font-body text-sm line-clamp-2 mb-4">
          {job.Description}
        </p>
      </div>
      
      <div className="flex flex-col space-y-2 mt-auto">
        <div className="flex items-center text-secondary text-sm font-body">
          <MapPin className="w-4 h-4 mr-2 text-trust-blue" />
          <span className="truncate">{job.LocationCoordinates}</span>
        </div>
        <div className="flex items-center text-primary font-bold text-base font-body">
          <span className="text-emerald mr-1 font-heading text-lg">₦</span>
          {job.PriceRange}
        </div>
      </div>
    </Card>
  );
};
