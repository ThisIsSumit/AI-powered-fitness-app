import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null, // Don't use localStorage in initial state for SSR compatibility
    token: null,
    userId: null,
    isAuthenticated: false
  },
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.userId = action.payload.user.sub;
      state.isAuthenticated = true;

      // Immediately save to localStorage - synchronous operation
      if (typeof Storage !== 'undefined') {
        try {
          localStorage.setItem('token', action.payload.token);
          localStorage.setItem('user', JSON.stringify(action.payload.user));
          localStorage.setItem('userId', action.payload.user.sub);
        } catch (error) {
          console.warn('Failed to save to localStorage:', error);
        }
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.userId = null;
      state.isAuthenticated = false;
      
      // Only use localStorage if available
      if (typeof Storage !== 'undefined') {
        try {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('userId');
        } catch (error) {
          console.warn('Failed to clear localStorage:', error);
        }
      }
    },
    // New action to restore from localStorage
    restoreFromStorage: (state) => {
      if (typeof Storage !== 'undefined') {
        try {
          const token = localStorage.getItem('token');
          const user = localStorage.getItem('user');
          const userId = localStorage.getItem('userId');
          
          if (token && user) {
            state.token = token;
            state.user = JSON.parse(user);
            state.userId = userId;
            state.isAuthenticated = true;
          }
        } catch (error) {
          console.warn('Failed to restore from localStorage:', error);
        }
      }
    },
  },
});

export const { setCredentials, logout, restoreFromStorage } = authSlice.actions;
export default authSlice.reducer;