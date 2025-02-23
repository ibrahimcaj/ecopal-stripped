import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { registerRootComponent } from 'expo';
// @ts-ignore

import App from './App';

// GOOGLE SIGNIN CONFIGURATION
GoogleSignin.configure({
  webClientId: '846178121177-3fgstdhtdphtkciq2gv4asah0psj7uqk.apps.googleusercontent.com',
});

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);

import { PermissionsAndroid } from 'react-native';
PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
