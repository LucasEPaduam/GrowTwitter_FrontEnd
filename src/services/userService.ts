import { api } from './api';
import type { User, Tweet, FollowersResponse } from '../types';

export const userService = {
  getUserById: async (userId: string): Promise<User> => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },
  getAllUsers: async (): Promise<User[]> => {
    const response = await api.get('/users');
    return response.data;
  },
  getUserTweets: async (userId: string): Promise<Tweet[]> => {
    const response = await api.get(`/users/${userId}/tweets`);
    return response.data;
  },
  getFollowers: async (): Promise<FollowersResponse> => {
    const response = await api.get('/followers');
    return response.data;
  },
  followUser: async (userId: string): Promise<void> => {
    await api.post('/followers', { userId });
  },
  unfollowUser: async (userId: string): Promise<void> => {
    await api.delete('/followers', { data: { userId } });
  }
};
