import React, { useEffect } from 'react';
import { Box, Typography, Divider, CircularProgress } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchFeed } from '../store/slices/feedSlice';
import { TweetCompose } from '../components/TweetCompose';
import { TweetCard } from '../components/TweetCard';

export const HomePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { tweets, loading } = useAppSelector((state) => state.feed);

  useEffect(() => {
    dispatch(fetchFeed());
  }, [dispatch]);

  return (
    <Box sx={{ pb: 10 }}>
      <Box sx={{
        p: 2,
        position: 'sticky',
        top: 0,
        zIndex: 10,
        bgcolor: 'background.default',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}>
        <Typography variant="h6" sx={{ fontWeight: 800 }}>Página Inicial</Typography>
      </Box>

      <TweetCompose />
      <Divider sx={{ borderColor: '#2f3336', height: 8, bgcolor: '#16181c' }} />

      <Box>
        {loading && tweets.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress size={30} />
          </Box>
        ) : (
          tweets.map((tweet) => (
            <TweetCard key={tweet.id} tweet={tweet} />
          ))
        )}
      </Box>
    </Box>
  );
};
