import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from './src/screens/SplashScreen';
import CycleScreen from './src/screens/CycleScreen';
import { Provider } from 'react-redux';
import { store } from './src/redux/store'; // Redux store'unuzun yolu
import { GestureHandlerRootView } from 'react-native-gesture-handler';


type RootStackParamList = {
  Splash: undefined;
  Cycle: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Splash">
            <Stack.Screen
              name="Splash"
              component={SplashScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Cycle"
              component={CycleScreen}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    </GestureHandlerRootView>
  );
};

export default App;
