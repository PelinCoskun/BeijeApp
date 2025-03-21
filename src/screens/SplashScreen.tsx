import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import LottieView from 'lottie-react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../../App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { setProfileData } from '../redux/reducer/profileReducer';
import { setInsightsData } from '../redux/reducer/insightsReducer';
import { setMenstruationData } from '../redux/reducer/menstruationReducer';
import signIn from '../api/signInRequest';
import { getProfileData } from '../api/getProfile';
import { getInsightsData } from '../api/getInsights';
import { getMenstruationDays } from '../api/getMenstruationData';

const SplashScreen = () => {
  const [animationCount, setAnimationCount] = useState(0);
  const [dataLoaded, setDataLoaded] = useState(false);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const animationRef = useRef<LottieView>(null);
  const dispatch = useDispatch();

  const onAnimationFinish = () => {
    setAnimationCount((prev) => prev + 1);
    if (animationCount + 1 < 3) {
      animationRef.current?.play();
    }
  };

  const checkToken = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      if (!token) {
        await signIn();
      }

      await fetchProfile();
      await fetchData();
    } catch (error) {
      console.error('Token kontrolü sırasında hata oluştu:', error);
    }
  };

  const fetchProfile = async () => {
    try {
      const { data, error } = await getProfileData();

      if (data) {
        dispatch(setProfileData(data));
        console.log('Profile verisi Redux\'a eklendi:', data);
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
      const menstruationResponse = await getMenstruationDays();

      if (insightsResponse.data) {
        dispatch(setInsightsData(insightsResponse.data));
      }

      if (menstruationResponse.data) {
        dispatch(setMenstruationData(menstruationResponse.data));
      }

      setDataLoaded(true);
    } catch (error) {
      console.error('Veri alınırken hata oluştu:', error);
    }
  };

  useEffect(() => {
    animationRef.current?.play();
    checkToken();
  }, []);

  useEffect(() => {
    if (dataLoaded && animationCount >= 3) {
      navigation.navigate('Cycle');
    }
  }, [dataLoaded, animationCount]);

  return (
    <LinearGradient
      colors={['#fcebe4', '#f8d7c4']}
      style={styles.container}
    >
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
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
