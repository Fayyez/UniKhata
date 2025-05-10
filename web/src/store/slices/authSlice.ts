import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axios';

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
  message: string;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
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

export const login = createAsyncThunk<AuthResponse, LoginCredentials, { rejectValue: ErrorResponse }>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      console.log('Attempting login with credentials:', { email: credentials.email });
      const response = await axiosInstance.post('/auth/login', {
        email: credentials.email.toLowerCase(),
        password: credentials.password
      });
      console.log('Login response data:', response.data);
      
      const { tokens, user } = response.data;
      console.log('Extracted tokens:', { 
        hasAccessToken: !!tokens?.accessToken, 
        hasRefreshToken: !!tokens?.refreshToken,
        accessToken: tokens?.accessToken,
        refreshToken: tokens?.refreshToken
      });
      
      if (!tokens?.accessToken || !tokens?.refreshToken) {
        console.error('Tokens missing in response:', response.data);
        throw new Error('Tokens not found in response');
      }

      // Store tokens
      localStorage.setItem('accessToken', tokens.accessToken);
      localStorage.setItem('refreshToken', tokens.refreshToken);
      console.log('Tokens stored in localStorage');

      // Set default authorization header
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${tokens.accessToken}`;
      console.log('Authorization header set:', axiosInstance.defaults.headers.common['Authorization']);
      
      return { 
        message: response.data.message,
        tokens: {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken
        },
        user 
      };
    } catch (error: any) {
      console.error('Login error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      return rejectWithValue({
        message: error.response?.data?.message || error.message || 'Login failed'
      });
    }
  }
);

export const register = createAsyncThunk<AuthResponse, any, { rejectValue: ErrorResponse }>(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      console.log('Attempting registration with data:', userData);
      const response = await axiosInstance.post('/auth/register', userData);
      console.log('Registration response data:', response.data);

      const { tokens, user } = response.data;
      console.log('Extracted tokens:', { 
        hasAccessToken: !!tokens?.accessToken, 
        hasRefreshToken: !!tokens?.refreshToken,
        accessToken: tokens?.accessToken,
        refreshToken: tokens?.refreshToken
      });

      if (!tokens?.accessToken || !tokens?.refreshToken) {
        console.error('Tokens missing in response:', response.data);
        throw new Error('Tokens not found in response');
      }

      // Store tokens
      localStorage.setItem('accessToken', tokens.accessToken);
      localStorage.setItem('refreshToken', tokens.refreshToken);
      console.log('Tokens stored in localStorage');

      // Set default authorization header
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${tokens.accessToken}`;
      console.log('Authorization header set:', axiosInstance.defaults.headers.common['Authorization']);

      return { 
        message: response.data.message,
        tokens: {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken
        },
        user 
      };
    } catch (error: any) {
      console.error('Registration error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      return rejectWithValue({
        message: error.response?.data?.message || error.message || 'Registration failed'
      });
    }
  }
);

export const refreshToken = createAsyncThunk<AuthResponse, void, { rejectValue: ErrorResponse }>(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Attempting token refresh...');
      const refreshToken = localStorage.getItem('refreshToken');
      console.log('Current refresh token:', refreshToken);
      
      if (!refreshToken) {
        console.error('No refresh token available');
        throw new Error('No refresh token available');
      }

      const response = await axiosInstance.post('/auth/refresh', { refreshToken });
      console.log('Token refresh response:', response.data);

      const { tokens } = response.data;
      console.log('Extracted tokens:', { 
        hasAccessToken: !!tokens?.accessToken, 
        hasRefreshToken: !!tokens?.refreshToken,
        accessToken: tokens?.accessToken,
        refreshToken: tokens?.refreshToken
      });

      if (!tokens?.accessToken) {
        console.error('No access token in refresh response:', response.data);
        throw new Error('No access token in refresh response');
      }

      // Store tokens
      localStorage.setItem('accessToken', tokens.accessToken);
      if (tokens.refreshToken) {
        localStorage.setItem('refreshToken', tokens.refreshToken);
      }
      console.log('Tokens stored in localStorage');

      // Update authorization header
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${tokens.accessToken}`;
      console.log('Authorization header set:', axiosInstance.defaults.headers.common['Authorization']);

      return { 
        message: response.data.message,
        tokens: {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken || refreshToken
        }
      };
    } catch (error: any) {
      console.error('Token refresh error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      // Clear tokens on refresh failure
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      delete axiosInstance.defaults.headers.common['Authorization'];
      return rejectWithValue({
        message: error.response?.data?.message || error.message || 'Failed to refresh token'
      });
    }
  }
);

export const getUserInfo = createAsyncThunk<any, void, { rejectValue: ErrorResponse }>(
  'auth/getUserInfo',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Getting user info...');
      const response = await axiosInstance.get('/auth/user-info');
      console.log('User info response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Get user info error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      return rejectWithValue({
        message: error.response?.data?.message || error.message || 'Failed to fetch user info'
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
      delete axiosInstance.defaults.headers.common['Authorization'];
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
        state.accessToken = action.payload.tokens.accessToken;
        state.refreshToken = action.payload.tokens.refreshToken;
        if (action.payload.user) {
          state.user = action.payload.user;
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Login failed';
        state.isAuthenticated = false;
        state.accessToken = null;
        state.refreshToken = null;
        state.user = null;
      })
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.accessToken = action.payload.tokens.accessToken;
        state.refreshToken = action.payload.tokens.refreshToken;
        if (action.payload.user) {
          state.user = action.payload.user;
        }
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Registration failed';
        state.isAuthenticated = false;
        state.accessToken = null;
        state.refreshToken = null;
        state.user = null;
      })
      // Refresh Token
      .addCase(refreshToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refreshToken.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.loading = false;
        state.accessToken = action.payload.tokens.accessToken;
        state.refreshToken = action.payload.tokens.refreshToken;
        state.isAuthenticated = true;
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.loading = false;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.error = action.payload?.message || 'Failed to refresh token';
        state.user = null;
      })
      // Get User Info
      .addCase(getUserInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(getUserInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch user info';
        state.user = null;
      });
  }
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer; 