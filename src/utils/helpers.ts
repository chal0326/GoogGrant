import { Grant, Review } from '../types';

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const calculateAverageScore = (reviews: Review[]): number => {
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, review) => acc + review.score, 0);
  return Number((sum / reviews.length).toFixed(2));
};

export const getGrantStatus = (grant: Grant, reviews: Review[]): string => {
  switch (grant.status) {
    case 'draft':
      return 'Draft';
    case 'submitted':
      return 'Pending Review';
    case 'under_review':
      return `Under Review (${reviews.length} reviews)`;
    case 'approved':
      return `Approved (Score: ${calculateAverageScore(reviews)})`;
    case 'rejected':
      return `Rejected (Score: ${calculateAverageScore(reviews)})`;
    default:
      return 'Unknown Status';
  }
};

export const truncateText = (text: string, maxLength: number = 100): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

export const validateGrantData = (data: Partial<Grant>): string[] => {
  const errors: string[] = [];
  
  if (!data.title?.trim()) {
    errors.push('Title is required');
  }
  
  if (!data.content?.trim()) {
    errors.push('Content is required');
  }
  
  if (data.title && data.title.length > 200) {
    errors.push('Title must be less than 200 characters');
  }
  
  return errors;
};

export const validateReviewData = (data: Partial<Review>): string[] => {
  const errors: string[] = [];
  
  if (!data.comments?.trim()) {
    errors.push('Comments are required');
  }
  
  if (typeof data.score !== 'number' || data.score < 0 || data.score > 10) {
    errors.push('Score must be between 0 and 10');
  }
  
  return errors;
};
