
import { useState, useEffect } from 'react';
import { fetchRecentActivity, type RecentActivity } from '@/services/activityService';

export const useRecentActivity = () => {
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching recent activity...');
      const data = await fetchRecentActivity();
      console.log('Recent activity data:', data);
      setActivities(data);
    } catch (err) {
      console.error('Error in useRecentActivity:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch activities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  return {
    activities,
    loading,
    error,
    refetch: fetchActivities
  };
};
