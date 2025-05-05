import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login');
    }, 3000); // Redirect after 3 seconds

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa] dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md w-full max-w-md text-center">
        <div className="mb-4">
          <svg
            className="w-16 h-16 mx-auto text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Unauthorized Access
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          You need to be logged in to access this page.
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Redirecting to login page in a few seconds...
        </p>
        <button
          onClick={() => navigate('/login')}
          className="mt-4 px-4 py-2 bg-[#1a73e8] text-white rounded-lg hover:bg-[#1967d2] transition"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
};

export default UnauthorizedPage; 