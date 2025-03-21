// src/api/profileApi.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getProfileData = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    console.log('Token:', token);

    const headers = token
      ? { Authorization: `Bearer ${token}` }
      : undefined;

    const response = await axios.get(
      'https://96318a87-0588-4da5-9843-b3d7919f1782.mock.pstmn.io/profile',
      { headers }
    );

    console.log('Response:', response.data);                     
    if (response.data.success) {
      return { data: response.data.data, error: null };
    } else {
      return { data: null, error: 'Failed to fetch profile' };
    }
  } catch (error) {
    console.error('Error while fetching profile data', error.response || error.message);
    return { data: null, error: 'Error fetching profile data: ' + (error.response?.data?.message || error.message) };
  }
};
// import apiClient from './baseApi';

// export const getProfileData = async () => {
//   try {
//     const response = await apiClient.get('/profile');
//     console.log('Profile Data:', response.data); // Yanıtı kontrol edin
//     return response.data;
//   } catch (error) {
//     if (error.response) {
//       console.log('Error Response:', error.response.data);
//       console.log('Status Code:', error.response.status);
//       console.log('Headers:', error.response.headers);
//     } else if (error.request) {
//       console.log('Error Request:', error.request);
//     } else {
//       console.log('Error Message:', error.message);
//     }
//     throw error;
//   }
// };
