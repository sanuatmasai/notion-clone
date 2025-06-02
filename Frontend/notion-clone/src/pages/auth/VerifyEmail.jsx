import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState('Verifying your email...');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const { verifyEmail } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      const oobCode = searchParams.get('oobCode');
      
      if (!oobCode) {
        setError('Invalid verification link');
        setLoading(false);
        return;
      }

      try {
        await verifyEmail(oobCode);
        setMessage('Email verified successfully! Redirecting to login...');
        
        // Auto-redirect after a short delay
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } catch (err) {
        console.error('Email verification error:', err);
        setError('Failed to verify email. ' + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [searchParams, verifyEmail, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Email Verification
          </h2>
        </div>

        <div className="bg-white py-8 px-4 shadow rounded-lg sm:px-10">
          {loading ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-center text-gray-700">{message}</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
              <div className="mt-4 text-center">
                <button
                  onClick={() => navigate('/')}
                  className="text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  Return to home
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="mt-2 text-lg font-medium text-gray-900">Email Verified!</h3>
              <p className="mt-1 text-sm text-gray-500">
                Your email has been successfully verified. You can now sign in to your account.
              </p>
              <div className="mt-6">
                <button
                  onClick={() => navigate('/login')}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Go to Login
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
