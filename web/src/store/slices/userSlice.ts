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
  avatar?: string;
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
      const response = await axiosInstance.get('/auth/user-info');
      console.log('Profile fetch response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Profile fetch error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
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
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch('/auth/profile', data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 
        error.message || 
        'Failed to update profile'
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
      });
  }
});

export const { clearError } = userSlice.actions;
export default userSlice.reducer; 