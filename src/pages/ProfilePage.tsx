import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Avatar, CircularProgress, Alert, IconButton, Button } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchProfile, fetchProfileTweets, followUser, unfollowUser } from '../store/slices/profileSlice';
import { TweetCard } from '../components/TweetCard';
import { TweetCompose } from '../components/TweetCompose';

export const ProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { user: profileUser, tweets, loading, error } = useAppSelector(state => state.profile);
  const { user: currentUser } = useAppSelector(state => state.auth);

  const isOwnProfile = profileUser?.id === currentUser?.id;
  const isFollowing = currentUser?.following?.some((f: any) => f.followingId === profileUser?.id || f.id === profileUser?.id) || false;

  const handleToggleFollow = () => {
    if (!profileUser) return;
    if (isFollowing) dispatch(unfollowUser(profileUser.id));
    else dispatch(followUser(profileUser.id));
  };

  useEffect(() => {
    if (userId) {
      dispatch(fetchProfile(userId));
      dispatch(fetchProfileTweets(userId));
    }
  }, [dispatch, userId]);

  if (loading && !profileUser) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>;
  }

  if (error) {
    return <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>;
  }

  return (
    <Box>
      <Box sx={{ borderBottom: '1px solid', borderColor: 'divider', p: 1, display: 'flex', alignItems: 'center', gap: 2, position: 'sticky', top: 0, bgcolor: 'background.default', backdropFilter: 'blur(10px)', zIndex: 10 }}>
        <IconButton onClick={() => navigate('/home')} sx={{ color: 'text.primary' }}>
          <ArrowBackIcon />
        </IconButton>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2 }}>{profileUser?.name}</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>{tweets?.length || 0} Tweets</Typography>
        </Box>
      </Box>

      <Box sx={{ borderBottom: '1px solid #2f3336' }}>
        {/* Banner */}
        <Box sx={{ height: 160, bgcolor: 'primary.dark', width: '100%' }} />

        {/* Profile Info Container */}
        <Box sx={{ px: 2, pt: 1, position: 'relative' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Avatar
              src={profileUser?.imageUrl || `https://ui-avatars.com/api/?name=${profileUser?.name || 'U'}&background=random`}
              sx={{
                width: 120, height: 120,
                border: '4px solid',
                borderColor: 'background.default',
                mt: '-64px',
                mb: 2
              }}
            />
            {profileUser && !isOwnProfile && (
              <Button
                variant={isFollowing ? "contained" : "outlined"}
                onClick={handleToggleFollow}
                sx={{
                  borderRadius: 9999,
                  textTransform: 'none',
                  fontWeight: 800,
                  color: isFollowing ? 'background.default' : 'text.primary',
                  borderColor: 'gray',
                  bgcolor: isFollowing ? 'text.primary' : 'transparent',
                  '&:hover': {
                    bgcolor: isFollowing ? 'transparent' : 'divider'
                  }
                }}
              >
                {isFollowing ? 'Seguindo' : 'Seguir'}
              </Button>
            )}
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>{profileUser?.name}</Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>@{profileUser?.username}</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', pb: 2 }}>
            Registrado em: {profileUser?.createdAt ? new Date(profileUser.createdAt).toLocaleDateString() : 'Desconhecido'}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, pb: 2 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary', '&:hover': { textDecoration: 'underline', cursor: 'pointer' } }}>
              <Box component="span" sx={{ fontWeight: 700, color: 'text.primary' }}>{profileUser?.following?.length || 0}</Box> Seguindo
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', '&:hover': { textDecoration: 'underline', cursor: 'pointer' } }}>
              <Box component="span" sx={{ fontWeight: 700, color: 'text.primary' }}>{profileUser?.followers?.length || 0}</Box> Seguidores
            </Typography>
          </Box>
        </Box>
      </Box>

      {isOwnProfile && <TweetCompose />}

      <Box sx={{ px: { xs: 1, sm: 0 }, pb: { xs: 10, sm: 0 } }}>
        {tweets?.length === 0 ? (
          <Typography sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
            Nenhum post encontrado na conta deste usuário.
          </Typography>
        ) : (
          [...tweets].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(tweet => (
            <TweetCard key={tweet.id} tweet={tweet} />
          ))
        )}
      </Box>
    </Box>
  );
};
