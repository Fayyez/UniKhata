import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:4000/api/users';

export interface UserState {
  profile: any | null;
  loading: boolean;
  error: string | null;
}

interface ErrorResponse {
  message: string;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  [key: string]: any;
}

interface PasswordData {
  currentPassword: string;
  newPassword: string;
}

interface AvatarData {
  avatar: File;
}

const initialState: UserState = {
  profile: null,
  loading: false,
  error: null
};

// Async thunks
export const getUserProfile = createAsyncThunk<UserProfile, void, { rejectValue: ErrorResponse }>(
  'user/getProfile',
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

export const getUserProfileById = createAsyncThunk<UserProfile, string, { rejectValue: ErrorResponse }>(
  'user/getProfileById',
  async (userId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get(`${API_URL}/${userId}`, {
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

export const updateUserProfile = createAsyncThunk<UserProfile, Partial<UserProfile>, { rejectValue: ErrorResponse }>(
  'user/updateProfile',
  async (userData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.patch(API_URL, userData, {
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

export const changePassword = createAsyncThunk<void, PasswordData, { rejectValue: ErrorResponse }>(
  'user/changePassword',
  async (passwordData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken');
      await axios.post(`${API_URL}/change-password`, passwordData, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message
      });
    }
  }
);

export const changeAvatar = createAsyncThunk<UserProfile, AvatarData, { rejectValue: ErrorResponse }>(
  'user/changeAvatar',
  async (avatarData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken');
      const formData = new FormData();
      formData.append('avatar', avatarData.avatar);
      
      const response = await axios.post(`${API_URL}/change-avatar`, formData, {
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

export const deleteAccount = createAsyncThunk<void, void, { rejectValue: ErrorResponse }>(
  'user/deleteAccount',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken');
      await axios.delete(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message
      });
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
      // Get Profile
      .addCase(getUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserProfile.fulfilled, (state, action: PayloadAction<UserProfile>) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch profile';
      })
      // Get Profile By ID
      .addCase(getUserProfileById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserProfileById.fulfilled, (state, action: PayloadAction<UserProfile>) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(getUserProfileById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch profile';
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
        state.error = action.payload?.message || 'Failed to update profile';
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
        state.error = action.payload?.message || 'Failed to change password';
      })
      // Change Avatar
      .addCase(changeAvatar.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changeAvatar.fulfilled, (state, action: PayloadAction<UserProfile>) => {
        state.loading = false;
        state.profile = { ...state.profile, ...action.payload };
      })
      .addCase(changeAvatar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to change avatar';
      })
      // Delete Account
      .addCase(deleteAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAccount.fulfilled, (state) => {
        state.loading = false;
        state.profile = null;
      })
      .addCase(deleteAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to delete account';
      });
  }
});

export const { clearError } = userSlice.actions;
export default userSlice.reducer; 