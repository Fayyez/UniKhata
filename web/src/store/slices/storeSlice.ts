import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:4000/api/stores';

export interface StoreState {
  stores: Store[];
  currentStore: Store | null;
  loading: boolean;
  error: string | null;
}

interface ErrorResponse {
  message: string;
}

export interface Store {
  id: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
}

interface CreateStoreData {
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  [key: string]: any;
}

const initialState: StoreState = {
  stores: [],
  currentStore: null,
  loading: false,
  error: null
};

// Async thunks
export const getAllStores = createAsyncThunk<Store[], void, { rejectValue: ErrorResponse }>(
  'store/getAll',
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

export const getStoreById = createAsyncThunk<Store, string, { rejectValue: ErrorResponse }>(
  'store/getById',
  async (storeId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get(`${API_URL}/${storeId}`, {
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

export const createStore = createAsyncThunk<Store, CreateStoreData, { rejectValue: ErrorResponse }>(
  'store/create',
  async (storeData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.post(API_URL, storeData, {
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

export const updateStore = createAsyncThunk<Store, { storeId: string; storeData: Partial<CreateStoreData> }, { rejectValue: ErrorResponse }>(
  'store/update',
  async ({ storeId, storeData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.patch(`${API_URL}/${storeId}`, storeData, {
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

export const deleteStore = createAsyncThunk<void, string, { rejectValue: ErrorResponse }>(
  'store/delete',
  async (storeId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken');
      await axios.delete(`${API_URL}/${storeId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message
      });
    }
  }
);

const storeSlice = createSlice({
  name: 'store',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentStore: (state, action: PayloadAction<Store | null>) => {
      state.currentStore = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Get All Stores
      .addCase(getAllStores.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllStores.fulfilled, (state, action: PayloadAction<Store[]>) => {
        state.loading = false;
        state.stores = action.payload;
      })
      .addCase(getAllStores.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch stores';
      })
      // Get Store By ID
      .addCase(getStoreById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getStoreById.fulfilled, (state, action: PayloadAction<Store>) => {
        state.loading = false;
        state.currentStore = action.payload;
      })
      .addCase(getStoreById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch store';
      })
      // Create Store
      .addCase(createStore.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createStore.fulfilled, (state, action: PayloadAction<Store>) => {
        state.loading = false;
        state.stores.push(action.payload);
      })
      .addCase(createStore.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to create store';
      })
      // Update Store
      .addCase(updateStore.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStore.fulfilled, (state, action: PayloadAction<Store>) => {
        state.loading = false;
        const index = state.stores.findIndex(store => store.id === action.payload.id);
        if (index !== -1) {
          state.stores[index] = action.payload;
        }
        if (state.currentStore?.id === action.payload.id) {
          state.currentStore = action.payload;
        }
      })
      .addCase(updateStore.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update store';
      })
      // Delete Store
      .addCase(deleteStore.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteStore.fulfilled, (state, action) => {
        state.loading = false;
        state.stores = state.stores.filter(store => store.id !== action.meta.arg);
        if (state.currentStore?.id === action.meta.arg) {
          state.currentStore = null;
        }
      })
      .addCase(deleteStore.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to delete store';
      });
  }
});

export const { clearError, setCurrentStore } = storeSlice.actions;
export default storeSlice.reducer; 