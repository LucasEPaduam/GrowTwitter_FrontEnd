import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Avatar, Button, Divider } from '@mui/material';
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

export const TrendingPanel: React.FC = () => {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const { user: currentUser } = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await userService.getAllUsers();
        const filtered = res.filter(u => u.id !== currentUser?.id).slice(0, 3);
        setSuggestions(filtered);
      } catch (e) { }
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
    } catch (e) { }
  };

  return (
    <Box sx={{
      width: 320,
      p: 2,
      display: { xs: 'none', lg: 'block' },
      position: 'sticky',
      top: 0,
      height: 'fit-content'
    }}>
      <Paper elevation={0} sx={{ bgcolor: 'action.hover', borderRadius: 4, p: 2, mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>Quem seguir</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {suggestions.map((user, idx) => {
            const isFollowing = currentUser?.following?.some((f: any) => f.followingId === user.id || f.id === user.id) || false;

            return (
              <Box key={user.id || idx} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', '&:hover': { opacity: 0.8 } }}>
                <Box onClick={() => navigate(`/profile/${user.id}`)} sx={{ display: 'flex', alignItems: 'center', gap: 1, overflow: 'hidden', flex: 1 }}>
                  <Avatar src={user.imageUrl || `https://ui-avatars.com/api/?name=${user.name}&background=random`} sx={{ width: 40, height: 40 }} />
                  <Box sx={{ minWidth: 0, pr: 1 }}>
                    <Typography variant="body1" noWrap sx={{ fontWeight: 700, lineHeight: 1.2 }}>{user.name}</Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>@{user.username}</Typography>
                  </Box>
                </Box>
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
                    minWidth: 'auto',
                    px: 2,
                    '&:hover': { opacity: 0.9 }
                  }}
                >
                  {isFollowing ? 'Seguindo' : 'Seguir'}
                </Button>
              </Box>
            )
          })}
        </Box>
      </Paper>

      <Paper elevation={0} sx={{ bgcolor: 'action.hover', borderRadius: 4, p: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>O que está acontecendo</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          {TRENDS.map((trend, idx) => (
            <React.Fragment key={idx}>
              <Box sx={{ cursor: 'pointer', py: 1.5, '&:hover': { opacity: 0.8 } }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>{trend.category}</Typography>
                <Typography variant="body1" sx={{ fontWeight: 700, mt: 0.2 }}>{trend.topic}</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>{trend.tweets}</Typography>
              </Box>
            </React.Fragment>
          ))}
        </Box>
      </Paper>
    </Box>
  );
};