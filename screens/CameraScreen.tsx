import React, { useContext, useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Button, ActivityIndicator } from 'react-native';
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
import Camera from '../components/Camera';
import { SafeAreaView, useSafeAreaFrame, useSafeAreaInsets } from 'react-native-safe-area-context';
import CameraComponent from '../components/Camera';
import { uploadImage } from '../managers/StorageManager';
import HeaderBar from '../components/HeaderBar';
import { BackIcon } from '../icons/BackIcon';

export const CameraScreen: React.FC<NativeStackScreenProps<any, any>> = ({ navigation, route }) => {
  const context = useContext(GlobalContext);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploading, setUploading] = useState<boolean>(false);

  const handlePictureTaken = (uri: string, base64: string) => {
    setPhotoUri(uri);
    route.params?.onPictureTaken(uri, base64);
    navigation.goBack();
  };

  useEffect(() => {
    if (photoUri) {
      setUploading(true);
      uploadImage(`quests/${Date.now()}.jpg`, photoUri, (progress) => {
        setUploadProgress(progress);
      }).then(() => {
        setUploading(false);
        console.log('Quest completed!');
      });
    }
  }, [photoUri]);

  return (
    <View>
      <HeaderBar
        actions={true}
        title=""
        backOnPress={() => navigation.goBack()}
        primaryActionIcon={<BackIcon size={32} />}
      />

      <CameraComponent
        facing="back"
        onPictureTaken={handlePictureTaken}
        cta={route.params.cta}
      />
      {uploading && (
        <View>
          <Text>Uploading: {uploadProgress.toFixed(2)}%</Text>
          <ActivityIndicator
            size="large"
            color="#0000ff"
          />
        </View>
      )}
    </View>
  );
};
