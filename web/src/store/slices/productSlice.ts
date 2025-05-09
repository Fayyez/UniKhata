import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:4000/api/products';

export interface ProductState {
  products: Product[];
  currentProduct: Product | null;
  loading: boolean;
  error: string | null;
}

interface ErrorResponse {
  message: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  storeId: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
}

interface CreateProductData {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  storeId: string;
  images?: File[];
  [key: string]: any;
}

interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  [key: string]: any;
}

const initialState: ProductState = {
  products: [],
  currentProduct: null,
  loading: false,
  error: null
};

// Async thunks
export const getAllProducts = createAsyncThunk<Product[], ProductFilters | undefined, { rejectValue: ErrorResponse }>(
  'product/getAll',
  async (filters, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
        params: filters
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message
      });
    }
  }
);

export const getProductById = createAsyncThunk<Product, string, { rejectValue: ErrorResponse }>(
  'product/getById',
  async (productId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get(`${API_URL}/${productId}`, {
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

export const createProduct = createAsyncThunk<Product, CreateProductData, { rejectValue: ErrorResponse }>(
  'product/create',
  async (productData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken');
      const formData = new FormData();
      
      // Append basic product data
      Object.keys(productData).forEach(key => {
        if (key !== 'images') {
          formData.append(key, productData[key]);
        }
      });
      
      // Append images if they exist
      if (productData.images) {
        productData.images.forEach(image => {
          formData.append('images', image);
        });
      }
      
      const response = await axios.post(API_URL, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message
      });
    }
  }
);

export const updateProduct = createAsyncThunk<Product, { productId: string; productData: Partial<CreateProductData> }, { rejectValue: ErrorResponse }>(
  'product/update',
  async ({ productId, productData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken');
      const formData = new FormData();
      
      // Append basic product data
      Object.keys(productData).forEach(key => {
        if (key !== 'images') {
          formData.append(key, productData[key]);
        }
      });
      
      // Append images if they exist
      if (productData.images) {
        productData.images.forEach(image => {
          formData.append('images', image);
        });
      }
      
      const response = await axios.patch(`${API_URL}/${productId}`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message
      });
    }
  }
);

export const deleteProduct = createAsyncThunk<void, string, { rejectValue: ErrorResponse }>(
  'product/delete',
  async (productId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken');
      await axios.delete(`${API_URL}/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message
      });
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
      // Get All Products
      .addCase(getAllProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(getAllProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch products';
      })
      // Get Product By ID
      .addCase(getProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProductById.fulfilled, (state, action: PayloadAction<Product>) => {
        state.loading = false;
        state.currentProduct = action.payload;
      })
      .addCase(getProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch product';
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
        state.error = action.payload?.message || 'Failed to create product';
      })
      // Update Product
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        state.loading = false;
        const index = state.products.findIndex(product => product.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        if (state.currentProduct?.id === action.payload.id) {
          state.currentProduct = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update product';
      })
      // Delete Product
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter(product => product.id !== action.meta.arg);
        if (state.currentProduct?.id === action.meta.arg) {
          state.currentProduct = null;
        }
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to delete product';
      });
  }
});

export const { clearError, setCurrentProduct } = productSlice.actions;
export default productSlice.reducer; 