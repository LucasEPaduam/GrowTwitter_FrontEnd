import React, { useState } from 'react';
import { Box, Button, TextField, CircularProgress, Avatar } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { createTweet, fetchFeed } from '../store/slices/feedSlice';
import { fetchProfileTweets } from '../store/slices/profileSlice';
import { useLocation } from 'react-router-dom';

interface TweetComposeProps {
  onSuccess?: () => void;
  onTweetSuccess?: () => void;
}

export const TweetCompose: React.FC<TweetComposeProps> = ({ onSuccess, onTweetSuccess }) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const location = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      await dispatch(createTweet(content)).unwrap();
      setContent('');

      dispatch(fetchFeed());

      if (user?.id && location.pathname.includes('/profile')) {
        dispatch(fetchProfileTweets(user.id));
      }

      onSuccess?.();
      onTweetSuccess?.();
    } catch (err) {
      console.error('Falha ao criar tweet', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 2, display: 'flex', gap: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
      <Avatar src={user?.imageUrl || `https://ui-avatars.com/api/?name=${user?.name || 'U'}&background=random`} />
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
        <TextField
          multiline
          minRows={2}
          maxRows={6}
          placeholder="O que está acontecendo?"
          variant="standard"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          slotProps={{
            htmlInput: { maxLength: 300 },
            input: { disableUnderline: true, sx: { fontSize: '1.2rem', lineHeight: 1.4 } }
          }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
          <Box component="span" sx={{ color: content.length > 280 ? 'error.main' : 'text.secondary', fontSize: '0.8rem' }}>
            {content.length}/300
          </Box>
          <Button
            type="submit"
            variant="contained"
            disabled={!content.trim() || isSubmitting}
            sx={{ borderRadius: 9999, fontWeight: 700, px: 3, textTransform: 'none' }}
          >
            {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Tweetar'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
