import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders, changeStatus } from '../store/slices/orderSlice';
import type { RootState, AppDispatch } from '../store';
import type { Order } from '../store/slices/orderSlice';

interface OrdersTabProps {
  storeId: number | undefined;
  userId: number | undefined;
}

const OrdersTab: React.FC<OrdersTabProps> = ({ storeId, userId }) => {
  // current url == "base/store/:storeId"
  const current_store_id = window.location.pathname.split('/').pop();
  console.log("this is the storeId", current_store_id);

  const dispatch = useDispatch<AppDispatch>();
  const { orders, loading, error } = useSelector((state: RootState) => state.order);
  const [ordersRange, setOrdersRange] = useState('Today');
  const [isRangeDropdownOpen, setIsRangeDropdownOpen] = useState(false);
  const rangeBtnRef = useRef<HTMLButtonElement>(null);
  const [dropdownPos, setDropdownPos] = useState<{top: number, left: number, width: number}>({top: 0, left: 0, width: 0});
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [activeQuick, setActiveQuick] = useState<string>('Today');
  const [statusLoading, setStatusLoading] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    dispatch(fetchOrders({ uid: userId, sid: current_store_id }));
  }, [dispatch, current_store_id, userId]);

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

  const getNextStatus = (currentStatus: string): string => {
    const statusFlow = ['pending', 'processing', 'completed', 'cancelled'];
    const currentIndex = statusFlow.indexOf(currentStatus);
    return statusFlow[(currentIndex + 1) % statusFlow.length];
  };

  const handleStatusClick = async (orderId: number, currentStatus: string) => {
    const nextStatus = getNextStatus(currentStatus);
    setStatusLoading(prev => ({ ...prev, [orderId]: true }));
    try {
      await dispatch(changeStatus({ oid: orderId, status: nextStatus })).unwrap();
    } catch (error) {
      console.error('Failed to update order status:', error);
    } finally {
      setStatusLoading(prev => ({ ...prev, [orderId]: false }));
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'pending':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  // Add these buttons for your status changes
  const DispatchButton = ({ orderId }: { orderId: number }) => {
    const dispatch = useDispatch<AppDispatch>();
    const [loading, setLoading] = useState(false);
    
    const handleDispatch = async () => {
      setLoading(true);
      try {
        await dispatch(changeStatus({ oid: orderId, status: 'processing' })).unwrap();
      } catch (error) {
        console.error('Failed to dispatch order:', error);
      } finally {
        setLoading(false);
      }
    };
    
    return (
      <button 
        onClick={handleDispatch}
        disabled={loading}
        className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Processing...' : 'Dispatch'}
      </button>
    );
  };

  const CancelButton = ({ orderId }: { orderId: number }) => {
    const dispatch = useDispatch<AppDispatch>();
    const [loading, setLoading] = useState(false);
    
    const handleCancel = async () => {
      setLoading(true);
      try {
        await dispatch(changeStatus({ oid: orderId, status: 'cancelled' })).unwrap();
      } catch (error) {
        console.error('Failed to cancel order:', error);
      } finally {
        setLoading(false);
      }
    };
    
    return (
      <button 
        onClick={handleCancel}
        disabled={loading}
        className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 disabled:opacity-50 ml-2"
      >
        {loading ? 'Cancelling...' : 'Cancel'}
      </button>
    );
  };

  if (loading) return <div className="text-gray-900 dark:text-white">Loading orders...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <>
      {/* Stats Bar */}
      {/* <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-0 justify-between mb-6 overflow-x-auto">
        <div className="flex items-center min-w-[220px] mr-8 relative">
          <svg className="w-6 h-6 text-gray-700 dark:text-gray-200 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <rect x="3" y="4" width="18" height="18" rx="2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M16 2v4M8 2v4M3 10h18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <button
            ref={rangeBtnRef}
            type="button"
            className="font-medium text-gray-700 dark:text-gray-200 flex items-center focus:outline-none focus:ring-2 focus:ring-[#1a73e8] rounded px-2 py-1"
            onClick={() => {
              setIsRangeDropdownOpen((open) => !open);
              if (rangeBtnRef.current) {
                const rect = rangeBtnRef.current.getBoundingClientRect();
                setDropdownPos({
                  top: rect.bottom + window.scrollY + 4,
                  left: rect.left + window.scrollX,
                  width: rect.width
                });
              }
            }}
          >
            {activeQuick
              ? activeQuick
              : (startDate && endDate ? `${startDate} to ${endDate}` : 'Select date range')}
            <svg className={`w-4 h-4 ml-1 transition-transform ${isRangeDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {isRangeDropdownOpen && (
            <div 
              className="fixed z-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-lg p-4 flex flex-col gap-4"
              style={{ top: dropdownPos.top, left: dropdownPos.left, minWidth: dropdownPos.width }}
            >
              <div className="flex flex-col gap-2 mb-2">
                <button onClick={setToday} className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-700 text-xs text-gray-700 dark:text-gray-200 hover:bg-[#1a73e8]/10 hover:text-[#1a73e8]">Today</button>
                <button onClick={setThisWeek} className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-700 text-xs text-gray-700 dark:text-gray-200 hover:bg-[#1a73e8]/10 hover:text-[#1a73e8]">This Week</button>
                <button onClick={setThisMonth} className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-700 text-xs text-gray-700 dark:text-gray-200 hover:bg-[#1a73e8]/10 hover:text-[#1a73e8]">This Month</button>
                <button onClick={setThisYear} className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-700 text-xs text-gray-700 dark:text-gray-200 hover:bg-[#1a73e8]/10 hover:text-[#1a73e8]">This Year</button>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex flex-col">
                  <label className="text-xs text-gray-500 dark:text-gray-400 mb-1">Start date</label>
                  <input
                    type="date"
                    className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:ring-[#1a73e8] focus:border-[#1a73e8]"
                    value={startDate}
                    max={endDate || undefined}
                    onChange={e => handleStartDateChange(e.target.value)}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs text-gray-500 dark:text-gray-400 mb-1">End date</label>
                  <input
                    type="date"
                    className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:ring-[#1a73e8] focus:border-[#1a73e8]"
                    value={endDate}
                    min={startDate || undefined}
                    onChange={e => handleEndDateChange(e.target.value)}
                  />
                </div>
              </div>
              <button
                className="mt-2 sm:mt-6 px-4 py-2 bg-[#1a73e8] text-white rounded hover:bg-[#1761c7] transition"
                onClick={() => setIsRangeDropdownOpen(false)}
                disabled={!startDate || !endDate}
              >
                Apply
              </button>
            </div>
          )}
        </div>
        <div className="flex flex-col items-center min-w-[120px] border-l border-gray-200 dark:border-gray-700 pl-4">
          <span className="text-xs text-gray-500 dark:text-gray-400">Total orders</span>
          <span className="font-semibold text-lg text-gray-900 dark:text-white">{orders.length}</span>
        </div>
        <div className="flex flex-col items-center min-w-[160px] border-l border-gray-200 dark:border-gray-700 pl-4">
          <span className="text-xs text-gray-500 dark:text-gray-400">Ordered items over time</span>
          <span className="font-semibold text-lg text-gray-900 dark:text-white">
            {orders.reduce((total, order) => total + order.items.reduce((sum, item) => sum + item.quantity, 0), 0)}
          </span>
        </div>
        <div className="flex flex-col items-center min-w-[100px] border-l border-gray-200 dark:border-gray-700 pl-4">
          <span className="text-xs text-gray-500 dark:text-gray-400">Returns</span>
          <span className="font-semibold text-lg text-gray-900 dark:text-white">
            {orders.filter(order => order.status === 'cancelled').length}
          </span>
        </div>
        <div className="flex flex-col items-center min-w-[180px] border-l border-gray-200 dark:border-gray-700 pl-4">
          <span className="text-xs text-gray-500 dark:text-gray-400">Fulfilled orders over time</span>
          <span className="font-semibold text-lg text-gray-900 dark:text-white">
            {orders.filter(order => order.status === 'completed').length}
          </span>
        </div>
        <div className="flex flex-col items-center min-w-[180px] border-l border-gray-200 dark:border-gray-700 pl-4">
          <span className="text-xs text-gray-500 dark:text-gray-400">Delivered orders over time</span>
          <span className="font-semibold text-lg text-gray-900 dark:text-white">
            {orders.filter(order => order.status === 'completed').length}
          </span>
        </div>
      </div> */}
      {/* Orders Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Order ID</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Summary</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Platform</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Courier</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Created At</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {orders.map((order) => (
              <tr key={order._id}>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">#{order.orderid || order._id}</td>
                <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">
                  <div className="space-y-1">
                    {order.productEntries.map((entry, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-gray-900 dark:text-white">{entry.product?.name || `${entry.name}`}</span>
                        <span className="text-gray-500 dark:text-gray-400 ml-2">x{entry.quantity}</span>
                      </div>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {order.platform?.title || order.platform?.platform || `${order.platform}`}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {order.courier ? (order.courier?.name || `Courier #${order.courier}`) : '-'}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm">
                  <button
                    onClick={() => handleStatusClick(order._id, order.status)}
                    disabled={statusLoading[order._id]}
                    className={`inline-block px-2 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors ${getStatusStyles(order.status)} hover:opacity-80 disabled:opacity-50`}
                  >
                    {statusLoading[order._id] ? 'Updating...' : order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </button>
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm flex">
                  {order.status === 'pending' && <DispatchButton orderId={order._id} />}
                  {order.status !== 'completed' && <CancelButton orderId={order._id} />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default OrdersTab; 