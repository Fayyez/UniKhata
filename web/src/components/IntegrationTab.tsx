import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import axiosInstance from '../utils/axios';

interface IntegrationTabProps {
  storeId: string | undefined;
}

interface Integration {
  _id: string;
  type: 'ecommerce' | 'courier';
  platform: string;
  credentials: {
    apiKey?: string;
    secretKey?: string;
    accessToken?: string;
    refreshToken?: string;
    [key: string]: string | undefined;
  };
  isActive: boolean;
  lastSync?: string;
}

const IntegrationTab: React.FC<IntegrationTabProps> = ({ storeId }) => {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIntegration, setCurrentIntegration] = useState<Partial<Integration>>({
    type: 'ecommerce',
    platform: '',
    credentials: {},
    isActive: true
  });

  useEffect(() => {
    fetchIntegrations();
  }, [storeId]);

  const fetchIntegrations = async () => {
    if (!storeId) return;
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/integrations/${storeId}`);
      setIntegrations(response.data.integrations);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch integrations');
    } finally {
      setLoading(false);
    }
  };

  const handleAddIntegration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeId) return;

    try {
      setLoading(true);
      await axiosInstance.post(`/integrations/${storeId}`, currentIntegration);
      await fetchIntegrations();
      setIsModalOpen(false);
      setCurrentIntegration({
        type: 'ecommerce',
        platform: '',
        credentials: {},
        isActive: true
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add integration');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleIntegration = async (integrationId: string, isActive: boolean) => {
    try {
      setLoading(true);
      await axiosInstance.patch(`/integrations/${storeId}/${integrationId}`, {
        isActive: !isActive
      });
      await fetchIntegrations();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update integration');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteIntegration = async (integrationId: string) => {
    try {
      setLoading(true);
      await axiosInstance.delete(`/integrations/${storeId}/${integrationId}`);
      await fetchIntegrations();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete integration');
    } finally {
      setLoading(false);
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'shopify':
        return '🛍️';
      case 'woocommerce':
        return '🛒';
      case 'amazon':
        return '📦';
      case 'daraz':
        return '🛒';
      case 'pathao':
        return '🚚';
      case 'redx':
        return '📦';
      case 'steadfast':
        return '🚛';
      default:
        return '🔌';
    }
  };

  if (loading && !integrations.length) {
    return <div className="text-gray-900 dark:text-white">Loading integrations...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Store Integrations</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-[#1a73e8] text-white rounded hover:bg-[#1557b0]"
        >
          Add Integration
        </button>
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {integrations.map((integration) => (
          <div
            key={integration._id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{getPlatformIcon(integration.platform)}</span>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white capitalize">
                    {integration.platform}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                    {integration.type} Integration
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleToggleIntegration(integration._id, integration.isActive)}
                  className={`px-3 py-1 rounded text-xs font-medium ${
                    integration.isActive
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                  }`}
                >
                  {integration.isActive ? 'Active' : 'Inactive'}
                </button>
                <button
                  onClick={() => handleDeleteIntegration(integration._id)}
                  className="p-1 text-red-500 hover:text-red-700"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
            {integration.lastSync && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Last synced: {new Date(integration.lastSync).toLocaleString()}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Add Integration Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md mx-2">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Add New Integration
            </h2>
            <form onSubmit={handleAddIntegration} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-white">
                  Integration Type
                </label>
                <select
                  value={currentIntegration.type}
                  onChange={(e) => setCurrentIntegration(prev => ({ ...prev, type: e.target.value as 'ecommerce' | 'courier' }))}
                  className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                >
                  <option value="ecommerce">E-commerce Platform</option>
                  <option value="courier">Courier Service</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-white">
                  Platform
                </label>
                <select
                  value={currentIntegration.platform}
                  onChange={(e) => setCurrentIntegration(prev => ({ ...prev, platform: e.target.value }))}
                  className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                >
                  <option value="">Select Platform</option>
                  {currentIntegration.type === 'ecommerce' ? (
                    <>
                      <option value="shopify">Shopify</option>
                      <option value="woocommerce">WooCommerce</option>
                      <option value="amazon">Amazon</option>
                      <option value="daraz">Daraz</option>
                    </>
                  ) : (
                    <>
                      <option value="pathao">Pathao</option>
                      <option value="redx">RedX</option>
                      <option value="steadfast">Steadfast</option>
                    </>
                  )}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-white">
                  API Key
                </label>
                <input
                  type="text"
                  value={currentIntegration.credentials.apiKey || ''}
                  onChange={(e) => setCurrentIntegration(prev => ({
                    ...prev,
                    credentials: { ...prev.credentials, apiKey: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-white">
                  Secret Key
                </label>
                <input
                  type="password"
                  value={currentIntegration.credentials.secretKey || ''}
                  onChange={(e) => setCurrentIntegration(prev => ({
                    ...prev,
                    credentials: { ...prev.credentials, secretKey: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              {error && <div className="text-red-500 text-sm">{error}</div>}
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                  onClick={() => {
                    setIsModalOpen(false);
                    setError(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-[#1a73e8] text-white hover:bg-[#1761c7]"
                  disabled={loading}
                >
                  {loading ? 'Adding...' : 'Add Integration'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default IntegrationTab; 