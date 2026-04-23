import React, { useState } from 'react';
import { Box, Typography, Avatar, IconButton, Card, CardContent, CardActions, TextField, Button, CircularProgress } from '@mui/material';
import { ChatBubbleOutlined as ChatBubbleOutlineIcon, FavoriteBorder as FavoriteBorderIcon, Favorite as FavoriteIcon, DeleteOutlined as DeleteOutlineIcon } from '@mui/icons-material';
import type { Tweet } from '../types';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { toggleLike, deleteTweet, createReply, fetchFeed } from '../store/slices/feedSlice';

function formatTwitterDate(dateString: string): string {
  const now = Date.now();
  const date = new Date(dateString).getTime();
  const diffMs = now - date;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);

  if (diffMin < 1) return 'agora';

  if (diffMin < 60) return `${diffMin} m`;

  if (diffHours < 24) return `${diffHours} h`;

  const formatted = new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'short' }).format(new Date(dateString));
  return formatted.replace('.', '');
}

interface TweetCardProps {
  tweet: Tweet;
  isReply?: boolean;
  rootTweetId?: string;
  isLastInThread?: boolean;
}

export const TweetCard: React.FC<TweetCardProps> = ({ tweet, isReply = false, rootTweetId, isLastInThread = true }) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);

  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  const likes = Array.isArray(tweet.likes) ? tweet.likes : [];
  const isLikedByMe = user ? likes.some(like => String(like?.author?.id) === String(user.id) || like?.author?.id === 'mock') : false;
  const likesCount = likes.length;

  const handleToggleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);
    try {
      await dispatch(toggleLike({ tweetId: tweet.id, isLiked: isLikedByMe })).unwrap();
    } catch {
    } finally {
      setIsLiking(false);
    }
  };

  const handleDelete = () => {
    if (window.confirm("Deseja realmente excluir este tweet?")) {
      dispatch(deleteTweet(tweet.id));
    }
  };

  const submitReply = async () => {
    if (!replyContent.trim()) return;
    setIsSubmittingReply(true);
    try {
      const targetId = rootTweetId || tweet.id;
      await dispatch(createReply({ content: replyContent, replyTo: targetId })).unwrap();
      setReplyContent('');
      setIsReplying(false);
      dispatch(fetchFeed());
    } catch (err) {
      console.error('Falha ao responder', err);
    } finally {
      setIsSubmittingReply(false);
    }
  };

  return (
    <>
      <Card sx={{
        borderRadius: 0,
        borderBottom: ((tweet.replies && tweet.replies.length > 0) || (isReply && !isLastInThread)) ? 'none' : '1px solid',
        borderColor: 'divider',
        bgcolor: 'transparent',
        boxShadow: 'none',
        '&:hover': { bgcolor: 'action.hover', cursor: 'pointer' }
      }}>
        <CardContent sx={{ pb: '8px !important', pt: 2, display: 'flex' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 40, flexShrink: 0, mr: { xs: 1.5, sm: 2 } }}>
            {isReply && (
              <Box sx={{ width: 2, bgcolor: 'divider', height: 16, mt: -2, mb: 0.5 }} />
            )}
            <Avatar sx={{ width: 40, height: 40 }} src={tweet.author?.imageUrl || `https://ui-avatars.com/api/?name=${tweet.author?.name || 'U'}&background=random`} />
            {((tweet.replies && tweet.replies.length > 0) || (isReply && !isLastInThread)) && (
              <Box sx={{ width: 2, bgcolor: 'divider', flexGrow: 1, mt: 0.5, mb: -2 }} />
            )}
          </Box>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5, width: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0, mr: 0.5 }}>
                <Typography noWrap sx={{ fontWeight: 800, flexShrink: 1, minWidth: 0, mr: 0.5 }}>{tweet.author?.name || 'User'}</Typography>
                <Typography noWrap variant="body2" sx={{ color: 'text.secondary', flexShrink: 1, minWidth: 0 }}>@{tweet.author?.username}</Typography>
              </Box>
              <Typography variant="body2" sx={{ flexShrink: 0, whiteSpace: 'nowrap', color: 'text.secondary', pr: 1 }}>
                · {formatTwitterDate(tweet.createdAt)}
              </Typography>
            </Box>

            <Typography sx={{ mb: 1, wordBreak: 'break-word', color: 'text.primary', whiteSpace: 'pre-wrap', lineHeight: 1.5, pr: { xs: 1.5, sm: 2 } }}>
              {tweet.content}
            </Typography>

            <CardActions sx={{ p: 0, mt: 1, display: 'flex', justifyContent: 'space-between', maxWidth: 420, color: 'text.secondary' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', '&:hover': { color: 'primary.main' } }} onClick={(e) => { e.stopPropagation(); setIsReplying(!isReplying); }}>
                <IconButton size="small" color="inherit">
                  <ChatBubbleOutlineIcon fontSize="small" />
                </IconButton>
                <Typography variant="caption" sx={{ ml: 0.5 }}>{tweet.replies?.length || 0}</Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', color: isLikedByMe ? '#f91880' : 'text.secondary', '&:hover': { color: '#f91880' } }} onClick={(e) => { e.stopPropagation(); handleToggleLike(); }}>
                <IconButton size="small" color="inherit">
                  {isLikedByMe ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
                </IconButton>
                <Typography variant="caption" sx={{ ml: 0.5 }}>{likesCount}</Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', visibility: 'hidden' }}>
                <IconButton size="small"><FavoriteBorderIcon fontSize="small" /></IconButton>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 40 }}>
                {user?.id === tweet.authorId && (
                  <Box sx={{ display: 'flex', alignItems: 'center', '&:hover': { color: '#f4212e' } }} onClick={(e) => { e.stopPropagation(); handleDelete(); }}>
                    <IconButton size="small" color="inherit">
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Box>
                )}
              </Box>
            </CardActions>

            {/* Sub-form para efetuar reply in-line */}
            {isReplying && (
              <Box sx={{ mt: 2, display: 'flex', gap: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }} onClick={(e) => e.stopPropagation()}>
                <Avatar src={user?.imageUrl || `https://ui-avatars.com/api/?name=${user?.name || 'U'}&background=random`} sx={{ width: 32, height: 32 }} />
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <TextField
                    autoFocus
                    multiline
                    placeholder="Postar sua resposta"
                    variant="standard"
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    slotProps={{ input: { disableUnderline: true, sx: { fontSize: '1.1rem', py: 0.5 } } }}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      variant="contained"
                      size="small"
                      disabled={!replyContent.trim() || isSubmittingReply}
                      onClick={submitReply}
                      sx={{ borderRadius: 9999, fontWeight: 700, textTransform: 'none' }}
                    >
                      {isSubmittingReply ? <CircularProgress size={16} color="inherit" /> : 'Responder'}
                    </Button>
                  </Box>
                </Box>
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>

      {tweet.replies && tweet.replies.length > 0 && (
        <Box sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
          {tweet.replies.map((reply, index) => (
            <TweetCard
              key={reply.id}
              tweet={reply}
              isReply={true}
              rootTweetId={rootTweetId || tweet.id}
              isLastInThread={index === tweet.replies!.length - 1}
            />
          ))}
        </Box>
      )}
    </>
  );
};
