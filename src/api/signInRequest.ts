import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const signIn = async () => {
  try {
    const response = await axios.post(
      'https://96318a87-0588-4da5-9843-b3d7919f1782.mock.pstmn.io/sign-in-request',
      {
        email: 'salar@beije.co',
        password: 'beijeApp',
      }
    );

    if (response.data.success) {
      const token = response.data.data.token;
      await AsyncStorage.setItem('token', response.data.data.token);
      // Token'ı AsyncStorage'a kaydediyoruz
      console.log('Token saved:', token);
    } else {
      console.log('Sign in failed');
    }
  } catch (error) {
    console.log('Error during sign in:', error);
  }
};

export default signIn;

