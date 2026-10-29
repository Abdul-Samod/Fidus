import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useInfiniteQuery } from '@tanstack/react-query';
import { serviceApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { JobCard } from '../../components/JobCard';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { StatCard } from '../../components/ui/StatCard';
import { EmptyState } from '../../components/ui/EmptyState';
import { JobCardSkeleton } from '../../components/ui/Skeleton';
import { 
  RefreshCw, 
  Search, 
  Award, 
  ShieldCheck, 
  AlertCircle, 
  Briefcase, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import type { PaginatedResponse, ServiceRequest } from '../../types';

export default function ArtisanDashboard() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  
  const [showKycModal, setShowKycModal] = useState(() => {
    if (user && !user.KYC_Verified && !sessionStorage.getItem('kyc_prompt_shown')) {
      return true;
    }
    return false;
  });

  const handleCloseKycModal = () => {
    sessionStorage.setItem('kyc_prompt_shown', 'true');
    setShowKycModal(false);
  };

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isFetching
  } = useInfiniteQuery<PaginatedResponse<ServiceRequest>, Error>({
    queryKey: ['openJobs'],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await serviceApi.getOpen(pageParam as number, 10);
      return response.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.meta && lastPage.meta.page < lastPage.meta.totalPages) {
        return lastPage.meta.page + 1;
      }
      return undefined;
    }
  });

  const jobs = useMemo(() => {
    return data?.pages.flatMap((page) => page.data) || [];
  }, [data]);

  const filteredJobs = useMemo(() => {
    if (!searchQuery.trim()) return jobs;
    const query = searchQuery.toLowerCase();
    return jobs.filter((job) => 
      job.Title?.toLowerCase().includes(query) ||
      job.Description.toLowerCase().includes(query) ||
      job.LocationCoordinates?.toLowerCase().includes(query)
    );
  }, [jobs, searchQuery]);

  // Compute WTA Score Tier
  const wtaScore = user?.WTA_Score ?? 0;
  const getTier = (score: number) => {
    if (score >= 80) return { label: 'Top Rated Pro', color: 'text-emerald', bar: 'bg-emerald' };
    if (score >= 50) return { label: 'Established Artisan', color: 'text-trust-blue', bar: 'bg-trust-blue' };
    return { label: 'Rising Artisan', color: 'text-amber', bar: 'bg-amber' };
  };
  const tier = getTier(wtaScore);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Top Welcome Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-surface/40 p-6 rounded-2xl border border-border/60 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-white tracking-tight">
              Artisan Job Feed
            </h1>
            {user?.KYC_Verified ? (
              <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
                <AlertCircle className="w-3.5 h-3.5" /> KYC Pending
              </span>
            )}
          </div>
          <p className="text-text-secondary text-sm">
            Discover verified client requests, submit proposals, and get paid securely with guaranteed escrow.
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => refetch()} 
          disabled={isFetching}
          className="shadow-sm border-border/80 hover:bg-surface"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isFetching ? 'animate-spin' : ''}`} />
          {isFetching ? 'Refreshing...' : 'Refresh Feed'}
        </Button>
      </div>

      {/* Metrics & Reputation Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* WTA Score Tile */}
        <div className="bg-surface/70 backdrop-blur-md border border-trust-blue/20 rounded-2xl p-5 hover:border-trust-blue/40 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-text-secondary">WTA Trust Score</span>
            <div className="w-10 h-10 rounded-xl bg-trust-blue/10 border border-trust-blue/20 flex items-center justify-center text-trust-blue">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-3xl font-heading font-extrabold text-white">{wtaScore.toFixed(1)}</span>
              <span className="text-sm text-text-muted">/ 100</span>
              <span className={`text-xs font-semibold ml-auto ${tier.color}`}>{tier.label}</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden mt-2">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${tier.bar}`} 
                style={{ width: `${Math.min(Math.max(wtaScore, 5), 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Verification Status Tile */}
        <div className={`bg-surface/70 backdrop-blur-md border rounded-2xl p-5 flex flex-col justify-between transition-all ${
          user?.KYC_Verified ? 'border-emerald/20 hover:border-emerald/40' : 'border-amber/20 hover:border-amber/40'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-text-secondary">Identity Verification</span>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
              user?.KYC_Verified ? 'bg-emerald/10 text-emerald border-emerald/20' : 'bg-amber/10 text-amber border-amber/20'
            }`}>
              {user?.KYC_Verified ? <ShieldCheck className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            </div>
          </div>
          <div>
            <div className="font-heading font-bold text-white text-lg">
              {user?.KYC_Verified ? 'Fully Verified' : 'Action Required'}
            </div>
            <p className="text-xs text-text-muted mt-0.5">
              {user?.KYC_Verified ? 'Eligible for all high-value escrow jobs' : 'Complete KYC to unlock full client trust'}
            </p>
            {!user?.KYC_Verified && (
              <Link to="/artisan/kyc" className="mt-3 inline-flex items-center text-xs font-semibold text-amber hover:underline">
                Complete Verification <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            )}
          </div>
        </div>

        {/* Available Jobs Count Tile */}
        <StatCard 
          label="Available Jobs" 
          value={jobs.length} 
          icon={Briefcase} 
          variant="blue"
          subtext="Active client requests in feed"
        />
      </div>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between border-b border-border/80 pb-4">
        <div className="text-sm font-medium text-text-secondary">
          Showing {filteredJobs.length} open service request{filteredJobs.length !== 1 ? 's' : ''}
        </div>
        <div className="relative min-w-[260px] sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search by title, description, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface/60 border border-border/80 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-text-muted focus:outline-none focus:border-trust-blue transition-colors font-body"
          />
        </div>
      </div>

      {/* Job Feed Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <JobCardSkeleton />
          <JobCardSkeleton />
          <JobCardSkeleton />
        </div>
      ) : isError ? (
        <div className="text-center py-12 bg-rose-500/10 border border-rose-500/20 rounded-2xl p-6 text-rose-300">
          Failed to load job feed. Please verify your connection and refresh.
        </div>
      ) : filteredJobs.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title={searchQuery ? 'No matching jobs found' : 'No open jobs right now'}
          description={
            searchQuery
              ? `No requests match "${searchQuery}". Try searching for another service or location.`
              : 'New service requests appear here as clients post them. Hit refresh or check back shortly!'
          }
          actionText={searchQuery ? 'Clear Search' : 'Refresh Feed'}
          onAction={searchQuery ? () => setSearchQuery('') : () => refetch()}
          actionIcon={searchQuery ? undefined : RefreshCw}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <Link 
                key={job.RequestID} 
                to={`/artisan/job/${job.RequestID}`} 
                className="block focus:outline-none"
              >
                <JobCard job={job} />
              </Link>
            ))}
          </div>

          {hasNextPage && (
            <div className="flex justify-center pt-8">
              <Button 
                variant="outline" 
                onClick={() => fetchNextPage()} 
                disabled={isFetchingNextPage}
                className="px-8 shadow-sm"
              >
                {isFetchingNextPage ? 'Loading more jobs...' : 'Load More Jobs'}
              </Button>
            </div>
          )}
        </>
      )}

      {/* KYC Onboarding Modal */}
      <Modal
        isOpen={showKycModal}
        onClose={handleCloseKycModal}
        title="Boost Your Artisan Credibility"
      >
        <div className="space-y-4 text-text-secondary text-sm leading-relaxed">
          <div className="w-12 h-12 rounded-2xl bg-trust-blue/10 border border-trust-blue/20 flex items-center justify-center text-trust-blue mx-auto mb-2">
            <Sparkles className="w-6 h-6" />
          </div>
          <p className="text-center text-white font-medium text-base">
            Complete your Identity Verification (KYC) to stand out to clients.
          </p>
          <div className="bg-surface/80 border border-border/80 rounded-xl p-4 space-y-2.5">
            <div className="flex items-start gap-2 text-white">
              <ShieldCheck className="w-4 h-4 text-emerald mt-0.5 shrink-0" />
              <span><strong>Boost Trust:</strong> Verified artisans receive 3x more accepted bids.</span>
            </div>
            <div className="flex items-start gap-2 text-white">
              <Award className="w-4 h-4 text-trust-blue mt-0.5 shrink-0" />
              <span><strong>Unlock WTA Scoring:</strong> Increase your visibility in client search rankings.</span>
            </div>
            <div className="flex items-start gap-2 text-white">
              <Briefcase className="w-4 h-4 text-amber mt-0.5 shrink-0" />
              <span><strong>Access High-Budget Jobs:</strong> Eligible for premium escrow-secured tasks.</span>
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <Button variant="ghost" onClick={handleCloseKycModal}>
              Explore First
            </Button>
            <Link to="/artisan/kyc" onClick={handleCloseKycModal}>
              <Button variant="primary">
                Verify Identity Now
              </Button>
            </Link>
          </div>
        </div>
      </Modal>
    </div>
  );
}
