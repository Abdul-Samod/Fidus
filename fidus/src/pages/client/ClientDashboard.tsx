import { Link } from 'react-router-dom';
import { Plus, Inbox } from 'lucide-react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { serviceApi } from '../../services/api';
import { Loader } from '../../components/ui/Loader';
import { JobCard } from '../../components/JobCard';
import { Button } from '../../components/ui/Button';
import type { PaginatedResponse, ServiceRequest } from '../../types';

export default function ClientDashboard() {
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

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (isError) {
    return <div className="text-rose">Failed to load service requests.</div>;
  }

  const requests = data?.pages.flatMap((page) => page.data) || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-heading text-white">My Service Requests</h1>
          <p className="text-text-secondary font-body">{requests.length} service request{requests.length !== 1 && 's'}</p>
        </div>
        <Link to="/client/create-job">
          <Button>
            <Plus className="w-5 h-5 mr-2" />
            Create New Job
          </Button>
        </Link>
      </div>

      {requests.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-surface border border-border rounded-xl">
          <Inbox className="w-16 h-16 text-text-muted mb-4" />
          <p className="text-text-primary font-body text-lg">No service requests yet</p>
          <Link to="/client/create-job" className="mt-4 text-trust-blue hover:underline font-body">
            Post your first job
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {requests.map((job) => (
              <Link key={job.RequestID} to={`/client/job/${job.RequestID}`} className="block transition-transform hover:-translate-y-1">
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
