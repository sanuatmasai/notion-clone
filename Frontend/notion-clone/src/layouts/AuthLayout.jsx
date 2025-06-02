import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';
import { BeatLoader } from 'react-spinners';

const AuthLayout = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Small delay to prevent flash of auth screen
    const timer = setTimeout(() => {
      setIsCheckingAuth(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Show loading spinner while checking auth state
  if (loading || isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <BeatLoader color="#3b82f6" />
      </div>
    );
  }

  // If user is already authenticated, redirect to dashboard or intended page
  if (currentUser) {
    const from = location.state?.from?.pathname || '/dashboard';
    return <Navigate to={from} state={{ from: location }} replace />;
  }

  return (
    <div className="min-h-screen flex flex-col justify-center">

      <div className="sm:mx-auto sm:w-full">
        <div className="">
          {children}
        </div>
        
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            By continuing, you agree to our{' '}
            <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
