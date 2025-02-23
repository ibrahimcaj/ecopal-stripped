import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import NavigatorTabBar from './NavigatorTabBar';
import { FeedScreen } from '../FeedScreen';
import { FriendsScreen } from '../FriendsScreen';
import { PlusIcon } from '../../icons/PlusIcon';
import { PublishScreen } from '../PublishScreen';
import { QuestScreen } from '../QuestScreen';
import { ProfileScreen } from '../ProfileScreen';
import { QuestsScreen } from '../QuestsScreen';

// create a bottom tab navigator
const Tab = createBottomTabNavigator();

export const TabNavigator: React.FC<any> = () => {
  return (
    <Tab.Navigator
      initialRouteName="Dom"
      // use a custom tab bar component
      tabBar={(props) => <NavigatorTabBar {...props} />}>
      {/* define the feed screen tab */}
      <Tab.Screen
        name="Prijatelji"
        component={FriendsScreen}
        options={{
          // hide the header for this screen
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Dom"
        component={FeedScreen}
        options={{
          // hide the header for this screen
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Quests"
        component={QuestsScreen}
        options={{
          // hide the header for this screen
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Profil"
        component={ProfileScreen}
        options={{
          // hide the header for this screen
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
};
