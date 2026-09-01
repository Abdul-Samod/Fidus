import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { serviceApi, bidApi } from '../../services/api';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge, type BadgeVariant } from '../../components/ui/Badge';
import { Loader } from '../../components/ui/Loader';
import { LoaderSpinner } from '../../components/ui/Loader';
import { MapPin, ArrowLeft, Star } from 'lucide-react';
import toast from 'react-hot-toast';

export default function JobFeedDetail() {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Bid state
  const [price, setPrice] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      if (!jobId) return;
      setLoading(true);
      try {
        const response = await serviceApi.getOpen();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const jobs = response.data?.data || response.data || [];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const foundJob = (jobs as any[]).find((j: any) => j.RequestID === jobId);
        if (foundJob) {
          setJob(foundJob);
        }
      } catch (error) {
        console.error('Failed to fetch job details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [jobId]);

  const [acceptingCounter, setAcceptingCounter] = useState(false);

  const handleAcceptCounter = async (bidId: string) => {
    if (!jobId) return;
    setAcceptingCounter(true);
    try {
      await bidApi.artisanAccept({ bidId });
      toast.success('Counter offer accepted! Job is now assigned to you.');
      // Refetch the job to get the updated status
      const response = await serviceApi.getOpen();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const jobs = response.data?.data || response.data || [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const foundJob = (jobs as any[]).find((j: any) => j.RequestID === jobId);
      if (foundJob) {
        setJob(foundJob);
      }
    } catch {
      toast.error('Failed to accept counter offer');
    } finally {
      setAcceptingCounter(false);
    }
  };

  const handleSubmitBid = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobId) return;
    
    setSubmitting(true);
    try {
      await bidApi.create({ 
        requestID: jobId, 
        proposedPrice: Number(price), 
        message 
      });
      toast.success('Bid placed successfully!');
      navigate('/artisan');
    } catch (error: unknown) {
      const err = error as { response?: { status?: number, data?: { message?: string } } };
      const errMessage = err.response?.data?.message || 'Failed to place bid';
      
      if (err.response?.status === 403 && errMessage.includes('KYC verification')) {
        toast.error('You must be verified before you can place bids.');
        navigate('/artisan/kyc');
      } else if (errMessage.includes('no longer open')) {
        toast.error('This job is no longer accepting bids');
      } else if (errMessage.includes('not found')) {
        toast.error('Job not found');
      } else {
        toast.error(errMessage);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleCompleteJob = async () => {
    if (!jobId) return;
    setCompleting(true);
    try {
      await serviceApi.complete(jobId);
      toast.success('Job marked as complete!');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setJob((prev: any) => prev ? { ...prev, ArtisanCompleted: true } : prev);
    } catch {
      toast.error('Failed to mark job as complete');
    } finally {
      setCompleting(false);
    }
  };

  const statusToVariant = (status: string): BadgeVariant => {
    const s = status.toLowerCase();
    const map: Record<string, BadgeVariant> = {
      open: 'open',
      assigned: 'assigned',
      completed: 'completed',
    };
    return map[s] || 'pending';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-heading mb-4 text-rose">Job Not Found</h2>
        <Button onClick={() => navigate('/artisan')}>Back to Feed</Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link to="/artisan" className="inline-flex items-center text-trust-blue hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Feed
      </Link>
      
      <Card className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            {job.Title && <h1 className="text-2xl font-heading font-bold text-white">{job.Title}</h1>}
            {!job.Title && <h1 className="text-2xl font-heading font-bold text-white">Job Details</h1>}
          </div>
          <Badge variant={statusToVariant(job.Status)} />
        </div>
        
        <div className="bg-deep-slate p-4 rounded-lg border border-border mb-6">
          <p className="text-gray-200 font-body whitespace-pre-wrap">{job.Description}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="flex items-center text-gray-300">
            <MapPin className="w-4 h-4 text-trust-blue mr-2" />
            <span>{job.LocationCoordinates}</span>
          </div>
          <div className="flex items-center text-gray-300">
            <span className="text-emerald mr-2 font-heading text-lg">₦</span>
            <span>{job.PriceRange}</span>
          </div>
        </div>
        
        <div className="text-sm text-gray-500 font-body">
          Posted: {new Date(job.CreatedAt).toLocaleDateString()}
        </div>
      </Card>

      {job.Status === 'Open' && (
        job.Bids && job.Bids.length > 0 ? (
          <Card className="p-6">
            <h2 className="text-xl font-heading font-bold text-white mb-4">Your Bid Status</h2>
            <div className="bg-deep-slate p-4 rounded-lg border border-border">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-400">Proposed Price</span>
                <span className="text-2xl font-bold font-heading text-trust-blue">₦{Number(job.Bids[0].ProposedPrice || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-400">Status</span>
                <Badge variant={statusToVariant(job.Bids[0].BidStatus)} />
              </div>
              {job.Bids[0].BidStatus === 'Counter_Offered' && job.Bids[0].CounterAmount && (
                <div className="flex flex-col mt-4 pt-4 border-t border-border">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-amber">Client Counter Offer</span>
                    <span className="text-xl font-bold font-heading text-amber">₦{Number(job.Bids[0].CounterAmount || 0).toFixed(2)}</span>
                  </div>
                  <Button 
                    variant="success" 
                    onClick={() => handleAcceptCounter(job.Bids[0].BidID)}
                    disabled={acceptingCounter}
                    className="w-full"
                  >
                    {acceptingCounter ? <><LoaderSpinner className="w-4 h-4 mr-2" /> Accepting...</> : 'Accept Counter Offer'}
                  </Button>
                </div>
              )}
              {job.Bids[0].BidStatus === 'Rejected' && (
                <div className="mt-4 p-4 bg-rose/10 border border-rose/20 rounded-lg text-rose font-body text-sm">
                  Unfortunately, the client has declined your bid. You can continue browsing other open jobs.
                </div>
              )}
              <div className="mt-4 text-sm text-gray-500">
                Message: {job.Bids[0].Message}
              </div>
            </div>
          </Card>
        ) : (
          <Card className="p-6">
            <h2 className="text-xl font-heading font-bold text-white mb-4">Place Your Bid</h2>
            <form onSubmit={handleSubmitBid}>
              <div className="mb-4">
                <Input 
                  label="Proposed Price"
                  type="number" 
                  required 
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  icon={<span className="font-heading text-lg font-bold">₦</span>}
                  placeholder="Enter your price"
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-secondary mb-2 font-body text-sm">Message to Client</label>
                <textarea 
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-surface border border-border rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-trust-blue/50 focus:border-trust-blue transition-all"
                  style={{ minHeight: '100px' }}
                  placeholder="Explain why you are the best fit for this job..."
                />
              </div>
              
              <Button 
                type="submit" 
                disabled={submitting} 
                className="w-full"
              >
                {submitting ? <><LoaderSpinner className="w-4 h-4 mr-2" /> Submitting...</> : 'Submit Bid'}
              </Button>
            </form>
          </Card>
        )
      )}

      {job.Status === 'Assigned' && (
        job.Bids && job.Bids.length > 0 && job.Bids[0].BidStatus === 'Accepted' ? (
          <Card className="p-6 text-center">
            <h2 className="text-xl font-heading font-bold text-white mb-4">Congratulations, Job Assigned to You!</h2>
            <div className="flex justify-between items-center bg-deep-slate p-4 rounded-lg border border-border mb-6 text-left">
              <span className="text-gray-400">Agreed Price</span>
              <span className="text-2xl font-bold font-heading text-emerald">₦{Number(job.Bids[0].ProposedPrice || 0).toFixed(2)}</span>
            </div>
            <div className="flex flex-col items-center gap-4">
              {job.ArtisanCompleted ? (
                <div className="text-emerald font-body bg-emerald/10 px-4 py-2 rounded-lg border border-emerald/20">
                  You have marked this job as complete.
                  {job.ClientCompleted ? " Client has also confirmed." : " Waiting for client confirmation."}
                </div>
              ) : job.Escrow_Transaction?.EscrowStatus === 'Funded' ? (
                <Button 
                  onClick={handleCompleteJob}
                  disabled={completing}
                  variant="success"
                  className="w-full sm:w-auto"
                >
                  {completing ? <><LoaderSpinner className="w-4 h-4 mr-2" /> Completing...</> : 'Mark as Complete'}
                </Button>
              ) : (
                <div title="Payment has not been deposited in Escrow yet.">
                  <Button 
                    disabled
                    variant="success"
                    className="w-full sm:w-auto opacity-50 cursor-not-allowed"
                  >
                    Mark as Complete
                  </Button>
                  <p className="text-amber text-xs mt-2 font-body">Awaiting client escrow payment</p>
                </div>
              )}
            </div>
          </Card>
        ) : (
          <Card className="p-6 text-center">
            <h2 className="text-xl font-heading font-bold text-white mb-4">Job Assigned</h2>
            <p className="text-text-secondary font-body">This job has been assigned to another artisan.</p>
          </Card>
        )
      )}

      {job.Status === 'Completed' && (
        <Card className="p-6 text-center">
          <h2 className="text-xl font-heading font-bold text-white mb-4">Job Completed</h2>
          <p className="text-emerald font-body bg-emerald/10 px-4 py-2 rounded-lg inline-block border border-emerald/20">
            This service request has been successfully completed and closed.
          </p>
        </Card>
      )}

      {job.Status === 'Completed' && job.Reviews && job.Reviews.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-xl font-heading text-white">Your Client Ratings</h2>
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
              <div key={idx} className="bg-deep-slate p-4 rounded-lg border border-border text-left">
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
    </div>
  );
}
