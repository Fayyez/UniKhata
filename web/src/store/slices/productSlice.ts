import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axios';

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stockAmount: number;
  brand: string;
  image?: string;
  store: string;
  addedBy: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export const ProductDefaults: Omit<Product, '_id' | 'createdAt' | 'updatedAt'> = {
  name: '',
  description: '',
  price: 0,
  stockAmount: 0,
  brand: '',
  image: '',
  store: '',
  addedBy: '',
  isDeleted: false
};

interface ProductState {
  products: Product[];
  currentProduct: Product | null;
  lowStockProducts: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  currentProduct: null,
  lowStockProducts: [],
  loading: false,
  error: null
};

export const fetchProducts = createAsyncThunk<Product[], string, { rejectValue: string }>(
  'product/fetchProducts',
  async (storeId, { rejectWithValue }) => {
    try {

      // const response = await axiosInstance.request({
      //   url: '/products/',
      //   method: 'get',
      //   data: { sid: Number(storeId) }
      // });
      const response = await axiosInstance.get(`/products/?sid=${storeId}`);
      console.log("nnnnn", response.data);
      return response.data.products;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
    }
  }
);

export const fetchProductById = createAsyncThunk<Product, { storeId: string; productId: string }, { rejectValue: string }>(
  'product/fetchProductById',
  async ({ storeId, productId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/products/${productId}`);
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
      // Ensure required fields are present and properly formatted
      const productData = {
        ...data,
        store: storeId,
        price: Number(data.price),
        stockAmount: Number(data.stockAmount || 0),
        name: data.name?.trim(),
        description: data.description?.trim() || '',
        brand: data.brand?.trim() || '',
        image: data.image?.trim() || '',
        isDeleted: false
      };

      const response = await axiosInstance.post(`/products/`, productData);
      return response.data.product; // The backend returns { message, product }
    } catch (error: any) {
      console.error('Create product error:', error.response?.data);
      return rejectWithValue(error.response?.data?.message || 'Failed to create product');
    }
  }
);

export const updateProduct = createAsyncThunk<Product, { storeId: string; productId: string; data: Partial<Product> }, { rejectValue: string }>(
  'product/updateProduct',
  async ({ storeId, productId, data }, { rejectWithValue }) => {
    try {
      // Ensure required fields are present and properly formatted
      const productData = {
        ...data,
        store: storeId,
        price: Number(data.price),
        stockAmount: Number(data.stockAmount || 0),
        name: data.name?.trim(),
        description: data.description?.trim() || '',
        brand: data.brand?.trim() || '',
        image: data.image?.trim() || '',
      };

      const response = await axiosInstance.patch(`/products/${productId}`, productData);
      return response.data.product; // The backend returns { message, product }
    } catch (error: any) {
      console.error('Update product error:', error.response?.data);
      return rejectWithValue(error.response?.data?.message || 'Failed to update product');
    }
  }
);

export const deleteProduct = createAsyncThunk<{ pid: string }, { pid: string }, { rejectValue: string }>(
  'product/deleteProduct',
  async ({ pid }, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/products/${pid}`);
      return { pid };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete product');
    }
  }
);

export const checkLowStockProducts = createAsyncThunk<Product[], string, { rejectValue: string }>(
  'product/checkLowStockProducts',
  async (storeId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/products/low-stocks/${storeId}`);
      return response.data.products;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch low stock products');
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
      .addCase(deleteProduct.fulfilled, (state, action: PayloadAction<{ pid: string }>) => {
        state.loading = false;
        state.products = state.products.filter(product => product._id !== action.payload.pid);
        if (state.currentProduct?._id === action.payload.pid) {
          state.currentProduct = null;
        }
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete product';
      })
      // Check Low Stock Products
      .addCase(checkLowStockProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkLowStockProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.loading = false;
        state.lowStockProducts = action.payload;
      })
      .addCase(checkLowStockProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch low stock products';
      });
  }
});

export const { clearError, setCurrentProduct } = productSlice.actions;
export default productSlice.reducer; 