import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { MapPin, Clock, CheckCircle, Star } from 'lucide-react';
import { serviceApi, bidApi, reviewApi } from '../../services/api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { Badge, type BadgeVariant } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Loader } from '../../components/ui/Loader';
import { StarRating } from '../../components/ui/StarRating';
import { BidCard } from '../../components/BidCard';

export default function JobDetail() {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [job, setJob] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [bids, setBids] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [acceptModalOpen, setAcceptModalOpen] = useState(false);
  const [counterModalOpen, setCounterModalOpen] = useState(false);
  const [selectedBidId, setSelectedBidId] = useState<string | null>(null);
  const [counterAmount, setCounterAmount] = useState('');
  const [isActionLoading, setIsActionLoading] = useState(false);
  
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');

  const statusToVariant = (status: string): BadgeVariant => {
    const s = status.toLowerCase();
    const map: Record<string, BadgeVariant> = {
      open: 'open', assigned: 'assigned', completed: 'completed',
    };
    return map[s] || 'pending';
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [requestsRes, bidsRes] = await Promise.all([
        serviceApi.getMyRequests(),
        bidApi.getForJob(jobId!),
      ]);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const allJobs = requestsRes.data?.data || requestsRes.data || [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const foundJob = (allJobs as any[]).find((r: any) => r.RequestID === jobId);
      setJob(foundJob);
      const bidsData = bidsRes.data?.data || bidsRes.data || [];
      setBids(Array.isArray(bidsData) ? bidsData : []);
    } catch {
      toast.error('Failed to load job details');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId]);

  const handleAccept = async () => {
    if (!selectedBidId) return;
    setIsActionLoading(true);
    try {
      await bidApi.decision({ bidId: selectedBidId, decision: 'Accept' });
      toast.success('Bid accepted successfully!');
      setAcceptModalOpen(false);
      fetchData();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to accept bid');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleCounter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBidId || !counterAmount) return;
    setIsActionLoading(true);
    try {
      await bidApi.decision({ bidId: selectedBidId, decision: 'Counter', counterAmount: Number(counterAmount) });
      toast.success('Counter offer sent!');
      setCounterModalOpen(false);
      setCounterAmount('');
      fetchData();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to send counter offer');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleComplete = async () => {
    try {
      await serviceApi.complete(jobId!);
      toast.success('Job marked as complete!');
      fetchData();
    } catch {
      toast.error('Failed to complete job');
    }
  };

  const [rejectModalOpen, setRejectModalOpen] = useState(false);

  const handleReject = async () => {
    if (!selectedBidId) return;
    setIsActionLoading(true);
    try {
      await bidApi.decision({ bidId: selectedBidId, decision: 'Reject' });
      toast.success('Bid rejected.');
      setRejectModalOpen(false);
      fetchData();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to reject bid');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const acceptedBid = bids.find((b: any) => b.BidStatus === 'Accepted');
    if (!acceptedBid) return;

    try {
      await reviewApi.create({
        requestID: jobId!,
        artisanID: acceptedBid.ArtisanID,
        rating: reviewRating,
        comment: reviewComment,
      });
      toast.success('Review submitted successfully!');
      navigate('/client');
    } catch {
      toast.error('Failed to submit review');
    }
  };

  if (isLoading) return <div className="flex justify-center py-20"><Loader /></div>;
  if (!job) return <div className="text-white text-center py-20">Job not found</div>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const acceptedBid = bids.find((b: any) => b.BidStatus === 'Accepted');

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Card className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-heading text-white mb-2">{job.Title || 'Job Details'}</h1>
            <Badge variant={statusToVariant(job.Status)} />
          </div>
          <span className="text-text-secondary text-sm font-body">{new Date(job.CreatedAt || Date.now()).toLocaleDateString()}</span>
        </div>
        
        <div className="space-y-4 font-body">
          <p className="text-slate-200 text-lg leading-relaxed">{job.Description}</p>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <div className="flex items-center text-slate-300 bg-deep-slate p-3 rounded-lg border border-border">
              <MapPin className="w-5 h-5 mr-2 text-trust-blue" />
              <span>{job.LocationCoordinates}</span>
            </div>
            <div className="flex items-center text-slate-300 bg-deep-slate p-3 rounded-lg border border-border">
              <span className="text-emerald mr-2 font-heading text-xl">₦</span>
              <span>{job.PriceRange}</span>
            </div>
          </div>
          
          {job.Status === 'Assigned' && (
            <div className="mt-4 p-4 bg-deep-slate border border-border rounded-lg flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <CheckCircle className={`w-5 h-5 ${job.ClientCompleted ? 'text-emerald' : 'text-slate-500'}`} />
                <span className="text-slate-300">Client Completed: {job.ClientCompleted ? 'Yes' : 'No'}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className={`w-5 h-5 ${job.ArtisanCompleted ? 'text-emerald' : 'text-slate-500'}`} />
                <span className="text-slate-300">Artisan Completed: {job.ArtisanCompleted ? 'Yes' : 'No'}</span>
              </div>
            </div>
          )}
        </div>
      </Card>

      {job.Status === 'Open' && (
        <div className="space-y-4">
          <h2 className="text-xl font-heading text-white">Bids ({bids.length})</h2>
          {bids.length === 0 ? (
            <p className="text-text-secondary font-body">No bids yet on this job.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {bids.map((bid: any) => (
                <BidCard 
                  key={bid.BidID} 
                  bid={bid}
                  onAccept={(bidId) => { setSelectedBidId(bidId); setAcceptModalOpen(true); }}
                  onCounter={(bidId) => { setSelectedBidId(bidId); setCounterModalOpen(true); }}
                  onReject={(bidId) => { setSelectedBidId(bidId); setRejectModalOpen(true); }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {job.Status === 'Assigned' && acceptedBid && (
        <Card className="p-6 space-y-6">
          <h2 className="text-xl font-heading text-white">Assigned Job Management</h2>
          
          <div className="bg-deep-slate p-4 rounded-lg border border-border">
            <h3 className="text-slate-300 font-medium mb-2">Accepted Bid Details</h3>
            <p className="text-white text-2xl font-bold font-heading mb-1">₦{Number(acceptedBid.ProposedPrice || 0).toFixed(2)}</p>
            <p className="text-text-secondary text-sm">Artisan: {acceptedBid.Artisan?.FullName || acceptedBid.ArtisanID}</p>
          </div>

          {(() => {
            const escrowFunded = job.Escrow_Transaction?.EscrowStatus === 'Funded';
            const canComplete = escrowFunded && job.ArtisanCompleted && !job.ClientCompleted;
            const alreadyCompleted = job.ClientCompleted;

            return (
              <div className="flex flex-col sm:flex-row gap-4">
                {!escrowFunded && (
                  <Button className="flex-1" onClick={() => navigate(`/client/pay/${job.RequestID}/${acceptedBid.BidID}`)}>
                    Proceed to Payment (Escrow)
                  </Button>
                )}
                {escrowFunded && !alreadyCompleted && (
                  <div className="flex-1 bg-emerald/10 border border-emerald/20 rounded-lg px-4 py-2 flex items-center text-emerald text-sm font-body">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Escrow Funded
                  </div>
                )}
                
                <div className="flex-1" title={
                  !escrowFunded 
                    ? "Escrow payment must be completed first." 
                    : !job.ArtisanCompleted 
                      ? "The artisan must mark the job as complete first." 
                      : undefined
                }>
                  <Button 
                    variant="success"
                    className={`w-full ${!canComplete && !alreadyCompleted ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={canComplete ? handleComplete : undefined}
                    disabled={!canComplete || alreadyCompleted}
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    {alreadyCompleted ? 'Completion Confirmed' : 'Mark as Complete'}
                  </Button>
                  {!escrowFunded && (
                    <p className="text-amber text-xs mt-2 font-body text-center">Fund escrow first</p>
                  )}
                  {escrowFunded && !job.ArtisanCompleted && !alreadyCompleted && (
                    <p className="text-amber text-xs mt-2 font-body text-center">The artisan must mark the job as complete first.</p>
                  )}
                </div>
              </div>
            );
          })()}
          
          {job.ClientCompleted && !job.ArtisanCompleted && (
            <p className="text-amber text-sm mt-2 flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              Waiting for artisan to confirm completion...
            </p>
          )}
        </Card>
      )}

      {job.Status === 'Completed' && job.Reviews && job.Reviews.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-xl font-heading text-white">Artisan Ratings</h2>
            <div className="flex items-center gap-2 bg-trust-blue/10 px-3 py-1 rounded-full text-trust-blue">
              <Star className="w-4 h-4 fill-current" />
              <span className="font-bold font-body">
                {(job.Reviews.reduce((sum: number, r: any) => sum + r.Rating, 0) / job.Reviews.length).toFixed(1)}
              </span>
              <span className="text-xs opacity-70">({job.Reviews.length} review{job.Reviews.length !== 1 && 's'})</span>
            </div>
          </div>
          
          <div className="space-y-4">
            {job.Reviews.map((r: any, idx: number) => (
              <div key={idx} className="bg-deep-slate p-4 rounded-lg border border-border">
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < r.Rating ? 'text-amber fill-current' : 'text-slate-600'}`} />
                  ))}
                </div>
                {r.Comment ? (
                  <p className="text-sm font-body text-slate-300">{r.Comment}</p>
                ) : (
                  <p className="text-sm font-body text-slate-500 italic">No comment provided.</p>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {job.Status === 'Completed' && (
        <Card className="p-6">
          <h2 className="text-xl font-heading text-white mb-6">Leave a Review</h2>
          <form onSubmit={handleReviewSubmit} className="space-y-6">
            <div>
              <label className="block text-slate-300 font-medium mb-2 font-body">Rating</label>
              <StarRating rating={reviewRating} onChange={setReviewRating} />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-2 font-body">Comment (Optional)</label>
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className="w-full bg-deep-slate border border-border rounded-lg p-3 text-white focus:ring-2 focus:ring-trust-blue/50 focus:border-trust-blue transition-all"
                rows={4}
              />
            </div>
            <Button type="submit">Submit Review</Button>
          </form>
        </Card>
      )}

      {/* Accept Modal */}
      <Modal title="Accept Bid" isOpen={acceptModalOpen} onClose={() => setAcceptModalOpen(false)}>
        <p className="text-slate-300 mb-6 font-body">Are you sure you want to accept this bid? This will assign the job to the artisan.</p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setAcceptModalOpen(false)}>Cancel</Button>
          <Button onClick={handleAccept} disabled={isActionLoading}>
            {isActionLoading ? 'Accepting...' : 'Yes, Accept'}
          </Button>
        </div>
      </Modal>

      {/* Counter Modal */}
      <Modal title="Counter Offer" isOpen={counterModalOpen} onClose={() => setCounterModalOpen(false)}>
        <form onSubmit={handleCounter}>
          <p className="text-slate-300 mb-4 font-body">Propose a new price for this bid.</p>
          <Input
            type="number"
            value={counterAmount}
            onChange={(e) => setCounterAmount(e.target.value)}
            placeholder="Enter amount"
            required
          />
          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="outline" onClick={() => setCounterModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isActionLoading || !counterAmount}>
              {isActionLoading ? 'Sending...' : 'Send Counter Offer'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Reject Modal */}
      <Modal title="Reject Bid" isOpen={rejectModalOpen} onClose={() => setRejectModalOpen(false)}>
        <p className="text-slate-300 mb-6 font-body">Are you sure you want to reject this bid? This action cannot be undone.</p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setRejectModalOpen(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleReject} disabled={isActionLoading}>
            {isActionLoading ? 'Rejecting...' : 'Yes, Reject'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
