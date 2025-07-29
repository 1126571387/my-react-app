import { createSlice,type PayloadAction } from '@reduxjs/toolkit';
import type{ AuthResponse } from '@/types/apiTypes';

interface AuthState {
  user: Omit<AuthResponse, 'token'> | null;
  token: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token') || null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<AuthResponse>) => {
      const { accessToken } = action.payload;
      state.user = action.payload;
      state.token = accessToken;
      localStorage.setItem('token', accessToken);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
    }
  }
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;