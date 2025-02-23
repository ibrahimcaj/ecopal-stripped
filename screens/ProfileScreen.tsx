import React, { useContext, useEffect, useRef, useState } from 'react';
import { View, Text, Image, TouchableOpacity, Easing, Animated, Button, ScrollView } from 'react-native';
import '@expo/match-media';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useDispatch, useSelector } from 'react-redux';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { LayoutView } from '../views/LayoutView';
import { randomRange } from '../utils/randomRange';
import { GoogleSignInPill } from '../icons/GoogleSignInPill';

import User, { UserInterface } from '../types/User';

import { selectUser, setUser } from '../state/userSlice';

import { FontsStyles } from '../Styles';
import { debugLog } from '../utils/DebugLogger';
import { deleteUser, followUser } from '../managers/UserManager';
import { TextInput } from 'react-native-gesture-handler';
import { addPost, togglePostLike, fetchUserPosts } from '../managers/PostManager';
import GlobalContext from '../GlobalContext';
import { VerifiedIcon } from '../icons/Verified';
import { ProfilePicture } from '../components/ProfilePicture';
import HeaderBar from '../components/HeaderBar';
import { BackIcon } from '../icons/BackIcon';
import { PlusIcon } from '../icons/PlusIcon';
import COLORS from '../utils/constants/COLORS';
import PostComponent from '../components/PostComponent';
import { LogOutIcon } from '../icons/LogOutIcon';
import { FriendsIcon } from '../icons/FriendsIcon';
import { FriendsIconBlack } from '../icons/FriendsIconBlack';
import { TickIcon } from '../icons/TickIcon';

export const ProfileScreen: React.FC<NativeStackScreenProps<any, any>> = ({ navigation, route }) => {
  const context = useContext(GlobalContext);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const user = route.params!.user as User;
  const currentUser = useSelector(selectUser);

  useEffect(() => {
    (async () => {
      const posts = await fetchUserPosts(user.id);
      setUserPosts(posts);
    })();
  }, [user.id]);

  return (
    <LayoutView style={{ padding: 0, margin: 0 }}>
      <HeaderBar
        primaryActionIcon={<BackIcon size={32} />}
        backOnPress={() => navigation.goBack()}
        title=""
        secondaryActionIcon={auth().currentUser!.uid === user.id ? <LogOutIcon /> : undefined}
        secondaryActionOnPress={auth().currentUser!.uid === user.id ? () => auth().signOut() : undefined}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ width: '100%', paddingTop: 96, paddingHorizontal: 16 }}
        contentContainerStyle={{ paddingBottom: 96 }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            gap: 16,
            marginBottom: 32,
          }}>
          <ProfilePicture
            photoURL={user.photoURL}
            size={64}
          />
          <View style={{ flexDirection: 'column' }}>
            <Text>
              <Text style={[FontsStyles.h2, FontsStyles.weightRegular]}>{user.displayName}</Text>
              {user.verified && (
                <View style={{ paddingHorizontal: 6 }}>
                  <TickIcon size={20} />
                </View>
              )}
            </Text>

            {user.verified ? (
              <Text style={[FontsStyles.h3, FontsStyles.weightLight]}>Verifikovana organizacija</Text>
            ) : (
              <Text style={[FontsStyles.h3, FontsStyles.weightLight]}>
                {user.level}. nivo / {user.xp} XP
              </Text>
            )}
          </View>
        </View>

        {user.id !== auth().currentUser?.uid && (
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',

              padding: 16,
              borderRadius: 100,
              gap: 8,
              backgroundColor: currentUser.value.following.includes(user.id) ? COLORS.gold : '#cccccc',
              marginVertical: 16,
            }}
            onPress={() => {
              followUser(user.id);
            }}>
            {currentUser.value.following.includes(user.id) ? (
              <>
                <FriendsIconBlack size={24} />
                <Text style={[FontsStyles.h3, FontsStyles.weightRegular]}>Otprati</Text>
              </>
            ) : (
              <>
                <PlusIcon size={24} />
                <Text style={[FontsStyles.h3, FontsStyles.weightRegular]}>Zaprati</Text>
              </>
            )}
          </TouchableOpacity>
        )}

        {userPosts.map((post) => (
          <PostComponent
            key={post.id}
            post={post}
          />
        ))}
      </ScrollView>
    </LayoutView>
  );
};
