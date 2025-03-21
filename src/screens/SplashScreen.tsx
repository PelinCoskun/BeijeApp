import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import LottieView from 'lottie-react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../../App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { setProfileData } from '../redux/reducer/profileReducer';
import { setInsightsData } from '../redux/reducer/insightsReducer';
import { setMenstruationData } from '../redux/reducer/menstruationReducer'; // Eksik import
import signIn from '../api/signInRequest';
import { getProfileData } from '../api/getProfile';
import { getInsightsData } from '../api/getInsights';
import { getMenstruationDays } from '../api/getMenstruationData';


const SplashScreen = () => {
  const [animationCount, setAnimationCount] = useState(0);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const animationRef = useRef<LottieView>(null);
  const dispatch = useDispatch();

  const onAnimationFinish = () => {
    setAnimationCount((prevCount) => prevCount + 1);
  };

  const checkToken = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      if (!token) {
        await signIn();
      }

      // Verileri Redux'a kaydet
      await fetchProfile();
      await fetchData();

      // Cycle ekranına yönlendir
      navigation.navigate('Cycle');
    } catch (error) {
      console.error('Token kontrolü sırasında hata oluştu:', error);
    }
  };

  const fetchProfile = async () => {
    try {
      const { data, error } = await getProfileData();

      if (data) {
        dispatch(setProfileData(data));
        console.log("Profile verisi Redux'a eklendi:", data);
      }

      if (error) {
        console.error('Profile verisi alınamadı:', error);
      }
    } catch (error) {
      console.error('Profil verisi alınırken hata oluştu:', error);
    }
  };

  const fetchData = async () => {
    try {
      const insightsResponse = await getInsightsData();
      console.log('Insights API Response:', insightsResponse);

      if (insightsResponse.data) {
        dispatch(setInsightsData(insightsResponse.data));
      }

      const menstruationResponse = await getMenstruationDays();
      console.log('Menstruation API Response:', menstruationResponse);

      if (menstruationResponse.data) {
        dispatch(setMenstruationData(menstruationResponse.data));
      }
    } catch (error) {
      console.error('Veri alınırken hata oluştu:', error);
    }
  };

  useEffect(() => {
    if (animationCount < 3) {
      animationRef.current?.play();
    } else {
      checkToken();
    }
  }, [animationCount, navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.animationContainer}>
        <LottieView
          ref={animationRef}
          source={require('../../assets/animation_splash.json')}
          autoPlay
          loop={false}
          onAnimationFinish={onAnimationFinish}
          style={styles.animation}
        />
      </View>

      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/images/Logo.png')}
          style={styles.logo}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  animationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animation: {
    width: 140,
    height: 152.84,
  },
  logoContainer: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 50,
  },
  logo: {
    width: 65.79,
    height: 28,
  },
});

export default SplashScreen;
