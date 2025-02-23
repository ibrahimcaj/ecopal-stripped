import React from 'react';
import { Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { MeshGradient } from '@kuss/react-native-mesh-gradient';
import { Edge, SafeAreaView } from 'react-native-safe-area-context';

import { Lines } from '../icons/Lines';

import { StyleProp, ViewStyle } from 'react-native';

export const LayoutView = ({
  children,
  style,
  containerStyle,
  edges = ['right', 'left', 'bottom'],

  firstColor = '#FFFFFF',
  secondColor = '#FFFFFF',
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  edges?: Edge[];

  firstColor?: string;
  secondColor?: string;
}) => {
  return (
    <LinearGradient
      colors={[firstColor, secondColor]}
      style={[{ flexDirection: 'column', padding: 16 }, style]}>
      {/* safe area view for content */}
      <SafeAreaView
        edges={edges}
        style={[{ zIndex: 1, flexDirection: 'column', alignItems: 'center', height: '100%' }, containerStyle]}>
        {children}
      </SafeAreaView>

      {/* status bar */}
      <StatusBar style="dark" />
    </LinearGradient>
  );
};
