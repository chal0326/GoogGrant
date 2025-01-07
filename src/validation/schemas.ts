import { z } from 'zod';
import { VALIDATION } from '../constants';

export const grantSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(VALIDATION.GRANT_TITLE_MAX_LENGTH, `Title must be less than ${VALIDATION.GRANT_TITLE_MAX_LENGTH} characters`),
  content: z.string()
    .min(VALIDATION.GRANT_CONTENT_MIN_LENGTH, `Content must be at least ${VALIDATION.GRANT_CONTENT_MIN_LENGTH} characters`)
    .max(50000, 'Content is too long'),
  status: z.enum(['draft', 'submitted', 'under_review', 'approved', 'rejected'])
    .optional(),
});

export const reviewSchema = z.object({
  comments: z.string()
    .min(VALIDATION.REVIEW_COMMENT_MIN_LENGTH, `Comments must be at least ${VALIDATION.REVIEW_COMMENT_MIN_LENGTH} characters`),
  score: z.number()
    .min(VALIDATION.REVIEW_SCORE_MIN, `Score must be at least ${VALIDATION.REVIEW_SCORE_MIN}`)
    .max(VALIDATION.REVIEW_SCORE_MAX, `Score must be at most ${VALIDATION.REVIEW_SCORE_MAX}`),
  status: z.enum(['pending', 'completed'])
    .optional(),
});

export const userProfileSchema = z.object({
  email: z.string()
    .email('Invalid email address'),
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name is too long'),
  bio: z.string()
    .max(500, 'Bio must be less than 500 characters')
    .optional(),
  role: z.enum(['admin', 'reviewer', 'applicant'])
    .optional(),
});

export type GrantFormData = z.infer<typeof grantSchema>;
export type ReviewFormData = z.infer<typeof reviewSchema>;
export type UserProfileFormData = z.infer<typeof userProfileSchema>;

// Helper function to validate data against schemas
export const validateData = <T>(schema: z.ZodSchema<T>, data: unknown): { 
  success: boolean; 
  data?: T; 
  errors?: Record<string, string>; 
} => {
  try {
    const validData = schema.parse(data);
    return { success: true, data: validData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.reduce((acc, curr) => ({
        ...acc,
        [curr.path[0]]: curr.message,
      }), {});
      return { success: false, errors };
    }
    return { success: false, errors: { _error: 'Validation failed' } };
  }
};
