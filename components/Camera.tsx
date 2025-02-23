import React, { LegacyRef, useRef } from 'react';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import storage from '@react-native-firebase/storage';
import { uploadImage } from '../managers/StorageManager';
import COLORS from '../utils/constants/COLORS';
import { FontsStyles } from '../Styles';

export default function CameraComponent({
  facing = 'back',
  onPictureTaken,
  cta,
}: {
  facing: CameraType;
  onPictureTaken: (uri: string) => void;
  cta: string;
}) {
  const [permission, requestPermission] = useCameraPermissions();

  const cameraRef = useRef<CameraView | null>(null);

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();

      if (photo) {
        // uploadImage(`posts/${Date.now()}.jpg`, photo.uri);
        console.log(photo.uri);
        onPictureTaken(photo.uri);
      }
    }
  };

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View>
        <Text>We need your permission to show the camera</Text>
        <Button
          onPress={requestPermission}
          title="grant permission"
        />
      </View>
    );
  }

  return (
    <View>
      <CameraView
        ref={cameraRef}
        style={{ width: '100%', height: '100%' }}
        type={facing}>
        <View
          style={{ width: '100%', height: '100%', flexDirection: 'column', justifyContent: 'flex-end', padding: 32 }}>
          <TouchableOpacity
            onPress={takePicture}
            style={{
              padding: 16,
              backgroundColor: COLORS.secondary,
              borderRadius: 16,
              marginTop: 16,
            }}>
            <Text style={[FontsStyles.weightMedium, FontsStyles.h3, { textAlign: 'center' }]}>{cta}</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}
