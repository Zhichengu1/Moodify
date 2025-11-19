import axios from 'axios';

const API_URL = "http://127.0.0.1:5000/api"; // Flask backend

export const helloBackend = async () => {
  try {
    const response = await axios.get(`${API_URL}/hello`);
    return response.data;
  } catch (err) {
    console.error("Error calling backend:", err);
  }
};

export const createPlaylist = async (mood) => {
  try {
    const response = await axios.post(`${API_URL}/create-playlist`, { mood });
    return response.data.playlist;
  } catch (err) {
    console.error("Error creating playlist:", err);
  }
};
