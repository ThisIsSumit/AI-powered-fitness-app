const API_BASE_URL = import.meta.env.API_BASE_URL || 'http://localhost:8080/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.getToken = null; // Function to get current token
  }

  // Set a function to retrieve the current token
  setTokenProvider(getTokenFn) {
    this.getToken = getTokenFn;
  }

  async request(endpoint, options = {}) {
    // Try to get token from the provider function first, then fallback to localStorage
    let token = null;
    if (this.getToken) {
      token = this.getToken();
    }
    if (!token) {
      token = localStorage.getItem('token');
    }
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      ...options,
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      
      if (!response.ok) {
        if (response.status === 401) {
          // Token expired, redirect to login
          localStorage.clear();
          window.location.href = '/';
          throw new Error('Session expired');
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log(`API response for ${endpoint}:`, result); // Debug log
      return result;
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Activity endpoints
  getActivities() {
    return this.request('/activities');
  }

  getActivityDetail(id) {
    console.log('API: Fetching activity detail for ID:', id); // Debug log
    return this.request(`/recommendations/activity/${id}`);
  }

  addActivity(activityData) {
    return this.request('/activities', {
      method: 'POST',
      body: activityData,
    });
  }

  updateActivity(id, activityData) {
    return this.request(`/activities/${id}`, {
      method: 'PUT',
      body: activityData,
    });
  }

  deleteActivity(id) {
    return this.request(`/activities/${id}`, {
      method: 'DELETE',
    });
  }
}

// Export singleton instance
export const apiService = new ApiService();

// Export individual methods for backward compatibility
export const getActivities = () => apiService.getActivities();
export const getActivityDetail = (id) => apiService.getActivityDetail(id);
export const addActivity = (data) => apiService.addActivity(data);
export const updateActivity = (id, data) => apiService.updateActivity(id, data);
export const deleteActivity = (id) => apiService.deleteActivity(id);