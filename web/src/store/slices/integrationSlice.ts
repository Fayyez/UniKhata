import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axios';

// Types
interface EcommerceIntegration {
  _id: string;
  store: string;
  title: string;
  platform: string;
  email: string;
  apiEndpoint: string;
  token: string;
  createdAt?: string;
  updatedAt?: string;
}

interface CourierIntegration {
  _id: string;
  store: string;
  title: string;
  courierName: string;
  emailOrCredential: string;
  apiEndpoint: string;
  token: string;
  createdAt?: string;
  updatedAt?: string;
}

interface IntegrationState {
  ecommerce: {
    integrations: EcommerceIntegration[];
    loading: boolean;
    error: string | null;
  };
  courier: {
    integrations: CourierIntegration[];
    loading: boolean;
    error: string | null;
  };
}

const initialState: IntegrationState = {
  ecommerce: {
    integrations: [],
    loading: false,
    error: null
  },
  courier: {
    integrations: [],
    loading: false,
    error: null
  }
};

// Ecommerce Integration Thunks
export const fetchEcommerceIntegrations = createAsyncThunk(
  'integration/fetchEcommerce',
  async (params?: { store?: string; platform?: string; title?: string }) => {
    const response = await axiosInstance.get('/ecommerce', { params });
    return response.data.integrations; // Controller returns { message, integrations }
  }
);

export const fetchEcommerceIntegrationById = createAsyncThunk(
  'integration/fetchEcommerceById',
  async (id: string) => {
    const response = await axiosInstance.get(`/ecommerce/${id}`);
    return response.data.integration; // Controller returns { message, integration }
  }
);

export const createEcommerceIntegration = createAsyncThunk(
  'integration/createEcommerce',
  async (integration: Omit<EcommerceIntegration, '_id' | 'createdAt' | 'updatedAt'>) => {
    const response = await axiosInstance.post('/ecommerce', integration);
    return response.data.integration; // Controller returns { message, integration }
  }
);

export const updateEcommerceIntegration = createAsyncThunk(
  'integration/updateEcommerce',
  async ({ id, integration }: { id: string; integration: Partial<EcommerceIntegration> }) => {
    const response = await axiosInstance.patch(`/ecommerce/${id}`, integration);
    return response.data.integration; // Controller returns { message, integration }
  }
);

export const deleteEcommerceIntegration = createAsyncThunk(
  'integration/deleteEcommerce',
  async (id: string) => {
    const response = await axiosInstance.delete(`/ecommerce/${id}`);
    return response.data.integrationId; // Controller returns { message, integrationId }
  }
);

// Courier Integration Thunks
export const fetchCourierIntegrations = createAsyncThunk(
  'integration/fetchCourier',
  async (params?: { store?: string; courierName?: string; title?: string }) => {
    const response = await axiosInstance.get('/courier', { params });
    return response.data.integrations; // Controller returns { message, integrations }
  }
);

export const fetchCourierIntegrationById = createAsyncThunk(
  'integration/fetchCourierById',
  async (id: string) => {
    const response = await axiosInstance.get(`/courier/${id}`);
    return response.data.integration; // Controller returns { message, integration }
  }
);

export const createCourierIntegration = createAsyncThunk(
  'integration/createCourier',
  async (integration: Omit<CourierIntegration, '_id' | 'createdAt' | 'updatedAt'>) => {
    const response = await axiosInstance.post('/courier', integration);
    return response.data.integration; // Controller returns { message, integration }
  }
);

export const updateCourierIntegration = createAsyncThunk(
  'integration/updateCourier',
  async ({ id, integration }: { id: string; integration: Partial<CourierIntegration> }) => {
    const response = await axiosInstance.patch(`/courier/${id}`, integration);
    return response.data.integration; // Controller returns { message, integration }
  }
);

export const deleteCourierIntegration = createAsyncThunk(
  'integration/deleteCourier',
  async (id: string) => {
    const response = await axiosInstance.delete(`/courier/${id}`);
    return response.data.integrationId; // Controller returns { message, integrationId }
  }
);

const integrationSlice = createSlice({
  name: 'integration',
  initialState,
  reducers: {
    clearIntegrationErrors: (state) => {
      state.ecommerce.error = null;
      state.courier.error = null;
    }
  },
  extraReducers: (builder) => {
    // Ecommerce Integration Reducers
    builder
      // Fetch All
      .addCase(fetchEcommerceIntegrations.pending, (state) => {
        state.ecommerce.loading = true;
        state.ecommerce.error = null;
      })
      .addCase(fetchEcommerceIntegrations.fulfilled, (state, action) => {
        state.ecommerce.loading = false;
        state.ecommerce.integrations = action.payload;
      })
      .addCase(fetchEcommerceIntegrations.rejected, (state, action) => {
        state.ecommerce.loading = false;
        state.ecommerce.error = action.error.message || 'Failed to fetch ecommerce integrations';
      })
      // Fetch By Id
      .addCase(fetchEcommerceIntegrationById.fulfilled, (state, action) => {
        const index = state.ecommerce.integrations.findIndex(i => i._id === action.payload._id);
        if (index !== -1) {
          state.ecommerce.integrations[index] = action.payload;
        } else {
          state.ecommerce.integrations.push(action.payload);
        }
      })
      // Create
      .addCase(createEcommerceIntegration.fulfilled, (state, action) => {
        state.ecommerce.integrations.push(action.payload);
      })
      // Update
      .addCase(updateEcommerceIntegration.fulfilled, (state, action) => {
        const index = state.ecommerce.integrations.findIndex(i => i._id === action.payload._id);
        if (index !== -1) {
          state.ecommerce.integrations[index] = action.payload;
        }
      })
      // Delete
      .addCase(deleteEcommerceIntegration.fulfilled, (state, action) => {
        state.ecommerce.integrations = state.ecommerce.integrations.filter(i => i._id !== action.payload);
      });

    // Courier Integration Reducers
    builder
      // Fetch All
      .addCase(fetchCourierIntegrations.pending, (state) => {
        state.courier.loading = true;
        state.courier.error = null;
      })
      .addCase(fetchCourierIntegrations.fulfilled, (state, action) => {
        state.courier.loading = false;
        state.courier.integrations = action.payload;
      })
      .addCase(fetchCourierIntegrations.rejected, (state, action) => {
        state.courier.loading = false;
        state.courier.error = action.error.message || 'Failed to fetch courier integrations';
      })
      // Fetch By Id
      .addCase(fetchCourierIntegrationById.fulfilled, (state, action) => {
        const index = state.courier.integrations.findIndex(i => i._id === action.payload._id);
        if (index !== -1) {
          state.courier.integrations[index] = action.payload;
        } else {
          state.courier.integrations.push(action.payload);
        }
      })
      // Create
      .addCase(createCourierIntegration.fulfilled, (state, action) => {
        state.courier.integrations.push(action.payload);
      })
      // Update
      .addCase(updateCourierIntegration.fulfilled, (state, action) => {
        const index = state.courier.integrations.findIndex(i => i._id === action.payload._id);
        if (index !== -1) {
          state.courier.integrations[index] = action.payload;
        }
      })
      // Delete
      .addCase(deleteCourierIntegration.fulfilled, (state, action) => {
        state.courier.integrations = state.courier.integrations.filter(i => i._id !== action.payload);
      });
  }
});

export const { clearIntegrationErrors } = integrationSlice.actions;
export default integrationSlice.reducer; 