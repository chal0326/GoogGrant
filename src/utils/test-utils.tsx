import React from 'react';
import { render as rtlRender, RenderOptions } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import { theme } from '../theme';
import { AuthProvider } from '../context/AuthContext';

function AllProviders({ children }: { children: React.ReactNode }) {
  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </AuthProvider>
    </ChakraProvider>
  );
}

function render(ui: React.ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  return rtlRender(ui, { wrapper: AllProviders, ...options });
}

// Mock data generators
export const mockGrant = (overrides = {}) => ({
  id: 'test-grant-id',
  title: 'Test Grant',
  content: 'Test grant content',
  status: 'draft',
  applicantId: 'test-user-id',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides
});

export const mockReview = (overrides = {}) => ({
  id: 'test-review-id',
  grantId: 'test-grant-id',
  reviewerId: 'test-reviewer-id',
  comments: 'Test review comments',
  score: 8,
  status: 'pending',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides
});

export const mockUser = (overrides = {}) => ({
  id: 'test-user-id',
  email: 'test@example.com',
  role: 'applicant',
  ...overrides
});

// Re-export everything
export * from '@testing-library/react';
export { render };
