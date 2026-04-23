import React from 'react';
import { Paper, BottomNavigation, BottomNavigationAction } from '@mui/material';
import { Home, Search, Person } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';

export const MobileNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAppSelector((state) => state.auth);

  const getSelectedValue = () => {
    if (location.pathname.includes('/explore')) return 1;
    if (location.pathname.includes('/profile')) return 2;
    return 0;
  };

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        display: { xs: 'block', sm: 'none' }
      }}
      elevation={0}
    >
      <BottomNavigation
        showLabels={false}
        value={getSelectedValue()}
        onChange={(event, newValue) => {
          if (newValue === 0) navigate('/home');
          if (newValue === 1) navigate('/explore');
          if (newValue === 2) navigate(user ? `/profile/${user.id}` : '/profile');
        }}
        sx={{
          bgcolor: 'background.default',
          backdropFilter: 'blur(10px)',
          borderTop: '1px solid',
          borderColor: 'divider',
          height: 64,
          '& .MuiBottomNavigationAction-root': {
            color: 'text.secondary',
          },
          '& .Mui-selected': {
            color: 'primary.main',
          }
        }}
      >
        <BottomNavigationAction icon={<Home fontSize="large" />} />
        <BottomNavigationAction icon={<Search fontSize="large" />} />
        <BottomNavigationAction icon={<Person fontSize="large" />} />
      </BottomNavigation>
    </Paper>
  );
};
