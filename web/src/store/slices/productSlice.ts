import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axios';

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
  image?: string;
  store: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ProductState {
  products: Product[];
  currentProduct: Product | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  currentProduct: null,
  loading: false,
  error: null
};

export const fetchProducts = createAsyncThunk<Product[], string, { rejectValue: string }>(
  'product/fetchProducts',
  async (storeId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/api/stores/${storeId}/products`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
    }
  }
);

export const fetchProductById = createAsyncThunk<Product, { storeId: string; productId: string }, { rejectValue: string }>(
  'product/fetchProductById',
  async ({ storeId, productId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/api/stores/${storeId}/products/${productId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch product');
    }
  }
);

export const createProduct = createAsyncThunk<Product, { storeId: string; data: Partial<Product> }, { rejectValue: string }>(
  'product/createProduct',
  async ({ storeId, data }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/api/stores/${storeId}/products`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create product');
    }
  }
);

export const updateProduct = createAsyncThunk<Product, { storeId: string; productId: string; data: Partial<Product> }, { rejectValue: string }>(
  'product/updateProduct',
  async ({ storeId, productId, data }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/api/stores/${storeId}/products/${productId}`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update product');
    }
  }
);

export const deleteProduct = createAsyncThunk<{ storeId: string; productId: string }, { storeId: string; productId: string }, { rejectValue: string }>(
  'product/deleteProduct',
  async ({ storeId, productId }, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/api/stores/${storeId}/products/${productId}`);
      return { storeId, productId };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete product');
    }
  }
);

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentProduct: (state, action: PayloadAction<Product | null>) => {
      state.currentProduct = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch products';
      })
      // Fetch Product by ID
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action: PayloadAction<Product>) => {
        state.loading = false;
        state.currentProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch product';
      })
      // Create Product
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        state.loading = false;
        state.products.push(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create product';
      })
      // Update Product
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        state.loading = false;
        const index = state.products.findIndex(product => product._id === action.payload._id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        if (state.currentProduct?._id === action.payload._id) {
          state.currentProduct = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update product';
      })
      // Delete Product
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action: PayloadAction<{ storeId: string; productId: string }>) => {
        state.loading = false;
        state.products = state.products.filter(product => product._id !== action.payload.productId);
        if (state.currentProduct?._id === action.payload.productId) {
          state.currentProduct = null;
        }
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete product';
      });
  }
});

export const { clearError, setCurrentProduct } = productSlice.actions;
export default productSlice.reducer; 