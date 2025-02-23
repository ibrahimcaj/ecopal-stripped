import React, { useContext, useEffect, useRef, useState } from 'react';
import { View, Text, Image, TouchableOpacity, Easing, Animated, Button, ScrollView } from 'react-native';
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
import { deleteUser, updateUserValue } from '../managers/UserManager';
import { TextInput } from 'react-native-gesture-handler';
import { addPost, togglePostLike } from '../managers/PostManager';
import GlobalContext from '../GlobalContext';
import { BackIcon } from '../icons/BackIcon';
import CITIES from '../utils/constants/CITIES';
import HeaderBar from '../components/HeaderBar';
import { fetchAirQuality } from '../managers/APIManager';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const PollutionScreen: React.FC<NativeStackScreenProps<any, any>> = ({ navigation }) => {
  const context = useContext(GlobalContext);
  console.log(context);

  const [so2Levels, setSo2Levels] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    (async () => {
      const cacheKey = 'so2LevelsCache';
      const cacheExpirationKey = 'so2LevelsCacheExpiration';
      const cacheExpirationTime = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

      const cachedData = parseInt((await AsyncStorage.getItem(cacheKey)) || '0');
      const cacheExpiration = parseInt((await AsyncStorage.getItem(cacheExpirationKey)) || '0');

      if (cachedData && cacheExpiration && new Date().getTime() < cacheExpiration) {
        setSo2Levels(JSON.parse(cachedData.toString()));
        console.log(JSON.parse(cachedData.toString()));
      } else {
        Promise.all(Object.keys(CITIES).map((city) => fetchAirQuality(city))).then((results) => {
          const so2Levels: { [key: string]: number } = {};
          results.forEach((result, index) => {
            so2Levels[Object.keys(CITIES)[index]] = result;
          });

          setSo2Levels(so2Levels);
          localStorage.setItem(cacheKey, JSON.stringify(so2Levels));
          localStorage.setItem(cacheExpirationKey, (new Date().getTime() + cacheExpirationTime).toString());
        });
      }
    })();
  }, []);

  return (
    <LayoutView style={{ padding: 0 }}>
      <HeaderBar
        primaryActionIcon={<BackIcon size={32} />}
        backOnPress={() => navigation.goBack()}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ width: '100%' }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 96, paddingBottom: 96 }}>
        <View>
          <Text style={[FontsStyles.h2, FontsStyles.weightMedium]}>Trenutni nivoi SO2</Text>
          <Text style={[FontsStyles.h3, FontsStyles.weightLight]}>Nivoi sumpor-dioksida u gradovima širom BiH</Text>
        </View>
        <View style={{ gap: 6, marginTop: 16 }}>
          {Object.keys(CITIES).map((city) => (
            <View
              style={{
                width: '100%',

                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',

                borderColor: '#eee',
                borderWidth: 2,

                borderRadius: 32,
                padding: 16,
              }}>
              <Text style={[FontsStyles.weightLight, FontsStyles.h3]}>{city}</Text>
              <Text style={[FontsStyles.weightLight, FontsStyles.h3]}>{so2Levels[city]}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </LayoutView>
  );
};
