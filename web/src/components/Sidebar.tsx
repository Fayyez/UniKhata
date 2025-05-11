import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';

interface SidebarProps {
  isOpen?: boolean;
  stores: Store[];
}

interface Store {
  _id: number;
  name: string;
  owner: number;
  eCommerceIntegrations?: number[];
  courierIntegrations?: number[];
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen = true, stores }) => {
  const location = useLocation();
  const { user } = useSelector((state: RootState) => state.auth);

  const menuItems = [
    {
      name: 'Dashboard',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      path: '/dashboard'
    }
  ];

  const defaultColors = [
    'bg-[#1967d2]', // Blue
    'bg-[#1e8e3e]', // Green
    'bg-[#d93025]', // Red
    'bg-[#e37400]', // Orange
    'bg-[#9334e6]', // Purple
  ];

  // Function to get store initials
  const getStoreInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div 
      className={`w-64 h-[calc(100vh-4rem)] bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 fixed left-0 top-16 transition-transform duration-200 transform lg:relative lg:translate-x-0 z-20 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="h-full overflow-y-auto px-6 py-4">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-2 text-sm rounded-full ${
                location.pathname === item.path
                  ? 'bg-[#1a73e8]/10 dark:bg-[#1a73e8]/20 text-[#1a73e8] dark:text-[#1a73e8]'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <span className="text-current">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          ))}
        </div>

        <div className="mt-8">
          <div className="text-xs font-medium text-gray-500 dark:text-gray-400 px-4 mb-2">My Stores</div>
          <div className="space-y-1">
            {stores.map((store, idx) => (
              <Link
                key={store._id}
                to={`/store/${store._id}`}
                className={`flex items-center space-x-3 px-4 py-2 text-sm rounded-full ${
                  location.pathname === `/store/${store._id}`
                    ? 'bg-[#1a73e8]/10 dark:bg-[#1a73e8]/20 text-[#1a73e8] dark:text-[#1a73e8]'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm ${defaultColors[idx % defaultColors.length]}`}>
                  {getStoreInitials(store.name)}
                </div>
                <span>{store.name}</span>
              </Link>
            ))}
            <Link
              to="/create-store"
              className={`flex items-center space-x-3 px-4 py-2 text-sm rounded-full ${
                location.pathname === '/create-store'
                  ? 'bg-[#1a73e8]/10 dark:bg-[#1a73e8]/20 text-[#1a73e8] dark:text-[#1a73e8]'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-[#1a73e8]/10 dark:bg-[#1a73e8]/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-[#1a73e8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <span>Create Store</span>
            </Link>
          </div>
        </div>

        <div className="mt-8">
          <div className="text-xs font-medium text-gray-500 dark:text-gray-400 px-4 mb-2">Account</div>
          <Link
            to="/profile"
            className={`flex items-center space-x-3 px-4 py-2 text-sm rounded-full ${
              location.pathname === '/profile'
                ? 'bg-[#1a73e8]/10 dark:bg-[#1a73e8]/20 text-[#1a73e8] dark:text-[#1a73e8]'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>Profile Settings</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 