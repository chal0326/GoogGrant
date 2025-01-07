import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import React from 'react';

// Lazy load pages for better performance
const Home = React.lazy(() => import('../pages/Home'));
const Templates = React.lazy(() => import('../pages/Templates'));
const Auth = React.lazy(() => import('../pages/Auth.jsx'));
const GrantEditor = React.lazy(() => import('../pages/GrantEditor'));

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string[];
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (requiredRole && !requiredRole.includes(user.role || '')) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const routes = [
  {
    path: '/',
    element: <Layout><Outlet /></Layout>,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
      },
      {
        path: 'editor',
        element: (
          <ProtectedRoute>
            <GrantEditor />
          </ProtectedRoute>
        ),
      },
      {
        path: 'templates',
        element: (
          <ProtectedRoute>
            <Templates />
          </ProtectedRoute>
        ),
      },
      {
        path: 'auth',
        element: <Auth />,
      },
    ],
  },
];

const router = createBrowserRouter(routes);

export function AppRouter() {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <RouterProvider router={router} />
    </React.Suspense>
  );
}
