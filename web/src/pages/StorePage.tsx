import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import OrdersTab from '../components/OrdersTab';
import ProductsTab from '../components/ProductsTab';
import OrdersAnalyticsTab from '../components/OrdersAnalyticsTab';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import { checkLowStockProducts } from '../store/slices/productSlice';
import UnauthorizedPage from "./UnauthorizedPage";
import axiosInstance from '../utils/axios';

const StorePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('orders');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [ordersRange, setOrdersRange] = useState('Today');
  const [isRangeDropdownOpen, setIsRangeDropdownOpen] = useState(false);
  const rangeOptions = ['Today', 'Week', 'Month', 'Year', 'All time'];
  const rangeBtnRef = useRef<HTMLButtonElement>(null);
  const [dropdownPos, setDropdownPos] = useState<{top: number, left: number, width: number}>({top: 0, left: 0, width: 0});
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [activeQuick, setActiveQuick] = useState<string>('Today');
  const { user, loading: authLoading } = useSelector((state: RootState) => state.auth);
  const { stores } = useSelector((state: RootState) => state.store);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  // Find the current store - convert both IDs to strings for comparison
  const currentStore = stores.find(store => String(store._id) === id);

  useEffect(() => {
    if (user) setIsAuthorized(true);
    else if (!authLoading) setIsAuthorized(false);
  }, [user, authLoading]);

  // Redirect if store doesn't exist
  useEffect(() => {
    console.log("currentStore", currentStore);
    console.log("id", id);
    console.log("stores", stores);
    if (!id || !currentStore) {
      console.error('Store not found or invalid ID:', id);
      navigate('/dashboard');
    }
  }, [id, currentStore, navigate, stores]);

  useEffect(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const todayStr = `${yyyy}-${mm}-${dd}`;
    setStartDate(todayStr);
    setEndDate(todayStr);
    setActiveQuick('Today');
  }, []);

  // Add low stock check on store initialization
  useEffect(() => {
    const checkLowStock = async () => {
      if (id) {
        try {
          const result = await dispatch(checkLowStockProducts(id)).unwrap();
          if (result.length > 0 && currentStore?.owner) {
            // Create email content
            const productList = result
              .map(product => `- ${product.name}: ${product.stockAmount} items remaining`)
              .join('\n');

            const emailContent = `
              <h2>Low Stock Alert for ${currentStore.name}</h2>
              <p>The following products are running low on stock:</p>
              <pre>${productList}</pre>
              <p>Please restock these items as soon as possible to avoid running out of stock.</p>
              <p>Best regards,<br>UniKhata Team</p>
            `;

            

            // Send email directly
            //await sendEmail(currentStore.owner, `Low Stock Alert - ${currentStore.name}`, emailContent);
          }
        } catch (error) {
          console.error('Failed to check low stock products:', error);
        }
      }
    };

    if (currentStore) {
      checkLowStock();
    }
  }, [id, currentStore, dispatch]);

  // Helper functions for quick-selects
  const setToday = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const todayStr = `${yyyy}-${mm}-${dd}`;
    setStartDate(todayStr);
    setEndDate(todayStr);
    setActiveQuick('Today');
  };
  const setThisWeek = () => {
    const today = new Date();
    const day = today.getDay();
    const diffToMonday = today.getDate() - day + (day === 0 ? -6 : 1); // Monday as first day
    const monday = new Date(today.setDate(diffToMonday));
    const yyyy = monday.getFullYear();
    const mm = String(monday.getMonth() + 1).padStart(2, '0');
    const dd = String(monday.getDate()).padStart(2, '0');
    const mondayStr = `${yyyy}-${mm}-${dd}`;
    const today2 = new Date();
    const yyyy2 = today2.getFullYear();
    const mm2 = String(today2.getMonth() + 1).padStart(2, '0');
    const dd2 = String(today2.getDate()).padStart(2, '0');
    const todayStr = `${yyyy2}-${mm2}-${dd2}`;
    setStartDate(mondayStr);
    setEndDate(todayStr);
    setActiveQuick('This Week');
  };
  const setThisMonth = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const firstDay = `${yyyy}-${mm}-01`;
    const dd = String(today.getDate()).padStart(2, '0');
    const todayStr = `${yyyy}-${mm}-${dd}`;
    setStartDate(firstDay);
    setEndDate(todayStr);
    setActiveQuick('This Month');
  };
  const setThisYear = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const firstDay = `${yyyy}-01-01`;
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const todayStr = `${yyyy}-${mm}-${dd}`;
    setStartDate(firstDay);
    setEndDate(todayStr);
    setActiveQuick('This Year');
  };

  // If user manually changes dates, clear quick selection
  const handleStartDateChange = (val: string) => {
    setStartDate(val);
    setActiveQuick('');
  };
  const handleEndDateChange = (val: string) => {
    setEndDate(val);
    setActiveQuick('');
  };

  const tabs = [
    { id: 'orders', label: 'Orders', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    )},
    { id: 'products', label: 'Products', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    )},
    { id: 'analytics', label: 'Analytics', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )},
    { id: 'integration', label: 'Integration', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    )},
    { id: 'ledger', label: 'Ledger', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    )},
    { id: 'edit', label: 'Edit', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    )}
  ];

  if (isAuthorized === false) {
    return <UnauthorizedPage />;
  }

  if (!currentStore) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-gray-900">
      <Navbar 
        userName={user?.name || "User"}
        onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      <div className="flex">
        <Sidebar isOpen={isSidebarOpen} stores={stores} />
        
        <div className="flex-1 pt-16 transition-all duration-200">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            {/* Store Navigation Bar */}
            <div className="bg-white dark:bg-gray-800 shadow-sm">
              <div className="px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                  <div className="flex items-center">
                    <h1 className="text-xl font-medium text-gray-900 dark:text-white">{currentStore.name}</h1>
                  </div>
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Desktop Navigation */}
                <nav className="hidden md:flex space-x-8">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 px-1 py-4 text-sm font-medium border-b-2 transition-colors duration-200 ${
                        activeTab === tab.id
                          ? 'border-[#1a73e8] text-[#1a73e8] dark:text-[#1a73e8]'
                          : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      {tab.icon}
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </nav>

                {/* Mobile Navigation */}
                <div className="md:hidden">
                  <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="flex items-center justify-between w-full py-4 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    <span className="flex items-center space-x-2">
                      {tabs.find(tab => tab.id === activeTab)?.icon}
                      <span>{tabs.find(tab => tab.id === activeTab)?.label}</span>
                    </span>
                    <svg
                      className={`h-5 w-5 transform transition-transform duration-200 ${
                        isMobileMenuOpen ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Mobile Menu Dropdown */}
                  {isMobileMenuOpen && (
                    <div className="absolute left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
                      <div className="py-1">
                        {tabs.map((tab) => (
                          <button
                            key={tab.id}
                            onClick={() => {
                              setActiveTab(tab.id);
                              setIsMobileMenuOpen(false);
                            }}
                            className={`flex items-center space-x-2 w-full px-4 py-2 text-sm font-medium ${
                              activeTab === tab.id
                                ? 'text-[#1a73e8] dark:text-[#1a73e8] bg-[#1a73e8]/5 dark:bg-[#1a73e8]/10'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                          >
                            {tab.icon}
                            <span>{tab.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                {/* Content will be rendered here based on activeTab */}
                {activeTab === 'orders' ? (
                  <OrdersTab storeId={Number(id)} userId={user.id} />
                ) : activeTab === 'products' ? (
                  <ProductsTab storeId={id} userId={user.id} />
                ) : activeTab === 'analytics' ? (
                  <OrdersAnalyticsTab />
                ) : (
                  <div className="text-center text-gray-500 dark:text-gray-400">
                    {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} content will be displayed here
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StorePage; 