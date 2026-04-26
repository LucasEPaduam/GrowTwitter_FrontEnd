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

export const fetchFeed = createAsyncThunk('feed/fetchFeed', async (userId: string | undefined, thunkAPI) => {
  try {
    const state = thunkAPI.getState() as any;
    const currentUserId = userId || state.auth.user?.id;

    if (!currentUserId) {
      return await tweetService.getFeed();
    }

    const [feedTweets, userTweets] = await Promise.all([
      tweetService.getFeed(),
      tweetService.getUserTweets(currentUserId)
    ]);

    const combined = [...feedTweets, ...userTweets];

    const uniqueMap = new Map();
    combined.forEach(tweet => {
      uniqueMap.set(tweet.id, tweet);
    });

    return Array.from(uniqueMap.values());
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

export const editTweet = createAsyncThunk('feed/editTweet', async ({ id, content }: { id: string, content: string }, thunkAPI) => {
  try {
    return await tweetService.updateTweet(id, content);
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Falha ao editar tweet');
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
      .addCase(editTweet.fulfilled, (state, action) => {
        const index = state.tweets.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          // Mantém as referências de autor e likes que podem não vir completas no PUT
          state.tweets[index] = { ...state.tweets[index], ...action.payload };
        }
        
        // Também tentar atualizar se for uma reply dentro de algum tweet
        state.tweets.forEach(tweet => {
          if (tweet.replies) {
            const replyIndex = tweet.replies.findIndex(r => r.id === action.payload.id);
            if (replyIndex !== -1) {
              tweet.replies[replyIndex] = { ...tweet.replies[replyIndex], ...action.payload };
            }
          }
        });
      })

      .addCase(deleteTweet.fulfilled, (state, action) => {
        // Remove da lista principal
        state.tweets = state.tweets.filter(t => t.id !== action.payload);
        
        // Remove das respostas de outros tweets
        state.tweets.forEach(tweet => {
          if (tweet.replies) {
            tweet.replies = tweet.replies.filter(r => r.id !== action.payload);
          }
        });
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
