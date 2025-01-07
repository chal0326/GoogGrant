import { useState, useEffect } from 'react';
import { Grant } from '../types';
import { apiClient } from '../lib/api-client';

export function useGrant(grantId: string | undefined) {
  const [grant, setGrant] = useState<Grant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!grantId) {
      setLoading(false);
      return;
    }

    const fetchGrant = async () => {
      try {
        const response = await apiClient.get(`/grants/${grantId}`);
        setGrant(response.data);
        setError(null);
      } catch (err) {
        setError(err as Error);
        setGrant(null);
      } finally {
        setLoading(false);
      }
    };

    fetchGrant();
  }, [grantId]);

  const updateGrant = async (updatedData: Partial<Grant>) => {
    if (!grantId) return;
    
    setLoading(true);
    try {
      const response = await apiClient.patch(`/grants/${grantId}`, updatedData);
      setGrant(response.data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return { grant, loading, error, updateGrant };
}
