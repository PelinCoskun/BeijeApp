import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://96318a87-0588-4da5-9843-b3d7919f1782.mock.pstmn.io';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Her istekte token eklemek için interceptor
apiClient.interceptors.request.use(
  async (config) => {
    // Eğer token zaten header'da varsa, AsyncStorage'dan alma
    if (!config.headers['x-auth-token']) {
      const token = await AsyncStorage.getItem('token'); // Token'ı AsyncStorage'dan al
      if (token) {
        config.headers['x-auth-token'] = token; // Token'ı header'a ekle
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;