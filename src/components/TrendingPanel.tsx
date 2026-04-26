import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Avatar, Button, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { userService } from '../services/userService';
import { followUser, unfollowUser } from '../store/slices/profileSlice';
import { RefreshOutlined as RefreshIcon } from '@mui/icons-material';

const TRENDS = [
  { category: 'Programação - Em alta', topic: '#ReactJS', tweets: '125K Tweets' },
  { category: 'Tecnologia - Assunto do Momento', topic: '#TypeScript', tweets: '89K Tweets' },
  { category: 'Educação - Tendência', topic: '#Growdev', tweets: '45K Tweets' },
  { category: 'Música - Assunto do Momento', topic: 'Top Brasil', tweets: '2.1M Tweets' },
];

export const TrendingPanel: React.FC = () => {
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { user: currentUser } = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await userService.getAllUsers();
        setAllUsers([...res].sort(() => 0.5 - Math.random()));
      } catch (e) { }
    };
    if (currentUser?.id) fetchAll();
  }, [currentUser?.id]);

  const followingIds = new Set(currentUser?.following?.map((f: any) => f.followingId || f.id) || []);
  const others = allUsers.filter(u => u.id !== currentUser?.id);
  const groupA = others.filter(u => !followingIds.has(u.id));
  const groupB = others.filter(u => followingIds.has(u.id));

  let aCount = Math.min(groupA.length, 2);
  let bCount = Math.min(groupB.length, 1);

  if (aCount < 2) {
    bCount = Math.min(groupB.length, 3 - aCount);
  }
  if (bCount < 1) {
    aCount = Math.min(groupA.length, 3 - bCount);
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
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
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
        
        {suggestions.length === 0 ? (
          <Typography color="text.secondary" sx={{ fontSize: '0.9rem', textAlign: 'center', py: 2 }}>Você já segue todos!</Typography>
        ) : (
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
        )}
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