import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axios';

export interface OrderItem {
  product: string;
  quantity: number;
  price: number;
}

export interface Order {
  _id: string;
  store: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  paymentMethod: 'cash' | 'card';
  paymentStatus: 'pending' | 'paid' | 'failed';
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null
};

export const fetchOrders = createAsyncThunk<Order[], string, { rejectValue: string }>(
  'order/fetchOrders',
  async (storeId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/api/stores/${storeId}/orders`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders');
    }
  }
);

export const fetchOrderById = createAsyncThunk<Order, { storeId: string; orderId: string }, { rejectValue: string }>(
  'order/fetchOrderById',
  async ({ storeId, orderId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/api/stores/${storeId}/orders/${orderId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch order');
    }
  }
);

export const createOrder = createAsyncThunk<Order, { storeId: string; data: Partial<Order> }, { rejectValue: string }>(
  'order/createOrder',
  async ({ storeId, data }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/api/stores/${storeId}/orders`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create order');
    }
  }
);

export const updateOrder = createAsyncThunk<Order, { storeId: string; orderId: string; data: Partial<Order> }, { rejectValue: string }>(
  'order/updateOrder',
  async ({ storeId, orderId, data }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/api/stores/${storeId}/orders/${orderId}`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update order');
    }
  }
);

export const deleteOrder = createAsyncThunk<{ storeId: string; orderId: string }, { storeId: string; orderId: string }, { rejectValue: string }>(
  'order/deleteOrder',
  async ({ storeId, orderId }, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/api/stores/${storeId}/orders/${orderId}`);
      return { storeId, orderId };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete order');
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
      // Fetch Orders
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action: PayloadAction<Order[]>) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch orders';
      })
      // Fetch Order by ID
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action: PayloadAction<Order>) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch order';
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
        state.error = action.payload || 'Failed to create order';
      })
      // Update Order
      .addCase(updateOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrder.fulfilled, (state, action: PayloadAction<Order>) => {
        state.loading = false;
        const index = state.orders.findIndex(order => order._id === action.payload._id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
        if (state.currentOrder?._id === action.payload._id) {
          state.currentOrder = action.payload;
        }
      })
      .addCase(updateOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update order';
      })
      // Delete Order
      .addCase(deleteOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteOrder.fulfilled, (state, action: PayloadAction<{ storeId: string; orderId: string }>) => {
        state.loading = false;
        state.orders = state.orders.filter(order => order._id !== action.payload.orderId);
        if (state.currentOrder?._id === action.payload.orderId) {
          state.currentOrder = null;
        }
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete order';
      });
  }
});

export const { clearError, setCurrentOrder } = orderSlice.actions;
export default orderSlice.reducer; 