import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Easing,
  Animated,
  Button,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
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
import { TextInput } from 'react-native-gesture-handler';
import { addPost, togglePostLike } from '../managers/PostManager';
import GlobalContext from '../GlobalContext';
import HeaderBar from '../components/HeaderBar';
import { ForwardIcon } from '../icons/ForwardIcon';
import { PlusIcon } from '../icons/PlusIcon';
import COLORS from '../utils/constants/COLORS';
import { MapView } from '@maplibre/maplibre-react-native';
import { BackIcon } from '../icons/BackIcon';
import CameraComponent from '../components/Camera';
import { uploadImage } from '../managers/StorageManager';

export const PublishScreen: React.FC<NativeStackScreenProps<any, any>> = ({ navigation }) => {
  const context = useContext(GlobalContext);

  const [text, setText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const handleTakePicture = () => {
    navigation.navigate('/camera', {
      cta: 'Slikaj',
      onPictureTaken: (uri: string) => {
        setPhotoUri(uri);
      },
    });
  };

  async function post() {
    if (text.length === 0) return;

    setLoading(true);
    let mediaUrl = '';

    if (photoUri) {
      setUploading(true);
      const reference = await uploadImage(`posts/${Date.now()}.jpg`, photoUri, (progress) => {
        setUploadProgress(progress);
      });
      mediaUrl = await reference.getDownloadURL();
      setUploading(false);
    }

    setTimeout(async () => {
      await addPost(context, text, mediaUrl);
      setLoading(false);
      navigation.goBack();
    }, 1000);
  }

  return (
    <LayoutView style={{ padding: 0 }}>
      <HeaderBar
        actions={true}
        title="Objavi"
        primaryActionIcon={<BackIcon size={32} />}
        backOnPress={() => navigation.goBack()}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ width: '100%', paddingTop: 96, paddingHorizontal: 16 }}>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TextInput
            cursorColor={COLORS.black}
            selectionColor={COLORS.black}
            onChangeText={setText}
            style={[
              FontsStyles.weightLight,
              FontsStyles.h3,
              { flex: 1, height: '100%', backgroundColor: '#eeeeee', borderRadius: 32, padding: 12 },
            ]}
            placeholder="Vaša poruka..."></TextInput>

          <TouchableOpacity
            disabled={text?.length === 0 || loading}
            onPress={post}
            style={[
              {
                width: 48,
                height: 48,

                justifyContent: 'center',
                alignItems: 'center',

                backgroundColor: COLORS.black,
                borderRadius: 32,
                opacity: text.length > 0 ? 1 : 0.5,
              },
            ]}>
            {loading ? (
              <ActivityIndicator
                color={COLORS.white}
                size={24}
              />
            ) : (
              <PlusIcon
                size={32}
                color={COLORS.white}
              />
            )}
          </TouchableOpacity>
        </View>

        {photoUri ? (
          <View
            style={{
              borderRadius: 16,
              backgroundColor: COLORS.secondary,
              marginTop: 16,
            }}>
            <Image
              source={{ uri: photoUri }}
              style={{ width: '100%', height: 200, borderRadius: 16 }}
            />
            {uploading && (
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  right: 0,
                  left: 0,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <ActivityIndicator
                  size={32}
                  color={COLORS.white}
                />
                <Text
                  style={[
                    FontsStyles.weightLight,
                    FontsStyles.h4,
                    { textAlign: 'center', marginTop: 8, color: COLORS.white },
                  ]}>
                  Uploadanje: {uploadProgress.toFixed(2)}%
                </Text>
              </View>
            )}
          </View>
        ) : (
          <TouchableOpacity
            onPress={handleTakePicture}
            disabled={loading}
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 16,

              marginTop: 16,

              padding: 16,

              borderColor: '#eeeeee',
              borderWidth: 2,

              borderRadius: 16,
              opacity: loading ? 0.5 : 1,
            }}>
            <PlusIcon
              size={24}
              color={COLORS.black}
            />

            <Text style={[FontsStyles.h3, FontsStyles.weightLight]}>Dodaj sliku</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </LayoutView>
  );
};
