import api from './config';
import axios from 'axios';
// ============ AUTH ENDPOINTS ============

export const checkAuthStatus = async () => {
  try {
    const res = await api.get("/api/status");
    // Return in consistent format
    return {
      isAuthenticated: res.data.authenticated,
      user: {
        display_name: res.data.display_name,
        email: res.data.email,
        user_id: res.data.user_id,
        profile_image: res.data.profile_image
      }
    };
  } catch (error) {
    return { isAuthenticated: false };
  }
};


export const logout = async () => {
  // TODO: Send a POST request to your backend logout endpoint
  // TODO: Return a success indicator
  try{
    await api.post('/api/logout');
    return {success:true}
  }
  catch(error){
    console.error('Logout error:', error);
    return { success: false };
  }
};

// ============ PLAYLIST ENDPOINTS ============

export const getFavoriteSongs = async () => {
  try {
    const response = await api.get('/me/favorite-songs');
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Error fetching favorite songs:', error);
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to fetch songs',
    };
  }
};

export const getRecommendations = async (limit = 30) => {
  try {
    const response = await api.get('/me/recommendations', {
      params: { limit },
    });
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to fetch recommendations',
    };
  }
};

export const createPlaylist = async (mood, playlistName = null) => {
  try {
    const response = await api.post('/me/playlist', {
      mood,
      playlist_name: playlistName,
    });
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Error creating playlist:', error);
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to create playlist',
    };
  }
};

export const getGenreAnalysis = async () => {
  try {
    const response = await api.get('/me/genre-analysis');
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Error fetching genre analysis:', error);
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to analyze genres',
    };
  }
};