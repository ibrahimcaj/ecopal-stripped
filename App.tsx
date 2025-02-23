import React, { useEffect } from 'react';
import { Text } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';

import {
  Lexend_100Thin,
  Lexend_200ExtraLight,
  Lexend_300Light,
  Lexend_400Regular,
  Lexend_500Medium,
  Lexend_600SemiBold,
  Lexend_700Bold,
  Lexend_800ExtraBold,
  Lexend_900Black,
} from '@expo-google-fonts/lexend';

import { GlobalContextProvider } from './GlobalContext';
import { store } from './store';
import { Navigator } from './Navigator';
import Main from './Main';

// keep the splash screen visible while we fetch fonts
SplashScreen.preventAutoHideAsync();

export default function App() {
  // load fonts
  const [loaded, error] = useFonts({
    Lexend_100Thin,
    Lexend_200ExtraLight,
    Lexend_300Light,
    Lexend_400Regular,
    Lexend_500Medium,
    Lexend_600SemiBold,
    Lexend_700Bold,
    Lexend_800ExtraBold,
    Lexend_900Black,
  });

  // hide splash screen
  useEffect(() => {
    if (loaded || error) SplashScreen.hideAsync(); // hide splash screen
  }, [loaded, error]);

  return (
    <GestureHandlerRootView>
      <GlobalContextProvider>
        <Provider store={store}>
          <Main>
            <Navigator />
          </Main>
        </Provider>
      </GlobalContextProvider>
    </GestureHandlerRootView>
  );
}
