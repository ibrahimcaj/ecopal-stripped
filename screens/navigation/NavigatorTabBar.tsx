import React from 'react';
import { Text } from '@react-navigation/elements';
import { View, TouchableOpacity } from 'react-native';

import { HomeIcon } from '../../icons/HomeIcon';
import { HomeIconBlack } from '../../icons/HomeIconBlack';

import { FontsStyles } from '../../Styles';
import COLORS from '../../utils/constants/COLORS';
import { PlusIcon } from '../../icons/PlusIcon';
import { PlusIconBlack } from '../../icons/PlusIconBlack';
import { PersonIconBlack } from '../../icons/PersonIconBlack';
import { PersonIcon } from '../../icons/PersonIcon';
import { Quests } from '../../icons/Quests';
import { QuestsBlack } from '../../icons/QuestsBlack';
import { Circle } from 'react-native-svg';
import { FriendsIcon } from '../../icons/FriendsIcon';
import { FriendsIconBlack } from '../../icons/FriendsIconBlack';
import { ProfilePicture } from '../../components/ProfilePicture';
import { useSelector } from 'react-redux';
import { selectUser } from '../../state/userSlice';

const NavigatorTabBar: React.FC<any> = ({ state, descriptors, navigation }) => {
  const user = useSelector(selectUser);

  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTopRightRadius: 16,
          borderTopLeftRadius: 16,
          backgroundColor: '#ffffff',
          position: 'absolute',
          width: '100%',
          bottom: 0,
        }}>
        {state.routes.map((route: any, index: any) => {
          // get options for the current route
          const { options } = descriptors[route.key];
          // determine the label for the tab
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
                ? options.title
                : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            // emit tab press event
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            // navigate to the route if not focused and event not prevented
            if (!isFocused && !event.defaultPrevented) {
              if (route.name === 'Profil') {
                navigation.navigate('/profile', { user: user.value });
              } else navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            // emit tab long press event
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return [
            <TouchableOpacity
              key={index}
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarButtonTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={{ justifyContent: 'center', flex: 1, alignItems: 'center', padding: 16, gap: 2 }}>
              {(() => {
                // render different icons based on route name and focus state
                switch (route.name) {
                  case 'Dom':
                    return isFocused ? (
                      <HomeIconBlack
                        size={24}
                        color="#000000"
                      />
                    ) : (
                      <HomeIcon
                        size={24}
                        color="#000000"
                      />
                    );
                  case 'Quests':
                    return isFocused ? (
                      <QuestsBlack
                        size={24}
                        color="#000000"
                      />
                    ) : (
                      <Quests
                        size={24}
                        color="#000000"
                      />
                    );
                  case 'Prijatelji':
                    return isFocused ? (
                      <FriendsIconBlack
                        size={24}
                        color="#000000"
                      />
                    ) : (
                      <FriendsIcon
                        size={24}
                        color="#000000"
                      />
                    );
                  case 'Profil':
                    return (
                      <ProfilePicture
                        photoURL={user.value.photoURL}
                        size={24}
                      />
                    );
                }
              })()}

              <Text
                style={[FontsStyles.sans, FontsStyles.h4, { color: '#000000', textAlign: 'center', width: '100%' }]}>
                {label}
              </Text>
            </TouchableOpacity>,
            index === Math.round(state.routes.length / 2) - 1 ? (
              <TouchableOpacity
                style={{
                  backgroundColor: COLORS.black,
                  borderRadius: 48,
                  width: 48,
                  height: 48,
                  justifyContent: 'center',
                  alignItems: 'center',

                  // position: 'absolute',
                  // right: '45%',
                  // top: '-30%',

                  zIndex: 100,
                  elevation: 8,
                }}
                onPress={() => navigation.navigate('/add')}>
                <PlusIcon
                  size={35}
                  color="#ffffff"
                />
              </TouchableOpacity>
            ) : null,
          ];
        })}
      </View>
    </>
  );
};
export default NavigatorTabBar;
