import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:4000/api/auth';

export interface AuthState {
  user: any | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user?: any;
}

interface ErrorResponse {
  message: string;
}

const initialState: AuthState = {
  user: null,
  accessToken: localStorage.getItem('accessToken'),
  refreshToken: localStorage.getItem('refreshToken'),
  isAuthenticated: !!localStorage.getItem('accessToken'),
  loading: false,
  error: null
};

// Async thunks
export const login = createAsyncThunk<AuthResponse, LoginCredentials, { rejectValue: ErrorResponse }>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email: credentials.email.toLowerCase(),
        password: credentials.password
      });
      const { accessToken, refreshToken } = response.data;
      
      if (accessToken && refreshToken) {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        return { accessToken, refreshToken };
      } else {
        throw new Error('Tokens not found in response');
      }
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message
      });
    }
  }
);

export const register = createAsyncThunk<AuthResponse, any, { rejectValue: ErrorResponse }>(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/register`, userData);
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      return response.data;
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message
      });
    }
  }
);

export const refreshToken = createAsyncThunk<AuthResponse, void, { rejectValue: ErrorResponse }>(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      const response = await axios.post(`${API_URL}/refresh`, { refreshToken });
      localStorage.setItem('accessToken', response.data.accessToken);
      return response.data;
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message
      });
    }
  }
);

export const getUserInfo = createAsyncThunk<any, void, { rejectValue: ErrorResponse }>(
  'auth/getUserInfo',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken');
      console.log('Getting user info with token:', token);
      
      const response = await axios.get(`${API_URL}/user-info`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('User info response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Get user info error:', error.response?.data || error.message);
      return rejectWithValue({
        message: error.response?.data?.message || error.message
      });
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        if (action.payload.user) {
          state.user = action.payload.user;
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Login failed';
      })
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        if (action.payload.user) {
          state.user = action.payload.user;
        }
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Registration failed';
      })
      // Refresh Token
      .addCase(refreshToken.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.accessToken = action.payload.accessToken;
      })
      // Get User Info
      .addCase(getUserInfo.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(getUserInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch user info';
      });
  }
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer; 