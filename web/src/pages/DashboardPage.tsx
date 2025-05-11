import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUserInfo } from "../store/slices/authSlice";
import { fetchStores, deleteStore } from "../store/slices/storeSlice";
import type { AppDispatch, RootState } from "../store";
import UnauthorizedPage from "./UnauthorizedPage";
import axiosInstance from "../utils/axios";

interface UserInfo {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

interface Store {
  _id: number;
  name: string;
  owner: number;
  coverImage?: string;
  color?: string;
  createdAt: string;
  updatedAt: string;
}

const DashboardPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user: userInfo, loading: authLoading, error: authError } = useSelector((state: RootState) => state.auth);
  const { stores, loading: storesLoading, error: storesError } = useSelector((state: RootState) => state.store);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [deleteStoreId, setDeleteStoreId] = useState<number | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  console.log('Dashboard State:', { userInfo, authLoading, authError, isAuthorized, stores });

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

        console.log('Tokens from URL:', { accessToken, refreshToken });

        if (accessToken && refreshToken) {
          window.history.replaceState({}, document.title, window.location.pathname);
          axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
          console.log(axiosInstance.defaults.headers.common['Authorization']);
        }

        // Fetch user info using Redux thunk
        console.log('Fetching user info...');
        const result = await dispatch(getUserInfo()).unwrap();
        console.log('User info result:', result);
        
        // Fetch stores for the user
        if (result.id) {
          console.log('Fetching stores for user:', result.id);
          await dispatch(fetchStores(result.id)).unwrap();
        }
        
        setIsAuthorized(true);
      } catch (err) {
        console.error('Auth error:', err);
        setIsAuthorized(false);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
    };

    initializeAuth();
  }, [dispatch, location]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/login');
  };

  const handleDeleteStore = async (id: number) => {
    try {
      await dispatch(deleteStore(id)).unwrap();
      setIsDeleteModalOpen(false);
      setDeleteStoreId(null);
    } catch (error) {
      console.error('Failed to delete store:', error);
    }
  };

  const openDeleteModal = (storeId: number) => {
    setDeleteStoreId(storeId);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteStoreId(null);
    setIsDeleteModalOpen(false);
  };

  if (isAuthorized === false) {
    return <UnauthorizedPage />;
  }

  if (authError || storesError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700">{authError || storesError}</p>
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

  if (authLoading || storesLoading || !userInfo) {
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
              {/* No Stores Message */}
              {stores.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                  <div className="w-16 h-16 mb-4 text-gray-400 dark:text-gray-500">
                    <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No Stores Yet</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4 text-center">
                    Get started by creating your first store
                  </p>
                  <button
                    onClick={() => navigate("/create-store")}
                    className="px-4 py-2 bg-[#1a73e8] text-white rounded-lg hover:bg-[#1557b0] transition-colors"
                  >
                    Create Store
                  </button>
                </div>
              )}

              {/* Store Cards */}
              {stores.map((store) => (
                <div
                  key={store._id}
                  className="relative rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200 flex flex-col h-full bg-white dark:bg-gray-800 z-0"
                >
                  <Link to={`/store/${store._id}`}>
                    <div
                      className={`h-28 ${
                        defaultColors[0]
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
                        onClick={() => console.log("Edit store:", store._id)}
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
                        onClick={() => openDeleteModal(store._id)}
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

              {/* Add Store Card - Only show if there are stores */}
              {stores.length > 0 && (
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
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && deleteStoreId !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Delete Store
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to delete this store? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteStore(deleteStoreId)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;

