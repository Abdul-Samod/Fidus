import { Link } from 'react-router-dom';
import { useInfiniteQuery } from '@tanstack/react-query';
import { serviceApi } from '../../services/api';
import { JobCard } from '../../components/JobCard';
import { Button } from '../../components/ui/Button';
import { Loader } from '../../components/ui/Loader';
import { RefreshCw, Search } from 'lucide-react';
import type { PaginatedResponse, ServiceRequest } from '../../types';

export default function ArtisanDashboard() {
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

  const jobs = data?.pages.flatMap((page) => page.data) || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-white mb-2">Job Feed & Active Bids</h1>
          <p className="text-text-secondary font-body">Browse open service requests and track your bids</p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => refetch()} 
          disabled={isFetching}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isFetching ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader />
        </div>
      ) : isError ? (
        <div className="text-rose">Failed to load open jobs.</div>
      ) : jobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-surface border border-border rounded-xl">
          <Search className="w-12 h-12 text-text-muted mb-4" />
          <h3 className="text-xl font-heading text-white mb-2">No open jobs at the moment</h3>
          <p className="text-text-secondary font-body">Check back later!</p>
        </div>
      ) : (
        <>
          <p className="text-text-secondary font-body">{jobs.length} open service request{jobs.length !== 1 ? 's' : ''}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <Link key={job.RequestID} to={`/artisan/job/${job.RequestID}`} className="block transition-transform hover:-translate-y-1">
                <JobCard job={job} />
              </Link>
            ))}
          </div>
          {hasNextPage && (
            <div className="flex justify-center pt-4">
              <Button 
                variant="outline" 
                onClick={() => fetchNextPage()} 
                disabled={isFetchingNextPage}
              >
                {isFetchingNextPage ? 'Loading...' : 'Load More'}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
