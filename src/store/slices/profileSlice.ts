import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userService } from '../../services/userService';
import type { User, Tweet, FollowersResponse } from '../../types';
import { toggleLike, deleteTweet } from './feedSlice';

interface ProfileState {
  user: User | null;
  tweets: Tweet[];
  network: FollowersResponse | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  user: null,
  tweets: [],
  network: null,
  loading: false,
  error: null,
};

export const fetchProfile = createAsyncThunk('profile/fetchProfile', async (userId: string, thunkAPI) => {
  try {
    return await userService.getUserById(userId);
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Falha ao buscar usuário');
  }
});

export const fetchProfileTweets = createAsyncThunk('profile/fetchProfileTweets', async (userId: string, thunkAPI) => {
  try {
    return await userService.getUserTweets(userId);
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Falha ao buscar tweets do usuário');
  }
});

export const followUser = createAsyncThunk('profile/followUser', async (userId: string, thunkAPI) => {
  try {
    await userService.followUser(userId);
    return userId;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Falha ao seguir usuário');
  }
});

export const unfollowUser = createAsyncThunk('profile/unfollowUser', async (userId: string, thunkAPI) => {
  try {
    await userService.unfollowUser(userId);
    return userId;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Falha ao deixar de seguir usuário');
  }
});

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchProfile.fulfilled, (state, action) => { state.loading = false; state.user = action.payload; })
      .addCase(fetchProfile.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })

      .addCase(fetchProfileTweets.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchProfileTweets.fulfilled, (state, action) => { state.loading = false; state.tweets = action.payload; })
      .addCase(fetchProfileTweets.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })

      .addCase(deleteTweet.fulfilled, (state, action) => {
        state.tweets = state.tweets.filter((t) => t.id !== action.payload);
      })

      .addCase(toggleLike.pending, (state, action) => {
        const { tweetId, isLiked } = action.meta.arg;
        const tweet = state.tweets.find(t => t.id === tweetId);
        if (tweet) {
          if (!tweet.likes) tweet.likes = [];
          if (isLiked) {
            tweet.likes.pop();
          } else {
            tweet.likes.push({ author: { id: 'mock', name: 'You', username: 'you', createdAt: '' } } as any);
          }
        }
      })
      .addCase(toggleLike.rejected, (state, action) => {
        const { tweetId, isLiked } = action.meta.arg;
        const tweet = state.tweets.find(t => t.id === tweetId);
        if (tweet && tweet.likes) {
          if (isLiked) tweet.likes.push({ author: { id: 'mock', name: 'You', username: 'you', createdAt: '' } } as any);
          else tweet.likes.pop();
        }
      })
      .addCase(followUser.pending, (state, action) => {
        if (state.user && state.user.id === action.meta.arg) {
          if (!state.user.followers) state.user.followers = [];
          state.user.followers.push({ followerId: 'mock-curr-user' });
        }
      })
      .addCase(unfollowUser.pending, (state, action) => {
        if (state.user && state.user.id === action.meta.arg) {
          if (state.user.followers) {
            state.user.followers.pop();
          }
        }
      });
  },
});

export default profileSlice.reducer;
