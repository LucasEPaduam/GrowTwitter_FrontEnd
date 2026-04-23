import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField, InputAdornment, List, ListItem, Divider, IconButton, CircularProgress, Button, Avatar, ListItemAvatar } from '@mui/material';
import { Search as SearchIcon, MoreHoriz as MoreHorizIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { userService } from '../services/userService';
import { followUser, unfollowUser } from '../store/slices/profileSlice';

const TRENDS = [
  { category: 'Programação - Em alta', topic: '#ReactJS', tweets: '125K Tweets' },
  { category: 'Tecnologia - Assunto do Momento', topic: '#TypeScript', tweets: '89K Tweets' },
  { category: 'Educação - Tendência', topic: '#Growdev', tweets: '45K Tweets' },
  { category: 'Música - Assunto do Momento', topic: 'Top Brasil', tweets: '2.1M Tweets' },
];

export const ExplorePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAppSelector(state => state.auth);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await userService.getAllUsers();
        const filtered = res.filter(u => u.id !== currentUser?.id);
        setSuggestions(filtered);
      } catch (e) {
        console.error("Erro ao carregar explorador:", e);
      } finally {
        setLoading(false);
      }
    };
    if (currentUser) fetchAll();
  }, [currentUser]);

  const toggleFollow = async (targetUserId: string, currentlyFollowing: boolean) => {
    try {
      if (currentlyFollowing) {
        await dispatch(unfollowUser(targetUserId)).unwrap();
      } else {
        await dispatch(followUser(targetUserId)).unwrap();
      }
    } catch (e) {
      console.error("Erro ao atualizar follow:", e);
    }
  };

  return (
    <Box sx={{ pb: 12 }}>
      <Box sx={{
        p: 2,
        position: 'sticky',
        top: 0,
        bgcolor: 'background.default',
        backdropFilter: 'blur(10px)',
        zIndex: 10,
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}>
        <TextField
          fullWidth
          placeholder="Buscar no Growtwitter"
          variant="outlined"
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 9999,
              bgcolor: 'action.hover',
              '& fieldset': { border: 'none' }
            }
          }}
          slotProps={{ input: { startAdornment: (<InputAdornment position="start"><SearchIcon sx={{ color: 'text.secondary' }} /></InputAdornment>) } }}
        />
      </Box>

      <Typography variant="h6" sx={{ fontWeight: 800, p: 2, pb: 1 }}>Quem seguir</Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}><CircularProgress size={24} /></Box>
      ) : (
        <List disablePadding>
          {suggestions.slice(0, 5).map((user) => {
            const isFollowing = currentUser?.following?.some((f: any) => f.followingId === user.id || f.id === user.id) || false;

            return (
              <ListItem
                key={user.id}
                sx={{ py: 1.5, px: 2, cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
                secondaryAction={
                  <Button
                    variant={isFollowing ? "contained" : "outlined"}
                    size="small"
                    onClick={() => toggleFollow(user.id, isFollowing)}
                    sx={{
                      borderRadius: 9999,
                      bgcolor: isFollowing ? 'text.primary' : 'transparent',
                      color: isFollowing ? 'background.default' : 'text.primary',
                      borderColor: isFollowing ? 'transparent' : 'divider',
                      fontWeight: 700,
                      textTransform: 'none',
                      px: 2
                    }}
                  >
                    {isFollowing ? 'Seguindo' : 'Seguir'}
                  </Button>
                }
              >
                <ListItemAvatar onClick={() => navigate(`/profile/${user.id}`)}>
                  <Avatar src={user.imageUrl || `https://ui-avatars.com/api/?name=${user.name}`} />
                </ListItemAvatar>
                <Box onClick={() => navigate(`/profile/${user.id}`)}>
                  <Typography variant="body1" sx={{ fontWeight: 700, lineHeight: 1 }}>{user.name}</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>@{user.username}</Typography>
                </Box>
              </ListItem>
            );
          })}
        </List>
      )}

      <Divider sx={{ my: 1 }} />

      <Typography variant="h6" sx={{ fontWeight: 800, p: 2 }}>O que está acontecendo</Typography>
      <List disablePadding>
        {TRENDS.map((trend, index) => (
          <React.Fragment key={trend.topic}>
            <ListItem sx={{ flexDirection: 'column', alignItems: 'flex-start', py: 1.5, px: 2, cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }} secondaryAction={<IconButton edge="end"><MoreHorizIcon /></IconButton>}>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>{trend.category}</Typography>
              <Typography variant="body1" sx={{ fontWeight: 700, mt: 0.5 }}>{trend.topic}</Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5 }}>{trend.tweets}</Typography>
            </ListItem>
            {index < TRENDS.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};