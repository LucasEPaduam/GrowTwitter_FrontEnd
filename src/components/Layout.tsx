import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Fab, Dialog, DialogContent, DialogTitle,
  IconButton, Drawer, Avatar, List, ListItem, ListItemButton,
  ListItemIcon, ListItemText, Divider
} from '@mui/material';
import {
  Add as AddIcon, Close as CloseIcon,
  Home as HomeIcon, Search as SearchIcon, Person as PersonIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { Sidebar } from './Sidebar';
import { TrendingPanel } from './TrendingPanel';
import { TweetCompose } from './TweetCompose';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { reloadCurrentUser, logout } from '../store/slices/authSlice';
import { useEffect } from 'react';

export const Layout: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector(state => state.auth);
  const [isTweetModalOpen, setIsTweetModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    if (user?.id) dispatch(reloadCurrentUser(user.id));
  }, [dispatch, user?.id]);

  const handleLogout = () => {
    dispatch(logout());
    setIsDrawerOpen(false);
    navigate('/login');
  };

  const navItems = [
    { label: 'Página Inicial', icon: <HomeIcon />, path: '/home' },
    { label: 'Explorar', icon: <SearchIcon />, path: '/explore' },
    { label: 'Perfil', icon: <PersonIcon />, path: user ? `/profile/${user.id}` : '/profile' },
  ];

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', justifyContent: 'center' }}>
      <Sidebar />

      <Box sx={{
        flex: 1,
        width: '100%',
        maxWidth: 600,
        borderLeft: { xs: 'none', sm: '1px solid' },
        borderRight: { xs: 'none', sm: '1px solid' },
        borderColor: 'divider',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Box sx={{
          display: { xs: 'flex', sm: 'none' },
          position: 'sticky',
          top: 0,
          zIndex: 100,
          bgcolor: 'background.default',
          backdropFilter: 'blur(10px)',
          px: 2,
          py: 1,
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}>
          {user && (
            <Avatar
              src={user.imageUrl || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
              sx={{ width: 32, height: 32, cursor: 'pointer' }}
              onClick={() => setIsDrawerOpen(true)}
            />
          )}
          <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: -0.5, color: 'text.primary' }}>
            grow<Box component="span" sx={{ color: 'primary.main' }}>tweet</Box>
          </Typography>
          <Box sx={{ width: 32 }} />
        </Box>

        <Outlet />
      </Box>

      <TrendingPanel />

      <Fab
        color="primary"
        aria-label="Novo Tweet"
        onClick={() => setIsTweetModalOpen(true)}
        sx={{
          position: 'fixed',
          bottom: 80,
          right: 16,
          zIndex: 1100,
          display: { xs: 'flex', sm: 'none' },
        }}
      >
        <AddIcon />
      </Fab>

      <Dialog
        open={isTweetModalOpen}
        onClose={() => setIsTweetModalOpen(false)}
        fullScreen
        keepMounted={false}
        sx={{
          zIndex: 1200,
          '& .MuiDialog-paper': {
            bgcolor: 'background.default',
            backgroundImage: 'none',
          }
        }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid', borderColor: 'divider', py: 1 }}>
          <IconButton
            edge="start"
            onClick={() => setIsTweetModalOpen(false)}
            sx={{ color: 'text.primary', mr: 1 }}
          >
            <CloseIcon />
          </IconButton>
          <Box component="span" sx={{ fontWeight: 800, fontSize: '1.25rem', color: 'text.primary' }}>Novo Tweet</Box>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <TweetCompose onSuccess={() => setIsTweetModalOpen(false)} />
        </DialogContent>
      </Dialog>


      <Drawer
        anchor="left"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        keepMounted={false}
        sx={{
          '& .MuiDrawer-paper': {
            width: 280,
            bgcolor: 'background.default',
            backgroundImage: 'none',
          }
        }}
      >
        <Box sx={{ p: 2.5, pt: 3 }}>
          <Avatar
            src={user?.imageUrl || `https://ui-avatars.com/api/?name=${user?.name}&background=random`}
            sx={{ width: 56, height: 56, mb: 1.5 }}
          />
          <Typography variant="body1" sx={{ fontWeight: 800, color: 'text.primary', lineHeight: 1.2 }}>
            {user?.name}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            @{user?.username}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mt: 1.5 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              <Box component="span" sx={{ fontWeight: 700, color: 'text.primary' }}>
                {user?.following?.length || 0}
              </Box> Seguindo
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              <Box component="span" sx={{ fontWeight: 700, color: 'text.primary' }}>
                {user?.followers?.length || 0}
              </Box> Seguidores
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ borderColor: 'divider' }} />

        {/* Links de navegação */}
        <List sx={{ py: 1 }}>
          {navItems.map((item) => (
            <ListItem key={item.label} disablePadding>
              <ListItemButton
                onClick={() => { navigate(item.path); setIsDrawerOpen(false); }}
                sx={{ py: 1.5, px: 2.5, borderRadius: 2, mx: 1, '&:hover': { bgcolor: 'action.hover' } }}
              >
                <ListItemIcon sx={{ color: 'text.primary', minWidth: 44 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  disableTypography
                  primary={
                    <Typography sx={{ fontWeight: 600, color: 'text.primary', fontSize: '1.1rem' }}>
                      {item.label}
                    </Typography>
                  }
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Divider sx={{ borderColor: 'divider' }} />

        {/* Rodapé: Logout */}
        <List sx={{ py: 1 }}>
          <ListItem disablePadding>
            <ListItemButton
              onClick={handleLogout}
              sx={{ py: 1.5, px: 2.5, borderRadius: 2, mx: 1, '&:hover': { bgcolor: 'action.hover' } }}
            >
              <ListItemIcon sx={{ color: 'text.secondary', minWidth: 44 }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText
                disableTypography
                primary={
                  <Typography sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '1rem' }}>
                    Sair da conta
                  </Typography>
                }
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
    </Box>
  );
};
