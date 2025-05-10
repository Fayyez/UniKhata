import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axios';
import { refreshToken } from './authSlice';

const API_URL = 'http://localhost:4000/api';

export interface UserProfile {
  _id: number;
  name: string;
  email: string;
  avatar: string;
  googleId?: string;
  stores: number[];
  isDeleted: boolean;
}

interface UserState {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
}

interface UpdateProfileData {
  name?: string;
  email?: string;
  avatar?: string;
}

interface ChangePasswordData {
  oldPassword: string;
  newPassword: string;
}

const initialState: UserState = {
  profile: null,
  loading: false,
  error: null
};

export const fetchUserProfile = createAsyncThunk<UserProfile, void, { rejectValue: string }>(
  'user/fetchProfile',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      console.log('Fetching user profile...');
      const accessToken = localStorage.getItem('accessToken');
      console.log('Current access token:', accessToken);
      
      const response = await axiosInstance.get('/auth/user-info');
      console.log('Profile fetch response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Profile fetch error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      if (error.response?.status === 401) {
        try {
          await dispatch(refreshToken());
          const retryResponse = await axiosInstance.get('/auth/user-info');
          return retryResponse.data;
        } catch (refreshError) {
          return rejectWithValue('Session expired. Please login again.');
        }
      }
      
      return rejectWithValue(
        error.response?.data?.message || 
        error.message || 
        'Failed to fetch profile'
      );
    }
  }
);

export const updateUserProfile = createAsyncThunk<UserProfile, UpdateProfileData, { rejectValue: string }>(
  'user/updateProfile',
  async (data, { dispatch, rejectWithValue }) => {
    try {
      console.log('Updating user profile with data:', data);
      const accessToken = localStorage.getItem('accessToken');
      console.log('Current access token:', accessToken);
      
      const response = await axiosInstance.patch('/users', data);
      console.log('Profile update response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Profile update error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.config?.headers
      });

      if (error.response?.status === 401) {
        try {
          await dispatch(refreshToken());
          const retryResponse = await axiosInstance.patch('/users', data);
          return retryResponse.data;
        } catch (refreshError) {
          return rejectWithValue('Session expired. Please login again.');
        }
      }

      return rejectWithValue(
        error.response?.data?.message || 
        error.message || 
        'Failed to update profile'
      );
    }
  }
);

export const changePassword = createAsyncThunk<void, ChangePasswordData, { rejectValue: string }>(
  'user/changePassword',
  async (data, { dispatch, rejectWithValue }) => {
    try {
      console.log('Changing password...');
      const accessToken = localStorage.getItem('accessToken');
      console.log('Current access token:', accessToken);
      
      const response = await axiosInstance.post('/users/change-password', data);
      console.log('Password change response:', response.data);
    } catch (error: any) {
      console.error('Password change error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.config?.headers
      });

      if (error.response?.status === 401) {
        try {
          await dispatch(refreshToken());
          await axiosInstance.post('/users/change-password', data);
          return;
        } catch (refreshError) {
          return rejectWithValue('Session expired. Please login again.');
        }
      }

      return rejectWithValue(
        error.response?.data?.message || 
        error.message || 
        'Failed to change password'
      );
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action: PayloadAction<UserProfile>) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch profile';
      })
      // Update Profile
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action: PayloadAction<UserProfile>) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update profile';
      })
      // Change Password
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to change password';
      });
  }
});

export const { clearError } = userSlice.actions;
export default userSlice.reducer; 