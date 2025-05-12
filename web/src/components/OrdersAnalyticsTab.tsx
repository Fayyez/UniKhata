import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axios';

interface TopProduct {
  productId: string;
  name: string;
  sold: number;
  sales: number;
  image?: string;
}

interface AnalyticsData {
  totalOrders: number;
  totalSales: number;
  topProducts: TopProduct[];
}

interface OrdersAnalyticsTabProps {
  storeId: string;
}

const OrdersAnalyticsTab: React.FC<OrdersAnalyticsTabProps> = ({ storeId }) => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get(`/orders/analytics/${storeId}`);
        setData(response.data);
      } catch (err: unknown) {
        let message = 'Failed to fetch analytics';
        if (err && typeof err === 'object' && 'response' in err && err.response && typeof err.response === 'object' && 'data' in err.response && err.response.data && typeof err.response.data === 'object' && 'message' in err.response.data) {
          message = (err.response.data as { message?: string }).message || message;
        }
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    if (storeId) fetchAnalytics();
  }, [storeId]);

  if (loading) {
    return <div className="text-center py-8 text-gray-500 dark:text-gray-300">Loading analytics...</div>;
  }
  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }
  if (!data) {
    return null;
  }

  const stats = [
    {
      label: 'Total Orders',
      value: data.totalOrders,
      icon: (
        <svg className="w-6 h-6 text-[#1a73e8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      bg: 'bg-gray-100 dark:bg-gray-700',
    },
    {
      label: 'Total Sales',
      value: `$${data.totalSales.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: (
        <svg className="w-6 h-6 text-[#1a73e8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bg: 'bg-[#1a73e8]/10',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className={`rounded-xl p-5 flex flex-col gap-2 ${stat.bg}`}>
            <div className="flex items-center gap-2">
              <div className="bg-white rounded p-2 shadow-sm flex items-center justify-center">
                {stat.icon}
              </div>
              <span className="font-medium text-gray-900 dark:text-white">{stat.label}</span>
            </div>
            <div className="flex items-end justify-between mt-2">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Top Selling Products Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Top Selling Products</h2>
        {data.topProducts.length === 0 ? (
          <div className="text-gray-500 dark:text-gray-300">No products sold yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Product name</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Sold</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total sales</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {data.topProducts.map((product) => (
                  <tr key={product.productId}>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white font-medium">{product.name}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">{product.sold}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {typeof product.sales === 'number'
                        ? `$${product.sales.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                        : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersAnalyticsTab; 