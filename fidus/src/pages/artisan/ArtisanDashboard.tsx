import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { serviceApi } from '../../services/api';
import { JobCard } from '../../components/JobCard';
import { Button } from '../../components/ui/Button';
import { Loader } from '../../components/ui/Loader';
import { RefreshCw, Search } from 'lucide-react';

export default function ArtisanDashboard() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await serviceApi.getOpen();
      const data = response.data?.data || response.data || [];
      setJobs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-white mb-2">Job Feed & Active Bids</h1>
          <p className="text-text-secondary font-body">Browse open service requests and track your bids</p>
        </div>
        <Button 
          variant="outline" 
          onClick={fetchJobs} 
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader />
        </div>
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
        </>
      )}
    </div>
  );
}
