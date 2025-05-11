import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axios';

export interface OrderItem {
  product: string;
  quantity: number;
  price: number;
}

export interface Order {
  _id: number;
  productEntries: Array<{
    product: number;
    quantity: number;
  }>;
  store: number;
  platform: number;
  courier?: number;
  isDeleted: boolean;
  status: string;
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

interface FetchOrdersParams {
  uid?: string;
  sid?: string;
}

export const fetchOrders = createAsyncThunk<Order[], FetchOrdersParams, { rejectValue: string }>(
  'order/fetchOrders',
  async ({ uid, sid }, { rejectWithValue }) => {
    try {
      await axiosInstance.get(`/orders/new?sid=${sid}`);
      const response = await axiosInstance.get(`/orders?uid=${uid}&sid=${sid}`);
      if (!response.data.orders) {
        return rejectWithValue('No orders found');
      }
      return response.data.orders;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders');
    }
  }
);

export const fetchOrderById = createAsyncThunk<Order, { storeId: number; orderId: number }, { rejectValue: string }>(
  'order/fetchOrderById',
  async ({ storeId, orderId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/orders/${orderId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch order');
    }
  }
);

export const createOrder = createAsyncThunk<Order, { storeId: number; data: Partial<Order> }, { rejectValue: string }>(
  'order/createOrder',
  async ({ storeId, data }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/${storeId}/orders`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create order');
    }
  }
);

export const updateOrder = createAsyncThunk<Order, { storeId: number; orderId: number; data: Partial<Order> }, { rejectValue: string }>(
  'order/updateOrder',
  async ({ storeId, orderId, data }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/${storeId}/orders/${orderId}`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update order');
    }
  }
);

export const deleteOrder = createAsyncThunk<{ storeId: number; orderId: number }, { storeId: number; orderId: number }, { rejectValue: string }>(
  'order/deleteOrder',
  async ({ storeId, orderId }, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/${storeId}/orders/${orderId}`);
      return { storeId, orderId };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete order');
    }
  }
);

export const changeStatus = createAsyncThunk<Order, { oid: number; status: string }, { rejectValue: string }>(
  'order/changeStatus',
  async ({ oid, status }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`orders/status/${oid}`, { status });
      if (!response.data.order) {
        return rejectWithValue('Failed to update order status');
      }
      return response.data.order;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update order status');
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
      .addCase(deleteOrder.fulfilled, (state, action: PayloadAction<{ storeId: number; orderId: number }>) => {
        state.loading = false;
        state.orders = state.orders.filter(order => order._id !== action.payload.orderId);
        if (state.currentOrder?._id === action.payload.orderId) {
          state.currentOrder = null;
        }
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete order';
      })
      // Change Status
      .addCase(changeStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changeStatus.fulfilled, (state, action: PayloadAction<Order>) => {
        state.loading = false;
        const index = state.orders.findIndex(order => order._id === action.payload._id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
        if (state.currentOrder?._id === action.payload._id) {
          state.currentOrder = action.payload;
        }
      })
      .addCase(changeStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update order status';
      });
  }
});

export const { clearError, setCurrentOrder } = orderSlice.actions;
export default orderSlice.reducer; 