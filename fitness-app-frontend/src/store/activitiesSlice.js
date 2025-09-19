import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getActivities, getActivityDetail, addActivity, deleteActivity } from '../services/api';

// Async thunks for API calls
export const fetchActivities = createAsyncThunk(
  'activities/fetchActivities',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getActivities();
      // Ensure we always return an array
      return Array.isArray(response.data) ? response.data : (response || []);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch activities');
    }
  }
);

export const fetchActivityDetail = createAsyncThunk(
  'activities/fetchActivityDetail',
  async (id, { rejectWithValue }) => {
    try {
      const response = await getActivityDetail(id);
      console.log('Activity detail API response:', response); // Debug log
      // Handle both response.data and direct response formats
      return response.data || response;
    } catch (error) {
      console.error('Error fetching activity detail:', error); // Debug log
      return rejectWithValue(error.message || 'Failed to fetch activity detail');
    }
  }
);

export const createActivity = createAsyncThunk(
  'activities/createActivity',
  async (activityData, { rejectWithValue }) => {
    try {
      const response = await addActivity(activityData);
      console.log('Create activity API response:', response); // Debug log
      // Handle both response.data and direct response formats
      return response.data || response;
    } catch (error) {
      console.error('Error creating activity:', error); // Debug log
      return rejectWithValue(error.message || 'Failed to create activity');
    }
  }
);

export const removeActivity = createAsyncThunk(
  'activities/removeActivity',
  async (id, { rejectWithValue }) => {
    try {
      await deleteActivity(id);
      return id; // Return the deleted activity ID
    } catch (error) {
      console.error('Error deleting activity:', error); // Debug log
      return rejectWithValue(error.message || 'Failed to delete activity');
    }
  }
);

const activitiesSlice = createSlice({
  name: 'activities',
  initialState: {
    activities: [],
    currentActivity: null,
    loading: false,
    error: null,
    addingActivity: false,
    fetchingDetail: false,
    deletingActivity: false
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentActivity: (state) => {
      state.currentActivity = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch activities
      .addCase(fetchActivities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActivities.fulfilled, (state, action) => {
        state.loading = false;
        // Ensure activities is always an array
        state.activities = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchActivities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch activity detail
      .addCase(fetchActivityDetail.pending, (state) => {
        state.fetchingDetail = true;
        state.error = null;
      })
      .addCase(fetchActivityDetail.fulfilled, (state, action) => {
        state.fetchingDetail = false;
        state.currentActivity = action.payload;
      })
      .addCase(fetchActivityDetail.rejected, (state, action) => {
        state.fetchingDetail = false;
        state.error = action.payload;
      })
      // Create activity
      .addCase(createActivity.pending, (state) => {
        state.addingActivity = true;
        state.error = null;
      })
      .addCase(createActivity.fulfilled, (state, action) => {
        state.addingActivity = false;
        // Ensure the new activity is properly added to the beginning
        if (action.payload && action.payload.id) {
          state.activities.unshift(action.payload);
        }
      })
      .addCase(createActivity.rejected, (state, action) => {
        state.addingActivity = false;
        state.error = action.payload;
      })
      // Delete activity
      .addCase(removeActivity.pending, (state) => {
        state.deletingActivity = true;
        state.error = null;
      })
      .addCase(removeActivity.fulfilled, (state, action) => {
        state.deletingActivity = false;
        // Remove the deleted activity from the list
        state.activities = state.activities.filter(activity => activity.id !== action.payload);
        // Clear current activity if it was the one deleted
        if (state.currentActivity && state.currentActivity.id === action.payload) {
          state.currentActivity = null;
        }
      })
      .addCase(removeActivity.rejected, (state, action) => {
        state.deletingActivity = false;
        state.error = action.payload;
      });
  }
});

export const { clearError, clearCurrentActivity } = activitiesSlice.actions;
export default activitiesSlice.reducer;