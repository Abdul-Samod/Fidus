import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Briefcase, Clock, CheckCircle2, Shield, Search } from 'lucide-react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { serviceApi } from '../../services/api';
import { JobCard } from '../../components/JobCard';
import { Button } from '../../components/ui/Button';
import { StatCard } from '../../components/ui/StatCard';
import { EmptyState } from '../../components/ui/EmptyState';
import { JobCardSkeleton, StatCardSkeleton } from '../../components/ui/Skeleton';
import type { PaginatedResponse, ServiceRequest } from '../../types';

export default function ClientDashboard() {
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'Open' | 'Assigned' | 'Completed'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery<PaginatedResponse<ServiceRequest>, Error>({
    queryKey: ['myRequests'],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await serviceApi.getMyRequests(pageParam as number, 10);
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

  const requests = useMemo(() => {
    return data?.pages.flatMap((page) => page.data) || [];
  }, [data]);

  // Dynamic statistics
  const stats = useMemo(() => {
    const total = requests.length;
    const open = requests.filter((r) => r.Status === 'Open').length;
    const assigned = requests.filter((r) => r.Status === 'Assigned').length;
    const completed = requests.filter((r) => r.Status === 'Completed').length;
    return { total, open, assigned, completed };
  }, [requests]);

  // Filter and search
  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      const matchesFilter = selectedFilter === 'ALL' || r.Status === selectedFilter;
      const matchesSearch = !searchQuery || 
        r.Title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.Description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [requests, selectedFilter, searchQuery]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Top Welcome & Action */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface/40 p-6 rounded-2xl border border-border/60 backdrop-blur-md">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-white tracking-tight">
            Client Dashboard
          </h1>
          <p className="text-text-secondary text-sm mt-1">
            Manage your service requests, review incoming artisan bids, and track escrow payments.
          </p>
        </div>
        <Link to="/client/create-job">
          <Button variant="primary" size="md" className="shadow-lg shadow-trust-blue/20">
            <Plus className="w-5 h-5 mr-2" />
            Post New Job
          </Button>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <StatCard 
              label="Total Requests" 
              value={stats.total} 
              icon={Briefcase} 
              variant="blue"
              subtext="Lifetime posted jobs"
            />
            <StatCard 
              label="Awaiting Bids" 
              value={stats.open} 
              icon={Clock} 
              variant="amber"
              subtext="Open for artisan offers"
            />
            <StatCard 
              label="In Progress" 
              value={stats.assigned} 
              icon={Shield} 
              variant="purple"
              subtext="Under escrow protection"
            />
            <StatCard 
              label="Completed" 
              value={stats.completed} 
              icon={CheckCircle2} 
              variant="emerald"
              subtext="Successfully finalized"
            />
          </>
        )}
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between border-b border-border/80 pb-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
          {(['ALL', 'Open', 'Assigned', 'Completed'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                selectedFilter === filter
                  ? 'bg-trust-blue text-white shadow-md shadow-trust-blue/30'
                  : 'bg-surface/60 text-text-secondary hover:text-white hover:bg-surface border border-border/60'
              }`}
            >
              {filter === 'ALL' ? 'All Requests' : filter}
              {filter === 'ALL' && requests.length > 0 && ` (${requests.length})`}
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px] md:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search your jobs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface/60 border border-border/80 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-text-muted focus:outline-none focus:border-trust-blue transition-colors font-body"
          />
        </div>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <JobCardSkeleton />
          <JobCardSkeleton />
          <JobCardSkeleton />
        </div>
      ) : isError ? (
        <div className="text-center py-12 bg-rose-500/10 border border-rose-500/20 rounded-2xl p-6 text-rose-300">
          Failed to load service requests. Please check your connection and retry.
        </div>
      ) : filteredRequests.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title={searchQuery ? 'No matching requests found' : 'No service requests yet'}
          description={
            searchQuery
              ? `No service requests match your search "${searchQuery}". Try a different keyword.`
              : 'Post your first service request to connect with verified local artisans and receive competitive bids.'
          }
          actionText={searchQuery ? 'Clear Search' : 'Post Your First Job'}
          onAction={searchQuery ? () => setSearchQuery('') : () => window.location.assign('/client/create-job')}
          actionIcon={searchQuery ? undefined : Plus}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRequests.map((job) => (
              <Link 
                key={job.RequestID} 
                to={`/client/job/${job.RequestID}`} 
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
                {isFetchingNextPage ? 'Loading more jobs...' : 'Load More Requests'}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
