import { api } from './api';
import type { Tweet } from '../types';

export const tweetService = {
  getFeed: async (): Promise<Tweet[]> => {
    const response = await api.get('/feed');
    return response.data;
  },
  createTweet: async (content: string): Promise<Tweet> => {
    const response = await api.post('/tweets', { content });
    return response.data;
  },
  createReply: async (content: string, replyTo: string): Promise<Tweet> => {
    const response = await api.post('/replies', { content, replyTo });
    return response.data;
  },
  likeTweet: async (tweetId: string): Promise<void> => {
    await api.post('/likes', { tweetId });
  },
  unlikeTweet: async (tweetId: string): Promise<void> => {
    await api.delete('/likes', { data: { tweetId } });
  },
  deleteTweet: async (id: string): Promise<void> => {
    await api.delete(`/tweets/${id}`);
  }
};
