import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { ErrorBoundary } from 'react-error-boundary';
import { useEffect, useState } from 'react';
import { FiAlertTriangle, FiRefreshCw } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

// Layouts
import AuthLayout from './layouts/AuthLayout';
import MainLayout from './layouts/MainLayout';

// Pages
import LandingPage from './pages/LandingPage';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import VerifyEmail from './pages/auth/VerifyEmail';
import Dashboard from './pages/dashboard/Dashboard';
import Pages from './pages/Pages';
import Templates from './pages/Templates';
import Settings from './pages/Settings';
import Pricing from './pages/Pricing';
import PageDetail from './pages/PageDetail';
import NotFound from './pages/NotFound';
import Profile from './pages/Profile';
import WorkspaceOverview from './components/workspace/WorkspaceOverview';

// Context
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { WorkspaceProvider } from './contexts/WorkspaceContext';
import { PageProvider } from './contexts/PageContext';
import { ModalProvider } from './contexts/ModalContext';
import PageList from './components/pages/PageList';
import PageEditor from './components/pages/PageEditor';

// Initialize QueryClient with default options
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 15 * 60 * 1000, // 15 minutes
    },
  },
});

// Error Fallback Component
const ErrorFallback = ({ error, resetErrorBoundary }) => {
  const { t } = useTranslation('common');
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20">
          <FiAlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
        </div>
        <h2 className="mt-3 text-xl font-bold text-gray-900 dark:text-white">
          {t('error.title', 'Something went wrong')}
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          {error?.message || t('error.generic', 'An unexpected error occurred. Please try again.')}
        </p>
        <div className="mt-6">
          <button
            onClick={resetErrorBoundary}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-700 dark:hover:bg-blue-600"
          >
            <FiRefreshCw className="-ml-1 mr-2 h-4 w-4" />
            {t('actions.retry', 'Try again')}
          </button>
        </div>
      </div>
    </div>
  );
};

// Protected Route Component
const ProtectedRoute = ({ children, requiredRoles = [] }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();
  const [isAuthorized, setIsAuthorized] = useState(true);

  useEffect(() => {
    if (!loading && currentUser && requiredRoles.length > 0) {
      // Check if user has any of the required roles
      const hasRequiredRole = requiredRoles.some(role => 
        currentUser.roles?.includes(role)
      );
      setIsAuthorized(hasRequiredRole);
    }
  }, [currentUser, loading, requiredRoles]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAuthorized) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  return children;
};

// Public Only Route Component
const PublicOnlyRoute = ({ children }) => {
  const { currentUser } = useAuth();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || '/dashboard';
  
  return currentUser ? (
    <Navigate to={redirectTo} replace />
  ) : (
    <AuthLayout>{children}</AuthLayout>
  );
};

// App Component
function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <WorkspaceProvider>
            <PageProvider>
              <ModalProvider>
                <Toaster 
                  position="top-right" 
                  toastOptions={{
                    duration: 5000,
                    style: {
                      borderRadius: '0.5rem',
                      background: '#1f2937',
                      color: '#fff',
                    },
                    success: {
                      duration: 3000,
                      iconTheme: {
                        primary: '#10B981',
                        secondary: '#fff',
                      },
                    },
                    error: {
                      iconTheme: {
                        primary: '#EF4444',
                        secondary: '#fff',
                      },
                    },
                  }}
                />
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/app" element={<Home />} />
                  
                  {/* Auth Routes - Only accessible when not logged in */}
                  <Route
                    path="/login"
                    element={
                      <PublicOnlyRoute>
                        <Login />
                      </PublicOnlyRoute>
                    }
                  />
                  <Route
                    path="/register"
                    element={
                      <PublicOnlyRoute>
                        <Register />
                      </PublicOnlyRoute>
                    }
                  />
                  <Route
                    path="/forgot-password"
                    element={
                      <PublicOnlyRoute>
                        <ForgotPassword />
                      </PublicOnlyRoute>
                    }
                  />
                  <Route
                    path="/reset-password"
                    element={
                      <PublicOnlyRoute>
                        <ResetPassword />
                      </PublicOnlyRoute>
                    }
                  />
                  <Route
                    path="/verify-email"
                    element={
                      <PublicOnlyRoute>
                        <VerifyEmail />
                      </PublicOnlyRoute>
                    }
                  />
                  
                  {/* Workspace Routes */}
                  <Route path="/workspace" element={
                    <ProtectedRoute>
                      <MainLayout />
                    </ProtectedRoute>
                  }>
                    <Route 
                      index 
                      element={
                        <div className="p-6">
                          <h1 className="text-2xl font-bold text-gray-900">Select a workspace</h1>
                          <p className="mt-2 text-gray-600">Choose a workspace from the sidebar to get started.</p>
                        </div>
                      } 
                    />
                    
                    <Route 
                      path=":workspaceId" 
                      element={<WorkspaceOverview />} 
                    />
                    
                    <Route 
                      path=":workspaceId/pages" 
                      element={
                        <PageProvider>
                          <PageList />
                        </PageProvider>
                      }
                    />
                    
                    <Route 
                      path=":workspaceId/pages/:pageId" 
                      element={
                        <PageProvider>
                          <PageEditor />
                        </PageProvider>
                      }
                    />
                  </Route>

                  {/* Protected Routes - Wrapped in MainLayout */}
                  <Route element={
                    <ProtectedRoute>
                      <MainLayout />
                    </ProtectedRoute>
                  }>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/templates" element={<Templates />} />
                    <Route path="/pricing" element={<Pricing />} />
                    <Route 
                      path="/settings" 
                      element={
                        <Navigate to="/pricing" replace />
                      } 
                    />
                  </Route>
                  
                  {/* Error Pages */}
                  <Route path="/unauthorized" element={<div>Unauthorized</div>} />
                  
                  {/* 404 Page */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </ModalProvider>
            </PageProvider>
          </WorkspaceProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
