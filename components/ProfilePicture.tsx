import React from 'react';
import { Image, Text, View } from 'react-native';

import { FontsStyles } from '../Styles';
import COLORS from '../utils/constants/COLORS';

interface ProfilePictureProps {
  size: number;
  photoURL?: string | null;
  displayName?: string;
}

export const ProfilePicture: React.FC<ProfilePictureProps> = ({ size, photoURL, displayName }) => {
  return photoURL ? (
    <Image
      style={{
        width: size,
        height: size,
        aspectRatio: 1,
        borderRadius: size / 2,
        backgroundColor: '#ffffff',
      }}
      source={{ uri: photoURL || '' }}
    />
  ) : (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: COLORS.secondary,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#C0A35F',
      }}>
      <Text
        style={[FontsStyles.sans, { fontSize: size / 2 }, { marginTop: -4, color: '#ffffff' }]}
        numberOfLines={2}
        ellipsizeMode="tail">
        {displayName?.slice(0, 1).toUpperCase()}
      </Text>
    </View>
  );
};
