// IMPORT REACT AND NECESSARY HOOKS
import React, { useState, useEffect } from 'react';
// IMPORT FIRESTORE FROM REACT NATIVE FIREBASE
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
// IMPORT REACT NATIVE COMPONENTS
import { ScrollView, Text, TextInput, TouchableOpacity, View, ActivityIndicator, Keyboard } from 'react-native';
// IMPORT CUSTOM COMPONENTS AND STYLES
import { LayoutView } from '../views/LayoutView';
import HeaderBar from '../components/HeaderBar';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import { selectUser } from '../state/userSlice';
import { FontsStyles } from '../Styles';
import COLORS from '../utils/constants/COLORS';
import { BackIcon } from '../icons/BackIcon';
import { PersonIconBlack } from '../icons/PersonIconBlack';
import { SearchIcon } from '../icons/SearchIcon';
import { TickIcon } from '../icons/TickIcon';
import { ProfilePicture } from '../components/ProfilePicture';

// FRIENDS SCREEN COMPONENT
export const FriendsScreen: React.FC<NativeStackScreenProps<any, any>> = ({ navigation }) => {
  // SELECT USER FROM REDUX STORE
  const user = useSelector(selectUser);

  // STATE FOR FRIENDS LIST (FETCHED FROM FIRESTORE)
  const [friends, setFriends] = useState<User[]>([]);

  // STATE FOR SEARCH TEXT
  const [searchText, setSearchText] = useState('');
  // STATE FOR SEARCH RESULTS
  const [searchResults, setSearchResults] = useState<FirebaseFirestoreTypes.DocumentData[]>([]);
  // STATE TO TRACK TYPING DELAY
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  // STATE TO TRACK SEARCHING STATUS
  const [isSearching, setIsSearching] = useState(false);

  // FETCH FRIENDS' DETAILS FROM FIRESTORE
  useEffect(() => {
    const fetchFriends = async () => {
      if (!user?.value?.following || user.value.following.length === 0) {
        setFriends([]);
        return;
      }

      try {
        // Fetch friend details from Firestore
        const friendPromises = user.value.following.map(async (friendId: string) => {
          const userDoc = await firestore().collection('users').doc(friendId).get();
          if (userDoc.exists) {
            const data = userDoc.data();
            return data;
          }
          return null;
        });

        // Resolve all promises and remove null values
        const friendData = await Promise.all(friendPromises);
        setFriends(friendData);
      } catch (error) {
        console.error('Error fetching friends:', error);
      }
    };

    fetchFriends();
  }, [user?.value?.following]); // Runs whenever following list updates

  // FUNCTION TO SEARCH USERS IN FIRESTORE
  const searchUsers = async (text: string) => {
    setIsSearching(true);
    Keyboard.dismiss();
    setTimeout(async () => {
      try {
        console.log('Searching for:', text);
        const trimmedText = text.trim().toLowerCase();
        if (!trimmedText) {
          setSearchResults([]);
          setIsSearching(false);
          return;
        }

        // Fetch all users from Firestore
        const allUsersSnapshot = await firestore().collection('users').get();
        const allUsers = allUsersSnapshot.docs.map((doc) => {
          const data = doc.data();
          return { id: doc.id, displayName: data.displayName || '', level: data.level || 1, ...data };
        });

        // Filter users locally based on `displayName`
        const filteredUsers = allUsers
          .filter((user) => user.displayName.toLowerCase().includes(trimmedText))
          .map((user) => ({ ...user, level: user.level || 1 }));

        console.log('Filtered results:', filteredUsers);
        setSearchResults(filteredUsers);
      } catch (error) {
        console.error('Error searching users: ', error);
      } finally {
        setIsSearching(false);
      }
    }, 1000);
  };

  // HANDLE SEARCH INPUT CHANGE WITH DEBOUNCE
  const handleSearchChange = (text: string) => {
    setSearchText(text);

    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    // Wait for 1.5 seconds after typing stops before triggering search
    const timeout = setTimeout(() => {
      searchUsers(text);
    }, 1500);

    setTypingTimeout(timeout);
  };

  return (
    <LayoutView style={{ padding: 0, margin: 0 }}>
      {/* HEADER BAR COMPONENT */}
      <HeaderBar
        actions={true}
        title="Prijatelji"
      />

      {/* SCROLL VIEW FOR FRIENDS LIST */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ width: '100%', paddingTop: 120, paddingHorizontal: 16 }}>
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: 10,
            marginVertical: 7,
          }}>
          <View>
            <Text style={[FontsStyles.h3, FontsStyles.weightLight]}>Pronađite svoje prijatelje i dodajte ih!</Text>
          </View>

          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              gap: 4,
              backgroundColor: COLORS.secondary,
              borderRadius: 40,
              paddingHorizontal: 6,
            }}>
            <SearchIcon
              size={24}
              style={{ marginLeft: 10 }}
            />
            {/* SEARCH INPUT */}
            <TextInput
              style={[
                FontsStyles.h3,
                FontsStyles.weightLight,
                {
                  flex: 1,
                  height: 50,
                  paddingHorizontal: 10,
                  backgroundColor: 'transparent',
                  opacity: isSearching ? 0.5 : 1,
                },
              ]}
              placeholder="Search..."
              value={searchText}
              onChangeText={handleSearchChange}
              editable={!isSearching}
            />
            {isSearching && (
              <ActivityIndicator
                size={26}
                color={COLORS.black}
                style={{ marginRight: 10 }}
              />
            )}
          </View>
        </View>

        {/* CONDITIONAL RENDERING FOR SEARCH RESULTS OR FRIENDS LIST */}
        {searchResults.length > 0 ? (
          // RENDER SEARCH RESULTS
          searchResults.map((result, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => navigation.navigate('/profile', { user: result })}
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: 16,
                paddingVertical: 16,
                backgroundColor: COLORS.secondary,
                borderRadius: 16,
                marginBottom: 8,
              }}>
              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 12 }}>
                <ProfilePicture
                  photoURL={result.photoURL}
                  size={48}
                />
                <View style={{ flexDirection: 'column' }}>
                  <Text>
                    <Text style={[FontsStyles.weightMedium, FontsStyles.h2]}>{result.displayName}</Text>
                    {result.verified && (
                      <View style={{ paddingHorizontal: 6 }}>
                        <TickIcon size={20} />
                      </View>
                    )}
                  </Text>
                  {result.verified ? (
                    <Text style={[FontsStyles.weightLight, FontsStyles.h3]}>Verifikovana organizacija</Text>
                  ) : (
                    <Text style={[FontsStyles.weightLight, FontsStyles.h3]}>
                      {result.level}. nivo / {result.xp} XP
                    </Text>
                  )}
                </View>
              </View>
              <BackIcon
                size={32}
                style={{ transform: [{ rotate: '180deg' }] }}
              />
            </TouchableOpacity>
          ))
        ) : friends.length !== 0 ? (
          // RENDER FRIENDS LIST
          friends.map((friend, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => navigation.navigate('/profile', { user: friend })}
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: 16,
                paddingVertical: 16,
                backgroundColor: COLORS.secondary,
                borderRadius: 16,
                marginBottom: 8,
              }}>
              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 12 }}>
                <ProfilePicture
                  photoURL={friend.photoURL}
                  size={48}
                />
                <View style={{ flexDirection: 'column' }}>
                  <Text>
                    <Text style={[FontsStyles.weightMedium, FontsStyles.h2]}>{friend.displayName}</Text>
                    {friend.verified && (
                      <View style={{ paddingHorizontal: 6 }}>
                        <TickIcon size={20} />
                      </View>
                    )}
                  </Text>
                  {friend.verified ? (
                    <Text style={[FontsStyles.weightLight, FontsStyles.h3]}>Verifikovana organizacija</Text>
                  ) : (
                    <Text style={[FontsStyles.weightLight, FontsStyles.h3]}>
                      {friend.level}. nivo / {friend.xp} XP
                    </Text>
                  )}
                </View>
              </View>
              <BackIcon
                size={32}
                style={{ transform: [{ rotate: '180deg' }] }}
              />
            </TouchableOpacity>
          ))
        ) : (
          <View style={{ alignItems: 'center', paddingTop: 150 }}>
            <PersonIconBlack size={90} />
          </View>
        )}
      </ScrollView>
    </LayoutView>
  );
};
