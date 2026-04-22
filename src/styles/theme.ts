import { createTheme } from '@mui/material/styles';

export const getAppTheme = (mode: 'light' | 'dark') => createTheme({
  palette: {
    mode,
    primary: {
      main: '#1d9bf0',
      contrastText: '#ffffff',
    },
    ...(mode === 'light'
      ? {
        background: { default: '#ffffff', paper: '#f7f9f9' },
        text: { primary: '#0f1419', secondary: '#536471' },
        divider: '#eff3f4',
      }
      : {
        background: { default: '#000000', paper: '#000000' },
        text: { primary: '#e7e9ea', secondary: '#71767b' },
        divider: '#2f3336',
      }),
  },
  typography: {
    fontFamily: '"Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    button: { textTransform: 'none', fontWeight: 700 },
  },
  components: {
    MuiButton: { styleOverrides: { root: { borderRadius: 9999 } } },
    MuiCssBaseline: {
      styleOverrides: {
        body: { backgroundColor: mode === 'light' ? '#ffffff' : '#000000' },
      },
    },
  },
});