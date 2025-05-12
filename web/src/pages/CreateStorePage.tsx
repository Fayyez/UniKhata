import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { createStore } from '../store/slices/storeSlice';
import { getUserInfo } from '../store/slices/authSlice';
import type { AppDispatch, RootState } from '../store';
import UnauthorizedPage from "./UnauthorizedPage";

const CreateStorePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.store);
  const { user, loading: authLoading } = useSelector((state: RootState) => state.auth);
  const { stores } = useSelector((state: RootState) => state.store);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  
  const defaultColors = [
    'bg-[#1967d2]', // Blue
    'bg-[#1e8e3e]', // Green
    'bg-[#d93025]', // Red
    'bg-[#e37400]', // Orange
    'bg-[#9334e6]', // Purple
  ];

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/login');
  };

  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch user info when component mounts
  useEffect(() => {
    if (!user) {
      dispatch(getUserInfo());
    }
    console.log("user", user);
  }, [dispatch, user]);

  useEffect(() => {
    if (user) setIsAuthorized(true);
    else if (!authLoading) setIsAuthorized(false);
  }, [user, authLoading]);

  const [formData, setFormData] = useState({
    name: '',
    owner: 'placeholder',
    eCommerceIntegrations: [] as Array<{
      title: string;
      platform: string;
      email: string;
      apiEndpoint: string;
      token: string;
    }>,
    courierIntegrations: [] as Array<{
      title: string;
      courierName: string;
      emailOrCredential: string;
      apiEndpoint: string;
      token: string;
    }>
  });

  // Update owner ID when user data changes
  useEffect(() => {
    console.log("user", user);
    if (user?.id) {
      setFormData(prev => ({
        ...prev,
        owner: 'placeholder'
      }));
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Send only the required fields to backend
      const storeData = {
        name: formData.name,
        owner: user?.id || '',
        eCommerceIntegrations: formData.eCommerceIntegrations,
        courierIntegrations: formData.courierIntegrations
      };
      console.log('Creating store:', storeData);
      await dispatch(createStore(storeData)).unwrap();
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to create store:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addEcommerceIntegration = () => {
    setFormData(prev => ({
      ...prev,
      eCommerceIntegrations: [
        ...prev.eCommerceIntegrations,
        {
          title: '',
          platform: '',
          email: '',
          apiEndpoint: '',
          token: ''
        }
      ]
    }));
  };

  const addCourierIntegration = () => {
    setFormData(prev => ({
      ...prev,
      courierIntegrations: [
        ...prev.courierIntegrations,
        {
          title: '',
          courierName: '',
          emailOrCredential: '',
          apiEndpoint: '',
          token: ''
        }
      ]
    }));
  };

  const removeEcommerceIntegration = (index: number) => {
    setFormData(prev => ({
      ...prev,
      eCommerceIntegrations: prev.eCommerceIntegrations.filter((_, i) => i !== index)
    }));
  };

  const removeCourierIntegration = (index: number) => {
    setFormData(prev => ({
      ...prev,
      courierIntegrations: prev.courierIntegrations.filter((_, i) => i !== index)
    }));
  };

  const handleEcommerceIntegrationChange = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      eCommerceIntegrations: prev.eCommerceIntegrations.map((integration, i) => 
        i === index ? { ...integration, [field]: value } : integration
      )
    }));
  };

  const handleCourierIntegrationChange = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      courierIntegrations: prev.courierIntegrations.map((integration, i) => 
        i === index ? { ...integration, [field]: value } : integration
      )
    }));
  };

  if (!isAuthorized) {
    return <UnauthorizedPage />;
  }

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-gray-900">
      <Navbar 
        userName={user.name}
        userEmail={user.email}
        userImage={user.picture}
        onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
        onLogout={handleLogout}
      />
      <div className="flex">
        <Sidebar isOpen={isSidebarOpen} stores={stores as any} />
        
        <div className="flex-1 pt-16 transition-all duration-200">
          <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h1 className="text-2xl font-medium text-gray-900 dark:text-white">Create New Store</h1>
              </div>

              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800">
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="p-6">
                <div className="space-y-6 max-w-2xl mx-auto">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Store Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a73e8] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Enter store name"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-medium text-gray-900 dark:text-white">E-Commerce Integrations</h2>
                      <button
                        type="button"
                        onClick={addEcommerceIntegration}
                        className="px-4 py-2 text-sm font-medium text-white bg-[#1a73e8] hover:bg-[#1557b0] rounded-lg"
                      >
                        Add Integration
                      </button>
                    </div>
                    {formData.eCommerceIntegrations.map((integration, index) => (
                      <div key={index} className="mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-md font-medium text-gray-900 dark:text-white">Integration {index + 1}</h3>
                          <button
                            type="button"
                            onClick={() => removeEcommerceIntegration(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Remove
                          </button>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Title
                            </label>
                            <input
                              type="text"
                              value={integration.title}
                              onChange={(e) => handleEcommerceIntegrationChange(index, 'title', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a73e8] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              placeholder="Integration Title"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Platform
                            </label>
                            <input
                              type="text"
                              value={integration.platform}
                              onChange={(e) => handleEcommerceIntegrationChange(index, 'platform', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a73e8] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              placeholder="Platform Name"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Email
                            </label>
                            <input
                              type="email"
                              value={integration.email}
                              onChange={(e) => handleEcommerceIntegrationChange(index, 'email', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a73e8] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              placeholder="Integration Email"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              API Endpoint
                            </label>
                            <input
                              type="text"
                              value={integration.apiEndpoint}
                              onChange={(e) => handleEcommerceIntegrationChange(index, 'apiEndpoint', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a73e8] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              placeholder="API Endpoint URL"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              API Token
                            </label>
                            <input
                              type="password"
                              value={integration.token}
                              onChange={(e) => handleEcommerceIntegrationChange(index, 'token', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a73e8] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              placeholder="API Token"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-medium text-gray-900 dark:text-white">Courier Integrations</h2>
                      <button
                        type="button"
                        onClick={addCourierIntegration}
                        className="px-4 py-2 text-sm font-medium text-white bg-[#1a73e8] hover:bg-[#1557b0] rounded-lg"
                      >
                        Add Integration
                      </button>
                    </div>
                    {formData.courierIntegrations.map((integration, index) => (
                      <div key={index} className="mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-md font-medium text-gray-900 dark:text-white">Integration {index + 1}</h3>
                          <button
                            type="button"
                            onClick={() => removeCourierIntegration(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Remove
                          </button>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Title
                            </label>
                            <input
                              type="text"
                              value={integration.title}
                              onChange={(e) => handleCourierIntegrationChange(index, 'title', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a73e8] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              placeholder="Integration Title"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Courier Name
                            </label>
                            <input
                              type="text"
                              value={integration.courierName}
                              onChange={(e) => handleCourierIntegrationChange(index, 'courierName', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a73e8] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              placeholder="Courier Service Name"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Email/Credential
                            </label>
                            <input
                              type="text"
                              value={integration.emailOrCredential}
                              onChange={(e) => handleCourierIntegrationChange(index, 'emailOrCredential', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a73e8] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              placeholder="Email or Credential"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              API Endpoint
                            </label>
                            <input
                              type="text"
                              value={integration.apiEndpoint}
                              onChange={(e) => handleCourierIntegrationChange(index, 'apiEndpoint', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a73e8] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              placeholder="API Endpoint URL"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              API Token
                            </label>
                            <input
                              type="password"
                              value={integration.token}
                              onChange={(e) => handleCourierIntegrationChange(index, 'token', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a73e8] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              placeholder="API Token"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => navigate('/dashboard')}
                      disabled={loading}
                      className="px-6 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-2 text-sm font-medium text-white bg-[#1a73e8] hover:bg-[#1557b0] rounded-lg disabled:opacity-50 flex items-center"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Creating...
                        </>
                      ) : (
                        'Create Store'
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateStorePage; 