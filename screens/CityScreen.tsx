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

export const CityScreen: React.FC<NativeStackScreenProps<any, any>> = ({ navigation }) => {
  const context = useContext(GlobalContext);
  console.log(context);

  return (
    <LayoutView style={{ paddingVertical: 32 }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ width: '100%' }}
        contentContainerStyle={{ paddingBottom: 96 }}>
        <View>
          <Text style={[FontsStyles.h2, FontsStyles.weightMedium]}>Odakle ste?</Text>
          <Text style={[FontsStyles.h3, FontsStyles.weightLight]}>
            Odaberite jednu od opcija ispod kako biste dobili personalizovan sadržaj!
          </Text>
        </View>
        <View style={{ gap: 6, marginTop: 16 }}>
          {Object.keys(CITIES).map((city) => (
            <TouchableOpacity
              onPress={async () => {
                await updateUserValue('city', city);
                navigation.goBack();
              }}
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
              <BackIcon
                size={24}
                style={{ transform: [{ rotate: '180deg' }] }}
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </LayoutView>
  );
};
