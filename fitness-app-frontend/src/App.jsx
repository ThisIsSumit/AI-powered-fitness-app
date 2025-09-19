import { 
  Box, 
  Button, 
  Typography, 
  Container,
  AppBar,
  Toolbar,
  Avatar,
  Menu,
  MenuItem,
  CircularProgress,
  ThemeProvider,
  createTheme,
  CssBaseline
} from "@mui/material";
import PropTypes from 'prop-types';
import { FitnessCenter, AccountCircle } from "@mui/icons-material";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "react-oauth2-code-pkce";
import { useDispatch } from "react-redux";
import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import { setCredentials } from "./store/authSlice";
import { apiService } from "./services/api";
import ActivityForm from "./components/ActivityForm";
import ActivityList from "./components/ActivityList";
import ActivityDetail from "./components/ActivityDetail";

const theme = createTheme({
palette: {
  primary: {
    main: '#1976d2',
    light: '#42a5f5',
    dark: '#1565c0',
  },
  secondary: {
    main: '#dc004e',
  },
  background: {
    default: '#f5f5f5',
  },
},
typography: {
  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  h4: {
    fontWeight: 700,
  },
  h5: {
    fontWeight: 600,
  },
},
components: {
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 12,
      },
    },
  },
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        textTransform: 'none',
        fontWeight: 600,
      },
    },
  },
},
});

const AppHeader = ({ user, onLogout }) => {
const [anchorEl, setAnchorEl] = useState(null);

const handleMenu = (event) => {
  setAnchorEl(event.currentTarget);
};

const handleClose = () => {
  setAnchorEl(null);
};

const handleLogout = () => {
  handleClose();
  onLogout();
};

return (
  <AppBar position="sticky" elevation={2}>
    <Toolbar>
      <FitnessCenter sx={{ mr: 2 }} />
      <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
        Fitness Tracker
      </Typography>
      
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Button
          onClick={handleMenu}
          startIcon={<AccountCircle />}
          color="inherit"
          sx={{ textTransform: 'none' }}
        >
          {user?.name || user?.email || 'User'}
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Box>
    </Toolbar>
  </AppBar>
);
};

AppHeader.propTypes = {
  user: PropTypes.object,
  onLogout: PropTypes.func.isRequired,
};

const ActivitiesPage = () => {
return (
  <Container maxWidth="lg" sx={{ py: 4 }}>
    <ActivityForm />
    <ActivityList />
  </Container>
);
};

const LoadingScreen = () => (
<Box
  sx={{
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  }}
>
  <CircularProgress size={60} />
  <Typography variant="h6">Loading...</Typography>
</Box>
);

const LoginScreen = ({ onLogin }) => (
<Box
  sx={{
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    px: 2,
  }}
>
  <FitnessCenter sx={{ fontSize: 80, mb: 2, opacity: 0.9 }} />
  <Typography variant="h3" gutterBottom sx={{ fontWeight: 700, mb: 1 }}>
    Fitness Tracker
  </Typography>
  <Typography variant="h6" sx={{ mb: 4, opacity: 0.9, maxWidth: 500 }}>
    Track your workouts, monitor progress, and get AI-powered insights to reach your fitness goals
  </Typography>
  <Button 
    variant="contained"
    size="large"
    onClick={onLogin}
    sx={{
      py: 1.5,
      px: 4,
      fontSize: '1.1rem',
      background: 'rgba(255,255,255,0.2)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255,255,255,0.3)',
      '&:hover': {
        background: 'rgba(255,255,255,0.3)',
      }
    }}
  >
    Get Started
  </Button>
</Box>
);

function App() {
const { token, tokenData, logIn, logOut, isAuthenticated } = useContext(AuthContext);
const dispatch = useDispatch();
const [authReady, setAuthReady] = useState(false);

useEffect(() => {
  if (token && tokenData) {
    // Immediately set the token provider before dispatching to Redux
    apiService.setTokenProvider(() => token);
    dispatch(setCredentials({ token, user: tokenData }));
    setAuthReady(true);
  } else if (isAuthenticated === false) {
    setAuthReady(true);
  }
}, [token, tokenData, dispatch, isAuthenticated]);

useEffect(() => {
  // Always ensure the token provider is set when token changes
  if (token) {
    apiService.setTokenProvider(() => token);
  }
}, [token]);

if (!authReady) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LoadingScreen />
    </ThemeProvider>
  );
}

return (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Router>
      {!token ? (
        <LoginScreen onLogin={logIn} />
      ) : (
        <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
          <AppHeader user={tokenData} onLogout={logOut} />
          {/* Only render routes when we have both token and tokenData */}
          {token && tokenData ? (
            <Routes>
              <Route path="/activities" element={<ActivitiesPage />} />
              <Route path="/activities/:id" element={<ActivityDetail />} />
              <Route path="/" element={<Navigate to="/activities" replace />} />
            </Routes>
          ) : (
            <LoadingScreen />
          )}
        </Box>
      )}
    </Router>
  </ThemeProvider>
);
}

export default App;