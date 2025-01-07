export const GRANT_STATUSES = {
  DRAFT: 'draft',
  SUBMITTED: 'submitted',
  UNDER_REVIEW: 'under_review',
  APPROVED: 'approved',
  REJECTED: 'rejected'
} as const;

export const USER_ROLES = {
  ADMIN: 'admin',
  REVIEWER: 'reviewer',
  APPLICANT: 'applicant'
} as const;

export const REVIEW_STATUSES = {
  PENDING: 'pending',
  COMPLETED: 'completed'
} as const;

export const API_ENDPOINTS = {
  GRANTS: '/grants',
  REVIEWS: '/reviews',
  AUTH: '/auth',
  USERS: '/users'
} as const;

export const VALIDATION = {
  GRANT_TITLE_MAX_LENGTH: 200,
  GRANT_CONTENT_MIN_LENGTH: 100,
  REVIEW_SCORE_MIN: 0,
  REVIEW_SCORE_MAX: 10,
  REVIEW_COMMENT_MIN_LENGTH: 50
} as const;

export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'You are not authorized to perform this action',
  INVALID_CREDENTIALS: 'Invalid email or password',
  NETWORK_ERROR: 'Network error occurred. Please try again',
  GRANT_NOT_FOUND: 'Grant not found',
  REVIEW_NOT_FOUND: 'Review not found',
  INVALID_GRANT_DATA: 'Invalid grant data',
  INVALID_REVIEW_DATA: 'Invalid review data'
} as const;
