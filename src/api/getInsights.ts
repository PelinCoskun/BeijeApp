import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
 export const getInsightsData = async () => {
    try {
        const token = await AsyncStorage.getItem('token');
        console.log('Token:', token);
    
        const headers = token
        ? { Authorization: `Bearer ${token}` }
        : undefined;
    
        const response = await axios.get(
        'https://96318a87-0588-4da5-9843-b3d7919f1782.mock.pstmn.io/insights',
        { headers }
        );
    
        console.log('Response:', response.data);
    
        if (response.data.success) {
        return { data: response.data.data, error: null };
        } else {
        return { data: null, error: 'Failed to fetch inside data' };
        }
    } catch (error) {
        console.error('Error while fetching inside data', error.response || error.message);
        return { data: null, error: 'Error fetching inside data: ' + (error.response?.data?.message || error.message) };
    }
    }
