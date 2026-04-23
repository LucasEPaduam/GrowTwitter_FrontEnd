import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { tweetService } from '../../services/tweetService';
import type { Tweet } from '../../types';

interface FeedState {
  tweets: Tweet[];
  loading: boolean;
  error: string | null;
}

const initialState: FeedState = {
  tweets: [],
  loading: false,
  error: null,
};

export const fetchFeed = createAsyncThunk('feed/fetchFeed', async (_, thunkAPI) => {
  try {
    return await tweetService.getFeed();
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Falha ao buscar feed');
  }
});

export const createTweet = createAsyncThunk('feed/createTweet', async (content: string, thunkAPI) => {
  try {
    return await tweetService.createTweet(content);
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Falha ao postar tweet');
  }
});

export const createReply = createAsyncThunk('feed/createReply', async ({ content, replyTo }: { content: string, replyTo: string }, thunkAPI) => {
  try {
    return await tweetService.createReply(content, replyTo);
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Falha ao responder tweet');
  }
});

export const deleteTweet = createAsyncThunk('feed/deleteTweet', async (id: string, thunkAPI) => {
  try {
    await tweetService.deleteTweet(id);
    return id;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Falha ao excluir tweet');
  }
});

export const toggleLike = createAsyncThunk('feed/toggleLike', async ({ tweetId, isLiked }: { tweetId: string, isLiked: boolean }, thunkAPI) => {
  try {
    if (isLiked) {
      await tweetService.unlikeTweet(tweetId);
    } else {
      await tweetService.likeTweet(tweetId);
    }
    return { tweetId, isLiked: !isLiked };
  } catch (error: any) {
    const status = error.response?.status;
    if (status === 409) {
      return { tweetId, isLiked: !isLiked };
    }
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Falha ao curtir/descurtir');
  }
});

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.loading = false;
        const sorted = (action.payload || []).slice().sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        state.tweets = sorted;
      })
      .addCase(fetchFeed.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })

      .addCase(createTweet.fulfilled, (state, action) => {
        state.tweets.unshift(action.payload);
      })

      .addCase(deleteTweet.fulfilled, (state, action) => {
        state.tweets = state.tweets.filter(t => t.id !== action.payload);
      })

      .addCase(toggleLike.pending, (state, action) => {
        const { tweetId, isLiked } = action.meta.arg;
        const tweet = state.tweets.find(t => t.id === tweetId);
        if (tweet) {
          if (!tweet.likes) tweet.likes = [];
          if (isLiked) {
            tweet.likes.pop();
          } else {
            tweet.likes.push({ author: { id: 'mock', name: 'You', username: 'you', createdAt: '' } });
          }
        }
      })
      .addCase(toggleLike.rejected, (state, action) => {
        const { tweetId, isLiked } = action.meta.arg;
        const tweet = state.tweets.find(t => t.id === tweetId);
        if (tweet && tweet.likes) {
          if (isLiked) {
            tweet.likes.push({ author: { id: 'mock', name: 'You', username: 'you', createdAt: '' } });
          } else {
            tweet.likes.pop();
          }
        }
      });
  },
});

export default feedSlice.reducer;
