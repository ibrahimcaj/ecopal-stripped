import React, { useContext, useEffect, useRef, useState } from 'react';
import { View, Text, Image, TouchableOpacity, Easing, Animated } from 'react-native';
import '@expo/match-media';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useDispatch } from 'react-redux';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { LayoutView } from '../views/LayoutView';
import { randomRange } from '../utils/randomRange';
import { GoogleSignInPill } from '../icons/GoogleSignInPill';

import User, { UserInterface } from '../types/User';

import { setUser } from '../state/userSlice';

import { FontsStyles } from '../Styles';
import { debugLog } from '../utils/DebugLogger';
import { deleteUser } from '../managers/UserManager';
import { fetchAllPosts } from '../managers/PostManager';
import GlobalContext from '../GlobalContext';

export const LandingScreen: React.FC<NativeStackScreenProps<any, any>> = ({ navigation }) => {
  // AUTHENTICATION VALUE
  const [loggingIn, setLoggingIn] = useState<boolean>(false);

  const [debug, setDebug] = useState<string>('false');

  // main on login
  const onLoginGoogle = async () => {
    setLoggingIn(true);

    try {
      // check if device supports Google Play
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      debugLog('LOGIN SCREEN', 'User has Google Play Services');

      // get the users ID token
      const signInResult = await GoogleSignin.signIn();
      debugLog('LOGIN SCREEN', 'Google sign-in token acquired');

      // gets user token for signin
      var idToken = signInResult.data?.idToken;
      if (!idToken) throw new Error('No ID token found');

      // create a google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      debugLog('LOGIN SCREEN', 'Signing in with credential...');

      // sign-in the user with the credential
      auth().signInWithCredential(googleCredential);
    } catch (error) {
      setDebug(`error: ${error}`);
      setLoggingIn(false);
      console.error(error);
    }
  };

  const dispatch = useDispatch();
  const context = useContext(GlobalContext);

  // use effect for authstate listener
  useEffect(() => {
    // AUTHENTICATION CHECK
    auth().onAuthStateChanged(async (user) => {
      debugLog('LANDING SCREEN', `onAuthStateChanged: ${user}`);

      setLoggingIn(user !== null);

      if (!user) return debugLog('LANDING SCREEN', 'User not logged in');
      if (!user.displayName) return;

      debugLog('LANDING SCREEN', `Checking user document in Firestore: ${user.uid}`);

      firestore()
        .collection('users')
        .doc(user?.uid)
        .get()
        .then(async (doc) => {
          debugLog('LANDING SCREEN', `User document: ${doc.exists}`);

          if (!doc.exists) {
            const newUser = new User(user.uid, {
              displayName: user.displayName,
              photoURL: user.photoURL,
            });

            debugLog('LANDING SCREEN', 'Inserting new user in Firestore:', newUser, user.uid);

            await firestore().collection('users').doc(user.uid).set(newUser);
            dispatch(setUser(newUser));

            debugLog('LANDING SCREEN', 'Created new user document and dispatched user data.');
          } else {
            dispatch(setUser(new User(user.uid, { object: doc.data() as UserInterface })));

            debugLog('LANDING SCREEN', 'User document found and dispatched user data.');
          }

          // SETUP CODE
          context.setPosts(await fetchAllPosts());
        });
    });
  }, []);

  return (
    <LayoutView
      style={{ padding: 0 }}
      containerStyle={{ backgroundColor: '#fbf9e2' }}>
      {/* HEADER & CONTENT CONTAINER */}
      <View
        style={{
          flex: 1,
          justifyContent: 'space-between',
          gap: 6,
          alignItems: 'center',

          paddingVertical: 32,
          width: '100%',
          height: '100%',
        }}>
        {/* HEADER VIEW */}
        <View style={{ gap: 3, width: '100%', alignItems: 'center', justifyContent: 'center' }}>
          {/* HEADER TEXT CONTAINER */}
          <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}>
            {/* AURALIA NAME */}
            <Text style={[FontsStyles.weightBold, FontsStyles.h1, { width: '100%', textAlign: 'center' }]}>EcoPal</Text>

            {/* AURALIA DESCRIPTION */}
            <Text style={[FontsStyles.sans, FontsStyles.h3, { width: '100%', textAlign: 'center' }]}>
              Tvoj najbolji drug u očuvanju okoliša!
            </Text>
          </View>
        </View>

        <Image
          source={require('../assets/footprint.jpg')}
          style={{
            width: 300,
            height: 300,
            resizeMode: 'cover',
          }}
        />

        {/* FOOTER & CTA */}
        <View
          style={{
            width: '100%',
            alignItems: 'center',
            gap: 6,
            paddingHorizontal: 30,
          }}>
          {/* GOOGLE SIGN IN BUTTON */}
          <TouchableOpacity
            onPress={onLoginGoogle}
            disabled={loggingIn}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',

              opacity: loggingIn ? 0.5 : 1,
            }}>
            {/* GOOGLE BRAND PILL */}
            <GoogleSignInPill height={40} />
          </TouchableOpacity>
        </View>
      </View>
    </LayoutView>
  );
};
