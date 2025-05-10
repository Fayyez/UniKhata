import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axios';

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

interface StoreState {
  stores: Store[];
  loading: boolean;
  error: string | null;
}

const initialState: StoreState = {
  stores: [],
  loading: false,
  error: null
};

export const fetchStores = createAsyncThunk(
  'store/fetchStores',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Fetching stores...');
      const response = await axiosInstance.get('/stores');
      console.log('Raw API Response:', response);
      console.log('Response Data:', response.data);
      console.log('Response Data Type:', typeof response.data);
      console.log('Is Array?', Array.isArray(response.data));
      console.log('Response Structure:', JSON.stringify(response.data, null, 2));
      
      // Ensure we're returning an array of stores
      const stores = response.data.stores || [];
      console.log('Processed Stores:', stores);
      console.log('Stores Length:', stores.length);
      
      if (stores.length === 0) {
        console.log('No stores found for the current user');
      }
      
      return stores;
    } catch (error: any) {
      console.error('Failed to fetch stores:', error);
      console.error('Error Response:', error.response);
      console.error('Error Status:', error.response?.status);
      console.error('Error Data:', error.response?.data);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch stores');
    }
  }
);

export const createStore = createAsyncThunk(
  'store/createStore',
  async (storeData: { name: string; owner: number }, { rejectWithValue }) => {
    try {
      console.log('Creating store with data:', storeData);
      const response = await axiosInstance.post('/stores', storeData);
      console.log('Store creation response:', response.data);
      return response.data.store;
    } catch (error: any) {
      console.error('Error creating store:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || 'Failed to create store');
    }
  }
);

export const updateStore = createAsyncThunk(
  'store/updateStore',
  async ({ id, storeData }: { id: number; storeData: Partial<Store> }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`/stores/${id}`, storeData);
      return response.data.store;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update store');
    }
  }
);

export const deleteStore = createAsyncThunk(
  'store/deleteStore',
  async (id: number, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/stores/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete store');
    }
  }
);

const storeSlice = createSlice({
  name: 'store',
  initialState,
  reducers: {
    clearStoreError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Stores
      .addCase(fetchStores.pending, (state) => {
        console.log('Fetching stores - Pending');
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStores.fulfilled, (state, action) => {
        console.log('Fetching stores - Fulfilled');
        console.log('Action Payload:', action.payload);
        state.loading = false;
        state.stores = Array.isArray(action.payload) ? action.payload : [];
        console.log('Updated State Stores:', state.stores);
      })
      .addCase(fetchStores.rejected, (state, action) => {
        console.log('Fetching stores - Rejected');
        console.log('Error Payload:', action.payload);
        state.loading = false;
        state.error = action.payload as string;
        state.stores = [];
      })
      // Create Store
      .addCase(createStore.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createStore.fulfilled, (state, action) => {
        state.loading = false;
        state.stores.push(action.payload);
      })
      .addCase(createStore.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update Store
      .addCase(updateStore.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStore.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.stores.findIndex(store => store._id === action.payload._id);
        if (index !== -1) {
          state.stores[index] = action.payload;
        }
      })
      .addCase(updateStore.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete Store
      .addCase(deleteStore.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteStore.fulfilled, (state, action) => {
        state.loading = false;
        state.stores = state.stores.filter(store => store._id !== action.payload);
      })
      .addCase(deleteStore.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { clearStoreError } = storeSlice.actions;
export default storeSlice.reducer; 