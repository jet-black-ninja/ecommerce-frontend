import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface User {
  id: string | undefined;
  userName: string;
  email: string;
  role?: string;
}
interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null | undefined;
}
interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
}
interface LoginResponse {
  success: boolean;
  message: string;
}
const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: false,
  user: null,
};

const serverURL = import.meta.env.VITE_SERVER_URL;
console.log(serverURL);
export const registerUser = createAsyncThunk(
  'auth/register',
  async (formData: { username: string; email: string; password: string }) => {
    const response = await axios.post<AuthResponse>(
      `
      ${serverURL}/api/auth/register`,
      formData,
      {
        withCredentials: true,
      }
    );
    return response.data;
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (formData: { email: string; password: string }) => {
    const response = await axios.post<AuthResponse>(
      `${serverURL}/api/auth/login`,
      formData,
      {
        withCredentials: true,
      }
    );
    return response.data as LoginResponse;
  }
);

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  const response = await axios.post<{ success: boolean }>(
    `${serverURL}/api/auth/logout`,
    {},
    {
      withCredentials: true,
    }
  );
  return response.data;
});

export const checkAuth = createAsyncThunk('auth/checkAuth', async () => {
  const response = await axios.get<AuthResponse>(
    `${serverURL}/api/auth/check-auth`,
    {
      withCredentials: true,
      headers: {
        'Cache-Control':
          'no-store, no-cache, must-revalidate, proxy-revalidate',
      },
    }
  );
  return response.data;
});
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: () => {},
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(registerUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        loginUser.fulfilled,
        (state, action: PayloadAction<AuthResponse>) => {
          // console.log(action);

          state.isLoading = false;
          state.user = action.payload.success ? action.payload.user : null;
          state.isAuthenticated = action.payload.success;
        }
      )
      .addCase(loginUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        checkAuth.fulfilled,
        (state, action: PayloadAction<AuthResponse>) => {
          state.isLoading = false;
          state.user = action.payload.success ? action.payload.user : null;
          state.isAuthenticated = action.payload.success;
        }
      )
      .addCase(checkAuth.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
