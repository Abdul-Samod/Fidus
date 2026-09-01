import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert } from 'lucide-react';
import { Card } from './ui/Card';
import { Badge, type BadgeVariant } from './ui/Badge';
import { Button } from './ui/Button';
import { ImageModal } from './ui/ImageModal';

export interface BidCardProps {
  bid: {
    BidID: string;
    ProposedPrice: number;
    Message: string;
    BidStatus: string;
    CounterAmount?: number | null;
    ArtisanID?: string;
    Artisan: {
      FullName: string;
      WTA_Score: number;
      KYC_Verified: boolean;
      kycDetails?: {
        profilePicUrl: string;
      };
    };
  };
  onAccept?: (bidId: string) => void;
  onCounter?: (bidId: string) => void;
  onReject?: (bidId: string) => void;
}

export const BidCard: React.FC<BidCardProps> = ({ bid, onAccept, onCounter, onReject }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const statusToVariant = (status: string): BadgeVariant => {
    const s = status.toLowerCase();
    const validVariants: BadgeVariant[] = ['open', 'assigned', 'completed', 'pending', 'funded', 'released', 'disputed', 'accepted', 'counter_offered', 'rejected'];
    return validVariants.includes(s as BadgeVariant) ? (s as BadgeVariant) : 'pending';
  };

  const isPending = bid.BidStatus.toLowerCase() === 'pending';

  return (
    <>
      <Card className="flex flex-col">
        <div className="flex justify-between items-start mb-4 border-b border-border pb-4">
          <div className="flex gap-4 items-start">
            {bid.Artisan.kycDetails?.profilePicUrl ? (
              <img 
                src={bid.Artisan.kycDetails.profilePicUrl} 
                alt={bid.Artisan.FullName} 
                className="w-12 h-12 rounded-full object-cover border border-border cursor-pointer hover:opacity-80 transition-opacity flex-shrink-0" 
                onClick={() => setModalOpen(true)}
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-trust-blue/20 flex items-center justify-center text-trust-blue font-heading font-bold text-xl flex-shrink-0">
                {bid.Artisan.FullName.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h3 className="font-heading font-bold text-lg text-primary">{bid.Artisan.FullName}</h3>
              <div className="flex items-center space-x-3 mt-1">
                <span className="text-sm font-body text-secondary">
                  WTA: <span className="font-black text-trust-blue">{Number(bid.Artisan?.WTA_Score || 0).toFixed(1)}</span>
                </span>
                {bid.Artisan?.KYC_Verified ? (
                  <span className="flex items-center text-xs font-semibold text-emerald bg-emerald/10 px-2 py-0.5 rounded-full">
                    <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Verified
                  </span>
                ) : (
                  <span className="flex items-center text-xs font-semibold text-rose bg-rose/10 px-2 py-0.5 rounded-full">
                    <ShieldAlert className="w-3.5 h-3.5 mr-1" /> Unverified
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-black text-primary font-body tracking-tight">
              ₦{Number(bid.ProposedPrice || 0).toFixed(2)}
            </div>
            <Badge variant={statusToVariant(bid.BidStatus)} className="mt-1" />
          </div>
        </div>
        
        <div className="mb-6 font-body text-sm text-secondary line-clamp-3 bg-surface-lighter/30 p-3 rounded-lg border border-border/50">
          {bid.Message || "No message provided."}
        </div>

        {bid.BidStatus.toLowerCase() === 'counter_offered' && bid.CounterAmount && (
          <div className="mb-6 bg-amber/10 border border-amber/20 p-3 rounded-lg flex justify-between items-center">
            <span className="text-sm font-medium text-amber">Your Counter Offer:</span>
            <span className="text-lg font-bold font-heading text-amber">₦{Number(bid.CounterAmount || 0).toFixed(2)}</span>
          </div>
        )}

        {isPending && (onAccept || onCounter || onReject) && (
          <div className="flex flex-col gap-2 mt-auto">
            <div className="flex items-center gap-3">
              {onAccept && (
                <Button variant="success" size="sm" className="flex-1" onClick={() => onAccept(bid.BidID)}>
                  Accept
                </Button>
              )}
              {onCounter && (
                <Button variant="outline" size="sm" className="flex-1 border-amber/50 text-amber hover:bg-amber/10 hover:border-amber" onClick={() => onCounter(bid.BidID)}>
                  Counter
                </Button>
              )}
              {onReject && (
                <Button variant="outline" size="sm" className="flex-1 border-rose/50 text-rose hover:bg-rose/10 hover:border-rose" onClick={() => onReject(bid.BidID)}>
                  Reject
                </Button>
              )}
            </div>
          </div>
        )}
      </Card>
      
      {bid.Artisan.kycDetails?.profilePicUrl && (
        <ImageModal 
          isOpen={modalOpen} 
          onClose={() => setModalOpen(false)} 
          imageUrl={bid.Artisan.kycDetails.profilePicUrl} 
          altText={`${bid.Artisan.FullName}'s profile picture`}
        />
      )}
    </>
  );
};
