import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField, InputAdornment, List, ListItem, Divider, IconButton, CircularProgress, Button, Avatar, ListItemAvatar } from '@mui/material';
import { Search as SearchIcon, MoreHoriz as MoreHorizIcon, RefreshOutlined as RefreshIcon } from '@mui/icons-material';
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
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { user: currentUser } = useAppSelector(state => state.auth);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await userService.getAllUsers();
        // Randomiza apenas uma vez na carga inicial para evitar reshuffle nos cliques
        setAllUsers([...res].sort(() => 0.5 - Math.random()));
      } catch (e) {
        console.error("Erro ao carregar explorador:", e);
      } finally {
        setLoading(false);
      }
    };
    if (currentUser?.id) fetchAll();
  }, [currentUser?.id]);

  const followingIds = new Set(currentUser?.following?.map((f: any) => f.followingId || f.id) || []);
  const others = allUsers.filter(u => u.id !== currentUser?.id);
  const groupA = others.filter(u => !followingIds.has(u.id));
  const groupB = others.filter(u => followingIds.has(u.id));

  let aCount = Math.min(groupA.length, 3);
  let bCount = Math.min(groupB.length, 2);

  if (aCount < 3) {
    bCount = Math.min(groupB.length, 5 - aCount);
  }
  if (bCount < 2) {
    aCount = Math.min(groupA.length, 5 - bCount);
  }

  const suggestions = [...groupA.slice(0, aCount), ...groupB.slice(0, bCount)];

  const handleRefresh = () => {
    setIsRefreshing(true);
    setAllUsers(prev => [...prev].sort(() => 0.5 - Math.random()));
    setTimeout(() => setIsRefreshing(false), 500);
  };

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

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, pb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 800 }}>Quem seguir</Typography>
        <IconButton 
          onClick={handleRefresh} 
          size="small" 
          sx={{
            color: 'primary.main',
            animation: isRefreshing ? 'spin 0.5s ease' : 'none',
            '@keyframes spin': { '0%': { transform: 'rotate(0deg)' }, '100%': { transform: 'rotate(360deg)' } }
          }}
        >
          <RefreshIcon />
        </IconButton>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}><CircularProgress size={24} /></Box>
      ) : suggestions.length === 0 ? (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="text.secondary" sx={{ fontWeight: 600 }}>Você já segue todos os usuários disponíveis!</Typography>
        </Box>
      ) : (
        <List disablePadding>
          {suggestions.map((user) => {
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