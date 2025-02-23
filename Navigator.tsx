import React, { useEffect, useRef, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import auth from '@react-native-firebase/auth';
import { useSelector, useDispatch } from 'react-redux';

import { TabNavigator } from './screens/navigation/TabNavigator';
import { selectUser, setUser } from './state/userSlice';
import { debugLog } from './utils/DebugLogger';
import { LandingScreen } from './screens/LandingScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { CameraScreen } from './screens/CameraScreen';
import { CityScreen } from './screens/CityScreen';
import { PublishScreen } from './screens/PublishScreen';
import { QuestScreen } from './screens/QuestScreen';
import { PollutionScreen } from './screens/PollutionScreen';

// create a stack navigator
const Stack = createNativeStackNavigator();

export const Navigator = () => {
  // GLOBAL USER STATE VALUE
  const globalUser = useSelector(selectUser);
  const dispatch = useDispatch();

  // AUTHENTICATION ROUTER MANAGEMENT
  const [loggedIn, setLoggedIn] = useState<boolean>(false);

  function handleUpdate(user = auth().currentUser) {
    debugLog('NAVIGATOR', '==============================');
    debugLog('NAVIGATOR', 'user: ' + Boolean(user));
    debugLog('NAVIGATOR', 'globalUser: ' + Boolean(globalUser.value));
    debugLog('NAVIGATOR', 'auth().currentUser?.displayName: ' + auth().currentUser?.displayName);
    debugLog('NAVIGATOR', '==============================');

    if (user && !globalUser.value) {
      // Dispatch an action to update the global user state
      // Assuming you have an action creator called setUser
      dispatch(setUser(user));
    }

    // checks existence of user and global user,
    // along with the user's display name (crucial for mail/password auth)
    setLoggedIn(Boolean(user) && Boolean(globalUser.value) && auth().currentUser?.displayName !== null);
  }

  // on firebase auth state change, handle the actual update
  useEffect(() => {
    auth().onAuthStateChanged((user) => {
      handleUpdate(user);
    });
  }, []);
  // on global user update, handle the actual update
  useEffect(() => {
    handleUpdate();
  }, [globalUser]);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={loggedIn ? '/feed' : '/landing'}>
        {loggedIn ? (
          <>
            <Stack.Screen
              name="/feed"
              component={TabNavigator}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="/profile"
              component={ProfileScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="/quest"
              component={QuestScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="/publish"
              component={PublishScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="/city"
              component={CityScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="/pollution"
              component={PollutionScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="/camera"
              component={CameraScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="/add"
              component={PublishScreen}
              options={{
                // hide the header for this screen
                headerShown: false,
              }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="/landing"
              component={LandingScreen}
              options={{
                headerShown: false,
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
