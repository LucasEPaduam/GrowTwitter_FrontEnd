import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { userService } from '../../services/userService';
import { authService } from '../../services/authService';
import type { User, AuthResponse } from '../../types';
import { followUser, unfollowUser } from './profileSlice';

interface AuthState {
  token: string | null;
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  token: localStorage.getItem('token') || null,
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: any, thunkAPI) => {
    try {
      return await authService.login(credentials);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Falha no login');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData: any, thunkAPI) => {
    try {
      return await authService.register(userData);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Falha no cadastro');
    }
  }
);

export const reloadCurrentUser = createAsyncThunk(
  'auth/reloadCurrentUser',
  async (userId: string, thunkAPI) => {
    try {
      return await userService.getUserById(userId);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(reloadCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
        localStorage.setItem('user', JSON.stringify(action.payload));
      })
      .addCase(followUser.pending, (state, action) => {
        if (state.user) {
          if (!state.user.following) state.user.following = [];
          state.user.following.push({ followingId: action.meta.arg, id: action.meta.arg });
        }
      })
      .addCase(unfollowUser.pending, (state, action) => {
        if (state.user && state.user.following) {
          state.user.following = state.user.following.filter((f: any) => f.followingId !== action.meta.arg && f.id !== action.meta.arg);
        }
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
