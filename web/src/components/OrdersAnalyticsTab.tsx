import React from 'react';

const stats = [
  {
    label: 'Total Sales',
    value: '$4,876.98',
    icon: (
      <svg className="w-6 h-6 text-[#1a73e8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    bg: 'bg-[#1a73e8]/10',
  },
  {
    label: 'Total Profit',
    value: '$762.10',
    icon: (
      <svg className="w-6 h-6 text-[#1a73e8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
    bg: 'bg-[#1a73e8]/20',
  },
  {
    label: 'Total Orders',
    value: '1056',
    icon: (
      <svg className="w-6 h-6 text-[#1a73e8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    bg: 'bg-gray-100 dark:bg-gray-700',
  },
];

const topProducts = [
  {
    name: 'Jordan Stay Loyal',
    sold: '321 Pcs',
    sales: '$8,500',
    status: 'In Stock',
    img: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/6b2e2e2e-2e2e-4e2e-8e2e-2e2e2e2e2e2e/air-jordan-stay-loyal-shoe.png',
  },
  {
    name: 'Jordan Air Jordan 1',
    sold: '563 Pcs',
    sales: '$12,000',
    status: 'In Stock',
    img: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/2e2e2e2e-2e2e-4e2e-8e2e-2e2e2e2e2e2e/air-jordan-1-shoe.png',
  },
  {
    name: 'Nike Air Force 1 Shadow',
    sold: '462 Pcs',
    sales: '$10,330',
    status: 'Out of Stock',
    img: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/3e3e3e3e-3e3e-4e3e-8e3e-3e3e3e3e3e3e/air-force-1-shadow-shoe.png',
  },
];

const OrdersAnalyticsTab: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat, idx) => (
          <div key={stat.label} className={`rounded-xl p-5 flex flex-col gap-2 ${stat.bg}`}>
            <div className="flex items-center gap-2">
              <div className="bg-white rounded p-2 shadow-sm flex items-center justify-center">
                {stat.icon}
              </div>
              <span className="font-medium text-gray-900 dark:text-white">{stat.label}</span>
            </div>
            <div className="flex items-end justify-between mt-2">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</span>
              {/* Trend icon placeholder */}
              <svg className="w-6 h-6 text-gray-900 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 17l6-6 4 4 6-6" /></svg>
            </div>
          </div>
        ))}
      </div>

      {/* Top Selling Products Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Top Selling Products</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Product name</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Sold</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total sales</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Stock status</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {topProducts.map((product) => (
                <tr key={product.name}>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white font-medium">{product.name}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">{product.sold}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{product.sales}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">
                    <span className={product.status === 'In Stock' ? 'text-green-600 font-semibold' : 'text-red-500 font-semibold'}>{product.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrdersAnalyticsTab; 