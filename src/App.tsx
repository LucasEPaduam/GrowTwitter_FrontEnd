import React, { useState, useMemo } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline, IconButton, Box } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';

import { getAppTheme } from './styles/theme';


import { useAppSelector } from './store/hooks';
import { PrivateRoute } from './components/PrivateRoute';
import { Layout } from './components/Layout';
import { MobileNavigation } from './components/MobileNavigation';


import { Login } from './pages/Login';
import { HomePage } from './pages/HomePage';
import { ProfilePage } from './pages/ProfilePage';
import { ExplorePage } from './pages/ExplorePage';

const App: React.FC = () => {
  const [mode, setMode] = useState<'light' | 'dark'>('dark');

  const theme = useMemo(() => getAppTheme(mode), [mode]);

  const { user } = useAppSelector((state) => state.auth);

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <BrowserRouter>
        {user && (
          <Box sx={{ position: 'fixed', top: 12, right: 12, zIndex: 2000 }}>
            <IconButton onClick={toggleTheme} color="primary">
              {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Box>
        )}

        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/" element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }>
            <Route index element={<HomePage />} />
            <Route path="home" element={<HomePage />} />
            <Route path="explore" element={<ExplorePage />} />
            <Route path="profile/:userId" element={<ProfilePage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {user && <MobileNavigation />}
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;