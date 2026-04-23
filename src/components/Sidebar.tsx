import React, { useState } from 'react';
import { Box, Typography, Button, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home as HomeIcon, Search as SearchIcon, Person as PersonIcon, Logout as LogoutIcon, Close as CloseIcon, Add as AddIcon } from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { logout } from '../store/slices/authSlice';
import { TweetCompose } from './TweetCompose';

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [openModal, setOpenModal] = useState(false);

  const handleProfileClick = () => {
    if (user) navigate(`/profile/${user.id}`);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    { label: 'Página Inicial', icon: <HomeIcon fontSize="large" />, path: '/home', action: () => navigate('/home') },
    { label: 'Explorar', icon: <SearchIcon fontSize="large" />, path: '/explore', action: () => navigate('/explore') },
    { label: 'Perfil', icon: <PersonIcon fontSize="large" />, path: user ? `/profile/${user.id}` : '/profile', action: handleProfileClick },
  ];

  return (
    <Box sx={{
      width: { sm: 88, lg: 240 },
      p: 2,
      display: { xs: 'none', sm: 'flex' },
      flexDirection: 'column',
      alignItems: { sm: 'center', lg: 'stretch' },
      position: 'sticky',
      top: 0,
      height: '100vh'
    }}>
      <Typography variant="h5" sx={{ display: { xs: 'none', lg: 'block' }, fontWeight: 800, mb: 4, letterSpacing: -1, px: 2 }}>
        grow<Box component="span" sx={{ color: 'primary.main' }}>tweet</Box>
      </Typography>

      <Typography variant="h4" sx={{ display: { xs: 'none', sm: 'block', lg: 'none' }, fontWeight: 800, mb: 4, color: 'primary.main' }}>
        gt
      </Typography>

      <Box sx={{ flex: 1, mt: 2 }}>
        <List>
          {menuItems.map((item) => (
            <ListItem disablePadding key={item.label} sx={{ mb: 1 }}>
              <ListItemButton
                onClick={item.action}
                sx={{
                  borderRadius: 9999,
                  py: 1.5,
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
                  width: 'fit-content',
                  px: { sm: 1.5, lg: 2 },
                  pr: { lg: 3 },
                  justifyContent: 'center'
                }}
              >
                <ListItemIcon sx={{ color: 'text.primary', minWidth: 'auto', mr: { lg: 2 } }}>
                  {React.cloneElement(item.icon, {
                    sx: { fontSize: '2rem' }
                  })}
                </ListItemIcon>
                <ListItemText
                  disableTypography
                  sx={{ display: { xs: 'none', lg: 'block' }, m: 0 }}
                  primary={
                    <Typography sx={{ fontSize: '1.25rem', fontWeight: isActive(item.path) ? 800 : 400 }}>
                      {item.label}
                    </Typography>
                  }
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenModal(true)}
          sx={{ display: { xs: 'none', lg: 'block' }, mt: 2, py: 1.5, fontSize: '1.1rem', borderRadius: 9999, fontWeight: 700, width: '100%' }}
        >
          Tweetar
        </Button>

        <IconButton
          color="primary"
          onClick={() => setOpenModal(true)}
          sx={{ display: { xs: 'none', sm: 'flex', lg: 'none' }, bgcolor: 'primary.main', color: 'white', width: 48, height: 48, mt: 2, '&:hover': { bgcolor: 'primary.dark' } }}
        >
          <AddIcon />
        </IconButton>
      </Box>

      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        maxWidth="sm"
        fullWidth
        sx={{ '& .MuiDialog-paper': { bgcolor: 'black', borderRadius: 4, border: '1px solid #2f3336' } }}
      >
        <DialogTitle sx={{ borderBottom: '1px solid #2f3336', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <IconButton onClick={() => setOpenModal(false)} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ borderBottom: 'none' }}>
            <TweetCompose onSuccess={() => setOpenModal(false)} />
          </Box>
        </DialogContent>
      </Dialog>

      {user && (
        <Box sx={{ mt: 'auto', p: 1, display: 'flex', alignItems: 'center', justifyContent: { sm: 'center', lg: 'space-between' }, borderRadius: 9999, '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }, cursor: 'pointer' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              component="img"
              src={user.imageUrl || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
              sx={{ width: 40, height: 40, borderRadius: '50%' }}
            />
            <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
              <Typography variant="body1" sx={{ fontWeight: 700, lineHeight: 1.2 }}>{user.name}</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>@{user.username}</Typography>
            </Box>
          </Box>
          <Button onClick={handleLogout} sx={{ display: { xs: 'none', lg: 'block' }, minWidth: 0, p: 1, color: 'text.secondary', '&:hover': { color: 'white' } }}>
            <LogoutIcon />
          </Button>
        </Box>
      )}
    </Box>
  );
};
