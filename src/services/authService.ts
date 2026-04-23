import { api } from './api';
import type { AuthResponse } from '../types';

export const authService = {
  login: async (credentials: any): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', credentials);
    return {
      token: response.data.authToken,
      user: response.data.authUser
    };
  },
  register: async (userData: any): Promise<AuthResponse> => {
    await api.post('/auth/register', userData);
    return authService.login({ username: userData.username, password: userData.password });
  }
};
