import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import UnauthorizedPage from "./UnauthorizedPage";

interface UserInfo {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

interface Store {
  id: string;
  name: string;
  owner: string;
  coverImage?: string;
  color?: string;
}

const DashboardPage: React.FC = () => {
  const [stores, setStores] = useState<Store[]>([
    {
      id: "1",
      name: "Main Store",
      owner: "John Doe",
      color: "bg-[#1967d2]",
    },
    {
      id: "2",
      name: "Branch Store",
      owner: "Jane Smith",
      color: "bg-[#1e8e3e]",
    },
    {
      id: "3",
      name: "Downtown Store",
      owner: "Mike Johnson",
      color: "bg-[#d93025]",
    },
  ]);

  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const defaultColors = [
    "bg-[#1967d2]", // Blue
    "bg-[#1e8e3e]", // Green
    "bg-[#d93025]", // Red
    "bg-[#e37400]", // Orange
    "bg-[#9334e6]", // Purple
  ];

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // First check URL parameters for tokens (from Google login)
        const params = new URLSearchParams(location.search);
        const accessToken = params.get('accessToken');
        const refreshToken = params.get('refreshToken');

        if (accessToken && refreshToken) {
          // Store tokens from Google login
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);
          axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
          
          // Remove tokens from URL for security
          window.history.replaceState({}, document.title, window.location.pathname);
          
          // Fetch user info immediately after storing tokens
          const response = await axios.get('http://localhost:5000/api/auth/user-info');
          setUserInfo(response.data);
          setIsAuthorized(true);
          return;
        }

        // If no tokens in URL, check localStorage
        const storedAccessToken = localStorage.getItem('accessToken');
        if (!storedAccessToken) {
          setIsAuthorized(false);
          return;
        }

        // Set authorization header for subsequent requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${storedAccessToken}`;

        // Fetch user information
        const response = await axios.get('http://localhost:5000/api/auth/user-info');
        setUserInfo(response.data);
        setIsAuthorized(true);
      } catch (err) {
        console.error('Auth error:', err);
        setError('Failed to authenticate');
        setIsAuthorized(false);
        // Clear invalid tokens
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        delete axios.defaults.headers.common['Authorization'];
      }
    };

    initializeAuth();
  }, [navigate, location]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    delete axios.defaults.headers.common['Authorization'];
    navigate('/login');
  };

  const handleDeleteStore = (id: string) => {
    setStores((prev) => prev.filter((store) => store.id !== id));
  };

  if (isAuthorized === false) {
    return <UnauthorizedPage />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700">{error}</p>
          <button
            onClick={() => navigate('/login')}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  if (!userInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-gray-900">
      <Navbar
        userName={userInfo.name}
        userEmail={userInfo.email}
        userImage={userInfo.picture}
        onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
        onLogout={handleLogout}
      />
      <div className="flex">
        <Sidebar isOpen={isSidebarOpen} />

        <div className="flex-1 pt-16 transition-all duration-200">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-medium text-gray-900 dark:text-white">
                Stores
              </h1>
              <div className="flex items-center space-x-4">
                {userInfo.picture && (
                  <img
                    src={userInfo.picture}
                    alt="Profile"
                    className="h-10 w-10 rounded-full"
                  />
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-stretch">
              {/* Store Cards */}
              {stores.map((store) => (
                <div
                  key={store.id}
                  className="relative rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200 flex flex-col h-full bg-white dark:bg-gray-800 z-0"
                >
                  <Link to={`/store/${store.id}`}>
                    <div
                      className={`h-28 ${
                        store.color || defaultColors[0]
                      } relative p-6`}
                    >
                      <h2 className="text-xl font-medium text-white">
                        {store.name}
                      </h2>
                      <p className="text-white/90 text-sm mt-1">
                        {store.owner}
                      </p>
                    </div>
                  </Link>
                  <div className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 mt-auto">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => console.log("Edit store:", store.id)}
                        className="p-2 text-gray-600 dark:text-gray-300 hover:text-[#1a73e8] dark:hover:text-[#1a73e8] hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteStore(store.id)}
                        className="p-2 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {/* Add Store Card */}
              <div
                onClick={() => navigate("/create-store")}
                className="relative rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer flex flex-col h-full"
              >
                <div className="h-28 bg-white dark:bg-gray-800 relative p-6 flex flex-col items-center justify-center flex-1">
                  <div className="w-12 h-12 rounded-full bg-[#1a73e8]/10 dark:bg-[#1a73e8]/20 flex items-center justify-center mb-2">
                    <svg
                      className="w-6 h-6 text-[#1a73e8]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </div>
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                    Add New Store
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
