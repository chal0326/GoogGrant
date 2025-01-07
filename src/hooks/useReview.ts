import { useState, useEffect } from 'react';
import { Review } from '../types';
import { apiClient } from '../lib/api-client';

export function useReview(grantId: string | undefined) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!grantId) {
      setLoading(false);
      return;
    }

    const fetchReviews = async () => {
      try {
        const response = await apiClient.get(`/grants/${grantId}/reviews`);
        setReviews(response.data);
        setError(null);
      } catch (err) {
        setError(err as Error);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [grantId]);

  const submitReview = async (reviewData: Partial<Review>) => {
    if (!grantId) return;
    
    setLoading(true);
    try {
      const response = await apiClient.post(`/grants/${grantId}/reviews`, reviewData);
      setReviews(prev => [...prev, response.data]);
      setError(null);
      return response.data;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateReview = async (reviewId: string, updateData: Partial<Review>) => {
    if (!grantId) return;
    
    setLoading(true);
    try {
      const response = await apiClient.patch(`/grants/${grantId}/reviews/${reviewId}`, updateData);
      setReviews(prev => prev.map(review => 
        review.id === reviewId ? response.data : review
      ));
      setError(null);
      return response.data;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { reviews, loading, error, submitReview, updateReview };
}
