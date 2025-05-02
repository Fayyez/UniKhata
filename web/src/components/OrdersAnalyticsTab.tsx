import React from 'react';

const stats = [
  {
    label: 'Total Sales',
    value: '$4,876.98',
    icon: (
      <svg className="w-6 h-6 text-[#1a73e8]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h10M7 11h10M7 15h6" /></svg>
    ),
    bg: 'bg-[#1a73e8]/10',
  },
  {
    label: 'Total Profit',
    value: '$762.10',
    icon: (
      <svg className="w-6 h-6 text-[#1a73e8]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 17v2a2 2 0 002 2h14a2 2 0 002-2v-2M16 11V7a4 4 0 00-8 0v4M12 17v.01" /></svg>
    ),
    bg: 'bg-[#1a73e8]/20',
  },
  {
    label: 'Total Orders',
    value: '1056',
    icon: (
      <svg className="w-6 h-6 text-[#1a73e8]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M3 12h18M3 17h18" /></svg>
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
              <span className="font-medium text-white">{stat.label}</span>
            </div>
            <div className="flex items-end justify-between mt-2">
              <span className="text-2xl font-bold text-white">{stat.value}</span>
              {/* Trend icon placeholder */}
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 17l6-6 4 4 6-6" /></svg>
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
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {topProducts.map((product) => (
                <tr key={product.name}>
                  <td className="px-4 py-2 whitespace-nowrap flex items-center gap-3 text-sm">
                    <img src={product.img} alt={product.name} className="w-10 h-10 rounded object-cover border" />
                    <span className="text-gray-900 dark:text-white font-medium">{product.name}</span>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">{product.sold}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{product.sales}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">
                    <span className={product.status === 'In Stock' ? 'text-green-600 font-semibold' : 'text-red-500 font-semibold'}>{product.status}</span>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">
                    <button className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="1.5"/><circle cx="19.5" cy="12" r="1.5"/><circle cx="4.5" cy="12" r="1.5"/></svg>
                    </button>
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