import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import { serviceApi } from '../../services/api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';

export default function CreateJob() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    Title: '',
    Description: '',
    LocationCoordinates: '',
  });
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const TITLE_MAX = 100;
  const DESC_MAX = 1000;

  const createJobMutation = useMutation({
    mutationFn: (data: any) => serviceApi.create(data),
    onSuccess: () => {
      toast.success('Job posted successfully!');
      queryClient.invalidateQueries({ queryKey: ['myRequests'] });
      queryClient.invalidateQueries({ queryKey: ['openJobs'] });
      navigate('/client');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create job');
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.Title.length < 5 || formData.Title.length > TITLE_MAX) {
      toast.error(`Title must be between 5 and ${TITLE_MAX} characters`);
      return;
    }
    if (formData.Description.length < 10 || formData.Description.length > DESC_MAX) {
      toast.error(`Description must be between 10 and ${DESC_MAX} characters`);
      return;
    }
    if (!minPrice || !maxPrice || Number(minPrice) >= Number(maxPrice)) {
      toast.error('Please enter a valid price range (min price must be less than max price)');
      return;
    }

    createJobMutation.mutate({
      ...formData,
      PriceRange: `${minPrice} - ${maxPrice}`
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-heading text-white">Post a New Job</h1>
      
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="space-y-1">
            <Input
              label="Job Title"
              name="Title"
              value={formData.Title}
              onChange={handleChange}
              placeholder="e.g. Plumbing repair for kitchen sink"
              required
              maxLength={TITLE_MAX}
            />
            <div className={`text-xs text-right font-body ${formData.Title.length >= TITLE_MAX ? 'text-rose' : 'text-slate-500'}`}>
              {formData.Title.length} / {TITLE_MAX}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-300 font-body">Description</label>
            <textarea
              name="Description"
              value={formData.Description}
              onChange={handleChange}
              placeholder="Describe the service you need in detail..."
              className="w-full min-h-[120px] bg-deep-slate border border-border rounded-lg p-4 text-white font-body placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-trust-blue/50 focus:border-trust-blue transition-all"
              required
              maxLength={DESC_MAX}
            />
            <div className={`text-xs text-right font-body ${formData.Description.length >= DESC_MAX ? 'text-rose' : 'text-slate-500'}`}>
              {formData.Description.length} / {DESC_MAX}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 font-body">Location Coordinates</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-slate-500" />
              </div>
              <Input
                name="LocationCoordinates"
                value={formData.LocationCoordinates}
                onChange={handleChange}
                placeholder="e.g. 6.5244, 3.3792 or Full Address"
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 font-body">Price Range (NGN)</label>
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-slate-500 font-heading text-lg font-bold pl-1">₦</span>
                </div>
                <Input
                  type="number"
                  min="0"
                  name="minPrice"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  placeholder="Min Price"
                  className="pl-10"
                  required
                />
              </div>
              <span className="text-slate-400 font-bold">-</span>
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-slate-500 font-heading text-lg font-bold pl-1">₦</span>
                </div>
                <Input
                  type="number"
                  min="0"
                  name="maxPrice"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="Max Price"
                  className="pl-10"
                  required
                />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-trust-blue hover:bg-blue-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all"
            disabled={createJobMutation.isPending || formData.Title.length > TITLE_MAX || formData.Description.length > DESC_MAX}
          >
            {createJobMutation.isPending ? 'Posting...' : 'Post Job'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
