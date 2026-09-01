import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { CheckCircle, Shield, ArrowLeft, Copy, Check } from 'lucide-react';
import { bidApi, escrowApi, serviceApi } from '../../services/api';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Loader } from '../../components/ui/Loader';
import { LoaderSpinner } from '../../components/ui/Loader';
import { useAuth } from '../../context/AuthContext';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    PaystackPop: any;
  }
}

export default function PaymentPage() {
  const { jobId, bidId } = useParams<{ jobId: string; bidId: string }>();
  const { user } = useAuth();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [bid, setBid] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [job, setJob] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bidsRes, jobsRes] = await Promise.all([
          bidApi.getForJob(jobId!),
          serviceApi.getMyRequests(),
        ]);
        const bidsData = bidsRes.data?.data || bidsRes.data || [];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const accepted = (bidsData as any[]).find((b: any) => b.BidID === bidId);
        if (accepted) setBid(accepted);
        else toast.error('Bid not found');

        const jobsData = jobsRes.data?.data || jobsRes.data || [];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const foundJob = (jobsData as any[]).find((j: any) => j.RequestID === jobId);
        if (foundJob) setJob(foundJob);
      } catch {
        toast.error('Failed to load payment details');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();

    // Load Paystack script
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [jobId, bidId]);

  const handleCopyJobId = () => {
    if (jobId) {
      navigator.clipboard.writeText(jobId);
      setCopied(true);
      toast.success('Job ID copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePay = () => {
    if (!bid) return;
    
    const handler = window.PaystackPop.setup({
      key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_4304a1eccf7d91350fff46c344e2a5d8c51966be',
      email: `${user?.uuid}@fidus.com`,
      amount: Number(bid.ProposedPrice) * 100, // NGN in kobo
      currency: 'NGN',
      reference: `fidus_req_${jobId}_${Date.now()}`,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      callback: function(response: any) {
        setIsVerifying(true);
        escrowApi.verify({
          reference: response.reference,
          requestId: jobId!,
          bidId: bidId!,
        }).then(() => {
          setIsSuccess(true);
          toast.success('Payment verified successfully!');
        }).catch(() => {
          toast.error('Payment verification failed. Please contact support.');
        }).finally(() => {
          setIsVerifying(false);
        });
      },
      onClose: function() {
        toast.error('Payment cancelled');
      },
    });
    
    handler.openIframe();
  };

  if (isLoading) return <div className="flex justify-center py-20"><Loader /></div>;

  if (isSuccess) {
    return (
      <div className="max-w-md mx-auto text-center space-y-6 pt-10">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald/10 rounded-full mb-4 shadow-[0_0_20px_rgba(52,211,153,0.3)]">
          <CheckCircle className="w-10 h-10 text-emerald" />
        </div>
        <h1 className="text-3xl font-heading text-white">Payment Successful</h1>
        <p className="text-slate-300 font-body">
          Your funds are securely held in escrow and will only be released when the job is completed to your satisfaction.
        </p>
        <Link to={`/client/job/${jobId}`}>
          <Button className="mt-8 w-full">Return to Job Details</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-6">
      <Link to={`/client/job/${jobId}`} className="inline-flex items-center text-text-secondary hover:text-white transition-colors font-body">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Job
      </Link>
      
      <h1 className="text-2xl font-heading text-white">Fund Escrow</h1>
      
      <Card className="p-6 space-y-6">
        <div className="flex items-start bg-deep-slate p-4 rounded-lg border border-border">
          <Shield className="w-6 h-6 text-trust-blue mt-1 mr-3 flex-shrink-0" />
          <div>
            <h3 className="text-white font-medium mb-1 font-body">Secure Escrow Payment</h3>
            <p className="text-sm text-text-secondary font-body">Your payment will be held safely by Fidus and released to the artisan only when you mark the job as completed.</p>
          </div>
        </div>

        <div className="space-y-0">
          {/* Job Title */}
          {job?.Title && (
            <div className="flex justify-between items-center py-3 border-b border-border">
              <span className="text-text-secondary font-body">Job Title</span>
              <span className="text-white font-medium font-body">{job.Title}</span>
            </div>
          )}

          {/* Job ID - copyable */}
          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-text-secondary font-body">Reference (Job ID)</span>
            <button 
              onClick={handleCopyJobId}
              className="flex items-center gap-2 text-trust-blue hover:text-white transition-colors font-mono text-sm"
              title="Click to copy"
            >
              <span className="truncate max-w-[160px]">{jobId}</span>
              {copied ? <Check className="w-4 h-4 text-emerald" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          {/* Client Name */}
          {user?.fullName && (
            <div className="flex justify-between items-center py-3 border-b border-border">
              <span className="text-text-secondary font-body">Client</span>
              <span className="text-white font-medium font-body">{user.fullName}</span>
            </div>
          )}

          {/* Artisan Name */}
          {bid?.Artisan?.FullName && (
            <div className="flex justify-between items-center py-3 border-b border-border">
              <span className="text-text-secondary font-body">Artisan</span>
              <span className="text-white font-medium font-body">{bid.Artisan.FullName}</span>
            </div>
          )}

          {/* Total Amount */}
          <div className="flex justify-between items-center py-3">
            <span className="text-slate-300 font-body">Total Amount</span>
            <span className="text-3xl font-bold font-heading text-white">₦{Number(bid?.ProposedPrice || 0).toLocaleString()}</span>
          </div>
        </div>

        <div className="space-y-3">
          <Button 
            className="w-full py-4 text-lg"
            onClick={handlePay}
            disabled={isVerifying}
          >
            {isVerifying ? <><LoaderSpinner className="w-5 h-5 mr-2" /> Verifying...</> : 'Pay Now'}
          </Button>
          <p className="text-center text-text-muted text-xs font-body">
            Powered by <span className="font-semibold text-text-secondary">Paystack</span>
          </p>
        </div>
      </Card>
    </div>
  );
}
