import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { BackIcon } from '../icons/BackIcon';
import { FontsStyles } from '../Styles';

import { StyleProps } from 'react-native-reanimated';
import COLORS from '../utils/constants/COLORS';

interface HeaderBarProps {
  actions?: boolean; // prop to show or hide actions

  backOnPress?: () => void; // function to handle back button press
  primaryActionIcon?: React.ReactNode; // icon for primary action
  secondaryActionIcon?: React.ReactNode; // icon for secondary action
  secondaryActionOnPress?: () => void; // function to handle secondary action press

  renderGradient?: boolean; // prop to render gradient background
  showTitle?: boolean; // prop to show or hide title
  title?: string; // title text
}

const HeaderBar: React.FC<HeaderBarProps> = ({
  actions = true, // default to show actions

  backOnPress, // default back button press handler
  primaryActionIcon,
  secondaryActionIcon,
  secondaryActionOnPress, // default secondary action press handler

  renderGradient = true, // default to render gradient
  showTitle = true, // default to show title

  title = 'EcoPal', // default title
}) => {
  const renderContent = () => {
    return (
      <>
        {backOnPress ? (
          <TouchableOpacity onPress={backOnPress}>
            {primaryActionIcon || (
              <BackIcon size={24} /> // back button icon
            )}
          </TouchableOpacity>
        ) : (
          //empty space if no actions
          <View style={{ width: 24, height: 24 }}></View>
        )}

        {showTitle ? (
          // title
          <Text style={[FontsStyles.weightBlack, FontsStyles.h1, { width: '50%', textAlign: 'center' }]}>{title}</Text>
        ) : (
          // empty space if no title
          <View style={{ height: 36 }}></View>
        )}

        {secondaryActionIcon && actions ? (
          // secondary action button
          <TouchableOpacity onPress={secondaryActionOnPress}>{secondaryActionIcon}</TouchableOpacity>
        ) : (
          // empty space if no secondary action
          <View style={{ width: 32, height: 32 }} />
        )}
      </>
    );
  };

  const style: StyleProps[] = [
    {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: 32,
      paddingBottom: 16,
    },
    { position: 'absolute', top: 0, zIndex: 10, paddingHorizontal: 16 },
  ];

  if (renderGradient) {
    return (
      <LinearGradient
        colors={[COLORS.secondary, '#FFFFFF00']}
        style={style}>
        {renderContent()} {/* render content with gradient */}
      </LinearGradient>
    );
  } else {
    return <View style={style}>{renderContent()}</View>;
    {
      /* render content without gradient */
    }
  }
};

export default HeaderBar;
