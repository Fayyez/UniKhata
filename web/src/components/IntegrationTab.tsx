import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import { getStoreById } from '../store/slices/storeSlice';
import type { EcommerceIntegration, CourierIntegration } from '../store/slices/storeSlice';

interface IntegrationTabProps {
  storeId: string | undefined;
}

const IntegrationTab: React.FC<IntegrationTabProps> = ({ storeId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentStore, loading, error } = useSelector((state: RootState) => state.store);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (storeId) {
      dispatch(getStoreById(storeId));
    }
  }, [dispatch, storeId]);

  if (loading && !currentStore) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-gray-900 dark:text-white text-lg">Loading integrations...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-red-500 text-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* E-commerce Integrations Section */}
      <div>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">E-commerce Integrations</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Connect your store with popular e-commerce platforms
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-[#1a73e8] text-white rounded-lg hover:bg-[#1557b0] transition-colors flex items-center gap-2 shadow-sm w-full sm:w-auto justify-center"
          >
            <span>+</span>
            <span>Add Integration</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {currentStore?.eCommerceIntegrations?.map((integration: EcommerceIntegration) => (
            <div
              key={integration._id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-2xl">
                    {'🛒'}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                      {integration.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                      {integration.platform}
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200">
                  Active
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <span className="w-24 text-gray-500 dark:text-gray-400">Email:</span>
                  <span className="font-medium truncate">{integration.email}</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <span className="w-24 text-gray-500 dark:text-gray-400">API:</span>
                  <span className="font-medium truncate">{integration.apiEndpoint}</span>
                </div>
                {integration.updatedAt && (
                  <div className="col-span-1 sm:col-span-2 pt-2 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700">
                    Last updated: {new Date(integration.updatedAt).toLocaleString()}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Courier Integrations Section */}
      <div>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Courier Integrations</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Connect with delivery services to manage your shipments
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-[#1a73e8] text-white rounded-lg hover:bg-[#1557b0] transition-colors flex items-center gap-2 shadow-sm w-full sm:w-auto justify-center"
          >
            <span>+</span>
            <span>Add Integration</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {currentStore?.courierIntegrations?.map((integration: CourierIntegration) => (
            <div
              key={integration._id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-2xl">
                    {'🚚'}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                      {integration.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                      {integration.courierName}
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200">
                  Active
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <span className="w-24 text-gray-500 dark:text-gray-400">Credential:</span>
                  <span className="font-medium truncate">{integration.emailOrCredential}</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <span className="w-24 text-gray-500 dark:text-gray-400">API:</span>
                  <span className="font-medium truncate">{integration.apiEndpoint}</span>
                </div>
                {integration.updatedAt && (
                  <div className="col-span-1 sm:col-span-2 pt-2 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700">
                    Last updated: {new Date(integration.updatedAt).toLocaleString()}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Integration Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Add New Integration
            </h2>
            {/* Add your form here */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-[#1a73e8] text-white hover:bg-[#1761c7] transition-colors"
              >
                Add Integration
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IntegrationTab; 