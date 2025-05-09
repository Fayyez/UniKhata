import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:4000/api/orders';

export interface OrderState {
  orders: Order[];
  newOrders: Order[];
  currentOrder: Order | null;
  loading: boolean;
  error: string | null;
}

interface ErrorResponse {
  message: string;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  [key: string]: any;
}

export interface Order {
  id: string;
  userId: string;
  storeId: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed';
  shippingAddress: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
}

interface CreateOrderData {
  storeId: string;
  items: OrderItem[];
  shippingAddress: string;
  [key: string]: any;
}

interface UpdateOrderData {
  status?: Order['status'];
  paymentStatus?: Order['paymentStatus'];
  shippingAddress?: string;
  [key: string]: any;
}

const initialState: OrderState = {
  orders: [],
  newOrders: [],
  currentOrder: null,
  loading: false,
  error: null
};

// Async thunks
export const getAllOrders = createAsyncThunk<Order[], void, { rejectValue: ErrorResponse }>(
  'order/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message
      });
    }
  }
);

export const getOrderById = createAsyncThunk<Order, string, { rejectValue: ErrorResponse }>(
  'order/getById',
  async (orderId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get(`${API_URL}/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message
      });
    }
  }
);

export const getNewOrders = createAsyncThunk<Order[], void, { rejectValue: ErrorResponse }>(
  'order/getNew',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get(`${API_URL}/new`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message
      });
    }
  }
);

export const createOrder = createAsyncThunk<Order, CreateOrderData, { rejectValue: ErrorResponse }>(
  'order/create',
  async (orderData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.post(API_URL, orderData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message
      });
    }
  }
);

export const updateOrder = createAsyncThunk<Order, { orderId: string; orderData: UpdateOrderData }, { rejectValue: ErrorResponse }>(
  'order/update',
  async ({ orderId, orderData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.patch(`${API_URL}/${orderId}`, orderData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message
      });
    }
  }
);

export const deleteOrder = createAsyncThunk<void, string, { rejectValue: ErrorResponse }>(
  'order/delete',
  async (orderId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken');
      await axios.delete(`${API_URL}/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message
      });
    }
  }
);

export const changeOrderStatus = createAsyncThunk<Order, { orderId: string; status: Order['status'] }, { rejectValue: ErrorResponse }>(
  'order/changeStatus',
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.patch(`${API_URL}/${orderId}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message
      });
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentOrder: (state, action: PayloadAction<Order | null>) => {
      state.currentOrder = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Get All Orders
      .addCase(getAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllOrders.fulfilled, (state, action: PayloadAction<Order[]>) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(getAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch orders';
      })
      // Get Order By ID
      .addCase(getOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderById.fulfilled, (state, action: PayloadAction<Order>) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(getOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch order';
      })
      // Get New Orders
      .addCase(getNewOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getNewOrders.fulfilled, (state, action: PayloadAction<Order[]>) => {
        state.loading = false;
        state.newOrders = action.payload;
      })
      .addCase(getNewOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch new orders';
      })
      // Create Order
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action: PayloadAction<Order>) => {
        state.loading = false;
        state.orders.push(action.payload);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to create order';
      })
      // Update Order
      .addCase(updateOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrder.fulfilled, (state, action: PayloadAction<Order>) => {
        state.loading = false;
        const index = state.orders.findIndex(order => order.id === action.payload.id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
        if (state.currentOrder?.id === action.payload.id) {
          state.currentOrder = action.payload;
        }
      })
      .addCase(updateOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update order';
      })
      // Delete Order
      .addCase(deleteOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = state.orders.filter(order => order.id !== action.meta.arg);
        if (state.currentOrder?.id === action.meta.arg) {
          state.currentOrder = null;
        }
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to delete order';
      })
      // Change Order Status
      .addCase(changeOrderStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changeOrderStatus.fulfilled, (state, action: PayloadAction<Order>) => {
        state.loading = false;
        const index = state.orders.findIndex(order => order.id === action.payload.id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
        if (state.currentOrder?.id === action.payload.id) {
          state.currentOrder = action.payload;
        }
      })
      .addCase(changeOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to change order status';
      });
  }
});

export const { clearError, setCurrentOrder } = orderSlice.actions;
export default orderSlice.reducer; 