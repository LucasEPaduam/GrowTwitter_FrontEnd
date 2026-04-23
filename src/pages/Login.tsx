import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, CircularProgress, Alert, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loginUser, registerUser } from '../store/slices/authSlice';

export const Login: React.FC = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ name: '', username: '', password: '', imageUrl: '' });

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { loading, error, token } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      navigate('/home');
    }
  }, [token, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegister) {
      const payload = {
        ...formData,
        imageUrl: formData.imageUrl.trim() === '' ? undefined : formData.imageUrl
      };
      const response = await dispatch(registerUser(payload));
      if (registerUser.fulfilled.match(response)) {
        navigate('/home');
      }
    } else {
      const response = await dispatch(loginUser({ username: formData.username, password: formData.password }));
      if (loginUser.fulfilled.match(response)) {
        navigate('/home');
      }
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
      <Paper elevation={0} sx={{ width: '100%', maxWidth: 400, p: 4, display: 'flex', flexDirection: 'column', gap: 4, border: '1px solid #2f3336', borderRadius: 4 }}>

        {/* Header Branding */}
        <Typography variant="h3" sx={{ fontWeight: 900, textAlign: 'center', letterSpacing: -1.5 }}>
          grow<Box component="span" sx={{ color: 'primary.main' }}>tweet</Box>
        </Typography>

        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          {isRegister ? 'Criar sua conta' : 'Acontecendo agora'}
        </Typography>

        {error && <Alert severity="error" variant="filled" sx={{ borderRadius: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {isRegister && (
            <TextField
              label="Nome completo"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              fullWidth
            />
          )}

          <TextField
            label="Usuário"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            fullWidth
          />

          <TextField
            label="Senha"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            fullWidth
          />

          {isRegister && (
            <TextField
              label="URL da Foto do Perfil (opcional)"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              fullWidth
            />
          )}

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={loading}
            sx={{ mt: 1, height: 50, fontSize: '1rem' }}
          >
            {loading ? <CircularProgress size={26} color="inherit" /> : (isRegister ? 'Inscrever-se' : 'Entrar')}
          </Button>
        </Box>

        <Box sx={{ textAlign: 'center', mt: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {isRegister ? 'Já tem uma conta?' : 'Não tem uma conta? Inscreva-se hoje.'}
          </Typography>
          <Button
            variant="outlined"
            fullWidth
            sx={{ height: 48 }}
            onClick={() => {
              setIsRegister(!isRegister);
            }}
          >
            {isRegister ? 'Fazer Login' : 'Criar conta'}
          </Button>
        </Box>

      </Paper>
    </Box>
  );
};
