import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.UNION_AVATARS_API_KEY;
const API_URL = 'https://api.unionavatars.com/v1'; // Replace with the actual base URL of the Union Avatars API

export const createAvatar = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/avatars`, userData, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating avatar:', error);
    throw error;
  }
};

export const getAvatar = async (avatarId) => {
  try {
    const response = await axios.get(`${API_URL}/avatars/${avatarId}`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching avatar:', error);
    throw error;
  }
};
