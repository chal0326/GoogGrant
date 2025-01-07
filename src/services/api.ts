import { apiClient } from '../lib/api-client';
import { Grant, Review, User } from '../types';
import { API_ENDPOINTS } from '../constants';

export const grantService = {
  getAll: async () => {
    const response = await apiClient.get(API_ENDPOINTS.GRANTS);
    return response.data as Grant[];
  },

  getById: async (id: string) => {
    const response = await apiClient.get(`${API_ENDPOINTS.GRANTS}/${id}`);
    return response.data as Grant;
  },

  create: async (data: Partial<Grant>) => {
    const response = await apiClient.post(API_ENDPOINTS.GRANTS, data);
    return response.data as Grant;
  },

  update: async (id: string, data: Partial<Grant>) => {
    const response = await apiClient.patch(`${API_ENDPOINTS.GRANTS}/${id}`, data);
    return response.data as Grant;
  },

  delete: async (id: string) => {
    await apiClient.delete(`${API_ENDPOINTS.GRANTS}/${id}`);
  }
};

export const reviewService = {
  getAllForGrant: async (grantId: string) => {
    const response = await apiClient.get(`${API_ENDPOINTS.GRANTS}/${grantId}/reviews`);
    return response.data as Review[];
  },

  create: async (grantId: string, data: Partial<Review>) => {
    const response = await apiClient.post(`${API_ENDPOINTS.GRANTS}/${grantId}/reviews`, data);
    return response.data as Review;
  },

  update: async (grantId: string, reviewId: string, data: Partial<Review>) => {
    const response = await apiClient.patch(
      `${API_ENDPOINTS.GRANTS}/${grantId}/reviews/${reviewId}`,
      data
    );
    return response.data as Review;
  }
};

export const userService = {
  getProfile: async () => {
    const response = await apiClient.get(`${API_ENDPOINTS.USERS}/profile`);
    return response.data as User;
  },

  updateProfile: async (data: Partial<User>) => {
    const response = await apiClient.patch(`${API_ENDPOINTS.USERS}/profile`, data);
    return response.data as User;
  },

  getReviewers: async () => {
    const response = await apiClient.get(`${API_ENDPOINTS.USERS}/reviewers`);
    return response.data as User[];
  }
};
